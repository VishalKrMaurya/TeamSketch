// === server/utils/cleanupOldRooms.js ===
const Room = require("../models/Room");

async function cleanupOldRooms() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  try {
    const result = await Room.deleteMany({ lastActivity: { $lt: oneDayAgo } });
    console.log(`🧹 Cleaned ${result.deletedCount} old rooms.`);
  } catch (err) {
    console.error("❌ Failed to cleanup old rooms:", err);
  }
}

module.exports = cleanupOldRooms;


// === server/server.js (or index.js) ===
const cleanupOldRooms = require("./utils/cleanupOldRooms");
const cron = require("node-cron");

// Run cleanup every hour
cron.schedule("0 * * * *", () => {
  console.log("🕒 Running hourly cleanup job...");
  cleanupOldRooms();
});


// === components/Toolbar.js (adds Clear and Replay button) ===
import React from "react";
import socket from "../socket";
import { useParams } from "react-router-dom";

function Toolbar() {
  const { roomId } = useParams();

  const handleClear = () => {
    socket.emit("clear-canvas", { roomId });
  };

  const handleReplay = () => {
    socket.emit("request-replay", { roomId });
  };

  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
      <button onClick={handleClear}>Clear</button>
      <button onClick={handleReplay}>Replay</button>
    </div>
  );
}

export default Toolbar;


// === server/socket/socketHandler.js - handle replay request ===
socket.on("request-replay", async ({ roomId }) => {
  try {
    const room = await Room.findOne({ roomId });
    if (room && room.drawingData.length > 0) {
      socket.emit("load-drawing-data", room.drawingData);
    }
  } catch (err) {
    console.error("❌ Replay request failed:", err);
  }
});
