const express = require("express");
const { createOrderDetail } = require("../controllers/detail.controller");
const {
  getAllOrder,
  addNewOrder,
  getOrderOfUser,
  getOrderById,
  deleteOrder,
  updateOrder,
} = require("../controllers/order.controller");
const { authenticate } = require("../middlewares/auth/authenticate");
const { authorize } = require("../middlewares/auth/authorize");
const orderRouter = express.Router();

orderRouter.get("/", authenticate, authorize(["ADMIN"]), getAllOrder);

orderRouter.get(
  "/users/:userId",
  authenticate,
  authorize(["ADMIN"]),
  getOrderOfUser
);

orderRouter.get("/:id", authenticate, authorize(["ADMIN"]), getOrderById);

orderRouter.delete("/:id", authenticate, authorize(["ADMIN"]), deleteOrder);

orderRouter.post("/", authenticate, addNewOrder);

orderRouter.put("/:id", authenticate, updateOrder);

orderRouter.post("/details", authenticate, createOrderDetail);

module.exports = orderRouter;
