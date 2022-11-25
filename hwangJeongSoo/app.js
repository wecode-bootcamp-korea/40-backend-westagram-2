const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const dotenv = require("dotenv");
dotenv.config()

const { DataSource } = require('typeorm')

const myDataSource = new DataSource({
    type : process.env.TYPEORM_CONNECTION,
    host : process.env.TYPEORM_HOST,
    port : process.env.TYPEORM_PORT,
    username : process.env.TYPEORM_USERNAME,
    password : process.env.TYPEORM_PASSWORD,
    database : process.env.TYPEORM_DATABASE 
})

myDataSource.initialize() 
    .then(()=>{
        console.log("Data Source has been initialized")
    })

const app = express();

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.get("/ping", (req, res) =>{
	res.status(201).json({ message : "pong"});
    });


//2. signup
app.post("/signup", async(req, res, next)=>{
    const { name, email, profile_image, password } = req.body


await myDataSource.query(
    `INSERT INTO users(
        name,
        email,
        profile_image,
        password
    ) VALUES (?, ?, ?, ?);
    `,
    [ name, email, profile_image, password ]
); 
     res.status(201).json({ message : "successfully created"});
    })


//3. post 게시글 등록   api2
app.post("/posts", async(req, res, next)=>{
    const { title, content, user_id } = req.body


await myDataSource.query(
    `INSERT INTO posts(
        title,
        content,
        user_id
    ) VALUES (?, ?, ?);
    `,
    [ title, content, user_id]
); 
     res.status(201).json({ message : "postCreated"});
    })


//4. get전체 게시글 조회   api6

//5. get.use유저의 게시글 조회 api6
//6. 게시글 수정 ap4
//7. 게시글 삭제 api5
//8. 좋아요 누르기 api



const server = http.createServer(app)
const PORT = process.env.PORT;

const start = async () => {
	try{ 
        server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
}   catch (err) {
    console.error(err);
}
};

start()