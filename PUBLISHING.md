# Publishing Your CINC API SDK

## Publishing to GitHub Packages

This package is configured to use GitHub Packages as the npm registry. Follow these steps to publish:

### Prerequisites

1. **GitHub Personal Access Token**
   - Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
   - Generate a new token with these scopes:
     - `write:packages` (to publish packages)
     - `read:packages` (to download packages)
     - `repo` (if the repository is private)
   
2. **Authentication Setup**
   ```bash
   # Set your GitHub token as an environment variable
   export GITHUB_TOKEN=your_personal_access_token_here
   
   # Or add it to your ~/.bashrc or ~/.zshrc
   echo 'export GITHUB_TOKEN=your_personal_access_token_here' >> ~/.bashrc
   source ~/.bashrc
   ```

### Publishing Steps

#### 1. Build the package
```bash
npm run build
```

#### 2. Test the package locally
```bash
npm pack
# This creates a .tgz file you can install in other projects for testing
```

#### 3. Login to GitHub Packages
```bash
npm login --scope=@acnologiaslayer --registry=https://npm.pkg.github.com
# Use your GitHub username and the personal access token as password
```

#### 4. Publish to GitHub Packages
```bash
npm publish
```

The package will be published to: `https://github.com/acnologiaslayer/cinc-api-sdk/packages`

### Version Management

Before publishing, update the version:

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)  
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

## Installing from GitHub Packages

### For End Users

#### 1. Create .npmrc file in your project
```bash
# In your project root, create .npmrc
echo "@acnologiaslayer:registry=https://npm.pkg.github.com" > .npmrc
```

#### 2. Authenticate with GitHub Packages
```bash
# Login to GitHub Packages
npm login --scope=@acnologiaslayer --registry=https://npm.pkg.github.com

# Or set your token directly
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
```

#### 3. Install the package
```bash
npm install @acnologiaslayer/cinc-api-sdk
```

## Using the SDK in Another Project

### Installation
```bash
npm install @cinc/api-sdk
```

### Usage Example
```typescript
// app.ts
import { CincAPIClient } from '@acnologiaslayer/cinc-api-sdk';

const client = new CincAPIClient({
  baseURL: 'https://api.cincapi.com/v2'
});

async function main() {
  try {
    // Authenticate
    const auth = await client.auth.login('user@example.com', 'password');
    client.setAuthToken(auth.token);
    
    // Use the SDK
    const assets = await client.assets.getAssets();
    console.log('Assets:', assets);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/publish.yml` for automated publishing:

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@acnologiaslayer'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build package
        run: npm run build
      
      - name: Publish to GitHub Packages
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Manual Publishing Script

Create a publish script for easier manual publishing:

```bash
#!/bin/bash
# publish.sh

set -e

echo "🚀 Publishing CINC API SDK to GitHub Packages"
echo "=============================================="

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN environment variable is not set"
    echo "Please export your GitHub personal access token:"
    echo "export GITHUB_TOKEN=your_token_here"
    exit 1
fi

# Build the package
echo "📦 Building package..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test

# Check if build was successful
if [ ! -d "lib" ]; then
    echo "❌ Build failed - lib directory not found"
    exit 1
fi

echo "✅ Build successful"

# Publish
echo "📤 Publishing to GitHub Packages..."
npm publish

echo "🎉 Package published successfully!"
echo "📋 Package URL: https://github.com/acnologiaslayer/cinc-api-sdk/packages"
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   ```bash
   # Check if token is set
   echo $GITHUB_TOKEN
   
   # Re-login to GitHub Packages
   npm login --scope=@acnologiaslayer --registry=https://npm.pkg.github.com
   ```

2. **Package Not Found When Installing**
   - Ensure the .npmrc file is in your project root
   - Verify you're authenticated to GitHub Packages
   - Check package visibility settings on GitHub

3. **Permission Denied**
   - Verify your GitHub token has `write:packages` scope
   - Ensure you have access to the repository

4. **Version Already Exists**
   ```bash
   # Update version before publishing
   npm version patch
   npm publish
   ```

### Useful Commands

```bash
# Check current registry configuration
npm config get registry

# View package info from GitHub Packages
npm view @acnologiaslayer/cinc-api-sdk --registry=https://npm.pkg.github.com

# List all versions
npm view @acnologiaslayer/cinc-api-sdk versions --json --registry=https://npm.pkg.github.com

# Unpublish a version (if needed)
npm unpublish @acnologiaslayer/cinc-api-sdk@1.0.0 --registry=https://npm.pkg.github.com
```

## Package Visibility

- **Private Repository**: Package will be private by default
- **Public Repository**: Package will be public
- You can change visibility in GitHub Package settings

For more information, visit: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
  try {
    // Authenticate
    const auth = await client.authenticate('user@example.com', 'password');
    client.setAuthToken(auth.token);
    
    // Use the API
    const assets = await client.assets.getAssets();
    console.log('Assets:', assets);
    
    const markets = await client.markets.getMarketData();
    console.log('Market data:', markets);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

## Development Workflow

### 1. Make changes to the SDK
Edit files in the `src/` directory

### 2. Build and test
```bash
npm run build
npm test  # if you have tests
```

### 3. Update version
```bash
npm version patch  # or minor/major
```

### 4. Publish update
```bash
npm publish
```

## Files Structure Summary

```
cinc-api-service/
├── lib/                    # Compiled output (generated)
├── src/                    # Source code
│   ├── index.ts           # Main SDK export
│   ├── client/            # Main SDK client
│   ├── services/          # API service classes
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utilities
├── package.json           # SDK package config
├── tsconfig.json          # TypeScript config
├── .npmignore             # Files to exclude from package
├── README-SDK.md          # SDK documentation
└── example.ts             # Usage example
```

The SDK is now ready for private distribution!
