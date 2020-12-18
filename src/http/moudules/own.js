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
// 日常巡逻列表
export const myTaskDailyPatrolsList = (data) => {
  return axios({
    url: '/api/app/pageMyDailyPatrolsTask',
    method: 'post',
    data,
  });
};
// 紧急调配列表
export const myUrgonTaskList = (data) => {
  return axios({
    url: '/api/app/pageMyEmergencyDeploymentTask',
    method: 'post',
    data,
  });
};
// 定点集合列表
export const myFixedPointList = (data) => {
  return axios({
    url: '/api/app/pageMyAssembleTask',
    method: 'post',
    data,
  });
};
// 外勤任务列表
export const myOuterTaskList = (data) => {
  return axios({
    url: '/api/app/pageMyOutdoorTask',
    method: 'post',
    data,
  });
};
// 请假申请列表
export const myTaskApplyList = (data) => {
  return axios({
    url: '/api/leaveRecord/myLeaveList',
    method: 'post',
    data,
  });
};
// 请假申请详情
export const getLeaveInfo = (data) => {
  return axios({
    url: '/api/leaveRecord/leaveInfo',
    method: 'post',
    data,
  });
};
// 犬病治疗--上报列表
export const myTreatmentRecord = (data) => {
  return axios({
    url: '/api/app/pageMyTreatmentRecord',
    method: 'post',
    data,
  });
};
//犬病上报详情
export const  getDogManageDetails = (data) => {
  return axios({
    url: '/api/treatmentRecord/getDetailById',
    method: 'post',
    data,
  });
};

//自评上报-上报列表
export const getPageSelfEvaluation = (data) => {
  return axios({
    url: '/api/performanceAssessment/getPageSelfEvaluation',
    method: 'post',
    data,
  });
};

//自评上报-获取详情
export const getSelfEvaluation = (data) => {
  return axios({
    url: '/api/performanceAssessment/getSelfEvaluation',
    method: 'post',
    data,
  });
};
