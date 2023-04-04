const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Votos = sequelize.define("Votos", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  EleccionesId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CiudadanoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CandidatoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PuestoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Votos;