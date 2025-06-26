const { User, Task } = require("../db/models/index");
const bcrypt = require("bcrypt");
const generateToken = require("../util/generateToken");

const userSignup = async (req, res, next) => {
  try {
    const { body } = req;

    const newUser = await User.create({
      name: body.name,
      username: body.username,
      password: body.password,
    });

    const token = generateToken(newUser.id);

    res.status(201).json({ token: token, username: newUser.username });
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

    const token = generateToken(user.id);

    res.status(200).json({ token: token, username: user.username });
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
