import React, { useState, useRef, useEffect, useCallback } from 'react';
import css from './EditableTextBox.module.css';
import { CANVAS_CONFIG } from '../../constants/canvasConstants';

const EditableTextBox = ({ 
  initialText = "New Text",
  onTextChange,
  onEditingComplete,
  className,
  style 
}) => {
  const [editable, setEditable] = useState(false);
  const [showResizeBox, setShowResizeBox] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [text, setText] = useState(initialText);
  const wrapperRef = useRef(null);
  const textareaRef = useRef(null);
  const clickTimeout = useRef(null);

  useEffect(() => {
    if (editable && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editable]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        exitEditMode();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exitEditMode = useCallback(() => {
    setEditable(false);
    setShowResizeBox(false);
    onEditingComplete?.();
  }, [onEditingComplete]);

  const handleClick = () => {
    if (!editable) {
      clickTimeout.current = setTimeout(() => {
        setShowResizeBox(true);
      }, CANVAS_CONFIG.CLICK_TIMEOUT);
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    clearTimeout(clickTimeout.current);
    setEditable(true);
    setShowResizeBox(true);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange?.(newText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      exitEditMode();
    } else if (e.key === 'Escape') {
      exitEditMode();
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div
      ref={wrapperRef}
      className={`${css.wrapper} ${showResizeBox ? css.resizeBox : ''} ${className || ''}`}
      style={style}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <textarea
        ref={textareaRef}
        readOnly={!editable}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        className={`${css.textarea} ${!editable ? css.click : ''} ${isHovering && !editable ? css.hover : ''}`}
      />
    </div>
  );
};

export default EditableTextBox;
