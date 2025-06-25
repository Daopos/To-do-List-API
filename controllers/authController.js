const { User, Task } = require("../db/models/index");
const user = require("../db/models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSignup = async (req, res, next) => {
  try {
    const { body } = req;

    const newUser = await User.create({
      name: body.name,
      username: body.username,
      password: body.password,
    });
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(404).json({ message: "Incorrect username or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const userSignout = async (req, res, next) => {
  try {
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
  userSignup,
  userLogin,
};
