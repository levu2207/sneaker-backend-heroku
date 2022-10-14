const { responseError } = require("../../controllers/customResponse");

const authorize = (arrRole) => (req, res, next) => {
  const { user } = req;
  try {
    if (arrRole.findIndex((role) => role === user.role) > -1) {
      return next();
    } else {
      res.status(403).send(responseError(1, "You don't have permission!"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

module.exports = {
  authorize,
};
