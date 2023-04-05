const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Puesto = sequelize.define("Puesto", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  eleccionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Puesto;
