import React,{Component} from 'react';
import { Toast, Carousel, WhiteSpace, WingBlank , Button,TextareaItem,Picker,List,Flex,Modal } from 'antd-mobile';
import { Progress } from 'components/plugins/progress';
import Reflux from 'reflux';
import { createForm } from 'rc-form';
import ReactMixin from 'react-mixin';
import moment from 'moment';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import { withRouter,Link } from "react-router-dom";
import Store from './store';
import Actions from './actions';
import Ajax from 'libs/ajax';
import { CallApp } from 'libs/util'
import Report from 'components/common/Report';
require('style/drill/drill.less');

const chuji = require('images/chuji.png');
const chujiActive = require('images/chuji-active.png');
const gaoji = require('images/gaoji.png');
const gaojiActive = require('images/gaoji-active.png');
const alert = Modal.alert;

let progress='';
class ItinerancyDetail extends Component{
  constructor(props){
    super(props);

    let info='';
    if(this.props.location.query){
      info=this.props.location.query;
    
    }else{
      let { history }  = this.props;
      history.push('/own/OwnTask');
    }
    this.state={
      itinerancyInfo:'',
   //   locationJson: '1234'
    }
    this.timer = null;
  }
  componentWillMount() {
      // Toast.loading('页面加载中...', 2,function(){}, true);
  }
  getUserLocation = () => {
    CallApp({callAppName: 'getLocationInfo', callbackName: 'sendLocationInfoToJs', callbackFun: this.showLocation})
  }
  showLocation = (msg) => {
    // Toast(msg);
    console.log(msg);
  }
  componentDidMount() {
    // this.timer = setInterval(  this.getUserLocation, 3000)
    if(this.props.history.location.query){
      Ajax.post('/api/outdoorTask/outdoorAppDetail', {
        id: this.props.history.location.query
      }, (res) => {
          if(res.code == 0){
            this.setState({
              itinerancyInfo:res.data,
            });
            const self = this;
            window.addEventListener('touchmove', function(){}, { passive: false });
                 progress = new Progress({
                el:'progress',//canvas元素id
                deg:360,//绘制角度
                timer:7200,//绘制时间
                lineWidth:9,//线宽
                lineBgColor:'#e2e2e2',//底圆颜色
                lineColor:'#3D8CE8',//动态圆颜色
                textColor:'#3D8CE8',//文本颜色
                fontSize:24,//字体大小
                circleRadius:100,//圆半径
                times:res.data.accumulateTime,
            });
            if(res.data.status==0 || res.data.status==2 || res.data.status==3){
              setTimeout(function(){progress.endTime();},1000);
            }
          }else{
              Toast.info(res.msg);
              return ;
          }
      });
    }
   
    this.getUserLocation();

    
  }
  componentWillUnmount() {
     clearInterval(this.timer);
  }
  

 
trainStartOrEnd= () => {
  const {itinerancyInfo} = this.state;
  if(itinerancyInfo.status==1){
    const alertInstance = alert('结束任务', '确定结束此任务吗?', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确定', onPress: () => this.startOrEndMethod() },
    ]);
  }else{
    this.startOrEndMethod(); 
  }

  
}
startOrEndMethod(){
  const {itinerancyInfo} = this.state;
  let action='executeTask';
  itinerancyInfo.status==1 ? action='finishTask' : action;
  Ajax.post('/api/outdoorTask/'+action, {
      id: itinerancyInfo.id,
  }, (res) => {
      if(res.code == 0){
        let newDrillInfo=itinerancyInfo;
        itinerancyInfo.status==1 ?  newDrillInfo.status=2 :newDrillInfo.status=1;
        let msg='任务开始！';
        action=='finishTask' ? msg='任务结束！' : msg;
        Toast.info(msg);
         this.setState({
           itinerancyInfo:newDrillInfo
         })
         if(newDrillInfo.status==1){
           progress.startTime();
         }else{
           progress.endTime();
         }
      }else{
          Toast.info(res.msg);
           return ;
      }
  });
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


  //终止任务改变状态
closeTask = () =>{
    this.setState({
      status:3
    })
}

 //任务开始，结束状态的改变
 updateTaskStatus = (id,status,event)=>{
    const {itinerancyInfo} = this.state;
    if(id==itinerancyInfo.planId){
      let newDrillInfo=itinerancyInfo;
      newDrillInfo.status=status;
      this.setState({
        itinerancyInfo:newDrillInfo
      })
      if(newDrillInfo.status==1){
        progress.startTime();
      }else{
        progress.endTime();
      }
    }
}

  render(){
   let taskName = '外勤任务详情';
   const { getFieldProps } = this.props.form;
  	return(
  		<div className="Drill">
        <Header title={`${taskName}`} closeTask={this.closeTask.bind(this)} updateTaskStatus={this.updateTaskStatus.bind(this)} pointer="pointer"/>
        <List style={{ backgroundColor: 'white' }} className="">
            
            <TextareaItem title="任务名称:" placeholder=""  autoHeight value={this.state.itinerancyInfo.planName}></TextareaItem> 
         
            <TextareaItem title="开始时间:" placeholder="" value={this.state.itinerancyInfo.taskTime ? moment(this.state.itinerancyInfo.taskTime).format('YYYY-MM-DD') : '--'}></TextareaItem>
          
            <TextareaItem title="人员:" placeholder="" value={this.state.itinerancyInfo.userNames}></TextareaItem>
            <TextareaItem title="勤务说明:" placeholder=""  autoHeight  value={this.state.itinerancyInfo.content}></TextareaItem>
         </List>
  			<div className="proContainer">
        <span className="tip-text">&nbsp;&nbsp;计时</span>
  				<canvas id="progress"></canvas>
        {/* <span className="target">目标02:00:00</span>*/} 
  			</div>
       
        <div className="handle">
        <Flex justify="center">
          
            {this.state.itinerancyInfo.status >= 2 ? 
              <Report
                id={this.state.itinerancyInfo.planId}
                type={6}
              />
            :
            <div>
              {/*this.state.itinerancyInfo.status==0 ?
                <Button type="primary" className="common-btn"   onClick={this.trainStartOrEnd} inline size="small">开始任务</Button> : null
              }
              {this.state.itinerancyInfo.status==1 ?
                <Button type="primary" className="common-btn"   onClick={this.trainStartOrEnd} inline size="small">结束任务</Button>:null
            
              */}
              {this.state.itinerancyInfo.status==2 ?
                <Button className="end common-btn"   inline >完成</Button> : null
              }
            </div>
          }
          
            &nbsp;&nbsp;&nbsp;
            {/* <Button className="common-btn" onClick={this.startK9IM}  type="primary" inline size="small">发起群聊</Button> */}

     
        </Flex>
        {/*  <p>今日步数{this.state.locationJson}</p>*/}
        </div>
      
  		</div>
  	)
  }
}

export default createForm()(withRouter(ItinerancyDetail));














// WEBPACK FOOTER //
// ./src/components/own/OwnTask/Itinerancy/itinerancydetail/ItinerancyDetail.js