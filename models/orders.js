"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    static associate(models) {
      Orders.belongsTo(models.Users, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Orders.belongsTo(models.Pizza, {
        foreignKey: "pizaId",
        onDelete: "CASCADE",
      });
      Orders.belongsTo(models.Restaurants, {
        foreignKey: "restaurantsId",
        onDelete: "CASCADE",
      });
      Orders.belongsToMany(models.Toppings, {
        through: models.OrderToppings,
        foreignKey: "orderId",
      });
    }
  }

  Orders.init(
    {
      userId: DataTypes.INTEGER,
      pizaId: DataTypes.INTEGER,
      restaurantsId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM("Pending", "Preparing", "Ready", "Delivered"),
        defaultValue: "Pending",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Orders",
    }
  );

  return Orders;
};
