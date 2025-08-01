import React from 'react';
import Canvas from '../Canvas/Canvas';
import css from './ContentArea.module.css';

function ContentArea() {
  return (
    <div className={css.contentArea}>
      <Canvas />
    </div>
  );
}

export default ContentArea;
