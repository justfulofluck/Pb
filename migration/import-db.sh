#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DB_NAME="pinob_db"
DB_USER="pinoadmino"
DB_PASSWORD="pinopazz_intra"
DB_HOST="localhost"
DB_PORT="3306"

usage() {
    echo "Usage: $0 <dump_file> [OPTIONS]"
    echo ""
    echo "Arguments:"
    echo "  dump_file         Path to the .sql or .sql.gz dump file"
    echo ""
    echo "Options:"
    echo "  -h, --host        MySQL host (default: localhost)"
    echo "  -P, --port        MySQL port (default: 3306)"
    echo "  -u, --user        MySQL user (default: pinoadmino)"
    echo "  -p, --password    MySQL password"
    echo "  -d, --database    Database name (default: pinob_db)"
    echo "  --dry-run         Show what would be done without executing"
    echo "  -h, --help        Show this help message"
    exit 1
}

DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)
            DB_HOST="$2"
            shift 2
            ;;
        -P|--port)
            DB_PORT="$2"
            shift 2
            ;;
        -u|--user)
            DB_USER="$2"
            shift 2
            ;;
        -p|--password)
            DB_PASSWORD="$2"
            shift 2
            ;;
        -d|--database)
            DB_NAME="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        -*)
            echo "Unknown option: $1"
            usage
            ;;
        *)
            DUMP_FILE="$1"
            shift
            ;;
    esac
done

if [ -z "$DUMP_FILE" ]; then
    echo "Error: Dump file is required"
    usage
fi

if [ ! -f "$DUMP_FILE" ]; then
    echo "Error: File not found: $DUMP_FILE"
    exit 1
fi

EXTENSION="${DUMP_FILE##*.}"

echo "=========================================="
echo "Database Import Configuration"
echo "=========================================="
echo "Dump file: $DUMP_FILE"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Host: $DB_HOST:$DB_PORT"
echo "Compression: $EXTENSION"
echo "=========================================="

if [ "$DRY_RUN" = true ]; then
    echo "[DRY RUN] Would execute the following:"
    if [ "$EXTENSION" = "gz" ]; then
        echo "  gunzip -c $DUMP_FILE | mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD"
    else
        echo "  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD < $DUMP_FILE"
    fi
    exit 0
fi

echo "Importing database..."

if [ "$EXTENSION" = "gz" ]; then
    gunzip -c "$DUMP_FILE" | mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD"
else
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" < "$DUMP_FILE"
fi

echo "Database imported successfully!"
