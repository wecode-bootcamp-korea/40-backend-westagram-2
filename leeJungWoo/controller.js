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
  const { title, content } = req.body;
  const id = req.params.id;
  try {
    await myDatasource.query(
      `INSERT INTO posts(
        title,
        content,
        user_id
      ) VALUES (?, ?, ?)`,
      [title, content, id]
    );
    res.status(201).json({ message: 'postCreated!' });
  } catch {
    res.status(400).json({ message: 'check ur title, content' });
  }
}
