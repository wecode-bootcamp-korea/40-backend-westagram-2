const express = require('express');
const router = express.Router();
const homeRouter = require('./home.js');
const postRouter = require('./post.js');

router.use('/', homeRouter);
router.use('/posts', postRouter);

module.exports = router;
