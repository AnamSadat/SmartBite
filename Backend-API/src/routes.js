const express = require('express');
const firebase = require('./config/dbConfig');
const { getUsers, register, login, logout } = require('./controllers/Users');
const authMiddleware = require('./middlewares/authMiddleware');
const refreshToken = require('./controllers/RefreshToken');
const router = express.Router();

router.get('/test', (req, res) => {
  res.status(200).json({ status: 200, message: 'Welcome to SmartBite API' });
});

// users endpoint
router.get('/users', authMiddleware, getUsers);
router.get('/users/:uuid', getUsers);

// Autentikasi
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/token', refreshToken);
  

module.exports = router;