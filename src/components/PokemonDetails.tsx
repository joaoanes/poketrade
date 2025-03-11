import React from 'react'
import styles from '@/styles/modal.module.css'
import buttonStyles from '@/styles/common.module.css'
import { getPokemonNumberPadded } from '@/junkyard/misc'
import { UsefulPokemon } from '@/junkyard/pokegenieParser'
import { usePikachuForms } from '../hooks/usePikachuForms'
import { useTranslation } from '@/junkyard/useTranslation'
import ProgressiveImage from './ProgressiveImage'
import { PokemonIds } from '@/providers/LanguageProvider'

interface PokemonDetailsProps {
  pokemon: UsefulPokemon
  translatePokemonName: (id: PokemonIds) => string
  addToTradeList: (pokemon: UsefulPokemon) => void
  removeFromTradeList: (pokemon: UsefulPokemon) => void
  isOnTradeList: (pokemon: UsefulPokemon) => boolean
}

const PokemonDetails: React.FC<PokemonDetailsProps> = ({
  pokemon,
  translatePokemonName,
  addToTradeList,
  removeFromTradeList,
  isOnTradeList
}) => {
  const { getPikachuForm, loadPikachuForms } = usePikachuForms()
  const { t } = useTranslation()

  const onTradeList = isOnTradeList(pokemon)

  React.useEffect(() => {
    if (pokemon.pokemonNumber === 25) {
      loadPikachuForms()
    }
  }, [pokemon, loadPikachuForms])

  const pikachuForm = pokemon.pokemonNumber === 25
    ? getPikachuForm(pokemon.imageId)
    : undefined

  return (
    <div className={styles.infoBox}>
      <ProgressiveImage
        className={styles.bigImg}
        selectedPokemon={pokemon}
        alt={translatePokemonName(getPokemonNumberPadded(pokemon.pokemonNumber) as any)}
      />
      <div className={styles.right}>
        <div className={styles.modalName}>
          <div className={pokemon.shinyOutput === 1 ? styles.shiny : ''}>
            {translatePokemonName(getPokemonNumberPadded(pokemon.pokemonNumber) as any)}
          </div>
          <div className={styles.modalNumber}>
            #{pokemon.pokemonNumber}
          </div>
        </div>
        {pikachuForm && (
          <div className={styles.modalForm}>
            {t(`pikachuForms.${pikachuForm}`)}
          </div>
        )}
        <div className={styles.modalCp}>
          CP: {pokemon.cp}
        </div>
        <div className={styles.modalCaptured}>
          {t('capturedAt')}: {new Date(pokemon.captureDate).toLocaleDateString()}
        </div>

        <button
          className={`${buttonStyles.button} ${styles.modalButton}`}
          onClick={() => onTradeList ? removeFromTradeList(pokemon) : addToTradeList(pokemon)}
        >
          {onTradeList ? t('removeFromShortlist') : t('addToShortlist')}
          <img
            width={25}
            src='./star.svg'
            alt='star'
          />
        </button>
      </div>
    </div>
  )
}

export default React.memo(PokemonDetails)
