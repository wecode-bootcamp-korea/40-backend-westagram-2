const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { loginUser } = require('../models/userDao.js');
const { signUpValidation } = require('../services/userService.js');
const dotenv = require('dotenv');

dotenv.config();

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
  login,
  signUp,
};
