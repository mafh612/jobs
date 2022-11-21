module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/integration-test/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  reporters: ['default'],
  testEnvironment: 'node',
  globalSetup: '<rootDir>/global.setup.ts',
  globalTeardown: '<rootDir>/global.teardown.ts'
}
