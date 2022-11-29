const http = require("http");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource, SimpleConsoleLogger } = require("typeorm");

const bcrypt = require("bcrypt");

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

  const salt_Rounds = 10;
  const hashed_Password = await bcrypt.hash(password, salt_Rounds);

  await appDataSource.query(
    `INSERT INTO users(
      name,
      email,
      profile_image,
      password
    ) VALUES (?, ?, ?, ?);
`,
    [name, email, profile_image, hashed_Password]
  );
  res.status(201).json({ message: "successfully created" });
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
