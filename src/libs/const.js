let type = window.location.host.indexOf('www.52mlsz.com') >= 0 ? 0 : 1;
// let url = 'http://172.17.5.234:8080';
let url = 'http://172.16.121.137:8000';
const Config = {
  api: type !== 0 ? url : 'http://www.52mlsz.com/wx/api/',
  appid: type !== 0 ? 'wxbdeb4ad23f222b7e' : 'wxab4752ad23e27146',
  domains: type !== 0 ? url : 'http://www.52mlsz.com/',
  jumpUrl: type !== 0 ? url : 'http://www.52mlsz.com/weixin/home/jump',
};

export default Config;

// WEBPACK FOOTER //
// ./src/libs/const.js
