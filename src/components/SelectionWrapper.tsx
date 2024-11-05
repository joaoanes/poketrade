import { FC, useState, useCallback, PropsWithChildren, createContext } from 'react'
import { UsefulPokemon } from '@/junkyard/pokegenieParser'

export const SelectionContext = createContext<{
  selectedIds: Set<string>
  toggleSelection: ((pokemon: UsefulPokemon) => void) | null
}>({
      selectedIds: new Set(),
      toggleSelection: null
    })

const SelectionWrapper: FC<PropsWithChildren> = ({ children }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleSelection = useCallback((pokemon: UsefulPokemon) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(pokemon.imageId)) {
        newSet.delete(pokemon.imageId)
      } else {
        newSet.add(pokemon.imageId)
      }
      
      const selectedArray = Array.from(newSet)
      console.log(selectedArray)
      // @ts-ignore
      window.exportedIds = selectedArray
      
      return newSet
    })
  }, [])

  return (
    <SelectionContext.Provider value={{ selectedIds, toggleSelection }}>
      {children}
    </SelectionContext.Provider>
  )
}

export default SelectionWrapper 