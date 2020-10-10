//工作台模块相关接口
import axios from '../axios';

// 添加点名
export const rollCallSaveRec = (data) => {
  return axios({
    url: '/api/attendance/saveRec',
    method: 'post',
    data,
  });
};

// 查询点名列表
export const rollCallListPage = (data) => {
  return axios({
    url: '/api/attendance/listPage',
    method: 'post',
    data,
  });
};

// 查询点名详情
export const rollCallInfo = (data) => {
  return axios({
    url: '/api/attendance/info',
    method: 'post',
    data,
  });
};
