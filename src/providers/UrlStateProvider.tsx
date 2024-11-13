import { createContext, useCallback, useContext, ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TabId } from '@/data/tabs'

interface UrlState {
  tab?: TabId
  pokemon?: string | null
  shiny: boolean
  filter: string
}

interface UrlStateContextType {
  urlState: UrlState
  updateUrlState: (newState: Partial<UrlState>) => void
}

const UrlStateContext = createContext<UrlStateContextType | null>(null)

export function UrlStateProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const urlState: UrlState = {
    tab: searchParams.get('tab') as TabId | undefined,
    pokemon: searchParams.get('pokemon'),
    shiny: searchParams.get('shiny') === 'true',
    filter: searchParams.get('filter') || 'ALL'
  }

  const updateUrlState = useCallback((newState: Partial<UrlState>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    
    if (newState.tab) newParams.set('tab', newState.tab)
    else if (newState.tab === undefined) newParams.delete('tab')
    
    if (newState.pokemon) newParams.set('pokemon', newState.pokemon)
    else if (newState.pokemon === null) newParams.delete('pokemon')
    
    if (newState.shiny) {
      newParams.set('shiny', 'true')
    } else if (newState.shiny === false) {
      newParams.delete('shiny')
    }
    
    if (newState.filter && newState.filter !== 'ALL') {
      newParams.set('filter', newState.filter)
    } else {
      newParams.delete('filter')
    }
    
    router.push(`?${newParams.toString()}`)
  }, [router, searchParams])

  return (
    <UrlStateContext.Provider value={{ urlState, updateUrlState }}>
      {children}
    </UrlStateContext.Provider>
  )
}

export const useUrlState = () => {
  const context = useContext(UrlStateContext)
  if (!context) {
    throw new Error('useUrlState must be used within a UrlStateProvider')
  }
  return context
} 