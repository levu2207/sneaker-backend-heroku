const { Image } = require("../models");
const { responseError } = require("./customResponse");

// save url image product to database
const uploadProductImages = async (req, res, id) => {
  const { files } = req;
  let imageArr = [];

  try {
    files.forEach(async (image) => {
      const imageUrl = `${req.protocol}://${req.get("host")}/${image.path}`;
      imageArr.push(imageUrl);

      const newImage = await Image.create({
        productId: id,
        imageUrl,
      });
    });

    return imageArr;
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

module.exports = {
  uploadProductImages,
};
