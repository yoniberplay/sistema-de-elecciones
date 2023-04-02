const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Partido = sequelize.define("Partido", {
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
  description: {
    type: DataTypes.STRING,
    allowNull: false,
},
  imgLogo: {
    type: DataTypes.STRING,
    allowNull: false,
},
  status:  {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Partido;