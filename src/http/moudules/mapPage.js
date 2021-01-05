// 网格化地图模块相关接口
import axios from '../axios';

//获取搜捕用户列表
export const queryUserList = (data) => {
  return axios({
    url: '/api/app/gridHunting/queryUserList',
    method: 'post',
    data,
  });
};

// 创建任务
export const publishGridHuntingTask = (data) => {
  return axios({
    url: '/api/app/gridHunting/publishGridHuntingTask',
    method: 'post',
    data,
  });
};

//获取区域人员列表
export const queryUserPointList = (data) => {
  return axios({
    url: '/api/app/gridHunting/queryUserPointList',
    method: 'post',
    data,
  });
};

//删除队员
export const deleteUser = (data) => {
  return axios({
    url: '/api/app/gridHunting/deleteUser',
    method: 'post',
    data,
  });
};

//添加队员
export const saveUserList = (data) => {
  return axios({
    url: '/api/app/gridHunting/saveUserList',
    method: 'post',
    data,
  });
};
