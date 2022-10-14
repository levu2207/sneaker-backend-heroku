const express = require("express");
const path = require("path");
const router = require("./routers");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { sequelize } = require("./models");
require("dotenv").config();

const app = express();

// JSON
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// static file
const publicPathDirection = path.join(__dirname, "./public");
app.use("/public", express.static(publicPathDirection));

app.use("/api", router);

app.listen(process.env.PORT || 8080, async () => {
  console.log(`Server is running on ${port}`);
  try {
    await sequelize.authenticate();
    console.log("Connection database successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
