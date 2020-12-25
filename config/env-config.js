const ENV_LIST = [
  {
    envName: 'dev', // 开发
    apiUrl: 'http://172.16.121.137:8030',
    wsUrl: 'ws://172.16.121.137:8030',
  },
  {
    envName: 'test', // 测试
    apiUrl: 'http://172.16.121.137:8080',
    wsUrl: 'ws://172.16.121.137:8080',
  },
  {
    envName: 'testOuternetDev', // 外网-dev
    apiUrl: 'http://test8.hua-cloud.net:5520',
    wsUrl: 'ws://test8.hua-cloud.net:5520',
  },
  {
    envName: 'testOuternetTest', // 外网-test
    apiUrl: 'http://test8.hua-cloud.net:5521',
    wsUrl: 'ws://test8.hua-cloud.net:5521',
  },
  {
    envName: 'pro', // 生产
    apiUrl: 'http://k9pc.hcfdev.cn',
    wsUrl: 'ws://k9pc.hcfdev.cn',
  },

  {
    envName: 'analy', // analy
    apiUrl: 'http://172.16.121.137:8080',
    wsUrl: 'ws://172.16.121.137:8080',
  },
];
const argv = JSON.parse(process.env.npm_config_argv).original || process.argv;
const HOST_ENV = argv[2] ? argv[2].replace(/[^a-z]+/gi, '') : '';
//没有设置环境，则默认为第一个
const HOST_CONF = HOST_ENV ? ENV_LIST.find((item) => item.envName === HOST_ENV) : ENV_LIST[0];
console.log(HOST_CONF);

// 把环境常量挂载到process.env方便客户端使用
process.env.BASE_URL = HOST_CONF.apiUrl;
process.env.BASE_WS = HOST_CONF.wsUrl;
process.env.BASE_ENV = HOST_CONF.envName;

module.exports.HOST_CONF = HOST_CONF;
module.exports.ENV_LIST = ENV_LIST;
