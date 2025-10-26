'use strict';

const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';

const SRC_PATH = path.resolve(__dirname, 'src');
const BUILD_PATH = path.resolve(__dirname, 'build');
const PUBLIC_PATH = path.resolve(__dirname, 'public');

const createPages = () => {
  const pages = [
    {
      name: 'index', // chatsList будет главной
      template: './pages/chatsList/chatsList.html',
      chunks: ['chatsList'],
    },
    {
      name: 'chat',
      template: './pages/chat/chat.html',
      chunks: ['chat'],
    },
  ];

  return pages.map(
    (page) =>
      new HTMLWebpackPlugin({
        filename: `${page.name}.html`,
        template: page.template,
        chunks: page.chunks,
        inject: true, // CSS в <head>, JS перед </body>
      })
  );
};

module.exports = {
  mode: isProd ? 'production' : 'development',
  context: SRC_PATH,
  entry: {
    chatsList: './pages/chatsList/chatsList.js',
    chat: './pages/chat/chat.js',
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].bundle.js',
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: SRC_PATH,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          isProd ? MiniCSSExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: { filename: 'images/[name][ext]' },
      },
    ],
  },
  plugins: [
    ...(isProd
      ? [
          new MiniCSSExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].css',
            publicPath: '/',
          }),
        ]
      : []),
    ...createPages(),
  ],
  devServer: {
    static: [
      { directory: BUILD_PATH },
      { directory: PUBLIC_PATH, publicPath: '/' },
    ],
    port: 3000,
    open: true,
    hot: true, // Включаем HMR
    historyApiFallback: {
      disableDotRule: true, // чтобы chat.html корректно открывался
    },
  },
  devtool: isProd ? 'source-map' : 'eval-source-map',
};
