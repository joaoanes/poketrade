import { UsefulPokemon } from "./pokegenieParser"

const harshComparison = (pokemon: UsefulPokemon) => pokemon.shinyOutput === 1
const harshWhitelist = ['Unown'].map(e => e.toLocaleLowerCase())

export const isShiny = (pokemon: UsefulPokemon) => {
  if (harshWhitelist.includes(pokemon.pokemonName.toLocaleLowerCase())) {
    return harshComparison(pokemon)
  }
  return pokemon.shinyOutput > 0.999
}