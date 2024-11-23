import { readFile, writeFile } from "fs/promises"

// Get arguments
const [oldFilePath, newFilePath] = process.argv.slice(2)
if (!oldFilePath || !newFilePath) {
  console.error("Usage: bun merge.ts <oldFilePath> <newFilePath>")
  process.exit(1)
}

const mergeJson = async () => {
  try {
    // Read and parse files
    const oldFileData = JSON.parse(await readFile(oldFilePath, "utf8"))
    const newFileData = JSON.parse(await readFile(newFilePath, "utf8"))

    const oldFileMap = new Map(oldFileData.map((entry: any[]) => [entry[4], entry]))

    const mergedData: any[] = []

    for (const newEntry of newFileData) {
      const id = newEntry[4]
      const oldEntry = oldFileMap.get(id)

      if (!oldEntry) {
        // If not in the old file, add new entry to merged file
        mergedData.push(newEntry)
      } else {
        // Compare the last two fields
        const oldLastTwo = oldEntry.slice(-2)
        const newLastTwo = newEntry.slice(-2)

        if (JSON.stringify(oldLastTwo) !== JSON.stringify(newLastTwo)) {
          // Output IDs with discrepancies and write old data to merged file
          console.log(`ID: ${id}`)
          console.log(`Old: ${JSON.stringify(oldLastTwo)}`)
          console.log(`New: ${JSON.stringify(newLastTwo)}`)

          mergedData.push(oldEntry)
        } else {
          // No discrepancy, write old data to merged file
          mergedData.push(oldEntry)
        }
      }
    }

    // Write merged data to file
    await writeFile("./merge.json", JSON.stringify(mergedData, null, 2))
    console.log("Merged file written to ./merge.json")
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

mergeJson()

