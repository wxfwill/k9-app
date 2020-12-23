/** @format */

// import globalUrl from '../../globalConfig.js';

console.log('config');
console.log(config);

export default {
  method: 'get',
  // 基础url前缀
  baseUrl: config.apiUrl,
  // 请求头信息
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  // 设置请求超时重新请求次数
  retry: 1,
  // 参数
  data: {},
  // 设置超时时间
  timeout: 5000,
  // 携带凭证
  withCredentials: true,
  // 返回数据类型
  responseType: 'json',
};
