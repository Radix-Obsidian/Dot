#!/bin/bash
# OpenClaw Railway Deployment Script
# Deploys OpenClaw gateway to Railway for MVP testing

set -e

echo "🚀 Deploying OpenClaw to Railway..."

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if user is logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "🔐 Please log in to Railway..."
    railway login
fi

# Create railway project if not exists
if ! railway projects list | grep -q "openclaw-mvp"; then
    echo "📱 Creating Railway project..."
    railway create openclaw-mvp
fi

# Set environment variables
echo "🔐 Setting up environment variables..."
railway variables set OPENCLAW_ENV=production \
    OPENCLAW_GATEWAY_PORT=18789 \
    OPENCLAW_LOG_LEVEL=info

# Deploy the project
echo "🚀 Deploying to Railway..."
railway up

# Get the public URL
PUBLIC_URL=$(railway status | grep "URL:" | awk '{print $2}')
echo "✅ Deployment complete!"
echo "🌐 OpenClaw Gateway URL: https://$PUBLIC_URL"
echo "🔗 Use this URL for channel configuration"
