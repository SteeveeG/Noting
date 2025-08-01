import React, { useState, useRef, useEffect, useCallback } from 'react';
import css from './TextField.module.css';

function TextField({ 
  id, 
  content, 
  width, 
  height, 
  isEditing, 
  onTextChange, 
  onTextFieldClick, 
  onDelete, 
  onResize 
}) {
  const [localContent, setLocalContent] = useState(content);
  const [isResizing, setIsResizing] = useState(false);
  const textareaRef = useRef(null);
  const resizeRef = useRef(null);

  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Handle text change
  const handleTextChange = useCallback((e) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    onTextChange(id, newContent);
  }, [id, onTextChange]);

  // Handle click on text field
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (!isEditing) {
      onTextFieldClick(id);
    }
  }, [id, isEditing, onTextFieldClick]);

  // Handle double click to edit
  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    onTextFieldClick(id);
  }, [id, onTextFieldClick]);

  // Handle key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onTextFieldClick(null); // Stop editing
    }
    if (e.key === 'Delete' && e.ctrlKey) {
      e.preventDefault();
      onDelete(id);
    }
  }, [id, onDelete, onTextFieldClick]);

  // Handle resize start
  const handleResizeStart = useCallback((e) => {
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width;
    const startHeight = height;

    const handleMouseMove = (e) => {
      const newWidth = Math.max(100, startWidth + (e.clientX - startX));
      const newHeight = Math.max(30, startHeight + (e.clientY - startY));
      onResize(id, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [id, width, height, onResize]);

  return (
    <div 
      className={`${css.textField} ${isEditing ? css.editing : ''} ${isResizing ? css.resizing : ''}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Drag handle - FIXED CLASS NAME */}
      <div className={`${css.dragHandle} drag-handle`} />
      
      {/* Text content */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className={css.textarea}
          value={localContent}
          onChange={handleTextChange}
          onKeyDown={handleKeyPress}
          style={{ 
            width: `${width - 10}px`, 
            height: `${height - 10}px` 
          }}
          placeholder="Enter text..."
        />
      ) : (
        <div className={css.textDisplay}>
          {localContent || 'Empty text field'}
        </div>
      )}

      {/* Resize handle */}
      <div 
        className={css.resizeHandle}
        onMouseDown={handleResizeStart}
        ref={resizeRef}
      />

      {/* Delete button */}
      {isEditing && (
        <button 
          className={css.deleteButton}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          title="Delete text field"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default TextField;
