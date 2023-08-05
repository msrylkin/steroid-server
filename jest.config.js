/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  verbose: true,
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  modulePaths: ['.'],
  moduleNameMapper: {
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^functions/(.*)$': '<rootDir>/src/functions/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
};