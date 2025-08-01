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
  const [currentFile, setCurrentFile] = useState('/homework/page2/21-06-2005...');
  const [isMinimized, setIsMinimized] = useState(false);
  
  const categories = [
    { id: 'school', name: 'School', color: '#ffffff' },
    { id: 'work', name: 'work', color: '#ff69b4' },
    { id: 'todos', name: "ToDo's", color: '#ffffff' },
    { id: 'dump', name: 'Dump', color: '#ffffff' }
  ];

  const notes = {
    work: {
      content: `Montserrat ist diese Font Hier

on hover:
Montserrat ist diese Font Hier`,
      font: 'Montserrat'
    },
    school: {
      content: 'School notes content here...',
      font: 'Montserrat'
    },
    todos: {
      content: 'Todo items here...',
      font: 'Montserrat'
    },
    dump: {
      content: 'Random thoughts and ideas...',
      font: 'Montserrat'
    }
  };

  const value = {
    activeCategory,
    setActiveCategory,
    currentFile,
    setCurrentFile,
    isMinimized,
    setIsMinimized,
    categories,
    notes
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
