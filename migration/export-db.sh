#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found at $ENV_FILE"
    exit 1
fi

source "$ENV_FILE"

DB_NAME="${DB_NAME:-pinob_db}"
DB_USER="${DB_USER:-pinoadmino}"
DB_PASSWORD="${DB_PASSWORD:-pinopazz_intra}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"

COMPRESS=false
OUTPUT_FILE=""

usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -c, --compress    Compress the dump with gzip"
    echo "  -o, --output      Custom output filename (without extension)"
    echo "  -h, --help        Show this help message"
    exit 1
}

while [[ $# -gt 0 ]]; do
    case $1 in
        -c|--compress)
            COMPRESS=true
            shift
            ;;
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

if [ -z "$OUTPUT_FILE" ]; then
    OUTPUT_FILE="${DB_NAME}_${TIMESTAMP}"
fi

DUMP_PATH="${SCRIPT_DIR}/${OUTPUT_FILE}.sql"
FINAL_FILE="${DUMP_PATH}"

if [ "$COMPRESS" = true ]; then
    FINAL_FILE="${DUMP_PATH}.gz"
fi

echo "Exporting database: $DB_NAME"
echo "Output: $FINAL_FILE"

if [ "$COMPRESS" = true ]; then
    mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" --add-drop-database --databases "$DB_NAME" | gzip > "$FINAL_FILE"
else
    mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" --add-drop-database --databases "$DB_NAME" > "$DUMP_PATH"
fi

echo "Dump completed: $FINAL_FILE"
ls -lh "$FINAL_FILE"
