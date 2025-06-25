const express = require("express");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(bodyParser.json()); // for JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/uploads", express.static("public/uploads"));

app.use("/api/v1", authRoutes);
app.use("/api/v1", taskRoutes);

app.listen(process.env.ENV_PORT, () =>
  console.log(`server is running on port ${process.env.ENV_PORT}`)
);
