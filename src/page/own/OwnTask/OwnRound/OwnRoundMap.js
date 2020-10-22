import React, { Component } from 'react';
import { Button, message, Picker, List, Icon, Flex, Modal, Toast } from 'antd-mobile';
import Header from 'components/common/Header';
import { tMap } from 'containers/round/roundMap/map';
import Ajax from 'libs/ajax';
import moment from 'moment';
import { CallApp, toast } from 'libs/util';
import Report from 'components/common/Report';
//import { BDMap  } from './BMap'

require('style/round/roundMap.less');
const alert = Modal.alert;
const othersPic = require('images/own.gif');
const ownPic = require('images/others.png');
const stateVal = [
  {
    state: 0,
    class: 'start',
    name: '开始巡逻',
  },
  {
    state: 1,
    class: 'going',
    name: '停止巡逻',
  },
  {
    state: 2,
    class: 'stop',
    name: '已经停止',
  },
  {
    state: 3,
    class: 'end',
    name: '已经结束',
  },
];
class OwnRoundMAP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownLatlng: { lat: 22.543099, lng: 114.057868 },
      patral: false,
      isShowDetail: true,
      pageSize: 100,
      currPage: 1,
      status: 0,
      detailData: null,
      disabled: false,
      roundInforClass: 'rhide',
      dataArr: [{ label: '无', value: 'no' }],
      value: ['no'],
    };
    //判断是否是第一次
    this.isFirst = true;
    //this.BDMap = null;
    this.TMap = null;
    this.mapMark = null;
    this.polyline = null;
    //获取服务器点
    this.lastPointTime = null;

    this.images = {
      ownPic: ownPic,
      othersPic: othersPic,
    };
    this.referencePoint = 0;
    this.timer = null;
    this.timer2 = null;
  }
  componentDidMount() {
    //let myPoint = {lat:"22.53103578227407", lng:"113.95115796895573"};
    //this.BDMap = new BDMap();
    //this.BDMap.centerAndZoom(myPoint,16);
    //this.BDMap.addControl();
    //this.TMap = new tMap(options);

    if (this.props.history.location.query) {
      // 绘制目标点和区域
      //const {area, referencePoint, status, dogName} = this.props.history.location.query;
      const taskId = this.props.history.location.query;
      this.getDetail(taskId, (data) => {
        this.setState({
          detailData: data,
        });
        console.log(data);
        const { referencePoint, status, dogName } = data;
        let area = data.drawShapeDTO.latLngArr;
        let options = {
          lat: 22.53103578227407,
          lng: 113.95115796895573,
        };
        if (area) {
          options = Object.assign(options, area[0]);
          this.TMap = new tMap(options);
          //    area = [...area, area[0]];
          //    this.polyline = this.TMap.TrackPoints(area, '#2691EA');
          this.polyline = this.TMap.polygonArea(area);
          this.referencePoint = referencePoint;
          /* this.BDMap.drawRectangle(area.a, area.d);
            referencePoint && this.BDMap.setMarker(referencePoint);
            let _this = this;
            referencePoint && this.TMap.seteDestinationMark(this.images, [referencePoint]);
            
            this.referencePoint = area;
            移到获得手机定位后再画
            this.TMap.drivingService(myPoint, referencePoint) // 行车路线 
            this.TMap.Polyline([myPoint, referencePoint], {strokeDashStyle: 'dash'}) // 直*/
        }
        if (status == 1) {
          this.timer = setInterval(this.getTrackPoints, 8000); // 绘制路径
          this.timer2 = setInterval(this.getUserLocation, 4000); // 获取用户的app位置信息
          //  在开始后选择警犬
          if (dogName == '') {
            this.getDog();
          }
        }
        if (status == 0) {
          //  在未开始时选择警犬
          //  this.getDog();
        } else {
          //当状态不等于0时，就要获取历史路径
          this.getHistoryPoints(1);
          //判断有犬名就是显示全名
          let dogNa = dogName ? dogName : '无';
          this.setState({
            dataArr: [{ label: dogNa, value: 'no' }],
            disabled: true,
          });
        }
        this.setState({
          patral: status == 0 || status == 2 ? false : true,
          status: status,
          isShowDetail: status != 0 ? false : true,
        });
        this.getUserLocation();
      });
    }
    //this.mapMark = this.TMap.setSelfMark(this.images, myPoint);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
    this.setState = (state, callback) => {
      return;
    };
  }

  getUserLocation = () => {
    const _this = this;
    CallApp({ callAppName: 'getLocationInfo', callbackName: 'sendLocationInfoToJs', callbackFun: _this.showLocation });
  };
  showLocation = (msg) => {
    console.log(msg);
    var _this = this;
    let point = JSON.parse(msg);
    let latlng = { lat: point.latitude, lng: point.longitude };
    //判断是否有marker
    if (!_this.mapMark) {
      _this.mapMark = _this.TMap.setSelfMark(_this.images, latlng);
    } else {
      _this.TMap.setSelfMark(_this.images, latlng, _this.mapMark);
    }
    //判断当前位置是否在指定区域
    if (_this.TMap.isContains(this.polyline, latlng)) {
      var circle_color = new qq.maps.Color(Number(78), Number(238), Number(148), 0.2);
      this.polyline.setFillColor(circle_color);
    } else {
      var circle_color = new qq.maps.Color(Number(38), Number(145), Number(234), 0.2);
      this.polyline.setFillColor(circle_color);
    }
    if (_this.isFirst) {
      if (_this.TMap.isContains(this.polyline, latlng)) {
        return;
      }
      _this.isFirst = false;
      //等获取手机定位后再画线
      //_this.TMap.drivingService(latlng, _this.referencePoint) // 行车路线
      let minPointer = _this.TMap.minPointer(latlng, _this.referencePoint);
      _this.TMap.rPanTo(latlng);
      _this.TMap.Polyline([latlng, minPointer], { strokeDashStyle: 'dash' }); // 直
    }
  };
  getDetail = (taskId, fn) => {
    Ajax.post('/api/cmdMonitor/patrolsTaskAppDetail', { id: taskId }, (result) => {
      if (result.code == '0') {
        fn(result.data);
      }
    });
  };
  getTrackPoints = () => {
    // 获取用户轨迹数据
    const _this = this;
    const query = _this.state.detailData;
    const { taskDetailId, taskType } = query;
    const { pageSize, currPage } = _this.state;
    const lastPointTime = _this.lastPointTime;
    Ajax.post('/api/cmdMonitor/showAppTrochoid', { taskDetailId, taskType, lastPointTime }, (data) => {
      if (data.code == '0') {
        const path = data.data.pathsCurr;
        _this.lastPointTime = data.data.lastPointTime ? data.data.lastPointTime : _this.lastPointTime;

        if (path && path.length > 0) {
          //this.TMap.clearOverlay();
          path.map((item) => {
            if (item.length < 1) {
              return false;
            }
            _this.TMap.TrackPoints(item);
            //this.TMap.setSelfMark(this.images, item[item.length-1], _this.mapMark)
          });
        }
      }
    });
  };
  getHistoryPoints(currPage) {
    const _this = this;
    const query = _this.state.detailData;
    const { taskDetailId, taskType } = query;
    const { pageSize } = _this.state;

    Ajax.post('/api/cmdMonitor/showAppTrochoidHis', { taskDetailId, taskType }, (data) => {
      if (data.code == '0') {
        let hisPaths = data.data.pathsHis;
        if (hisPaths && hisPaths.length > 0) {
          hisPaths.forEach((item) => {
            if (item.length < 1) {
              return false;
            }
            _this.TMap.TrackPoints(item);
          });
          //const newCurrPage = currPage +1;
          //this.getHistoryPoints(newCurrPage);
          // this.setState({currPage: currPage++}, () => this.getHistoryPoints(currPage++))
          // this.TMap.setSelfMark(this.images, path[path.length-1])
        }
      }
    });
  }

  getDog() {
    let _this = this;
    Ajax.get('/api/dog/listMyDog', { currPage: 1 }, function (result) {
      let arr = [];
      if (result.data.length > 0) {
        result.data.map(function (item) {
          arr.push({
            label: item.name,
            value: item.id,
          });
        });
        _this.setState({
          dataArr: arr,
        });
      }
    });
  }
  startOrEndPatral(patral) {
    if (patral == 1) {
      const alertInstance = alert('结束任务', '确定结束此任务吗?', [
        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
        { text: '确定', onPress: () => this.startOrEndMethod(patral) },
      ]);
    } else {
      this.startOrEndMethod(patral);
    }
  }

  startOrEndMethod(patral) {
    const _this = this;
    let { status, value } = _this.state;
    if (status > 1) {
      return;
    }
    const query = _this.state.detailData;
    let sendData = { id: query.taskDetailId, taskType: query.taskType };
    //如果狗狗选择项未默认的，就传null
    value = value[0] == 'no' ? null : value[0];
    //判断是否第一次点击
    if (!patral) {
      sendData.dogId = value;
      _this.setState({ isShowDetail: false });
    }

    const requstUri = patral ? '/api/cmdMonitor/endPatrols' : '/api/cmdMonitor/startPatrols';
    Ajax.post(requstUri, sendData, (data) => {
      if (data.code == '0') {
        const traceId = data.data.id;
        const equipmentId = data.data.equipmentId || '';
        _this.setState({
          patral: !patral,
          status: patral ? 2 : 1,
        });
        if (patral) {
          clearInterval(_this.timer);
          clearInterval(_this.timer2);
        } else {
          _this.timer2 = setInterval(_this.getUserLocation, 4000); //
          _this.timer = setInterval(_this.getTrackPoints, 8000); // 绘制路径
        }
      }
    });
  }
  showGPS = (msg) => {
    console.log('导航成功！');
  };
  getDrivingService = () => {
    const _this = this;
    CallApp({
      callAppName: 'startNativeNavigation',
      param: { lat: this.referencePoint.lat, lng: this.referencePoint.lng, address: this.location },
      callbackName: 'sendLocationInfoToJs',
      callbackFun: _this.showGPS,
    });
  };
  startK9IM = () => {
    const _this = this;
    CallApp({ callAppName: 'startK9IM', param: {}, callbackName: 'sendLocationInfoToJs' });
  };

  showDetail = (isShowDetail) => {
    this.setState({
      isShowDetail: !isShowDetail,
    });
  };
  pickerChange = (value) => {
    this.setState({
      value: value,
    });
  };
  pickerOk = (value) => {
    this.setState({
      value: value,
    });
  };
  //终止任务改变状态
  closeTask = () => {
    this.setState({
      status: 3,
    });
  };

  //确认警犬信息
  confirmDog = (patral) => {
    const _this = this;
    let { status, value } = _this.state;
    if (status > 1) {
      return;
    }
    const query = _this.state.detailData;
    let sendData = { id: query.taskDetailId, taskType: query.taskType };
    //如果狗狗选择项未默认的，就传null
    value = value[0] == 'no' ? null : value[0];
    /*if(value==null){
    Toast.info("请选择警犬！");
    return;
  }*/
    sendData.dogId = value;
    query.dogName = value;
    const requstUri = '/api/cmdMonitor/startPatrols';
    Ajax.post(requstUri, sendData, (data) => {
      if (data.code == '0') {
        _this.setState({
          detailData: query,
        });
      }
    });
  };
  //任务开始，结束状态的改变
  updateTaskStatus = (id, status, event) => {
    const query = this.state.detailData;
    if (id == query.taskId) {
      clearInterval(this.timer);
      this.setState({
        status: status,
      });
      if (status == 1 && query.dogName == '') {
        this.getDog();
      }
    }
  };

  render() {
    const { patral, isShowDetail, status } = this.state;
    const stateObj = stateVal[status];
    const obj = this.state.detailData;

    console.log(obj, 'obj');
    return (
      <div className="round-map">
        <Header
          title={obj ? '日常巡逻详情' : '加载中'}
          closeTask={this.closeTask.bind(this)}
          updateTaskStatus={this.updateTaskStatus.bind(this)}
          pointer="pointer"
        />
        <div id="container" className="container">
          {obj ? (
            <div className="roundPanel">
              <div className="content">
                <div className="iconDiv" onClick={() => this.showDetail(isShowDetail)}>
                  <Icon color="#666666" type={isShowDetail ? 'down' : 'up'} />
                </div>
                <div className={isShowDetail ? 'round-infor' : 'round-infor rhide'}>
                  <section>
                    <span>任务名称：</span>
                    <div>{obj.taskName}</div>
                  </section>
                  <section>
                    <span>巡逻地点：</span>
                    <div>{obj.patrolsPlace}</div>
                  </section>
                  <section>
                    <span>巡逻人员：</span>
                    <div>{obj.userNames}</div>
                  </section>
                  <section>
                    <span>犬只：</span>
                    <div className="dog-div">
                      <Picker
                        data={this.state.dataArr}
                        onOk={this.pickerOk}
                        cols={1}
                        disabled={status != 1 ? true : false}
                        value={this.state.value}
                      >
                        <List.Item></List.Item>
                      </Picker>
                    </div>
                  </section>
                  <section>
                    <span>任务内容：</span>
                    <div>{`${obj.taskContent}`}</div>
                  </section>
                </div>
                <header>
                  <p>开始时间：{moment(obj.planStartTime).format('YYYY-MM-DD')}</p>
                </header>
                <section style={{ display: 'none' }}>
                  <span>
                    <em className="timer-icon"></em>
                    00:23
                  </span>
                  <span>
                    <em className="second-icon"></em>
                    00'00''
                  </span>
                  <span>
                    <em className="footer-icon"></em>0
                  </span>
                </section>
                <Flex justify="center">
                  {status > 1 && Number(obj.isReporter) == 1 ? (
                    <Report id={obj.reportId} type={2} />
                  ) : status > 1 ? (
                    <Button
                      className={'common-btn ' + stateObj.class}
                      onClick={() => this.startOrEndPatral(patral)}
                      type="primary"
                      inline
                      size="small"
                    >
                      {stateObj.name}{' '}
                    </Button>
                  ) : status == 1 && obj.dogName == '' ? (
                    <Button
                      className="common-btn start"
                      onClick={() => this.confirmDog(patral)}
                      type="primary"
                      inline
                      size="small"
                    >
                      确认
                    </Button>
                  ) : null}
                  <Button
                    className="common-btn"
                    onClick={() => this.getDrivingService()}
                    type="primary"
                    inline
                    size="small"
                  >
                    导航
                  </Button>
                </Flex>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }
}
export default OwnRoundMAP;

// WEBPACK FOOTER //
// ./src/components/own/OwnTask/OwnRound/OwnRoundMap.js
