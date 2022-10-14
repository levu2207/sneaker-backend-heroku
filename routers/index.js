const express = require("express");
const userRouter = require("./user.router");
const productRouter = require("./product.router");
const categoryRouter = require("./category.router");
const orderRouter = require("./orderRouter");

const router = express.Router();

router.use("/users", userRouter);

router.use("/products", productRouter);

router.use("/category", categoryRouter);

router.use("/orders", orderRouter);

module.exports = router;
