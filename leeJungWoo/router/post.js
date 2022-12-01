const express = require('express');
const {
  updatePostContent,
  deletePostById,
  increaseLike,
  uploadPost,
  getPost,
  getPostByUserId,
} = require('../controller/postController.js');
const { authorization } = require('../middleware/auth.js');

const router = express.Router();

router.patch('/:id', authorization, updatePostContent);

router.delete('/:id', authorization, deletePostById);

router.post('/:id', authorization, increaseLike);

router.post('/', authorization, uploadPost);

router.get('/', getPost);

router.get('/:id', getPostByUserId);

module.exports = router;
