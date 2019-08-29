const path = require('path')


module.exports = {

  mode: process.env.NODE_ENV || 'production',

  entry: path.resolve(__dirname, `./src/index.js`),

  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'index.js',
    libraryExport: "default" ,
    libraryTarget: 'umd',
    library: 'Zina',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
}
