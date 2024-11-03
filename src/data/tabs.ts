import { LanguageTranslator } from "@/junkyard/useTranslation"
import { UsefulPokemon } from "../junkyard/pokegenieParser"

export type TabId = 'shortlist' | 'league' | 'special' | 'event'

export interface Tab {
  id: TabId
  icon: string
  subtext?: string
  title?: string
  subtitle?: string
  getPokemons: () => UsefulPokemon[]
  header?: boolean
  hide?: true
}

export const filterPokemonByIds = (pokemonList: UsefulPokemon[], ids: string[]): UsefulPokemon[] => {
  return pokemonList.filter(pokemon => ids.includes(pokemon.imageId))
}

export const createTabs = (
  tradeList: UsefulPokemon[], 
  fullList: UsefulPokemon[],
  t: LanguageTranslator
): Tab[] => [
  {
    id: 'shortlist',
    icon: './star.svg',
    title: t('shortlistTitle'),
    subtitle: t('shortlistSubtitle'),
    getPokemons: () => tradeList,
    subtext: `(${tradeList.length})`,
    header: true
  },
  {
    id: 'league',
    icon: './league.svg',
    title: t('leagueTitle'),
    subtitle: t('leagueSubtitle'),
    getPokemons: () => (
      fullList
        .filter(pokemon => pokemon.cp >= 2450 && pokemon.cp <= 2500)
        .concat(fullList.filter(pokemon => pokemon.cp >= 1450 && pokemon.cp <= 1500))
        .sort((a, b) => b.cp - a.cp)
    )
  },
  {
    id: 'special',
    hide: true,
    icon: './pikatail.svg',
    getPokemons: () => fullList.filter(pokemon => pokemon.pokemonName === 'Pikachu' && pokemon.shinyOutput === 1)
  },
  {
    id: 'event',
    hide: true,
    icon: './ic_event.png',
    getPokemons: () => [] // Fill with your event pokemon list
  }
] 