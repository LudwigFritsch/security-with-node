const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");

const PORT = process.env.PORT || 8000;

const app = express();

app.get("/secret", (req, res) => {
  return res.send("Personal secret");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
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
