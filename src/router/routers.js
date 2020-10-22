import React, { Component } from 'react';
import Bundle from './Bundle';

// 登录
const Login = (props) => (
  <Bundle load={() => import('page/other/Login/Login')}>{(Login) => <Login {...props} />}</Bundle>
);
const LoginPolicy = (props) => (
  <Bundle load={() => import('page/other/Login/Policy')}>{(LoginPolicy) => <LoginPolicy {...props} />}</Bundle>
);

/**密码修改 */
const UpdatePwd = (props) => (
  <Bundle load={() => import('page/other/UpdatePwd/index')}>{(UpdatePwd) => <UpdatePwd {...props} />}</Bundle>
);

// ===工作台相关===
const Publish = (props) => <Bundle load={() => import('page/workbench')}>{(Publish) => <Publish {...props} />}</Bundle>;
// 网格化搜索
const PublishGridSearch = (props) => (
  <Bundle load={() => import('page/workbench/GridSeach')}>
    {(PublishGridSearch) => <PublishGridSearch {...props} />}
  </Bundle>
);
// 日常巡逻
const AddPubRound = (props) => (
  <Bundle load={() => import('page/workbench/PubRound/AddPubRound')}>
    {(AddPubRound) => <AddPubRound {...props} />}
  </Bundle>
);
// 训练计划
const AddPubTraining = (props) => (
  <Bundle load={() => import('page/workbench/PubTraining/AddPubTraining')}>
    {(AddPubTraining) => <AddPubTraining {...props} />}
  </Bundle>
);
// 紧急调配
const AddEmedep = (props) => (
  <Bundle load={() => import('page/workbench/PubEmedep/AddItem')}>{(AddEmedep) => <AddEmedep {...props} />}</Bundle>
);
// 定点集合
const AddAggregate = (props) => (
  <Bundle load={() => import('page/workbench/PubAggregate/AddItem')}>
    {(AddAggregate) => <AddAggregate {...props} />}
  </Bundle>
);
// 外请任务
const AddItinerancy = (props) => (
  <Bundle load={() => import('page/workbench/PubItinerancy/AddItem')}>
    {(AddItinerancy) => <AddItinerancy {...props} />}
  </Bundle>
);

// 点名
const PublishRollCall = (props) => (
  <Bundle load={() => import('page/workbench/RollCall')}>{(PublishRollCall) => <PublishRollCall {...props} />}</Bundle>
);
// 点名列表
const PublishRollCallList = (props) => (
  <Bundle load={() => import('page/workbench/RollCall/RollCallList')}>
    {(PublishRollCallList) => <PublishRollCallList {...props} />}
  </Bundle>
);
// 点名详情
const PublishRollCallDetails = (props) => (
  <Bundle load={() => import('page/workbench/RollCall/RollCallDetails')}>
    {(PublishRollCallDetails) => <PublishRollCallDetails {...props} />}
  </Bundle>
);

// 审批管理
const ApprovalMangement = (props) => (
  <Bundle load={() => import('page/workbench/ApprovalMangement')}>
    {(ApprovalMangement) => <ApprovalMangement {...props} />}
  </Bundle>
);

// 请假申请
const PublishVacation = (props) => (
  <Bundle load={() => import('page/workbench/VacationMangement')}>
    {(PublishVacation) => <PublishVacation {...props} />}
  </Bundle>
);
// 请假申请列表
const PublishLeaveList = (props) => (
  <Bundle load={() => import('page/workbench/VacationMangement/list')}>
    {(PublishLeaveList) => <PublishLeaveList {...props} />}
  </Bundle>
);
// 请假申请详情
const PublishLeaveDetails = (props) => (
  <Bundle load={() => import('page/workbench/VacationMangement/details')}>
    {(PublishLeaveDetails) => <PublishLeaveDetails {...props} />}
  </Bundle>
);
// 犬病上报
const PublishDogReport = (props) => (
  <Bundle load={() => import('page/workbench/DogReport')}>
    {(PublishDogReport) => <PublishDogReport {...props} />}
  </Bundle>
);

