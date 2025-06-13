#!/bin/bash

# CINC API SDK - Manual Publish Script
# Publishes the package to GitHub Packages

set -e

echo "🚀 Publishing CINC API SDK to GitHub Packages"
echo "=============================================="

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN environment variable is not set"
    echo "Please export your GitHub personal access token:"
    echo "export GITHUB_TOKEN=your_token_here"
    echo ""
    echo "To create a token:"
    echo "1. Go to GitHub Settings > Developer settings > Personal access tokens"
    echo "2. Generate a new token with 'write:packages' scope"
    echo "3. Export it: export GITHUB_TOKEN=your_token_here"
    exit 1
fi

echo "✅ GitHub token is set"

# Check if we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: You're not on the main branch (current: $CURRENT_BRANCH)"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "❌ You have uncommitted changes. Please commit or stash them first."
    git status --short
    exit 1
fi

echo "✅ Git status is clean"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm test

# Build the package
echo "🔨 Building package..."
npm run build

# Check if build was successful
if [ ! -d "lib" ] || [ ! -f "lib/index.js" ]; then
    echo "❌ Build failed - lib directory or index.js not found"
    exit 1
fi

echo "✅ Build successful"

# Show current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📋 Current version: $CURRENT_VERSION"

# Ask if user wants to bump version
echo ""
echo "Version options:"
echo "1. Patch (${CURRENT_VERSION} -> $(npm version patch --no-git-tag-version --dry-run))"
echo "2. Minor (${CURRENT_VERSION} -> $(npm version minor --no-git-tag-version --dry-run))"
echo "3. Major (${CURRENT_VERSION} -> $(npm version major --no-git-tag-version --dry-run))"
echo "4. Keep current version"

read -p "Select version bump (1-4): " -n 1 -r
echo

case $REPLY in
    1)
        npm version patch
        ;;
    2)
        npm version minor
        ;;
    3)
        npm version major
        ;;
    4)
        echo "Keeping current version: $CURRENT_VERSION"
        ;;
    *)
        echo "❌ Invalid selection"
        exit 1
        ;;
esac

NEW_VERSION=$(node -p "require('./package.json').version")
echo "📋 Publishing version: $NEW_VERSION"

# Publish to GitHub Packages
echo "📤 Publishing to GitHub Packages..."
npm publish

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Package published successfully!"
    echo "📋 Package: @acnologiaslayer/cinc-api-sdk@$NEW_VERSION"
    echo "🔗 URL: https://github.com/acnologiaslayer/cinc-api-sdk/packages"
    echo ""
    echo "📝 Next steps:"
    echo "1. Commit and push the version bump: git push && git push --tags"
    echo "2. Create a GitHub release with the new version"
    echo "3. Update your projects to use the new version"
else
    echo "❌ Publishing failed"
    exit 1
fi
