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

//日常巡逻-通过id获取详情数据
export const getDailyPatrolsById = (data) => {
  return axios({
    url: '/api/dailyPatrols/getDailyPatrolsById',
    method: 'post',
    data,
  });
};

//日常巡逻-查询人员列表
export const getCombatStaff = (data) => {
  return axios({
    url: '/api/userCenter/getCombatStaff',
    method: 'post',
    data,
  });
};

//查询中队列表
export const getUserGroup = (data) => {
  return axios({
    url: '/api/basicData/userGroup',
    method: 'post',
    data,
  });
};

//日常巡逻-终止任务
export const stopPatrols = (data) => {
  return axios({
    url: '/api/cmdMonitor/stopPatrols',
    method: 'post',
    data,
  });
};

//日常巡逻-发布
export const distributeTask = (data) => {
  return axios({
    url: '/api/dailyPatrols/distributeTask',
    method: 'post',
    data,
  });
};

//日常巡逻-上报
export const roundSaveInfo = (data) => {
  return axios({
    url: '/api/taskReport/saveInfo',
    method: 'post',
    data,
  });
};

// 紧急调配-
export const getCombatType = (data) => {
  return axios({
    url: '/api/basicData/combatType',
    method: 'post',
    data,
  });
};

// 紧急调配-发布
export const publishEmergencyDeploymentPlan = (data) => {
  return axios({
    url: '/api/cmdMonitor/publishEmergencyDeploymentPlan',
    method: 'post',
    data,
  });
};

// 紧急调配-上报
export const emedepSaveInfo = (data) => {
  return axios({
    url: '/api/taskReport/saveInfo',
    method: 'post',
    data,
  });
};

//紧急调配- 终止任务
export const stopEmergency = (data) => {
  return axios({
    url: '/api/cmdMonitor/stopEmergency',
    method: 'post',
    data,
  });
};

// 定点集合-发布
export const saveAssemblePoint = (data) => {
  return axios({
    url: '/api/cmdMonitor/saveAssemblePoint',
    method: 'post',
    data,
  });
};

// 定点集合-上报
export const aggregateSaveInfo = (data) => {
  return axios({
    url: '/api/taskReport/saveInfo',
    method: 'post',
    data,
  });
};

//定点集合- 终止任务
export const stopAssembleTask = (data) => {
  return axios({
    url: '/api/cmdMonitor/stopAssembleTask',
    method: 'post',
    data,
  });
};

// 外勤任务-发布
export const legworkDistributeTask = (data) => {
  return axios({
    url: '/api/outdoorTask/distributeTask',
    method: 'post',
    data,
  });
};

// 外勤任务-上报
export const legworkSaveInfo = (data) => {
  return axios({
    url: '/api/taskReport/saveInfo',
    method: 'post',
    data,
  });
};

//训练计划-
export const getAllTrainSubjectName = (data) => {
  return axios({
    url: '/api/trainingSubject/getAllTrainSubjectName',
    method: 'post',
    data,
  });
};

//训练计划-基地场内信息
export const listAllTrainPlace = (data) => {
  return axios({
    url: '/api/train/listAllTrainPlace',
    method: 'post',
    data,
  });
};

// 训练计划-发布
export const trainPublishPlan = (data) => {
  return axios({
    url: '/api/train/publishPlan',
    method: 'post',
    data,
  });
};

// 训练计划-上报
export const trainSaveInfo = (data) => {
  return axios({
    url: '/api/taskReport/saveInfo',
    method: 'post',
    data,
  });
};

// 自评上报-获取4W报备统计信息
export const getFourWReportStatistics = (data) => {
  return axios({
    url: '/api/performanceAssessment/getFourWReportStatistics',
    method: 'post',
    data,
  });
};

//自评上报-获取考勤统计信息
export const getAttendanceStatistics = (data) => {
  return axios({
    url: '/api/performanceAssessment/getAttendanceStatistics',
    method: 'post',
    data,
  });
};

//自评上报-新增
export const saveSelfEvaluation = (data) => {
  return axios({
    url: '/api/performanceAssessment/saveSelfEvaluation',
    method: 'post',
    data,
  });
};
