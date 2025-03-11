import React, { useRef, useCallback } from 'react'
import { FixedSizeList as List, ListChildComponentProps } from 'react-window'
import styles from '@/styles/modal.module.css'
import PokemonDetails from './PokemonDetails'
import { UsefulPokemon } from '@/junkyard/pokegenieParser'
import AnimatedList from './AnimatedList'
import { AutoSizer } from 'react-virtualized'
import { PokemonIds } from '@/providers/LanguageProvider'

export type SelectedPokemonModalProps = {
  selectedPokemon: UsefulPokemon
  allPokemon: UsefulPokemon[]
  translatePokemonName: (id: PokemonIds) => string
  setSelected: (pokemon: UsefulPokemon | null) => void
  addToTradeList: (pokemon: UsefulPokemon) => void
  removeFromTradeList: (pokemon: UsefulPokemon) => void
  isOnTradeList: (pokemon: UsefulPokemon) => boolean
}

export const SelectedPokemonModal: React.FC<SelectedPokemonModalProps> = ({
  selectedPokemon,
  allPokemon,
  translatePokemonName,
  setSelected,
  addToTradeList,
  removeFromTradeList,
  isOnTradeList,
}) => {
  const listRef = useRef<List & { animatedScrollTo: (index: number) => void }>(null)
  const widthRef = useRef<number>(0)

  const index = allPokemon.findIndex(({ imageId }) => imageId === selectedPokemon.imageId)

  const Row = useCallback(
    ({ index, style }: ListChildComponentProps) => (
      <div style={style}>
        <PokemonDetails
          pokemon={allPokemon[index]}
          translatePokemonName={translatePokemonName}
          addToTradeList={addToTradeList}
          removeFromTradeList={removeFromTradeList}
          isOnTradeList={isOnTradeList}
        />
      </div>
    ),
    [isOnTradeList] 
  )


  return (
    <div
      onClick={() => setSelected(null)}
      className={styles.modalContainer}
    >
      <div
        onClick={(e) => {
          e.stopPropagation()
        }}
        className={styles.modalContent}
      >
        <AutoSizer>
          {({ width, height }) => {
            if (width === 0) return null
            widthRef.current = width

            return (
              <AnimatedList
                ref={listRef}
                height={height}
                width={width}
                
                itemSize={width}
                initialScrollOffset={index * width}
                itemCount={allPokemon.length}
                layout="horizontal"
                onAnimationComplete={(index) => setSelected(allPokemon[index])}
                
              >
                {Row}
              </AnimatedList>
            )
          }}
        </AutoSizer>
      </div>
    </div>
  )
}
