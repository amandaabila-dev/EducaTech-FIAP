/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/frontend/'],
  collectCoverageFrom: ['src/**/*.js', '!src/server.js', '!src/swagger.js'],
  coverageThreshold: {
    global: { statements: 30, branches: 30, functions: 30, lines: 30 },
  },
  moduleDirectories: ['node_modules', 'src'],
  globalTeardown: '<rootDir>/tests/teardown.js',
  forceExit: true,
};
