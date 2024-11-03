import React from 'react'
import { FixedSizeGrid } from 'react-window'
import { AutoSizer } from 'react-virtualized'
import { UsefulPokemon } from "../junkyard/pokegenieParser"
import PokemonSquare from "./PokemonSquare" // Ensure correct import


type PokeListProps = {
  pokemons: UsefulPokemon[];
  setSelected: (a: UsefulPokemon) => void;
}

const VirtualPokeList: React.FC<PokeListProps> = ({ pokemons, setSelected }) => {
  // Memoize grid calculations to prevent recalculations on every render
  const getGridParams = React.useCallback(
    ({ width, height }: { width: number, height: number }) => {
      const columnWidth = 100
      const rowHeight = 120
      const columnCount = Math.floor(width / columnWidth)
      const rowCount = Math.ceil(pokemons.length / columnCount)
      return { 
        columnWidth,
        rowHeight,
        columnCount,
        rowCount,
        width,
        height 
      }
    }, 
    [pokemons.length]
  )

  // Memoize item data to prevent unnecessary re-renders
  const getItemData = React.useCallback((columnCount: number) => ({
    pokemons,
    columnCount,
    setSelected
  }), [pokemons, setSelected])

  // Memoize cell renderer to prevent recreation on every render
  const Cell = React.useCallback(({
    rowIndex, columnIndex, style, data 
  }: any) => {
    const { pokemons, columnCount, setSelected } = data
    const index = rowIndex * columnCount + columnIndex
    const pokemon = pokemons[index]

    if (!pokemon) return <div style={style} />

    return (
      <div 
        style={{
          ...style,
          // Force GPU acceleration and prevent layout recalculation
          transform: `translate3d(${style.left}px, ${style.top}px, 0)`,
          position: 'absolute',
          top: 0,
          left: 0,
          width: style.width,
          height: style.height,
          willChange: 'transform'
        }} 
        onClick={() => setSelected(pokemon)}
      >
        <PokemonSquare
          pokemon={pokemon}
          quick={pokemons.length < 20}
        />
      </div>
    )
  }, [])

  return (
    <AutoSizer>
      {(size) => {
        const { columnWidth, rowHeight, columnCount, rowCount, width, height } = getGridParams(size)
        const itemData = getItemData(columnCount)

        return (
          <FixedSizeGrid
            height={height}
            width={width}
            columnWidth={columnWidth}
            rowHeight={rowHeight}
            columnCount={columnCount}
            rowCount={rowCount}
            itemData={itemData}
            itemKey={({ columnIndex, rowIndex, data }) => 
              `${rowIndex}-${columnIndex}`} // Better key format
          >
            {Cell}
          </FixedSizeGrid>
        )
      }}
    </AutoSizer>
  )
}

export default React.memo(VirtualPokeList)
