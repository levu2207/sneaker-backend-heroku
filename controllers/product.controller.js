const { Op } = require("sequelize");
const fs = require("fs");
const { Product, Image } = require("../models");
const {
  responseSuccess,
  responseError,
  responseWithPaging,
} = require("./customResponse");
const { uploadProductImages } = require("./uploadImages.controller");

// Delete old image
const deleteOldImage = async (productId) => {
  try {
    // delete old image from server
    const oldImages = await Image.findAll({
      where: {
        productId,
      },
      raw: true,
    });

    let oldImageProduct = [];
    if (oldImages.length > 0) {
      oldImages.forEach((image) => {
        oldImageProduct.push(image.imageUrl);
      });
    }

    oldImageProduct.forEach((image) => {
      const idx = image.indexOf("/public");
      console.log(idx);
      const path = `.${image.substring(idx)}`;

      fs.unlinkSync(path);
    });

    console.log("Delete Successfull!");
  } catch (error) {
    console.log(error.message);
  }
};

// get image by productId
const getAllProduct = async (productList) => {
  let newList = [];
  try {
    for (product of productList) {
      const images = await Image.findAll({
        where: {
          productId: product.id,
        },
        raw: true,
      });

      if (images.length > 0) {
        let imageProduct = [];

        images.forEach((image) => {
          imageProduct.push(image.imageUrl);
        });
        product.imageArr = imageProduct;
      }

      newList.push(product);
    }

    return newList;
  } catch (error) {
    res.status(500).send(error);
  }
};

