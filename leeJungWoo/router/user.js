const express = require('express');
const { signUp, login } = require('../controller/userController.js');

const router = express.Router();

router.post('/join', signUp);

router.post('/login', login);

module.exports = router;
