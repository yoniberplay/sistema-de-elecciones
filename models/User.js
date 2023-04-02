const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("user", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name:  {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName:  {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    indexes: [{unique: true}],
  },
  userName:  {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status:  {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = User;