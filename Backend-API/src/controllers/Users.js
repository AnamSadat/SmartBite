const Users = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Retrieves a user based on the provided UUID from the request parameters.
 * Responds with the user details including UUID, name, email, createdAt, and updatedAt.
 * If the user is found, responds with a status of 200 and the user data.
 * If an error occurs during retrieval, responds with a status of 500 and an error message.
 * 
 * @param {object} req - The request object, containing parameters and other data.
 * @param {object} res - The response object used to send back the desired HTTP response.
 */
const getUsers = async (req, res) => {
  const uuid = req.params.uuid || null;
  try {
    const user = await Users.findOne({ 
      attributes: ['UUID', 'name', 'email', 'createdAt', 'updatedAt'],
      where: { UUID: uuid }
    })
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Failed to fetch users" });
  }
};

/**
 * Creates a new user with the provided name, email, password and confirm password.
 * The password and confirm password must match, or a 400 status code will be returned.
 * The password is hashed before being stored in the database.
 * If the user is created successfully, responds with a status of 201 and a success message.
 * If an error occurs during creation, responds with a status of 500 and an error message.
 * 
 * @param {object} req - The request object, containing parameters and other data.
 * @param {object} res - The response object used to send back the desired HTTP response.
 */
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

/**
 * Authenticates a user based on provided email and password.
 * If authentication is successful, generates and returns an access token,
 * and sets a refresh token in a secure cookie. 
 * 
 * @param {object} req - The request object containing the user's email and password in the body.
 * @param {object} res - The response object used to send back the desired HTTP response.
 * 
 * @returns {object} - JSON response containing the access token if successful.
 *                     If the password is invalid, returns a 400 status with an error message.
 *                     If an error occurs during authentication, returns a 500 status with an error message.
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  try{
    const user = await Users.findOne({ where: { email } });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) return res.status(400).json({ status: 'error', message: 'Invalid password' });
    const {UUID, name} = user;
    const accessToken = jwt.sign({ UUID, name, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
    const refreshToken = jwt.sign({ UUID, name, email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
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

/**
 * Logs out the user by deleting the refresh token from the user's record.
 * Clears the refresh token cookie from the client.
 * 
 * @param {object} req - The request object containing the refresh token in a cookie.
 * @param {object} res - The response object used to send back the desired HTTP response.
 * 
 * @returns {object} - JSON response containing the status and message if successful.
 *                     If the refresh token is invalid, returns a 401 status with an error message.
 */
const logout = async(req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.status(401).json({ status: 'unauthorized', message: 'Refresh token not found. Login required' });
  const user = await Users.findOne({ where: { refreshToken } });
  if(!user) return res.status(401).json({ status: 'fail', message: 'User not found or invalid refresh token' });
  await Users.update({ refreshToken: null }, { where: { UUID: user.UUID } });
  res.clearCookie('refreshToken');
  return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
}

module.exports = {
  getUsers,
  register,
  login,
  logout
};