const express = require('express');
const router = express.Router();
const userRouter = require('./user.js');
const postRouter = require('./post.js');

router.use('/', userRouter);
router.use('/posts', postRouter);

module.exports = router;