//****我的****
const Own = (props) => <Bundle load={() => import('page/own/Own')}>{(Own) => <Own {...props} />}</Bundle>;
// 我的任务
const OwnTask = (props) => (
  <Bundle load={() => import('page/own/OwnTask')}>{(OwnTask) => <OwnTask {...props} />}</Bundle>
);
// 轨迹查看
const TailView = (props) => (
  <Bundle load={() => import('page/own/TrailView')}>{(TailView) => <TailView {...props} />}</Bundle>
);
// 点名
const OwnCallList = (props) => (
  <Bundle load={() => import('page/own/Call/List')}>{(OwnCallList) => <OwnCallList {...props} />}</Bundle>
);
// 审批管理
const OwnApproval = (props) => (
  <Bundle load={() => import('page/own/Approval')}>{(OwnApproval) => <OwnApproval {...props} />}</Bundle>
);
// 审批管理详情
const OwnApprovalDetails = (props) => (
  <Bundle load={() => import('page/own/Approval/ApprovalDetails')}>
    {(OwnApprovalDetails) => <OwnApprovalDetails {...props} />}
  </Bundle>
);
// 请假申请列表
const OwnLeaveList = (props) => (
  <Bundle load={() => import('page/own/OwnLevel/list')}>{(OwnLeaveList) => <OwnLeaveList {...props} />}</Bundle>
);
// 请假申请详情
const OwnLeaveListDetails = (props) => (
  <Bundle load={() => import('page/own/OwnLevel/LevelDetails')}>
    {(OwnLeaveListDetails) => <OwnLeaveListDetails {...props} />}
  </Bundle>
);

const PubRoundDetails = (props) => (
  <Bundle load={() => import('containers/publish/PubRound/PubRoundDetails')}>
    {(PubRoundDetails) => <PubRoundDetails {...props} />}
  </Bundle>
);

const PubEmedepDetails = (props) => (
  <Bundle load={() => import('containers/publish/PubEmedep/PubEmedepDetails')}>
    {(PubEmedepDetails) => <PubEmedepDetails {...props} />}
  </Bundle>
);

const Track = (props) => (
  <Bundle load={() => import('components/track/Track')}>{(Track) => <Track {...props} />}</Bundle>
);
const TrackMap = (props) => (
  <Bundle load={() => import('components/track/TrackMap')}>{(TrackMap) => <TrackMap {...props} />}</Bundle>
);
const Drill = (props) => (
  <Bundle load={() => import('components/own/OwnTask/Drill')}>{(Drill) => <Drill {...props} />}</Bundle>
);
const DrillDetail = (props) => (
  <Bundle load={() => import('components/own/OwnTask/Drill/drilldetail/DrillDetail')}>
    {(DrillDetail) => <DrillDetail {...props} />}
  </Bundle>
);
const DrillTrackMap = (props) => (
  <Bundle load={() => import('components/own/OwnTask/Drill/drilldetail/TrackMap')}>
    {(DrillTrackMap) => <DrillTrackMap {...props} />}
  </Bundle>
);
/*外勤任务*/
const Itinerancy = (props) => (
  <Bundle load={() => import('components/own/OwnTask/Itinerancy')}>{(Itinerancy) => <Itinerancy {...props} />}</Bundle>
);
const ItinerancyDetail = (props) => (
  <Bundle load={() => import('components/own/OwnTask/Itinerancy/itinerancydetail/ItinerancyDetail')}>
    {(ItinerancyDetail) => <ItinerancyDetail {...props} />}
  </Bundle>
);

const OwnLevel = (props) => (
  <Bundle load={() => import('components/own/OwnLevel')}>{(OwnLevel) => <OwnLevel {...props} />}</Bundle>
);
const LevelDetails = (props) => (
  <Bundle load={() => import('components/own/OwnLevel/LevelDetails')}>
    {(LevelDetails) => <LevelDetails {...props} />}
  </Bundle>
);

/**值班情况 */
const Duty = (props) => <Bundle load={() => import('components/own/Duty')}>{(Duty) => <Duty {...props} />}</Bundle>;
/**设备管理 */
const Equipment = (props) => (
  <Bundle load={() => import('components/own/Equipment/Equipment')}>{(Equipment) => <Equipment {...props} />}</Bundle>
);
const EquipmentList = (props) => (
  <Bundle load={() => import('components/own/Equipment/EquipmentList')}>
    {(Equipment) => <Equipment {...props} />}
  </Bundle>
);
const EquipmentDetail = (props) => (
  <Bundle load={() => import('components/own/Equipment/EquipmentDetail')}>
    {(Equipment) => <Equipment {...props} />}
  </Bundle>
);
const Attend = (props) => (
  <Bundle load={() => import('components/own/OwnLevel/Attend')}>{(Attend) => <Attend {...props} />}</Bundle>
);
const Round = (props) => (
  <Bundle load={() => import('containers/round/Round')}>{(Round) => <Round {...props} />}</Bundle>
);
const RoundMap = (props) => (
  <Bundle load={() => import('containers/round/roundMAP')}>{(RoundMap) => <RoundMap {...props} />}</Bundle>
);
const OwnRoundMap = (props) => (
  <Bundle load={() => import('components/own/OwnTask/OwnRound/OwnRoundMap')}>
    {(OwnRoundMap) => <OwnRoundMap {...props} />}
  </Bundle>
);
const AggregatePointMap = (props) => (
  <Bundle load={() => import('components/own/OwnTask/AggregatePoint/AggPointMap')}>
    {(AggregatePointMap) => <AggregatePointMap {...props} />}
  </Bundle>
);
const OwnEmDepMap = (props) => (
  <Bundle load={() => import('components/own/OwnTask/EmergencyDeployment/OwnEmDepMap')}>
    {(OwnEmDepMap) => <OwnEmDepMap {...props} />}
  </Bundle>
);
const OwnGridSearchMap = (props) => (
  <Bundle load={() => import('components/own/OwnTask/GridSearch/OwnGridSearchMap')}>
    {(OwnGridSearchMap) => <OwnGridSearchMap {...props} />}
  </Bundle>
);
const Fight = (props) => <Bundle load={() => import('containers/fight')}>{(Fight) => <Fight {...props} />}</Bundle>;
const Check = (props) => <Bundle load={() => import('page/mapPage')}>{(Check) => <Check {...props} />}</Bundle>;

