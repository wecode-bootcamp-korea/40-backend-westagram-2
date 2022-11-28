const { DataSource } = require('typeorm');
const dotenv = require('dotenv');

dotenv.config();

const database = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

const createUser = (req, res, next) => {
  const { name, email, profile_image, password } = req.body;
  database
    .query(
      `INSERT INTO users(
      name,
      email,
      profile_image,
      password
    ) VALUES (?, ?, ?, ?);`,
      [name, email, profile_image, password]
    )
    .then(() => res.status(201).json({ message: 'user_created!' }))
    .catch((err) => res.status(400).json({ message: err.message }));
};

const createPost = (req, res, next) => {
  const { title, content, postImage } = req.body;
  const id = req.params.id;
  database
    .query(
      `INSERT INTO posts(
        title,
        content,
        user_id,
        post_image
      ) VALUES (?, ?, ?, ?)`,
      [title, content, id, postImage]
    )
    .then(() => res.status(201).json({ message: 'postCreated!' }))
    .catch((err) => res.status(400).json({ message: err.message }));
};

const getPost = (req, res, next) => {
  database
    .query(
      `SELECT
      p.user_id as userId, 
      u.profile_image as userProfileImage, 
      p.id as postingId, 
      p.post_image as postingImageUrl, 
      p.content as postingContent 
      FROM posts p 
      INNER JOIN users u 
      ON p.user_id = u.id`
    )
    .then((row) => res.status(200).json(row))
    .catch((err) => res.status(500).json({ message: err.message }));
};

const getPostById = (req, res, next) => {
  const id = req.params.id;
  database
    .query(
      `
  SELECT 
  u.id as userId, 
  u.profile_image as userProfileImage, 
  JSON_ARRAYAGG(
    JSON_OBJECT('postingId', p.id, 'postingImageUrl', p.post_image, 'postingContent', p.content)
    ) as postings 
    FROM users u 
    LEFT JOIN posts p 
    ON p.user_id = u.id 
    WHERE u.id = ${id} GROUP BY u.id`
    )
    .then((row) => res.status(200).json(row))
    .catch((err) => res.status(500).json({ message: err.message }));
};

const editPostContent = async (req, res, next) => {
  const { content } = req.body;
  const id = req.params.id;
  const finished = await database.query(
    `UPDATE posts 
    SET content = "${content}" 
    WHERE posts.id = ${id}`
  );
  if (finished) {
    database
      .query(
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
      )
      .then((row) => res.status(201).json(row))
      .catch((err) =>
        res.status(err.statusCode || 500).json({ message: err.message })
      );
  }
};

const deletePost = async (req, res, next) => {
  const id = req.params.id;
  const isExist = await database.query(
    `SELECT * FROM likes WHERE likes.post_id = ${id}`
  );
  if (isExist) {
    await database.query(`DELETE FROM likes WHERE likes.post_id = ${id}`);
  }
  database
    .query(`DELETE FROM posts WHERE posts.id = ${id}`)
    .then(() => res.status(200).json({ message: 'post deleted!' }));
};

const increaseLike = (req, res, next) => {
  const id = req.params.id;
  const user = req.query.user;
  database
    .query(
      `INSERT INTO 
      likes (user_id, post_id) 
      VALUES (
        (SELECT users.id FROM users WHERE users.id = ${user}), 
        (SELECT posts.id FROM posts WHERE posts.id = ${id})
        )`
    )
    .then(() => {
      res.status(200).json({ message: 'likeCreated!' });
    });
};

module.exports = {
  createUser,
  createPost,
  getPost,
  database: database,
  getPostById,
  editPostContent,
  deletePost,
  increaseLike,
};
