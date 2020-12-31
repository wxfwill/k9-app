import React, { Component } from 'react';
import { Toast, Carousel, WhiteSpace, WingBlank, Button, TextareaItem, Picker, List, Modal } from 'antd-mobile';
import { Progress } from 'components/plugins/progress';
import Reflux from 'reflux';
import { createForm } from 'rc-form';
import ReactMixin from 'react-mixin';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import { withRouter, Link } from 'react-router-dom';
import Store from './store';
import Actions from './actions';
import Ajax from 'libs/ajax';
import { CallApp } from 'libs/util';
import Report from 'components/common/Report';

require('style/drill/drill.less');
const alert = Modal.alert;
const chuji = require('images/chuji.png');
const chujiActive = require('images/chuji-active.png');
const gaoji = require('images/gaoji.png');
const gaojiActive = require('images/gaoji-active.png');

let progress = '';

let traceStatus = [
  {
    class: 'nostart',
    name: '未开始',
  },
  {
    class: 'going',
    name: '进行中',
  },
  {
    class: 'hasend',
    name: '已完成',
  },
];

class DrillDetail extends Component {
  constructor(props) {
    super(props);

    let info = '';
    if (this.props.location.query) {
      info = this.props.location.query;
    } else {
      let { history } = this.props;
      history.push('/own/OwnTask');
    }

    this.state = {
      drillInfo: '',
      dogs: '',
      dogId: '',
      peoShow: false,
      canStart: false,
      subjectDetails: [],
      subjectSelected: [],
      allPeoples: [],
      trackState: '',
      peopleSelected: [],
      //   locationJson: '1234'
    };
    this.subJectDetailsObj = {};
    this.allPeoplesObj = {};
    this.timer = null;
  }
  UNSAFE_componentWillMount() {
    // Toast.loading('页面加载中...', 2,function(){}, true);
  }
  getUserLocation = () => {
    CallApp({ callAppName: 'getLocationInfo', callbackName: 'sendLocationInfoToJs', callbackFun: this.showLocation });
  };
  showLocation = (msg) => {
    // Toast(msg);
    console.log(msg);
  };
  componentDidMount() {
    // this.timer = setInterval(  this.getUserLocation, 3000)

    //通过id获取详情数据
    if (this.props.history.location.query) {
      Ajax.post(
        '/api/train/trainAppDetail',
        {
          id: this.props.history.location.query,
        },
        (res) => {
          if (res.code == 0) {
            const dogList =
              res.data.dogs &&
              res.data.dogs.map((t) => {
                return { value: t.name, label: t.name, id: t.id };
              });
            let subjectSelected = [];
            res.data.subjectDetails.map((item) => {
              item.value = item.id;
              item.label = item.name;
              this.subJectDetailsObj[item.id] = item;
              if (item.isSelected == 1) {
                subjectSelected = [item.id];
              }
            });
            let trackState = res.data.traceStatus >= 0 ? traceStatus[res.data.traceStatus] : '';
            this.setState({
              drillInfo: res.data,
              dogs: dogList,
              trackState: trackState,
              subjectDetails: res.data.subjectDetails,
              subjectSelected: subjectSelected,
            });
            this.setProgress(res.data.status, res.data.accumulateTime);
            if (res.data.status == 0 || res.data.status == 2) {
              setTimeout(function () {
                progress.endTime();
              }, 1000);
            }
          } else {
            Toast.info(res.msg);
            return;
          }
        }
      );
    }
    this.getUserLocation();
  }

