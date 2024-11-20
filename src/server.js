const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const route = require('./routes');
const authMiddleware = require('./middlewares/authMiddleware');
const db = require('./config/dbConfig');
const Users = require('./models/UserModel');
const cookieParser = require('cookie-parser');
const app = express();

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(route);

// Connect Sql
db.authenticate()
  .then(async () => {
    console.log('Database connected...');
    await Users.sync();
  })
  .catch(err => {
    console.log('Error: ' + err);
  });


app.listen(process.env['PORT'], () => {
  console.log("Server running on port " + process.env['PORT']);
});