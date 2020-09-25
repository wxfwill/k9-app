import React, { Component } from "react";
import { NavBar, Icon, Card, Grid, Tabs, WhiteSpace, Modal } from "antd-mobile";
import Reflux from "reflux";
import { createForm } from "rc-form";
import ReactMixin from "react-mixin";
import Store from "./store";
import Actions from "./actions";
import { withRouter, Link } from "react-router-dom";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import PubRound from "./PubRound";
import PubItinerancy from "./PubItinerancy";
import PubAggregate from "./PubAggregate";
import PubTraning from "./PubTraining";
import PubEmedep from "./PubEmedep";
import * as workData from "./work-data.js";

require("style/publish/publish.less");

const tabs = [{ title: "训练计划" }, { title: "日常巡逻" }, { title: "紧急调配" }, { title: "定点集合" }, { title: "外勤任务" }];
const pathObj = {
  training: "/publish/training",
  round: "/publish/round",
  aggregate: "/publish/addAggregate",
  emedep: "/publish/addEmedep",
  itinerancy: "/publish/addItinerancy",
};

class PublishComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 2,
      listModal: false,
      activeTab: sessionStorage.getItem("currTabs") || 0,
      taskData: workData.myTask,
      dogData: workData.dogMange,
      jsData: workData.mertisMange,
      otherData: workData.otherMange,
    };
  }

  handleChange() {
    console.log(this);
    this.changeTest(this);
    console.log(this.state.test);
  }
  onChange() {}
  //关闭弹窗
  onClose = (key) => {
    this.setState({
      [key]: false,
    });
  };
  //新增页
  goAddPage = (type, data = "", titleType = "") => {
    const { history } = this.props;
    let pathname = pathObj[type];
    history.push({ pathname: pathname, query: { id: data, titleType } });
  };
  //用来显示添加
  addShow(data) {
    this.setState({
      listModal: true,
    });
  }
  setCurrTab = (tab, index) => {
    sessionStorage.setItem("currTabs", index);
  };
  changeTest(pointer) {
    pointer.setState({
      test: ++pointer.state.test,
    });
  }

  render() {
    const { getFieldProps } = this.props.form;
    const pageIndex = Number(this.state.activeTab);
    const listModal = this.state.listModal;
    const listMenuClass = listModal ? "li-an" : "";
    return (
      <div className="Own work-wrap">
        <Header title="工作台" isSet="添加" handleShow={this.addShow.bind(this)} />
        <div className="own-task midder-content">
          <div className="inner-content">
            <Card full className="work-con mtp-24">
              <Card.Header title="我的任务"></Card.Header>
              <Card.Body>
                <Grid data={this.state.taskData} columnNum={3} className="work-item" />
              </Card.Body>
            </Card>
            <Card full className="work-con mtp-24">
              <Card.Header title="警犬管理"></Card.Header>
              <Card.Body>
                <Grid data={this.state.dogData} columnNum={3} className="work-item" />
              </Card.Body>
            </Card>
            <Card full className="work-con mtp-24">
              <Card.Header title="绩效管理"></Card.Header>
              <Card.Body>
                <Grid data={this.state.jsData} columnNum={3} className="work-item" />
              </Card.Body>
            </Card>
            <Card full className="work-con mtp-24 mtb-30">
              <Card.Header title="其他"></Card.Header>
              <Card.Body>
                <Grid data={this.state.otherData} columnNum={3} className="work-item" />
              </Card.Body>
            </Card>
            {/* <Tabs
              tabs={tabs}
              initialPage={pageIndex}
              tabBarUnderlineStyle={{ borderColor: "#15c619" }}
              animated={false}
              useOnPan={false}
              swipeable={false}
              prerenderingSiblingsNumber={0}
              onChange={(tab, index) => {
                console.log("onChange", tab, index);
              }}
              onTabClick={(tab, index) => {
                this.setCurrTab(tab, index);
              }}
            >
              <PubTraning />
              <PubRound></PubRound>
              <PubEmedep></PubEmedep>
              <PubAggregate></PubAggregate>
              <PubItinerancy></PubItinerancy>
            </Tabs> */}
          </div>
          <Modal className="publish-list-modal" visible={this.state.listModal} popup transparent animationType="slide-up">
            <div className="pub-list-cont">
              <div className="list-item training-item" onClick={() => this.goAddPage("training")}>
                训练
              </div>
              <div className="list-item round-item" onClick={() => this.goAddPage("round")}>
                巡逻
              </div>
              <div className="list-item eme-dep-item" onClick={() => this.goAddPage("emedep")}>
                紧急调配
              </div>
              <div className="list-item aggregate-item" onClick={() => this.goAddPage("aggregate")}>
                集合
              </div>
              <div className="list-item itinerancy-item" onClick={() => this.goAddPage("itinerancy")}>
                外勤任务
              </div>
              <Icon type="cross" size="lg" className="close-btn" onClick={() => this.onClose("listModal")} />
            </div>
          </Modal>
        </div>
        <Footer />
      </div>
    );
  }
}

ReactMixin.onClass(PublishComponent, Reflux.listenTo(Store, "onChange"));
const Publish = createForm()(PublishComponent);
export default withRouter(Publish);

// WEBPACK FOOTER //
// ./src/redux/containers/publish/Publish.js
