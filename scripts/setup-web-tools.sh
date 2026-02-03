#!/usr/bin/env bash
set -euo pipefail

# Configure OpenClaw web_search (Perplexity via OpenRouter) + Firecrawl fallback
# Stores secrets in ~/.openclaw/.env and config via openclaw config set.

ENV_FILE="$HOME/.openclaw/.env"
mkdir -p "$HOME/.openclaw"

cat <<'EOF'
This script will:
- Add OPENROUTER_API_KEY, BRAVE_API_KEY (fallback), FIRECRAWL_API_KEY to ~/.openclaw/.env
- Set tools.web.search.provider=perplexity
- Enable Firecrawl fallback for web_fetch
EOF

read -r -p "Enter OPENROUTER_API_KEY (or PERPLEXITY_API_KEY): " OPENROUTER_API_KEY
read -r -p "Enter BRAVE_API_KEY (fallback, optional): " BRAVE_API_KEY
read -r -p "Enter FIRECRAWL_API_KEY: " FIRECRAWL_API_KEY

# Write env vars (append or replace existing lines)
for key in OPENROUTER_API_KEY BRAVE_API_KEY FIRECRAWL_API_KEY; do
  value="${!key}"
  if grep -q "^${key}=" "$ENV_FILE" 2>/dev/null; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
  else
    echo "${key}=${value}" >> "$ENV_FILE"
  fi
done

# Apply tool configuration
openclaw config set tools.web.search.enabled true
openclaw config set tools.web.search.provider perplexity
openclaw config set tools.web.search.perplexity.baseUrl https://openrouter.ai/api/v1
openclaw config set tools.web.search.perplexity.model perplexity/sonar-pro
openclaw config set tools.web.fetch.enabled true
openclaw config set tools.web.fetch.firecrawl.enabled true
openclaw config set tools.web.fetch.firecrawl.baseUrl https://api.firecrawl.dev
openclaw config set tools.web.fetch.firecrawl.onlyMainContent true

cat <<'EOF'
Done.
- Restart the gateway so it picks up ~/.openclaw/.env changes.
- Use Brave by switching provider later if needed:
  openclaw config set tools.web.search.provider brave
EOF