// Add Product
const addProduct = async (req, res) => {
  const { brand, name, description, sale, price, amount, categoryId } =
    req.body;

  try {
    const newProduct = await Product.create({
      brand,
      name,
      description,
      sale,
      price,
      amount,
      categoryId,
    });

    const productId = newProduct.dataValues.id;
    const imageArr = await uploadProductImages(req, res, productId);

    const data = {
      ...newProduct.dataValues,
      imageArr,
    };

    if (data) {
      res.status(201).send(responseSuccess(data, "Add Product Completed"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

// Get Product List
const getProductList = async (req, res) => {
  const { page, limit, price, brand, search, category } = req.query;
  let data;
  let productList;

  try {
    let TOTAL_PRODUCTS;
    let PAGE = Number(page);
    let PAGE_SIZE = Number(limit);

    productList = await Product.findAll({
      raw: true,
    });
    TOTAL_PRODUCTS = productList.length;

    if (page && limit) {
      // Pagination
      if (page <= 0) PAGE = 1;
      productList = await Product.findAll({
        limit: PAGE_SIZE,
        offset: (PAGE - 1) * PAGE_SIZE,
        raw: true,
      });

      // filter name
      if (search) {
        if (price) {
          const products = await Product.findAll({
            where: {
              name: {
                [Op.like]: `%${search}%`,
              },
            },

            raw: true,
          });
          TOTAL_PRODUCTS = products.length;

          productList = await Product.findAll({
            where: {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
            order: [["price", price]],
            limit: PAGE_SIZE,
            offset: (PAGE - 1) * PAGE_SIZE,
            raw: true,
          });
        } else {
          const products = await Product.findAll({
            where: {
              name: {
                [Op.like]: `%${search}%`,
              },
            },

            raw: true,
          });
          TOTAL_PRODUCTS = products.length;

          productList = await Product.findAll({
            where: {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
            limit: PAGE_SIZE,
            offset: (PAGE - 1) * PAGE_SIZE,
            raw: true,
          });
        }
      } else if (brand) {
        if (price) {
          const products = await Product.findAll({
            where: {
              brand: {
                [Op.like]: `%${brand}%`,
              },
            },
            raw: true,
          });
          TOTAL_PRODUCTS = products.length;
          // filter brand
          productList = await Product.findAll({
            where: {
              brand: {
                [Op.like]: `%${brand}%`,
              },
            },
            order: [["price", price]],
            limit: PAGE_SIZE,
            offset: (PAGE - 1) * PAGE_SIZE,
            raw: true,
          });
        } else {
          const products = await Product.findAll({
            where: {
              brand: brand,
            },
            raw: true,
          });
          TOTAL_PRODUCTS = products.length;
          // filter brand
          productList = await Product.findAll({
            where: {
              brand: brand,
            },
            limit: PAGE_SIZE,
            offset: (PAGE - 1) * PAGE_SIZE,
            raw: true,
          });
        }
      } else if (category) {
        const products = await Product.findAll({
          where: {
            categoryId: Number(category),
          },
          raw: true,
        });
        TOTAL_PRODUCTS = products.length;
        console.log(TOTAL_PRODUCTS);

        if (price) {
          productList = await Product.findAll({
            where: {
              categoryId: Number(category),
            },
            order: [["price", price]],
            limit: PAGE_SIZE,
            offset: (PAGE - 1) * PAGE_SIZE,
            raw: true,
          });
        } else {
          productList = await Product.findAll({
            where: {
              categoryId: Number(category),
            },
            limit: PAGE_SIZE,
            offset: (PAGE - 1) * PAGE_SIZE,
            raw: true,
          });
        }
      } else if (price) {
        productList = await Product.findAll({
          order: [["price", price]],
          limit: PAGE_SIZE,
          offset: (PAGE - 1) * PAGE_SIZE,
          raw: true,
        });
      }

      data = await getAllProduct(productList);

      const pagination = {
        totalPages: Math.ceil(TOTAL_PRODUCTS / PAGE_SIZE),
        pageSize: PAGE_SIZE,
        currentPage: PAGE,
        totalProduct: TOTAL_PRODUCTS,
      };

      if (data) {
        res
          .status(200)
          .send(responseWithPaging(data, "Successfull!", pagination));
      } else {
        res.status(404).send(responseError(1, "Product not found"));
      }
    } else {
      // Filter name
      if (search) {
        productList = await Product.findAll({
          where: {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
          limit: PAGE_SIZE,
          offset: (PAGE - 1) * PAGE_SIZE,
          raw: true,
        });

        TOTAL_PRODUCTS = productList.length;
      } else if (brand) {
        // filter brand
        productList = await Product.findAll({
          where: {
            brand: {
              [Op.like]: `%${brand}%`,
            },
          },
          limit: PAGE_SIZE,
          offset: (PAGE - 1) * PAGE_SIZE,
          raw: true,
        });

        TOTAL_PRODUCTS = productList.length;
      }

      data = await getAllProduct(productList);

      const pagination = {
        totalPages: Math.ceil(TOTAL_PRODUCTS / PAGE_SIZE),
        pageSize: PAGE_SIZE,
        currentPage: PAGE,
        totalProduct: TOTAL_PRODUCTS,
      };

      if (data) {
        res
          .status(200)
          .send(responseWithPaging(data, "Successfull!", pagination));
      } else {
        res.status(404).send(responseError(1, "Product not found"));
      }
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

// Get Product By ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({
      where: {
        id,
      },
      raw: true,
    });
    if (product) {
      const images = await Image.findAll({
        where: {
          productId: id,
        },
        raw: true,
      });

      let imageProduct = [];
      if (images.length > 0) {
        images.forEach((image) => {
          imageProduct.push(image.imageUrl);
        });
      }

      const data = {
        ...product,
        imageArr: imageProduct,
      };

      res.status(200).send(responseSuccess(data, "Successfull!"));
    } else {
      res.status(404).send(responseError(1, "Product not found"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

// Update Product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { brand, name, description, sale, price, amount, categoryId, files } =
    req.body;
  try {
    const productUpdated = await Product.findOne({
      where: {
        id,
      },
    });

    if (productUpdated) {
      productUpdated.brand = brand ? brand : productUpdated.brand;
      productUpdated.name = name ? name : productUpdated.name;
      productUpdated.description = description
        ? description
        : productUpdated.description;
      productUpdated.sale = sale ? sale : productUpdated.sale;
      productUpdated.price = price ? price : productUpdated.price;
      productUpdated.amount = amount ? amount : productUpdated.amount;
      productUpdated.categoryId = categoryId
        ? categoryId
        : productUpdated.categoryId;

      await productUpdated.save();

      const productId = productUpdated.dataValues.id;

      if (files) {
        await deleteOldImage(productId);
        await Image.destroy({
          where: {
            productId,
          },
        });
      }

      // update new URL image to database
      const imageArr = await uploadProductImages(req, res, productId);

      const data = {
        ...productUpdated.dataValues,
        imageArr,
      };

      res.status(200).send(responseSuccess(data, "Update Product Completed!"));
    } else {
      res.status(404).send(responseError(1, "Product not found"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

//  Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    deleteOldImage(id);

    const productDeleted = await Product.findOne({
      where: {
        id,
      },
    });

    if (productDeleted) {
      await Product.destroy({
        where: {
          id,
        },
      });

      res.status(200).send(responseSuccess(productDeleted, "Successfull!"));
    } else {
      res.status(404).send(responseError(1, "Product not found"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

module.exports = {
  addProduct,
  getProductList,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProduct,
};
