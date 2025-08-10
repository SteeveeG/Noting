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
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef(null);
  const resizeStateRef = useRef(null);

  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.select();
        }
      }, 10);
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
    if (!isEditing && !isDragging && !isResizing) {
      onTextFieldClick(id);
    }
  }, [id, isEditing, isDragging, isResizing, onTextFieldClick]);

  // Handle double click to edit
  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    if (!isDragging && !isResizing) {
      onTextFieldClick(id);
    }
  }, [id, isDragging, isResizing, onTextFieldClick]);

  // Handle key press
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onTextFieldClick(null);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onTextFieldClick(null);
    }
    // Allow Tab key to work normally
    if (e.key === 'Tab') {
      // Don't prevent default - let Tab work normally
      return;
    }
  }, [onTextFieldClick]);

  // Modern RTF-style resize handler
  const createResizeHandler = useCallback((direction) => {
    return (e) => {
      e.stopPropagation();
      setIsResizing(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = width;
      const startHeight = height;

      resizeStateRef.current = {
        startX,
        startY,
        startWidth,
        startHeight,
        direction,
        lastUpdate: 0
      };

      const handleMouseMove = (e) => {
        const now = Date.now();
        const state = resizeStateRef.current;

        if (now - state.lastUpdate < 16) return;
        state.lastUpdate = now;

        let newWidth = state.startWidth;
        let newHeight = state.startHeight;

        const deltaX = e.clientX - state.startX;
        const deltaY = e.clientY - state.startY;

        switch (state.direction) {
          case 'top':
            newHeight = Math.max(60, state.startHeight - deltaY);
            break;
          case 'bottom':
            newHeight = Math.max(60, state.startHeight + deltaY);
            break;
          case 'left':
            newWidth = Math.max(200, state.startWidth - deltaX);
            break;
          case 'right':
            newWidth = Math.max(200, state.startWidth + deltaX);
            break;
          case 'top-left':
            newWidth = Math.max(200, state.startWidth - deltaX);
            newHeight = Math.max(60, state.startHeight - deltaY);
            break;
          case 'top-right':
            newWidth = Math.max(200, state.startWidth + deltaX);
            newHeight = Math.max(60, state.startHeight - deltaY);
            break;
          case 'bottom-left':
            newWidth = Math.max(200, state.startWidth - deltaX);
            newHeight = Math.max(60, state.startHeight + deltaY);
            break;
          case 'bottom-right':
            newWidth = Math.max(200, state.startWidth + deltaX);
            newHeight = Math.max(60, state.startHeight + deltaY);
            break;
        }

        if (newWidth !== width || newHeight !== height) {
          onResize(id, Math.round(newWidth), Math.round(newHeight));
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        resizeStateRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = e.target.style.cursor;
      document.body.style.userSelect = 'none';

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
  }, [id, width, height, onResize]);

  // Handle drag start/stop
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragStop = useCallback(() => {
    setIsDragging(false);
  }, []);


  return (
    <div
      className={`${css.textField} ${isEditing ? css.editing : ''} ${isResizing ? css.resizing : ''} ${isDragging ? css.dragging : ''}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Drag areas - only on border edges when not editing */}
      {!isEditing && (
        <>
          <div
            className={`${css.dragBorderTop} drag-handle`}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragStop}
          />
          <div
            className={`${css.dragBorderBottom} drag-handle`}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragStop}
          />
          <div
            className={`${css.dragBorderLeft} drag-handle`}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragStop}
          />
          <div
            className={`${css.dragBorderRight} drag-handle`}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragStop}
          />
        </>
      )}

      {/* Modern RTF-style resize handles */}
      <div className={css.resizeHandles}>
        {/* Corner handles */}
        <div className={`${css.resizeHandle} ${css.resizeTopLeft}`} onMouseDown={createResizeHandler('top-left')} />
        <div className={`${css.resizeHandle} ${css.resizeTopRight}`} onMouseDown={createResizeHandler('top-right')} />
        <div className={`${css.resizeHandle} ${css.resizeBottomLeft}`} onMouseDown={createResizeHandler('bottom-left')} />
        <div className={`${css.resizeHandle} ${css.resizeBottomRight}`} onMouseDown={createResizeHandler('bottom-right')} />

        {/* Edge handles */}
        <div className={`${css.resizeHandle} ${css.resizeTop}`} onMouseDown={createResizeHandler('top')} />
        <div className={`${css.resizeHandle} ${css.resizeBottom}`} onMouseDown={createResizeHandler('bottom')} />
        <div className={`${css.resizeHandle} ${css.resizeLeft}`} onMouseDown={createResizeHandler('left')} />
        <div className={`${css.resizeHandle} ${css.resizeRight}`} onMouseDown={createResizeHandler('right')} />
      </div>

      {/* Text content */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className={css.textarea}
          value={localContent}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter text"
          spellCheck={false}
        />
      ) : (
        <div className={css.textDisplay}>
          {localContent ? (
            <div className={css.mainText}>
              {localContent}
            </div>
          ) : (
            <div style={{ color: '#999999', fontStyle: 'italic' }}>
              Click to edit
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TextField;
