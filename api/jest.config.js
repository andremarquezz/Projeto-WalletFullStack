/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.ts?(x)'],
  coveragePathIgnorePatterns: [
    'src/database/*',
    'src/routes/*',
    'src/interfaces/*',
    'src/tests/*',
  ],
};
