require("dotenv").config();
const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  let idToken = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  }

  if (!idToken) {
    return res.status(401).json({ message: "Please login to get access" });
  }

  try {
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET);

    req.userId = tokenDetail.userId;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }

    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authentication;
