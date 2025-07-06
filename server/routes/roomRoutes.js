// server/routes/roomRoutes.js

const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

router.post("/join", async (req, res) => {
  const { roomId } = req.body;
  if (!roomId) return res.status(400).json({ success: false, message: "Room ID required" });

  try {
    let room = await Room.findOne({ roomId });

    if (!room) {
      room = new Room({ roomId, createdAt: new Date(), lastActivity: new Date(), drawingData: [] });
      await room.save();
    }

    res.json({ success: true, roomId });
  } catch (err) {
    console.error("Error joining room:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
