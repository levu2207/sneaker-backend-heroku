const { Order, Detail } = require("../models");
const { responseSuccess, responseError } = require("./customResponse");

// get all order
const getAllOrder = async (req, res) => {
  try {
    let newOrderList = [];
    const orderList = await Order.findAll({
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    if (orderList.length === 0) return;

    for (order of orderList) {
      const details = await Detail.findAll({
        where: {
          orderId: order.id,
        },
        raw: true,
      });

      let newOrder = {
        ...order,
        orderItems: details,
      };

      newOrderList.push(newOrder);
    }

    if (newOrderList.length > 0) {
      res.status(200).send(responseSuccess(newOrderList, "Successfull!"));
    } else {
      res.status(404).send(responseError(1, "Order not found!"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

// get order by id
const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOne({
      where: {
        id,
      },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    const orderItems = await Detail.findAll({
      where: {
        orderId: id,
      },
      raw: true,
    });

    const data = {
      ...order,
      orderItems,
    };

    res.status(200).send(responseSuccess(data, "Successfull!"));
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

// get order for user
const getOrderOfUser = async (req, res) => {
  const { userId } = req.params;
  let newOrderList = [];
  try {
    const orderList = await Order.findAll({
      where: {
        userId: userId,
      },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    for (order of orderList) {
      const orderItems = await Detail.findAll({
        where: {
          orderId: order.id,
        },
        raw: true,
      });

      order.orderItems = orderItems;
      newOrderList.push(order);
    }

    if (newOrderList) {
      res.status(200).send(responseSuccess(newOrderList, "Successfull!"));
    } else {
      res.status(404).send(responseError(1, "Order not found!"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

// add new order
const addNewOrder = async (req, res) => {
  const {
    userId,
    fullName,
    phoneNumber,
    address,
    note,
    totalPrice,
    status,
    isPaid,
  } = req.body;
  try {
    const newOrder = await Order.create({
      userId,
      fullName,
      phoneNumber,
      address,
      note,
      totalPrice,
      status,
      isPaid,
    });

    if (newOrder) {
      res.status(201).send(responseSuccess(newOrder, "Add Product Completed"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

// delete order
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const orderDeleted = await Order.findOne({
      where: {
        id,
      },
    });

    if (orderDeleted) {
      await Order.destroy({
        where: {
          id,
        },
      });

      res.status(200).send(responseSuccess(orderDeleted, "Successfull!"));
    } else {
      res.status(404).send(responseError(1, "Order not found"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

// update order
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const {
    userId,
    fullName,
    phoneNumber,
    address,
    note,
    totalPrice,
    status,
    isPaid,
  } = req.body;

  try {
    const orderUpdated = await Order.findOne({
      where: {
        id,
      },
    });

    if (orderUpdated) {
      orderUpdated.userId = userId ? userId : orderUpdated.userId;
      orderUpdated.fullName = fullName ? fullName : orderUpdated.fullName;
      orderUpdated.phoneNumber = phoneNumber
        ? phoneNumber
        : orderUpdated.phoneNumber;
      orderUpdated.address = address ? address : orderUpdated.address;
      orderUpdated.note = note ? note : orderUpdated.note;
      orderUpdated.totalPrice = totalPrice
        ? totalPrice
        : orderUpdated.totalPrice;
      orderUpdated.status = status ? status : orderUpdated.status;
      orderUpdated.isPaid = isPaid ? isPaid : orderUpdated.isPaid;

      await orderUpdated.save();

      res
        .status(200)
        .send(responseSuccess(orderUpdated, "Update Order Completed!"));
    } else {
      res.status(404).send(responseError(1, "Order not found"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

module.exports = {
  getAllOrder,
  getOrderOfUser,
  addNewOrder,
  getOrderById,
  deleteOrder,
  updateOrder,
};
