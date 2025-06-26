require("dotenv").config();
const axios = require("axios");
const { User } = require("../db/models/index");
const generateToken = require("../util/generateToken");

const CLIENT_ID = process.env.GOOGLE_APP_ID;
const CLIENT_SECRET = process.env.GOOGLE_APP_SECRET;
const REDIRECT_URI = process.env.GOOGLE_APP_REDIRECT;
const FRONTEND_URL = process.env.FRONT_END_URL;

const googleSignup = async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { access_token, id_token } = data;

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const [user, created] = await User.findOrCreate({
      where: { provider_id: profile.id, provider: "google" },
      defaults: {
        provider: "google",
      },
    });

    const token = generateToken(user.id);

    res.redirect(
      `${FRONTEND_URL}/third_parties_auth?token=${token}&username=${profile.name}`
    );
  } catch (error) {
    console.error("Error:", error.response.data.error);
  }
};

const googlePage = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
};

module.exports = { googleSignup, googlePage };
