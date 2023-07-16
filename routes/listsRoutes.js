const express = require('express');
const { Lists } = require('../models')
const router = express.Router();

// List 전체 조회 
router.get('', async (req, res) => {
  console.log('List 전체 조회 API에 접속했습니다.')
  try {
    // 1. sequelize를 통해 전체 조회
    const items = await Lists.findAll({
      // 2. 데이터 손질
      attributes: { exclude: [ 'content']}
    })
    // 3. response로 보내기
    res.status(200).json({lists: items})
  } catch (err) {
    res.status(400).json({ errorMessage: '리스트 조회에 실패하였습니다.'})
  }
})

// List 상세 페이지 조회
router.get('/detail/:listId', async (req, res) => {
  console.log('List 상세 페이지 조회 API에 접속했습니다.')
  try {
    const { listId } = req.params; 
    const numberId = Number(listId)
    // 1. 데이터 조회
    const isExistList = await Lists.findOne({where: {listId: numberId}})

    // 1-1 데이터가 없는 경우 에러 출력
    if (!isExistList) {
        res.status(404).json({ errorMessage: '없는 리스트입니다.'})
        return
    }

    console.log(isExistList)
    
    // 2. 데이터 손질
    // 3. response로 보내기
    res.status(200).json({list : isExistList});
    
  } catch (err) {
    res.status(400).json({errorMessage : '리스트 조회에 실패했습니다.'})
    return
  }
})


// List 생성
router.post('', async (req, res) => {
  console.log('List 생성 API에 접속했습니다.')
  const {title, content} = req.body
  try {
  // 1. req.body 데이터 유효성 검사
    if (!title || !content) {
        res.status(412).json({ errorMessage: '데이터 형식이 올바르지 않습니다.'})
        return
    }
  // 2. DB에 데이터 입력
    await Lists.create({
        title: title,
        content: content
    })
    res.status(201).json({ message: 'List 작성 완료!'})
  } catch (err) {
    res.status(400).json({ errorMessage: '리스트 생성에 실패했습니다.'})
    return
  }
})

// List 상세 페이지 수정
router.put('/:listId', async (req, res) => {
  console.log('List 상세 페이지 수정 API에 접속했습니다.')
  const {title, content} = req.body
  const {listId} = req.params
    try {
      // 1. 데이터 조회
      const isExistList = await Lists.findOne({where: {listId}})

      // 1-1 데이터가 없는 경우 에러 출력
      if (!isExistList) {
        res.status(404).json({ errorMessage: '없는 리스트입니다.'})
        return
      }

      // 2. req.body 데이터 유효성 검사
      if (!title || !content) {
        res.status(412).json({ errorMessage: '데이터 형식이 올바르지 않습니다.'})
        return
      }

        // 3. DB에 데이터 수정
        const updatedResult 
        = await Lists.update(
                        {title, content},
                        {where: {listId}}
                        )

        // 4. response로 message 보내기
        if (updatedResult[0] === 1) {
            res.status(200).json({ message: 'List 수정 완료!'})
        } else {
            res.status(401).json({ errorMessage: '리스트가 정상적으로 수정되지 않았습니다.'})
            return
        }
    } catch (err) {
        res.status(400).json({ errorMessage: '리스트 수정에 실패하였습니다.'})
        return
    }

})

// List 삭제
router.delete('/:listId', async (req, res) => {
  try {
    // 1. list 데이터 조회
    const { listId } = req.params
    const isExistList = await Lists.findOne({where: {listId}})

    // 1-1 list 데이터 없는 경우 에러
    if (!isExistList) {
      res.status(404).json({ errorMessage: '없는 리스트입니다.'})
      return
    }

    // 2. 데이터 삭제 진행
    const deleteResult = await Lists.destroy(
      { where: { listId } }
    );
    // 2-1 데이터 삭제가 제대로 되지 않는 경우
    if (deleteResult === 1) {
      // 3. response 출력
      res.status(200).json({ message: 'List 삭제 완료!' })
    } else {
      res.status(401).json({ errorMessage: '리스트가 정상적으로 삭제되지 않았습니다.' })
      return
    }
  } catch (err) {
      res.status(400).json({ errorMessage: '리스트 삭제에 실패하였습니다.'})
      return
  }
});

// List 완료
router.put('/:listId/isDone', async (req, res) => {
  // 2-1 
  const {listId} = req.params
  try {
    // 1. list 데이터 조회
    const isExistList = await Lists.findOne({where: {listId}})

    // 1-1 데이터 없는 경우 에러 발생
    if(!isExistList) {
      res.status(404).json({ errorMessage: '없는 리스트입니다.'})
      return
    }

    // 2. isDone 변수 설정
    const updatedisDone = !isExistList.isDone
    
    // 2-1. isDone 데이터 변경 진행
    const updatedResult = 
      await Lists.update(
        {isDone: updatedisDone},
        {where: {listId: listId}}
      )

    // 3. 리스트 상태변경 체크 
    if (updatedResult[0] !== 1) {
      res.status(401).json({ errorMessage: '리스트 상태변경이 실패하였습니다.'})
    }

    // 4. 데이터 변경 완료 판단여부
    if (isExistList.isDone) {
      res.status(200).json({ message: 'List 완료!'})
    } else {
      res.status(200).json({ message: 'List 완료 취소!'})
    }
  } catch (err) {
      res.status(400).json({ errorMessage: '오류가 발생하였습니다.'})
      return
  }
});


module.exports = router;
