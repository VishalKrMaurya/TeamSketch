// client/src/components/Toolbar.js
import React from "react";

const Toolbar = ({ socket, roomId, setColor, setStrokeWidth }) => {
  const handleClear = () => {
    console.log("Clear requested");
    socket.emit("clear-canvas", { roomId }); // ✅ Fix: send as object
  };

  const buttonStyle = {
    margin: "0 8px",
    padding: "6px 12px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  };

  const toolbarStyle = {
    background: "#f5f5f5",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    borderBottom: "1px solid #ddd",
    zIndex: 2,
    position: "relative",
  };

  return (
    <div style={toolbarStyle}>
      <span><strong>Color:</strong></span>
      <button style={{ ...buttonStyle, background: "black", color: "white" }} onClick={() => setColor("black")}>Black</button>
      <button style={{ ...buttonStyle, background: "red", color: "white" }} onClick={() => setColor("red")}>Red</button>
      <button style={{ ...buttonStyle, background: "green", color: "white" }} onClick={() => setColor("green")}>Green</button>
      <button style={{ ...buttonStyle, background: "blue", color: "white" }} onClick={() => setColor("blue")}>Blue</button>

      <span><strong>Stroke:</strong></span>
      <input
        type="range"
        min="1"
        max="10"
        defaultValue="2"
        onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
        style={{ cursor: "pointer" }}
      />

      <button
        onClick={handleClear}
        style={{ ...buttonStyle, background: "#f44336", color: "#fff", fontWeight: "bold" }}
      >
        Clear Canvas
      </button>
    </div>
  );
};

export default Toolbar;
