"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.belongsTo(models.Restaurants, {
        foreignKey: "restaurantsId",
        onDelete: "CASCADE",
      });
      Users.hasMany(models.Orders, {
        foreignKey: "userId",
      });
    }
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }
  Users.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      location: DataTypes.STRING,
      phone_no: DataTypes.STRING,
      password: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM("customer", "restaurant_manager"),
        defaultValue: "customer",
        allowNull: false,
      },
      sub_role: DataTypes.INTEGER,
      restaurantsId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
