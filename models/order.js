"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Detail }) {
      // define association here
      this.belongsTo(User, { foreignKey: "userId" });
      this.hasMany(Detail, { foreignKey: "orderId" });
    }
  }
  Order.init(
    {
      fullName: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      address: DataTypes.STRING,
      note: DataTypes.TEXT,
      totalPrice: DataTypes.DOUBLE,
      status: DataTypes.STRING,
      isPaid: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
