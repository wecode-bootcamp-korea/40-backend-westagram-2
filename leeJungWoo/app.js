const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const {
  createPost,
  createUser,
  getPost,
  myDataSource,
  getPostById,
  editPostContent,
  deletePost,
} = require('./controller.js');

dotenv.config();

myDataSource.initialize().then(() => {
  console.log('connected!');
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

app.post('/users', createUser);
app.post('/posts/:id', createPost);
app.get('/', getPost);
app.get('/:id', getPostById);
app.patch('/posts/:id', editPostContent);
app.delete('/posts/:id', deletePost);

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
exports.myDataSource = myDataSource;
