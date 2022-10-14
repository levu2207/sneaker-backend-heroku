const express = require("express");
const {
  addProduct,
  getProductList,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const { authenticate } = require("../middlewares/auth/authenticate");
const { authorize } = require("../middlewares/auth/authorize");
const { uploadProductImage } = require("../middlewares/upload/uploadImages");

const productRouter = express.Router();

productRouter.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  uploadProductImage(),
  addProduct
);

productRouter.get("/", getProductList);

productRouter.get("/:id", getProductById);

productRouter.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  uploadProductImage(),
  updateProduct
);

productRouter.delete("/:id", authenticate, authorize(["ADMIN"]), deleteProduct);

module.exports = productRouter;
