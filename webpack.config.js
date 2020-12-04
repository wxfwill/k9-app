//开发环境配置
const path = require('path');
const webpack = require('webpack');
const commonSet = require('./webpack.common.js');
// var OpenBrowserPlugin = require("open-browser-webpack-plugin");
const { apiUrl } = require('./config.js');
console.log('api===' + apiUrl);

const config = {
  entry: ['babel-polyfill', 'react-hot-loader/patch', './src/app.js'],
  output: {
    filename: 'assets/js/[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/k9-app/',
  },
  devtool: commonSet.devtool, //定位错位位置
  devServer: {
    //浏览器自动刷新,需下载webpack-dev-server
    // contentBase: path.join(__dirname, "./dist"),
    // overlay: true,
    port: 8083,
    hot: true, //开启热更新
    // stats: "errors-only",
    open: true,
    host: '127.0.0.1',
    // historyApiFallback: true, // 默认404页面跳转index.html
    historyApiFallback: {
      index: '/k9-app/',
    },
    proxy: {
      '/api/*': {
        target: apiUrl + '/',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  module: commonSet.module,
  plugins: [
    // new webpack.optimize.UglifyJsPlugin(), //压缩打包后文件
    // new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ConsoleLogWebpackStart(), //自定义插件
    // new OpenBrowserPlugin({ url: "http://localhost:8081" }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"', //node提供的常量api
      },
    }),
  ].concat(commonSet.plugins),
  resolve: commonSet.resolve,
};
function ConsoleLogWebpackStart() {}
ConsoleLogWebpackStart.prototype.apply = function (compiler) {
  compiler.plugin('run', function (compiler, callback) {
    console.log('package start!');
    callback();
  });
};
module.exports = config;
