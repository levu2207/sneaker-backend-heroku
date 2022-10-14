const { Category } = require("../models");
const { responseSuccess, responseError } = require("./customResponse");

// get all category
const getAllCategory = async (req, res) => {
  try {
    const category = await Category.findAll();
    if (category) {
      res.status(200).send(responseSuccess(category, "Successfull!"));
    } else {
      res.status(404).send(responseError(1, "Category not found!"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error));
  }
};

// get category by category name
const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findOne({
      where: {
        id,
      },
    });

    if (category) {
      res.status(200).send(responseSuccess(category, "Successfull!"));
    } else {
      res.status(404).send(responseError(1, "Category not found!"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error));
  }
};

// Add Category
const addCategory = async (req, res) => {
  const { name } = req.body;

  try {
    if (name) {
      const newCategory = await Category.create({
        name,
      });

      if (newCategory) {
        res
          .status(200)
          .send(responseSuccess(newCategory, "Add Category Successfull!"));
      }
    } else {
      res.status(404).send(responseError(1, "Add Category Failure!"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error));
  }
};

// update category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (name) {
      const category = await Category.findOne({
        where: {
          id,
        },
      });

      category.name = name ? name : category.name;
      await category.save();

      res
        .status(200)
        .send(responseSuccess(category, "Update Category Successfull!"));
    } else {
      res.status(404).send(responseError(1, "Category not found!"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error));
  }
};

//  Delete Category
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      await Category.Destroy({
        where: {
          id,
        },
      });

      res.status(200).send(responseSuccess("Category Deleted!"));
    } else {
      res.status(404).send(responseError(1, "Category not found!"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error));
  }
};

module.exports = {
  getAllCategory,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
