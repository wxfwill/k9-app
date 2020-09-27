// 登录模块相关接口
import axios from "../axios";

// 登录
export const postLogin = (data) => {
  return axios({
    url: "/api/userCenter/loginApp",
    method: "post",
    data,
  });
};
// 测试
export const getTest = () => {
  return axios({
    url: "/hello",
    method: "get",
  });
};
// 下载案件信息
export const downCaseInfo = (params) => {
  return axios({
    url: "/case/download/" + params.id + "?template=" + params.template,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    method: "get",
    responseType: "blob",
  });
};

export const downDocFile = (params) => {
  //下载post
  return axios({
    url: "/judDoc/download",
    method: "get",
    responseType: "blob",
    params,
  });
};
