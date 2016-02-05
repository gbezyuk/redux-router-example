import fs from 'fs';
import path from 'path';

import {
  HotModuleReplacementPlugin,
  NoErrorsPlugin
} from 'webpack';

const PROJECT_SRC = path.resolve(__dirname);

const babelrc = fs.readFileSync('.babelrc');
let babelLoaderQuery = {};

try {
  babelLoaderQuery = JSON.parse(babelrc);
} catch (err) {
  console.error('Error parsing .babelrc.');
  console.error(err);
}
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
babelLoaderQuery.plugins.push('react-transform');
babelLoaderQuery.extra = babelLoaderQuery.extra || {};
babelLoaderQuery.extra['react-transform'] = {
  transforms: [{
    transform: 'react-transform-hmr',
    imports: ['react'],
    locals: ['module']
  }]
};

export default {
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      query: babelLoaderQuery,
      exclude: path.resolve(__dirname, 'node_modules'),
      include: [
        PROJECT_SRC
      ]
    }, { test: /\.json$/, loader: 'json'}]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', 'index.js', 'index.jsx', '.json', 'index.json']
  },
  entry: [
    'webpack-hot-middleware/client',
    './client'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new NoErrorsPlugin()
  ],
  devtool: 'eval'
};
