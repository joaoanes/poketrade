#!/bin/bash

set -euxo pipefail

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq command not found, please install jq to use this script."
    exit 1
fi

# Define the output file
OUTPUT_FILE="pokemonNames.json"
TEMP_DIR="./temp_pokemon_data"
TOTAL_POKEMON=1025

# Create the temporary directory
mkdir -p $TEMP_DIR

# Function to fetch data for a single Pokémon and write it to a temporary file
fetch_pokemon_data() {
  local id=$1
  local temp_file="$TEMP_DIR/$id.json"

  if [ -f "$temp_file" ]; then
    echo "Data for Pokémon ID: $id already exists, skipping request."
  else
    echo "Starting request for Pokémon ID: $id"
    local data=$(curl -s "https://pokeapi.co/api/v2/pokemon-species/${id}/")
    local en_name=$(echo $data | jq -r '.names[] | select(.language.name == "en") | .name')
    local ja_name=$(echo $data | jq -r '.names[] | select(.language.name == "ja-Hrkt") | .name')

    echo "{ \"$id\": { \"en\": \"$en_name\", \"ja\": \"$ja_name\" }}" > $temp_file
    echo "Finished request for Pokémon ID: $id"
  fi
}

export -f fetch_pokemon_data
export TEMP_DIR

# Fetch data for Pokémon with IDs from 1 to $TOTAL_POKEMON in parallel and show progress
seq 1 $TOTAL_POKEMON | pv -l -s $TOTAL_POKEMON | xargs -n 1 -P 10 bash -c 'fetch_pokemon_data "$@"' _

# Combine all temporary files into a single JSON object
jq -s 'add' $TEMP_DIR/*.json | jq 'to_entries | map({key: (.key|tostring), value}) | from_entries' > combined.json

# Sort the combined JSON file and create the final output
jq 'to_entries | sort_by(.key | tonumber) | from_entries' combined.json > $OUTPUT_FILE

# Clean up the intermediate file
rm combined.json

echo "Generated $OUTPUT_FILE"
