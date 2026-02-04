import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/server/modules/cloudinary/test/**/*.test.ts'],
};

export default config;
