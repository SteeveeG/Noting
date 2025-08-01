import React from 'react';
import { AppProvider } from '../../context/AppContext';
import TopBar from '../TopBar/TopBar';
import Sidebar from '../sidebar/Sidebar';
import ContentArea from '../ContentArea/ContentArea';
import css from './NotusApp.module.css';

function NotusApp() {
  return (
    <AppProvider>
      <div className={css.appContainer}>
        <div className={css.windowFrame}>
          <TopBar />
          <div className={css.mainContent}>
            <Sidebar />
            <ContentArea />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default NotusApp;
