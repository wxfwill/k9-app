
import React,{Component} from 'react';
import {Tabs, WhiteSpace,List,WingBlank,TextareaItem,Toast} from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import Reflux from 'reflux';
import { createForm } from 'rc-form';
import ReactMixin from 'react-mixin';
import Header from 'components/common/Header';
import { withRouter,Link } from "react-router-dom";
import moment from 'moment';
import classnames from 'classnames';
import Ajax from 'libs/ajax';
import Calendar from 'components/common/Calendar';


const Item = List.Item;
const Brief = Item.Brief;
const year = moment(new Date()).format("YYYY");
const month = moment(new Date()).format("MM")
require('style/own/calendar.less')
class DutyComponent extends Component{
  constructor(props){
    super(props);
    this.calendar = null;
    this.state={
      tabIndex:0,
      recentStr:moment(new Date()).format("YYYY-MM"),
      leaveArr:[],
      tags : [5, 21],
      year:year,
      month:month,
      day:'2',
      date:'',
      dutyInfo:''
    }
 
  }
  selectDate(year, month, day) {
    this.getTodayOnDuty(moment(year+'-'+month+'-'+day).format('x'));
  }
  previousMonth(year, month) {
    this.handleRender(year, month);
  }
  nextMonth(year, month) {
    this.handleRender(year, month);
  }
 
  handleRender(year, month,day){
    this.setState({date:year+'-'+month, year:year, month:month,},function(){
      this.getTags();
    });   
  }
 
  componentDidMount() {
    
    //通过id获取详情数据  /api/onDuty/getTodayOnDuty
    this.getTags();
    this.getTodayOnDuty(moment(new Date()).format("x"));
  }
  getTodayOnDuty(date){
    Ajax.post('/api/onDuty/getThedayOnDuty', {
      date: date,
    }, (res) => {
        if(res.code == 0){
          this.setState({
            dutyInfo:res.data,
          });
        }else{
            Toast.info(res.msg);
            return ;
        }
    });
  }
  getTags(){
    Ajax.post('/api/onDuty/getMonthDuty', {
      year: Number(this.state.year),
      month:Number(this.state.month)
    }, (res) => {
        if(res.code == 0){
          this.setState({
           tags:res.data,
          });
        }else{
            Toast.info(res.msg);
            return ;
        }
    });
  }
  render(){
    const { getFieldProps } = this.props.form;
  	return(
  		<div  >
        <Header title="值班情况"  pointer='pointer'/>
        <Calendar
          onSelectDate={this.selectDate.bind(this)}
          onPreviousMonth={this.previousMonth.bind(this)}
          onNextMonth={this.nextMonth.bind(this)}
          year={this.state.year}
          month={this.state.month}
          day={this.state.day}
          tags={this.state.tags}
          date={this.state.date}
         />
        <List style={{ backgroundColor: 'white' }} className="">
            
            <TextareaItem title="当日值班:" placeholder="" value={this.state.dutyInfo.onDutyUserName || '--' }></TextareaItem> 
            <TextareaItem title="带班领导:" placeholder="" value={this.state.dutyInfo.onDutyLeaderName || '--' }></TextareaItem>
            <TextareaItem title="值班辅警:" placeholder="" value={this.state.dutyInfo.onDutyPoliceName || '--' }></TextareaItem>
            <TextareaItem title="值班中队:" placeholder="" value={this.state.dutyInfo.onDutyTeam || '--' }></TextareaItem>
         </List>
  		</div>
  	)
  }
}

const Duty = createForm()(DutyComponent);
export default withRouter(Duty);





















// WEBPACK FOOTER //
// ./src/components/own/Duty/index.js