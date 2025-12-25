const express = require("express");
const compression = require("compression");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(compression());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, "dist")));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`📁 Serving from: ${__dirname}`);
  console.log(`🌐 NODE_ENV: ${process.env.NODE_ENV || "development"}`);
});
