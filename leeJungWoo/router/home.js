const express = require('express');
const {
  getPost,
  getPostById,
  createUser,
  createPost,
  login,
} = require('../controller.js');

const router = express.Router();

router.get('/', getPost);

router.get('/:id', getPostById);

router.post('/join', createUser);

router.post('/', createPost);

router.post('/login', login);

module.exports = router;
