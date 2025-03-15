#!/bin/bash



usage() {
    echo "Usage: $0 [input_file] [output_file]"
    echo
    echo "Arguments:"
    echo "  input_file   Path to the input JSON file (default: ./filteredArrayWithShiny.json)"
    echo "  output_file  Path to the output JSON file (default: same directory as input_file with 'unique_' prepended to the filename)"
    echo
    echo "If output_file is not provided, it defaults to the same directory as input_file"
    echo "with 'unique_' prepended to the filename."
}

input_file="./filteredArrayWithShiny.json"

if [[ $# -eq 1 ]]; then
    input_file="$1"
elif [[ $# -gt 2 ]]; then
    echo "Error: Too many arguments."
    usage
    exit 1
elif [[ $# -eq 2 ]]; then
    input_file="$1"
    output_file="$2"
else
    usage
    exit 1
fi

set -euxo pipefail

if [[ ! -f "$input_file" ]]; then
    echo "Error: Input file '$input_file' does not exist."
    exit 1
fi

if [[ $# -eq 1 ]]; then
    input_dir=$(dirname "$input_file")
    input_filename=$(basename "$input_file")
    output_file="$input_dir/unique_$input_filename"
fi

input_count=$(jq 'length' "$input_file")

jq -c 'unique_by([.[1], .[2], .[3], .[5]] | join("-")) | sort_by(.[1])' "$input_file" > "$output_file"

output_count=$(jq 'length' "$output_file")

difference=$((input_count - output_count))

echo "Filtered and unique data written to $output_file"
echo "Number of duplicates removed: $difference"

diff -u <(jq 'sort_by(.[4])' ../src/data/filteredArrayWithShiny.json) <(jq 'sort_by(.[4])' ../src/data/unique_filteredArrayWithShiny.json)
