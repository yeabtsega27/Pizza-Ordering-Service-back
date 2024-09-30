"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pizza extends Model {
    static associate(models) {
      Pizza.belongsTo(models.Restaurants, {
        foreignKey: "restaurantsId",
        onDelete: "CASCADE",
      });
      Pizza.belongsToMany(models.Toppings, {
        through: models.PizzaToppings,
        foreignKey: "pizzaId",
      });
      Pizza.hasMany(models.Orders, { foreignKey: "pizaId" });
    }
  }
  Pizza.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      restaurantsId: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Pizza",
    }
  );
  return Pizza;
};
