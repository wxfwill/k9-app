import React, { Component } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Bundle from "./Bundle";

const Login = (props) => <Bundle load={() => import("containers/login/Login")}>{(Login) => <Login {...props} />}</Bundle>;
const LoginPolicy = (props) => <Bundle load={() => import("containers/login/Policy")}>{(LoginPolicy) => <LoginPolicy {...props} />}</Bundle>;

const Publish = (props) => <Bundle load={() => import("containers/publish/Publish")}>{(Publish) => <Publish {...props} />}</Bundle>;
const AddPubTraining = (props) => (
  <Bundle load={() => import("containers/publish/PubTraining/AddPubTraining")}>{(AddPubTraining) => <AddPubTraining {...props} />}</Bundle>
);
const AddPubRound = (props) => (
  <Bundle load={() => import("containers/publish/PubRound/AddPubRound")}>{(AddPubRound) => <AddPubRound {...props} />}</Bundle>
);
const PubRoundDetails = (props) => (
  <Bundle load={() => import("containers/publish/PubRound/PubRoundDetails")}>{(PubRoundDetails) => <PubRoundDetails {...props} />}</Bundle>
);
const AddAggregate = (props) => (
  <Bundle load={() => import("containers/publish/PubAggregate/AddItem")}>{(AddAggregate) => <AddAggregate {...props} />}</Bundle>
);
const AddEmedep = (props) => <Bundle load={() => import("containers/publish/PubEmedep/AddItem")}>{(AddEmedep) => <AddEmedep {...props} />}</Bundle>;

const PubEmedepDetails = (props) => (
  <Bundle load={() => import("containers/publish/PubEmedep/PubEmedepDetails")}>{(PubEmedepDetails) => <PubEmedepDetails {...props} />}</Bundle>
);
const AddItinerancy = (props) => (
  <Bundle load={() => import("containers/publish/PubItinerancy/AddItem")}>{(AddItinerancy) => <AddItinerancy {...props} />}</Bundle>
);
const Track = (props) => <Bundle load={() => import("components/track/Track")}>{(Track) => <Track {...props} />}</Bundle>;
const TrackMap = (props) => <Bundle load={() => import("components/track/TrackMap")}>{(TrackMap) => <TrackMap {...props} />}</Bundle>;
const Drill = (props) => <Bundle load={() => import("components/own/OwnTask/Drill")}>{(Drill) => <Drill {...props} />}</Bundle>;
const DrillDetail = (props) => (
  <Bundle load={() => import("components/own/OwnTask/Drill/drilldetail/DrillDetail")}>{(DrillDetail) => <DrillDetail {...props} />}</Bundle>
);
const DrillTrackMap = (props) => (
  <Bundle load={() => import("components/own/OwnTask/Drill/drilldetail/TrackMap")}>{(DrillTrackMap) => <DrillTrackMap {...props} />}</Bundle>
);
/*外勤任务*/
const Itinerancy = (props) => <Bundle load={() => import("components/own/OwnTask/Itinerancy")}>{(Itinerancy) => <Itinerancy {...props} />}</Bundle>;
const ItinerancyDetail = (props) => (
  <Bundle load={() => import("components/own/OwnTask/Itinerancy/itinerancydetail/ItinerancyDetail")}>
    {(ItinerancyDetail) => <ItinerancyDetail {...props} />}
  </Bundle>
);

const Own = (props) => <Bundle load={() => import("components/own/Own")}>{(Own) => <Own {...props} />}</Bundle>;
const OwnLevel = (props) => <Bundle load={() => import("components/own/OwnLevel")}>{(OwnLevel) => <OwnLevel {...props} />}</Bundle>;
const LevelDetails = (props) => (
  <Bundle load={() => import("components/own/OwnLevel/LevelDetails")}>{(LevelDetails) => <LevelDetails {...props} />}</Bundle>
);

