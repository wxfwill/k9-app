// 网格化地图模块相关接口
import axios from '../axios';

// 创建任务
export const publishGridHuntingTask = (data) => {
  return axios({
    url: '/api/app/gridHunting/publishGridHuntingTask',
    method: 'post',
    data,
  });
};
