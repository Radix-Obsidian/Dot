#!/bin/bash
# OpenClaw WSL2 Setup Script
# This script sets up WSL2 with Ubuntu 24.04 for OpenClaw development

set -e

echo "🚀 Setting up OpenClaw development environment in WSL2..."

# Check if running in WSL
if ! grep -qi microsoft /proc/version 2>/dev/null; then
    echo "❌ This script must be run inside WSL2"
    echo "Please install WSL2 first: wsl --install -d Ubuntu-24.04"
    exit 1
fi

echo "✅ WSL2 detected"

# Enable systemd (required for gateway service)
echo "🔧 Enabling systemd in WSL2..."
sudo tee /etc/wsl.conf >/dev/null <<'EOF'
[boot]
systemd=true
EOF

echo "✅ Systemd configuration written"

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required system dependencies
echo "🔧 Installing system dependencies..."
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Install Node.js 22+ (OpenClaw requirement)
echo "📦 Installing Node.js 22+..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Install pnpm
echo "📦 Installing pnpm..."
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
else
    echo "✅ pnpm already installed: $(pnpm --version)"
fi

# Install Bun (recommended for TypeScript execution)
echo "📦 Installing Bun..."
if ! command -v bun &> /dev/null; then
    curl -fsSL https://bun.sh/install | bash
    echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
    export PATH="$HOME/.bun/bin:$PATH"
else
    echo "✅ Bun already installed: $(bun --version)"
fi

# Create OpenClaw workspace directory
echo "📁 Creating OpenClaw workspace..."
mkdir -p ~/.openclaw/workspace
mkdir -p ~/.openclaw/credentials
mkdir -p ~/.openclaw/sessions

echo "✅ Workspace directories created"

# Clone OpenClaw repository if not exists
if [ ! -d "~/openclaw" ]; then
    echo "📥 Cloning OpenClaw repository..."
    cd ~
    git clone https://github.com/openclaw/openclaw.git
    cd openclaw
else
    echo "✅ OpenClaw repository already exists"
    cd ~/openclaw
fi

# Install dependencies
echo "📦 Installing OpenClaw dependencies..."
pnpm install

# Build OpenClaw
echo "🔨 Building OpenClaw..."
pnpm ui:build
pnpm build

echo "✅ OpenClaw built successfully"

# Run onboarding
echo "🎯 Running OpenClaw onboarding..."
openclaw onboard --install-daemon

echo "🎉 OpenClaw WSL2 setup completed!"
echo ""
echo "Next steps:"
echo "1. Restart WSL: wsl --shutdown && wsl"
echo "2. Start gateway: openclaw gateway --port 18789 --verbose"
echo "3. Start UI: cd ~/openclaw/ui && pnpm dev"
echo "4. Access UI at: http://localhost:5173"
echo ""
echo "For help: openclaw doctor"
