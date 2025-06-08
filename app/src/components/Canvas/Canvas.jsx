import React, { useRef, useEffect, useState, useContext } from 'react';
import TextField from "../textfield/textfield.jsx";
import { TextContext } from '../../Pages/home/home.jsx';

const Canvas = () => {
  const { texts, setTexts } = useContext(TextContext);

  const canvasRef = useRef(null);
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


  const dragText = (e, index) => {

    const rect = e.currentTarget.getBoundingClientRect();
    setDragIndex(index);
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };


  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (dragIndex !== null) {
      const updatedTexts = [...texts];
      updatedTexts[dragIndex] = {
        ...updatedTexts[dragIndex],
        x: x - offset.x,
        y: y - offset.y,
      };
      setTexts(updatedTexts);
    }

    setTooltip({ x: Math.floor(x), y: Math.floor(y), visible: true });
  };


  const handleMouseUp = () => {
    setDragIndex(null);
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
    setDragIndex(null);
  };

  return (
    <div
      style={{
        width: "1500px",
        height: "1000px",
        border: "1px solid black",
        position: "relative",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        width={1500}
        height={1000}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {texts.map((text, index) => (
        <div
          key={index}
          onMouseDown={(e) => dragText(e, index)}
          style={{
            position: "absolute",
            left: text.x,
            top: text.y,
            cursor: "move",
            zIndex: dragIndex === index ? 1000 : 1,
          }}
        >
          <TextField content={text.content} />
        </div>
      ))}

      {tooltip.visible && (
        <div
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
