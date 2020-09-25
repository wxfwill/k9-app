import React,{Component} from 'react';
import Reflux from 'reflux';
import { Button, message ,Card,Tag,InputItem,Icon} from 'antd-mobile';
import ReactMixin from 'react-mixin';
import Header from 'components/common/Header';
import { tMap } from 'components/common/map';
import Ajax from 'libs/ajax';
import { CallApp, toast } from 'libs/util'


require('style/publish/common.less');
const ownPic = require('images/own.gif');
const othersPic = require('images/others.png');
class PubTrainingMap extends Component{
  constructor(props){
    super(props);
    this.state = {
      ownLatlng: { lat:22.543099, lng:114.057868 },
      patral: false,
      pageSize: 100,
      currPage: 1,
      loading:true,
      coordMsg:null,
      drawShapeDTO:null,
    };
 
    this.TMap = null;
    this.images = {
      ownPic:ownPic,
      othersPic:othersPic
    };
 
    this.timer2 = null;
  }
  componentDidMount() {
    
    let options = {
      labelText:'',
    }
    this.TMap= new tMap(options);
    
    const myPoint = '';
 
   

  
   this.timer2 = setInterval(this.getUserLocation,4000) // 获取用户的app位置信息
     this.TMap.setSelfMark(this.images, myPoint)
     if(!this.props.trainInfo || this.props.trainInfo.saveStatus==0){
        this.TMap.createMakers();
      }
     this.TMap.getLabelContent();
  

  
    
    let path=[];
    if(this.props.trainInfo && this.props.trainInfo.drawShapeDTO!==''){
      this.props.trainInfo.drawShapeDTO.latLngArr.map((item) => {
        path.push(new qq.maps.LatLng(item.lat, item.lng))
      });
    }
    
    if(this.props.trainInfo){
      let polygon=this.TMap.setPolygon(path);
      //定位到指定区域
      this.TMap.map.fitBounds(polygon.getBounds());
    }
    
  }
  componentWillUnmount() {
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
 

  onConfirm(){
    if(this.TMap.isClose){
      let path=[];
      for(let i=0;i<this.TMap.markerArray.length;i++){
        path.push(this.TMap.markerArray[i].position);
      }
      console.log(this.TMap.setPolygon(path));
      let drawShapeDTO = {
          drawShapeType: 'polygon',
          isClose:this.TMap.isClose,
          latLngArr:path, //坐标
          coord: this.TMap.setPolygon(path).getBounds().getCenter() 
      };
      //通过中心坐标获取地理位置
      let _this=this;
      let address = this.TMap.resolveLatLng(drawShapeDTO.coord, function (address) {
        _this.props.onMapData({ location: address, drawShapeDTO: drawShapeDTO });
      });
      this.props.onCancel();
    }else{
      toast("请选择目标区域！");
    }
   
	}

  
  handleReset(){
    this.TMap.isClose=false;
    this.TMap.clearOverlays();
    this.TMap.createMakers();
  }
 
  handleShow= () => {
//   this.TMap.clearOverlay();
    this.props.onCancel();
  }
  handleClose =() =>{
    if(this.TMap.markerArray.length>2){
      this.TMap.Polyline([this.TMap.markerArray[0].position,this.TMap.markerArray[this.TMap.markerArray.length-1].position], {strokeDashStyle: 'solid'});
      this.TMap.markerArray[this.TMap.markerArray.length-2].setMap(null);
      this.TMap.markerArray[this.TMap.markerArray.length-1].setMap(null);
      this.TMap.isClose=true;
      //区域添加覆盖物
      let path=[];
      for(let i=0;i<this.TMap.markerArray.length;i++){
        path.push(this.TMap.markerArray[i].position);
      }
      this.TMap.setPolygon(path);
    }else{
      toast("请选择至少3个点！");
    }
  }
   //地点搜索
   onSearch =(value)=>{
    this.TMap.searchService().search(value);
    }
  render(){
    const {patral} = this.state;
    const  trainName  = "";
  	return(
  		<div className="map">
        <div id="container" className="container" style={{top:0,zIndex:1000}}>
          <div className="mapPanel" >
            <div className="content" >
            <section>
                  <InputItem
                  className="ant-input"
                  placeholder="地点搜索"
                  onVirtualKeyboardConfirm={value=>this.onSearch(value)}
                  onChange={value=>this.onSearch(value)}
                  clear
                    ></InputItem>
                 {/*    <div style={{ height: '22px', width: '22px',marginRight:12,marginTop:8 }}><span onClick={this.onConfirm.bind(this)}><Tag style={{background: '#2db7f5',color: '#fff'}} ><Icon type="search" size='md' /></Tag></span></div>*/}
                </section>
              {this.props.trainInfo && this.props.trainInfo.saveStatus==1 ? 
                <section>
                <span  onClick={this.handleShow.bind(this)}><Button className="common-btn"   type="primary" inline size="small"  style={{background: 'red',color: '#fff',border:'red'}} >取 消</Button></span>
              </section>:   
            
               
                <section>
                      <span onClick={this.handleReset.bind(this)}><Button className="common-btn"   type="primary" inline size="small"  style={{background: '#f50',color: '#fff',border:'#f50'}} >重绘</Button></span>
                      <span onClick={this.onConfirm.bind(this)}><Button className="common-btn"   type="primary" inline size="small"  style={{background: '#2db7f5',color: '#fff',border:'#2db7f5'}} >确 认</Button></span>
                      <span onClick={this.handleClose.bind(this)}><Button className="common-btn"   type="primary" inline size="small"  style={{background: '#2db7f5',color: '#fff',border:'#2db7f5'}} >闭 合</Button></span>
                      <span  onClick={this.handleShow.bind(this)}><Button className="common-btn"   type="primary" inline size="small"  style={{background: 'red',color: '#fff',border:'red'}} >取 消</Button></span>
                </section>}
            </div>
          </div>
        </div>
  		</div>
  	)
  }
}
export default PubTrainingMap;














// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubTraining/PubTrainingMap.js