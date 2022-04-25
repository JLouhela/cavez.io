import * as path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import * as webpack from 'webpack';
import * as url from 'url';

const dirName = url.fileURLToPath(new URL('.', import.meta.url));

const configuration: webpack.Configuration = {
  entry: {
    game: './src/client/index.ts',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(dirName, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/client/html/index.html',
      favicon: './public/assets/icon64.png',
      css: './src/client/html/styles.css',
    }),  
  ],
};

export default configuration;
