//生产环境配置
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  devtool: 'eval',
  output: {
    filename: 'assets/js/[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/k9-app/',
  },
  plugins: [
    // new UglifyJSPlugin({
    //   uglifyOptions: {
    //     compress: {
    //       drop_console: true, //console
    //       drop_debugger: true,
    //       pure_funcs: ['console.log'], //移除console
    //     },
    //   },
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common', //指定公共bundle的名称。
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name:'vendor'//指定公共bundle的名称。
    // }),
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"', //node提供的常量api
      },
    }),
    // new BundleAnalyzerPlugin(),
    // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
    // function() {
    //   this.plugin('done', function(statsData) {
    //     const stats = statsData.toJson();
    //     fs.writeFileSync(path.join(__dirname, 'stats.json'), JSON.stringify(stats));
    //   });
    // }
  ],
});
