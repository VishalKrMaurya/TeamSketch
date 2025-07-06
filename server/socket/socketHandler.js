const { Server } = require("socket.io");
const Room = require("../models/Room");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 New client:", socket.id);

    socket.on("join-room", async ({ roomId }) => {
      socket.join(roomId);
      socket.roomId = roomId;

      const room = await Room.findOne({ roomId });
      if (room) {
        socket.emit("load-drawing-data", room.drawingData);
      } else {
        await Room.create({ roomId, drawingData: [] });
      }
    });

    socket.on("draw", async ({ roomId, data }) => {
      if (!roomId || !data) return;
      socket.to(roomId).emit("draw", data);

      try {
        const updateResult = await Room.findOneAndUpdate(
          { roomId },
          {
            $push: {
              drawingData: {
                type: "stroke",
                data,
                timestamp: new Date(),
              },
            },
          },
          { upsert: true }
        );
        console.log("🟢 Stroke saved:", updateResult);
      } catch (err) {
        console.error("❌ Draw save error:", err);
      }
    });

    socket.on("clear-canvas", async ({ roomId }) => {
      io.to(roomId).emit("clear-canvas");

      try {
        const clearResult = await Room.findOneAndUpdate(
          { roomId },
          {
            $push: {
              drawingData: {
                type: "clear",
                timestamp: new Date(),
              },
            },
          },
          { upsert: true }
        );
        console.log("🧹 Canvas clear saved:", clearResult);
      } catch (err) {
        console.error("❌ Clear save error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}

module.exports = initSocket;
