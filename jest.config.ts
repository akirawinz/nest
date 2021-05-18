// jest.config.ts
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

const e2eConfig: Config.InitialOptions = {
  ...config,
  rootDir: 'e2e',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
};

const isE2E = process.env.TEST_ENV === 'e2e';

export default isE2E ? e2eConfig : config;
