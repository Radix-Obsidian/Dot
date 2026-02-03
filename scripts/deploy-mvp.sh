#!/bin/bash
# OpenClaw MVP Cloud Deployment Script
# Deploys OpenClaw gateway to cloud platforms for MVP testing

set -e

echo "🎯 OpenClaw MVP Cloud Deployment"
echo "================================"

# Function to deploy to Fly.io
deploy_fly() {
    echo "🚀 Deploying to Fly.io..."
    
    if ! command -v fly &> /dev/null; then
        echo "📦 Installing Fly CLI..."
        curl -L https://fly.io/install.sh | sh
        export PATH="$HOME/.fly/bin:$PATH"
    fi
    
    if ! fly auth whoami &> /dev/null; then
        echo "🔐 Please log in to Fly.io..."
        fly auth login
    fi
    
    # Create app if not exists
    if ! fly apps list | grep -q "openclaw-mvp"; then
        echo "📱 Creating Fly.io app..."
        fly apps create openclaw-mvp --org personal
    fi
    
    # Set secrets
    echo "🔐 Setting up secrets..."
    fly secrets set OPENCLAW_ENV=production \
        OPENCLAW_GATEWAY_PORT=18789 \
        OPENCLAW_LOG_LEVEL=info \
        OPENCLAW_MODE=cloud \
        --app openclaw-mvp
    
    # Deploy
    echo "🚀 Deploying to Fly.io..."
    fly deploy --app openclaw-mvp
    
    # Get public URL
    PUBLIC_URL=$(fly info --app openclaw-mvp | grep "hostname:" | awk '{print $2}')
    echo "✅ Fly.io deployment complete!"
    echo "🌐 Gateway URL: https://$PUBLIC_URL"
    
    return 0
}

# Function to deploy to Render
deploy_render() {
    echo "🚀 Deploying to Render..."
    
    if ! command -v render &> /dev/null; then
        echo "📦 Installing Render CLI..."
        npm install -g @render/cli
    fi
    
    if ! render whoami &> /dev/null; then
        echo "🔐 Please log in to Render..."
        render login
    fi
    
    # Create service if not exists
    if ! render services list | grep -q "openclaw-mvp"; then
        echo "📱 Creating Render service..."
        render create --name openclaw-mvp --type web
    fi
    
    # Set environment variables
    echo "🔐 Setting up environment variables..."
    render config:set OPENCLAW_ENV=production \
        OPENCLAW_GATEWAY_PORT=18789 \
        OPENCLAW_LOG_LEVEL=info \
        OPENCLAW_MODE=cloud \
        --service openclaw-mvp
    
    # Deploy
    echo "🚀 Deploying to Render..."
    render deploy --service openclaw-mvp
    
    echo "✅ Render deployment complete!"
    
    return 0
}

# Function to deploy to Railway
deploy_railway() {
    echo "🚀 Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        echo "📦 Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    if ! railway whoami &> /dev/null; then
        echo "🔐 Please log in to Railway..."
        railway login
    fi
    
    # Create project if not exists
    if ! railway projects list | grep -q "openclaw-mvp"; then
        echo "📱 Creating Railway project..."
        railway create openclaw-mvp
    fi
    
    # Set environment variables
    echo "🔐 Setting up environment variables..."
    railway variables set OPENCLAW_ENV=production \
        OPENCLAW_GATEWAY_PORT=18789 \
        OPENCLAW_LOG_LEVEL=info \
        OPENCLAW_MODE=cloud
    
    # Deploy
    echo "🚀 Deploying to Railway..."
    railway up
    
    echo "✅ Railway deployment complete!"
    
    return 0
}

# Function to create MVP configuration
create_mvp_config() {
    echo "⚙️  Creating MVP configuration..."
    
    cat > ~/.openclaw/openclaw.json <<'EOF'
{
  "agents": {
    "defaults": {
      "workspace": "~/.openclaw/workspace",
      "memorySearch": {
        "enabled": true,
        "provider": "openai",
        "model": "text-embedding-3-small"
      }
    }
  },
  "channels": {
    "whatsapp": {
      "allowFrom": ["+15555550123"]
    },
    "discord": {
      "enabled": true
    }
  },
  "gateway": {
    "mode": "cloud",
    "port": 18789,
    "verbose": true
  },
  "mvp": {
    "testing": true,
    "features": {
      "memory": true,
      "onboarding": true,
      "channels": true
    }
  }
}
EOF
    
    echo "✅ MVP configuration created"
}

# Function to test deployment
test_deployment() {
    local platform=$1
    local url=$2
    
    echo "🧪 Testing $platform deployment..."
    
    # Health check
    if curl -s "$url/health" > /dev/null; then
        echo "✅ Health check passed"
    else
        echo "⚠️  Health check failed"
        return 1
    fi
    
    # Gateway check
    if curl -s "$url/gateway/status" > /dev/null; then
        echo "✅ Gateway check passed"
    else
        echo "⚠️  Gateway check failed"
        return 1
    fi
    
    echo "✅ $platform deployment testing completed"
    return 0
}

# Main deployment function
main() {
    echo "Starting OpenClaw MVP cloud deployment..."
    
    # Check prerequisites
    if ! command -v git &> /dev/null; then
        echo "❌ Git is required but not installed"
        exit 1
    fi
    
    # Create MVP configuration
    create_mvp_config
    
    # Menu for platform selection
    echo ""
    echo "Select deployment platform:"
    echo "1) Fly.io (Recommended)"
    echo "2) Render"
    echo "3) Railway"
    echo "4) All platforms"
    echo ""
    read -p "Enter choice (1-4): " choice
    
    case $choice in
        1)
            deploy_fly
            ;;
        2)
            deploy_render
            ;;
        3)
            deploy_railway
            ;;
        4)
            echo "🚀 Deploying to all platforms..."
            deploy_fly
            deploy_render
            deploy_railway
            ;;
        *)
            echo "❌ Invalid choice"
            exit 1
            ;;
    esac
    
    echo ""
    echo "🎉 OpenClaw MVP deployment completed!"
    echo ""
    echo "Next steps:"
    echo "1. Configure channels for your cloud gateway"
    echo "2. Test with beta users"
    echo "3. Monitor usage and performance"
    echo "4. Iterate based on feedback"
    echo ""
    echo "For troubleshooting: openclaw doctor"
    echo "For status: openclaw status --all"
}

# Run main function
main
