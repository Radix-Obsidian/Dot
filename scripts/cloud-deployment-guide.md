# Dot Cloud Deployment Guide for MVP Testing

This guide provides step-by-step instructions for deploying Dot to cloud platforms for MVP testing with users.

## Overview

Dot requires a specific environment setup that is challenging on native Windows. Cloud deployment provides the most reliable path for MVP testing.

## Prerequisites

- GitHub account with access to Dot repository
- Cloud platform accounts (Fly.io, Render, Railway)
- Dot repository cloned locally

## Cloud Platform Deployment Options

### Option 1: Fly.io (Recommended)

Fly.io provides excellent support for Node.js applications and offers global deployment.

**Steps:**
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Deploy: `./scripts/deploy-fly.sh`

**Configuration:**
```toml
# fly.toml
app = "dot-mvp"
primary_region = "iad"

[build]
  builder = "paketobuildpacks/builder:base"

[[services]]
  internal_port = 18789
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

### Option 2: Render

Render offers simple deployment with automatic SSL and scaling.

**Steps:**
1. Install Render CLI: `npm install -g @render/cli`
2. Login: `render login`
3. Deploy: `./scripts/deploy-render.sh`

### Option 3: Railway

Railway provides quick deployment with minimal configuration.

**Steps:**
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Deploy: `./scripts/deploy-railway.sh`

## Environment Variables

Set these environment variables for MVP testing:

```bash
DOT_ENV=production
DOT_GATEWAY_PORT=18789
DOT_LOG_LEVEL=info
DOT_MODE=cloud
```

## Channel Configuration

For MVP testing, configure channels to connect to your cloud gateway:

```json5
{
  "channels": {
    "whatsapp": {
      "gateway": "https://your-app.fly.dev",
      "allowFrom": ["+15555550123"]
    },
    "discord": {
      "gateway": "https://your-app.fly.dev",
      "token": "your-discord-bot-token"
    }
  }
}
```

## MVP Testing Checklist

- [ ] Gateway deployed and accessible
- [ ] UI accessible at deployed URL
- [ ] Memory features working
- [ ] Channel connections tested
- [ ] User onboarding flow tested
- [ ] Health checks passing

## Monitoring and Debugging

### Health Check Endpoint
Access: `https://your-app.fly.dev/health`

### Logs
```bash
# Fly.io
fly logs --app dot-mvp

# Render
render logs --service dot-mvp

# Railway
railway logs
```

### Status Commands
```bash
dot status --all
dot doctor
```

## Security Considerations

1. **API Keys**: Store in platform secrets, never in code
2. **Tokens**: Use environment variables for sensitive data
3. **HTTPS**: All deployments should use HTTPS
4. **Rate Limiting**: Implement appropriate rate limiting

## Scaling for MVP

Start with minimal resources and scale based on usage:

- **Fly.io**: Start with 256MB RAM, 1 CPU
- **Render**: Start with starter plan
- **Railway**: Start with hobby plan

## Cost Optimization

- Use free tiers for initial testing
- Monitor usage and scale appropriately
- Consider spot instances for non-critical workloads

## Next Steps

1. Choose cloud platform and deploy
2. Configure channels for user testing
3. Set up monitoring and alerts
4. Test with beta users
5. Iterate based on feedback
