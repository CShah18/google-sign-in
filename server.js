const express = require("express");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
require("./passportConfig"); // Import Passport configuration

const app = express();

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI || "mongodb+srv://chiragengwebforest:v0HaPCWg9Q7TEB3W@cluster0.ptma4ix.mongodb.net/sessions?retryWrites=true&w=majority&appName=Cluster0";

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      dbName: "sessions",
      collectionName: "sessions",
      mongoUrl: mongoURI, // Store session in MongoDB
      ttl: 14 * 24 * 60 * 60, // Sessions valid for 14 days
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use true if you have HTTPS
      httpOnly: true,
      sameSite: "None", // Important for cross-origin cookies
    },
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use((req, res, next) => {
  console.log("🔵 Cookies Received:", req.cookies);
  console.log("🟡 Session Data:", req.session);
  console.log("🟢 User Data:", req.user);
  next();
});

// Google Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_URL}/Dashboard`,
    failureRedirect: "/login/failed",
  })
);

// Logout
app.get("/auth/logout", (req, res) => {
  req.session = null; // Clear the session cookie
  res.redirect(process.env.CLIENT_URL);
});

app.get("/auth/user", (req, res) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session Data:", req.session);
  console.log("User Data:", req.user);

  if (req.user) {
    res.json(req.user);
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