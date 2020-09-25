import React,{Component} from 'react';
import { List , Picker ,DatePicker,TextareaItem ,InputItem,Stepper,WhiteSpace, WingBlank,Button,Toast} from 'antd-mobile';
import Reflux from 'reflux';
import { createForm } from 'rc-form';
import ReactMixin from 'react-mixin';
import Header from 'components/common/Header';
import Store from './store';
import Actions from './actions';
import { withRouter,Link } from "react-router-dom";
import moment from 'moment';
require('style/own/ownLevel.less');
const Item = List.Item;
const Brief = Item.Brief;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const seasons = [
    {
      label: '调休',
      value: '1',
    },
    {
      label: '事假',
      value: '2',
    },{
      label: '年假',
      value: '3',
    }
];
function failToast(text,fn) {
  Toast.fail(text, 1);
}
function successToast(text,fn) {
  Toast.success(text, 1,fn,true);
}
class OwnLevelComponent extends Component{
  constructor(props){
  	super(props);
    this.state={
      start:now,
      end:now,
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
  handleNumber(type){
    this.numObj()[type](this);
  }
  numObj(){
    return{
      cut:function(pointer){
        pointer.setState({val:pointer.state.val==1?1:(pointer.state.val-0.1)})
      },
      add:function(pointer){
        pointer.setState({val:pointer.state.val+0.1})
      }
    }
  }
  handleSubmit(){
    const { history } = this.props;
    this.props.form.validateFields((error) => {
      if (!error) {
        let isReturn = true;
        let subData = this.props.form.getFieldsValue();
        console.log(subData)
        Object.keys(subData).forEach((item,index)=>{
          if(typeof subData[item]=='undefined'){
              failToast('请补全信息！');
              isReturn = false;
          };
        })
        if(!isReturn){return false};
        let params={
          userId:1,
          leaveStartTimeStr:moment(this.state.start).format('YYYY-MM-DD HH:mm:ss'),
          leaveEndTimeStr:moment(this.state.end).format('YYYY-MM-DD HH:mm:ss'),
          applyTimeStr:moment(now).format('YYYY-MM-DD HH:mm:ss'),
          duration:this.state.val,
          type:Number(subData.type[0]),
          remark:subData.remark
        }
        Actions.subData(params);
      } else {
        console.log(error);
      }
    });
  }
  onChange(type,data){
   let handle = this.handleRes()[type];
   typeof handle!=='undefined'&&handle();
  }
  handleRes(){
    const { history } = this.props;
    return{
      saveRes:function(){
        successToast('提交成功！',function(){
          history.push('/own/leave/attend');
        })
      }
    }
  }
  render(){
    const { getFieldProps } = this.props.form;
  	return(
  		<div className="OwnLevel" >
        <Header title="请假"  pointer='pointer'/>
        <List style={{ backgroundColor: 'white' }} className="date-picker-list">
            <Picker data={seasons} cols={1} {...getFieldProps('type')} className="forss">
              <Item arrow="horizontal">请假类型</Item>
            </Picker>
            <DatePicker
              title="选择日期"
              value={this.state.start}
              onOk={this.handleOk.bind(this)}
              onChange={this.handleChange.bind(this,'start')}
            >
              <Item arrow="horizontal">开始时间</Item>
            </DatePicker>
            <DatePicker
              title="选择日期"
              value={this.state.end}
              onOk={this.handleOk.bind(this)}
              onChange={this.handleChange.bind(this,'end')}
            >
              <Item arrow="horizontal">结束时间</Item>
            </DatePicker>
           <List.Item
            wrap
            extra={
              <div>
                <span className="cut" onClick={this.handleNumber.bind(this,'cut')}>-</span>
                  <em>{(this.state.val+"").substring(0,3)}</em>
                <span className="add" onClick={this.handleNumber.bind(this,'add')}>+</span>
              </div>}
          >
          请假时长
          </List.Item>
            <TextareaItem
            {...getFieldProps('remark')}
            title="请假事由"
            placeholder="请输入请假事由"
            data-seed="logId"
            rows={2}
            autoHeight
          />
         </List>
         <div className="foot">
           <WingBlank>
              <Button type="primary" onClick={()=>this.handleSubmit()}>提交请假</Button><WhiteSpace />
           </WingBlank>
         </div>
  		</div>
  	)
  }
}
ReactMixin.onClass(OwnLevelComponent,Reflux.listenTo(Store, 'onChange'));
const OwnLevel = createForm()(OwnLevelComponent);
export default withRouter(OwnLevel);














// WEBPACK FOOTER //
// ./src/components/own/OwnTask/OwnTraining/index.js