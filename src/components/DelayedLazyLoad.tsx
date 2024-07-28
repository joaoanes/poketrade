import React, { useState, useEffect } from 'react';
import styles from '../app/spinner.module.css'

type DelayedLazyLoadProps = {
  delay?: number;
  height: number;
  placeholder?: React.ReactNode;
  className: string,
  alt: string,
  src: string,
};

type PossibleImageStates = 'delayed' | 'loading' | 'loaded'

const DelayedLazyLoad: React.FC<DelayedLazyLoadProps> = ({ delay = 1000, height, placeholder, className, alt, src }) => {
  const [shouldLoad, setShouldLoad]  = useState<PossibleImageStates>('delayed');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad('loading');
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
  )

  return (
    <div style={{ height }}>
      { ['delayed', 'loading'].includes(shouldLoad) ? (placeholder || defaultPlaceholder) : null }
      { ['loading', 'loaded'].includes(shouldLoad) ? <img onLoad={() =>  setShouldLoad('loaded')} className={className} alt={alt} src={src} /> : null }
    </div>
  );
};

export default DelayedLazyLoad;
