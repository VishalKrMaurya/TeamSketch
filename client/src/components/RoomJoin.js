import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoomJoin = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const generateRoomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const handleJoin = () => {
    const finalRoomId = roomId.trim() || generateRoomId();
    navigate(`/room/${finalRoomId}`);
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f0f4f8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >

      <h1 style={{ color: "green", fontSize: "50px", marginBottom: "20px" }}>
        Vishal Kr Maurya
      </h1>

      <h1 style={{ color: "#1976d2", fontSize: "36px", marginBottom: "20px" }}>
        TeamSketch
      </h1>

      <input
        type="text"
        placeholder="Enter Room Code (optional)"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "250px",
          marginBottom: "10px",
        }}
      />

      <button
        onClick={handleJoin}
        style={{
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Join
      </button>
    </div>
  );
};

export default RoomJoin;
