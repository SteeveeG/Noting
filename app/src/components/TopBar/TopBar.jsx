import React from 'react';
import { useApp } from '../../context/AppContext';
import css from './TopBar.module.css';

function TopBar() {
  const { activeCategory, currentFile } = useApp();

  return (
    <div className={css.topBar}>
      <div className={css.leftSection}>
        <span className={css.notusText}>Notus</span>
        <span className={css.categoryTab}>{activeCategory}</span>
      </div>
      
      <div className={css.centerSection}>
        <span className={css.filePath}>
          &lt; ...{currentFile} &gt;
        </span>
      </div>
      
      <div className={css.rightSection}>
        <span className={css.windowControls}>Min Max Close</span>
      </div>
    </div>
  );
}

export default TopBar;
