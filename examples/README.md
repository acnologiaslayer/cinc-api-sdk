# CINC API SDK Examples

This directory contains example files demonstrating how to use the CINC API SDK after cloning and building it from GitHub.

## Prerequisites

1. Clone the repository:
   ```bash
   git clone https://github.com/acnologiaslayer/cinc-api-sdk.git
   cd cinc-api-sdk
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

## Running Examples

### Basic Usage Example

The `basic-usage.ts` file demonstrates core SDK functionality:

```bash
# Run with ts-node (recommended for development)
npx ts-node examples/basic-usage.ts

# Or compile and run with node
npx tsc examples/basic-usage.ts --outDir examples/dist
node examples/dist/basic-usage.js
```

**Note**: This example uses the local build (`../lib/index.js`). When installing from GitHub Packages, you would import:
```typescript
import { CincAPIClient } from '@acnologiaslayer/cinc-api-sdk';
```

### Environment Variables

For testing with real API credentials, set these environment variables:

```bash
export TEST_EMAIL=your-email@example.com
export TEST_PASSWORD=your-password
export CINC_API_BASE_URL=https://api.cincapi.com/v2
export CINC_API_TIMEOUT=30000
```

Or create a `.env` file:

```env
TEST_EMAIL=your-email@example.com
TEST_PASSWORD=your-password
CINC_API_BASE_URL=https://api.cincapi.com/v2
CINC_API_TIMEOUT=30000
```

## What the Examples Demonstrate

### 1. Client Initialization
- How to create a new `CincAPIClient` instance
- Configuration options and environment variables

### 2. Authentication
- Login with email/password
- Token management
- Error handling for authentication failures

### 3. Asset Management
- Retrieving assets
- Error handling for asset operations

### 4. Market Data
- Accessing market information
- Handling market data responses

### 5. Portfolio Management
- Portfolio operations (requires valid portfolio IDs)

### 6. Error Handling
- Different error types and how to handle them
- Network errors, authentication errors, etc.

## Expected Output

When you run the basic example, you should see output similar to:

```
🏠 CINC API SDK - Basic Usage Example
=====================================

1. 🔐 Testing Authentication...
   Attempting login with: demo@example.com
   ⚠️  Authentication failed (expected with demo credentials)
   Error: Authentication failed
   💡 To test with real credentials, set environment variables:
      TEST_EMAIL=your-email@example.com
      TEST_PASSWORD=your-password

5. 🔧 Testing SDK Configuration...
   Base URL: Configured from environment or defaults
   Timeout: Configured from environment or defaults
   ✅ Configuration loaded successfully

6. 🛡️  Testing Error Handling...
   ✅ Error handling working correctly
   Error type: NotFoundError
   Error message: Asset not found

🎉 Example completed!

📖 Next steps:
   - Read the Developer Guide: ./DEVELOPER-GUIDE.md
   - Check out the test files: ./tests/
   - Review the API documentation: ./README.md
```

## Creating Your Own Examples

1. Create a new `.ts` file in this directory
2. Import the SDK: 
   - For local development: `import { CincAPIClient } from '../lib/index.js';`
   - For installed package: `import { CincAPIClient } from '@acnologiaslayer/cinc-api-sdk';`
3. Initialize the client and test your use case
4. Run with: `npx ts-node examples/your-example.ts`

## Troubleshooting

If you encounter issues:

1. **Import errors**: Make sure you've run `npm run build` first
2. **TypeScript errors**: Check that all dependencies are installed with `npm install`
3. **Runtime errors**: Verify your environment variables and API credentials

For more help, see the main [Developer Guide](../DEVELOPER-GUIDE.md).
