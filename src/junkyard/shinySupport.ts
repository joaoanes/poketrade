import { UsefulPokemon } from "./pokegenieParser"

const customResolvers : Record<string, (pokemon: IsShinyUsefulPokemonView) => boolean> = {
  unown: (pokemon) => pokemon.shinyOutput === 1,
  sprigatito: (pokemon) => pokemon.shinyOutput > 0.99999
}

const getShinyResolver = (pokemonName: string) => (
  customResolvers[pokemonName.toLocaleLowerCase()] 
  || ((pokemon: IsShinyUsefulPokemonView) => pokemon.shinyOutput > 0.999)
)

export type IsShinyUsefulPokemonView = Pick<UsefulPokemon, 'pokemonName' | 'shinyOutput'>
export const isShiny = (pokemon: IsShinyUsefulPokemonView) => {
  const resolver = getShinyResolver(pokemon.pokemonName)
  return resolver(pokemon)
}