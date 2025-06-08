import React, { useRef, useEffect, useState, useContext } from 'react';
import TextField from "../textfield/textfield.jsx";
import { TextContext } from '../../Pages/home/home.jsx';


const Canvas = () => {
  const {texts, setTexts } = useContext(TextContext);

  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, visible: false });
  const [dragIndex, setDragIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x <= canvas.width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.strokeStyle = "#ccc";
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.strokeStyle = "#ccc";
      ctx.stroke();
    }
  }, []);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    setTooltip({ x, y, visible: true });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const dragText = (e, index) => {
    const rect = e.target.getBoundingClientRect();
    setDragIndex(index);
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      style={{
        width: "1500px",
        height: "1000px",
        border: "1px solid black",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        width={1500}
        height={1000}
        style={{ position: "absolute", top: 0, left: 0 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {texts?.map((content, index) => (
        <div
          key={index}
          onMouseDown={(e) => dragText(e, index)}
          style={{
            position: "absolute",
            left: content.x,
            top: content.y,
          }}
        >
          <TextField content={content.content} />
        </div>
      ))}


      {tooltip.visible && (
        <div
          ref={tooltipRef}
          style={{
            position: "absolute",
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "4px 8px",
            fontSize: "12px",
            pointerEvents: "none",
          }}
        >
          x: {tooltip.x}, y: {tooltip.y}
        </div>
      )}
    </div>
  );
};

export default Canvas;
