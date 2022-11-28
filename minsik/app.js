const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

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

// Create New Users
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

const start = async () => {
    server.listen(PORT, () => console.log(`server is listening on ${PORT}`))
};

start ();