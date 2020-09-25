import React, { Component } from "react";
import { WhiteSpace, WingBlank, Button, Toast, Accordion, List, DatePicker, Flex, Modal, TextareaItem } from "antd-mobile";
import Reflux from "reflux";
import { createForm } from "rc-form";
import ReactMixin from "react-mixin";
import Header from "components/common/Header";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import Ajax from "libs/ajax";
import { CallApp } from "libs/util";
import Footer from "components/common/Footer";
const Item = List.Item;
const Brief = Item.Brief;
class CheckComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      val: 1,
      automaticData: {},
      autonomyData: {},
      allScore: 0,
      checkDate: moment(new Date()).format("YYYY-MM"),
      modal1: false,
      typeId: 1,
      specificInfo: "暂无数据！",
      allData: [],
    };
  }

  componentDidMount() {
    this.initDate(moment(new Date()).format("YYYY-MM"));
  }
  initDate(checkDate) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    Ajax.post(
      "/api/performanceCheck/performanceCheckInfo",
      {
        userId: user.id,
        checkDate: checkDate,
      },
      (res) => {
        if (res.code == 0) {
          let { autonomyData, automaticData, allScore } = this.state;
          automaticData.dogTrain = [];
          automaticData.dogUse = [];
          automaticData.outdoor = [];
          autonomyData.dailyManage = [];
          autonomyData.trainCheck = [];
          res.data.map((item) => {
            if (item.scoreType == 0) {
              if (item.typeId == 1) {
                automaticData.dogTrain.push(item);
              } else if (item.typeId == 3) {
                automaticData.dogUse.push(item);
              } else if (item.typeId == 5) {
                automaticData.outdoor.push(item);
              }
            } else {
              if (item.typeId == 2) {
                autonomyData.trainCheck.push(item);
              } else if (item.typeId == 4) {
                autonomyData.dailyManage.push(item);
              }
            }
          });
          if (automaticData.dogTrain.length > 0) {
            allScore = Number(allScore) + Number(automaticData.dogTrain[0].totalScore);
          }
          if (automaticData.dogUse.length > 0) {
            allScore = Number(allScore) + Number(automaticData.dogUse[0].totalScore);
          }
          if (automaticData.outdoor.length > 0) {
            allScore = Number(allScore) + Number(automaticData.outdoor[0].totalScore);
          }
          if (autonomyData.trainCheck.length > 0) {
            allScore = Number(allScore) + Number(autonomyData.trainCheck[0].totalScore);
          }
          if (autonomyData.dailyManage.length > 0) {
            allScore = Number(allScore) + Number(autonomyData.dailyManage[0].totalScore);
          }

          this.setState({ autonomyData: autonomyData, automaticData: automaticData, allData: res.data, allScore: allScore, checkDate: checkDate });
        } else {
          Toast.info(res.msg);
          return;
        }
      }
    );
  }

  handleChange(data) {
    this.setState({
      checkDate: moment(new Date(data)).format("YYYY-MM"),
    });
    this.initDate(moment(new Date(data)).format("YYYY-MM"));
  }
  showModal = (message) => (e) => {
    console.log(message, "message");
    let action = "getDogTrainInfoById";
    if (message.typeId == 2) {
      action = "getDogUseInfoById";
    } else if (message.action == 5) {
      action = "getDutyInfoById";
    }
    Ajax.post(
      "/api/performanceCheck/" + action,
      {
        id: message.id,
      },
      (res) => {
        if (res.code == 0) {
          this.setState({
            specificInfo: res.data,
            typeId: message.typeId,
            mode1: true,
          });
        } else {
          Toast.info(res.msg);
          return;
        }
      }
    );
    e.preventDefault();
    this.setState({
      mode1: true,
    });
  };
  onClose = (key) => () => {
    this.setState({
      mode1: false,
    });
  };
  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, ".am-modal-content");
    if (!pNode) {
      e.preventDefault();
    }
  };
  render() {
    const { getFieldProps } = this.props.form;
    let { autonomyData, automaticData, allScore, specificInfo, typeId } = this.state;
    return (
      <div className="Own">
        <Header title="地图" />
        <div className="midder-content">
          <div className="inner-content">
            <List style={{ backgroundColor: "white" }} className="date-picker-list">
              <DatePicker mode="month" title="选择月份" value={new Date(this.state.checkDate)} onChange={(date) => this.handleChange(date)}>
                <Item arrow="horizontal">月份</Item>
              </DatePicker>
            </List>
            <div style={{ marginTop: 10, marginBottom: 10 }}>
              {this.state.allData.length > 0 ? (
                <List className="my-list">
                  <Item extra={allScore}>本月得分</Item>
                </List>
              ) : null}
              <Accordion defaultActiveKey="" className="my-accordion" onChange={this.onChange}>
                {/*this.state.holidayInfo.length>0?this.state.holidayInfo.map((message) => <Accordion.Panel header={<span style={{ color: 'blue'}}>{message.typeName}</span>} className="pad">
              <List className="my-list">
                <Item extra={message.totalDay}>总天数</Item>
                <Item extra={message.applyingDay}>流程中天数</Item>
                <Item extra={message.usedDay}>已用天数</Item>
                <Item extra={(Number(message.totalDay)-Number(message.usedDay))}>剩余天数</Item>
                <Item extra={(Number(message.totalDay)-Number(message.usedDay)-Number(message.applyingDay))}>可用天数</Item>
              </List>
            </Accordion.Panel>):<div style={{ textAlign: 'center',paddingTop:'12px'}}>暂无数据</div>*/}

                <Accordion.Panel
                  header={
                    <span>
                      警犬训练{automaticData.dogTrain && automaticData.dogTrain.length > 0 ? "(" + automaticData.dogTrain[0].totalScore + ")" : "(0)"}
                    </span>
                  }
                  className="pad"
                  key="0"
                >
                  <List className="my-list">
                    {automaticData.dogTrain && automaticData.dogTrain.length > 0 ? (
                      <div>
                        {" "}
                        <WhiteSpace size="lg" />
                        <Flex>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>科目名称</div>
                          </Flex.Item>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>项目名称</div>
                          </Flex.Item>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>得分</div>
                          </Flex.Item>
                          {/*   <Flex.Item><div style={{textAlign:'center'}}>操作</div></Flex.Item>*/}
                        </Flex>
                      </div>
                    ) : null}
                    {automaticData.dogTrain && automaticData.dogTrain.length > 0 ? (
                      automaticData.dogTrain.map((message, index) => (
                        <div key={index}>
                          <WhiteSpace size="lg" />
                          <Flex>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.subjectName ? message.subjectName : "--"}</div>
                            </Flex.Item>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.item ? message.item : "--"}</div>
                            </Flex.Item>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.score ? message.score : "--"}</div>
                            </Flex.Item>
                            {/*    <Flex.Item><div style={{textAlign:'center'}}>{<span style={{ color: 'blue'}} onClick={this.showModal(message)}>详情</span>}</div></Flex.Item>*/}
                          </Flex>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: "center", paddingTop: "12px", paddingBottom: "12px" }}>暂无数据</div>
                    )}
                    {automaticData.dogTrain && automaticData.dogTrain.length > 0 ? <WhiteSpace size="lg" /> : null}
                  </List>
                </Accordion.Panel>
                <Accordion.Panel
                  header={
                    <span>
                      警犬使用及执勤值班
                      {automaticData.dogUse && automaticData.dogUse.length > 0 ? "(" + automaticData.dogUse[0].totalScore + ")" : "(0)"}
                    </span>
                  }
                  className="pad"
                  key="1"
                >
                  <List className="my-list">
                    {automaticData.dogUse && automaticData.dogUse.length > 0 ? (
                      <div>
                        {" "}
                        <WhiteSpace size="lg" />
                        <Flex>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>科目名称</div>
                          </Flex.Item>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>项目名称</div>
                          </Flex.Item>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>得分</div>
                          </Flex.Item>
                          {/*   <Flex.Item><div style={{textAlign:'center'}}>操作</div></Flex.Item>*/}
                        </Flex>
                      </div>
                    ) : null}
                    {automaticData.dogUse && automaticData.dogUse.length > 0 ? (
                      automaticData.dogUse.map((message, index) => (
                        <div key={index}>
                          <WhiteSpace size="lg" />
                          <Flex>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.subjectName ? message.subjectName : "--"}</div>
                            </Flex.Item>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.item ? message.item : "--"}</div>
                            </Flex.Item>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.score ? message.score : "--"}</div>
                            </Flex.Item>
                            {/*    <Flex.Item><div style={{textAlign:'center'}}>{<span onClick={this.showModal(message)} style={{ color: 'blue'}}>详情</span>}</div></Flex.Item>*/}
                          </Flex>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: "center", paddingTop: "12px", paddingBottom: "12px" }}>暂无数据</div>
                    )}
                    {automaticData.dogUse && automaticData.dogUse.length > 0 ? <WhiteSpace size="lg" /> : null}
                  </List>
                </Accordion.Panel>
                <Accordion.Panel
                  header={
                    <span>
                      出勤考勤{automaticData.outdoor && automaticData.outdoor.length > 0 ? "(" + automaticData.outdoor[0].totalScore + ")" : "(0)"}
                    </span>
                  }
                  className="pad"
                  key="2"
                >
                  <List className="my-list">
                    {automaticData.outdoor && automaticData.outdoor.length > 0 ? (
                      <div>
                        {" "}
                        <WhiteSpace size="lg" />
                        <Flex>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>科目名称</div>
                          </Flex.Item>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>项目名称</div>
                          </Flex.Item>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>得分</div>
                          </Flex.Item>
                          {/*    <Flex.Item><div style={{textAlign:'center'}}>操作</div></Flex.Item>*/}
                        </Flex>
                      </div>
                    ) : null}
                    {automaticData.outdoor && automaticData.outdoor.length > 0 ? (
                      automaticData.outdoor.map((message, n) => (
                        <div key={n}>
                          <WhiteSpace size="lg" />
                          <Flex>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.subjectName ? message.subjectName : "--"}</div>
                            </Flex.Item>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.item ? message.item : "--"}</div>
                            </Flex.Item>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.score ? message.score : "--"}</div>
                            </Flex.Item>
                            {/*    <Flex.Item><div style={{textAlign:'center'}}>{<span style={{ color: 'blue'}} onClick={this.showModal(message)} >详情</span>}</div></Flex.Item>*/}
                          </Flex>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: "center", paddingTop: "12px", paddingBottom: "12px" }}>暂无数据</div>
                    )}
                    {automaticData.outdoor && automaticData.outdoor.length > 0 ? <WhiteSpace size="lg" /> : null}
                  </List>
                </Accordion.Panel>
                <Accordion.Panel
                  header={
                    <span>
                      训练考核
                      {autonomyData.trainCheck && autonomyData.trainCheck.length > 0 ? "(" + autonomyData.trainCheck[0].totalScore + ")" : "(0)"}
                    </span>
                  }
                  className="pad"
                  key="3"
                >
                  <List className="my-list">
                    {autonomyData.trainCheck && autonomyData.trainCheck.length > 0 ? (
                      <div>
                        {" "}
                        <WhiteSpace size="lg" />
                        <Flex>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>科目名称</div>
                          </Flex.Item>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>项目名称</div>
                          </Flex.Item>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>得分</div>
                          </Flex.Item>
                          {/*     <Flex.Item><div style={{textAlign:'center'}}>操作</div></Flex.Item>*/}
                        </Flex>
                      </div>
                    ) : null}
                    {autonomyData.trainCheck && autonomyData.trainCheck.length > 0 ? (
                      autonomyData.trainCheck.map((message, n) => (
                        <div key={n}>
                          <WhiteSpace size="lg" />
                          <Flex>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.subjectName ? message.subjectName : "--"}</div>
                            </Flex.Item>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.item ? message.item : "--"}</div>
                            </Flex.Item>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.score ? message.score : "--"}</div>
                            </Flex.Item>
                            {/*   <Flex.Item><div style={{textAlign:'center'}}>{<span style={{ color: 'blue'}}>详情</span>}</div></Flex.Item>*/}
                          </Flex>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: "center", paddingTop: "12px", paddingBottom: "12px" }}>暂无数据</div>
                    )}
                    {autonomyData.trainCheck && autonomyData.trainCheck.length > 0 ? <WhiteSpace size="lg" /> : null}
                  </List>
                </Accordion.Panel>
                <Accordion.Panel
                  header={
                    <span>
                      理化管理
                      {autonomyData.dailyManage && autonomyData.dailyManage.length > 0 ? "(" + autonomyData.dailyManage[0].totalScore + ")" : "(0)"}
                    </span>
                  }
                  className="pad"
                  key="4"
                >
                  <List className="my-list">
                    {autonomyData.dailyManage && autonomyData.dailyManage.length > 0 ? (
                      <div>
                        {" "}
                        <WhiteSpace size="lg" />
                        <Flex>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>科目名称</div>
                          </Flex.Item>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>项目名称</div>
                          </Flex.Item>
                          <Flex.Item>
                            <div style={{ textAlign: "center" }}>得分</div>
                          </Flex.Item>
                          {/*  <Flex.Item><div style={{textAlign:'center'}}>操作</div></Flex.Item>*/}
                        </Flex>
                      </div>
                    ) : null}
                    {autonomyData.dailyManage && autonomyData.dailyManage.length > 0 ? (
                      autonomyData.dailyManage.map((message, index) => (
                        <div key={index}>
                          <WhiteSpace size="lg" />
                          <Flex>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.subjectName ? message.subjectName : "--"}</div>
                            </Flex.Item>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.item ? message.item : "--"}</div>
                            </Flex.Item>
                            <Flex.Item>
                              <div style={{ textAlign: "center" }}>{message.score ? message.score : "--"}</div>
                            </Flex.Item>
                            {/*  <Flex.Item><div style={{textAlign:'center'}}>{<span style={{ color: 'blue'}}>详情</span>}</div></Flex.Item>*/}
                          </Flex>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: "center", paddingTop: "12px", paddingBottom: "12px" }}>暂无数据</div>
                    )}
                    {autonomyData.dailyManage && autonomyData.dailyManage.length > 0 ? <WhiteSpace size="lg" /> : null}
                  </List>
                </Accordion.Panel>
              </Accordion>
            </div>
            <WhiteSpace size="xl" />
            <WhiteSpace size="xl" />
            <WhiteSpace size="xl" />
          </div>
        </div>
        <Footer />
        <Modal
          visible={this.state.modal1}
          transparent
          //  className="check-info-modal"
          maskClosable={false}
          onClose={this.onClose("modal1")}
          title="详细情况"
          footer={[
            {
              text: "返回",
              onPress: () => {
                console.log("ok");
                this.onClose("modal1")();
              },
            },
          ]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div style={{ height: 300, overflow: "scroll" }}>
            <List style={{ backgroundColor: "white" }} className="">
              <TextareaItem title="姓  名:" placeholder="" value={specificInfo.name || "--"}></TextareaItem>
              <TextareaItem title="指标名称:" placeholder="" value={specificInfo.item || "--"}></TextareaItem>
              <TextareaItem
                title="开始时间:"
                placeholder=""
                value={specificInfo.startTime ? moment(specificInfo.startTime).format("YYYY-MM-DD h:mm:ss") : "--"}
              ></TextareaItem>
              <TextareaItem
                title="结束时间:"
                placeholder=""
                value={specificInfo.endTime ? moment(specificInfo.endTime).format("YYYY-MM-DD h:mm:ss") : "--"}
              ></TextareaItem>
              <TextareaItem title="地  点:" placeholder="" value={specificInfo.location || "--"}></TextareaItem>
              {typeId == 1 ? <TextareaItem title="警  犬:" value={specificInfo || "--"}></TextareaItem> : null}
            </List>
          </div>
        </Modal>
      </div>
    );
  }
}

const Check = createForm()(CheckComponent);
export default withRouter(Check);

// WEBPACK FOOTER //
// ./src/redux/containers/check/index.js
