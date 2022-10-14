const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs");
const gravatar = require("gravatar");

const { responseSuccess, responseError } = require("./customResponse");
const { col } = require("sequelize");

// create access token
const createAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_KEY,
    { expiresIn: "365d" }
  );
};

// create refresh token
const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: "365d" }
  );
};

// refresh token
const requestRefreshToken = async (req, res) => {
  // get refresh token from user
  const refreshToken = req.cookie.refreshToken;
  if (!refreshToken)
    res.status(401).send(responseError(1, "You are not login"));

  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      console.log(err);
    }

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    // Save refresh token to cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // deloy => true
      path: "/",
      sameSite: "strict",
    });

    const data = {
      accessToken: newAccessToken,
    };

    res.status(200).send(responseSuccess(data, "Refresh token Successfull"));
  });
};

// register user
const register = async (req, res) => {
  const { fullName, email, password, phoneNumber, address } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  const avatarUrl = gravatar.url(email);

  try {
    const newUser = await User.create({
      fullName,
      email,
      password: hashPassword,
      phoneNumber,
      address,
      avatar: avatarUrl,
    });

    res.status(201).send(responseSuccess(newUser, "Register success"));
  } catch (error) {
    res.status(500).send(responseError(1, "Register failed"));
  }
};

// login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(500).send(responseError(1, "Invalid email or password"));

  try {
    // find user info
    const userLogin = await User.findOne({
      where: {
        email,
      },
      raw: true,
    });

    if (userLogin) {
      // check password
      const isAuth = bcrypt.compareSync(password, userLogin.password);
      if (isAuth) {
        // create access token
        const accessToken = createAccessToken(userLogin);

        // create refresh token
        const refreshToken = createRefreshToken(userLogin);

        // Save refresh token to cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false, // deloy => true
          path: "/",
          sameSite: "strict",
        });

        delete userLogin.password;
        const data = {
          ...userLogin,
          accessToken,
        };

        res.status(200).send(responseSuccess(data, "Login Successfull!"));
      } else {
        res.status(500).send(responseError(1, "Password incorrect!"));
      }
    } else {
      res.status(404).send(responseError(1, "Email incorrect!"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

// logout
const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.status(200).send(responseSuccess("Logout Successfull!"));
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

// get all user
const getAllUser = async (req, res) => {
  try {
    const userList = await User.findAll();

    if (userList) {
      res.status(200).send(responseSuccess(userList, "Successfull!"));
    } else {
      res.status(404).send(responseError(1, "Can't find user"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error));
  }
};

// get user bay id
const getOneUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      where: {
        id,
      },
      raw: true,
    });
    console.log(user);
    if (user) {
      delete user.password;
      res.status(200).send(responseSuccess(user, "Successfull!"));
    } else {
      res.status(404).send(responseError(1, "Can't find user"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error));
  }
};

// Update user
const updateUser = async (req, res) => {
  const { file } = req;
  let avatarUrl;
  const { id } = req.params;
  const { fullName, email, password, phoneNumber, address } = req.body;

  let salt;
  let hashPassword;
  if (password) {
    salt = bcrypt.genSaltSync(10);
    hashPassword = bcrypt.hashSync(password, salt);
  }

  if (file) {
    avatarUrl = `${req.protocol}://${req.get("host")}/${file.path}`;
  }

  try {
    const userUpdated = await User.findOne({
      where: {
        id,
      },
    });

    // Delete old avatar
    if (avatarUrl && userUpdated.avatar) {
      const idx = userUpdated.avatar.indexOf("/public");
      if (idx !== -1) {
        const path = `.${userUpdated.avatar.substring(idx)}`;
        fs.unlinkSync(path);
      }
    }

    if (userUpdated) {
      userUpdated.fullName = fullName ? fullName : userUpdated.fullName;
      userUpdated.email = email ? email : userUpdated.email;
      userUpdated.password = password ? hashPassword : userUpdated.password;
      userUpdated.phoneNumber = phoneNumber
        ? phoneNumber
        : userUpdated.phoneNumber;
      userUpdated.address = address ? address : userUpdated.address;
      userUpdated.avatar = avatarUrl ? avatarUrl : userUpdated.avatar;
      await userUpdated.save();

      res.status(200).send(responseSuccess(userUpdated, "User Updated!"));
    } else {
      res.status(404).send(responseError(1, "Can't find user"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userUpdated = await User.findOne({
      where: {
        id,
      },
    });

    if (userUpdated) {
      await User.destroy({
        where: {
          id,
        },
      });

      res.status(200).send(responseSuccess([], "User Deleted!"));
    } else {
      res.status(404).send(responseError(1, "Can't find user"));
    }
  } catch (error) {
    res.status(500).send(responseError(1, error.message));
  }
};

module.exports = {
  register,
  login,
  logout,
  getAllUser,
  getOneUser,
  updateUser,
  deleteUser,
  requestRefreshToken,
};
