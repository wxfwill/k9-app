import React,{Component} from 'react';
import Reflux from 'reflux';
import { Button, message ,Card,Tag,InputItem} from 'antd-mobile';
import Header from 'components/common/Header';
import { tMap } from 'components/common/map';
import Ajax from 'libs/ajax';
import { CallApp, toast } from 'libs/util'

require('style/publish/common.less');
const ownPic = require('images/own.gif');
const othersPic = require('images/others.png');

class PubRoundMap extends Component{
	constructor(props){
	    super(props);
	    this.state = {
	      ownLatlng: { lat:22.543099, lng:114.057868 },
	      patral: false,
	      coordMsg:null,
	      pointer: null,
	      drawShapeDTO:null,
	      disabled: false,
	    };
	 //   this.BDMap = null;
	    this.TMap = null;
	    this.images = {
	      ownPic:ownPic,
	      othersPic:othersPic
	    };
	}
	getUserLocation = () => {
	    const _this = this;
	    CallApp({callAppName: 'getLocationInfo', callbackName: 'sendLocationInfoToJs', callbackFun: _this.showLocation})
	}
	showLocation = (msg) => {
		if(this.props.pointer)
	    var _this = this;
	    let point =  JSON.parse(msg);
	    let latlng = {lat: point.latitude, lng: point.longitude}
	    //判断是否有marker
	    _this.TMap.rPanTo(latlng);
	    _this.TMap.setSelfMark(_this.images, latlng)
  	}
	onConfirm(){
		let _this = this;
		if(_this.TMap.markerArray.length > 0){
			let pointer = _this.TMap.markerArray[0].position;
			_this.setState({
				pointer: pointer
			})
			_this.TMap.resolveLatLng(pointer, function (address) {
		        _this.props.onMapData({ address: address, pointer: pointer });
		    });
		    this.props.onCancel();
		}else{
			toast("请选择集合点！");
		}
	}
	handleShow(){
		this.props.onCancel();
	}
	componentDidMount() {
		let options = {
	      	labelText:'',
	    }
		this.TMap= new tMap(options);
		//const myPoint = '';
		//this.TMap.setSelfMark(this.images, myPoint)
     	
     	this.TMap.getLabelContent();
     	this.getUserLocation();

     	if(!this.props.disabled){
     		this.TMap.createSingleMaker();
     	}
     	if(this.props.initPointer){
			this.TMap.initMarker(this.props.initPointer)
			//定位到指定区域
			this.TMap.map.fitBounds(new qq.maps.LatLngBounds(this.props.initPointer));
     	}
     	this.setState({
     		disabled: this.props.disabled
     	})
	}
	//地点搜索
	onSearch =(value)=>{
		this.TMap.searchService().search(value);
		}
	render(){
	    const {patral , disabled} = this.state;
	   // const { taskName } = this.props.history.location.query;
	    const  taskName  = "";
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
				            <section>
				            	{
				            		!disabled ?
				            		<Button className="common-btn"   type="primary" inline size="small" style={{background: '#2db7f5',color: '#fff',border:'#2db7f5'}} >
				            			<span onClick={this.onConfirm.bind(this)}>确 认</span>
				            		</Button>
				            		: null
				            	}
				                
			                    <Button className="common-btn"   type="primary" inline size="small" style={{background: 'red',color: '#fff',border:'red'}} ><span onClick={this.handleShow.bind(this)}>取 消</span></Button>
				            </section>
			            </div>
		          	</div>
		        </div>
	  		</div>
		)
	}
}
export default PubRoundMap;


// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubAggregate/PubAggMap.js