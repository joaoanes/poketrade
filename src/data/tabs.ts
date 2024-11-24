import { LanguageTranslator } from "@/providers/LanguageProvider"
import { UsefulPokemon } from "../junkyard/pokegenieParser"

export type TabId = 'shortlist' | 'league' | 'special' | 'event' | 'pikachu' | 'pokedex' | 'trade'

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
    id: 'special',
    hide: true,
    icon: './pikatail.svg',
    getPokemons: () => fullList.filter(pokemon => pokemon.pokemonName === 'Pikachu' && pokemon.shinyOutput === 1)
  },
  {
    id: 'event',
    icon: './ic_event.png',
    getPokemons: () => [], // Fill with your event pokemon list
    hide: true
  },
  {
    id: 'pikachu',
    icon: './pikatail.svg',
    getPokemons: () => fullList.filter(p => p.pokemonNumber === 25),
  },
  {
    id: 'pokedex',
    
    title: t('pokedexTitle'),
    icon: './ic_pokedex.png',
    getPokemons: () => fullList,
  },
  {
    id: 'trade',
    icon: './ic_trade.svg',
    title: t('tradeTitle'),
    subtitle: t('tradeSubtitle'),
    getPokemons: () => fullList.filter(p => [
      '5rijwdqqt99rzw',
      'xq1ojj4dfd4lgb',
      'q6eztrksps02ij',
      'zjuwevzq4c5iew',
      '3pmqnygfqlmnu1',
      'gwegbspgtcix6w',
      'icn8muwcp1w54l',
      's4iko4t2vwi2ez',
      'z7xfjog6df54jn',
      '3f5t3rghf7zfkh',
      'qbqphzfl0zi3n3',
      'z4xxbj62v1o3yd',
      'y6iopezz1410ah',
      'in4u0c6awwyedg',
      'wvxha7dhacz2f4',
      'n07ugbf1039gye',
      '0na86stdaysew5',
      'k2xpfizq15d3h7',
      'c3fgape2no6d3q',
      'xieu8z5jhd79le',
      'q5q5s6orefdej1',
      '6r3t5hhg8d8uei',
      'oyrkj4dshfveyr',
      '1evhep01tomvlr',
      '8fqxoh0gl5umgy',
      'qfirf5yxyj3ll5',
      '4meo119kxst7lt',
      'tk2i7ga8fry0mv',
      'dfblbfwdfjcye3',
      'abkedr7wgvz0bu',
      'jwuaw4lunryjhq',
      '200s0pbkcuzjei',
      '9yjobqamhd6kff',
      'hh8jby2ctwn944',
      '3uqrl2juwyn1gh',
      'kjv6pc56jyb8e6',
      'scago6y9t8px26',
      '65ld3i810bhxlc',
      '1bvymwx3lx9m21',
      'xn4zgniy064ix7',
      'h2hdgf3598sto6',
      'byjyj73z4am8ft',
      'flbf99fr4rfi3u',
      'l4nfj4wgzt5nah',
      'jotj51hupc5wzs',
      'ogwf00zfhbsbm2',
      'olwnb2ojcc2yvm',
      'f5172505isg5hm',
      'va7qlkynkyvdjz',
      'xftrd2c3d3lmus',
      'la2bbfqmp35lmk',
      'jcp2242zokql7q',
      '5cvcrawmwu38l8'
    ].includes(p.imageId)),
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
  }
] 