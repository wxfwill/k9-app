import React,{Component} from 'react';
import { Button, message, Picker, List, Icon,Flex } from 'antd-mobile';
import Header from 'components/common/Header';
import { tMap } from 'containers/round/roundMap/map';
import Ajax from 'libs/ajax';
import moment from 'moment';
import { CallApp, toast } from 'libs/util'
import Report from 'components/common/Report';
//import { BDMap  } from './BMap'

require('style/round/roundMap.less');
const othersPic = require('images/own.gif');
const ownPic = require('images/others.png');

const reportState = ['上报', '上报详情']

class OwnEmDepMAP extends Component{
  constructor(props){
    super(props);
    this.state = {
      ownLatlng: { lat:22.543099, lng:114.057868 },
      patral: false,
      isShowDetail: true,
      pageSize: 100,
      currPage: 1,
      detailData: null,
      isShowReport: 0, 
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
    this.startPoint = 0;
    this.referencePoint = 0;
    this.location="";
    this.timer = null;
    this.timer2 = null;
  }
  componentDidMount() {
    if(this.props.history.location.query) { // 绘制目标点和区域
      const taskId = this.props.history.location.query;
      this.getDetail(taskId, (data) => {
        this.setState({
          detailData: data
        })
        console.log(data)
        let referencePoint = {
        	lat: data.lat,
        	lng: data.lng
        }
        let options = {
          lat: 22.53103578227407,
          lng: 113.95115796895573
        }
        let location=data.location;
        if(referencePoint) {
            if(referencePoint.lat){
              options = Object.assign(options, referencePoint);
            }
            
            this.TMap = new tMap(options);
           	//设置目标marker
           referencePoint && this.TMap.seteDestinationMark(this.images, [referencePoint]);
          this.referencePoint = referencePoint;
          this.location=location;
        }
        this.getUserLocation();
      });

    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
    this.setState = (state,callback)=>{
      return;
    };
  }

  getUserLocation = () => {
    const _this = this;
    CallApp({callAppName: 'getLocationInfo', callbackName: 'sendLocationInfoToJs', callbackFun: _this.showLocation})
  }
  showLocation = (msg) => {
    var _this = this;
    let point =  JSON.parse(msg);
    let latlng = {lat: point.latitude, lng: point.longitude}
    _this.startPoint = latlng;
    //判断是否有marker
    if(!_this.mapMark){
      _this.mapMark = _this.TMap.setSelfMark(_this.images, latlng);
    }else{
      _this.TMap.setSelfMark(_this.images, latlng, _this.mapMark)
    }
    if(_this.isFirst){
      _this.isFirst = false;
      //等获取手机定位后再画线
      //_this.TMap.drivingService(latlng, _this.referencePoint) // 行车路线 
      _this.TMap.rPanTo(latlng);
      _this.TMap.Polyline([latlng, _this.referencePoint], {strokeDashStyle: 'dash'}) // 直
    }
  }

  showGPS = (msg) => {
    console.log("导航成功！");
  }
  getDrivingService = () => {
    const _this = this;
    CallApp({callAppName: 'startNativeNavigation',param:{"lat":this.referencePoint.lat,"lng":this.referencePoint.lng,address:this.location}, callbackName: 'sendLocationInfoToJs', callbackFun: _this.showGPS})

  }
  startK9IM = () => {
    const _this = this;
    CallApp({callAppName: 'startK9IM',param:{}, callbackName: 'sendLocationInfoToJs'})

  }
  getDetail = (taskId, fn) => {
    Ajax.post('/api/cmdMonitor/assembleTaskAppDetail', {id: taskId}, (result) => {
      if(result.code == '0') {
        fn(result.data)
      }
    })
  }
  getTrackPoints = () => { // 获取用户轨迹数据
    const _this = this;
    const query = _this.state.detailData;
    const {taskDetailId, taskType} = query;
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
            //this.TMap.setSelfMark(this.images, item[item.length-1], _this.mapMark)
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

    const query = _this.state.detailData;
    let sendData = {id: query.taskDetailId, taskType: query.taskType}

    //判断是否第一次点击
    if(!patral){
      _this.setState({isShowDetail: false});
    }
    
    const requstUri = patral ? '/api/cmdMonitor/endEmergency':'/api/cmdMonitor/startEmergency';
    Ajax.post(requstUri,sendData,(data) => {
     if(data.code == '0') {
      const traceId = data.data.id;
      const equipmentId = data.data.equipmentId || '';
      _this.setState({
        patral: !patral
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
  pickerChange = (value) => {
    this.setState({
      value: value
    })
  }
  pickerOk = (value) => {
    this.setState({
      value: value
    })
  }
  render(){
    const {patral, isShowDetail, isShowReport} = this.state;
    const obj = this.state.detailData;
  	return(
  		<div className="round-map">
        {
          isShowReport > 1 ?
          <Header
            title={obj ? '定点集合详情' : '加载中'}
            pointer="pointer"
            isSet={reportState[isShowReport]}
          />
          :
          <Header title={obj ? '定点集合详情' : '加载中'} pointer="pointer"/>
        }
        <div id="container" className="container">
        	{ obj ?
          	<div className="roundPanel">
            	<div className="content">
	              	<div className="iconDiv" onClick={() => this.showDetail(isShowDetail)}>
	                	<Icon color="#666666" type={ isShowDetail ? 'down' : 'up'} />
	              	</div>
	              	<div className={ isShowDetail ? 'round-infor':'round-infor rhide'}>
	                	<section>
	                  		<span>任务名称：</span>
	                  		<div>{obj.taskName}</div>
	                	</section>
	                    <section>
	                        <span>集合地点：</span>
	                        <div>{obj.location}</div>
	                    </section>
	                	<section>
	                  		<span>集合时间：</span>
	                  		<div>{obj.assembleTime ? moment(obj.assembleTime).format('YYYY-MM-DD HH:mm') : '----'}</div>
	                	</section>
	              	</div>
	              	<header>
		         
		                <p>
                      开始时间：{obj.assembleTime ? moment(obj.assembleTime).format('YYYY-MM-DD HH:mm') : '----'}
                      {
                        status > 0 ?
                        <Report
                          id={obj.taskId}
                          type={5}
                        />
                        :null
                      }
                    </p>
	              	</header>
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
                  <Flex justify="center">
                  <Button className="common-btn" onClick={() => this.getDrivingService()}  type="primary" inline size="small">导航</Button>
                  </Flex> 
	            </div>
          	</div>
          	: <div></div>}
        </div>
  		</div>
  	)
  }
}
export default OwnEmDepMAP;



// WEBPACK FOOTER //
// ./src/components/own/OwnTask/AggregatePoint/AggPointMap.js