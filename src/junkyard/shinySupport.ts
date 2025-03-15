import { UsefulPokemon } from "./pokegenieParser"

const harshComparison = (pokemon: IsShinyUsefulPokemonView) => pokemon.shinyOutput === 1
const harshWhitelist = ['Unown'].map(e => e.toLocaleLowerCase())

export type IsShinyUsefulPokemonView = Pick<UsefulPokemon, 'pokemonName' | 'shinyOutput'>
export const isShiny = (pokemon: IsShinyUsefulPokemonView) => {
  if (harshWhitelist.includes(pokemon.pokemonName.toLocaleLowerCase())) {
    return harshComparison(pokemon)
  }
  return pokemon.shinyOutput > 0.999
}