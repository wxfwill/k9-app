import React, { Component } from 'react';
import { Button, message, Picker, List, Icon } from 'antd-mobile';
import Header from 'components/common/Header';
// import { tMap } from './map';
import Ajax from 'libs/ajax';
import { CallApp, toast } from 'libs/util';

//import { BDMap  } from './BMap'

require('style/round/roundMap.less');
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
class roundMAP extends Component {
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
        const { area, referencePoint, status, dogName } = data;
        let options = {
          lat: 22.53103578227407,
          lng: 113.95115796895573,
        };
        options = Object.assign(options, referencePoint);
        this.TMap = new tMap(options);
        if (area) {
          this.TMap.targetArea(area.a, area.b, area.c, area.d);

          //this.BDMap.drawRectangle(area.a, area.d);
          //referencePoint && this.BDMap.setMarker(referencePoint);
          //let _this = this;
          referencePoint && this.TMap.seteDestinationMark(this.images, [referencePoint]);
          this.referencePoint = referencePoint;
          //移到获得手机定位后再画
          //this.TMap.drivingService(myPoint, referencePoint) // 行车路线
          //this.TMap.Polyline([myPoint, referencePoint], {strokeDashStyle: 'dash'}) // 直
        }
        if (status == 1) {
          this.timer = setInterval(this.getTrackPoints, 8000); // 绘制路径
          this.timer2 = setInterval(this.getUserLocation, 4000); // 获取用户的app位置信息
        }
        if (status == 0) {
          this.getDog();
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
    var _this = this;
    let point = JSON.parse(msg);
    let latlng = { lat: point.latitude, lng: point.longitude };
    //判断是否有marker
    if (!_this.mapMark) {
      _this.mapMark = _this.TMap.setSelfMark(_this.images, latlng);
    } else {
      _this.TMap.setSelfMark(_this.images, latlng, _this.mapMark);
    }
    if (_this.isFirst) {
      _this.isFirst = false;
      _this.TMap.rPanTo(latlng);
      //等获取手机定位后再画线
      //_this.TMap.drivingService(latlng, _this.referencePoint) // 行车路线
      _this.TMap.Polyline([latlng, _this.referencePoint], { strokeDashStyle: 'dash' }); // 直
    }
  };
  getDetail = (taskId, fn) => {
    Ajax.post('/api/cmdMonitor/gridTaskAppDetail', { id: taskId }, (result) => {
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
  startOrEndPatralForAndroid(patral, params) {
    const _this = this;
    if (window.AndroidWebView) {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const token = util.cookieUtil.get('token');
      const query = _this.state.detailData;
      //const data = {token: token, ...params};
      const data = { ...user, token };
      console.log('***showInfoFromJs' + JSON.stringify(data));
      if (patral) {
        window.AndroidWebView.stopLocation();
      } else {
        CallApp({
          callAppName: 'showInfoFromJs',
          callbackName: 'getBluetoothStatus',
          param: data,
          callbackFun: (msg) => {
            if (!msg) {
              toast('开始巡逻前，请先联接蓝牙！');
              setTimeout(() => {
                window.AndroidWebView.startBluetooth(JSON.stringify({ ...user, token }));
              }, 3000);
              Ajax.post('/api/location/cancelTrace', { traceId: params.traceId });
              _this.setState({ patral: false });
            } else {
              Ajax.post('/api/location/confirmTrace', { traceId: params.traceId, macAddress: msg });
              _this.setState({ patral: true });
            }
          },
        });
        // window.AndroidWebView.showInfoFromJs(JSON.stringify(data)); // getBluetoothStatus
      }
    } else {
      console.log('调用showInfoFromJs失败！！');
    }
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
    //     // {
    // 	"taskDetailId":2, traceId
    // 	"taskType":3
    // }
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

    const requstUri = patral ? '/api/cmdMonitor/endGridSearch' : '/api/cmdMonitor/startGridSearch';
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
        //_this.startOrEndPatralForAndroid(patral, {traceId, equipmentId})
      }
    });
  }
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
  render() {
    const { patral, isShowDetail, status } = this.state;
    const stateObj = stateVal[status];
    const obj = this.state.detailData;
    return (
      <div className="round-map">
        <Header title={obj ? `${obj.taskName}` : '加载中'} pointer="pointer" />
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
                    <span>区域编号：</span>
                    <div>{obj.areaNo}</div>
                  </section>
                  <section>
                    <span>犬只：</span>
                    <div>
                      <Picker
                        data={this.state.dataArr}
                        onOk={this.pickerOk}
                        cols={1}
                        disabled={status > 0 ? true : false}
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
                  <h1>{obj.taskName}</h1>
                  <p>开始时间：{'2018.01.01'}</p>
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
                <Button
                  className={'start-btn ' + stateObj.class}
                  onClick={() => this.startOrEndPatral(patral)}
                  type="primary"
                  inline
                  size="small"
                >
                  {stateObj.name}{' '}
                </Button>
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
export default roundMAP;

// WEBPACK FOOTER //
// ./src/redux/containers/round/roundMAP/index.js
