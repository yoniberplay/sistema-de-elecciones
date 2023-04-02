const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Candidato = sequelize.define("Candidato", {
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
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PartidoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PuestoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imgPerfil: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Candidato;
