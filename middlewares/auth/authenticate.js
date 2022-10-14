const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  responseError,
  responseSuccess,
} = require("../../controllers/customResponse");

const authenticate = (req, res, next) => {
  const token = req.headers.token;

  try {
    const decode = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    console.log(decode);
    if (decode) {
      req.user = decode;
      return next();
    } else {
      res.status(401).send(responseError(1, "You must login"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

const authenticateAndAdmin = (req, res, next) => {
  authenticate(req, res, () => {
    if (req.user.id == req.params.id || req.user.role === "ADMIN") {
      next();
    } else {
      res.status(403).send(responseError(1, "You are not allowed"));
    }
  });
};

module.exports = {
  authenticate,
  authenticateAndAdmin,
};
