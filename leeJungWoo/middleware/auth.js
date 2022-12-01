const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authorization = (req, res, next) => {
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

module.exports = {
  authorization,
};
