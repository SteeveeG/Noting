import React, { useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
import TextField from '../textfield/TextField';
import MediaField from '../MediaField/MediaField';
import MediaUploader from '../MediaUploader/MediaUploader';
import { useApp } from '../../context/AppContext';
import css from './Canvas.module.css';

function Canvas() {
  const { 
    activeCategory,
    activePage,
    getCurrentPageElements,
    updateCurrentPageElements,
    getNextElementId
  } = useApp();

  const canvasRef = useRef(null);
  const [showMediaUploader, setShowMediaUploader] = React.useState(false);
  const [showInstructions, setShowInstructions] = React.useState(true);

  const elements = getCurrentPageElements();

  // Add new text field on double click
  const handleCanvasDoubleClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newTextField = {
        id: getNextElementId(),
        type: 'text',
        content: "",
        x: Math.max(0, x - 100),
        y: Math.max(0, y - 30),
        width: 200,
        height: 60,
        isEditing: true
      };

      updateCurrentPageElements([...elements, newTextField]);
      setShowInstructions(false);
    }
  }, [elements, updateCurrentPageElements, getNextElementId]);

  // Add media element
  const handleMediaAdd = useCallback((mediaObject) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.width / 2 - mediaObject.width / 2;
    const centerY = rect.height / 2 - mediaObject.height / 2;

    const newMediaElement = {
      id: getNextElementId(),
      type: 'media',
      mediaType: mediaObject.mediaType,
      mediaSrc: mediaObject.mediaSrc,
      mediaName: mediaObject.mediaName,
      x: Math.max(0, centerX),
      y: Math.max(0, centerY),
      width: mediaObject.width,
      height: mediaObject.height
    };

    updateCurrentPageElements([...elements, newMediaElement]);
    setShowInstructions(false);
  }, [elements, updateCurrentPageElements, getNextElementId]);

  // Update element position after drag
  const handleDragStop = useCallback((id, data) => {
    const updatedElements = elements.map(element => 
      element.id === id 
        ? { ...element, x: Math.max(0, data.x), y: Math.max(0, data.y) }
        : element
    );
    updateCurrentPageElements(updatedElements);
  }, [elements, updateCurrentPageElements]);

  // Update text field content
  const handleTextChange = useCallback((id, newContent) => {
    const updatedElements = elements.map(element => 
      element.id === id 
        ? { ...element, content: newContent }
        : element
    );
    updateCurrentPageElements(updatedElements);
  }, [elements, updateCurrentPageElements]);

  // Toggle editing mode for text fields
  const handleTextFieldClick = useCallback((id) => {
    const updatedElements = elements.map(element => 
      element.id === id 
        ? { ...element, isEditing: true }
        : { ...element, isEditing: false }
    );
    updateCurrentPageElements(updatedElements);
    setShowInstructions(false);
  }, [elements, updateCurrentPageElements]);

  // Stop editing when clicking outside
  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      const updatedElements = elements.map(element => ({ 
        ...element, 
        isEditing: false 
      }));
      updateCurrentPageElements(updatedElements);
    }
  }, [elements, updateCurrentPageElements]);

  // Delete element
  const handleDeleteElement = useCallback((id) => {
    const updatedElements = elements.filter(element => element.id !== id);
    updateCurrentPageElements(updatedElements);
  }, [elements, updateCurrentPageElements]);

  // Resize element
  const handleResize = useCallback((id, newWidth, newHeight) => {
    const updatedElements = elements.map(element => 
      element.id === id 
        ? { ...element, width: newWidth, height: newHeight }
        : element
    );
    updateCurrentPageElements(updatedElements);
  }, [elements, updateCurrentPageElements]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      const updatedElements = elements.map(element => ({ 
        ...element, 
        isEditing: false 
      }));
      updateCurrentPageElements(updatedElements);
      setShowMediaUploader(false);
    }
    
    // Ctrl/Cmd + I for media upload
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      setShowMediaUploader(true);
    }
  }, [elements, updateCurrentPageElements]);

  // Add event listener for keyboard shortcuts
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset instructions when switching pages/categories
  React.useEffect(() => {
    setShowInstructions(elements.length === 0);
  }, [activeCategory, activePage, elements.length]);

  return (
    <div 
      className={css.canvas}
      ref={canvasRef}
      onDoubleClick={handleCanvasDoubleClick}
      onClick={handleCanvasClick}
    >
      {/* Canvas Instructions */}
      {showInstructions && (
        <div className={css.canvasInstructions}>
          <div className={css.instructionTitle}>
            {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} - {activePage}
          </div>
          <div className={css.instructionList}>
            <div>• Hover to see border and resize handles</div>
            <div>• Drag border to move elements</div>
            <div>• Use small squares to resize (like Word)</div>
            <div>• Double-click canvas to add text</div>
            <div>• Press Ctrl+I to add images/PDFs</div>
          </div>
        </div>
      )}

      {/* Media Upload Button */}
      <button 
        className={css.mediaButton}
        onClick={() => setShowMediaUploader(true)}
        title="Add Images/PDFs (Ctrl+I)"
      >
        📎
      </button>
      
      {/* Render all elements */}
      {elements.map((element) => (
        <Draggable
          key={element.id}
          position={{ x: element.x, y: element.y }}
          onStop={(e, data) => handleDragStop(element.id, data)}
          handle=".drag-handle"
          disabled={element.type === 'text' && element.isEditing}
          bounds="parent"
        >
          <div className={css.elementWrapper}>
            {element.type === 'text' ? (
              <TextField
                id={element.id}
                content={element.content}
                width={element.width}
                height={element.height}
                isEditing={element.isEditing}
                onTextChange={handleTextChange}
                onTextFieldClick={handleTextFieldClick}
                onDelete={handleDeleteElement}
                onResize={handleResize}
              />
            ) : (
              <MediaField
                id={element.id}
                mediaType={element.mediaType}
                mediaSrc={element.mediaSrc}
                mediaName={element.mediaName}
                width={element.width}
                height={element.height}
                onDelete={handleDeleteElement}
                onResize={handleResize}
              />
            )}
          </div>
        </Draggable>
      ))}

      {/* Media Uploader Modal */}
      <MediaUploader
        isVisible={showMediaUploader}
        onClose={() => setShowMediaUploader(false)}
        onMediaAdd={handleMediaAdd}
      />
    </div>
  );
}

export default Canvas;
