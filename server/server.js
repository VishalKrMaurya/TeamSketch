const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const initSocket = require("./socket/socketHandler");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
const MONGO_URI = "mongodb://127.0.0.1:27017/whiteboardDB"; // replace with your DB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Initialize socket
initSocket(server);

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
