const express = require('express');
const {
  increaseLike,
  updatePostContent,
  deletePostById,
} = require('../controller/controller.js');
const { validation, isAvailable } = require('../middleware/validation.js');

const router = express.Router();

router.patch('/:id', validation, isAvailable, updatePostContent);

router.delete('/:id', validation, isAvailable, deletePostById);

router.post('/:id', validation, increaseLike);

module.exports = router;
