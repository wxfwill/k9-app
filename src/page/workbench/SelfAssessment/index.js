import React, { Component } from 'react';
import { Button, Icon, List, Modal, Card, TextareaItem, Slider, Popover, InputItem } from 'antd-mobile';
import Header from 'components/common/Header';
import { createForm } from 'rc-form';

import ValueAssessment from './components/ValueAssessment';
import FourReport from './components/FourReport';
import AttendanceScore from './components/AttendanceScore';
import OtherPoints from './components/OtherPoints';

require('style/publish/public.less');
require('style/page/workbench/SelfAssessment.less');

const Item = List.Item;

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

class SelfAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openjiazhi: false,
      open4W: false,
      openCheckingin: false,
      openOther: false,
      visible: false,
    };
  }

  showModal = (key) => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  };
  onClose = (key) => () => {
    this.setState({
      [key]: false,
    });
  };
  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  };

  log = (name) => {
    return (value) => {
      console.log(`${name}: ${value}`);
    };
  };

  //获取价值观考核得分
  getValueAssessment = (data) => {
    console.log(data, '获取价值观考核得分');
    this.setState({
      openjiazhi: false,
    });
  };

  //获取4W报备得分
  getFourReport = (data) => {
    console.log(data, '获取4W报备得分');
    this.setState({
      open4W: false,
    });
  };

  //获取考勤得分
  getAttendanceScore = (data) => {
    console.log(data, '获取考勤得分');
    this.setState({
      openCheckingin: false,
    });
  };

  //获取其它得分
  getOtherPoints = (data) => {
    console.log(data, '获取考勤得分');
    this.setState({
      openOther: false,
    });
  };

  //提交
  onSubmit = () => {};

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="自评表上报" pointer="pointer" />
          <div className="child-container">
            <div className="components">
              <div className="self-assessment">
                <List>
                  <Item extra={<p style={{ color: '#2D2E31' }}>自评分：90</p>}>姓名：张三</Item>
                  <Item extra="待评分" arrow="horizontal" onClick={this.showModal('openjiazhi')}>
                    价值观考核得分
                  </Item>
                  <Item extra="待评分" arrow="horizontal" onClick={this.showModal('open4W')}>
                    4W报备得分
                  </Item>
                  <Item extra="-4.5" arrow="horizontal" onClick={this.showModal('openCheckingin')}>
                    考勤得分
                  </Item>
                  <Item extra="待评分" arrow="horizontal" onClick={this.showModal('openOther')}>
                    业务与内务考核得分
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
        <ValueAssessment
          visible={this.state.openjiazhi}
          onClose={(data) => this.getValueAssessment(data)}
        ></ValueAssessment>
        {/* 4W报备得分 */}
        <FourReport visible={this.state.open4W} onClose={(data) => this.getFourReport(data)}></FourReport>
        {/* 考勤得分 */}
        <AttendanceScore
          visible={this.state.openCheckingin}
          onClose={(data) => this.getAttendanceScore(data)}
        ></AttendanceScore>
        {/* 业务与内务考核得分 */}
        <OtherPoints visible={this.state.openOther} onClose={(data) => this.getOtherPoints(data)}></OtherPoints>
      </div>
    );
  }
}
const SelfAssessmentWrapper = createForm()(SelfAssessment);
module.exports = SelfAssessmentWrapper;
