const express = require("express");
const {
  register,
  login,
  logout,
  getAllUser,
  getOneUser,
  updateUser,
  deleteUser,
  requestRefreshToken,
} = require("../controllers/user.controller");
const {
  authenticate,
  authenticateAndAdmin,
} = require("../middlewares/auth/authenticate");
const { authorize } = require("../middlewares/auth/authorize");
const { uploadAvatar } = require("../middlewares/upload/uploadImages");

const userRouter = express.Router();

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.post("/logout", authenticate, logout);

userRouter.post("/refresh", requestRefreshToken);

userRouter.post("/upload-avatar", authenticateAndAdmin, uploadAvatar("avatar"));

userRouter.get("/", authenticate, authorize(["ADMIN"]), getAllUser);

userRouter.get("/:id", authenticateAndAdmin, getOneUser);

userRouter.put(
  "/:id",
  authenticateAndAdmin,
  uploadAvatar("avatar"),
  updateUser
);

userRouter.delete("/:id", authenticateAndAdmin, deleteUser);

module.exports = userRouter;
