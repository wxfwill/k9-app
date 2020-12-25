const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const srcPath = path.resolve(__dirname, '../src');
require('./env-config');
const devMode = process.env.NODE_ENV == 'development';
console.log('当前构建模式===' + process.env.NODE_ENV);
console.log('当前打包环境===' + process.env.BASE_ENV);

const commonSet = {
  entry: {
    app: path.resolve(__dirname, '../src/app.js'),
  },
  module: {
    rules: [
      {
        test: /\.bundle\.js$/,
        // use: 'bundle-loader',
        use: [
          {
            loader: 'bundle-loader',
            options: {
              lazy: true,
              name: '[name]',
            },
          },
        ],
        include: path.join(__dirname, 'src'), // 源码目录
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, '../node_modules'),
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)/,
        use: [
          'file-loader?name=assets/images/[hash:8].[name].[ext]',
          // {
          //   loader: 'image-webpack-loader',
          //   options: {
          //     bypassOnDebug: true,
          //   },
          // },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:7].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'k9 app',
      template: './template/index.html',
    }), //自动生成html
    new webpack.ProvidePlugin({
      util: 'util',
      config: 'config',
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name]-[chunkhash:8].css', // hmr不支持hash命名
      ignoreOrder: true, // 禁止检查顺序
    }),
  ],
  // externals: {
  //   jquery: 'window.jQuery',
  // },
  resolve: {
    // fallback: {
    //   crypto: require.resolve('crypto-browserify'),
    //   stream: require.resolve('stream-browserify'),
    // },
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      //配置路径常量
      page: `${srcPath}/page`,
      localData: `${srcPath}/localData`,
      components: `${srcPath}/components`,
      actions: `${srcPath}/redux/actions`,
      constants: `${srcPath}/redux/constants`,
      containers: `${srcPath}/redux/containers`,
      reducers: `${srcPath}/redux/reducers`,
      router: `${srcPath}/router`,
      style: `${srcPath}/style`,
      images: `${srcPath}/images`,
      libs: `${srcPath}/libs`,
      util: `${srcPath}/libs/util`,
      ezuikit: `${srcPath}/hkplayer/ezuikit.js`,
      websocket: `${srcPath}/websocket`,
      store: `${srcPath}/store`,
      config: path.resolve(__dirname, './config'),
    },
  },
};

module.exports = commonSet;
