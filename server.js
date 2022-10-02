const path = require("path");
const express = require("express");

const PORT = process.env.PORT || 8000;

const app = express();

app.get("/secret", (req, res) => {
  return res.send("Personal secret");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`server listening on port $${PORT}`);
});
