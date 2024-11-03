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

  return (
    <AutoSizer>
      {({ height, width }) => {
        const columnWidth = 100
        const rowHeight = 120
        const columnCount = Math.floor(width / columnWidth)
        const rowCount = Math.ceil(pokemons.length / columnCount)

        return (
          <FixedSizeGrid

            height={height}
            width={width}
            columnWidth={columnWidth}
            rowHeight={rowHeight}
            columnCount={columnCount}
            rowCount={rowCount}
            
            itemData={{
              pokemons,
              columnCount,
              setSelected 
            }} // Pass data to optimize rendering
            itemKey={({
              columnIndex, rowIndex, data 
            }) =>
              rowIndex * data.columnCount + columnIndex} // Add a key to prevent unnecessary re-renders
          >
            {({
              rowIndex, columnIndex, style, data 
            }) => {
              const {
                pokemons, columnCount, setSelected 
              } = data
              const index = rowIndex * columnCount + columnIndex
              const pokemon = pokemons[index]

              return (
                <div style={style}>
                  {pokemon && (
                    <div onClick={() => setSelected(pokemon)}>
                      <PokemonSquare
                        pokemon={pokemon}
                        quick={pokemons.length < 20}
                      />
                    </div>
                  )}
                </div>
              )
            }}
          </FixedSizeGrid>
        )
      }}
    </AutoSizer>
  )
}

export default React.memo(VirtualPokeList)
