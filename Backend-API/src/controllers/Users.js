const Users = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const getUsers = async (req, res) => {
  const uuid = req.params.uuid || null;
  try {
    const users = uuid ? await Users.findOne({ where: { UUID: uuid } }) : await Users.findAll();
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Failed to fetch users" });
  }
};

const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ status: 'error', message: 'Password and confirm password do not match' });
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const user = await Users.create({
      name,
      email,
      password: hashedPassword
    });
    res.status(201).json({ status: 'success', message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Failed to create user" });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  try{
    const user = await Users.findOne({ where: { email } });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) return res.status(400).json({ status: 'error', message: 'Invalid password' });
    const {UUID, name} = user;
    const accessToken = jwt.sign({ UUID, name, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
    const refreshToken = jwt.sign({ UUID, name, email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    console.log(refreshToken);
    await Users.update({ refreshToken }, { where: { UUID } });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true
    });
    res.json({accessToken})
  }catch(error){
    console.log(error);
    res.status(500).json({ status: 'error', message: "Failed to login" });
  }
}

const logout = async(req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.sendStatus(204);
  const user = await Users.findOne({ where: { refreshToken } });
  if(!user) return res.sendStatus(204);
  await Users.update({ refreshToken: null }, { where: { UUID: user.UUID } });
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
}

module.exports = {
  getUsers,
  register,
  login,
  logout
};