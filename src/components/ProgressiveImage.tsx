import { useState } from 'react'
import styles from '../styles/progressiveImage.module.css'
import { UsefulPokemon } from '@/junkyard/pokegenieParser'
import { S3_BUCKET_URL } from '@/junkyard/env'

type ProgressiveImageProps = {
  selectedPokemon: UsefulPokemon;
  alt: string;
  className?: string;
}

const ProgressiveImage = ({
  selectedPokemon, alt, className 
}: ProgressiveImageProps) => {
  const [highResLoaded, setHighResLoaded] = useState(false)

  const lowResSrc = `${S3_BUCKET_URL}/thumbs/${selectedPokemon.imageId}.png`
  const highResSrc = `${S3_BUCKET_URL}/pokes/${selectedPokemon.imageId}.png`

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <img
        src={lowResSrc}
        alt={alt}
        className={`${styles.image} ${styles.thumbnail}`}
      />
      <img
        src={highResSrc}
        alt={alt}
        className={`${styles.image} ${styles.fullImage} ${highResLoaded ? styles.fullImageLoaded : ''}`}
        onLoad={() => setHighResLoaded(true)}
      />
    </div>
  )
}

export default ProgressiveImage
