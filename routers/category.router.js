const express = require("express");
const {
  getAllCategory,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const categoryRouter = express.Router();

categoryRouter.post("/", addCategory);

categoryRouter.get("/", getAllCategory);

categoryRouter.get("/:id", getCategoryById);

categoryRouter.put("/:id", updateCategory);

categoryRouter.delete("/:id", deleteCategory);

module.exports = categoryRouter;
