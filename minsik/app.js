const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const PORT = process.env.PORT;

const { DataSource } = require('typeorm');

const appDataSource = new DataSource({
    type : process.env.TYPEORM_CONNECTION,
    host : process.env.TYPEORM_HOST,
    port : process.env.TYPEORM_PORT,
    username : process.env.TYPEORM_USERNAME,
    password : process.env.TYPEORM_PASSWORD,
    database : process.env.TYPEORM_DATABASE
});

appDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    });

// Create New User
app.post("/signup", async (req, res, next) => {
    const { name, email, profileImage, password } = req.body

    await appDataSource.query(
        `INSERT INTO users(
            name,
            email,
            profile_image,
            password            
        ) VALUES ( ?, ?, ?, ? )
        `,
        [ name, email, profileImage, password ]
    );
    res.status(201).json({ message : "userCreated" });
});

// Create New Post
app.post("/addPost", async (req, res, next) => {
    const { title, content, userId } = req.body

    await appDataSource.query(
        `INSERT INTO posts(
            title,
            content,
            user_id    
        ) VALUES ( ?, ?, ? )
        `,
        [ title, content, userId ]
    );
    res.status(201).json({ message : "postCreated" });
});

// Create New Like
app.post("/newLike", async (req, res) => {
    const { userId, postId } = req.body

    await appDataSource.query(
        `INSERT INTO likes(
            likes_user,
            likes_post
        ) VALUES ( ${userId}, ${postId} )
    `
    );
    res.status(201).json({ message : "likeCreated" })    
})

// Get Numerical Feed Data
app.get("/getFeed", (req, res, next) => {
    
    appDataSource.query(
        `SELECT
                u.id AS userId,
                u.profile_image AS userProfileImage,
                p.id AS postingId,
                p.title AS postingTitle,
                p.content AS postingContent
            FROM 
                users AS u
            LEFT JOIN
                posts AS p ON u.id = p.id
        `
    )
    .then((row) => res.json(row))
});

// Get User AND the User's Posts Data
app.get("/getPostById/:id", (req, res, next) => {
    const id = req.params.id;
    appDataSource.query(
        `SELECT
                u.id AS userId,
                u.profile_image AS userProfileImage,
                JSON_ARRAYAGG(
                    JSON_OBJECT('postingId', p.id,'postingTitle',p.title,'postingContent',p.content)
                ) AS postings
            FROM
                users AS u
            LEFT JOIN
                posts AS p ON p.user_id = u.id
            WHERE
                u.id = ${id}
            GROUP BY u.id
        `
    )
    .then((row) => res.status(200).json(row))
});

// Update Post Content
app.patch("/updateContent", async (req, res, next) => {
    const { postId, content } = req.body

    await appDataSource.query(
        `UPDATE posts
            SET posts.content = "${content}"
                WHERE posts.id = ${postId}
        `
    )
    
    let data = await appDataSource.query(
        `SELECT
            u.name AS userId,
            u.name AS userName,
            p.id AS postingId,
            p.title AS postingTitle,
            p.content AS postingContent
        FROM
            users AS u
        LEFT JOIN 
            posts AS p ON u.id = p.id
        WHERE
            p.id = ${postId}
        `
    )
    res.status(200).json({ "data" : data })
})

// Delete Post
app.delete("/deletePostById/:id", async (req, res, next) => {
    const id = req.params.id;
    
    await appDataSource.query(
        `DELETE FROM
                posts
            WHERE
                posts.id = ${id}
        `
    )
    res.json({ message : "postingDeleted" })
})



const start = async () => {
    server.listen(PORT, () => console.log(`server is listening on ${PORT}`))
};

start ();