"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Category, Detail, Favorite, Image }) {
      // define association here
      this.belongsTo(Category, { foreignKey: "categoryId" });
      this.hasMany(Detail, { foreignKey: "productId" });
      this.hasMany(Favorite, { foreignKey: "productId" });
      this.hasMany(Image, {
        foreignKey: "productId",
      });
    }
  }
  Product.init(
    {
      brand: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Please enter product brand",
          },
          min: 2,
        },
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Please enter product name",
          },
          min: 2,
        },
      },
      description: DataTypes.TEXT,
      price: {
        type: DataTypes.DOUBLE,
        validate: {
          notEmpty: true,
        },
      },
      sale: DataTypes.INTEGER,
      amount: {
        type: DataTypes.DOUBLE,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
