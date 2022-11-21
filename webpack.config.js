const { resolve } = require('path')

module.exports = {
  target: 'web',
  mode: process.env.NODE_ENV || 'development',
  entry: './app/app.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.webpack.json'
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  output: {
    path: resolve('view'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
}
