    module.exports = {
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/src', '<rootDir>/tests'],
      transform: {
        '^.+\\.ts?$': 'ts-jest',
      },
      moduleFileExtensions: ['ts', 'js', 'json', 'node'],
      testMatch: ['<rootDir>/tests/**/*.test.ts'],
    };
    
