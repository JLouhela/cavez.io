import * as webpack from 'webpack';
import {merge} from 'webpack-merge';
import commonWebpackConfiguration from './webpack.common.js';

const configuration: webpack.Configuration = merge(commonWebpackConfiguration, {
  mode: 'production'
});

export default configuration;