const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { getPostByPostId } = require('../models/postDao.js');

dotenv.config();

const validation = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Invalid Access Token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.COOKIE_SECRET);
    if (decoded) {
      req.data = decoded.id;
      next();
    }
  } catch (err) {
    return res.status(403).json({ message: 'Invalid Access Token' });
  }
};

const isAvailable = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.data;
  try {
    const data = await getPostByPostId(postId);
    console.log(data);
    if (userId === data[0].userId) {
      next();
    } else {
      throw new Error();
    }
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: 'NOT_AVAILABLE' });
  }
};

module.exports = {
  validation,
  isAvailable,
};
