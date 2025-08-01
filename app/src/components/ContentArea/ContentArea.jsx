import React from 'react';
import { useApp } from '../../context/AppContext';
import Canvas from '../Canvas/Canvas';
import css from './ContentArea.module.css';

function ContentArea() {
  const { activeCategory } = useApp();

  return (
    <div className={css.contentArea}>
      <Canvas />
    </div>
  );
}

export default ContentArea;
