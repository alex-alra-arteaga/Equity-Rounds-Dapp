import React from 'react';
import styles from '../styles/App.Home.module.css'

const Background = ({ children }) => (
  <div className={styles.background}>
    {children}
  </div>
);

export default Background;
