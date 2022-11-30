const http = require ("http");

require('dotenv').config();
const express = require ("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require('typeorm');

const mysqlDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
}); 

mysqlDataSource.initialize()
      .then(() => { 
        console.log("Data Source has been initialized!")
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

app.post("/users", async (req, res, next) => {
	const { name, email, profile_image, password } = req.body
    
	await mysqlDataSource.query(
		`INSERT INTO users(
      name, 
      email,
      profile_image,
      password
		) VALUES (?, ?, ?, ?);
		`,
		[ name, email, profile_image, password ]
	); 
     res.status(201).json({ message : "userCreated" });
})

app.post("/posts", async (req, res, next) => {
	const { title, image_url, content, user_id } = req.body
    
	await mysqlDataSource.query(
		`INSERT INTO posts(
      title,
      image_url,
      content,
      user_id
		) VALUES (?, ?, ?, ?);
		`,
		[ title, image_url, content, user_id ]
	); 
     res.status(201).json({ message : "postCreated" });
})

app.post("/likes", async (req, res, next) => {
	const { user_id, post_id } = req.body
    
	await mysqlDataSource.query(
		`INSERT INTO likes(
      user_id,
      post_id
		) VALUES (?, ?);
		`,
		[ user_id, post_id ]
	); 
     res.status(201).json({ message : "likeCreated" });
})

app.get("/posts", async(req, res) => {
   await mysqlDataSource.query(
     `SELECT 
      p.id as postingID,
      p.title as postingTitle,
      p.content as postingContent,
      u.id as userId,
      p.image_url as postingImageUrl,
      u.profile_image as userProfileImage
    FROM posts p, users u
    WHERE p.user_id = u.id
  `,(err, rows) => {
  res.status(200).json(rows);
  });
});

app.get("/posts/:userId", async(req,res) => {
  const{ userId } = req.params;

  const posts = await mysqlDataSource.query(
    `SELECT
    u.id as userId,
    u.profile_image as userProfileImage,
    p.id as postingId,
    p.image_url as postingImageUrl,
    p.content as postingContent
  FROM posts p
  JOIN users u ON p.user_id = u.id
  WHERE p.user_id = ?
` , [ userId ])
res.status(200).json(posts);
})


app.patch("/posts", async(req, res) => {
  const { title, image_url, content, postId } = req.body
  
  await mysqlDataSource.query(
    `UPDATE posts
    SET
      title = ?,
      image_url = ?,
      content = ?
      WHERE id = ?
      `,
      [ title, image_url, content, postId ]
  );
  res.status(201).json({ message : "successfully updated" });
});

app.delete("/posts/:postId", async(req, res) => {
  const { postId } = req.params;
  
  await mysqlDataSource.query(
    `DELETE FROM posts
    WHERE posts.id = ${postId}
    `);
  
  res.status(200).json({ message : "postingDeleted" });
});

const server = http.createServer(app)
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`)
)}

start()
