const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
require("./passportConfig"); // Import Passport configuration

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Google Auth Route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

// Logout
app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.CLIENT_URL);
  });
});

app.get("/auth/user", (req, res) => {
  console.log(req.user)
  res.send('Success')
});

app.listen(5000, () => console.log("Server running on port 5000"));
