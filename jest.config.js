module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  maxWorkers: 1,
  coverageDirectory: './coverage/jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
    '@database/(.*)': '<rootDir>/src/database/$1',
    '@logger/(.*)': '<rootDir>/src/logger/$1',
    '@authentication/(.*)': '<rootDir>/src/authentication/$1',
    '@user/(.*)': '<rootDir>/src/user/$1',
    '@util/(.*)': '<rootDir>/src/util/$1',
    '@email/(.*)': '<rootDir>/src/email/$1',
    '@uploader/(.*)': '<rootDir>/src/uploader/$1',
  },
};
