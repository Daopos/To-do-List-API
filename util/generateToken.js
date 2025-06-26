require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

module.exports = generateToken;
