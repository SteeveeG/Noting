import React, { useState, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
import TextField from '../textfield/TextField';
import css from './Canvas.module.css';

function Canvas() {
  const [textFields, setTextFields] = useState([
    {
      id: 1,
      content: "Montserrat ist diese Font Hier",
      x: 50,
      y: 50,
      width: 250,
      height: 40,
      isEditing: false
    },
    {
      id: 2,
      content: "Drag mich!",
      x: 300,
      y: 150,
      width: 200,
      height: 40,
      isEditing: false
    }
  ]);

  const canvasRef = useRef(null);
  const [nextId, setNextId] = useState(3);

  // Add new text field on double click
  const handleCanvasDoubleClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newTextField = {
        id: nextId,
        content: "New Text",
        x: x - 50,
        y: y - 20,
        width: 150,
        height: 40,
        isEditing: true
      };

      setTextFields(prev => [...prev, newTextField]);
      setNextId(prev => prev + 1);
    }
  }, [nextId]);

  // Update text field position after drag
  const handleDragStop = useCallback((id, data) => {
    setTextFields(prev => 
      prev.map(field => 
        field.id === id 
          ? { ...field, x: data.x, y: data.y }
          : field
      )
    );
  }, []);

  // Update text field content
  const handleTextChange = useCallback((id, newContent) => {
    setTextFields(prev => 
      prev.map(field => 
        field.id === id 
          ? { ...field, content: newContent }
          : field
      )
    );
  }, []);

  // Toggle editing mode
  const handleTextFieldClick = useCallback((id) => {
    setTextFields(prev => 
      prev.map(field => 
        field.id === id 
          ? { ...field, isEditing: true }
          : { ...field, isEditing: false }
      )
    );
  }, []);

  // Stop editing when clicking outside
  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      setTextFields(prev => 
        prev.map(field => ({ ...field, isEditing: false }))
      );
    }
  }, []);

  // Delete text field
  const handleDeleteTextField = useCallback((id) => {
    setTextFields(prev => prev.filter(field => field.id !== id));
  }, []);

  // Resize text field
  const handleResize = useCallback((id, newWidth, newHeight) => {
    setTextFields(prev => 
      prev.map(field => 
        field.id === id 
          ? { ...field, width: newWidth, height: newHeight }
          : field
      )
    );
  }, []);

  return (
    <div 
      className={css.canvas}
      ref={canvasRef}
      onDoubleClick={handleCanvasDoubleClick}
      onClick={handleCanvasClick}
    >
      <div className={css.canvasInstructions}>
        Double-click to add text • Click and drag to move • Double-click text to edit
      </div>
      
      {textFields.map((field) => (
        <Draggable
          key={field.id}
          position={{ x: field.x, y: field.y }}
          onStop={(e, data) => handleDragStop(field.id, data)}
          handle=".drag-handle"
          disabled={field.isEditing}
        >
          <div className={css.textFieldWrapper}>
            <TextField
              id={field.id}
              content={field.content}
              width={field.width}
              height={field.height}
              isEditing={field.isEditing}
              onTextChange={handleTextChange}
              onTextFieldClick={handleTextFieldClick}
              onDelete={handleDeleteTextField}
              onResize={handleResize}
            />
          </div>
        </Draggable>
      ))}
    </div>
  );
}

export default Canvas;
