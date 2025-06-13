#!/bin/bash

# CINC API SDK - Quick Start Script
# This script helps developers quickly set up the CINC API SDK for development

set -e

echo "🚀 CINC API SDK - Quick Start Setup"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16.0.0 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to version $REQUIRED_VERSION or higher."
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git."
    exit 1
fi

echo "✅ Git version: $(git --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Build the project
echo ""
echo "🔨 Building the project..."
npm run build

# Run tests
echo ""
echo "🧪 Running tests..."
npm test

# Check if build was successful
if [ -d "lib" ] && [ -f "lib/index.js" ]; then
    echo ""
    echo "✅ Build successful! Files generated in lib/ directory:"
    ls -la lib/
else
    echo "❌ Build failed! lib/ directory not found or incomplete."
    exit 1
fi

echo ""
echo "🎉 Setup complete! You're ready to develop with the CINC API SDK."
echo ""
echo "📖 Next steps:"
echo "   1. Read the Developer Guide: ./DEVELOPER-GUIDE.md"
echo "   2. Check the main documentation: ./README.md"
echo "   3. Review the tests: ./tests/"
echo ""
echo "🛠️  Useful commands:"
echo "   npm run build         - Build the project"
echo "   npm test              - Run tests"
echo "   npm run test:watch    - Run tests in watch mode"
echo "   npm run test:coverage - Run tests with coverage"
echo ""
echo "Happy coding! 🚀"
