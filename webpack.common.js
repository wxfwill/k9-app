const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const srcPath = path.resolve(__dirname, './src');

const commonSet = {
  entry: {
    app: path.resolve(__dirname, './src/app.js'),
    //vendor: ['react', 'react-dom', 'immutable','rc-form', ],
  },
  output: {
    filename: 'assets/js/[name].js',
    path: path.resolve(__dirname, './dist'),
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.bundle\.js$/,
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
        exclude: path.resolve(__dirname, './node_modules'),
      },
      {
        test: /\.(less|css)$/,
        use: ['style-loader', 'css-loader?minimize', 'less-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)/,
        use: [
          'file-loader?name=assets/images/[hash:8].[name].[ext]',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'learn redux',
      template: './template/index.html',
    }), //自动生成html
    new webpack.ProvidePlugin({
      util: 'util',
      config: 'config',
    }),
  ],
  externals: {
    jquery: 'window.jQuery',
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      //配置路径常量
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
      websocket:`${srcPath}/websocket`,
      config: path.resolve(__dirname, './config'),
      mock: path.resolve(__dirname, './mock'),
    },
  },
};

module.exports = commonSet;
