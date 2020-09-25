import React,{Component} from 'react';
import Reflux from 'reflux';
import { Button, message ,Card,Tag,InputItem} from 'antd-mobile';
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
    	disabled: false,
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
    
    //const myPoint = '';
    //this.TMap.setSelfMark(this.images, myPoint)
    this.getUserLocation();
    if(!this.props.trainInfo || this.props.trainInfo.saveStatus==0){
        this.TMap.createMakers(2);
    }
    this.TMap.getLabelContent();
  
	let {pubEmedepInfo, disabled}=this.props;
    if(this.props.pubEmedepInfo && this.props.pubEmedepInfo.drawShapeDTO!==''){
    let circle = this.TMap.setCircle(pubEmedepInfo.drawShapeDTO.coord,pubEmedepInfo.drawShapeDTO.bdRadius);
      //定位到指定区域
      this.TMap.map.fitBounds(circle.getBounds());
    	this.TMap.rPanTo({
    		lat: pubEmedepInfo.drawShapeDTO.coord.lat,
    		lng: pubEmedepInfo.drawShapeDTO.coord.lng
    	});
    	this.setState({
    		disabled: disabled
    	})
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
	  let len = this.TMap.getDistance(this.TMap.markerArray[0].position,this.TMap.markerArray[1].position);
	  let circle=this.TMap.setCircle(this.TMap.markerArray[0].position,len);
      let drawShapeDTO = {
          drawShapeType: 'circle',
          isClose:this.TMap.isClose,
		  latLngArr:'', //坐标
		  coord:this.TMap.markerArray[0].position,
		  radius: len,
		  bdRadius:len,
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
    this.TMap.createMakers(2);
  }
 
  handleShow= () => {
//   this.TMap.clearOverlay();
    this.props.onCancel();
  }
  handleClose =() =>{
    if(this.TMap.markerArray.length==2){
		let len = this.TMap.getDistance(this.TMap.markerArray[0].position,this.TMap.markerArray[1].position);
		this.TMap.setCircle(this.TMap.markerArray[0].position,len);
		this.TMap.markerArray[this.TMap.markerArray.length-1].setMap(null);
		this.TMap.markerArray[this.TMap.markerArray.length-2].setMap(null);
		this.TMap.isClose=true;
    }else{
      toast("区域只能通过两点来确定！");
    }
  }

  //地点搜索
  onSearch =(value)=>{
    this.TMap.searchService().search(value);
    }
  render(){
  	const { disabled } = this.state;
  	return(
  		<div className="map">
        <div id="container" className="container">
          <div className="mapPanel" >
            <div className="content" >
            <section>
                  <InputItem
                  placeholder="地点搜索"
                  className="ant-input"
                  onVirtualKeyboardConfirm={value=>this.onSearch(value)}
                  onChange={value=>this.onSearch(value)}
                  clear
                    ></InputItem>
                </section>
              {disabled ? 
                <section>
                <span  onClick={this.handleShow.bind(this)}><Button className="common-btn"   type="primary" inline size="small" style={{background: 'red',color: '#fff',border:'red'}} >取 消</Button></span>
              </section>:  
          
                 
              <section>
                     <span onClick={this.handleReset.bind(this)}><Button className="common-btn"   type="primary" inline size="small" style={{background: '#f50',color: '#fff',border:'#f50'}} >重绘</Button></span>
                    <span onClick={this.onConfirm.bind(this)}><Button className="common-btn"   type="primary" inline size="small" style={{background: '#2db7f5',color: '#fff',border:'#2db7f5'}} >确 认</Button></span>
                    <span onClick={this.handleClose.bind(this)}><Button className="common-btn"   type="primary" inline size="small" style={{background: '#2db7f5',color: '#fff',border:'#2db7f5'}} >闭 合</Button></span>
                    <span  onClick={this.handleShow.bind(this)}><Button className="common-btn"   type="primary" inline size="small" style={{background: 'red',color: '#fff',border:'red'}} >取 消</Button></span>
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
// ./src/redux/containers/publish/PubEmedep/PubEmedepMap.js