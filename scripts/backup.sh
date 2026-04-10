#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
#  SNS Hotels POS — PostgreSQL Backup Script
#  Schedule: Run daily via cron or systemd timer
#  Cron:  0 2 * * * /opt/sns-pos/scripts/backup.sh >> /var/log/sns-backup.log 2>&1
# ═══════════════════════════════════════════════════════════════════════════════
set -euo pipefail

# Config (set via environment or edit here)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-sns_pos_db}"
DB_USER="${DB_USER:-sns_user}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/sns-pos}"
S3_BUCKET="${AWS_S3_BUCKET:-sns-pos-backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/sns_pos_$DATE.sql.gz"

GREEN='\033[0;32m'; RED='\033[0;31m'; NC='\033[0m'
info() { echo -e "${GREEN}[BACKUP $(date +%T)]${NC} $1"; }
fail() { echo -e "${RED}[ERROR $(date +%T)]${NC} $1"; exit 1; }

# 1. Create backup directory
mkdir -p "$BACKUP_DIR"
info "Starting backup → $BACKUP_FILE"

# 2. Dump and compress
PGPASSWORD="${PGPASSWORD}" pg_dump \
  -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" \
  --format=plain --no-password \
  | gzip > "$BACKUP_FILE" || fail "pg_dump failed"

SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
info "Backup complete: $SIZE"

# 3. Upload to S3 (if AWS CLI available)
if command -v aws >/dev/null 2>&1; then
  info "Uploading to S3: s3://$S3_BUCKET/db/$DATE/"
  aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/db/sns_pos_$DATE.sql.gz" \
    --storage-class STANDARD_IA || info "S3 upload failed (non-fatal)"
  info "S3 upload complete"
fi

# 4. Delete backups older than retention days
info "Removing backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "sns_pos_*.sql.gz" -mtime +$RETENTION_DAYS -delete
REMAINING=$(ls "$BACKUP_DIR" | wc -l)
info "Remaining backups: $REMAINING"

info "✔ Backup done: $BACKUP_FILE"
