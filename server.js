const fs = require("fs");
const path = require("path");
const https = require("https");
const helmet = require("helmet");
const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
const { Strategy } = require("passport-google-oauth2");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("Google profile", profile);
  done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

/**
 * save session to cookie
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * read session from cookie
 */
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

const app = express();

app.use(helmet());

app.use(
  cookieSession({
    name: "session",
    maxAge: 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY_ONE, process.env.COOKIE_KEY_TWO],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/public"));

app.get("/auth/google", passport.authenticate("google", { scope: ["email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: true,
  }),
  (req, res) => {
    console.log("Google called us back");
  }
);

app.get("/auth/logout", (req, res) => {});

app.get("/secret", checkLoggedIn, (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "secret.html"));
});

app.get("/failure", (req, res) => {
  return res.send("Failed to login");
});

app.get("/*", (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = https.createServer(
  {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  },
  app
);

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

function checkLoggedIn(req, res, next) {
  const isLoggedIn = true; // TODO
  if (!isLoggedIn) {
    return res.status(401).json({ error: "You must log in" });
  }
  next();
}
