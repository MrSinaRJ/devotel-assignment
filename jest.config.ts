import type { Config } from 'jest';

const config: Config = {
  rootDir: '.',
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^utils/(.*)$': '<rootDir>/src/common/utils/$1',
    '^@health/(.*)$': '<rootDir>/src/modules/health/$1',
    '^@job-offers/(.*)$': '<rootDir>/src/modules/job-offers/$1',
    '^@scheduler/(.*)$': '<rootDir>/src/modules/scheduler/$1',
    '^@scraper/(.*)$': '<rootDir>/src/modules/scraper/$1',
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};

export default config;
