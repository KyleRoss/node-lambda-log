import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  testRegex: '\\.test\\.ts$',
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverage: true,
  coverageReporters: [['json', { file: 'report.json' }], 'lcov', 'text', 'text-summary', 'html'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/src/typings.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/site/']
};

export default config;
