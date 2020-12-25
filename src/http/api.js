// 接口统一集成

import * as login from './moudules/login';
import * as publish from './moudules/publish';
import * as news from './moudules/news';
import * as own from './moudules/own';
import * as footer from './moudules/footer';

// 默认全部导出
export default {
  login,
  publish,
  news,
  own,
  footer,
};
