// client/src/components/UserCursors.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const UserCursors = ({ roomId, selfId }) => {
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    const handleCursor = ({ userId, x, y }) => {
      if (userId === selfId) return;
      setCursors((prev) => ({
        ...prev,
        [userId]: { x, y },
      }));
    };

    const removeCursor = (userId) => {
      setCursors((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    };

    socket.on("update-cursor", handleCursor);
    socket.on("remove-user", removeCursor);

    return () => {
      socket.off("update-cursor", handleCursor);
      socket.off("remove-user", removeCursor);
    };
  }, [selfId]);

  return (
    <>
      {Object.entries(cursors).map(([id, pos]) => (
        <div
          key={id}
          style={{
            position: "absolute",
            top: pos.y,
            left: pos.x,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            background: "rgba(0, 0, 0, 0.5)",
            color: "white",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 9999,
          }}
        >
          🖱️
        </div>
      ))}
    </>
  );
};

export default UserCursors;
