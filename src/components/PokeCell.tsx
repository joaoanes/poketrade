import React, { FC } from 'react'
import { GridChildComponentProps } from 'react-window'
import { UsefulPokemon } from "../junkyard/pokegenieParser"
import PokemonSquare from "./PokemonSquare"

interface CellProps extends GridChildComponentProps {
  data: {
    pokemons: UsefulPokemon[];
    columnCount: number;
    setSelected: (pokemon: UsefulPokemon) => void;
    isSelectedMap: Map<string, boolean>;
    toggleSelection: ((pokemon: UsefulPokemon) => void) | null | undefined;
  };
}

const PokeCell: FC<CellProps> = ({
  rowIndex,
  columnIndex,
  style,
  data
}) => {
  const {
    pokemons,
    columnCount,
    setSelected,
    isSelectedMap,
    toggleSelection
  } = data
  const index = rowIndex * columnCount + columnIndex
  const pokemon = pokemons[index]
  
  if (!pokemon) return <div style={style} />

  const isSelected = isSelectedMap.get(pokemon.imageId) || false

  return (
    <div
      style={{
        ...style,
        transform: `translate3d(${style.left}px, ${style.top}px, 0)`,
        position: 'absolute',
        willChange: 'transform',
        top: 0,
        left: 0,
      }}
      onClick={() => toggleSelection ? toggleSelection(pokemon) : setSelected(pokemon)}
    >
      <PokemonSquare
        pokemon={pokemon}
        quick={pokemons.length < 20}
        selected={isSelected}
      />
    </div>
  )
}

export default React.memo(PokeCell) 