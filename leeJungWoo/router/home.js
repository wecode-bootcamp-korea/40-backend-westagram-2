const express = require('express');
const {
  getPost,
  getPostById,
  uploadPost,
} = require('../controller/postController.js');
const { signUp, login } = require('../controller/userController.js');

const { validation } = require('../middleware/validation.js');

const router = express.Router();

router.get('/', getPost);

router.get('/:id', getPostById);

router.post('/join', signUp);

router.post('/', validation, uploadPost);

router.post('/login', login);

module.exports = router;
