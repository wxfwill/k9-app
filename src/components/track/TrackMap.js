import React,{Component} from 'react';
import Reflux from 'reflux';
import { Button, message } from 'antd-mobile';
import ReactMixin from 'react-mixin';
import Header from 'components/common/Header';
import { tMap } from 'components/common/map';
import Ajax from 'libs/ajax';
import { CallApp, toast } from 'libs/util'

//import { BDMap  } from './BMap'

require('style/round/roundMap.less');
const ownPic = require('images/own.gif');
const othersPic = require('images/others.png');
class TrackMap extends Component{
  constructor(props){
    super(props);
    this.state = {
      ownLatlng: { lat:22.543099, lng:114.057868 },
      patral: false,
      pageSize: 100,
      currPage: 1,
      trackList:[],
    };
 //   this.BDMap = null;
    this.TMap = null;
    this.trackList = [];
    this.images = {
      ownPic:ownPic,
      othersPic:othersPic
    };
    this.otherLatlng=[{
      lat:22.556099,
      lng:114.057868
    },{
      lat:22.569099,
      lng:114.057868
    },{
      lat:22.570099,
      lng:114.057868
    },{
      lat:22.589099,
      lng:114.067868
    }];
    this.timer = null;
    this.timer2 = null;
  }
  componentDidMount() {
    
    let options = {
      labelText:'我的位置',
    }
    this.TMap= new tMap(options);
    const myPoint = {lat:"22.53103578227407", lng:"113.95115796895573"};
 
    this.getHistoryPoints(1);
   console.log(this.props.history.query);
    if(this.props.history.location.query) { // 绘制目标点和区域
      const {area, referencePoint, status} = this.props.history.location.query;

      if(area) {
         this.TMap.targetArea(area.a, area.b, area.c, area.d);

        referencePoint && this.TMap.seteDestinationMark(this.images, [referencePoint]);
        this.TMap.drivingService(myPoint, referencePoint) // 行车路线 
        this.TMap.Polyline([myPoint, referencePoint], {strokeDashStyle: 'dash'}) // 直线
      }
      this.setState({patral: status==0||status==2? false: true})
    }
    
   this.timer2 = setInterval(this.getUserLocation,4000) // 获取用户的app位置信息
     this.TMap.setSelfMark(this.images, myPoint)
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
  }

  getUserLocation = () => {
    CallApp({callAppName: 'getLocationInfo', callbackName: 'sendLocationInfoToJs', callbackFun: this.showLocation})
  }
  showLocation = (msg) => {
    console.log(msg)
    const point =  JSON.parse(msg);
      this.TMap.setSelfMark(this.images, {lat: point.latitude, lng: point.longitude})
  }
 
  getHistoryPoints = (currPage) => {
    const query = this.props.history.location.query;
    const {userId,endTime,startTime} = query;
    const {pageSize} = this.state;
    Ajax.post('/api/cmdMonitor/qryTrochoid', {userId, pageSize, currPage, startTime,endTime}, (data) => {
      if(data.code == '0') {
        const hisPaths = data.data.pathsCurr;
        if(hisPaths && hisPaths.length > 0) {
          hisPaths.forEach((item,index) => {
            this.codeLatLng(item[0],'start',index);
            this.TMap.TrackPoints(item);
            this.codeLatLng(item[item.length-1],'end',index);
          });
        }
      }
    })
  }
  
  
 //反地址解析
 codeLatLng = (latLng,flag,index)=> {
     var _this=this;
    var   geocoder = new qq.maps.Geocoder({
        complete:function(result){
            let address = result.detail.address
            console.log(result);
            if(_this.trackList && _this.trackList.length > 0) {
                let isAdd=false;
                _this.trackList.forEach((item) => {
                    if(item.index==index && flag=='end'){
                        item.end=address;
                        isAdd = true;
                    }else if(item.index==index && flag=='start'){
                        item.start=address;
                        isAdd = true;
                    }
                  });
                if(!isAdd){
                    if(flag=='start'){
                        _this.trackList.push({
                            "start":address,
                            "end":'',
                            "index":index,
                        })
                    }else{
                        _this.trackList.push({
                            "start":'',
                            "end":address,
                            "index":index,
                        })
                    }
                }
              }else{
                if(flag=='start'){
                    _this.trackList.push({
                        "start":address,
                        "end":'',
                        "index":index,
                    })
                }else{
                    _this.trackList.push({
                        "start":'',
                        "end":address,
                        "index":index,
                    })
                }
              }
              _this.setState({trackList:_this.trackList});
        }
       
    });
    var coord=new qq.maps.LatLng(latLng.lat, latLng.lng);
    geocoder.getAddress(coord);
}


  render(){
    const {patral} = this.state;
   // const { taskName } = this.props.history.location.query;
    const  taskName  = "轨迹详情";
  	return(
  		<div className="round-map">
        <Header title={`${taskName}`} pointer="pointer"/>
        <div id="container" className="container">
          <div className="roundPanel" style={{height:'1rem'}}>
            <div className="content" style={{overflow: 'auto'}}>
              <header>
                <h1 style={{marginTop:'12px'}}>轨迹路线</h1>
              </header>
              {this.state.trackList.length>0 ?this.state.trackList.map((item,index)=>{
                return(
                    <section style={{ marginTop:'.1rem'}}>
                        <span>
                        {item.start}
                        </span>
                        <span>
                        -
                        </span>
                        <span>
                        {item.end}
                        </span>
                </section>
                )}):<section style={{ marginTop:'.1rem'}}>
                        <span>
                          暂无数据
                        </span>
                </section>
            }
              
              
            </div>
          </div>
        </div>
  		</div>
  	)
  }
}
export default TrackMap;














// WEBPACK FOOTER //
// ./src/components/track/TrackMap.js