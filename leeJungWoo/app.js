const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { DataSource } = require('typeorm');

dotenv.config();

const mysqlDatasource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});
mysqlDatasource
  .initialize() //
  .then(() => {
    console.log('connected!');
  });

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

app.post('/users', async (req, res, next) => {
  const { name, email, profile_image, password } = req.body;
  try {
    await mysqlDatasource.query(
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
});

const PORT = process.env.PORT;

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`server started at ${PORT}`);
    });
  } catch {
    console.error(err);
  }
};

start();
