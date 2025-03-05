import React, { useMemo, useCallback } from 'react'
import { VariableSizeGrid } from 'react-window'
import { UsefulPokemon } from '@/junkyard/pokegenieParser'
import styles from '@/styles/groupedPikachu.module.css'
import PokemonSquare from './PokemonSquare'
import { Lato } from 'next/font/google'
import { PikachuFormKeys } from '@/hooks/usePikachuForms'
import { ClassedAutoSizer } from './ClassedAutosizer'

const lato = Lato({
  weight: '400',
  subsets: ['latin'],
})

type GroupedPikachuListProps = {
  pokemons: UsefulPokemon[]
  setSelected: (pokemon: UsefulPokemon) => void
  getPikachuForm: (imageId: string) => PikachuFormKeys | undefined
  getGroupKey: (pokemon: UsefulPokemon) => string
  getGroupTitle: (key: string) => string
  width: number,
  height: number,
}
const COLUMN_WIDTH = 100
const HEADER_HEIGHT = 80
const CELL_HEIGHT = 120
const GroupedPikachuList: React.FC<GroupedPikachuListProps> = ({
  pokemons,
  setSelected,
  getGroupKey,
  getGroupTitle,
  width,
  height
}) => {
  const {
    items, rowHeights, columnCount 
  } = useMemo(() => {
    const groups = new Map<string, UsefulPokemon[]>()

    // Group Pokemons by the provided grouping function
    pokemons.forEach(pokemon => {
      const groupKey = getGroupKey(pokemon)
      if (!groups.has(groupKey)) {
        groups.set(groupKey, [])
      }
      groups.get(groupKey)?.push(pokemon)
    })

    const sortedGroups = Array.from(groups.entries())
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))

    // Calculate column count based on container width
    const containerWidth = width
    const columnCount = Math.floor(containerWidth / COLUMN_WIDTH)

    const items: (UsefulPokemon | string | null)[] = []
    const rowHeights: number[] = []

    sortedGroups.forEach(([key, groupPokemons]) => {
      items.push(key)
      for (let i = 1; i < columnCount; i++) {
        items.push(null)
      }
      rowHeights.push(HEADER_HEIGHT)

      const rowsNeeded = Math.ceil(groupPokemons.length / columnCount)
      for (let i = 0; i < rowsNeeded; i++) {
        const rowPokemons = groupPokemons.slice(i * columnCount, (i + 1) * columnCount)
        items.push(...rowPokemons)
        const padding = columnCount - rowPokemons.length
        for (let j = 0; j < padding; j++) {
          items.push(null)
        }
        rowHeights.push(CELL_HEIGHT)
      }
    })

    return {
      items, rowHeights, columnCount 
    }
  }, [pokemons, getGroupKey, width])

  const getRowHeight = useCallback((index: number) => rowHeights[index], [rowHeights])

  const PokemonCell = useCallback(({
    style,
    pokemon,
    totalCount,
    onSelect
  }: {
    style: React.CSSProperties,
    pokemon: UsefulPokemon,
    totalCount: number,
    onSelect: (pokemon: UsefulPokemon) => void
  }) => {
    return (
      <div 
        style={style}
        onClick={() => onSelect(pokemon)}
      >
        <PokemonSquare
          pokemon={pokemon}
          quick={totalCount < 20}
          selected={false}
        />
      </div>
    )
  }, [])

  const Cell = useCallback(({
    rowIndex, 
    columnIndex, 
    style,
    data
  }: {
    rowIndex: number,
    columnIndex: number,
    style: React.CSSProperties,
    data: any
  }) => {
    const itemIndex = rowIndex * data.columnCount + columnIndex
    const item = data.items[itemIndex]

    if (!item) {
      return null
    }

    if (typeof item === 'string') {
      return columnIndex === 0 ? (
        <div
          style={{
            ...style,
            width: '100%',
            left: 0,
            gridColumn: `span ${data.columnCount}`
          }}
          className={`${styles.formTitle} ${lato.className}`}
        >
          {data.getTranslation(item)}
        </div>
      ) : null
    }

    return (
      <PokemonCell
        style={style}
        pokemon={item}
        totalCount={data.pokemons.length}
        onSelect={data.setSelected}
      />
    )
  }, [PokemonCell])

  const getItemData = useCallback(() => ({
    items,
    columnCount,
    setSelected,
    pokemons,
    getTranslation: getGroupTitle
  }), [items, columnCount, pokemons, setSelected, getGroupTitle])

  const itemData = getItemData()
  
  return width === 0 || height === 0 ? null : (
    <VariableSizeGrid
      columnCount={columnCount}
      columnWidth={() => 100}
      height={height}
      overscanRowCount={10}
      rowCount={rowHeights.length}
      rowHeight={getRowHeight}
      width={width}
      itemData={itemData}
      itemKey={({columnIndex, rowIndex}) => {
        const item = items[rowIndex * columnCount + columnIndex]
        if (typeof item === 'string') {
          return `header-${item}`
        }
        if (item === null) {
          return `empty-${columnIndex}-${rowIndex}`
        }
        return item.imageId
      }}
    >
      {Cell}
    </VariableSizeGrid>
  )

}


type AutosizedGroupedPikachuListProps = Omit<GroupedPikachuListProps, "width" | "height">

const AutosizedGroupedPikachuList = (props: AutosizedGroupedPikachuListProps) => {
  return (
    <ClassedAutoSizer>
      {
        ({ width, height }) => (
          (width === 0 || height === 0) ? null : (
            <GroupedPikachuList 
              {...props} 
              width={width} 
              height={height} 
            />
          )
        )
      }
    </ClassedAutoSizer>
  )

}

export default AutosizedGroupedPikachuList