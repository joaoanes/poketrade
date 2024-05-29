import React, { useState, useEffect } from 'react';
import styles from '../app/spinner.module.css'

type DelayedLazyLoadProps = {
  children: React.ReactNode;
  delay?: number;
  height: number;
  placeholder?: React.ReactNode;
};

const DelayedLazyLoad: React.FC<DelayedLazyLoadProps> = ({ children, delay = 1000, height, placeholder }) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const defaultPlaceholder = (
    <div
      style={{
        width: '100%',
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className={styles.spinner}/>
    </div>
  );

  return (
    <div style={{ height }}>
      {shouldLoad ? children : (placeholder || defaultPlaceholder)}
    </div>
  );
};

export default DelayedLazyLoad;
