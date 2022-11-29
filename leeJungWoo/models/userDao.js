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

const createPost = async (id, title, content, postImage) => {
  try {
    return await database.query(
      `INSERT INTO posts(
        title,
        content,
        user_id,
        post_image
      ) VALUES (?, ?, ?, ?)`,
      [title, content, id, postImage]
    );
  } catch (err) {
    console.log(err);
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

const loginUser = async (id) => {
  try {
    return await database.query(
      `SELECT * FROM users u WHERE u.email = '${id}'`
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

const getAllPost = async () => {
  try {
    return await database.query(
      `SELECT
      p.user_id as userId, 
      u.profile_image as userProfileImage, 
      p.id as postingId, 
      p.post_image as postingImageUrl, 
      p.content as postingContent 
      FROM posts p 
      INNER JOIN users u 
      ON p.user_id = u.id`
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

const getAllPostById = async (id) => {
  try {
    return await database.query(
      `SELECT 
      u.id as userId, 
      u.profile_image as userProfileImage, 
      JSON_ARRAYAGG(
      JSON_OBJECT('postingId', p.id, 'postingImageUrl', p.post_image, 'postingContent', p.content)
      ) as postings 
      FROM users u 
      LEFT JOIN posts p 
      ON p.user_id = u.id 
      WHERE u.id = ${id} GROUP BY u.id`
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

const patchContent = async (id, content) => {
  try {
    return await database.query(
      `UPDATE posts 
      SET content = "${content}" 
      WHERE posts.id = ${id}`
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

const getPostByPostId = async (id) => {
  try {
    return await database.query(
      `SELECT
      u.id as userId, 
      u.name as userName, 
      p.id as postingId, 
      p.title as postingTitle, 
      p.content as postingContent 
      FROM users u 
      INNER JOIN posts p 
      ON p.user_id = u.id 
      WHERE p.id = ${id}`
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

const deletePostByPostId = async (id) => {
  try {
    const isExist = await database.query(
      `SELECT * FROM likes WHERE likes.post_id = ${id}`
    );
    if (isExist) {
      await database.query(`DELETE FROM likes WHERE likes.post_id = ${id}`);
    }
    return await database.query(`DELETE FROM posts WHERE posts.id = ${id}`);
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

const increasePostLikes = async (userId, postId) => {
  try {
    await database.query(
      `INSERT INTO 
      likes (user_id, post_id) 
      VALUES (
        (SELECT users.id FROM users WHERE users.id = ${userId}), 
        (SELECT posts.id FROM posts WHERE posts.id = ${postId})
        )`
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createUser,
  createPost,
  loginUser,
  getAllPost,
  getAllPostById,
  patchContent,
  getPostByPostId,
  deletePostByPostId,
  increasePostLikes,
};
