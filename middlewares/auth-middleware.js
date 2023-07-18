const { Users, RefreshTokens } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// AccessToken 유효성 검사
const validateAccessToken = (accessToken) => {
  try {
    const validateAccessTokenData = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS
    );
    // 인증될 경우 데이터 반환
    return validateAccessTokenData;
  } catch (error) {
    // 만료된 경우 false 반환
    return false;
  }
};

// RefreshToken 유효성 검사
const validateRefreshToken = function (refreshToken) {
  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH);
    // 인증된 경우 true 반환
    return true;
  } catch (error) {
    // 만료된 경우 false 반환
    return false;
  }
};

const jwtValidation = async (req, res, next) => {
  try {
    // 쿠키 받아오기
    const { accessToken, refreshToken } = req.cookies;
    // 토큰 타입 확인하기
    const [accessTokenType, accToken] = (accessToken ?? '').split(' ');
    const [refreshTokenType, refToken] = (refreshToken ?? '').split(' ');

    if (accessTokenType !== 'Bearer' || refreshTokenType !== 'Bearer') {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res
        .status(403)
        .json({ errorMessage: '로그인이 필요한 기능입니다.' });
    }

    // 토큰 검사
    const validateAccessTokenData = validateAccessToken(accToken);
    const validateRefreshTokenData = validateRefreshToken(refToken);

    //refreshToken이 만료된 경우
    if (!validateRefreshTokenData) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res
        .status(403)
        .json({ errorMessage: '로그인이 필요한 기능입니다.' });
    }

    //accessToken이 만료된 경우
    if (!validateAccessTokenData) {
      // DB에서 refresh 토큰 검증하기
      const findUser = await RefreshTokens.findOne({
        where: { refreshToken: refToken },
      });
      // 탈취를 당했거나, 고의적으로 만료된 경우
      if (!findUser) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res
          .status(403)
          .json({ errorMessage: '로그인이 필요한 기능입니다.' });
      }

      // AccessToken 새로 생성
      console.log('AccessToken 재발급');
      const newAccessToken = jwt.sign(
        { userId: findUser.userId },
        process.env.JWT_ACCESS,
        { expiresIn: '1m' }
      );
      // user 찾기
      const user = await Users.findOne({ where: { userId: findUser.userId } });
      if (!user) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res
          .status(403)
          .json({ errorMessage: '로그인이 필요한 기능입니다.' });
      }

      res.cookie('accessToken', `Bearer ${newAccessToken}`);
      res.locals.user = user;
      next();
    } else {
      // accessToken도 정상인 경우
      console.log('정상적인 경우');
      const user = await Users.findOne({
        where: { userId: validateAccessTokenData.userId },
      });

      if (!user) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res
          .status(403)
          .json({ errorMessage: '로그인이 필요한 기능입니다.' });
      }

      res.locals.user = user;
      next();
    }
  } catch (error) {
    console.log(error);
    res.clearcookie('accessToken');
    res.clearcookie('refreshToken');
    res.status(400).json({ errorMessage: '로그인이 필요한 기능입니다.' });
  }
};

module.exports = jwtValidation;
