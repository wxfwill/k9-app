import React,{Component} from 'react';
import { List , Picker ,DatePicker,TextareaItem ,InputItem,Stepper,WhiteSpace, WingBlank,Button,Toast} from 'antd-mobile';
import { createForm } from 'rc-form';
import ReactMixin from 'react-mixin';
import Header from 'components/common/Header';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter,Link } from "react-router-dom";
import * as systomStatus from 'actions/systomStatus'
import moment from 'moment';
import Ajax from 'libs/ajax';
import { CallApp } from 'libs/util'
require('style/own/duty.less');
const Item = List.Item;
const Brief = Item.Brief;

function failToast(text,fn) {
  Toast.fail(text, 1);
}
function successToast(text,fn) {
  Toast.success(text, 1,fn,true);
}
class AccountComponent extends Component{
  constructor(props){
    super(props);
    this.state={
      dutyInfo:'',
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
  componentDidMount() {
    // this.timer = setInterval(  this.getUserLocation, 3000)

    //通过id获取详情数据
    Ajax.post('/api/onDuty/getTodayOnDuty', {
 //     id: this.props.location.query.id
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
  
  componentWillUnmount() {
    systomStatus.closeSocket();
  }
  logout(){
    let { history }  = this.props;
    Ajax.post('/api/userCenter/logout', {
      //     id: this.props.location.query.id
         }, (res) => {
             if(res.code == 0){
              CallApp({callAppName: 'stopLocationService', callbackName: 'sendLocationInfoToJs', callbackFun: this.showClear})
           //   systomStatus.closeSocket();
              sessionStorage.removeItem('user');
              Toast.info("退出成功");
              history.push('/login');
             }else{
                 Toast.info(res.msg);
                 return ;
             }
         });
  }

  toLink(){
    let { history }  = this.props;
    history.push('/own/updatePwd');
  }
 

  render(){
    const { getFieldProps } = this.props.form;
    const user = JSON.parse(sessionStorage.getItem('user'));
  	return(
  		<div className="OwnLevel" >
        <Header title="账号安全"  pointer='pointer'/>
        <WhiteSpace size="xl" />
        <List >
          <Item extra={user.account}>账号</Item>
        </List>
        <WhiteSpace size="xl" />
        <List  >
          <Item arrow="horizontal" onClick={this.toLink.bind(this)}>修改密码</Item>
        </List>
        <WhiteSpace size="xl" />
        <List  >
            <Button type="primary"  onClick={this.logout.bind(this)}>退出登录</Button>
         </List>
         
  		</div>
  	)
  }
}
const mapStateToProps = state => ({
	socketMsg: state.system.socketMsg
  })
  const mapDispatchToProps = dispatch => ({
	  sysActions:  bindActionCreators(systomStatus, dispatch),
  })
  

const Account = createForm()(AccountComponent);
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Account));















// WEBPACK FOOTER //
// ./src/components/own/Account/index.js