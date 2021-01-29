const autoprefixer = require('autoprefixer');
module.exports = {
  plugins: [
    [
      autoprefixer({
        overrideBrowserslist: [
          'last 2 versions',
          '> 1%',
          'iOS 7',
          'last 3 iOS versions',
          'Chrome > 31',
          'ff > 31',
          'Android 4.1',
          'ie > 10',
        ],
      }),
    ],
    [
      'postcss-pxtorem',
      {
        rootValue: 75,
        propList: ['*', '!border*', '*Px'],
        selectorBlackList: ['am-', 'weui'],
        minPixelValue: 1,
      },
    ],
  ],
};
