const { getPostByPostId } = require('../models/postDao');

const checkPostOwner = async (userId, postId) => {
  try {
    const data = await getPostByPostId(postId);
    if (userId === data[0].userId) {
      return true;
    } else {
      const error = new Error('NOT_ALLOWED');
      error.statusCode = 400;
      throw error;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  checkPostOwner,
};
