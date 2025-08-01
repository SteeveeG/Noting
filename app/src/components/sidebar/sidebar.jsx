import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import css from './sidebar.module.css';

function Sidebar() {
  const { 
    categories, 
    activeCategory, 
    setActiveCategory,
    activePage,
    setActivePage,
    pages,
    addNewPage,
    deletePage
  } = useApp();

  const [expandedCategories, setExpandedCategories] = useState({
    [activeCategory]: true // Expand active category by default
  });

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    
    // Auto-expand clicked category and collapse others
    setExpandedCategories({
      [categoryId]: true
    });
    
    // Switch to first page of the category
    const categoryPages = Object.keys(pages[categoryId] || {});
    if (categoryPages.length > 0) {
      setActivePage(categoryPages[0]);
    }
  };

  const toggleCategoryExpansion = (categoryId, e) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handlePageClick = (categoryId, pageName, e) => {
    e.stopPropagation();
    setActiveCategory(categoryId);
    setActivePage(pageName);
  };

  const handleAddPage = (categoryId, e) => {
    e.stopPropagation();
    setActiveCategory(categoryId);
    addNewPage();
  };

  const handleDeletePage = (categoryId, pageName, e) => {
    e.stopPropagation();
    const categoryPages = Object.keys(pages[categoryId] || {});
    if (categoryPages.length > 1) {
      deletePage(pageName);
    }
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const getCategoryPages = (categoryId) => {
    return Object.keys(pages[categoryId] || {});
  };

  return (
    <div className={css.sidebar}>
      <div className={css.categoriesSection}>
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const isExpanded = expandedCategories[category.id];
          const categoryPages = getCategoryPages(category.id);
          
          return (
            <div key={category.id} className={css.categoryGroup}>
              <div
                className={`${css.categoryItem} ${isActive ? css.active : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className={css.categoryContent}>
                  <span className={css.categoryName}>{category.name}</span>
                  {categoryPages.length > 0 && (
                    <button
                      className={css.expandButton}
                      onClick={(e) => toggleCategoryExpansion(category.id, e)}
                    >
                      {isExpanded ? '−' : '+'}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Pages List */}
              {isExpanded && categoryPages.length > 0 && (
                <div className={css.pagesContainer}>
                  {categoryPages.map((pageName) => (
                    <div
                      key={pageName}
                      className={`${css.pageItem} ${
                        isActive && activePage === pageName ? css.activePage : ''
                      }`}
                      onClick={(e) => handlePageClick(category.id, pageName, e)}
                    >
                      <span className={css.pageName}>{pageName}</span>
                      {categoryPages.length > 1 && (
                        <button
                          className={css.deletePageButton}
                          onClick={(e) => handleDeletePage(category.id, pageName, e)}
                          title="Delete page"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {/* Add Page Button */}
                  <div
                    className={css.addPageItem}
                    onClick={(e) => handleAddPage(category.id, e)}
                  >
                    <span className={css.addPageIcon}>+</span>
                    <span className={css.addPageText}>Add Page</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className={css.settingsSection}>
        <button className={css.settingsButton} onClick={handleSettingsClick}>
          settings
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
