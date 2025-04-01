const express = require("express");
const passport = require("passport");
// const cookieSession = require("cookie-session");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
require("./passportConfig"); // Import Passport configuration

const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none",
    },
  })
);

app.use((req, res, next) => {
  console.log("Session:", req.session);
  console.log("User:", req.user);
  next();
});

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
    res.json(req.user);
  } else if (req.session) {
    res.json(req.session);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});

app.on("error", (error) => {
  console.log(`Error in starting the server: ${error.message}`);
});