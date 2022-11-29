const http = require("http");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource, SimpleConsoleLogger } = require("typeorm");

const appDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
});

appDataSource.initialize().then(() => {
  console.log("Data Source has been initialized");
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/ping", (req, res) => {
  res.status(201).json({ message: "pong" });
});

app.post("/signup", async (req, res, next) => {
  const { name, email, profile_image, password } = req.body;

  await appDataSource.query(
    `INSERT INTO users(
      name,
      email,
      profile_image,
      password
    ) VALUES (?, ?, ?, ?);
`,
    [name, email, profile_image, password]
  );
  res.status(201).json({ message: "successfully created" });
});

app.post("/posts", async (req, res, next) => {
  const { title, content, user_id } = req.body;
  await appDataSource.query(
    `INSERT INTO posts(
    title,
    content,
    user_id
    ) VALUES (?, ?, ?);
    `,
    [title, content, user_id]
  );
  res.status(201).json({ message: "postCreated" });
});

app.get("/posts", async (req, res, next) => {
  await appDataSource.query(
    `
    SELECT 
      u.id as userId, 
      u.profile_Image as userProfileImage, 
      p.id as postingId,
      p.image_Url as postingImageUrl,
      p.content as postingContent
    FROM users as u 
    RIGHT JOIN posts as p ON p.id = u.id 
    ;`,
    (err, rows) => {
      res.status(201).json({ data: rows });
    }
  );
});

app.get("/posts/:id", async (req, res, next) => {
  const id = req.body;
  await appDataSource.query(
    `SELECT
      u.id as userID,
      u.profile_image as userProfileImage,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'PostingID', p.id,
          'postingImageUrl', p.image_url,
          'PostingContent',p.content
        )
      ) as postings
    FROM users u
    LEFT JOIN posts p ON p.user_id = u.id
    WHERE u.id = ${id}
    GROUP BY u.id`,
    function(err, rows) {
      res.status(200).json({ data: rows });
    }
  );
});

app.patch("/put", async (req, res) => {
  const { content, id } = req.body;
  await appDataSource.query(
    `UPDATE posts SET content = ? 
    WHERE id = ${id};`,
    [content]
  );
  await appDataSource.query(
    ` SELECT 
      u.id as userId, 
      u.profile_Image as userProfileImage, 
      p.id as postingId,
      p.image_Url as postingImageUrl,
      p.content as postingContent
    FROM users as u
    LEFT JOIN posts as p
    ON p.id = u.id 
    WHERE p.id = ${id} 
    ;`,
    (err, rows) => {
      res.status(201).json({ data: rows });
    }
  );
});

app.delete("/delete", async (req, res) => {
  const { id } = req.body;
  await appDataSource.query(`DELETE FROM posts WHERE id = ${id} `);
  res.status(200).json({ message: "postingDeleted" });
});

app.post("/likes", async (req, res, next) => {
  const { id, user_id, post_id } = req.body;

  await appDataSource.query(
    `INSERT INTO likes( 
      id,
      user_id,
      post_id
    ) VALUES (${id}, ${user_id},${post_id});
    `
  );
  res.status(201).json({ message: "likeCreated" });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start();
