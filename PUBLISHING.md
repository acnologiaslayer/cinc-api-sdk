# Publishing Your CINC API SDK

## Publishing to NPM (Private Registry)

### 1. Build the package
```bash
npm run build
```

### 2. Test the package locally
```bash
npm pack
# This creates a .tgz file you can install in other projects for testing
```

### 3. Publish to private registry
```bash
# For private npm registry
npm publish --registry https://your-private-registry.com

# For GitHub Packages
npm publish --registry https://npm.pkg.github.com
```

### 4. Install in other projects
```bash
# From private registry
npm install @cinc/api-sdk --registry https://your-private-registry.com

# From GitHub Packages
npm install @cinc/api-sdk --registry https://npm.pkg.github.com
```

## Using the SDK in Another Project

### Installation
```bash
npm install @cinc/api-sdk
```

### Usage Example
```typescript
// app.ts
import { CincAPIClient } from '@cinc/api-sdk';

const client = new CincAPIClient({
  baseURL: 'https://api.cincapi.com/v2'
});

async function main() {
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
