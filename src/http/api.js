// 接口统一集成

import * as login from './moudules/login';
import * as publish from './moudules/publish';
import * as news from './moudules/news';
import * as own from './moudules/own';
import * as footer from './moudules/footer';
import * as mapPage from './moudules/mapPage';

//通用相关接口 优先
import axios from './axios';
import configs from './config';

const postData = ({ url, data, config }) => {
  return axios({
    url: url,
    method: 'post',
    data,
    headers: config && config.headers ? config.headers : configs.headers,
  });
};

// 默认全部导出
export default {
  login,
  publish,
  news,
  own,
  footer,
  mapPage,
  postData,
};
