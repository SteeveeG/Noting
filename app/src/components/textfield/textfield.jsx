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

  // Parse content to separate main text and sub text
  const parseContent = useCallback((text) => {
    if (!text) return { mainText: '', subText: '' };
    
    const match = text.match(/^(.*?)\s*\((.*?)\)\s*$/);
    if (match) {
      return {
        mainText: match[1].trim(),
        subText: match[2].trim()
      };
    }
    
    return { mainText: text, subText: '' };
  }, []);

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
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onTextFieldClick(null);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onTextFieldClick(null);
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
      
      // Get the element's position for position-based resizing
      const rect = e.currentTarget.closest(`.${css.textField}`).getBoundingClientRect();
      const startLeft = rect.left;
      const startTop = rect.top;
      
      resizeStateRef.current = {
        startX,
        startY,
        startWidth,
        startHeight,
        startLeft,
        startTop,
        direction,
        lastUpdate: 0
      };

      const handleMouseMove = (e) => {
        const now = Date.now();
        const state = resizeStateRef.current;
        
        // Throttle updates for performance
        if (now - state.lastUpdate < 16) return;
        state.lastUpdate = now;
        
        let newWidth = state.startWidth;
        let newHeight = state.startHeight;
        
        const deltaX = e.clientX - state.startX;
        const deltaY = e.clientY - state.startY;

        // RTF-style resizing logic
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

        // Smooth resizing with bounds checking
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

      // Set cursor for entire document during resize
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

  const { mainText, subText } = parseContent(localContent);

  return (
    <div 
      className={`${css.textField} ${isEditing ? css.editing : ''} ${isResizing ? css.resizing : ''} ${isDragging ? css.dragging : ''}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Drag area - entire border when not editing */}
      {!isEditing && (
        <div 
          className={`${css.dragArea} drag-handle`}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragStop}
        />
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
          onKeyDown={handleKeyPress}
          placeholder="Enter main text (optional sub text in parentheses)"
          spellCheck={false}
        />
      ) : (
        <div className={css.textDisplay}>
          {mainText && (
            <div className={css.mainText}>
              {mainText}
            </div>
          )}
          {subText && (
            <div className={css.subText}>
              ({subText})
            </div>
          )}
          {!mainText && !subText && (
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
