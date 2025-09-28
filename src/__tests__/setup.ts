// Jest setup file for global test configuration

// Mock console methods to reduce noise in tests
const originalConsole = console;

beforeAll(() => {
  // Suppress console.log during tests unless explicitly needed
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

afterAll(() => {
  // Restore original console
  global.console = originalConsole;
});

// Global test timeout
jest.setTimeout(10000);

// Mock environment variables
process.env.BGG_API_BASE_URL = 'https://boardgamegeek.com/xmlapi2';
process.env.NODE_ENV = 'test';
