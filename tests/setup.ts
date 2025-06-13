// Global test setup
import 'jest';

// Mock environment variables
process.env.NODE_ENV = 'test';

// Global test timeout
jest.setTimeout(10000);

// Mock console.log in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};
