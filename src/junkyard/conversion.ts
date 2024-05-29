import { PokeGenieMon, UsefulPokemon, UsefulPokemonArray } from "./pokegenieParser"

const ensure = (e: any) => {
    return e ? e : "??"
}

export const convert: (bigMon: PokeGenieMon) => UsefulPokemon = ({
    pokemonName,
    pokemonNumber,
    cp,
    shadowPokemon,
    imageId,
    captureDay,
    captureMonth,
    captureYear
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

export const convertToArray: (bigMon: UsefulPokemon) => UsefulPokemonArray = (originalMon) => (
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
    }
)
