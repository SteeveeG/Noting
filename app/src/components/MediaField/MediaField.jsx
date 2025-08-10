import React, { useState, useRef, useCallback } from 'react';
import css from './MediaField.module.css';

function MediaField({ 
  id, 
  mediaType, 
  mediaSrc, 
  mediaName,
  width, 
  height, 
  onDelete, 
  onResize
}) {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const resizeStateRef = useRef(null);

  // Media loading handlers
  const handleMediaLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleMediaError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Resize functionality
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

        // Maintain aspect ratio for images
        const aspectRatio = state.startWidth / state.startHeight;

        switch (state.direction) {
          case 'top':
            newHeight = Math.max(100, state.startHeight - deltaY);
            newY = state.startElementY + (state.startHeight - newHeight);
            if (mediaType === 'image') {
              newWidth = newHeight * aspectRatio;
              newX = state.startElementX + (state.startWidth - newWidth) / 2;
            }
            break;
          case 'bottom':
            newHeight = Math.max(100, state.startHeight + deltaY);
            if (mediaType === 'image') {
              newWidth = newHeight * aspectRatio;
              newX = state.startElementX + (state.startWidth - newWidth) / 2;
            }
            break;
          case 'left':
            newWidth = Math.max(100, state.startWidth - deltaX);
            newX = state.startElementX + (state.startWidth - newWidth);
            if (mediaType === 'image') {
              newHeight = newWidth / aspectRatio;
              newY = state.startElementY + (state.startHeight - newHeight) / 2;
            }
            break;
          case 'right':
            newWidth = Math.max(100, state.startWidth + deltaX);
            if (mediaType === 'image') {
              newHeight = newWidth / aspectRatio;
              newY = state.startElementY + (state.startHeight - newHeight) / 2;
            }
            break;
          case 'top-left':
            if (mediaType === 'image') {
              const newSize = Math.max(100, Math.min(state.startWidth - deltaX, (state.startHeight - deltaY) * aspectRatio));
              newWidth = newSize;
              newHeight = newSize / aspectRatio;
            } else {
              newWidth = Math.max(100, state.startWidth - deltaX);
              newHeight = Math.max(100, state.startHeight - deltaY);
            }
            newX = state.startElementX + (state.startWidth - newWidth);
            newY = state.startElementY + (state.startHeight - newHeight);
            break;
          case 'top-right':
            if (mediaType === 'image') {
              const newSize = Math.max(100, Math.min(state.startWidth + deltaX, (state.startHeight - deltaY) * aspectRatio));
              newWidth = newSize;
              newHeight = newSize / aspectRatio;
            } else {
              newWidth = Math.max(100, state.startWidth + deltaX);
              newHeight = Math.max(100, state.startHeight - deltaY);
            }
            newY = state.startElementY + (state.startHeight - newHeight);
            break;
          case 'bottom-left':
            if (mediaType === 'image') {
              const newSize = Math.max(100, Math.min(state.startWidth - deltaX, (state.startHeight + deltaY) * aspectRatio));
              newWidth = newSize;
              newHeight = newSize / aspectRatio;
            } else {
              newWidth = Math.max(100, state.startWidth - deltaX);
              newHeight = Math.max(100, state.startHeight + deltaY);
            }
            newX = state.startElementX + (state.startWidth - newWidth);
            break;
          case 'bottom-right':
            if (mediaType === 'image') {
              const newSize = Math.max(100, Math.min(state.startWidth + deltaX, (state.startHeight + deltaY) * aspectRatio));
              newWidth = newSize;
              newHeight = newSize / aspectRatio;
            } else {
              newWidth = Math.max(100, state.startWidth + deltaX);
              newHeight = Math.max(100, state.startHeight + deltaY);
            }
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
  }, [id, width, height, onResize, mediaType]);

  // Drag state - managed by parent DraggableElement
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragStop = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Delete handler
  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(id);
  }, [id, onDelete]);

  // Retry handler for failed media
  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
  }, []);

  // PDF action handlers
  const handlePdfOpen = useCallback(() => {
    window.open(mediaSrc, '_blank');
  }, [mediaSrc]);

  const handlePdfDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = mediaSrc;
    link.download = mediaName || 'document.pdf';
    link.click();
  }, [mediaSrc, mediaName]);

  // Media content renderer
  const renderMediaContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className={css.loadingState}>
          <div className={css.loadingSpinner}></div>
          <span>Loading...</span>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className={css.errorState}>
          <div className={css.errorIcon}>⚠</div>
          <span>Failed to load {mediaType}</span>
          <button className={css.retryButton} onClick={handleRetry}>
            Retry
          </button>
        </div>
      );
    }

    switch (mediaType) {
      case 'image':
        return (
          <img
            src={mediaSrc}
            alt={mediaName || 'Image'}
            className={css.mediaImage}
            onLoad={handleMediaLoad}
            onError={handleMediaError}
            draggable={false}
          />
        );
      case 'pdf':
        return (
          <div className={css.pdfContainer}>
            <div className={css.pdfIcon}>📄</div>
            <div className={css.pdfInfo}>
              <div className={css.pdfName}>{mediaName || 'Document.pdf'}</div>
              <div className={css.pdfActions}>
                <button className={css.pdfButton} onClick={handlePdfOpen}>
                  Open
                </button>
                <button className={css.pdfButton} onClick={handlePdfDownload}>
                  Download
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={css.unknownType}>
            <div className={css.unknownIcon}>📎</div>
            <span>Unknown media type</span>
          </div>
        );
    }
  }, [isLoading, hasError, mediaType, mediaSrc, mediaName, handleMediaLoad, handleMediaError, handleRetry, handlePdfOpen, handlePdfDownload]);

  return (
    <div 
      className={`${css.mediaField} ${isResizing ? css.resizing : ''} ${isDragging ? css.dragging : ''}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Drag areas */}
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

      {/* Media content */}
      <div className={css.mediaContent}>
        {renderMediaContent()}
      </div>

      {/* Media overlay with info and delete button */}
      <div className={css.mediaOverlay}>
        <div className={css.mediaInfo}>
          <span className={css.mediaType}>{mediaType.toUpperCase()}</span>
          {mediaName && <span className={css.mediaName}>{mediaName}</span>}
        </div>
        <button className={css.deleteButton} onClick={handleDelete} title="Delete media">
          ×
        </button>
      </div>

      {/* Resize handles */}
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
    </div>
  );
}

export default MediaField;