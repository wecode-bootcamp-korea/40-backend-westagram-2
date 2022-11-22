const { DataSource } = require('typeorm');
const dotenv = require('dotenv');

dotenv.config();

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

function createUser(req, res, next) {
  const { name, email, profile_image, password } = req.body;
  myDataSource
    .query(
      `INSERT INTO users(
      name,
      email,
      profile_image,
      password
    ) VALUES (?, ?, ?, ?);`,
      [name, email, profile_image, password]
    )
    .then(() => {
      res.status(201).json({ message: 'user_created!' });
    })
    .catch(() => {
      res.status(400).json({ message: 'check your name, email, password ' });
    });
}

function createPost(req, res, next) {
  const { title, content, postImage } = req.body;
  const id = req.params.id;
  myDataSource
    .query(
      `INSERT INTO posts(
        title,
        content,
        user_id,
        post_image
      ) VALUES (?, ?, ?, ?)`,
      [title, content, id, postImage]
    )
    .then(() => {
      res.status(201).json({ message: 'postCreated!' });
    })
    .catch(() => {
      res.status(400).json({ message: 'check ur title, content' });
    });
}

function getPost(req, res, next) {
  myDataSource
    .query(
      `SELECT p.user_id as userId, u.profile_image as userProfileImage, p.id as postingId, p.post_image as postingImageUrl, p.content as postingContent from posts p inner join users u on p.user_id = u.id`
    )
    .then((row) => {
      res.status(200).json(row);
    })
    .catch(() => {
      res.status(500).json({ message: 'sry something went wrong' });
    });
}

function getPostById(req, res, next) {
  const id = req.params.id;
  myDataSource
    .query(
      `
  SELECT u.id as userId, u.profile_image as userProfileImage, JSON_ARRAYAGG(JSON_OBJECT('postingId', p.id, 'postingImageUrl', p.post_image, 'postingContent', p.content)) as postings FROM users u INNER JOIN posts p ON p.user_id = u.id WHERE u.id = ${id} GROUP BY u.id`
    )
    .then((row) => {
      res.status(200).json(row);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'sry something went wrong..' });
    });
}
module.exports = {
  createUser,
  createPost,
  getPost,
  myDataSource: myDataSource,
  getPostById,
};
