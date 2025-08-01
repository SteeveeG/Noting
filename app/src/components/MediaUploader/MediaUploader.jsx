import React, { useRef, useCallback } from 'react';
import css from './MediaUploader.module.css';

function MediaUploader({ onMediaAdd, isVisible, onClose }) {
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const mediaType = file.type.startsWith('image/') ? 'image' : 'pdf';
      
      if (mediaType === 'image' || file.type === 'application/pdf') {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const mediaSrc = event.target.result;
          
          // Create media object
          const mediaObject = {
            type: 'media',
            mediaType,
            mediaSrc,
            mediaName: file.name,
            width: mediaType === 'image' ? 300 : 250,
            height: mediaType === 'image' ? 200 : 180
          };
          
          onMediaAdd(mediaObject);
        };
        
        reader.readAsDataURL(file);
      }
    });
    
    // Reset input
    e.target.value = '';
    onClose();
  }, [onMediaAdd, onClose]);

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    
    files.forEach(file => {
      const mediaType = file.type.startsWith('image/') ? 'image' : 'pdf';
      
      if (mediaType === 'image' || file.type === 'application/pdf') {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const mediaSrc = event.target.result;
          
          const mediaObject = {
            type: 'media',
            mediaType,
            mediaSrc,
            mediaName: file.name,
            width: mediaType === 'image' ? 300 : 250,
            height: mediaType === 'image' ? 200 : 180
          };
          
          onMediaAdd(mediaObject);
        };
        
        reader.readAsDataURL(file);
      }
    });
    
    onClose();
  }, [onMediaAdd, onClose]);

  // Handle URL input for images
  const handleUrlSubmit = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('imageUrl');
    
    if (url) {
      const mediaObject = {
        type: 'media',
        mediaType: 'image',
        mediaSrc: url,
        mediaName: 'Image from URL',
        width: 300,
        height: 200
      };
      
      onMediaAdd(mediaObject);
      e.target.reset();
      onClose();
    }
  }, [onMediaAdd, onClose]);

  if (!isVisible) return null;

  return (
    <div className={css.uploaderOverlay} onClick={onClose}>
      <div className={css.uploaderModal} onClick={(e) => e.stopPropagation()}>
        <div className={css.uploaderHeader}>
          <h3 className={css.uploaderTitle}>Add Media</h3>
          <button className={css.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={css.uploaderContent}>
          {/* File Upload */}
          <div 
            className={css.dropZone}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className={css.dropZoneIcon}>📁</div>
            <div className={css.dropZoneText}>
              <div className={css.dropZoneTitle}>Drop files here or click to browse</div>
              <div className={css.dropZoneSubtitle}>Supports: Images (JPG, PNG, GIF, WebP) and PDF files</div>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={handleFileSelect}
            className={css.hiddenInput}
          />
          
          {/* URL Input */}
          <div className={css.urlSection}>
            <div className={css.sectionTitle}>Or add image from URL</div>
            <form onSubmit={handleUrlSubmit} className={css.urlForm}>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                className={css.urlInput}
              />
              <button type="submit" className={css.urlButton}>Add Image</button>
            </form>
          </div>
          
          {/* Quick Actions */}
          <div className={css.quickActions}>
            <div className={css.sectionTitle}>Quick Actions</div>
            <div className={css.actionButtons}>
              <button 
                className={css.actionButton}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className={css.actionIcon}>🖼️</span>
                Upload Images
              </button>
              <button 
                className={css.actionButton}
                onClick={() => {
                  fileInputRef.current.accept = '.pdf';
                  fileInputRef.current?.click();
                  fileInputRef.current.accept = 'image/*,.pdf';
                }}
              >
                <span className={css.actionIcon}>📄</span>
                Upload PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaUploader;