const OwnTask = (props) => <Bundle load={() => import("components/own/OwnTask")}>{(OwnTask) => <OwnTask {...props} />}</Bundle>;
/**值班情况 */
const Duty = (props) => <Bundle load={() => import("components/own/Duty")}>{(Duty) => <Duty {...props} />}</Bundle>;
/**设备管理 */
const Equipment = (props) => <Bundle load={() => import("components/own/Equipment/Equipment")}>{(Equipment) => <Equipment {...props} />}</Bundle>;
const EquipmentList = (props) => (
  <Bundle load={() => import("components/own/Equipment/EquipmentList")}>{(Equipment) => <Equipment {...props} />}</Bundle>
);
const EquipmentDetail = (props) => (
  <Bundle load={() => import("components/own/Equipment/EquipmentDetail")}>{(Equipment) => <Equipment {...props} />}</Bundle>
);
const Attend = (props) => <Bundle load={() => import("components/own/OwnLevel/Attend")}>{(Attend) => <Attend {...props} />}</Bundle>;
const Round = (props) => <Bundle load={() => import("containers/round/Round")}>{(Round) => <Round {...props} />}</Bundle>;
const RoundMap = (props) => <Bundle load={() => import("containers/round/roundMAP")}>{(RoundMap) => <RoundMap {...props} />}</Bundle>;
const OwnRoundMap = (props) => (
  <Bundle load={() => import("components/own/OwnTask/OwnRound/OwnRoundMap")}>{(OwnRoundMap) => <OwnRoundMap {...props} />}</Bundle>
);
const AggregatePointMap = (props) => (
  <Bundle load={() => import("components/own/OwnTask/AggregatePoint/AggPointMap")}>{(AggregatePointMap) => <AggregatePointMap {...props} />}</Bundle>
);
const OwnEmDepMap = (props) => (
  <Bundle load={() => import("components/own/OwnTask/EmergencyDeployment/OwnEmDepMap")}>{(OwnEmDepMap) => <OwnEmDepMap {...props} />}</Bundle>
);
const OwnGridSearchMap = (props) => (
  <Bundle load={() => import("components/own/OwnTask/GridSearch/OwnGridSearchMap")}>{(OwnGridSearchMap) => <OwnGridSearchMap {...props} />}</Bundle>
);
const Fight = (props) => <Bundle load={() => import("containers/fight")}>{(Fight) => <Fight {...props} />}</Bundle>;
const Check = (props) => <Bundle load={() => import("containers/check")}>{(Check) => <Check {...props} />}</Bundle>;

const Test = (props) => <Bundle load={() => import("components/test")}>{(Test) => <Test {...props} />}</Bundle>;
/**警犬管理 */
const DogManage = (props) => <Bundle load={() => import("components/own/DogManage/index")}>{(DogManage) => <DogManage {...props} />}</Bundle>;
/**警犬监控 */
const DogMonitor = (props) => <Bundle load={() => import("components/own/DogMonitor/index")}>{(DogMonitor) => <DogMonitor {...props} />}</Bundle>;
/** 查看指定的狗视频直播*/
const ViewDogVideo = (props) => (
  <Bundle load={() => import("components/own/DogMonitor/ViewDogVideo")}>{(ViewDogVideo) => <ViewDogVideo {...props} />}</Bundle>
);

/**我的警犬 */
const MyDogList = (props) => <Bundle load={() => import("components/own/DogManage/MyDog/index")}>{(MyDogList) => <MyDogList {...props} />}</Bundle>;
/**犬病上报 */
const SickUpdate = (props) => <Bundle load={() => import("components/own/DogManage/Sickupdate")}>{(SickUpdate) => <SickUpdate {...props} />}</Bundle>;

/**消息提示 */
const News = (props) => <Bundle load={() => import("containers/news/News")}>{(News) => <News {...props} />}</Bundle>;
const NewsList = (props) => <Bundle load={() => import("containers/news/New-list")}>{(NewsList) => <NewsList {...props} />}</Bundle>;
// const NewsListCom = (props) => <Bundle load={() => import("containers/news/New-common")}>{(NewsListCom) => <NewsListCom {...props} />}</Bundle>;

/**警犬运动统计 */
const DogActivity = (props) => (
  <Bundle load={() => import("components/own/DogManage/DogActivity/index")}>{(DogActivity) => <DogActivity {...props} />}</Bundle>
);

/**警犬诊断列表 */
const DogTreatmentList = (props) => (
  <Bundle load={() => import("components/own/Treatment/index")}>{(DogTreatmentList) => <DogTreatmentList {...props} />}</Bundle>
);

/**警犬诊断页面 */
const DogDiagnosis = (props) => (
  <Bundle load={() => import("components/own/Treatment/Diagnosis")}>{(DogDiagnosis) => <DogDiagnosis {...props} />}</Bundle>
);

/**账号安全 */
const Account = (props) => <Bundle load={() => import("components/own/Account")}>{(Account) => <Account {...props} />}</Bundle>;
/**点名 */
const Call = (props) => <Bundle load={() => import("components/own/Call")}>{(Call) => <Call {...props} />}</Bundle>;

const AddCall = (props) => <Bundle load={() => import("components/own/Call/AddCall")}>{(AddCall) => <AddCall {...props} />}</Bundle>;
const CallDetails = (props) => <Bundle load={() => import("components/own/Call/CallDetails")}>{(CallDetails) => <CallDetails {...props} />}</Bundle>;

