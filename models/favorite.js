"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Product }) {
      // define association here
      this.belongsTo(User, { foreignKey: "userId" });
      this.belongsTo(Product, { foreignKey: "productId" });
    }
  }
  Favorite.init(
    {},
    {
      sequelize,
      modelName: "Favorite",
    }
  );
  return Favorite;
};
