const jwt = require('jsonwebtoken');
const Users = require("../models/UserModel");

const refreshToken = async(req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(401).json({ status: 'unauthorized', message: 'Refresh token required' });
    const user = await Users.findOne({ where: { refreshToken } });
    if(!user) return res.status(401).json({ status: 'unauthorized', message: 'Invalid refresh token' });
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ status: 'unauthorized', message: 'Invalid refresh token' });
      const accessToken = jwt.sign({ UUID: user.UUID, name: user.name, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
      res.json({ accessToken });
    });
  }catch(error){
    console.log(error);
    res.status(500).json({ status: 'error', message: "Failed to refresh token" });
  }
}

module.exports = refreshToken;