const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://google-sign-in-1ydu.onrender.com/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log("Google Profile:", profile);
      done(null, profile);
    }
  )
);

// ✅ Store entire user profile in session
passport.serializeUser((user, done) => {
  console.log("Serialized User:", user);
  done(null, user);
});

// ✅ Retrieve full user from session
passport.deserializeUser((user, done) => {
  console.log("Deserialized User:", user);
  done(null, user);
});
