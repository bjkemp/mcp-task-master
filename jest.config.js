/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: 'jest-environment-node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1.js',
  },
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
};

export default config;
