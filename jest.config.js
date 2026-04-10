/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: [],
  roots: ['<rootDir>/__tests__'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', {
      presets: [
        ['next/babel', { 'preset-react': { runtime: 'automatic' } }]
      ]
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__tests__/__mocks__/fileMock.js',
  },
  testMatch: [
    '**/__tests__/unit/**/*.(test|spec).(ts|tsx|js)',
    '**/__tests__/integration/**/*.(test|spec).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/layout.tsx',
    '!src/**/page.tsx',
    '!src/app/globals.css',
  ],
  coverageThreshold: {
    global: { branches: 60, functions: 60, lines: 60, statements: 60 },
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/e2e/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

module.exports = config;
