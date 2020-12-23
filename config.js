let localUrl, apiUrl, ws;

if (process.env.NODE_ENV == 'development') {
  // 本地开发
  localUrl = 'http://127.0.0.1:8083';
  apiUrl = 'http://172.16.121.137:8030';
  ws = 'ws://172.16.121.137:8080';
} else {
  // 测试
  // localUrl = 'http://172.16.121.137:8080';
  // apiUrl = 'http://172.16.121.137:8080';
  // ws = 'ws://172.16.121.137:8080';
  // 生产
  // localUrl = 'http://k9pc.hcfdev.cn';
  // apiUrl = 'http://k9pc.hcfdev.cn';
  // ws = 'ws://k9pc.hcfdev.cn';
  // 外网
  localUrl = 'http://test8.hua-cloud.net:5519';
  apiUrl = 'http://test8.hua-cloud.net:5520';
  ws = 'ws://test8.hua-cloud.net:5520';
}

module.exports = {
  localUrl,
  apiUrl,
  ws,
};
