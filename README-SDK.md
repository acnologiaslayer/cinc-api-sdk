# CINC API SDK

A TypeScript SDK for CINC API interactions, providing authentication, asset management, market data, and portfolio management functionalities.

## Installation

Since this is a private package, install it directly from your local/private registry:

```bash
npm install @cinc/api-sdk
```

## Usage

### Basic Setup

```typescript
import { CincAPIClient } from '@cinc/api-sdk';

const client = new CincAPIClient({
  baseURL: 'https://api.cincapi.com/v2', // Optional, uses default
  timeout: 30000 // Optional
});
```

### Authentication

```typescript
// Login and get auth token
const authResponse = await client.authenticate('user@example.com', 'password');

// Set auth token for subsequent requests
client.setAuthToken(authResponse.token);
```

### Asset Management

```typescript
// Get all assets
const assets = await client.assets.getAssets();

// Get specific asset
const asset = await client.assets.getAssetById('asset-id');

// Create new asset
const newAsset = await client.assets.createAsset({
  name: 'New Asset',
  type: 'stock',
  // ... other asset properties
});

// Update asset
const updatedAsset = await client.assets.updateAsset('asset-id', {
  name: 'Updated Asset Name'
});

// Delete asset
await client.assets.deleteAsset('asset-id');
```

### Market Data

```typescript
// Get market data
const marketData = await client.markets.getMarketData();

// Get specific market
const market = await client.markets.getMarketById('market-id');
```

### Portfolio Management

```typescript
// Get user portfolio
const portfolio = await client.portfolios.getPortfolio('user-id');

// Update portfolio
const updatedPortfolio = await client.portfolios.updatePortfolio('user-id', {
  // portfolio updates
});
```

### Advanced Usage

You can also use individual services if needed:

```typescript
import { AssetService, AuthService } from '@cinc/api-sdk';

const authService = new AuthService();
const assetService = new AssetService();
```

## Configuration

The SDK accepts the following configuration options:

- `baseURL`: API base URL (default: from config)
- `timeout`: Request timeout in milliseconds (default: 30000)
- `headers`: Additional headers to include with requests

## Error Handling

The SDK throws errors that can be caught and handled:

```typescript
try {
  const assets = await client.assets.getAssets();
} catch (error) {
  console.error('Failed to fetch assets:', error);
}
```

## Development

This SDK is built with TypeScript and provides full type definitions for all API responses and requests.

## License

MIT
