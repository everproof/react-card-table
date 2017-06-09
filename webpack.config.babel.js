const resolve = require('path').resolve

const Visualizer = require('webpack-visualizer-plugin')

const PATHS = {
  build: resolve(__dirname, 'dist'),
  nodeModules: resolve(__dirname, 'node_modules'),
  src: resolve(__dirname, 'src'),
}

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
}

module.exports = {
  entry: './index.js',
  output: {
    path: PATHS.build,
    filename: 'index.js',
    library: 'react-card-table',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        include: [
          PATHS.src,
          resolve(PATHS.nodeModules, '@blueq', 'blueq-styles'),
        ],
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              camelCase: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              modules: true,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: 'inline',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        include: [PATHS.src],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [PATHS.nodeModules, PATHS.src],
    extensions: ['.js', '.jsx', '.scss'],
    enforceExtension: false,
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
  },
  devtool: 'source-map',
  context: PATHS.src,
  plugins: [new Visualizer()],
  externals: {
    react: reactExternal,
  },
}
