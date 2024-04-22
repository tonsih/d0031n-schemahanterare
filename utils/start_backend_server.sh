#!/bin/sh

SCRIPT_DIR=$(dirname "$0")

cd "$SCRIPT_DIR/.."
java -jar "backend/target/time_edit-0.0.1-SNAPSHOT.jar"
    

