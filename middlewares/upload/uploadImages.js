const multer = require("multer");
const mkdirp = require("mkdirp");

//  upload single img to server
const uploadAvatar = (type) => {
  const made = mkdirp.sync(`./public/images/${type}`);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/images/${type}`);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      const extensionImageList = [".png", ".jpg"];
      const fileExtension = file.originalname.slice(-4);
      const check = extensionImageList.includes(fileExtension);
      if (check) {
        cb(null, true);
      } else {
        cb(new Error("File extension not supported"));
      }
    },
  });
  return upload.single(type);
};

//  upload multiple img to server
const uploadProductImage = (req) => {
  const made = mkdirp.sync(`./public/images/product`);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/images/product`);
    },
    filename: function (req, file, cb) {
      var pathImageProduct = Date.now() + "_" + file.originalname;
      cb(null, pathImageProduct);
    },
  });
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      const extensionImageList = [".png", ".jpg"];
      const fileExtension = file.originalname.slice(-4);
      const check = extensionImageList.includes(fileExtension);
      if (check) {
        cb(null, true);
      } else {
        cb(new Error("File extension not supported"));
      }
    },
  });

  return upload.array("images", 12);
};

module.exports = {
  uploadAvatar,
  uploadProductImage,
};