  setProgress(status, accumulateTime) {
    const self = this;
    window.addEventListener('touchmove', function () {}, { passive: false });
    progress = new Progress({
      el: 'progress', //canvas元素id
      deg: 360, //绘制角度
      timer: 0, //绘制时间
      lineWidth: 9, //线宽
      lineBgColor: '#e2e2e2', //底圆颜色
      lineColor: '#3D8CE8', //动态圆颜色
      textColor: '#3D8CE8', //文本颜色
      fontSize: 24, //字体大小
      circleRadius: 100, //圆半径
      times: accumulateTime,
    });
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  requestPeos = () => {
    Ajax.post('/api/userCenter/getCombatStaff', {}, (result) => {
      if (result.code == 0) {
        result.data.map((item) => {
          item.value = item.id;
          item.label = item.name;
          this.allPeoplesObj[item.id] = item.name;
        });
        this.setState({
          allPeoples: result.data,
        });
      }
    });
  };
  changeDog = (value) => {
    const dogs = this.state.dogs;
    let drill = this.state.drillInfo;

    dogs.forEach((t) => {
      if (t.value == value[0]) {
        drill.dogName = t.value;
        this.setState({
          dogId: t.id,
          drillInfo: drill,
        });
      }
    });
  };
  changePeo = (val) => {
    let { peopleSelected } = this.state;
    this.setState({
      peopleSelected: val,
    });
  };
  surePeople = () => {
    let { peopleSelected, subjectSelected, drillInfo, canStart } = this.state;
    if (peopleSelected.length < 1) {
      Toast.info('追踪对象不能为空！');
      return false;
    }
    const data = {
      id: drillInfo.id,
      subjectDetailId: subjectSelected[0],
      targetUserId: peopleSelected[0],
    };
    Ajax.post('/api/train/selectTracer', data, (result) => {
      if (result.code == 0) {
        Toast.info('确认成功！');
        drillInfo.isTrace = 1;
        drillInfo.traceTargetUserName = this.allPeoplesObj[peopleSelected[0]];
        drillInfo.subjectDetailName = this.subJectDetailsObj[subjectSelected[0]].name;
        this.setState({
          drillInfo: drillInfo,
          canStart: false,
          trackState: traceStatus[0],
        });
        return false;
      }
      Toast.info('确认失败！');
    });
  };
  changeSubject = (val) => {
    let { allPeoples, canStart, drillInfo } = this.state;
    let obj = this.subJectDetailsObj[val[0]];
    drillInfo.subjectDetailName = obj.name;
    let peoShow = false;
    if (obj && obj.isTrace == 1) {
      peoShow = true;
      canStart = true;
      allPeoples.length < 1 ? this.requestPeos() : '';
    }
    this.setState({
      subjectSelected: val,
      drillInfo,
      peoShow: peoShow,
      canStart: canStart,
    });
  };
  trainStartOrEnd = () => {
    const { drillInfo } = this.state;
    if (drillInfo.status == 1) {
      const alertInstance = alert('结束任务', '确定结束此任务吗?', [
        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
        { text: '确定', onPress: () => this.startOrEndMethod() },
      ]);
    } else {
      this.startOrEndMethod();
    }
  };
  startOrEndMethod() {
    const { dogId, drillInfo, subjectSelected, canStart } = this.state;
    if (!dogId && drillInfo.status == 0) {
      Toast.info('请选择警犬！');
      return;
    }
    if (subjectSelected.length < 1 && drillInfo.status == 0) {
      Toast.info('训练专项不能为空！');
      return;
    }
    if (canStart) {
      Toast.info('未选择追踪对象！');
      return;
    }
    if (drillInfo.isTrace == 1 && drillInfo.traceStatus != 2) {
      Toast.info('被追踪人还未确认完成任务！');
      return;
    }
    let action = 'startTrain';
    drillInfo.status == 1 ? (action = 'endTrain') : action;
    Ajax.post(
      '/api/train/' + action,
      {
        id: drillInfo.id,
        dogId: dogId,
        subjectDetailId: subjectSelected[0],
      },
      (res) => {
        if (res.code == 0) {
          let newDrillInfo = drillInfo;
          drillInfo.status == 1 ? (newDrillInfo.status = 2) : (newDrillInfo.status = 1);
          let msg = '训练开始！';
          action == 'endTrain' ? (msg = '训练结束！') : msg;
          Toast.info(msg);
          this.setState({
            drillInfo: newDrillInfo,
          });
          if (newDrillInfo.status == 1) {
            progress.startTime();
          } else {
            progress.endTime();
          }
        } else {
          Toast.info(res.msg);
          return;
        }
      }
    );
  }
  handleShow = (id) => {
    const { history } = this.props;
    history.push({ pathname: '/drill/detail/trackmap', query: { id: id, onlyread: true } });
  };
  render() {
    let taskName = '训练详情';
    const { getFieldProps } = this.props.form;
    const { subjectDetails, allPeoples, peoShow, trackState, canStart } = this.state;
    return (
      <div className="Drill">
        {this.state.drillInfo.isTrace == 1 && this.state.drillInfo.status == 2 ? (
          <Header
            title={`${taskName}`}
            pointer="pointer"
            isSet="轨迹分析"
            handleShow={() => this.handleShow(this.state.drillInfo.id)}
          />
        ) : (
          <Header title={`${taskName}`} pointer="pointer" />
        )}
        <List className="list">
          <TextareaItem
            title="训练场地:"
            disabled="true"
            placeholder=""
            value={this.state.drillInfo.placeName}
          ></TextareaItem>
        </List>

        <List className="list">
          <TextareaItem
            title="训练科目:"
            disabled="true"
            placeholder=""
            value={this.state.drillInfo.subjectName}
          ></TextareaItem>
        </List>
        <List className="list">
          <TextareaItem
            title="训练说明:"
            autoHeight
            disabled="true"
            placeholder=""
            value={this.state.drillInfo.trainRemark}
          ></TextareaItem>
        </List>
        <List className="list">
          {this.state.drillInfo.status >= 1 ? (
            <TextareaItem
              title="犬名:"
              disabled="true"
              placeholder=""
              value={this.state.drillInfo.dogName ? this.state.drillInfo.dogName : `无`}
            ></TextareaItem>
          ) : (
            <Picker
              data={this.state.dogs}
              cols={1}
              {...getFieldProps('district3')}
              className="forss"
              onOk={(value) => this.changeDog(value)}
            >
              <List.Item arrow="horizontal">犬名</List.Item>
            </Picker>
          )}
        </List>
        <List className="list">
          {this.state.drillInfo.status != 0 || this.state.drillInfo.isTrace == 1 ? (
            <TextareaItem
              title="训练专项:"
              disabled="true"
              placeholder=""
              value={this.state.drillInfo.subjectDetailName}
            ></TextareaItem>
          ) : (
            <Picker
              data={subjectDetails}
              className="forss"
              cols={1}
              {...getFieldProps('id')}
              onOk={(value) => this.changeSubject(value)}
            >
              <List.Item arrow="horizontal">训练专项</List.Item>
            </Picker>
          )}
        </List>
        {this.state.drillInfo.isTrace == 1 ? (
          <List className="list">
            <TextareaItem
              title="追踪对象:"
              disabled="true"
              placeholder=""
              value={this.state.drillInfo.traceTargetUserName}
            ></TextareaItem>
          </List>
        ) : null}
        {canStart ? (
          <List className="list">
            <Picker
              data={allPeoples}
              cols={1}
              {...getFieldProps('tracerId')}
              className="forss"
              onOk={(value) => this.changePeo(value)}
            >
              <List.Item arrow="horizontal">追踪对象</List.Item>
            </Picker>
          </List>
        ) : null}
        {trackState ? (
          <List className="list state-list">
            <List.Item extra={<i className={trackState.class}>{trackState.name}</i>}>
              {this.state.drillInfo.traceTargetUserName}
            </List.Item>
          </List>
        ) : null}
        {canStart ? (
          <div style={{ textAlign: 'right', padding: '6px 15px' }}>
            <Button type="primary" onClick={this.surePeople} inline size="small">
              确认追踪对象
            </Button>
          </div>
        ) : null}
        {/*this.state.drillInfo.status >= 2 ? 
          <div style={{textAlign:'right', padding:'6px 15px'}}>
            <Report
              id={this.state.drillInfo.planId}
              type={1}
            />
          </div>
          :
          null
        */}
        <div className="proContainer">
          <span className="tip-text">&nbsp;&nbsp;计时</span>
          <canvas id="progress"></canvas>
          {/* <span className="target">目标02:00:00</span>*/}
          <div className="handle">
            {this.state.drillInfo.status == 0 ? (
              <Button type="primary" onClick={this.trainStartOrEnd} inline size="small">
                开始训练
              </Button>
            ) : null}
            {this.state.drillInfo.status == 1 ? (
              <Button type="primary" onClick={this.trainStartOrEnd} inline size="small">
                结束训练
              </Button>
            ) : null}
            {this.state.drillInfo.status == 2 ? (
              <Button className="end" inline>
                完成
              </Button>
            ) : null}
            {/*  <p>今日步数{this.state.locationJson}</p>*/}
          </div>
        </div>
      </div>
    );
  }
}

export default createForm()(withRouter(DrillDetail));

// WEBPACK FOOTER //
// ./src/components/own/OwnTask/Drill/drilldetail/DrillDetail.js
