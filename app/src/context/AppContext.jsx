import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState('work');
  const [activePage, setActivePage] = useState('Page1');
  const [isMinimized, setIsMinimized] = useState(false);
  
  const categories = [
    { id: 'school', name: 'School', color: '#ffffff' },
    { id: 'work', name: 'work', color: '#ff69b4' },
    { id: 'todos', name: "ToDo's", color: '#ffffff' },
    { id: 'dump', name: 'Dump', color: '#ffffff' }
  ];

  // Pages structure: category -> pages -> elements
  const [pages, setPages] = useState({
    school: {
      Page1: {
        elements: [
          {
            id: 1,
            type: 'text',
            content: "School Notes - Page 1",
            x: 100,
            y: 100,
            width: 300,
            height: 60,
            isEditing: false
          }
        ]
      },
      Page2: {
        elements: [
          {
            id: 2,
            type: 'text',
            content: "School Notes - Page 2",
            x: 150,
            y: 150,
            width: 300,
            height: 60,
            isEditing: false
          }
        ]
      }
    },
    work: {
      Page1: {
        elements: [
          {
            id: 3,
            type: 'text',
            content: "Work Notes - Page 1 (Titel zeigt jetzt Kategorie/Seitenname)",
            x: 100,
            y: 100,
            width: 450,
            height: 80,
            isEditing: false
          }
        ]
      },
      Page2: {
        elements: [
          {
            id: 4,
            type: 'text',
            content: "Work Notes - Page 2",
            x: 200,
            y: 200,
            width: 350,
            height: 60,
            isEditing: false
          }
        ]
      }
    },
    todos: {
      Page1: {
        elements: [
          {
            id: 5,
            type: 'text',
            content: "Todo List - Page 1",
            x: 100,
            y: 100,
            width: 300,
            height: 60,
            isEditing: false
          }
        ]
      }
    },
    dump: {
      Page1: {
        elements: [
          {
            id: 6,
            type: 'text',
            content: "Random Ideas - Page 1",
            x: 100,
            y: 100,
            width: 300,
            height: 60,
            isEditing: false
          }
        ]
      }
    }
  });

  const [nextElementId, setNextElementId] = useState(7);

  // Get current file path for display - Format: <.../category/pagename...>
  const getCurrentFilePath = () => {
    return `/${activeCategory}/${activePage}...`;
  };

  // Get available pages for current category
  const getAvailablePages = () => {
    return Object.keys(pages[activeCategory] || {});
  };

  // Get current page elements
  const getCurrentPageElements = () => {
    return pages[activeCategory]?.[activePage]?.elements || [];
  };

  // Update elements for current page
  const updateCurrentPageElements = (newElements) => {
    setPages(prev => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        [activePage]: {
          ...prev[activeCategory][activePage],
          elements: newElements
        }
      }
    }));
  };

  // Add new page to current category
  const addNewPage = () => {
    const existingPages = getAvailablePages();
    const pageNumbers = existingPages
      .filter(page => page.startsWith('Page'))
      .map(page => parseInt(page.replace('Page', '')))
      .filter(num => !isNaN(num));
    
    const nextPageNumber = Math.max(...pageNumbers, 0) + 1;
    const newPageName = `Page${nextPageNumber}`;
    
    setPages(prev => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        [newPageName]: {
          elements: []
        }
      }
    }));
    
    setActivePage(newPageName);
    return newPageName;
  };

  // Delete page from current category
  const deletePage = (pageName) => {
    const availablePages = getAvailablePages();
    if (availablePages.length <= 1) return; // Don't delete last page
    
    setPages(prev => {
      const newCategoryPages = { ...prev[activeCategory] };
      delete newCategoryPages[pageName];
      
      return {
        ...prev,
        [activeCategory]: newCategoryPages
      };
    });
    
    // Switch to first available page if current page was deleted
    if (activePage === pageName) {
      const remainingPages = availablePages.filter(p => p !== pageName);
      setActivePage(remainingPages[0]);
    }
  };

  // Generate next element ID
  const getNextElementId = () => {
    const id = nextElementId;
    setNextElementId(prev => prev + 1);
    return id;
  };

  // Custom setActiveCategory that also sets first page
  const handleSetActiveCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const categoryPages = Object.keys(pages[categoryId] || {});
    if (categoryPages.length > 0) {
      setActivePage(categoryPages[0]);
    }
  };

  const value = {
    activeCategory,
    setActiveCategory: handleSetActiveCategory,
    activePage,
    setActivePage,
    isMinimized,
    setIsMinimized,
    categories,
    pages,
    getCurrentFilePath,
    getAvailablePages,
    getCurrentPageElements,
    updateCurrentPageElements,
    addNewPage,
    deletePage,
    getNextElementId
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
