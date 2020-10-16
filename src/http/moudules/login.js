// 登录模块相关接口
import axios from '../axios';

// 登录
export const postLogin = (data) => {
  return axios({
    url: '/api/userCenter/loginApp',
    method: 'post',
    data,
  });
};
// 退出
export const loginOut = () => {
  return axios({
    url: 'api/userCenter/logout',
    method: 'post',
  });
};
// 下载案件信息
export const downCaseInfo = (params) => {
  return axios({
    url: '/case/download/' + params.id + '?template=' + params.template,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'get',
    responseType: 'blob',
  });
};

export const downDocFile = (params) => {
  //下载post
  return axios({
    url: '/judDoc/download',
    method: 'get',
    responseType: 'blob',
    params,
  });
};

// 修改密码-获取详情信息
export const getTodayOnDuty = (data) => {
  return axios({
    url: '/api/onDuty/getTodayOnDuty',
    method: 'post',
    data,
  });
};

// 修改密码
export const updatePassword = (data) => {
  return axios({
    url: '/api/userCenter/updatePassword',
    method: 'post',
    data,
  });
};