const Test = (props) => <Bundle load={() => import('components/test')}>{(Test) => <Test {...props} />}</Bundle>;
/**警犬管理 */
const DogManage = (props) => (
  <Bundle load={() => import('components/own/DogManage/index.js')}>{(DogManage) => <DogManage {...props} />}</Bundle>
);
/**警犬监控 */
const DogMonitor = (props) => (
  <Bundle load={() => import('components/own/DogMonitor/index')}>{(DogMonitor) => <DogMonitor {...props} />}</Bundle>
);
/** 查看指定的狗视频直播*/
const ViewDogVideo = (props) => (
  <Bundle load={() => import('components/own/DogMonitor/ViewDogVideo')}>
    {(ViewDogVideo) => <ViewDogVideo {...props} />}
  </Bundle>
);

/**我的警犬 */
const MyDogList = (props) => (
  <Bundle load={() => import('components/own/DogManage/MyDog/index')}>{(MyDogList) => <MyDogList {...props} />}</Bundle>
);
/**犬病上报 */
const SickUpdate = (props) => (
  <Bundle load={() => import('components/own/DogManage/Sickupdate')}>
    {(SickUpdate) => <SickUpdate {...props} />}
  </Bundle>
);

/**消息提示 */
const News = (props) => <Bundle load={() => import('page/news/News')}>{(News) => <News {...props} />}</Bundle>;
const NewsList = (props) => (
  <Bundle load={() => import('page/news/New-list')}>{(NewsList) => <NewsList {...props} />}</Bundle>
);

/**警犬运动统计 */
const DogActivity = (props) => (
  <Bundle load={() => import('components/own/DogManage/DogActivity/index')}>
    {(DogActivity) => <DogActivity {...props} />}
  </Bundle>
);

/**警犬诊断列表 */
const DogTreatmentList = (props) => (
  <Bundle load={() => import('components/own/Treatment/index')}>
    {(DogTreatmentList) => <DogTreatmentList {...props} />}
  </Bundle>
);

/**警犬诊断页面 */
const DogDiagnosis = (props) => (
  <Bundle load={() => import('components/own/Treatment/Diagnosis')}>
    {(DogDiagnosis) => <DogDiagnosis {...props} />}
  </Bundle>
);

/**账号安全 */
const Account = (props) => (
  <Bundle load={() => import('components/own/Account')}>{(Account) => <Account {...props} />}</Bundle>
);
/**点名 */
const Call = (props) => <Bundle load={() => import('components/own/Call')}>{(Call) => <Call {...props} />}</Bundle>;

const AddCall = (props) => (
  <Bundle load={() => import('components/own/Call/AddCall')}>{(AddCall) => <AddCall {...props} />}</Bundle>
);
const CallDetails = (props) => (
  <Bundle load={() => import('components/own/Call/CallDetails')}>{(CallDetails) => <CallDetails {...props} />}</Bundle>
);

