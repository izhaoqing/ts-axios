module.exports = {
  transform: {
    '.(ts|tsx)': 'ts-jest'
  },
  testEnvironment: 'jsdom',
  testRegex: '/test/.*\\.(test|spec)\\.(ts)$',
//   testRegex: '/test/requests.spec.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  testRunner: 'jest-jasmine2',
  collectCoverageFrom: ['src/*.{js,ts}', 'src/**/*.{js,ts}'],
  setupFilesAfterEnv: ['<rootDir>/test/boot.ts'],
  testTimeout: 20000
}
