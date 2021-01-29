//我的--列表
export const appMenu = [
  {
    text: '我的任务',
    icon: require('images/own/own-task.svg'),
    link: '/own/OwnTask',
  },
  {
    text: '轨迹查看',
    icon: require('images/own/own-trail.svg'),
    link: '/own/TailView',
  },
  {
    text: '点名',
    icon: require('images/own/own-roll-call.svg'),
    link: '/own/callList',
  },
  {
    text: '审批管理',
    icon: require('images/own/own-approval.svg'),
    link: '/own/OwnApproval?titleType=审批管理',
  },
  {
    text: '请假申请',
    icon: require('images/own/own-vacation.svg'),
    link: '/own/OwnLeaveList',
  },
  {
    text: '犬病上报',
    icon: require('images/own/own-dog-report.svg'),
    link: '/own/DogManageList',
  },
  {
    text: '我的考核',
    icon: require('images/own/self-assessment.svg'),
    link: '/own/SelfAssessmentList',
  },
];

// 我的任务 tabs
export const tabs = [
  {
    title: '网格化搜捕',
    label: '0',
    id: 0,
    icon: require('images/own/tasktab/grild.svg'),
    ActiveIcon: require('images/own/tasktab/active-grild.svg'),
  },
  {
    title: '训练计划',
    label: '1',
    id: 1,
    icon: require('images/own/tasktab/xun.svg'),
    ActiveIcon: require('images/own/tasktab/active-xun.svg'),
  },
  {
    title: '日常巡逻',
    label: '2',
    id: 2,
    icon: require('images/own/tasktab/daily.svg'),
    ActiveIcon: require('images/own/tasktab/active-daily.svg'),
  },
  {
    title: '紧急调配',
    label: '3',
    id: 3,
    icon: require('images/own/tasktab/jing.svg'),
    ActiveIcon: require('images/own/tasktab/active-jing.svg'),
  },
  {
    title: '定点集合',
    label: '4',
    id: 4,
    icon: require('images/own/tasktab/ding.svg'),
    ActiveIcon: require('images/own/tasktab/active-ding.svg'),
  },
  {
    title: '外勤任务',
    label: '5',
    id: 5,
    icon: require('images/own/tasktab/task.svg'),
    ActiveIcon: require('images/own/tasktab/active-task.svg'),
  },
];
