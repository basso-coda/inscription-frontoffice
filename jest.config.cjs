/** @type {import('jest').Config} */
module.exports = {
  verbose: true,
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|png|gif|webp|svg|css)$': 'jest-transform-stub',
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  setupFilesAfterEnv: [
    "<rootDir>/src/helpers/tests/setupTests.js"
  ]
};
