const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

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

    const hashedPassword = await bcrypt.hash(password, 12);

    await appDataSource.query(
        `INSERT INTO users(
            name,
            email,
            profile_image,
            password            
        ) VALUES ( ?, ?, ?, ? )
        `,
        [ name, email, profileImage, hashedPassword ]
    );
    res.status(201).json({ message : "userCreated" });
});


// Login bcrypt verification
app.post("/login", async (req, res, next) => {
    const { email, password } = req.body
    
    const digest = await appDataSource.query(
        `SELECT password FROM users WHERE email = "${email}"`
    )

    const payLoad = { 
        email : email
    }
    
    const verified = await bcrypt.compare(password, digest[0].password)
    try {
        if (verified) {
            const accessToken = jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET);
            res.json({ acessToken : accessToken })
        }
    } catch (err) {
        res.status(500).json({ message : "Failed to verify user" })
    }
})

// VERIFY JWT (Middleware)
const verifyToken = (req, res, next) => {
    try {
        let authHeader = req.headers['authorization'];
        let token = authHeader.split(' ')[1]
        req.token = token;
        next();
    } catch (err) {
        res.status(401).json({ message : "Invalid Access Token" })
    }
}

// Create New Post
app.post("/addPost", verifyToken, async (req, res, next) => {
    const { title, content, userId } = req.body
    try{
        let verified = jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET);
        if (verified) {
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
        } 
    } catch (err) {
        res.status(403).json({ message : "Failed to Post" });
    }
   
    
});

// Create New Like
app.post("/newLike", async (req, res) => {
    const { userId, postId } = req.body

    await appDataSource.query(
        `INSERT INTO likes(
            user_id,
            post_id
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