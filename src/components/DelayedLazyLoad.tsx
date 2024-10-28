import React, { useState, useEffect } from 'react';
import spinnerStyles from '../app/spinner.module.css'
import styles from "../app/page.module.css";
import PokeCircle from './PokeCircle';

type DelayedLazyLoadProps = {
  delay?: number;
  height: number;
  placeholder?: React.ReactNode;
  className: string,
  alt: string,
  src: string,
  shiny: boolean,
};

type PossibleImageStates = 'delayed' | 'loading' | 'loaded'

const DelayedLazyLoad: React.FC<DelayedLazyLoadProps> = ({ delay = 1000, height, placeholder, className, alt, src, shiny }) => {
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
      <div className={spinnerStyles.spinner}/>
    </div>
  )

  return (
    <div style={{ height }}>
      { ['delayed', 'loading'].includes(shouldLoad) ? (placeholder || defaultPlaceholder) : null }
      { ['loading', 'loaded'].includes(shouldLoad) ? 
      <PokeCircle setShouldLoad={setShouldLoad} alt={alt} src={src} shiny={shiny} /> : null }
    </div>
  );
};

export default DelayedLazyLoad;
