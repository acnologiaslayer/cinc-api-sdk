# Test Documentation

## Overview

The CINC API SDK includes comprehensive test coverage with **96.66% statement coverage** across all components. Tests are written using Jest and TypeScript.

## Test Structure

```
tests/
├── setup.ts                    # Global test setup
├── httpClient.test.ts          # HTTP client tests
├── authService.test.ts         # Authentication service tests
├── assetService.test.ts        # Asset service tests
├── marketService.test.ts       # Market service tests
├── portfolioService.test.ts    # Portfolio service tests
├── cincAPIClient.test.ts       # Main SDK client tests
└── integration.test.ts         # Integration tests
```

## Running Tests

### All Tests
```bash
npm test
```

### With Coverage
```bash
npm run test:coverage
```

### Watch Mode (for development)
```bash
npm run test:watch
```

## Test Coverage Report

| Component | Statements | Branches | Functions | Lines |
|-----------|------------|----------|-----------|-------|
| **Overall** | **96.66%** | **100%** | **79.48%** | **96.42%** |
| src/client/CincAPIClient.ts | 100% | 100% | 100% | 100% |
| src/services/authService.ts | 100% | 100% | 100% | 100% |
| src/services/assetService.ts | 100% | 100% | 100% | 100% |
| src/services/marketService.ts | 100% | 100% | 100% | 100% |
| src/services/portfolioService.ts | 100% | 100% | 100% | 100% |
| src/utils/httpClient.ts | 100% | 100% | 100% | 100% |
| src/utils/config.ts | 57.14% | 100% | 0% | 57.14% |

## Test Categories

### Unit Tests
- **HttpClient**: Tests HTTP methods, authentication, error handling
- **Services**: Tests all CRUD operations for each service
- **CincAPIClient**: Tests main SDK functionality and service integration

### Integration Tests
- **SDK Integration**: Tests main exports and client instantiation
- **Service Integration**: Tests service interactions through the main client

### Mocking Strategy
- **HTTP Client**: Mocked using Jest mocks
- **Services**: Mocked for client tests
- **Axios**: Mocked for HTTP client tests

## Test Patterns

### Service Tests
Each service test follows this pattern:
```typescript
describe('ServiceName', () => {
  // Setup mocks
  beforeEach(() => { /* setup */ });
  afterEach(() => { /* cleanup */ });
  
  describe('method', () => {
    it('should handle success case', async () => { /* test */ });
    it('should handle error case', async () => { /* test */ });
  });
  
  describe('constructor', () => {
    it('should work with custom HttpClient', () => { /* test */ });
    it('should work with default HttpClient', () => { /* test */ });
  });
});
```

### Mock Response Helper
```typescript
const createMockResponse = (data: any) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});
```

## Test Examples

### Testing API Calls
```typescript
it('should fetch assets successfully', async () => {
  const mockAssets = [/* mock data */];
  const mockResponse = createMockResponse(mockAssets);
  
  mockHttpClient.get.mockResolvedValue(mockResponse);
  
  const result = await assetService.getAssets();
  
  expect(mockHttpClient.get).toHaveBeenCalledWith('/assets');
  expect(result).toEqual(mockAssets);
});
```

### Testing Error Handling
```typescript
it('should handle errors gracefully', async () => {
  mockHttpClient.get.mockRejectedValue(new Error('Network Error'));
  
  await expect(assetService.getAssets()).rejects.toThrow('Network Error');
});
```

### Testing Client Integration
```typescript
it('should initialize all services', () => {
  const client = new CincAPIClient();
  
  expect(client.auth).toBeDefined();
  expect(client.assets).toBeDefined();
  expect(client.markets).toBeDefined();
  expect(client.portfolios).toBeDefined();
});
```

## Best Practices

1. **Arrange-Act-Assert**: Each test follows AAA pattern
2. **Mock External Dependencies**: All HTTP calls are mocked
3. **Test Both Success and Error Cases**: Comprehensive error handling
4. **Descriptive Test Names**: Clear test descriptions
5. **Setup and Cleanup**: Proper beforeEach/afterEach hooks
6. **Type Safety**: Full TypeScript support in tests

## Configuration

### Jest Config (`jest.config.js`)
- **Environment**: Node.js
- **Preset**: ts-jest for TypeScript support
- **Coverage**: HTML, LCOV, and text reports
- **Setup**: Global test setup file
- **Transform**: TypeScript files transformed with ts-jest

### Coverage Exclusions
- Generated declaration files (*.d.ts)
- Server-specific files (app.ts, controllers, routes, middleware)
- Test files themselves

## Continuous Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: npm test

- name: Generate Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v1
```

## Development Workflow

1. **Write Tests First**: TDD approach recommended
2. **Run Tests Frequently**: Use watch mode during development
3. **Maintain Coverage**: Aim for >95% coverage
4. **Update Tests**: When changing API interfaces
5. **Document Changes**: Update test docs when adding new test patterns

The comprehensive test suite ensures the SDK is reliable, maintainable, and ready for production use.
