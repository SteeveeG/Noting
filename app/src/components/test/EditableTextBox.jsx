import React, { useState, useRef, useEffect } from 'react';
import css from './EditableTextBox.module.css';

const EditableTextBox = () => {
  const [editable, setEditable] = useState(false);
  const [showResizeBox, setShowResizeBox] = useState(false);
  const wrapperRef = useRef(null);
  const textareaRef = useRef(null);
  const clickTimeout = useRef(null);

  useEffect(() => {
    if (editable && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editable]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setEditable(false);
        setShowResizeBox(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = () => {
      clickTimeout.current = setTimeout(() => {
      setShowResizeBox(true);
      },  25);
  };
 

  const handleDoubleClick = (e) => {

    e.target.select();
    clearTimeout(clickTimeout.current);
    setEditable(true);
    setShowResizeBox(true);
  };

  return (
    <div
      ref={wrapperRef}
      className={`${css.wrapper} ${showResizeBox ? css.resizeBox : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <textarea
        ref={textareaRef}
        readOnly={editable === false}
        defaultValue="Montserrat ist diese Font Hier"
        className={`${css.textarea}  ${!editable ? css.click : ''} `}
      />
    </div>
  );
};

export default EditableTextBox;
