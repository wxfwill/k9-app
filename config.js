let localUrl, apiUrl, ws;

if (process.env.NODE_ENV == 'development') {
  // 本地开发
  localUrl = 'http://127.0.0.1:8083';
  apiUrl = 'http://172.16.121.137:8030';
  ws = 'ws://172.16.121.137:8080';
} else {
  // 测试
  localUrl = 'http://172.16.121.137:8080';
  apiUrl = 'http://172.16.121.137:8080';
  ws = 'ws://172.16.121.137:8080';
}

module.exports = {
  localUrl,
  apiUrl,
  ws,
};
