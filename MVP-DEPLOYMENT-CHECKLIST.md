# Dot MVP Deployment Checklist

## Pre-Deployment (Complete ✅)

- [x] Build passes (`pnpm build`)
- [x] UI builds (`pnpm ui:build`)
- [x] Tests pass (99.8% pass rate)
- [x] Fly.toml configured for MVP

## Deployment Steps

### Option 1: Fly.io (Recommended)

1. **Install Fly CLI**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**
   ```bash
   fly auth login
   ```

3. **Create App and Volume**
   ```bash
   fly apps create hueyclaw-mvp
   fly volumes create dot_data --size 1 --region iad
   ```

4. **Set Required Secrets**
   ```bash
   # Gateway token (required for security)
   fly secrets set DOT_GATEWAY_TOKEN=$(openssl rand -hex 32)
   
   # Model provider API key (at least one required)
   fly secrets set ANTHROPIC_API_KEY=sk-ant-...
   # OR
   fly secrets set OPENAI_API_KEY=sk-...
   
   # Optional: Channel tokens
   fly secrets set DISCORD_BOT_TOKEN=MTQ...
   fly secrets set TELEGRAM_BOT_TOKEN=123456:ABC...
   ```

5. **Deploy**
   ```bash
   fly deploy
   ```

6. **Verify Deployment**
   ```bash
   fly status
   fly logs
   ```

7. **Access Gateway**
   - Control UI: `https://hueyclaw-mvp.fly.dev/`
   - Health check: `https://hueyclaw-mvp.fly.dev/health`

### Option 2: Railway (One-Click)

1. Click: https://railway.com/deploy/dot-railway-template
2. Add Volume mounted at `/data`
3. Set variables:
   - `SETUP_PASSWORD` (required)
   - `PORT=8080`
   - `DOT_STATE_DIR=/data/.dot`
4. Enable HTTP Proxy on port 8080
5. Open `https://<your-domain>/setup` to complete wizard

### Option 3: Render

1. Connect GitHub repo to Render
2. Create Web Service with Docker runtime
3. Add disk: `/data` (1GB)
4. Set environment variables (see render.yaml)
5. Deploy

## Post-Deployment Configuration

### Create Config File (Fly.io SSH)
```bash
fly ssh console

# Inside container:
mkdir -p /data
cat > /data/dot.json << 'EOF'
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-5",
        "fallbacks": ["openai/gpt-4o"]
      }
    },
    "list": [{"id": "main", "default": true}]
  },
  "auth": {
    "profiles": {
      "anthropic:default": {"mode": "token", "provider": "anthropic"}
    }
  },
  "bindings": [
    {"agentId": "main", "match": {"channel": "discord"}}
  ],
  "gateway": {
    "mode": "local",
    "bind": "auto"
  }
}
EOF

exit
fly machine restart <machine-id>
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DOT_GATEWAY_TOKEN` | Yes (for cloud) | Auth token for gateway access |
| `ANTHROPIC_API_KEY` | One provider | Anthropic API key |
| `OPENAI_API_KEY` | One provider | OpenAI API key |
| `DISCORD_BOT_TOKEN` | For Discord | Discord bot token |
| `TELEGRAM_BOT_TOKEN` | For Telegram | Telegram bot token |
| `DOT_STATE_DIR` | Recommended | State directory (default: `/data`) |

## Troubleshooting

### "App is not listening on expected address"
- Ensure `--bind lan` is in the process command
- Check `internal_port` matches `--port` value

### Health checks failing
- Verify port configuration matches
- Check logs: `fly logs`

### OOM / Memory Issues
- Increase VM memory: `fly machine update <id> --vm-memory 2048 -y`

### Gateway Lock Issues
```bash
fly ssh console --command "rm -f /data/gateway.*.lock"
fly machine restart <machine-id>
```

## MVP Testing Checklist

- [ ] Gateway accessible via public URL
- [ ] Control UI loads
- [ ] Health endpoint responds
- [ ] At least one channel connected (Discord/Telegram/WhatsApp)
- [ ] Can send/receive messages
- [ ] Memory features working (if enabled)

## Support Links

- Docs: https://docs.dot.ai
- Fly.io Guide: https://docs.dot.ai/platforms/fly
- Railway Guide: https://docs.dot.ai/railway
- Troubleshooting: https://docs.dot.ai/gateway/troubleshooting
