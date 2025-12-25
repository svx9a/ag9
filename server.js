const express = require("express");
const path = require("path");
const app = express();

// Serve static files
app.use(express.static("dist"));

// Simple routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "AgriFlight" });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("✅ AgriFlight Global Server running on port", port);
});
