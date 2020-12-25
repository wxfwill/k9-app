//生产环境配置
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// css 压缩
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// 分析打包大小
const BundleAnalyzerPplugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isAnaly = process.env.BASE_ENV == 'analy';

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'assets/js/[name].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/k9-app/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // 同步 异步 都采用代码分割
      minSize: 30000, // 30kib 引入的库大于 30000  才会做代码分割
      minChunks: 3, // 当某个模块至少被引用2次时，才做代码分割
      maxAsyncRequests: 15, // 按需加载模块最大并行请求数
      maxInitialRequests: 8, //首页入口文件 最多同时加载5个
      automaticNameDelimiter: '~', // 连接符
      name: false,
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(less|css|scss)$/,
          chunks: 'all',
          minChunks: 2,
          reuseExistingChunk: true,
          enforce: true,
          priority: 8,
        },
        icon: {
          name: 'icon',
          test: /\.(woff|woff2|eot|ttf|otf|mp4)$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true,
          priority: 7,
        },
        // 同步代码继续执行
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 同步 引入的库是否在 node_modules中
          priority: -10, // 值越大，优先级就越高
          name: 'vendors',
        },
        default: {
          priority: -20,
          reuseExistingChunk: true, // 当一个模块之前引用过，再次使用时可以直接复用
          name: 'default',
        },
      },
    },
    minimize: true, // 开启输出压缩
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        extractComments: false, // 是否生成 LICENSE.txt文件
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'], //移除console
          },
        },
      }),
      new CssMinimizerPlugin(),
      (compiler) => {
        isAnaly && new BundleAnalyzerPplugin().apply(compiler);
      },
    ],
  },
  target: ['web', 'es5'],
  stats: {
    children: false,
  },
  performance: {
    hints: false,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.BASE_URL': '"' + process.env.BASE_URL + '"',
      'process.env.BASE_WS': JSON.stringify(process.env.BASE_WS),
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
  ],
});
