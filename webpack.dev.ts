import * as webpack from 'webpack';
const { merge } = require("webpack-merge");
import commonWebpackConfiguration from './webpack.common';

const configuration: webpack.Configuration = merge(commonWebpackConfiguration, {
  mode: 'development'
});

export default configuration;