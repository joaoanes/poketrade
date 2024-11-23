import { readFile, writeFile } from "fs/promises"

// Get the input file from the arguments
const [inputFile] = process.argv.slice(2)
if (!inputFile) {
  console.error("Usage: bun normalize.ts <inputFile>")
  process.exit(1)
}

const normalizeFile = async () => {
  try {
    // Read and parse the input file
    const data = JSON.parse(await readFile(inputFile, "utf8"))

    // Normalize the data
    const normalizedData = data.map((entry: any[]) => {
      const normalizedValue = entry[entry.length - 1] > 0.9999 ? 1 : 0
      return [...entry.slice(0, -1), normalizedValue]
    })

    // Write the normalized data to a new file
    const outputFile = inputFile.replace(/\.json$/, "_normalized.json")
    await writeFile(outputFile, JSON.stringify(normalizedData, null, 2))

    console.log(`Normalized file written to ${outputFile}`)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

normalizeFile()

