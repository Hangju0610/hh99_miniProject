const express = require('express');
const router = express.Router();
const listRouter = require('./listsRoutes.js')

router.use('/lists', listRouter);


module.exports = router;