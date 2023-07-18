const express = require('express');
const { Users, RefreshTokens } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const router = express.Router();

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    // 동일 이메일 찾기
    const isExistUser = await Users.findOne({ where: { email } });

    // 동일 이메일이 있는 경우
    if (isExistUser)
      return res.status(403).json({ errorMessage: '존재하는 Eamil입니다.' });

    // 비밀번호 암호화
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    // User 생성
    await Users.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: '회원가입 완료!' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: '오류가 발생하였습니다.' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    // req.body 값 받아오기
    const { email, password } = req.body;
    // user 찾기
    const findUser = await Users.findOne({ where: { email } });
    if (!findUser)
      return res
        .status(400)
        .json({ errorMessage: '이메일 혹은 비밀번호를 확인해주세요.' });

    // 비밀번호 일치 확인
    const validPassword = await bcrypt.compare(password, findUser.password);
    if (!validPassword)
      return res
        .status(400)
        .json({ errorMessage: '이메일 혹은 비밀번호를 확인해주세요.' });

    // JWT accessToken 발급
    const accessToken = jwt.sign(
      { userId: findUser.userId },
      process.env.JWT_ACCESS,
      { expiresIn: '10s' }
    );
    // JWT RefrshToken 발급
    const refreshToken = jwt.sign({}, process.env.JWT_REFRESH, {
      expiresIn: '3h',
    });

    // refreshToken DB에 전달
    const findRefreshToken = await RefreshTokens.findOne({
      where: { userId: findUser.userId },
    });
    // Db에 토큰이 이미 저장되어 있다면
    if (findRefreshToken) {
      await RefreshTokens.update(
        { refreshToken },
        { where: { userId: findUser.userId } }
      );
      // DB에 토큰이 없다면
    } else {
      await RefreshTokens.create({ userId: findUser.userId, refreshToken });
    }
    // 토큰 보내기
    res.cookie('accessToken', `Bearer ${accessToken}`);
    res.cookie('refreshToken', `Bearer ${refreshToken}`);

    res.status(200).json({ message: '로그인 성공!' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: '오류가 발생하였습니다.' });
  }
});

module.exports = router;
