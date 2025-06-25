require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { User } = require("../db/models/index");

const APP_ID = process.env.FB_APP_ID;
const APP_SECRET = process.env.FB_APP_SECRET;
const REDIRECT_URI = process.env.FB_APP_REDIRECT;
const FRONTEND_URL = process.env.FRONT_END_URL;

const facebookAuth = async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const { data } = await axios.get(
      `https://graph.facebook.com/v13.0/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`
    );
    if (!data) {
      res.status(404).json({ message: "No Data" });
    }
    const { access_token } = data;

    // Use access_token to fetch user profile
    const { data: profile } = await axios.get(
      `https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`
    );

    const [user, created] = await User.findOrCreate({
      where: { provider_id: profile.id },
      defaults: {
        provider: "facebook",
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.redirect(`${FRONTEND_URL}/third_parties_auth?token=${token}`);
  } catch (error) {
    console.error("Error:", error.response);
  }
};

const facecbookPage = (req, res) => {
  const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email`;
  res.redirect(url);
};

module.exports = { facebookAuth, facecbookPage };
