#!/bin/bash
# OpenClaw Complete MVP Setup Script
# This script orchestrates the complete OpenClaw setup for MVP testing

set -e

echo "🎯 OpenClaw MVP Setup - Complete Implementation"
echo "=============================================="

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    
    # Check if running on Windows with WSL2
    if grep -qi microsoft /proc/version 2>/dev/null; then
        echo "✅ WSL2 detected"
    else
        echo "❌ This setup requires WSL2 on Windows"
        echo "Please install WSL2 first: wsl --install -d Ubuntu-24.04"
        exit 1
    fi
    
    # Check if systemd is enabled
    if [ -f /etc/wsl.conf ]; then
        echo "✅ Systemd configuration exists"
    else
        echo "⚠️  Systemd not configured - gateway service may not work properly"
    fi
}

# Function to setup development environment
setup_dev_environment() {
    echo "🔧 Setting up development environment..."
    
    # Install system dependencies
    sudo apt update && sudo apt install -y \
        curl \
        wget \
        git \
        unzip \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release
    
    # Install Node.js 22+
    if ! command -v node &> /dev/null; then
        echo "📦 Installing Node.js 22+..."
        curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        echo "✅ Node.js $(node --version) already installed"
    fi
    
    # Install pnpm
    if ! command -v pnpm &> /dev/null; then
        echo "📦 Installing pnpm..."
        npm install -g pnpm
    else
        echo "✅ pnpm $(pnpm --version) already installed"
    fi
    
    # Install Bun
    if ! command -v bun &> /dev/null; then
        echo "📦 Installing Bun..."
        curl -fsSL https://bun.sh/install | bash
        echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
    else
        echo "✅ Bun $(bun --version) already installed"
    fi
}

# Function to clone and build OpenClaw
build_openclaw() {
    echo "🔨 Building OpenClaw..."
    
    # Create workspace directories
    mkdir -p ~/.openclaw/workspace
    mkdir -p ~/.openclaw/credentials
    mkdir -p ~/.openclaw/sessions
    
    # Clone repository if not exists
    if [ ! -d ~/openclaw ]; then
        echo "📥 Cloning OpenClaw repository..."
        cd ~
        git clone https://github.com/openclaw/openclaw.git
        cd openclaw
    else
        echo "✅ Repository already exists"
        cd ~/openclaw
        git pull --rebase origin main
    fi
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    pnpm install
    
    # Build OpenClaw
    echo "🔨 Building OpenClaw..."
    pnpm ui:build
    pnpm build
    
    echo "✅ OpenClaw built successfully"
}

# Function to run onboarding
run_onboarding() {
    echo "🎯 Running OpenClaw onboarding..."
    openclaw onboard --install-daemon
    echo "✅ Onboarding completed"
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
    }
  },
  "gateway": {
    "mode": "local",
    "port": 18789,
    "verbose": true
  }
}
EOF
    
    echo "✅ MVP configuration created"
}

# Function to test MVP setup
test_mvp_setup() {
    echo "🧪 Testing MVP setup..."
    
    # Start gateway in background
    echo "🚀 Starting OpenClaw gateway..."
    cd ~/openclaw
    nohup openclaw gateway run --bind loopback --port 18789 --force > /tmp/openclaw-gateway.log 2>&1 &
    GATEWAY_PID=$!
    
    # Wait for gateway to start
    sleep 5
    
    # Check if gateway is running
    if curl -s http://localhost:18789/health > /dev/null; then
        echo "✅ Gateway is running on http://localhost:18789"
    else
        echo "⚠️  Gateway may not be running properly"
        echo "Check logs: tail -n 50 /tmp/openclaw-gateway.log"
    fi
    
    # Start UI in background
    echo "🚀 Starting OpenClaw UI..."
    cd ~/openclaw/ui
    nohup pnpm dev > /tmp/openclaw-ui.log 2>&1 &
    UI_PID=$!
    
    # Wait for UI to start
    sleep 10
    
    # Check if UI is running
    if curl -s http://localhost:5173 > /dev/null; then
        echo "✅ UI is running on http://localhost:5173"
    else
        echo "⚠️  UI may not be running properly"
        echo "Check logs: tail -n 50 /tmp/openclaw-ui.log"
    fi
    
    echo "🎉 MVP setup testing completed!"
    echo ""
    echo "Services running:"
    echo "- Gateway: http://localhost:18789 (PID: $GATEWAY_PID)"
    echo "- UI: http://localhost:5173 (PID: $UI_PID)"
    echo ""
    echo "To stop services:"
    echo "- Gateway: kill $GATEWAY_PID"
    echo "- UI: kill $UI_PID"
}

# Function to deploy to cloud platforms
deploy_to_cloud() {
    echo "☁️  Setting up cloud deployment options..."
    
    # Create deployment directory
    mkdir -p ~/openclaw/deployments
    
    # Copy deployment scripts
    cp ~/openclaw/scripts/deploy-fly.sh ~/openclaw/deployments/
    cp ~/openclaw/scripts/deploy-render.sh ~/openclaw/deployments/
    cp ~/openclaw/scripts/deploy-railway.sh ~/openclaw/deployments/
    
    chmod +x ~/openclaw/deployments/*.sh
    
    echo "✅ Cloud deployment scripts prepared"
    echo "Available deployment options:"
    echo "- Fly.io: ~/openclaw/deployments/deploy-fly.sh"
    echo "- Render: ~/openclaw/deployments/deploy-render.sh"
    echo "- Railway: ~/openclaw/deployments/deploy-railway.sh"
}

# Main execution
main() {
    echo "Starting OpenClaw MVP setup..."
    
    check_prerequisites
    setup_dev_environment
    build_openclaw
    run_onboarding
    create_mvp_config
    test_mvp_setup
    deploy_to_cloud
    
    echo ""
    echo "🎉 OpenClaw MVP setup completed successfully!"
    echo ""
    echo "Next steps for MVP testing:"
    echo "1. Test ClawBrain Memory features at http://localhost:5173"
    echo "2. Add ?onboarding=1 to URL for onboarding flow"
    echo "3. Configure channels for user testing"
    echo "4. Deploy to cloud for remote user access"
    echo ""
    echo "For troubleshooting: openclaw doctor"
    echo "For status: openclaw status --all"
}

# Run main function
main
