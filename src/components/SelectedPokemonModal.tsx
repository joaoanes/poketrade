import React, { useRef, useCallback } from 'react'
import { FixedSizeList as List, ListChildComponentProps, ListOnScrollProps } from 'react-window'
import styles from '@/styles/modal.module.css'
import PokemonDetails from './PokemonDetails'
import { UsefulPokemon } from '@/junkyard/pokegenieParser'
import { debounce } from 'lodash'
import AnimatedList from './AnimatedList'
import { AutoSizer } from 'react-virtualized'
import { PokemonIds } from '@/providers/LanguageProvider'

export type SelectedPokemonModalProps = {
  selectedPokemon: UsefulPokemon;
  allPokemon: UsefulPokemon[];
  translatePokemonName: (id: PokemonIds) => string;
  setSelected: (pokemon: UsefulPokemon | null) => void;
  addToTradeList: (pokemon: UsefulPokemon) => void;
  removeFromTradeList: (pokemon: UsefulPokemon) => void;
  isOnTradeList: (pokemon: UsefulPokemon) => boolean;
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
  const listRef = useRef<List & {animatedScrollTo : (index: number) => void}>(null)

  const index = allPokemon.findIndex(({imageId}) => imageId === selectedPokemon.imageId)


  const Row = useCallback(({ index, style } : ListChildComponentProps) => (
    <div
      style={style}
    >
      <PokemonDetails
        pokemon={allPokemon[index]}
        translatePokemonName={translatePokemonName}
        addToTradeList={addToTradeList}
        removeFromTradeList={removeFromTradeList}
        isOnTradeList={isOnTradeList(allPokemon[index])}
      />
    </div>
  ), [])

  const myScroll 
    = (event: ListOnScrollProps, width: number) => {
      if (event.scrollOffset === 0 || !listRef.current || width === 0) {
        return
      }
      const index = Math.round(event.scrollOffset / width)
      console.log({
        event, index, width 
      })
      listRef.current.animatedScrollTo(index)
      setSelected(allPokemon[index])
    }
  

  return (
    <div
      onClick={() => setSelected(null)}
      className={styles.modalContainer}
    >
      <div
        className={styles.modalContent}
      >
        <AutoSizer>
          {({ width, height }) => {
            if (width === 0) return null 
            return (
              <AnimatedList
                ref={listRef}
                height={height}
                width={width}
                onScroll={debounce(e => myScroll(e, width), 200)} 
                itemSize={width}
                overscanCount={10}
                initialScrollOffset={index * width}
                itemCount={allPokemon.length}
                layout="horizontal"
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
