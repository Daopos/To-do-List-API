require("dotenv").config();

const CLIENT_ID = process.env.GOOGLE_APP_ID;
const CLIENT_SECRET = process.env.GOOGLE_APP_SECRET;
const REDIRECT_URI = process.env.GOOGLE_APP_REDIRECT;
const express = require("express");

const authController = require("../controllers/authController");
const googleAuth = require("../controllers/googleAuth");
const fbAuth = require("../controllers/fbAuth");

const router = express.Router();

router.post("/signup", authController.userSignup);
router.post("/login", authController.userLogin);

// Initiates the Google Login flow
router.get("/auth/google", (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});

router.get("/auth/google/callback", googleAuth.googleSignup);

router.get("/auth/facebook", fbAuth.facecbookPage);

router.get("/auth/facebook/callback", fbAuth.facebookAuth);

module.exports = router;
