"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Toppings extends Model {
    static associate(models) {
      Toppings.belongsTo(models.Restaurants, {
        foreignKey: "restaurantsId",
        onDelete: "CASCADE",
      });
      Toppings.belongsToMany(models.Pizza, {
        through: models.PizzaToppings,
        foreignKey: "toppingId",
      });
      Toppings.belongsToMany(models.Orders, {
        through: models.OrderToppings,
        foreignKey: "toppingId",
      });
    }
  }
  Toppings.init(
    {
      name: DataTypes.STRING,
      restaurantsId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Toppings",
    }
  );
  return Toppings;
};
