//底部导航相关接口
import axios from '../axios';

// 导航列表查询
export const queryForApp = () => {
  return axios({
    url: '/api/app/queryForApp',
    method: 'get',
  });
};
