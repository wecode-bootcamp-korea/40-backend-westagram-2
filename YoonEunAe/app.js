const http = require ("http");

const dotenv = require("dotenv");
dotenv.config();
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

const app = express()

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

const server = http.createServer(app)
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`)
)}

start()