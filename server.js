const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
const cors = require("cors");
require("dotenv").config();
require("./passportConfig"); // Import Passport configuration

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: true, // Must be true for cross-domain cookies
    httpOnly: true,
    sameSite: "none", // Important for Netlify <-> Render communication
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Google Auth Routes
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
  req.session = null; // Clear the session cookie
  res.redirect(process.env.CLIENT_URL);
});

app.get("/auth/user", (req, res) => {
  if (req.user) {
    res.json(req.user); // Send user info if logged in
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
