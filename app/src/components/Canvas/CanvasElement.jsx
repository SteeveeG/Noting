import React from 'react';
import EditableTextBox from '../test/EditableTextBox';
import styles from './Canvas.module.css';

const CanvasElement = ({
  element,
  index,
  screenPos,
  zoom,
  isSelected,
  isDragging,
  texts,
  setTexts,
  onMouseDown,
  onClick
}) => {
  const handleTextChange = (newText) => {
    const updatedTexts = [...texts];
    updatedTexts[index] = { ...updatedTexts[index], content: newText };
    setTexts(updatedTexts);
  };

  return (
    <div
      key={`text-${element.id}`}
      className={`${styles.canvasElement} ${isSelected ? styles.selected : ''}`}
      style={{
        position: 'absolute',
        left: screenPos.x,
        top: screenPos.y,
        width: element.width * zoom,
        height: element.height * zoom,
        zIndex: isDragging ? 1000 : isSelected ? 100 : 1,
        pointerEvents: 'auto'
      }}
      onMouseDown={(e) => onMouseDown(e, index)}
      onClick={(e) => onClick(e, element.id)}
    >
      <EditableTextBox 
        initialText={element.content}
        onTextChange={handleTextChange}
        style={{
          width: '100%',
          height: '100%',
          fontSize: `${14 * zoom}px`
        }}
      />
      
      {isSelected && (
        <div className={styles.resizeHandles}>
          <div className={`${styles.resizeHandle} ${styles.handleN}`} data-handle="n" />
          <div className={`${styles.resizeHandle} ${styles.handleNE}`} data-handle="ne" />
          <div className={`${styles.resizeHandle} ${styles.handleE}`} data-handle="e" />
          <div className={`${styles.resizeHandle} ${styles.handleSE}`} data-handle="se" />
          <div className={`${styles.resizeHandle} ${styles.handleS}`} data-handle="s" />
          <div className={`${styles.resizeHandle} ${styles.handleSW}`} data-handle="sw" />
          <div className={`${styles.resizeHandle} ${styles.handleW}`} data-handle="w" />
          <div className={`${styles.resizeHandle} ${styles.handleNW}`} data-handle="nw" />
        </div>
      )}
    </div>
  );
};

export default CanvasElement;