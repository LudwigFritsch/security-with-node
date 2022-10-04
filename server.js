const fs = require("fs");
const path = require("path");
const https = require("https");
const helmet = require("helmet");
const express = require("express");

const PORT = process.env.PORT || 8000;

const app = express();

function checkLoggedIn(req, res, next) {
  const isLoggedIn = true; // TODO
  if (!isLoggedIn) {
    return res.status(401).json({ error: "You must log in" });
  }
  next();
}

app.use(helmet());

app.use(express.static(__dirname + "/public"));

app.get("/auth/google", (req, res) => {});

app.get("/auth/google/callback", (req, res) => {});

app.get("/auth/logout", (req, res) => {});

app.get("/secret", checkLoggedIn, (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "secret.html"));
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
