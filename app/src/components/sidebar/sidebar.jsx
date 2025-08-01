import React from 'react';
import { useApp } from '../../context/AppContext';
import css from './sidebar.module.css';

function Sidebar() {
  const { categories, activeCategory, setActiveCategory } = useApp();

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className={css.sidebar}>
      <div className={css.categoriesSection}>
        {categories.map((category) => (
          <div
            key={category.id}
            className={`${css.categoryItem} ${
              activeCategory === category.id ? css.active : ''
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </div>
        ))}
      </div>
      
      <div className={css.settingsSection}>
        <button className={css.settingsButton}>
          settings
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
