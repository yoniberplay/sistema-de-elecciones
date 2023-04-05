const {Sequelize} = require("sequelize");
require('dotenv').config();

const ENV_DB_PASSWORD = process.env.DB_PASSWORD

const sequelize = new Sequelize("sistemaElecciones", "root", ENV_DB_PASSWORD, {
  dialect: "mysql",
  host: "localhost",
  port: 3306,
  logging: false
});

module.exports = sequelize; 

// const Sequelize = require("sequelize");
// const path = require("path");

// const sequelize = new Sequelize("sqlite::memory:", {
//   dialect: "sqlite",
//   storage: path.join(
//     path.dirname(require.main.filename),
//     "",
//     "heroes_app.sqlite"
//   ),
// });

// module.exports = sequelize;
