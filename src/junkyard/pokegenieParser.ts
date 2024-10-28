import { readFile, writeFile } from "fs/promises"
import { convert, convertToArray } from "./conversion"

type NumberedString = string

type DateString = string

type LeagueResult = {
  "candyCostLower": number,
  "candyCostUpper": number,
  "dustCostLower": number,
  "dustCostUpper": number,
  "form": "Normal" | "Alola" | string,
  "league": number,
  "levelLower": number,
  "levelUpper": number,
  "maxCP": number,
  "pokeId": string,
  "pokeNum": number,
  "prodLower": number,
  "prodUpper": number,
  "rankAvg": number,
  "rankLower": number,
  "rankUpper": number,
  "shadow": number,
  "status": number,
  "xlCandyCostLower": number,
  "xlCandyCostUpper": number,
}

type IVCombination = {
  "attackIV": number,
  "defenseIV": number,
  "pokemonLevel": NumberedString,
  "staminaIV": number
}

export type PokeGenieMon =
  {
    "appOverallL": string,
    "appStatsL": string,
    "arcAngle": number,
    "avgAttackIV": number,
    "avgDefenseIV": number,
    "avgStaminaIV": number,
    "buddyBoost": boolean,
    "captureDay": number,
    "captureMonth": number,
    "capturePriority": number,
    "captureYear": number,
    "chargeMove": string | "",
    "chargeMove2": string | "",
    "cp": number,
    "cpNext": number,
    "defendingGym": boolean,
    "dust": number,
    "favSelection": number,
    "form": "Normal" | "Alola" | string,
    "gender": number,
    "hatchedFromEgg": boolean,
    "height": string | '',
    "hiddenPowerType": string | '',
    "hp": number,
    "id": string,
    "imageId": string,
    "isLuckyPokemon": boolean,
    "ivLower": number,
    "ivPercentage": number,
    "ivUpper": number,
    "maxAttackIV": number,
    "maxBattleIV": number,
    "maxCPLower": number,
    "maxCPUpper": number,
    "maxDefenseIV": number,
    "maxHPLower": number,
    "maxHPUpper": number,
    "maxStaminaIV": number,
    "megaSwitched": boolean,
    "minAttackIV": number,
    "minBattleIV": number,
    "minDefenseIV": number,
    "minStaminaIV": number,
    "pokemonLevelLower": NumberedString,
    "pokemonLevelUpper": string | '',
    "pokemonName": string,
    "pokemonNumber": number,
    "pvpGreatResult": LeagueResult,
    "pvpLittleResult": LeagueResult,
    "pvpPinned": boolean,
    "pvpSelected": boolean,
    "pvpStatus": number, // 3???? wtf is 3?
    "pvpUltraResult": LeagueResult,
    "quickMove": string,
    "scannedIvComb": IVCombination,
    "selectedMegaEvol": number,
    "setPokemonLevel": number,
    "shadowPokemon": number,
    "singleIVComb": boolean,
    "singleValidIvComb": IVCombination,
    "timeOfScan": DateString,
    "trainerLevel": number,
    "unread": boolean,
    "userManuallySetPokemonLevel": boolean,
    "weatherBoost": boolean,
    "weight": NumberedString | ''
  }

export type UsefulPokemonWithoutShiny = {
  pokemonName: string,
  pokemonNumber: number,
  cp: number,
  shadowPokemon: boolean, 
  imageId: string,
  captureDate: string,
}

export type UsefulPokemon = UsefulPokemonWithoutShiny & {
  shinyOutput: number
}

type PokemonName = string
type PokemonNumber = number
type CP = number
type ShadowPokemon = boolean
type ImageId = string
type CaptureDate = string
type ShinyOutput = number

export type UsefulPokemonArrayWithoutShiny = UsefulPokemonArray extends [...infer Rest, any] ? Rest : never

export type UsefulPokemonArray = [
  PokemonName, PokemonNumber, CP, ShadowPokemon, ImageId, CaptureDate, ShinyOutput
]
// TODO: branded types???

const parseFile : (filePath: string) => Promise<PokeGenieMon[]> = async (filePath) => {
  const fileContent : string = await readFile(filePath, {encoding: "utf-8"})

  const hugeList = JSON.parse(fileContent) as PokeGenieMon[]
  return hugeList
}

const handleConversion = async () => {
  const huge = await parseFile(process.argv[2])
  const filteredList = huge.map(convert).sort((a, b) => (a.pokemonNumber - b.pokemonNumber))
  await writeFile("./filteredList.json", JSON.stringify(filteredList))

  await writeFile("./filteredArray.json", JSON.stringify(filteredList.map(convertToArray)))
}

handleConversion()