"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const modelOrder = [
  "Movie",
  "Genre",
  "MovieGenre",
  "movelink",
  "User",
  "Like",
  "Favorite",
  "Season",
  "Episode",

  // Add more model names in the desired order
];

modelOrder.forEach((modelName) => {
  const file = fs
    .readdirSync(__dirname)
    .find(
      (file) =>
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".js" &&
        file.indexOf(".test.js") === -1 &&
        file.toLowerCase() === `${modelName.toLowerCase()}.js`
    );

  if (file) {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  } else {
    console.error(`File not found for model: ${modelName}`);
  }
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
