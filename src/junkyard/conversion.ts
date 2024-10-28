import { PokeGenieMon, UsefulPokemon, UsefulPokemonArray, UsefulPokemonArrayWithoutShiny, UsefulPokemonWithoutShiny } from "./pokegenieParser"

const ensure = (e: any) => {
    return e ? e : "??"
}

export const convert: (bigMon: PokeGenieMon) => UsefulPokemonWithoutShiny = ({
    pokemonName,
    pokemonNumber,
    cp,
    shadowPokemon,
    imageId,
    captureDay,
    captureMonth,
    captureYear,
}) => (
    {
        pokemonName,
        pokemonNumber,
        cp,
        shadowPokemon: shadowPokemon !== 0,
        imageId,
        captureDate: `${ensure(captureYear)}/${ensure(captureMonth)}/${ensure(captureDay)}`
    }
)

export const convertToArray: (bigMon: UsefulPokemonWithoutShiny) => UsefulPokemonArrayWithoutShiny = (originalMon) => (
    [
        originalMon.pokemonName,
        originalMon.pokemonNumber,
        originalMon.cp,
        originalMon.shadowPokemon,
        originalMon.imageId,
        originalMon.captureDate
    ]
)

export const convertFromArray: (bigMon: UsefulPokemonArray) => UsefulPokemon = (arrayMon) => (
    {
        pokemonName: arrayMon[0],
        pokemonNumber: arrayMon[1],
        cp: arrayMon[2],
        shadowPokemon: arrayMon[3],
        imageId: arrayMon[4],
        captureDate: arrayMon[5],
        shinyOutput: arrayMon[6],
    }
)
