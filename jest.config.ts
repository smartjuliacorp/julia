import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Use ts-jest for TypeScript compatibility
  testEnvironment: 'node', // Set the test environment to Node.js
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files using ts-jest
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Recognize these file extensions
  testMatch: ['**/tests/**/*.test.ts'], // Test files location
  verbose: true, // Display individual test results
  collectCoverage: true, // Collect coverage information
  collectCoverageFrom: ['src/**/*.ts'], // Specify files for coverage collection
  coverageDirectory: 'coverage', // Output directory for coverage reports
};

export default config;
