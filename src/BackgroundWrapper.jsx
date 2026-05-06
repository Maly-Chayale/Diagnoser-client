import React from 'react';
import styles from './BackgroundWrapper.module.css';

const BackgroundWrapper = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.background}></div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;