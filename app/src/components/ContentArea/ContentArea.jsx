import React from 'react';
import { useApp } from '../../context/AppContext';
import css from './ContentArea.module.css';

function ContentArea() {
  const { activeCategory, notes } = useApp();
  const currentNote = notes[activeCategory];

  const formatContent = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.includes('on hover:')) {
        return (
          <div key={index}>
            <br />
            <span className={css.hoverLabel}>{line}</span>
          </div>
        );
      }
      
      if (line.trim() && !line.includes('on hover:')) {
        return (
          <div key={index} className={css.contentLine}>
            {line}
          </div>
        );
      }
      
      return <br key={index} />;
    });
  };

  return (
    <div className={css.contentArea}>
      <div className={css.noteContent}>
        {currentNote ? formatContent(currentNote.content) : (
          <div className={css.emptyState}>
            Select a category to view notes
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentArea;
