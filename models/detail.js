"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order, Product }) {
      // define association here
      this.belongsTo(Order, { foreignKey: "orderId" });
      this.belongsTo(Product, { foreignKey: "productId" });
    }
  }
  Detail.init(
    {
      price: DataTypes.DOUBLE,
      // size: DataTypes.STRING,
      quantity: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "Detail",
    }
  );
  return Detail;
};
