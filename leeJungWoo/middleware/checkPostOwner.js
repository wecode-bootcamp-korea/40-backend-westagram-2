const { getPostByPostId } = require('../models/postDao');

const checkPostOwner = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.data;
  try {
    const data = await getPostByPostId(postId);
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
  checkPostOwner,
};
