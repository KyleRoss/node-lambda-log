import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '\\.spec\\.ts$',
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverage: true,
  coverageReporters: [['json', { file: 'report.json' }], 'lcov', 'text', 'text-summary', 'html'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/src/index.ts', '<rootDir>/src/typings.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleDirectories: ['node_modules', 'src'],
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/site/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json'
    }
  }
};

export default config;
