import React, { Component } from "react";
import { List, Button, Toast, Modal } from "antd-mobile";
import Reflux from "reflux";
import ReactMixin from "react-mixin";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import Store from "./store";
import Actions from "./actions";
import { CallApp } from "libs/util";
import Ajax from "libs/ajax";
import { withRouter, Link } from "react-router-dom";
const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;

const iconList = {
  newsPic: require("images/own/news.png"),
  track: require("images/own/track.png"),
  manage: require("images/own/jq.svg"),
  monitoring: require("images/own/monitoring.png"),
  task: require("images/own/task.png"),
  diagnose: require("images/own/diagnose.png"),
  equipment: require("images/own/device.svg"),
  watch: require("images/own/watch.png"),
  leave: require("images/own/leave.png"),
  account: require("images/own/accent.svg"),
  approval: require("images/own/approval.png"),
  holiday: require("images/own/jia.svg"),
  group: require("images/own/group.png"),
  feeding: require("images/own/feeding.png"),
  call: require("images/own/call.png"),
};
const ownPic = require("images/own/user.svg");

const newsPic = require("images/own/news.png");
const track = require("images/own/track.png");
const manage = require("images/own/manage.png");
const monitoring = require("images/own/monitoring.png");
const task = require("images/own/task.png");
const diagnose = require("images/own/diagnose.png");
const equipment = require("images/own/equipment.png");
const watch = require("images/own/watch.png");
const leave = require("images/own/leave.png");
const account = require("images/own/account.png");
const approval = require("images/own/approval.png");
const holiday = require("images/own/holiday.png");
const group = require("images/own/group.png");
const feeding = require("images/own/feeding.png");
const call = require("images/own/call.png");

let adminData = [];
require("style/own/own.less");

let user = "";

class Own extends Component {
  constructor(props) {
    super(props);
    user = JSON.parse(sessionStorage.getItem("user"));
    let appMenu = JSON.parse(sessionStorage.getItem("appMenu"));
    console.log(appMenu);
    appMenu.map((item) => {
      item.icon = iconList[item.icon];
    });
    this.state = {
      data: appMenu,
    };
  }
  showAlert = () => {
    const alertInstance = alert("提示", "确认退出吗?", [
      { text: "取消", onPress: () => this.alertCancel(), style: "default" },
      {
        text: "确定",
        onPress: () =>
          new Promise((resolve) => {
            let { history } = this.props;
            Toast.info("正在退出...");
            Ajax.post(
              "/api/userCenter/logout",
              {
                //id: this.props.location.query.id
              },
              (res) => {
                if (res.code == 0) {
                  CallApp({ callAppName: "stopLocationService", callbackName: "sendLocationInfoToJs", callbackFun: this.showClear });
                  //   systomStatus.closeSocket();
                  alertInstance.close();
                  sessionStorage.removeItem("user");
                  Toast.info("退出成功");
                  history.push("/login");
                } else {
                  Toast.info(res.msg);
                  return;
                }
              }
            );
          }),
      },
    ]);
  };

  alertCancel = () => {
    console.log("取消");
  };

  componentDidMount() {}

  handleJump() {
    let { history } = this.props;
    history.push("test");
  }
  // 点击跳转
  handleLink = (item) => {
    let { history } = this.props;
    //我的任务中设置初始化Tab的
    if (item.link == "/own/OwnTask") {
      sessionStorage.setItem("currTabs", 0);
    }
    history.push(item.link);
  };
  // 退出登录
  logout = () => {
    this.showAlert();
  };
  componentWillMount() {
    console.log("use");
    console.log(this.props.location);
  }
  render() {
    return (
      <div className="Own">
        <Header title="我" noColor="own" />
        <div className="midder-content">
          <div className="inner-content">
            <List className="border-b-n">
              <Item
                //  arrow="horizontal"
                thumb={<img src={ownPic} alt="user" className="user-img" />}
                multipleLine
                //   onClick={this.handleJump.bind(this)}
              >
                <p className="user-name">{user.name}</p>
                <Brief>职务：中队长</Brief>
                <Brief>部门：{"警犬大队三中队"}</Brief>
                <Brief>电话：{1333333333}</Brief>
              </Item>
            </List>
            <div className="list-wrap">
              {this.state.data.map((item, index) => {
                return (
                  <List className="list-item" key={index} onClick={this.handleLink.bind(this, item)}>
                    <Item arrow="horizontal" thumb={<img src={item.icon} alt="list-icon" className="list-img" />}>
                      {item.text}
                    </Item>
                  </List>
                );
              })}
            </div>
            <Button size="small" className="layout-btn" onClick={this.logout.bind(this)}>
              退出登录
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Own);

// WEBPACK FOOTER //
// ./src/components/own/Own.js
