#!/bin/bash

DB_NAME="${DB_NAME:-pinob_db}"
DB_USER="${DB_USER:-pinoadmino}"
DB_PASSWORD="${DB_PASSWORD:-pinopazz_intra}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"

BACKUP_DIR="$(dirname "$0")/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql"

mkdir -p "$BACKUP_DIR"

echo "Backing up database: $DB_NAME"

mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Backup saved to: $BACKUP_FILE"
    
    echo "Compressing backup..."
    gzip "$BACKUP_FILE"
    echo "Backup complete: ${BACKUP_FILE}.gz"
else
    echo "Backup failed!"
    exit 1
fi
