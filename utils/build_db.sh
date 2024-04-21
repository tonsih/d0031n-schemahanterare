#!/bin/sh
    
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR/../db"
psql -f "time_edit.sql"
