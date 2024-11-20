const { Sequelize, DataTypes, UUIDV4 } = require("sequelize");
const db = require("../config/dbConfig");

const Users = db.define("users", {
  UUID: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  freezeTableName: true
});

module.exports = Users;