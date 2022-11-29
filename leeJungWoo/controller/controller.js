const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signUpValidation } = require('../services/userService.js');
const {
  createPost,
  loginUser,
  getAllPost,
  getAllPostById,
  patchContent,
  getPostByPostId,
  deletePostByPostId,
  increasePostLikes,
} = require('../models/userDao.js');

const signUp = async (req, res, next) => {
  const { name, email, profile_image, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'WRONG_INPUT' });
  }
  try {
    await signUpValidation(name, email, password, profile_image);
    return res.status(201).json({ message: 'userCreated!' });
  } catch (err) {
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const uploadPost = async (req, res, next) => {
  const { title, content, postImage } = req.body;
  const id = req.data;
  if (!title || !content) {
    return res.status(400).json({ message: 'WRONG_INPUT' });
  }
  try {
    await createPost(id, title, content, postImage);
    return res.status(201).json({ message: 'postUploaded!' });
  } catch (err) {
    return res.status(err.statusCode).json(err.message);
  }
};

const getPost = async (req, res, next) => {
  try {
    const data = await getAllPost();
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const getPostById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await getAllPostById(id);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const updatePostContent = async (req, res, next) => {
  const { content } = req.body;
  const postId = req.params.id;

  if (!content) {
    return res.status(400).json({ message: 'WRONG_INPUT' });
  }
  try {
    await patchContent(postId, content);
    const data = await getPostByPostId(postId);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const deletePostById = async (req, res, next) => {
  const id = req.params.id;
  try {
    await deletePostByPostId(id);
    return res.status(200).json({ message: 'postDeleted!' });
  } catch (err) {
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const increaseLike = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.data;
  try {
    await increasePostLikes(userId, postId);
    return res.status(201).json({ message: 'likeCreated!' });
  } catch (err) {
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const login = async (req, res, next) => {
  const { id, password } = req.body;
  try {
    const user = await loginUser(id);
    if (user.length === 0) {
      return res.status(404).json({ message: 'INVALID_USER' });
    }
    const verified = await bcrypt.compare(password, user[0].password);
    if (!verified) {
      return res.status(400).json({ message: 'INVALID_USER' });
    }
    const token = jwt.sign({ id: user[0].id }, process.env.COOKIE_SECRET);
    return res.status(200).json({ accessToken: token });
  } catch (err) {
    return res.status(err.statusCode || 500).json(err.message);
  }
};

module.exports = {
  signUp,
  getPost,
  getPostById,
  updatePostContent,
  deletePostById,
  increaseLike,
  login,
  uploadPost,
};
