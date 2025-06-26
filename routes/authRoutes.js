require("dotenv").config();

const express = require("express");

const authController = require("../controllers/authController");
const googleAuth = require("../controllers/googleAuth");
const fbAuth = require("../controllers/fbAuth");

const router = express.Router();

router.post("/signup", authController.userSignup);
router.post("/login", authController.userLogin);

router.get("/auth/google", googleAuth.googlePage);

router.get("/auth/google/callback", googleAuth.googleSignup);

router.get("/auth/facebook", fbAuth.facecbookPage);

router.get("/auth/facebook/callback", fbAuth.facebookAuth);

module.exports = router;
