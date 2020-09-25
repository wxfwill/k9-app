import React,{Component} from 'react';
import { WhiteSpace, WingBlank,Button,Toast, Accordion, List} from 'antd-mobile';
import Reflux from 'reflux';
import { createForm } from 'rc-form';
import ReactMixin from 'react-mixin';
import Header from 'components/common/Header';
import { withRouter,Link } from "react-router-dom";
import moment from 'moment';
import Ajax from 'libs/ajax';
import { CallApp } from 'libs/util'
const Item = List.Item;
const Brief = Item.Brief;
const user = JSON.parse(sessionStorage.getItem('user'));
class AccountComponent extends Component{
  constructor(props){
    super(props);
    this.state={
      holidayInfo:[],
      val: 1,
    }
  }

  componentDidMount() {
    //通过id获取详情数据
    Ajax.post('/api/leaveRecord/getAllLeaveUser', {
        userId: user.id,
        leaveYear:moment(new Date()).format("YYYY")
    }, (res) => {
        if(res.code == 0){
          this.setState({
            holidayInfo:res.data,
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
  		<div >
        <Header title="假期管理"  pointer='pointer'/>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
            {this.state.holidayInfo.length>0?this.state.holidayInfo.map((message) =><Accordion.Panel header={<span style={{ color: 'blue'}}>{message.typeName}</span>} className="pad">
              <List className="my-list">
                <Item extra={message.totalDay}>总天数</Item>
                <Item extra={message.applyingDay}>流程中天数</Item>
                <Item extra={message.usedDay}>已用天数</Item>
                <Item extra={(Number(message.totalDay)-Number(message.usedDay))}>剩余天数</Item>
                <Item extra={(Number(message.totalDay)-Number(message.usedDay)-Number(message.applyingDay))}>可用天数</Item>
              </List>
            </Accordion.Panel>):<div style={{ textAlign: 'center',paddingTop:'12px'}}>暂无数据</div>}
          </Accordion>
        </div>
        <WhiteSpace size="xl" />

  		</div>
  	)
  }
}

const Account = createForm()(AccountComponent);
export default withRouter(Account);














// WEBPACK FOOTER //
// ./src/components/own/Holiday/index.js