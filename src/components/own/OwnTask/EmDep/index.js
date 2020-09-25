import React,{Component} from 'react';
import { List , Picker ,DatePicker,TextareaItem ,InputItem,Stepper,WhiteSpace, WingBlank,Button,Toast} from 'antd-mobile';
import Reflux from 'reflux';
import { createForm } from 'rc-form';
import ReactMixin from 'react-mixin';
import Store from './store';
import Actions from './actions';
import { withRouter,Link } from "react-router-dom";
import moment from 'moment';
require('style/own/ownLevel.less');

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class OwnEmergencyComponent extends Component{
  constructor(props){
  	super(props);
    this.state={
      date:now,
      hasError: false,
      value: '',
      val: 1,
    }
    this.timer = null;
  }
  handleChange(type,date){
    this.setState({
      [type]:date
    })
  }
  handleOk(){

  }
  onChange(type,data){
   let handle = this.handleRes()[type];
   typeof handle!=='undefined'&&handle();
  }
  render(){
  	return(
  		<div className="OwnEmergency" >
        <List style={{ backgroundColor: 'white' }} className="date-picker-list">
            <DatePicker
              mode="date"
              title="选择日期"
              value={this.state.date}
              onOk={this.handleOk.bind(this)}
              onChange={this.handleChange.bind(this,'start')}
            >
              <List.Item arrow="horizontal">时间</List.Item>
            </DatePicker>
         </List>
  		</div>
  	)
  }
}
ReactMixin.onClass(OwnEmergencyComponent,Reflux.listenTo(Store, 'onChange'));
const OwnEmergency = createForm()(OwnEmergencyComponent);
export default withRouter(OwnEmergency);











