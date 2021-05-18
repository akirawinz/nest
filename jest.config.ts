// jest.config.ts
import type { Config } from '@jest/types';

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
import * as tsconfig from './tsconfig.json';

interface TsConfig {
  compilerOptions: {
    paths: {
      [k: string]: string[];
    };
  };
}

// Slightly modified version of https://github.com/ryohey/tsconfig-paths-jest
function moduleNameMapperFromTSPaths(tsconfig: TsConfig) {
  // eslint-disable-next-line prettier/prettier
  return Object.entries(tsconfig.compilerOptions.paths)
      // eslint-disable-next-line prettier/prettier
      .map(([k, [v]]) => [`^${k.replace(/\*/, '(.*)')}$`, `<rootDir>/../${v.replace(/\*/, '$1')}`])
      // eslint-disable-next-line prettier/prettier
      .reduce((res, [key, value]) => ({ ...res, [key]: value }), {});
}

// base jest config
const baseConfig: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: moduleNameMapperFromTSPaths(tsconfig),
};

// override for e2e
const e2eConfig: Config.InitialOptions = {
  ...baseConfig,
  rootDir: 'e2e',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
};

const isE2E = process.env.TEST_ENV === 'e2e';

const config = isE2E ? e2eConfig : baseConfig;

console.log('jest config', config);

export default config;
