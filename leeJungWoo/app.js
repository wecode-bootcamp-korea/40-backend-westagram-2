const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const homeRouter = require('./router/home.js');
const postRouter = require('./router/post.js');
const { database } = require('./controller.js');

dotenv.config();

database.initialize().then(() => {
  console.log('connected!');
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

app.use('/', homeRouter);

app.use('/posts', postRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: 'something went wrong' });
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