/**密码修改 */
// const UpdatePwd = (props) => (
//   <Bundle load={() => import('components/own/Account/UpdatePwd')}>{(UpdatePwd) => <UpdatePwd {...props} />}</Bundle>
// );
/**假期管理 */
const Holiday = (props) => (
  <Bundle load={() => import('components/own/Holiday')}>{(Holiday) => <Holiday {...props} />}</Bundle>
);
/**审批管理 */
const Approval = (props) => (
  <Bundle load={() => import('components/own/Approval')}>{(Approval) => <Approval {...props} />}</Bundle>
);
const ApprovalDetails = (props) => (
  <Bundle load={() => import('components/own/Approval/ApprovalDetails')}>
    {(ApprovalDetails) => <ApprovalDetails {...props} />}
  </Bundle>
);
/** 饲养管理 **/
const Feeding = (props) => (
  <Bundle load={() => import('components/own/Feeding')}>{(Feeding) => <Feeding {...props} />}</Bundle>
);
/**上报详情 */
const ReportDetail = (props) => (
  <Bundle load={() => import('components/common/Report/ReportDetail')}>
    {(ReportDetail) => <ReportDetail {...props} />}
  </Bundle>
);

// 地图相关
// 创建任务
const MapCreate = (props) => (
  <Bundle load={() => import('page/mapPage/createTask')}>{(MapCreate) => <MapCreate {...props} />}</Bundle>
);
// 创建任务后分配人员
const AssignPerson = (props) => (
  <Bundle load={() => import('page/mapPage/assignPerson')}>{(AssignPerson) => <AssignPerson {...props} />}</Bundle>
);
// 发布任务
const PushTask = (props) => (
  <Bundle load={() => import('page/mapPage/pushTask')}>{(PushTask) => <PushTask {...props} />}</Bundle>
);
// 添加小组成员
const AddTeamPerson = (props) => (
  <Bundle load={() => import('page/mapPage/addTeamPerson')}>{(AddTeamPerson) => <AddTeamPerson {...props} />}</Bundle>
);

// 任务详情
const MapTaskDetal = (props) => (
  <Bundle load={() => import('page/mapPage/taskDetal')}>{(MapTaskDetal) => <MapTaskDetal {...props} />}</Bundle>
);

import NotFound from 'components/NotFound';
export const routes = [
  {
    path: '/',
    component: Login,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/login/policy',
    component: LoginPolicy,
  },
  {
    path: '/map/taskDetal',
    component: MapTaskDetal,
  },
  {
    path: '/map/createTask',
    component: MapCreate,
  },
  {
    path: '/map/assignPerson',
    component: AssignPerson,
  },
  {
    path: '/map/pushTask',
    component: PushTask,
  },
  {
    path: '/map/addTeamPerson',
    component: AddTeamPerson,
  },
  {
    path: '/workbench',
    component: Publish,
    auth: true,
  },
  {
    path: '/workbench/gridSearch',
    component: PublishGridSearch,
    auth: true,
  },
  {
    path: '/workbench/round',
    component: AddPubRound,
  },
  {
    path: '/workbench/training',
    component: AddPubTraining,
  },
  {
    path: '/workbench/addEmedep',
    component: AddEmedep,
  },
  {
    path: '/workbench/ApprovalMangement',
    component: ApprovalMangement,
  },
  {
    path: '/workbench/addAggregate',
    component: AddAggregate,
  },
  {
    path: '/workbench/addItinerancy',
    component: AddItinerancy,
  },
  {
    path: '/workbench/dogReport',
    component: PublishDogReport,
    auth: true,
  },
  {
    path: '/workbench/rollCall',
    component: PublishRollCall,
    auth: true,
  },
  {
    path: '/workbench/rollCallList',
    component: PublishRollCallList,
  },
  {
    path: '/workbench/rollCallDetails',
    component: PublishRollCallDetails,
  },
  {
    path: '/workbench/vacation',
    component: PublishVacation,
  },
  {
    path: '/workbench/leaveList',
    component: PublishLeaveList,
  },
  {
    path: '/workbench/leaveDetails',
    component: PublishLeaveDetails,
  },
  {
    path: '/own',
    component: Own,
    auth: true,
  },
  {
    path: '/own/OwnTask',
    component: OwnTask,
  },
  {
    path: '/own/TailView',
    component: TailView,
  },
  {
    path: '/own/callList',
    component: OwnCallList,
  },
  {
    path: '/own/OwnApproval',
    component: OwnApproval,
  },
  {
    path: '/own/DogManageListDetal',
    component: OwnApprovalDetails,
  },
  {
    path: '/own/OwnLeaveList',
    component: OwnLeaveList,
  },
  {
    path: '/own/OwnLeaveListDetails',
    component: OwnLeaveListDetails,
  },
  {
    path: '/own/DogManageList',
    component: DogManage,
  },
  {
    path: '/news',
    component: News,
    auth: true,
  },
  {
    path: '/news/list',
    component: NewsList,
  },
  {
    path: '/check',
    component: Check,
    auth: true,
  },
  {
    path: '/updatePwd',
    component: UpdatePwd,
    auth: true,
  },
  {
    path: '*',
    component: NotFound,
  },
];
