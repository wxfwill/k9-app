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
import Ajax from 'libs/ajax';
import { CallApp } from 'libs/util'
const Item = List.Item;
const Brief = Item.Brief;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const seasons = "2018-04-22";
function failToast(text,fn) {
  Toast.fail(text, 1);
}
function successToast(text,fn) {
  Toast.success(text, 1,fn,true);
}
class UpdatePwdComponent extends Component{
  constructor(props){
    super(props);
    this.state={
      start:now,
      end:now,
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
  submit = () => {
    this.props.form.validateFields((error, value) => {
        if (!error) {
            let isReturn = true;
          //  let subData = this.props.form.getFieldsValue();
            let re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
            console.log(value)
            Object.keys(value).forEach((item,index)=>{
              if(typeof value[item]=='undefined'){
                  failToast('输入的密码！');
                  isReturn = false;
              }else if(!re.test(value[item])&& item!=='password'){
                    failToast('密码由数字和字母组合！');
                    isReturn = false;
                };
            })
            if(!isReturn){return false};
            if(value.newpassword!=value.newpassword1){
                failToast('两次输入的密码不一致！');
                return false;
            }
            Ajax.post('/api/userCenter/updatePassword', {
                oldPassWord: value.password,
                newPassWord: value.newpassword,
               }, (res) => {
                   if(res.code == 0){
                       CallApp({callAppName: 'stopLocationService', callbackName: 'sendLocationInfoToJs', callbackFun: this.showClear})
                        let { history }  = this.props;
                        Toast.info("密码修改成功，请重新登录！");
                        history.push('/login');
                   }else{
                       console.log('dfsfa');
                       Toast.info(res.msg);
                       return ;
                   }
               });
          } else {
            console.log(error);
          }


     
    });
  }
 
  render(){
    const { getFieldProps } = this.props.form;
  	return(
  		<div className="OwnLevel" >
        <Header title="修改密码"  pointer='pointer'/>
        <WhiteSpace size="xl" />
        <List>
          <InputItem
            {...getFieldProps('password')}
            type="password"
            placeholder="请输入原始密码"
          ></InputItem>
           <WhiteSpace size="xm" />
          <InputItem
            {...getFieldProps('newpassword')}
            type="password"
            placeholder="请输入新密码"
          ></InputItem>
           <WhiteSpace size="xm" />
           <InputItem
            {...getFieldProps('newpassword1')}
            type="password"
            placeholder="请确认新密码"
          ></InputItem>
           <WhiteSpace size="xl" />
            <Button type="primary"   onClick={this.submit}>确认</Button>
        </List>
       
  		</div>
  	)
  }
}
ReactMixin.onClass(UpdatePwdComponent,Reflux.listenTo(Store, 'onChange'));
const UpdatePwd = createForm()(UpdatePwdComponent);
export default withRouter(UpdatePwd);














// WEBPACK FOOTER //
// ./src/components/own/Account/UpdatePwd.js