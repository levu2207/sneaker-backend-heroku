const { Order, Detail } = require("../models");
const { responseSuccess, responseError } = require("./customResponse");

// create order details
const createOrderDetail = async (req, res) => {
  const { productId, orderId, price, quantity } = req.body;

  try {
    const orderDetail = await Detail.create({
      productId,
      orderId,
      price,
      quantity,
    });

    if (orderDetail) {
      res
        .status(201)
        .send(responseSuccess(orderDetail, "Create Order Detail Completed"));
    } else {
      res.status(404).send(responseError(1, "Create Order Detail Failed"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

// get all order details
const getAllOrderDetails = async (req, res) => {
  try {
    const orderDetailsList = await Order.findAll();
    if (orderDetailsList) {
      res.status(200).send(responseSuccess(orderDetailsList, "Successfull!"));
    } else {
      res.status(404).send(responseError(1, "Order not found!"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

module.exports = {
  getAllOrderDetails,
  createOrderDetail,
};
