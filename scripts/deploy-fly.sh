#!/bin/bash
# OpenClaw Fly.io Deployment Script
# Deploys OpenClaw gateway to Fly.io for MVP testing

set -e

echo "🚀 Deploying OpenClaw to Fly.io..."

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI not found. Installing..."
    curl -L https://fly.io/install.sh | sh
    export PATH="$HOME/.fly/bin:$PATH"
fi

# Check if user is logged in to Fly
if ! fly auth whoami &> /dev/null; then
    echo "🔐 Please log in to Fly.io..."
    fly auth login
fi

# Create fly app if not exists
if ! fly apps list | grep -q "openclaw-mvp"; then
    echo "📱 Creating Fly.io app..."
    fly apps create openclaw-mvp --org personal
fi

# Set secrets for the app
echo "🔐 Setting up secrets..."
fly secrets set OPENCLAW_ENV=production \
    OPENCLAW_GATEWAY_PORT=18789 \
    OPENCLAW_LOG_LEVEL=info \
    --app openclaw-mvp

# Deploy the app
echo "🚀 Deploying to Fly.io..."
fly deploy --app openclaw-mvp

# Get the public URL
PUBLIC_URL=$(fly info --app openclaw-mvp | grep "hostname:" | awk '{print $2}')
echo "✅ Deployment complete!"
echo "🌐 OpenClaw Gateway URL: https://$PUBLIC_URL"
echo "🔗 Use this URL for channel configuration"
echo ""
echo "To check status: fly status --app openclaw-mvp"
echo "To view logs: fly logs --app openclaw-mvp"
echo "To SSH: fly ssh console --app openclaw-mvp"
