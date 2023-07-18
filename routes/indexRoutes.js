const express = require('express');
const router = express.Router();
const listRouter = require('./listsRoutes.js');
const userRouter = require('./usersRoutes.js');

router.use('/lists', listRouter);
router.use('/user', userRouter);

module.exports = router;
