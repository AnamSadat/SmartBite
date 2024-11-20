const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

dotenv.config();
const route = require('./routes/routes');
const db = require('./config/dbConfig');
const Users = require('./models/UserModel');
const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({extended: true}));
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