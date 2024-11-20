const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ status: 'unauthorized', message: 'Authorization token required' });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ status: 'unauthorized', message: 'Invalid token' });
    next();
  });
};

module.exports = authMiddleware;