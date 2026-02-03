#!/bin/bash
# OpenClaw Render Deployment Script
# Deploys OpenClaw gateway to Render for MVP testing

set -e

echo "🚀 Deploying OpenClaw to Render..."

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found. Installing..."
    npm install -g @render/cli
fi

# Check if user is logged in to Render
if ! render whoami &> /dev/null; then
    echo "🔐 Please log in to Render..."
    render login
fi

# Create render service if not exists
if ! render services list | grep -q "openclaw-mvp"; then
    echo "📱 Creating Render service..."
    render create --name openclaw-mvp --type web
fi

# Set environment variables
echo "🔐 Setting up environment variables..."
render config:set OPENCLAW_ENV=production \
    OPENCLAW_GATEWAY_PORT=18789 \
    OPENCLAW_LOG_LEVEL=info \
    --service openclaw-mvp

# Deploy the service
echo "🚀 Deploying to Render..."
render deploy --service openclaw-mvp

# Get the public URL
PUBLIC_URL=$(render services list | grep "openclaw-mvp" | awk '{print $5}')
echo "✅ Deployment complete!"
echo "🌐 OpenClaw Gateway URL: https://$PUBLIC_URL"
echo "🔗 Use this URL for channel configuration"
