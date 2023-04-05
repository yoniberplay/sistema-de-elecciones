const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Elecciones = sequelize.define("Elecciones", {
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
  fechaRealizacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
},
  status:  {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Elecciones;