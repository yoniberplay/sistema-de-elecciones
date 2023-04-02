const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const EleccionPuesto = sequelize.define("EleccionPuesto", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = EleccionPuesto;