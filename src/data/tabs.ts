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
      '5cvcrawmwu38l8',
      'fyd1098aokucbo',//mewtwo
      '51whfql7765b2z',
      'fx2ez8k6rpaiy6',
      'e30jj5l0tfnb41',
      'fsr1c46hu6vcv1',
      '3uwo13v38jdh3j', //farfetchds japan
      '1vsv6k88ik3jhi', 
      'smpvd29kmwrsd5', 
      'y6hvu0tgmhijns', //heracrosses,
      'z8tv7dhi4vlvsf',
      'o6dhwym59tr8p4', //taurus,
      '9a5u8ee8h2lktm',
      'fkzwbt6o53qxq8',
      '3toa1f96ayieow', //tropius
      '8ww5vjare0qm5y',
      'zl8ni2ihz3zd9w',
      '840mvm9ouj03k5', //carnivines
      '9i0s8spd9e1xx6',
      'xe7opt3eaelq89',
      'cg93gdkspdrxnu',
      'slc6056tow028y',
      'eby8in4t5vu8zg', //furfrouus
      'ae2eypt54ckr5w',
      'tayohm9dh6zryr'// corsola
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