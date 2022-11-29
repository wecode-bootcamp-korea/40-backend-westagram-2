const { createUser } = require('../models/userDao.js');

const signUpValidation = async (name, email, password, profile_image) => {
  const pwValidation = new RegExp(
    '^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$'
  );
  if (!pwValidation.test(password)) {
    const err = new Error('PASSWORD_IS_NOT_VALID');
    err.statusCode = 400;
    throw err;
  }
  const newUser = await createUser(name, email, password, profile_image);

  return newUser;
};

module.exports = {
  signUpValidation,
};
