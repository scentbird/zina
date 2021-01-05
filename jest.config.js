module.exports = {
  verbose: true,
  bail: true,
  roots: [
    '<rootDir>/src',
  ],
  testRegex: '/*.spec.(js|ts|tsx)$',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
  ],
}
