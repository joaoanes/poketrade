import React, { useState, useEffect } from 'react'
import spinnerStyles from '../app/spinner.module.css'
import PokeCircle from './PokeCircle'

type DelayedLazyLoadProps = {
  delay?: number;
  height: number;
  placeholder?: React.ReactNode;
  className: string,
  alt: string,
  src: string,
  shiny: boolean,
}

type PossibleImageStates = 'delayed' | 'loading' | 'loaded'

export const defaultPlaceholder = (
  <div
    className={spinnerStyles.spinnerContainerContainer}
  >
    <div className={spinnerStyles.spinnerContainer}>
      <div className={spinnerStyles.spinner} />
    </div>
  </div>
)

const DelayedLazyLoad: React.FC<DelayedLazyLoadProps> = ({
  delay = 1000, placeholder, alt, src, shiny
}) => {
  const [shouldLoad, setShouldLoad] = useState<PossibleImageStates>('delayed')

  useEffect(() => {
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        setShouldLoad('loading')
      })
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])


  return (
    <div className={spinnerStyles.delayedMainContainer}>
      {['delayed', 'loading'].includes(shouldLoad) && (placeholder || defaultPlaceholder)}
      {['loading', 'loaded'].includes(shouldLoad) && (
        
        <PokeCircle
          setShouldLoad={setShouldLoad}
          alt={alt}
          src={src}
          shiny={shiny}
        />
        
      )}
    </div>
  )
}

export default React.memo(DelayedLazyLoad)
