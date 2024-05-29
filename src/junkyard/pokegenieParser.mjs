import { readFile, writeFile } from "fs/promises"


const parseFile = async (filePath) => {
  const fileContent = await readFile(filePath, {encoding: "utf-8"})

  const hugeList = JSON.parse(fileContent)
  return hugeList
}


const ensure = (e) => {
    return e ? e : "??"
   }
   
   const convert = ({
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

const convertToArray = (originalMon) => (
  [
    originalMon.pokemonName,
    originalMon.pokemonNumber,
    originalMon.cp,
    originalMon.shadowPokemon,
    originalMon.imageId,
    originalMon.captureDate
  ]
) 

const handleConversion = async () => {
  const huge = await parseFile(process.argv[2])
  const filteredList = huge.map(convert).sort((a, b) => (a.pokemonNumber - b.pokemonNumber))
  await writeFile("./filteredList.json", JSON.stringify(filteredList))

  await writeFile("./filteredArray.json", JSON.stringify(filteredList.map(convertToArray)))
}

handleConversion()