const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Ciudadano = sequelize.define("Ciudadano", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  IdDoc: {
    type: DataTypes.STRING,
    allowNull: false,
    indexes: [{unique: true}],
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    indexes: [{unique: true}],
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Ciudadano;