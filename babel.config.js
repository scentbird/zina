module.exports = (api) =>
  api.env('test')
    ? {
      presets: [
        '@babel/env',
        '@babel/typescript',
      ],
    }
    : {
      presets: [
        [ '@babel/env', { targets: { node: 'current' } } ],
        '@babel/typescript',
      ],
    }
