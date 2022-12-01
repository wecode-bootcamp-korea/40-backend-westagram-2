const {
  createPost,
  getAllPost,
  patchContent,
  getPostByPostId,
  deletePostByPostId,
  increasePostLikes,
  getAllPostByUserId,
} = require('../models/postDao.js');
const { checkPostOwner } = require('../services/postService.js');

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

const getPostByUserId = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await getAllPostByUserId(id);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const updatePostContent = async (req, res, next) => {
  const { content } = req.body;
  const postId = req.params.id;
  const userId = req.data;
  if (!content) {
    return res.status(400).json({ message: 'WRONG_INPUT' });
  }
  try {
    const isMatch = await checkPostOwner(userId, postId);
    if (isMatch) {
      await patchContent(postId, content);
      const data = await getPostByPostId(postId);
      return res.status(200).json(data);
    }
  } catch (err) {
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const deletePostById = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.data;

  try {
    const isMatch = await checkPostOwner(userId, postId);
    if (isMatch) {
      await deletePostByPostId(postId);
      return res.status(200).json({ message: 'postDeleted!' });
    }
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

module.exports = {
  getPost,
  getPostByUserId,
  updatePostContent,
  deletePostById,
  increaseLike,
  uploadPost,
};
