const express = require('express');
const { getUsers, register, login, logout } = require('../controllers/Users');
const authMiddleware = require('../middlewares/authMiddleware');
const refreshToken = require('../controllers/RefreshToken');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ status: 200, message: 'Welcome to SmartBite API' });
});

// users endpoint
router.get('/users/:uuid', authMiddleware, getUsers);

// Autentikasi
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/token', refreshToken);

router.use((req, res, next) => {
  res.status(404).json({
      error: "Not Found",
      message: "The requested endpoint does not exist."
  });
});
module.exports = router;