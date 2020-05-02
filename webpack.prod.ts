import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import commonWebpackConfiguration from './webpack.common';

const configuration: webpack.Configuration = merge(commonWebpackConfiguration, {
  mode: 'production'
});

export default configuration;