const { DataSource } = require('typeorm');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const database = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

database.initialize().then(() => {
  console.log('connected!');
});

const createUser = async (name, email, password, profile_image) => {
  try {
    const hashed = await bcrypt.hash(password, 10);
    return await database.query(
      `INSERT INTO users(
        name,
        email,
        profile_image,
        password
      ) VALUES (?, ?, ?, ?);`,
      [name, email, profile_image, hashed]
    );
  } catch (err) {
    console.log(err);
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

const loginUser = async (email) => {
  try {
    return await database.query(
      `SELECT * FROM users u WHERE u.email = '${email}'`
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createUser,
  loginUser,
  database,
};
