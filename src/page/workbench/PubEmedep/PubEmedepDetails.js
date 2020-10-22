import React, { Component } from "react";
import Reflux from "reflux";
import { Button, message, Card, Tag, InputItem, Icon, Tabs, Toast, WhiteSpace, Flex, Modal } from "antd-mobile";
import ReactMixin from "react-mixin";
import Header from "components/common/Header";
import { tMap } from "components/common/map";
import Ajax from "libs/ajax";
import { CallApp, toast } from "libs/util";

require("style/publish/common.less");
var getRandomColor = function () {
  return "#" + ("00000" + ((Math.random() * 0x1000000) << 0).toString(16)).slice(-6);
};
const ownPic = require("images/own.gif");
const othersPic = require("images/others.png");
const alert = Modal.alert;
class PubTrainingMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawShapeDTO: null,
      loading: true,
      taskInfo: null,
      userList: [],
      isShowDetail: true,
      trochoiInfos: [],
      timers: [],
    };

    this.TMap = null;
    this.images = {
      ownPic: ownPic,
      othersPic: othersPic,
    };

    this.timer2 = null;
  }
  componentDidMount() {
    let options = {
      labelText: "",
    };
    this.TMap = new tMap(options);

    //const myPoint = '';
    //this.TMap.setSelfMark(this.images, myPoint)
    this.getUserLocation();
    if (!this.props.trainInfo || this.props.trainInfo.saveStatus == 0) {
      this.TMap.createMakers(2);
    }
    this.TMap.getLabelContent();
    this.getTaskInfo();
  }

  getTaskInfo() {
    if (this.props.location.query && this.props.location.query.data) {
      this.setState({
        taskInfo: this.props.location.query.data,
      });
      let { data } = this.props.location.query;
      if (data && data.drawShapeDTO !== "") {
        let circle = this.TMap.setCircle(data.drawShapeDTO.coord, data.drawShapeDTO.bdRadius);
        //定位到指定区域
        this.TMap.map.fitBounds(circle.getBounds());
        this.TMap.rPanTo({
          lat: data.drawShapeDTO.coord.lat,
          lng: data.drawShapeDTO.coord.lng,
        });
      }
      this.getRoundList(data.id);
    }
  }

  //人员列表
  getRoundList(id) {
    Ajax.post(
      "/api/cmdMonitor/getUserByTaskId",
      {
        taskId: id,
      },
      (res) => {
        if (res.code == 0) {
          res.data.map((item) => {
            item.color = getRandomColor();
          });
          this.setState({
            userList: res.data,
          });
        } else {
          Toast.info(res.msg);
          return;
        }
      }
    );
  }

  showDetail = (isShowDetail) => {
    this.setState({
      isShowDetail: !isShowDetail,
    });
  };

  getStateText(status) {
    if (status == 0) {
      return <Tag style={{ background: "#2db7f5", color: "#fff" }}>未开始</Tag>;
    } else if (status == 1) {
      return <Tag style={{ background: "#108ee9", color: "#fff" }}>执行中</Tag>;
    } else if (status >= 2) {
      return <Tag style={{ background: "#87d068", color: "#fff" }}>已完成</Tag>;
    } else {
      return "--";
    }
  }

  handonRowClick = (userTask) => {
    var params = {
      taskDetailId: userTask.taskDetailId,
      taskType: userTask.taskType,
      rid: Math.random(),
      color: userTask.color,
    };
    let { taskInfo } = this.state;
    //任务未开始不执行轨迹数据请求
    if (taskInfo.taskStatus != 0) {
      this.fetchTrochoid(params);
    }
  };

  fetchTrochoid = (params) => {
    var me = this;
    me.setState({ loading: true });
    Ajax.post("/api/cmdMonitor/showAppTrochoidHis", { ...params, ...this.state.filter }, (res) => {
      me.setState({ loading: false });
      const pathsHis = res.data.pathsHis;
      pathsHis.forEach((item, index) => {
        this.drawTrace(item, 1, params.color);
      });
      //任务未结束设置定时器获取实时数据
      if (res.data.isEnd == 0) {
        let { timers, userList, trochoiInfos } = me.state;
        userList.map((item, index) => {
          if (item.taskDetailId == params.taskDetailId) {
            let trochoiInfo = {
              color: userList[index].color,
              taskType: userList[index].taskType,
              taskDetailId: userList[index].taskDetailId,
              lastPointTime: "",
            };
            trochoiInfos.push(trochoiInfo);
            timers.push({
              timerId: setInterval(me.getNowTrochoid, 5000, trochoiInfo),
              taskDetailId: userList[index].taskDetailId,
            });
            me.setState({
              timers: timers,
            });
          }
        });
      }
    });
  };
  componentWillUnmount() {
    let { timers } = this.state;
    //清除所有定时器
    timers.map((item) => {
      clearInterval(item.timerId);
    });
    clearInterval(this.timer2);
  }
  //获取实时数据
  getNowTrochoid = (data) => {
    let trochoiInfo = data;
    let { trochoiInfos, timers } = this.state;
    trochoiInfos.map((item) => {
      if (item.taskDetailId == data.taskDetailId) {
        trochoiInfo = item;
      }
    });

    Ajax.post(
      "/api/cmdMonitor/showAppTrochoid",
      {
        lastPointTime: trochoiInfo.lastPointTime,
        taskType: trochoiInfo ? trochoiInfo.taskType : "",
        taskDetailId: trochoiInfo ? trochoiInfo.taskDetailId : "",
      },
      (res) => {
        const pathsCurr = res.data.pathsCurr;
        if (pathsCurr && pathsCurr.length > 0) {
          trochoiInfos.map((item) => {
            if (item.taskDetailId == data.taskDetailId) {
              item.lastPointTime = res.data.lastPointTime;
            }
          });
          this.setState({
            trochoiInfos: trochoiInfos,
          });
          //任务已经结束
          if (res.data.isEnd == 1) {
            timers.map((item) => {
              if (item.taskDetailId == data.taskDetailId) {
                clearInterval(item.timerId);
              }
            });
          }
          pathsCurr.forEach((item) => {
            this.drawTrace(item, 0, trochoiInfo.color);
          });
        }
      }
    );
  };

  drawTrace = (gpsData, flag, strokeColor) => {
    //绘制轨迹
    var path = [];
    if (gpsData.length > 0) {
      gpsData.forEach((item, index) => {
        path.push(new qq.maps.LatLng(item.lat, item.lng));
      });

      new qq.maps.Polyline({
        map: this.TMap.map,
        path: path,
        strokeColor: strokeColor,
        strokeWeight: 4,
      });

      if (typeof flag != undefined && flag == 1) {
        //定位到轨迹位置
        this.TMap.map.panTo(new qq.maps.LatLng(path[0].lat, path[0].lng));
      }
    }
  };

  getUserLocation = () => {
    CallApp({ callAppName: "getLocationInfo", callbackName: "sendLocationInfoToJs", callbackFun: this.showLocation });
  };
  showLocation = (msg) => {
    console.log(msg);
    const point = JSON.parse(msg);
    this.TMap.setSelfMark(this.images, { lat: point.latitude, lng: point.longitude });
  };

  handleShow = () => {
    const { history } = this.props;
    history.goBack();
  };

  //地点搜索
  onSearch = (value) => {
    this.TMap.searchService().search(value);
  };

  showStop = (id) => {
    const alertInstance = alert("终止任务", "确定终止此任务吗?", [
      { text: "取消", onPress: () => console.log("cancel"), style: "default" },
      { text: "确定", onPress: () => this.stopTask(id) },
    ]);
  };
  stopTask = (id) => {
    Ajax.post(
      "/api/cmdMonitor/stopEmergency",
      {
        id: id,
      },
      (res) => {
        if (res.code == 0) {
          let { history } = this.props;
          let { taskInfo } = this.state;
          taskInfo.taskStatus = 3;
          this.setState({
            taskInfo: taskInfo,
          });
          Toast.info("任务已终止！");
        } else {
          Toast.info(res.msg);
          return;
        }
      }
    );
  };

  startOrEndPatral(id, patral) {
    if (patral == 1) {
      const alertInstance = alert("结束任务", "确定结束此任务吗?", [
        { text: "取消", onPress: () => console.log("cancel"), style: "default" },
        { text: "确定", onPress: () => this.startOrEndMethod(id, patral) },
      ]);
    } else {
      this.startOrEndMethod(id, patral);
    }
  }

  //开始,结束任务。
  startOrEndMethod(id, patral) {
    const _this = this;
    let sendData = { id: id };

    const requstUri = patral ? "/api/cmdMonitor/stopEmergency" : "/api/cmdMonitor/beginEmergency";
    Ajax.post(requstUri, sendData, (data) => {
      if (data.code == "0") {
        let { taskInfo, userList } = _this.state;
        userList.map((item) => {
          if (patral == 0) {
            item.status = 1;
          } else {
            item.status = 2;
          }
        });
        if (patral == 0) {
          taskInfo.taskStatus = 1;
        } else {
          taskInfo.taskStatus = 2;
        }
        _this.setState({
          taskInfo: taskInfo,
          userList: userList,
        });
      }
    });
  }
  render() {
    const { isShowDetail, taskInfo, userList } = this.state;
    const tabs = [{ title: "查询轨迹" }, { title: "任务详情" }];
    return (
      <div className="map">
        <div id="container" className="container" style={{ zIndex: 10 }}>
          <div className="mapPanel">
            <div className="content">
              <div className="iconDiv" onClick={() => this.showDetail(isShowDetail)}>
                <Icon color="#666666" type={isShowDetail ? "down" : "up"} />
              </div>

              <Tabs tabs={tabs} initalPage={"t2"}>
                <div className={isShowDetail ? "map-infor" : "map-infor rhide"}>
                  {userList && userList.length > 0 ? (
                    <div>
                      {" "}
                      <WhiteSpace size="lg" />
                      <Flex>
                        <Flex.Item>
                          <div style={{ textAlign: "center" }}>颜色</div>
                        </Flex.Item>
                        <Flex.Item>
                          <div style={{ textAlign: "center" }}>姓名</div>
                        </Flex.Item>
                        <Flex.Item>
                          <div style={{ textAlign: "center" }}>犬名</div>
                        </Flex.Item>
                        <Flex.Item>
                          <div style={{ textAlign: "center" }}>状态</div>
                        </Flex.Item>
                      </Flex>
                    </div>
                  ) : null}
                  {userList && userList.length > 0 ? (
                    userList.map((item) => (
                      <div>
                        <WhiteSpace size="lg" />
                        <Flex onClick={() => this.handonRowClick(item)}>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>
                              <Tag small style={{ background: item.color ? item.color : "", color: "#fff" }}></Tag>
                            </div>
                          </Flex.Item>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>{item.userName ? item.userName : "--"}</div>
                          </Flex.Item>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>{item.dogName ? item.dogName : "--"}</div>
                          </Flex.Item>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>{this.getStateText(item.status)}</div>
                          </Flex.Item>
                        </Flex>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", paddingTop: "12px", paddingBottom: "12px" }}>暂无数据</div>
                  )}
                </div>
                <div className={isShowDetail ? "map-infor" : "map-infor rhide"}>
                  <section>
                    <span>任务名称：</span>
                    <div>{taskInfo && (taskInfo.taskName || "--")}</div>
                  </section>
                  <section>
                    <span>作战地点：</span>
                    <div>{taskInfo && (taskInfo.location || "--")}</div>
                  </section>
                  <section>
                    <span>作战人员：</span>
                    <div>{taskInfo && (taskInfo.userNames || "--")}</div>
                  </section>
                  <section>
                    <span>任务内容：</span>
                    <div>{taskInfo && (taskInfo.taskContent || "--")}</div>
                  </section>
                </div>
              </Tabs>

              {/*  <section>
                  <InputItem
                  placeholder="地点搜索"
                  className="ant-input"
                  onVirtualKeyboardConfirm={value=>this.onSearch(value)}
                  onChange={value=>this.onSearch(value)}
                  clear
                    ></InputItem>
                </section>*/}

              <section style={{ marginTop: "12" }}>
                {/*taskInfo&&taskInfo.saveStatus==1&&taskInfo.taskStatus<2 ?
                      <span> <Button 
                        inline 
                        size="small" 
                        type="primary"
                        className="stop-btn"
                        onClick={()=>this.showStop(taskInfo.id)}
                      >终止任务</Button></span>:null*/}
                {taskInfo && taskInfo.saveStatus == 1 && taskInfo.taskStatus == 0 ? (
                  <span>
                    {" "}
                    <Button inline size="small" type="primary" onClick={() => this.startOrEndPatral(taskInfo.id, 0)}>
                      开始任务
                    </Button>
                  </span>
                ) : null}
                {taskInfo && taskInfo.saveStatus == 1 && taskInfo.taskStatus == 1 ? (
                  <span>
                    {" "}
                    <Button inline size="small" type="primary" className="stop-btn" onClick={() => this.startOrEndPatral(taskInfo.id, 1)}>
                      结束任务
                    </Button>
                  </span>
                ) : null}
                <span onClick={this.handleShow.bind(this)}>
                  <Button className="common-btn" type="primary" inline size="small">
                    返回
                  </Button>
                </span>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default PubTrainingMap;

// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubEmedep/PubEmedepDetails.js
