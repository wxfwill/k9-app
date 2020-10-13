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

// 添加请假申请
export const leaveSaveInfo = (data) => {
  return axios({
    url: '/api/leaveRecord/saveInfo',
    method: 'post',
    data,
  });
};

// 获取请假类型列表
export const getLeaveTypeList = (data) => {
  return axios({
    url: '/api/leaveRecord/getLeaveTypeList',
    method: 'post',
    data,
  });
};

//请假申请列表
export const getLeaveList = (data) => {
  return axios({
    url: '/api/leaveRecord/myLeaveList',
    method: 'post',
    data,
  });
};

//请假申请详情
export const getLeaveInfo = (data) => {
  return axios({
    url: '/api/leaveRecord/leaveInfo',
    method: 'post',
    data,
  });
};

// 销假
export const leaveAfterApply = (data) => {
  return axios({
    url: '/api/leaveRecord/leaveAfterApply',
    method: 'post',
    data,
  });
};

// 审批管理列表
export const approvalList = (data) => {
  return axios({
    url: '/api/leaveRecord/leaveListPage',
    method: 'post',
    data,
  });
};

// 删除审批管理草稿状态
export const deleteApproval = (data) => {
  return axios({
    url: '/api/dailyPatrols/delTaskById',
    method: 'post',
    data,
  });
};

//审批信息
export const verifyLeaveApply = (data) => {
  return axios({
    url: '/api/leaveRecord/verifyLeaveApply',
    method: 'post',
    data,
  });
};

// 搜索警犬
export const getByNameOrNumber = (data) => {
  return axios({
    url: '/api/dog/getByNameOrNumber',
    method: 'post',
    data,
  });
};

// 犬病上报
export const reportDisease = (data) => {
  return axios({
    url: '/api/treatmentRecord/reportDisease',
    method: 'post',
    data,
  });
};
