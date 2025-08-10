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
  const [hasSelectedAll, setHasSelectedAll] = useState(false);
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
      setHasSelectedAll(false);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.select();
          setHasSelectedAll(true);
        }
      }, 10);
    }
  }, [isEditing]);

  // Simple click handler for textarea
  const handleTextareaClick = useCallback((e) => {
    if (!textareaRef.current || !hasSelectedAll) return;

    // If all text was selected and user clicks, check if they clicked in empty space
    const textarea = textareaRef.current;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const textLength = textarea.value.length;

    // If all text was selected (full selection)
    if (selectionStart === 0 && selectionEnd === textLength) {
      // Simple approach: if user clicks beyond half the textarea width/height, move to end
      const rect = textarea.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Check if click is in the right half or bottom half of textarea
      if (clickX > rect.width * 0.6 || clickY > rect.height * 0.6) {
        setTimeout(() => {
          if (textareaRef.current) {
            const length = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(length, length);
            setHasSelectedAll(false);
          }
        }, 0);
      } else {
        setHasSelectedAll(false);
      }
    }
  }, [hasSelectedAll]);

  // Handle text change
  const handleTextChange = useCallback((e) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    onTextChange(id, newContent);
    setHasSelectedAll(false);
  }, [id, onTextChange]);

  // Handle click on text field container
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

  // Handle key events
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onTextFieldClick(null);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onTextFieldClick(null);
    }
    // Tab key works normally - no special handling needed
  }, [onTextFieldClick]);

  // Resize handler
  const createResizeHandler = useCallback((direction) => {
    return (e) => {
      e.stopPropagation();
      setIsResizing(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = width;
      const startHeight = height;

      // Get current position from DraggableElement parent
      const draggableElement = e.target.closest('.elementWrapper');
      const rect = draggableElement?.getBoundingClientRect();
      const parentRect = draggableElement?.offsetParent?.getBoundingClientRect();
      const startElementX = rect && parentRect ? rect.left - parentRect.left : 0;
      const startElementY = rect && parentRect ? rect.top - parentRect.top : 0;

      resizeStateRef.current = {
        startX,
        startY,
        startWidth,
        startHeight,
        startElementX,
        startElementY,
        direction,
        lastUpdate: 0
      };

      const handleMouseMove = (e) => {
        const now = Date.now();
        const state = resizeStateRef.current;

        if (!state || now - state.lastUpdate < 16) return;
        state.lastUpdate = now;

        // Get current element position and size (not start values!)
        const draggableElement = e.target.closest('.elementWrapper');
        const currentRect = draggableElement?.getBoundingClientRect();
        const parentRect = draggableElement?.offsetParent?.getBoundingClientRect();
        const currentElementX = currentRect && parentRect ? currentRect.left - parentRect.left : state.startElementX;
        const currentElementY = currentRect && parentRect ? currentRect.top - parentRect.top : state.startElementY;
        const currentWidth = width;  // Use current prop values
        const currentHeight = height;

        let newWidth = currentWidth;
        let newHeight = currentHeight;
        let newX = currentElementX;
        let newY = currentElementY;

        const deltaX = e.clientX - state.startX;
        const deltaY = e.clientY - state.startY;

        switch (state.direction) {
          case 'top':
            newHeight = Math.max(60, state.startHeight - deltaY);
            newY = state.startElementY + (currentHeight - newHeight);
            break;
          case 'bottom':
            newHeight = Math.max(60, state.startHeight + deltaY);
            break;
          case 'left':
            newWidth = Math.max(200, state.startWidth - deltaX);
            newX = state.startElementX + (currentWidth - newWidth);
            break;
          case 'right':
            newWidth = Math.max(200, state.startWidth + deltaX);
            break;
          case 'top-left':
            newWidth = Math.max(200, state.startWidth - deltaX);
            newHeight = Math.max(60, state.startHeight - deltaY);
            newX = state.startElementX + (currentWidth - newWidth);
            newY = state.startElementY + (currentHeight - newHeight);
            break;
          case 'top-right':
            newWidth = Math.max(200, state.startWidth + deltaX);
            newHeight = Math.max(60, state.startHeight - deltaY);
            newY = state.startElementY + (currentHeight - newHeight);
            break;
          case 'bottom-left':
            newWidth = Math.max(200, state.startWidth - deltaX);
            newHeight = Math.max(60, state.startHeight + deltaY);
            newX = state.startElementX + (currentWidth - newWidth);
            break;
          case 'bottom-right':
            newWidth = Math.max(200, state.startWidth + deltaX);
            newHeight = Math.max(60, state.startHeight + deltaY);
            break;
        }

        if (newWidth !== currentWidth || newHeight !== currentHeight || newX !== currentElementX || newY !== currentElementY) {
          onResize(id, Math.round(newWidth), Math.round(newHeight), Math.round(newX), Math.round(newY));
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


  return (
    <div
      className={`${css.textField} ${isEditing ? css.editing : ''} ${isResizing ? css.resizing : ''} ${isDragging ? css.dragging : ''}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >

      {!isEditing && (
        <>
          <div
            className={`${css.dragBorderTop} drag-handle`}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className={`${css.dragBorderBottom} drag-handle`}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className={`${css.dragBorderLeft} drag-handle`}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className={`${css.dragBorderRight} drag-handle`}
            onClick={(e) => e.stopPropagation()}
          />
        </>
      )}

      <div className={css.resizeHandles}>
        <div className={`${css.resizeHandle} ${css.resizeTopLeft}`} onMouseDown={createResizeHandler('top-left')} />
        <div className={`${css.resizeHandle} ${css.resizeTopRight}`} onMouseDown={createResizeHandler('top-right')} />
        <div className={`${css.resizeHandle} ${css.resizeBottomLeft}`} onMouseDown={createResizeHandler('bottom-left')} />
        <div className={`${css.resizeHandle} ${css.resizeBottomRight}`} onMouseDown={createResizeHandler('bottom-right')} />
        <div className={`${css.resizeHandle} ${css.resizeTop}`} onMouseDown={createResizeHandler('top')} />
        <div className={`${css.resizeHandle} ${css.resizeBottom}`} onMouseDown={createResizeHandler('bottom')} />
        <div className={`${css.resizeHandle} ${css.resizeLeft}`} onMouseDown={createResizeHandler('left')} />
        <div className={`${css.resizeHandle} ${css.resizeRight}`} onMouseDown={createResizeHandler('right')} />
      </div>

      {/* Content */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className={css.textarea}
          value={localContent}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onClick={handleTextareaClick}
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
