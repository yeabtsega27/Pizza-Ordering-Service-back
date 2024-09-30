"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PizzaToppings extends Model {
    static associate(models) {
      PizzaToppings.belongsTo(models.Pizza, {
        foreignKey: "pizzaId",
        onDelete: "CASCADE",
      });
      PizzaToppings.belongsTo(models.Toppings, {
        foreignKey: "toppingId",
        onDelete: "CASCADE",
      });
    }
  }
  PizzaToppings.init(
    {
      pizzaId: DataTypes.INTEGER,
      toppingId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PizzaToppings",
    }
  );
  return PizzaToppings;
};
