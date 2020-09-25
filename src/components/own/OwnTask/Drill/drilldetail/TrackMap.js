import React,{Component} from 'react';
import { Button, message, Picker, List, Icon } from 'antd-mobile';
import Header from 'components/common/Header';
import { tMap } from 'components/common/map';
import Ajax from 'libs/ajax';
import moment from 'moment';
import { CallApp, toast } from 'libs/util'

//import { BDMap  } from './BMap'

require('style/round/roundMap.less');
const othersPic = require('images/own.gif');
const ownPic = require('images/others.png');
const stateVal = [
      {
        state: 0,
        class: 'start',
        name: '开始任务'
      },
      {
        state: 1,
        class: 'going',
        name: '停止任务'
      },
      {
        state: 2,
        class: 'stop',
        name: '已经结束'
      }
    ]
class OwnEmDepMAP extends Component{
  constructor(props){
    super(props);
    this.state = {
      ownLatlng: { lat:22.543099, lng:114.057868 },
      patral: false,
      isShowDetail: true,
      pageSize: 100,
      currPage: 1,
      status: 0,
      detailData: null,
      disabled: false,
      roundInforClass: 'rhide',
      onlyRead: false,
      subjectName: '加载中'
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
      ownPic:ownPic,
      othersPic:othersPic
    };
    this.referencePoint = 0;
    this.timer = null;
    this.timer2 = null;
    this.aftLine = [];
    this.preLine = [];
  }
  componentDidMount() {
    let options = {
      lat: 22.53103578227407,
      lng: 113.95115796895573,
      labelText: ''
    }
    this.TMap = new tMap(options);
    if(this.props.history.location.query && !this.props.history.location.query.onlyread) { // 绘制目标点和区域
      
      const taskId = this.props.history.location.query;
      this.getDetail(taskId, (data) => {
        this.setState({
          detailData: data,
          subjectName: data.subjectName
        })
        console.log(data)
        const { status } = data;

        if(status == 1){
          this.timer = setInterval(this.getTrackPoints, 8000); // 绘制路径
          this.timer2 = setInterval(this.getUserLocation,4000) // 获取用户的app位置信息
        }
        if(status != 0){
          this.getHistoryPoints(1);
          this.setState({
            disabled: true
          })
        }
        this.setState({
          patral: status==0||status==2? false: true,
          status: status,
          isShowDetail: status != 0 ? false : true
        })
        this.getUserLocation();
      });
    }else{
      this.requestTrochoidCompare((result) => {
        let aftArr = result.aft.pathsHis;
        let preArr = result.pre.pathsHis;
        let aftName = result.aft.userName;
        let preName = result.pre.userName;
        let aftArrStart = aftArr[0][0];
        let preArrStart = preArr[0][0];
        
        aftArr.map((item) => {
          if(item.length < 1){
            return false;
          }
          item = [...item,...item]
          this.aftLine.push(this.TMap.TrackPoints(item, '#15c619'));
        })
        preArr.map((item) => {
          if(item.length < 1){
            return false;
          }
          item = [...item,...item]
          this.preLine.push(this.TMap.TrackPoints(item, '#df5d5b'));
        })
        this.setState({
          aftName: aftName,
          preName: preName,
          subjectName: '轨迹分析',
          onlyRead: true
        })
      })
    }
  }
  lineClick = (param) =>{
    let lineArr1 = this.aftLine;
    let lineArr2 = this.preLine;
    if(param == 'pre'){
      lineArr1 = this.preLine;
      lineArr2 = this.aftLine;
    }
    lineArr1.map((item) => {
      item.setStrokeWeight(10);
      item.setZIndex(1001);
    })
    lineArr2.map((item) => {
      item.setStrokeWeight(5);
      item.setZIndex(1000);
    })
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
    this.setState = (state,callback)=>{
      return;
    };
  }
  requestTrochoidCompare(fn){
    let id = this.props.history.location.query.id;
    Ajax.post('/api/train/trochoidCompare', {id: id}, (result) => {
      if(result.code == 0) {
        fn(result.data)
      }
    })
  }
  getUserLocation = () => {
    const _this = this;
    CallApp({callAppName: 'getLocationInfo', callbackName: 'sendLocationInfoToJs', callbackFun: _this.showLocation})
  }
  showLocation = (msg) => {
    var _this = this;
    let point =  JSON.parse(msg);
    let latlng = {lat: point.latitude, lng: point.longitude}
    //判断是否有marker
    if(!_this.mapMark){
      _this.mapMark = _this.TMap.setSelfMark(_this.images, latlng);
    }else{
      _this.TMap.setSelfMark(_this.images, latlng, _this.mapMark)
    }
    if(_this.isFirst){
      if(_this.TMap.isContains(this.polyline, latlng)){
        return ;
      }
      _this.isFirst = false;
      //等获取手机定位后再画线
      //_this.TMap.drivingService(latlng, _this.referencePoint) // 行车路线 
      _this.TMap.rPanTo(latlng);
      _this.TMap.Polyline([latlng, _this.referencePoint], {strokeDashStyle: 'dash'}) // 直
    }
    
  }
  getDetail = (taskId, fn) => {
    Ajax.post('/api/train/tracerTrochoidTask', {id: taskId}, (result) => {
      if(result.code == '0') {
        fn(result.data)
      }
    })
  }
  getTrackPoints = () => { // 获取用户轨迹数据
    const _this = this;
    const taskDetailId = _this.state.detailData.id;
    const taskType = 5;
    const {pageSize, currPage} = _this.state;
    const lastPointTime = _this.lastPointTime;
    Ajax.post('/api/cmdMonitor/showAppTrochoid', {taskDetailId, taskType, lastPointTime}, (data) => {
      if(data.code == '0') {
        const path = data.data.pathsCurr;
        _this.lastPointTime = data.data.lastPointTime ? data.data.lastPointTime : _this.lastPointTime;

        if(path && path.length > 0) {
           //this.TMap.clearOverlay();
          path.map((item) => {
            if(item.length < 1){
              return false;
            }
            _this.TMap.TrackPoints(item);
          })
          
        }
      }
    })
  }
  getHistoryPoints(currPage) {
    const _this = this;
    const query = _this.state.detailData;
    const {taskDetailId, taskType} = query;
    const {pageSize} = _this.state;

    Ajax.post('/api/cmdMonitor/showAppTrochoidHis', {taskDetailId, taskType}, (data) => {
      if(data.code == '0') {
        let hisPaths = data.data.pathsHis;
        if(hisPaths && hisPaths.length > 0) {
          hisPaths.forEach((item) => {
            if(item.length < 1){
              return false;
            }
            _this.TMap.TrackPoints(item);
          });
        }
      }
    })
  }
  startOrEndPatral(patral) {
    const _this = this;
    let { status} = _this.state;
    if(status > 1){
      return ;
    }
    let sendData = {id: _this.state.detailData.id}
    //判断是否第一次点击
    if(!patral){
      _this.setState({isShowDetail: false});
    }
    
    const requstUri = patral ? '/api/train/endTraceTask':'/api/train/startTraceTask';
    Ajax.post(requstUri,sendData,(data) => {
     if(data.code == '0') {
      const traceId = data.data.id;
      const equipmentId = data.data.equipmentId || '';
      _this.setState({
        patral: !patral,
        status: patral ? 2 : 1
      });
      if(patral){
        clearInterval(_this.timer);
        clearInterval(_this.timer2);
      }else{
        _this.timer2 = setInterval(_this.getUserLocation,4000); //
        _this.timer = setInterval(_this.getTrackPoints, 8000); // 绘制路径
      }
      
     };
    });
  }
  showDetail = (isShowDetail) => {
    this.setState({
      isShowDetail: !isShowDetail
    })
  }
  render(){
    const {patral, isShowDetail, subjectName, status, onlyRead, aftName, preName} = this.state;
    const stateObj = stateVal[status];
    const obj = this.state.detailData;
  	return(
  		<div className="round-map">
        <Header title={subjectName} pointer="pointer"/>
        <div id="container" className="container">
        	{ obj ?
          	<div className="roundPanel">
            	<div className="content">
	              	<div className="iconDiv" onClick={() => this.showDetail(isShowDetail)}>
	                	<Icon color="#666666" type={ isShowDetail ? 'down' : 'up'} />
	              	</div>
	              	<div className={ isShowDetail ? 'round-infor':'round-infor rhide'}>
		                <section>
		                  	<span>任务内容：</span>
		                  	<div>{`${obj.trainRemark}`}</div>
		                </section>
	              	</div>
	              	<section style={{display:'none'}}>
		                <span>
		                  	<em className='timer-icon'></em>
		                  	00:23
		                </span>
		                <span>
		                  	<em className="second-icon"></em>
		                  	00'00''
		                </span>
		                <span>
		                  	<em className="footer-icon"></em>
		                  	0
		                </span>
	              	</section>
	              	<Button className={"start-btn "+stateObj.class} onClick={() => this.startOrEndPatral(patral)}  type="primary" inline size="small">{ stateObj.name } </Button>
	            </div>
          	</div>
          	: null
          }
          {
            onlyRead ?
            <div className="roundPanel">
              <div className="content">
                <div className="people-line">
                    <span>{aftName}：</span>
                    <div onClick={() => this.lineClick('aft')}></div>
                </div>
                <div className="people-line prename-line">
                    <span>{preName}：</span>
                    <div onClick={() => this.lineClick('pre')}></div>
                </div>
              </div>
            </div>
            :
            null
          }
        </div>
  		</div>
  	)
  }
}
export default OwnEmDepMAP;



// WEBPACK FOOTER //
// ./src/components/own/OwnTask/Drill/drilldetail/TrackMap.js