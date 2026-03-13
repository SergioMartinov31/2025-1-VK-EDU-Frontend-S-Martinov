/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  // We compile TS tests to JS first into `.jest-build`.
  testMatch: ['<rootDir>/.jest-build/**/*.test.js'],
};

