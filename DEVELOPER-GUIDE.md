# Developer Guide - CINC API SDK

This guide is for developers who want to clone, build, and work with the CINC API SDK from the GitHub repository.

## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (version 16.0.0 or higher)
- **npm** (comes with Node.js)
- **Git**
- **TypeScript** knowledge (recommended)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/acnologiaslayer/cinc-api-sdk.git
cd cinc-api-sdk
```

### 2. Quick Setup (Recommended)

Use the automated setup script:

```bash
chmod +x quick-start.sh
./quick-start.sh
```

This script will:
- Verify prerequisites (Node.js, npm, Git)
- Install dependencies
- Build the project
- Run tests
- Provide next steps

### 3. Manual Setup

If you prefer manual setup:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Project Structure

```
cinc-api-sdk/
├── src/                      # Source TypeScript files
│   ├── client/              # Main SDK client
│   ├── services/            # API service modules
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── tests/                   # Test files
├── lib/                     # Compiled JavaScript output
├── coverage/                # Test coverage reports
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
├── jest.config.js          # Jest test configuration
└── README.md               # Main documentation
```

## Development Workflow

### 1. Making Changes

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the `src/` directory

3. Run tests to ensure everything works:
   ```bash
   npm test
   ```

4. Build the project:
   ```bash
   npm run build
   ```

### 2. Adding New Features

When adding new functionality:

1. **Add Types**: Define interfaces in `src/types/`
2. **Implement Service**: Create or update services in `src/services/`
3. **Write Tests**: Add comprehensive tests in `tests/`
4. **Update Exports**: Add exports to `src/index.ts`
5. **Update Documentation**: Update README.md with new features

### 3. Testing Your Changes

```bash
# Run specific test file
npm test -- tests/yourService.test.ts

# Run tests with verbose output
npm test -- --verbose

# Run tests and generate coverage
npm run test:coverage
```

## Using the SDK in Development

### Local Development Setup

1. **Link the package locally** (for testing in other projects):
   ```bash
   npm link
   ```

2. **In your test project**:
   ```bash
   npm link @cinc/api-sdk
   ```

### Example Usage

Check out the [examples directory](./examples/) for practical usage examples:

```bash
# Run the basic usage example
npx ts-node examples/basic-usage.ts
```

Create a test file to verify your setup:

```typescript
// test-sdk.ts
import { CincAPIClient } from './lib/index.js';

const client = new CincAPIClient({
  baseURL: 'https://api.cincapi.com/v2',
  timeout: 30000
});

async function testSDK() {
  try {
    // Test authentication
    const authResponse = await client.auth.login('test@example.com', 'password');
    console.log('Auth successful:', authResponse);
    
    // Set token for subsequent requests
    client.setAuthToken(authResponse.token);
    
    // Test asset retrieval
    const assets = await client.assets.getAssets();
    console.log('Assets retrieved:', assets.length);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSDK();
```

Run your test:
```bash
npx ts-node test-sdk.ts
```

## Environment Configuration

### Environment Variables

Create a `.env` file in your project root for configuration:

```env
# API Configuration
CINC_API_BASE_URL=https://api.cincapi.com/v2
CINC_API_TIMEOUT=30000

# Test Configuration
TEST_API_KEY=your-test-api-key
TEST_USERNAME=test@example.com
TEST_PASSWORD=test-password
```

### TypeScript Configuration

The project uses strict TypeScript settings. Key configurations in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "strict": true,
    "declaration": true,
    "outDir": "./lib",
    "rootDir": "./src"
  }
}
```

## Testing Guide

### Test Structure

Each service has corresponding test files:
- `tests/authService.test.ts` - Authentication tests
- `tests/assetService.test.ts` - Asset management tests
- `tests/marketService.test.ts` - Market data tests
- `tests/portfolioService.test.ts` - Portfolio tests
- `tests/httpClient.test.ts` - HTTP client tests
- `tests/integration.test.ts` - End-to-end tests

### Writing Tests

Example test structure:

```typescript
import { AuthService } from '../src/services/authService';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(mockHttpClient);
  });

  it('should authenticate user successfully', async () => {
    // Your test implementation
  });
});
```

### Coverage Goals

Maintain high test coverage:
- **Statements**: > 95%
- **Branches**: > 90%
- **Functions**: > 85%
- **Lines**: > 95%

## Building for Production

### 1. Clean Build

```bash
# Remove existing build
rm -rf lib/

# Fresh build
npm run build
```

### 2. Verify Build

```bash
# Check build output
ls -la lib/

# Test the built package
node -e "console.log(require('./lib/index.js'))"
```

### 3. Package for Distribution

```bash
# Create package tarball
npm pack

# This creates cinc-api-sdk-1.0.0.tgz
```

## Publishing Workflow

### 1. Pre-publish Checklist

- [ ] All tests passing
- [ ] Build successful
- [ ] Documentation updated
- [ ] Version bumped in package.json
- [ ] Changelog updated

### 2. Version Management

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

### 3. Publishing

```bash
# Build before publishing
npm run build

# Publish to npm
npm publish

# Or publish to private registry
npm publish --registry https://your-private-registry.com
```

## Troubleshooting

### Common Issues

1. **TypeScript Compilation Errors**
   ```bash
   # Check TypeScript version
   npx tsc --version
   
   # Clean and rebuild
   rm -rf lib/ && npm run build
   ```

2. **Test Failures**
   ```bash
   # Run tests with verbose output
   npm test -- --verbose
   
   # Run specific test
   npm test -- --testNamePattern="your test name"
   ```

3. **Dependency Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Getting Help

- Check the main [README.md](./README.md) for API documentation
- Review [TESTING.md](./TESTING.md) for testing details
- See [PUBLISHING.md](./PUBLISHING.md) for publishing information
- Open an issue on GitHub for bugs or feature requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Update documentation
7. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.
