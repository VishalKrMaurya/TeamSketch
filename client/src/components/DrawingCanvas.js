import React, { useEffect, useRef, useCallback } from "react";

const DrawingCanvas = ({ socket, roomId, canvasRef, color, strokeWidth }) => {
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  const clearCanvas = useCallback(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [canvasRef]);

  const drawLine = useCallback(
    ({ x0, y0, x1, y1, color, strokeWidth, emit }) => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.closePath();

      if (!emit) return;

      socket.emit("draw", {
        roomId,
        data: { x0, y0, x1, y1, color, strokeWidth },
      });
    },
    [canvasRef, socket, roomId]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.lineCap = "round";

    // ✅ FIXED: Adjust mouse position to canvas offset
    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseDown = (e) => {
      isDrawing.current = true;
      lastPoint.current = getMousePos(e);
    };

    const onMouseMove = (e) => {
      if (!isDrawing.current) return;
      const currentPoint = getMousePos(e);
      drawLine({
        x0: lastPoint.current.x,
        y0: lastPoint.current.y,
        x1: currentPoint.x,
        y1: currentPoint.y,
        color,
        strokeWidth,
        emit: true,
      });
      lastPoint.current = currentPoint;

      socket.emit("cursor-move", {
        roomId,
        x: currentPoint.x,
        y: currentPoint.y,
      });
    };

    const onMouseUp = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);

    socket.on("draw", (data) => {
      drawLine({ ...data, emit: false });
    });

    socket.on("clear-canvas", () => {
      clearCanvas();
    });

    socket.on("load-drawing-data", (data) => {
      data.forEach((cmd) => {
        if (cmd.type === "stroke") {
          drawLine({ ...cmd.data, emit: false });
        } else if (cmd.type === "clear") {
          clearCanvas();
        }
      });
    });

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
      socket.off("draw");
      socket.off("clear-canvas");
      socket.off("load-drawing-data");
    };
  }, [canvasRef, color, strokeWidth, socket, roomId, drawLine, clearCanvas]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: "50px", // Leave room for toolbar
        left: 0,
        background: "#e3f2fd", // ✅ Light blue background
        zIndex: 1,
      }}
    />
  );
};

export default DrawingCanvas;