/**密码修改 */
const UpdatePwd = (props) => <Bundle load={() => import("components/own/Account/UpdatePwd")}>{(UpdatePwd) => <UpdatePwd {...props} />}</Bundle>;
/**假期管理 */
const Holiday = (props) => <Bundle load={() => import("components/own/Holiday")}>{(Holiday) => <Holiday {...props} />}</Bundle>;
/**审批管理 */
const Approval = (props) => <Bundle load={() => import("components/own/Approval")}>{(Approval) => <Approval {...props} />}</Bundle>;
const ApprovalDetails = (props) => (
  <Bundle load={() => import("components/own/Approval/ApprovalDetails")}>{(ApprovalDetails) => <ApprovalDetails {...props} />}</Bundle>
);
/** 饲养管理 **/
const Feeding = (props) => <Bundle load={() => import("components/own/Feeding")}>{(Feeding) => <Feeding {...props} />}</Bundle>;
/**上报详情 */
const ReportDetail = (props) => (
  <Bundle load={() => import("components/common/Report/ReportDetail")}>{(ReportDetail) => <ReportDetail {...props} />}</Bundle>
);

// 路由配置
class routes extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <HashRouter>
        <div className="app">
          <Route exact path="/" render={() => <Redirect to="/login" push />} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/login/policy" component={LoginPolicy} />
          <Route exact path="/drill" component={Drill} />
          <Route exact path="/publish" component={Publish} />
          <Route exact path="/publish/training" component={AddPubTraining} />
          <Route exact path="/publish/round" component={AddPubRound} />
          <Route exact path="/publish/roundDetails" component={PubRoundDetails} />
          <Route exact path="/publish/addAggregate" component={AddAggregate} />
          <Route exact path="/publish/addEmedep" component={AddEmedep} />
          <Route exact path="/publish/emedepDetails" component={PubEmedepDetails} />
          <Route exact path="/publish/addItinerancy" component={AddItinerancy} />
          <Route exact path="/track" component={Track} />
          <Route exact path="/track/map" component={TrackMap} />
          <Route exact path="/drill/detail" component={DrillDetail} />
          <Route exact path="/drill/detail/trackmap" component={DrillTrackMap} />
          <Route exact path="/itinerancy" component={Itinerancy} />
          <Route exact path="/itinerancy/detail" component={ItinerancyDetail} />
          <Route exact path="/own" component={Own} />
          <Route exact path="/own/approval" component={Approval} />
          <Route exact path="/own/approvalDetails" component={ApprovalDetails} />
          <Route exact path="/own/equipment" component={Equipment} />
          <Route exact path="/own/equipment/detail" component={EquipmentDetail} />
          <Route exact path="/own/equipment/list" component={EquipmentList} />
          <Route exact path="/own/OwnTask" component={OwnTask} />
          <Route exact path="/round" component={Round} />
          <Route exact path="/round/map" component={RoundMap} />
          <Route exact path="/gridsearch/map" component={OwnGridSearchMap} />
          <Route exact path="/ownround/map" component={OwnRoundMap} />
          <Route exact path="/emdep/map" component={OwnEmDepMap} />
          <Route exact path="/aggpoint/map" component={AggregatePointMap} />
          <Route exact path="/fight" component={Round} />
          <Route exact path="/own/leave" component={OwnLevel} />
          <Route exact path="/own/duty" component={Duty} />
          <Route exact path="/own/account" component={Account} />
          <Route exact path="/own/call" component={Call} />
          <Route exact path="/own/call/addCall" component={AddCall} />
          <Route exact path="/own/call/callDetails" component={CallDetails} />
          <Route exact path="/own/holiday" component={Holiday} />
          <Route exact path="/own/feeding" component={Feeding} />
          <Route exact path="/own/updatePwd" component={UpdatePwd} />
          <Route exact path="/own/leave/attend" component={Attend} />
          <Route exact path="/own/leave/levelDetails" component={LevelDetails} />
          <Route exact path="/news" component={News} />
          <Route exact path="/news/list" component={NewsList} />
          {/* <Route exact path="/news/list" component={NewsListCom} /> */}
          <Route exact path="/own/DogMonitor" component={DogMonitor} />
          <Route exact path="/own/DogMonitor/ViewDogVideo" component={ViewDogVideo} />
          <Route exact path="/own/DogManage" component={DogManage} />
          <Route exact path="/own/DogManage/MyDogList" component={MyDogList} />
          <Route exact path="/own/DogManage/DogActivity" component={DogActivity} />
          <Route exact path="/own/DogManage/SickUpdate" component={SickUpdate} />
          <Route exact path="/own/DogMange/DogTreatmentList" component={DogTreatmentList} />
          <Route exact path="/own/DogMange/DogDiagnosis" component={DogDiagnosis} />
          <Route exact path="/report/ReportDetail" component={ReportDetail} />
          <Route exact path="/test" component={Test} />
          <Route exact path="/check" component={Check} />
        </div>
      </HashRouter>
    );
  }
}
export default routes;
