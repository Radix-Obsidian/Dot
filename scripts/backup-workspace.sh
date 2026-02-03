#!/usr/bin/env bash
set -euo pipefail

# Backup OpenClaw workspace: git (private repo) + encrypted archive.
WORKSPACE="$HOME/.openclaw/workspace"
ARCHIVE_DIR="$HOME/.openclaw/backups"
mkdir -p "$ARCHIVE_DIR"

if [ ! -d "$WORKSPACE" ]; then
  echo "Workspace not found at $WORKSPACE" >&2
  exit 1
fi

cd "$WORKSPACE"

if [ ! -d .git ]; then
  git init
  git add AGENTS.md SOUL.md TOOLS.md IDENTITY.md USER.md HEARTBEAT.md memory/ 2>/dev/null || true
  git commit -m "Add agent workspace" || true
fi

echo "Enter private GitHub remote URL (or leave blank to skip):"
read -r REMOTE_URL
if [ -n "$REMOTE_URL" ]; then
  if ! git remote get-url origin >/dev/null 2>&1; then
    git branch -M main
    git remote add origin "$REMOTE_URL"
  fi
  git push -u origin main
fi

TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
ARCHIVE_TAR="$ARCHIVE_DIR/openclaw-workspace-$TIMESTAMP.tar.gz"
ARCHIVE_GPG="$ARCHIVE_TAR.gpg"

tar -czf "$ARCHIVE_TAR" .

echo "Encrypting archive with GPG (symmetric)."
gpg --symmetric --cipher-algo AES256 --output "$ARCHIVE_GPG" "$ARCHIVE_TAR"
rm -f "$ARCHIVE_TAR"

cat <<EOF
Backup complete:
- Encrypted archive: $ARCHIVE_GPG
- Workspace: $WORKSPACE
EOF
