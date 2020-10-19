// 消息模块相关接口
import axios from '../axios';

// 网格化搜捕
export const gridSearchList = (data) => {
  return axios({
    url: '/api/appMsgTips/pageMyGridSearchTask',
    method: 'post',
    data,
  });
};
