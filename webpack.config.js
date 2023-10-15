const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: path.resolve(__dirname, 'src/ts/background.ts'),
    content: path.resolve(__dirname, 'src/ts/content.ts'),
    'libs/toastr/toastr': path.resolve(__dirname, 'src/libs/toastr/toastr.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      // Alias the DOMParser module to use the polyfill
      'dom-parser': 'dom-parser-js',
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'manifest.json'),
          to: path.resolve(__dirname, 'dist/'),
        },
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, 'dist/assets'),
        },
        {
          from: path.resolve(__dirname, 'src/libs/toastr/toastr.css'),
          to: path.resolve(__dirname, 'dist/libs/toastr/'),
        },
      ],
    }),
  ],
};
