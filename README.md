# CINC API SDK

A modern TypeScript SDK for integrating with the CINC API. This SDK provides a clean, type-safe interface for authentication, asset management, market data, and portfolio management.

## Features

- 🔒 **Authentication** - Secure login and token management
- 🏠 **Asset Management** - Create, read, update, and delete assets
- 📊 **Market Data** - Access real-time market information
- 💼 **Portfolio Management** - Manage investment portfolios
- 🛡️ **Type Safety** - Full TypeScript support with comprehensive type definitions
- 🔄 **Retry Logic** - Automatic retry for failed requests
- ⚡ **Modern HTTP Client** - Built on Axios with interceptors and error handling
- 📝 **Comprehensive Testing** - 96%+ test coverage

## Installation

```bash
npm install @cinc/api-sdk
```

## Quick Start

```typescript
import { CincAPIClient } from '@cinc/api-sdk';

// Initialize the client
const client = new CincAPIClient({
  baseURL: 'https://api.cincapi.com/v2',
  timeout: 30000,
  apiKey: 'your-api-key' // Optional: if using API key authentication
});

// Authenticate with username/password
try {
  const authResponse = await client.auth.login('user@example.com', 'password');
  client.setAuthToken(authResponse.token);
  
  // Now you can make authenticated requests
  const assets = await client.assets.getAssets();
  console.log('Assets:', assets);
} catch (error) {
  console.error('Authentication failed:', error);
}
```

## Configuration

The SDK accepts the following configuration options:

```typescript
interface CincAPIClientConfig {
  apiKey?: string;           // API key for authentication
  baseURL?: string;          // API base URL (default: from environment)
  timeout?: number;          // Request timeout in milliseconds (default: 30000)
  headers?: Record<string, string>; // Additional headers
}
## API Reference

### Authentication

```typescript
// Login with credentials
const authResponse = await client.auth.login('email@example.com', 'password');

// Set auth token for subsequent requests
client.setAuthToken(authResponse.token);

// Remove auth token
client.removeAuthToken();

// Refresh token
const refreshed = await client.auth.refreshToken();
```

### Asset Management

```typescript
// Get all assets
const assets = await client.assets.getAssets();

// Get asset by ID
const asset = await client.assets.getAssetById('asset-id');

// Create new asset
const newAsset = await client.assets.createAsset({
  name: 'Property Name',
  address: '123 Main St',
  type: 'residential',
  // ... other asset properties
});

// Update asset
const updatedAsset = await client.assets.updateAsset('asset-id', {
  name: 'Updated Property Name'
});

// Delete asset
await client.assets.deleteAsset('asset-id');
```

### Market Data

```typescript
// Get market data
const marketData = await client.markets.getMarketData();

// Get specific market by ID
const market = await client.markets.getMarketById('market-id');
```

### Portfolio Management

```typescript
// Get portfolio
const portfolio = await client.portfolios.getPortfolio('portfolio-id');

// Create portfolio
const newPortfolio = await client.portfolios.createPortfolio({
  name: 'My Portfolio',
  description: 'Investment portfolio'
});

// Update portfolio
const updated = await client.portfolios.updatePortfolio('portfolio-id', {
  name: 'Updated Portfolio Name'
});

// Delete portfolio
await client.portfolios.deletePortfolio('portfolio-id');
```

## Error Handling

The SDK provides specific error types for different scenarios:

```typescript
import { 
  CincAPIError, 
  NetworkError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ValidationError, 
  RateLimitError, 
  ServerError 
} from '@cinc/api-sdk';

try {
  const data = await client.assets.getAssets();
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle authentication error
    console.error('Please log in again');
  } else if (error instanceof NetworkError) {
    // Handle network error
    console.error('Network connection failed');
  } else if (error instanceof RateLimitError) {
    // Handle rate limiting
    console.error('Too many requests, please wait');
  } else {
    // Handle other errors
    console.error('API error:', error.message);
  }
}
```

## Testing

The SDK includes comprehensive tests. To run tests:

```bash
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

## Development

For developers who want to clone and work with this package from the GitHub repository, see the comprehensive [Developer Guide](./DEVELOPER-GUIDE.md).

### Quick Setup

1. Clone the repository: `git clone https://github.com/acnologiaslayer/cinc-api-sdk.git`
2. Install dependencies: `npm install`
3. Build the SDK: `npm run build`
4. Run tests: `npm test`

### Project Structure

- **src/**: Source code
  - **client/**: Main SDK client
  - **services/**: API service implementations
  - **types/**: TypeScript type definitions
  - **utils/**: Utility functions and HTTP client
- **tests/**: Test files
- **lib/**: Compiled output (generated by build)

## Environment Variables

Configure the SDK using environment variables:

```bash
CINC_API_BASE_URL=https://api.cincapi.com/v2
CINC_API_TIMEOUT=30000
CINC_API_RETRY_ATTEMPTS=3
CINC_API_RETRY_DELAY=1000
```

## Publishing

This SDK is ready to be published as an npm package:

```bash
npm run build    # Build the SDK
npm publish      # Publish to npm (requires npm login)
```

See `PUBLISHING.md` for detailed publishing instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- Check the example code in `example.ts`
- Review test files for usage patterns
- Create an issue for bugs or feature requests