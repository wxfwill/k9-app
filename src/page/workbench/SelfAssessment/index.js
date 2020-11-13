import React, { Component } from 'react';
import { Button, List, Toast } from 'antd-mobile';
import Header from 'components/common/Header';

import ValueAssessment from './components/ValueAssessment';
import FourReport from './components/FourReport';
import AttendanceScore from './components/AttendanceScore';
import OtherPoints from './components/OtherPoints';

require('style/publish/public.less');
require('style/page/workbench/SelfAssessment.less');

const Item = List.Item;

class SelfAssessment extends Component {
  constructor(props) {
    super(props);
    this.userInfor = JSON.parse(sessionStorage.getItem('user'));
    this.state = {
      openjiazhi: false,
      open4W: false,
      openCheckingin: false,
      openOther: false,
      jiazhiTotal: undefined, //价值观考核总得分
      fourWTotal: undefined, //4W总得分
      checkinginTotal: undefined, //考勤总得分
      otherTotal: 0, //其它得分
      jiazhiData: null,
      fourWData: null,
      checkinginData: null,
      otherData: null,
    };
  }

  componentDidMount() {
    this.getFourWReportStatistics();
    this.getAttendanceStatistics();
  }

  //获取4w报备默认数据
  getFourWReportStatistics = () => {
    const reqData = {
      userId: [this.userInfor.id], //登录人员ID
      groupId: [this.userInfor.role], //所在中队ID
    };
    React.$ajax.publish.getFourWReportStatistics(reqData).then((res) => {
      if (res && res.code == 0) {
        let total = 0;
        res.data.map((item) => {
          item.score = item.mark;
          item.selfMark = item.mark;
          item.defaultMark = item.mark;
          total += item.mark;
        });
        this.setState({
          fourWData: res.data,
          fourWTotal: total,
        });
      }
    });
  };

  //获取默认数据
  getAttendanceStatistics = () => {
    const reqData = {
      ignorePageRequest: true, //忽略分页
      param: {
        userId: [this.userInfor.id], //登录人员ID
        groupId: [this.userInfor.role], //所在中队ID
      },
    };
    React.$ajax.publish.getAttendanceStatistics(reqData).then((res) => {
      if (res && res.code == 0) {
        let total = 0;
        res.data.map((item) => {
          item.score = item.mark;
          item.selfMark = item.mark;
          item.defaultMark = item.mark;
          total += item.mark;
        });
        this.setState({
          checkinginData: res.data,
          checkinginTotal: total,
        });
      }
    });
  };

  showModal = (key) => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  };

  //获取价值观考核得分
  getValueAssessment = (data) => {
    console.log(data, '获取价值观考核得分');
    this.setState({
      openjiazhi: false,
      jiazhiTotal: data.total,
      jiazhiData: data.data,
    });
  };

  //获取4W报备得分
  getFourReport = (data) => {
    console.log(data, '获取4W报备得分');
    this.setState({
      open4W: false,
      fourWTotal: data.total,
      fourWData: data.data,
    });
  };

  //获取考勤得分
  getAttendanceScore = (data) => {
    console.log(data, '获取考勤得分');
    this.setState({
      openCheckingin: false,
      checkinginTotal: data.total,
      checkinginData: data.data,
    });
  };

  //获取其它得分
  getOtherPoints = (data) => {
    console.log(data, '获取考勤得分');
    this.setState({
      openOther: false,
      otherTotal: data.total,
      otherData: data.data,
    });
  };

  //计算自评总分
  getTotal = () => {
    const { jiazhiTotal, fourWTotal, checkinginTotal, otherTotal } = this.state;
    let total = 0;
    const t1 = !isNaN(jiazhiTotal) ? jiazhiTotal : 0;
    const t2 = !isNaN(fourWTotal) ? fourWTotal : 0;
    const t3 = !isNaN(checkinginTotal) ? checkinginTotal : 0;
    const t4 = !isNaN(otherTotal) ? otherTotal : 0;
    total = t1 + t2 + t3 + t4;
    return total;
  };

  //提交
  onSubmit = () => {
    const { jiazhiData, fourWData, checkinginData, otherData, jiazhiTotal } = this.state;
    if (!jiazhiData) {
      Toast.fail('请填写价值观考核！', 1);
      return;
    }
    const reqData = {
      userId: this.userInfor.id,
      squadronId: this.userInfor.role,
      businessSelfSumMark: this.getTotal() - (!isNaN(jiazhiTotal) ? jiazhiTotal : 0), //业务的总分
      valueSelfSumMark: !isNaN(jiazhiTotal) ? jiazhiTotal : 0, //价值观总分
      //价值观考核参数
      assessmentValues: jiazhiData,
      //4W报备统计参数
      fourWReportStatisticsDTOS: fourWData,
      //考勤统计参数
      attendanceStatisticsDTOS: checkinginData,
      //其它补充得分参数
      otherReasonsDTOS: otherData,
    };
    React.$ajax.publish.saveSelfEvaluation(reqData).then((res) => {
      if (res && res.code == 0) {
        Toast.success('上报成功！', 1);
        this.props.history.push('/own');
      }
    });
  };

  render() {
    const {
      openjiazhi,
      open4W,
      openCheckingin,
      openOther,
      jiazhiTotal,
      fourWTotal,
      checkinginTotal,
      otherTotal,
      fourWData,
      checkinginData,
    } = this.state;
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="自评表上报" pointer="pointer" />
          <div className="child-container">
            <div className="components">
              <div className="self-assessment">
                <List>
                  <Item extra={<p style={{ color: '#2D2E31' }}>自评分：{this.getTotal()}</p>}>
                    姓名：{this.userInfor.name}
                  </Item>
                  <Item
                    extra={!isNaN(jiazhiTotal) ? jiazhiTotal : '待评分'}
                    arrow="horizontal"
                    onClick={this.showModal('openjiazhi')}
                  >
                    价值观考核得分
                  </Item>
                  <Item
                    extra={!isNaN(fourWTotal) ? fourWTotal : '待评分'}
                    arrow="horizontal"
                    onClick={this.showModal('open4W')}
                  >
                    4W报备得分
                  </Item>
                  <Item
                    extra={!isNaN(checkinginTotal) ? checkinginTotal : '待评分'}
                    arrow="horizontal"
                    onClick={this.showModal('openCheckingin')}
                  >
                    考勤得分
                  </Item>
                  <Item
                    extra={!isNaN(otherTotal) ? otherTotal : '待评分'}
                    arrow="horizontal"
                    onClick={this.showModal('openOther')}
                  >
                    其它得分
                  </Item>
                </List>
              </div>
            </div>
          </div>
          <div className="footer-common">
            <Button type="primary" onClick={this.onSubmit}>
              提交
            </Button>
          </div>
        </div>
        {/* 价值观考核得分 */}
        <ValueAssessment visible={openjiazhi} onClose={(data) => this.getValueAssessment(data)}></ValueAssessment>
        {/* 4W报备得分 */}
        <FourReport visible={open4W} defaultData={fourWData} onClose={(data) => this.getFourReport(data)}></FourReport>
        {/* 考勤得分 */}
        <AttendanceScore
          visible={openCheckingin}
          defaultData={checkinginData}
          onClose={(data) => this.getAttendanceScore(data)}
        ></AttendanceScore>
        {/* 业务与内务考核得分 */}
        <OtherPoints visible={openOther} onClose={(data) => this.getOtherPoints(data)}></OtherPoints>
      </div>
    );
  }
}

module.exports = SelfAssessment;
