// 消息模块相关接口
import axios from '../axios';

// 网格化搜捕
export const gridSearchList = (data) => {
  return axios({
    url: '/api/app/pageMyGridSearchTask',
    method: 'post',
    data,
  });
};
