"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderToppings extends Model {
    static associate(models) {
      // Correctly associate OrderToppings with Orders and Toppings
      OrderToppings.belongsTo(models.Orders, {
        foreignKey: "orderId",
        onDelete: "CASCADE",
      });
      OrderToppings.belongsTo(models.Toppings, {
        foreignKey: "toppingId",
        onDelete: "CASCADE",
      });
    }
  }
  OrderToppings.init(
    {
      orderId: DataTypes.INTEGER,
      toppingId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OrderToppings",
    }
  );
  return OrderToppings;
};
