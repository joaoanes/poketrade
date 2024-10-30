const fs = require('fs');
const path = require('path');

const filteredArrayPath = path.join(__dirname, 'filteredArrayWithShiny.json');
const labelerResultsPath = path.join(__dirname, 'labelerResults.json');
const outputPath = path.join(__dirname, 'updatedFilteredArray.json');

// Load JSON files
const filteredArray = JSON.parse(fs.readFileSync(filteredArrayPath, 'utf-8'));
const labelerResults = JSON.parse(fs.readFileSync(labelerResultsPath, 'utf-8'));

// Map of species ID to Pokémon names for error report
const speciesNameMap = {};
filteredArray.forEach((entry) => {
  const [PokemonName, PokemonNumber] = entry;
  if (!speciesNameMap[PokemonNumber]) {
    speciesNameMap[PokemonNumber] = PokemonName;
  }
});

// Helper to find the error rate by species
function calculateErrorRates(originalData, labeledData) {
  const errorCounts = {};
  const totalCounts = {};

  labeledData.forEach((label) => {
    const { PokemonNumber, ImageId, isShiny } = label;
    const originalEntry = originalData.find(
      (entry) => entry[4] === ImageId // Match by ImageId
    );

    if (!originalEntry) return;

    const originalShiny = originalEntry[6] >= 0.99; // Original shiny prediction based on ShinyOutput

    // Track totals and errors per species
    if (!totalCounts[PokemonNumber]) {
      totalCounts[PokemonNumber] = 0;
      errorCounts[PokemonNumber] = 0;
    }
    totalCounts[PokemonNumber] += 1;

    if (originalShiny !== isShiny) {
      errorCounts[PokemonNumber] += 1;
    }
  });

  return { errorCounts, totalCounts };
}

// Update the filtered array with new labels
const updatedFilteredArray = filteredArray.map((entry) => {
  const [PokemonName, PokemonNumber, CP, ShadowPokemon, ImageId, CaptureDate, ShinyOutput] = entry;
  const labeledEntry = labelerResults.find((label) => label.ImageId === ImageId);

  if (labeledEntry) {
    return [
      PokemonName,
      PokemonNumber,
      CP,
      ShadowPokemon,
      ImageId,
      CaptureDate,
      labeledEntry.isShiny ? 1 : 0, // Update ShinyOutput (1 for shiny, 0 for non-shiny)
    ];
  }
  return entry; // Return original entry if no label found
});

// Calculate error rates and print top species with the most incorrect predictions
const { errorCounts, totalCounts } = calculateErrorRates(filteredArray, labelerResults);

console.log("Species with the highest prediction errors:");
const errorReport = Object.keys(errorCounts)
  .map((speciesId) => ({
    speciesId,
    speciesName: speciesNameMap[speciesId], // Get Pokémon name
    errorRate: (errorCounts[speciesId] / totalCounts[speciesId]) * 100,
    errorCount: errorCounts[speciesId],
    totalCount: totalCounts[speciesId],
  }))
  .sort((a, b) => b.errorRate - a.errorRate) // Sort by error rate in descending order
  .slice(0, 10); // Top 10 species

errorReport.forEach((report) => {
  console.log(
    `Species ID: ${report.speciesId} (${report.speciesName}) - Error Rate: ${report.errorRate.toFixed(2)}% (${report.errorCount}/${report.totalCount})`
  );
});

// Write updated filtered array to a new file
fs.writeFileSync(outputPath, JSON.stringify(updatedFilteredArray, null, 2), 'utf-8');
console.log(`\nUpdated filtered array written to ${outputPath}`);
