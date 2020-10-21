// 我的相关接口
import axios from '../axios';

// 网格化搜捕列表
export const myGridTaskList = (data) => {
  return axios({
    url: '/api/app/pageMyGridSearchTask',
    method: 'post',
    data,
  });
};
// 训练计划列表
export const myTaskTrainList = (data) => {
  return axios({
    url: '/api/app/pageMyTrainTask',
    method: 'post',
    data,
  });
};
