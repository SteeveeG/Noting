import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import css from './PageTabs.module.css';

function PageTabs() {
  const { 
    activePage, 
    setActivePage, 
    getAvailablePages, 
    addNewPage, 
    deletePage 
  } = useApp();
  
  const [showContextMenu, setShowContextMenu] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const availablePages = getAvailablePages();

  // Handle tab click
  const handleTabClick = (pageName) => {
    setActivePage(pageName);
    setShowContextMenu(null);
  };

  // Handle right click for context menu
  const handleTabRightClick = (e, pageName) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(pageName);
  };

  // Handle add new page
  const handleAddPage = () => {
    addNewPage();
    setShowContextMenu(null);
  };

  // Handle delete page
  const handleDeletePage = (pageName) => {
    if (availablePages.length > 1) {
      deletePage(pageName);
    }
    setShowContextMenu(null);
  };

  // Close context menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(null);
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu]);

  return (
    <div className={css.pageTabsContainer}>
      <div className={css.tabsList}>
        {availablePages.map((pageName) => (
          <div
            key={pageName}
            className={`${css.tab} ${activePage === pageName ? css.active : ''}`}
            onClick={() => handleTabClick(pageName)}
            onContextMenu={(e) => handleTabRightClick(e, pageName)}
          >
            <span className={css.tabText}>{pageName}</span>
            {availablePages.length > 1 && (
              <button
                className={css.closeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePage(pageName);
                }}
                title="Close page"
              >
                ×
              </button>
            )}
          </div>
        ))}
        
        <button className={css.addButton} onClick={handleAddPage} title="Add new page">
          +
        </button>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div 
          className={css.contextMenu}
          style={{ 
            left: contextMenuPosition.x, 
            top: contextMenuPosition.y 
          }}
        >
          <div className={css.contextMenuItem} onClick={handleAddPage}>
            <span className={css.contextIcon}>+</span>
            New Page
          </div>
          {availablePages.length > 1 && (
            <div 
              className={css.contextMenuItem} 
              onClick={() => handleDeletePage(showContextMenu)}
            >
              <span className={css.contextIcon}>×</span>
              Delete "{showContextMenu}"
            </div>
          )}
          <div className={css.contextSeparator}></div>
          <div className={css.contextMenuItem} onClick={() => setShowContextMenu(null)}>
            <span className={css.contextIcon}>↻</span>
            Rename Page
          </div>
        </div>
      )}
    </div>
  );
}

export default PageTabs;
