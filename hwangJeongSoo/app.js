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
//CRUD
app.post("/signup", async(req, res, next)=>{
    const { id, name, email, profile_image, password } = req.body


await myDataSource.query(
    `INSERT INTO users(
        id,
        name,
        email,
        profile_image,
        password
    ) VALUES (?, ?, ?, ?, ?);
    `,
    [ id, name, email, profile_image, password ]
); 
     res.status(201).json({ message : "successfully created"});
    })






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