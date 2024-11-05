import React, { useCallback, FC, useContext } from 'react'
import { FixedSizeGrid } from 'react-window'
import {AutoSizer} from 'react-virtualized'
import { UsefulPokemon } from "../junkyard/pokegenieParser"
import { SelectionContext } from './SelectionWrapper'
import PokeCell from './PokeCell'

type PokeListProps = {
  pokemons: UsefulPokemon[];
  setSelected: (a: UsefulPokemon) => void;
}

const VirtualPokeList: FC<PokeListProps> = ({ pokemons, setSelected }) => {
  const { selectedIds, toggleSelection } = useContext(SelectionContext)
  const isSelectedMap = React.useMemo(() => {
    const map = new Map<string, boolean>()
    selectedIds.forEach(id => map.set(id, true))
    return map
  }, [selectedIds])

  const getGridParams = useCallback(
    ({ width, height }: { width: number, height: number }) => {
      const columnWidth = 100
      const rowHeight = 120
      const columnCount = Math.floor(width / columnWidth) || 1 // Avoid division by zero
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
  const getItemData = useCallback((columnCount: number) => ({
    pokemons,
    columnCount,
    setSelected,
    isSelectedMap,
    toggleSelection,
  }), [pokemons, setSelected, isSelectedMap, toggleSelection])

  return (
    <AutoSizer>
      {(size) => {
        const { 
          columnWidth, 
          rowHeight, 
          columnCount, 
          rowCount, 
          width, 
          height 
        } = getGridParams(size)
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
            itemKey={
              ({
                columnIndex, rowIndex, data 
              }) => 
                `${data.pokemons[rowIndex * columnCount + columnIndex]?.imageId}`
            } // Better key format
          >
            {PokeCell}
          </FixedSizeGrid>
        )
      }}
    </AutoSizer>
  )
}

export default React.memo(VirtualPokeList)
