// client/src/components/Whiteboard.js
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import DrawingCanvas from "./DrawingCanvas";
import Toolbar from "./Toolbar";
import UserCursors from "./UserCursors";

const socket = io("http://localhost:5000"); // Ensure your server runs here

const Whiteboard = () => {
  const { roomId } = useParams();
  const canvasRef = useRef();
  const [userId, setUserId] = useState(null);
  const [color, setColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(2);

  useEffect(() => {
    socket.emit("join-room", { roomId });

    socket.on("connect", () => {
      console.log("Connected as", socket.id);
      setUserId(socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Toolbar
        socket={socket}
        roomId={roomId}
        setColor={setColor}
        setStrokeWidth={setStrokeWidth}
      />
      <DrawingCanvas
        socket={socket}
        roomId={roomId}
        canvasRef={canvasRef}
        color={color}
        strokeWidth={strokeWidth}
      />
      {userId && (
        <UserCursors roomId={roomId} selfId={userId} />
      )}
    </div>
  );
};

export default Whiteboard;
