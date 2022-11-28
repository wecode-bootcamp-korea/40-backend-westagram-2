const express = require('express');
const {
  editPostContent,
  deletePost,
  increaseLike,
} = require('../controller.js');

const router = express.Router();

router.patch('/:id', editPostContent);

router.delete('/:id', deletePost);

router.post('/:id', increaseLike);

module.exports = router;
