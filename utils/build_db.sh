#!/bin/sh

SCRIPT_DIR=$(dirname "$0")

ABS_SCRIPT_DIR=$(cd "$SCRIPT_DIR"; pwd)

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <relative or absolute path to the CSV file>"
    exit 1
fi

FILENAME=$(cd "$(dirname "$1")"; pwd)/$(basename "$1")

cd "$ABS_SCRIPT_DIR/../db"

sed "s|{{filename}}|$FILENAME|g" time_edit.sql | psql
