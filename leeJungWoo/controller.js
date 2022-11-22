import { myDatasource } from './app.js';

export async function createUser(req, res, next) {
  const { name, email, profile_image, password } = req.body;
  try {
    await myDatasource.query(
      `INSERT INTO users(
      name,
      email,
      profile_image,
      password
    ) VALUES (?, ?, ?, ?);`,
      [name, email, profile_image, password]
    );
    res.status(201).json({ message: 'user_created!' });
  } catch {
    res.status(400).json({ message: 'check your name, email, password ' });
  }
}

export async function createPost(req, res, next) {
  const { title, content, postImage } = req.body;
  const id = req.params.id;
  try {
    await myDatasource.query(
      `INSERT INTO posts(
        title,
        content,
        user_id,
        post_image
      ) VALUES (?, ?, ?, ?)`,
      [title, content, id, postImage]
    );
    res.status(201).json({ message: 'postCreated!' });
  } catch {
    res.status(400).json({ message: 'check ur title, content' });
  }
}

export async function getPost(req, res, next) {
  try {
    const data = await myDatasource.query(
      `SELECT p.user_id as userId, u.profile_image as userProfileImage, p.id as postingId, p.post_image as postingImageUrl, p.content as postingContent from posts p inner join users u on p.user_id = u.id`,
      (err, rows) => {
        res.status(200).json(rows);
      }
    );
  } catch {
    res.status(500).json({ message: 'sry something went wrong' });
  }
}
