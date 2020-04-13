module.exports = {
  presets: [
    [
      '@babel/preset-env', {
      targets: {
        browsers: [
          'last 2 major versions',
          'not dead',
          'safari >= 9',
          'iOS >= 9',
          'ie >= 11',
        ],
      },
      useBuiltIns: 'usage',
      corejs: '3',
    },
    ],
    '@babel/preset-typescript',
  ],
}
