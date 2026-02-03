#!/bin/bash
# OpenClaw Workspace Backup Script
# Backs up ~/.openclaw/workspace to a private Git repo and creates encrypted local archives
# See https://docs.openclaw.ai/concepts/agent-workspace for guidance

set -e

WORKSPACE_DIR="${OPENCLAW_WORKSPACE:-$HOME/.openclaw/workspace}"
BACKUP_DIR="${OPENCLAW_BACKUP_DIR:-$HOME/.openclaw/backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🔒 OpenClaw Workspace Backup"
echo "============================"
echo "Workspace: $WORKSPACE_DIR"
echo "Backup dir: $BACKUP_DIR"

# Check workspace exists
if [[ ! -d "$WORKSPACE_DIR" ]]; then
    echo "❌ Workspace directory not found: $WORKSPACE_DIR"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# ============================================
# 1. Git Backup (Primary - to private repo)
# ============================================
backup_git() {
    echo ""
    echo "📦 Step 1: Git backup..."
    
    cd "$WORKSPACE_DIR"
    
    # Initialize git if not already
    if [[ ! -d ".git" ]]; then
        echo "Initializing git repository..."
        git init
        
        # Create .gitignore for sensitive files
        cat > .gitignore << 'EOF'
.DS_Store
.env
**/*.key
**/*.pem
**/secrets*
*.log
EOF
        git add .gitignore
    fi
    
    # Check for remote
    if ! git remote get-url origin &>/dev/null; then
        echo "⚠️  No remote configured. To add one:"
        echo "   git remote add origin <your-private-repo-url>"
        echo "   git push -u origin main"
    else
        # Stage and commit changes
        git add AGENTS.md SOUL.md TOOLS.md IDENTITY.md USER.md HEARTBEAT.md memory/ 2>/dev/null || true
        
        if git diff --cached --quiet; then
            echo "✅ No changes to commit"
        else
            git commit -m "Backup: $TIMESTAMP"
            echo "📤 Pushing to remote..."
            git push origin main || git push origin master || echo "⚠️  Push failed - check remote configuration"
        fi
    fi
    
    echo "✅ Git backup complete"
}

# ============================================
# 2. Encrypted Local Archive (Secondary)
# ============================================
backup_encrypted() {
    echo ""
    echo "🔐 Step 2: Encrypted local archive..."
    
    ARCHIVE_NAME="openclaw-workspace-$TIMESTAMP.tar.gz"
    ENCRYPTED_NAME="$ARCHIVE_NAME.gpg"
    
    cd "$HOME/.openclaw"
    
    # Create tarball (excluding sensitive config)
    tar -czf "$BACKUP_DIR/$ARCHIVE_NAME" \
        --exclude='.git' \
        --exclude='credentials' \
        --exclude='sessions' \
        --exclude='*.key' \
        --exclude='*.pem' \
        workspace/
    
    # Check if GPG is available
    if command -v gpg &>/dev/null; then
        echo "Enter passphrase for encryption (or Ctrl+C to skip):"
        if gpg --symmetric --cipher-algo AES256 -o "$BACKUP_DIR/$ENCRYPTED_NAME" "$BACKUP_DIR/$ARCHIVE_NAME"; then
            rm "$BACKUP_DIR/$ARCHIVE_NAME"
            echo "✅ Encrypted archive: $BACKUP_DIR/$ENCRYPTED_NAME"
        else
            echo "⚠️  GPG encryption skipped, keeping unencrypted archive"
        fi
    else
        echo "⚠️  GPG not available, keeping unencrypted archive"
        echo "✅ Archive: $BACKUP_DIR/$ARCHIVE_NAME"
    fi
    
    # Cleanup old backups (keep last 5)
    echo "🧹 Cleaning old backups..."
    ls -t "$BACKUP_DIR"/openclaw-workspace-*.tar.gz* 2>/dev/null | tail -n +6 | xargs -r rm -f
    
    echo "✅ Local backup complete"
}

# ============================================
# 3. Validation
# ============================================
validate_backup() {
    echo ""
    echo "✔️  Step 3: Validation..."
    
    # Check workspace files
    local required_files=("AGENTS.md" "SOUL.md" "TOOLS.md")
    local missing=0
    
    for file in "${required_files[@]}"; do
        if [[ -f "$WORKSPACE_DIR/$file" ]]; then
            echo "  ✅ $file"
        else
            echo "  ⚠️  $file (missing)"
            missing=$((missing + 1))
        fi
    done
    
    # Check memory directory
    if [[ -d "$WORKSPACE_DIR/memory" ]]; then
        local memory_count=$(ls "$WORKSPACE_DIR/memory"/*.md 2>/dev/null | wc -l)
        echo "  ✅ memory/ ($memory_count files)"
    else
        echo "  ⚠️  memory/ (missing)"
    fi
    
    # List recent backups
    echo ""
    echo "📁 Recent backups:"
    ls -lh "$BACKUP_DIR"/openclaw-workspace-* 2>/dev/null | head -5 || echo "  (none)"
    
    echo ""
    echo "✅ Validation complete"
}

# ============================================
# Main
# ============================================
main() {
    backup_git
    backup_encrypted
    validate_backup
    
    echo ""
    echo "🎉 Backup complete!"
    echo ""
    echo "To restore from encrypted archive:"
    echo "  gpg -d $BACKUP_DIR/openclaw-workspace-*.tar.gz.gpg | tar -xzf - -C ~/.openclaw/"
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
