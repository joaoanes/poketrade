#!/bin/bash

# Function to display usage information
usage() {
  echo "Usage: $0 -s <source_directory> [-d <destination_directory>]"
  exit 1
}

# Parse command-line arguments
while getopts ":s:d:" opt; do
  case ${opt} in
    s)
      source_dir=$OPTARG
      ;;
    d)
      destination_dir=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      usage
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      usage
      ;;
  esac
done

# Ensure the source directory and JSON file are provided
if [ -z "$source_dir" ]; then
  usage
fi

# Set default destination directory if not provided
if [ -z "$destination_dir" ]; then
  base_name=$(basename "$source_dir")
  parent_dir=$(dirname "$source_dir")
  destination_dir="$parent_dir/new$base_name"
fi

# Ensure the destination directory exists
mkdir -p "$destination_dir"

set -eo pipefail

# Path to the JSON file
json_file="../../src/data/filteredArrayWithShiny.json"

# Ensure the destination directory exists
mkdir -p "$destination_dir"

# Extract the fifth element from each sub-array in the JSON file and copy the corresponding files
jq -r 'map(.[4])[]' "$json_file" | while read -r filename; do
  src="$source_dir/$filename.png"
  dest="$destination_dir/$filename.png"
  if [ -f "$src" ]; then
    cp "$src" "$dest"
  else
    echo "File $src does not exist"
  fi
done
