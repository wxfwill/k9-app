import React, { Component } from 'react';
import { Button, Toast, Checkbox, Flex, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'react-redux';
import { createWebsocket } from 'components/common/websocket';
import {
  saveAccount,
  savePassword,
  saveUserInfo,
  savePasswordData,
  saveToken,
  saveAPPList,
} from 'store/actions/loginAction';

const AgreeItem = Checkbox.AgreeItem;

let Storage = {};
if (localStorage) {
  Storage = localStorage;
} else {
  Storage = {
    getItem: () => {},
    setItem: () => {},
    removeItem: () => {},
  };
}

require('style/login.less');
const logoPic = require('images/icon-logo.png');
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRemeberAccount: true, // 是否记住账户
      isRemeberAccVal: '',
      isRemeberPass: true, // 是否记住密码
      isRemeberPassVal: '',
      policy: true,
      modal: false,
    };
  }
  showClear = (msg) => {};
  handleSubmit() {
    // 获取applist
    this.queryForApp();
    let { policy } = this.state;
    if (policy) {
      // 获取表单的值
      this.props.form.validateFields((err, values) => {
        // 保存密码
        this.props.passwordAction(values.password);
        this._login({ account: values.account, password: values.password });
      });
    } else {
      Toast.info('请先同意隐私政策', 2);
    }
  }
  checkIsLogin = (token) => {};
  _login = (data) => {
    React.$ajax.login.postLogin(data).then((res) => {
      if (res && res.code == 0) {
        let { history } = this.props;
        Toast.info('登录成功', 1.5);
        let user = res.data.user;
        // 是否记住账户
        if (this.state.isRemeberAccount) {
          localStorage.setItem('remeberAccount', data.account);
        } else {
          localStorage.removeItem('remeberAccount');
        }
        // 是否记住密码
        if (this.state.isRemeberPass) {
          localStorage.setItem('remeberPass', data.password);
        } else {
          localStorage.removeItem('remeberPass');
        }
        sessionStorage.setItem('user', JSON.stringify(user));
        // 用户信息
        this.props.userInfoAction(res.data);
        console.log('token====' + res.data.token);
        this.props.tokenAction(res.data.token);

        // 建立websocket
        createWebsocket();
        // console.log(this.props.dispatch(saveToken(res.data.token)));
        history.push({ pathname: '/own', state: user });

        // const token = util.cookieUtil.get('token');

        //传递登录信息给两步路
        const reqData = {
          userId: user.id,
          userName: user.name,
          token: res.data.token,
        };
        console.log(util.isAndroid, reqData, '---------');
        util.CallApp({
          callAppName: 'login',
          param: reqData,
        });
      }
    });
  };
  changeRemember = (e) => {
    this.setState({ policy: e.target.checked });
  };

  showModal = (key) => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    const { history } = this.props;
    history.push('/login/policy');
  };
  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  };
  handleChangeAccount = (e) => {
    this.setState({ isRemeberAccount: e.target.checked });
  };
  handlePass = (e) => {
    this.setState({ isRemeberPass: e.target.checked });
  };
  handleForgetPass = () => {
    Toast.info('请找管理员重置密码', 2);
  };
  queryForApp() {
    React.$ajax.footer.queryForApp().then((res) => {
      console.log(res);
      if (res && res.code == 0) {
        let resData = res.data ? res.data : [];
        this.props.getAppButtonList(resData);
      }
    });
  }
  componentWillMount() {
    const remeberAccountVal = localStorage.getItem('remeberAccount');
    const remeberPassVal = localStorage.getItem('remeberPass');
    if (remeberAccountVal) {
      this.setState({ isRemeberAccVal: remeberAccountVal, isRemeberAccount: true });
    }
    if (remeberPassVal) {
      this.setState({ isRemeberPassVal: remeberPassVal, isRemeberPass: true });
    }
  }
  render() {
    const { policy, isRemeberAccount, isRemeberAccVal, isRemeberPassVal, isRemeberPass } = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <div className="login">
        <div className="logo-bg">
          <div className="logo">
            <img src={logoPic} alt="logo" className="logo-img" />
            <p>K9警犬作战指挥系统</p>
          </div>
        </div>

        <div className="login-form">
          <InputItem
            {...getFieldProps('account', {
              initialValue: isRemeberAccVal,
            })}
            placeholder="请输入账号"
            className="login-item"
          >
            <div
              className="labelIcon"
              style={{
                backgroundImage: `url(${require('images/login-account.svg')})`,
                backgroundSize: 'cover',
                height: '0.64rem',
                width: '0.64rem',
              }}
            />
          </InputItem>
          <InputItem
            {...getFieldProps('password', {
              initialValue: isRemeberPassVal,
            })}
            type="password"
            placeholder="请输入密码"
            className="login-item"
          >
            <div
              className="labelIcon"
              style={{
                backgroundImage: `url(${require('images/login-psw.svg')})`,
                backgroundSize: 'cover',
                height: '0.64rem',
                width: '0.64rem',
              }}
            />
          </InputItem>
          <Flex justify="end" className="forget_psw">
            <div className="foget-text" onClick={this.handleForgetPass.bind(this)}>
              忘记密码?
            </div>
          </Flex>

          <Button type="primary" size="small" onClick={this.handleSubmit.bind(this)} className="login-btn">
            登录
          </Button>

          <Flex align="start" justify="between" className="logon-tips">
            <AgreeItem
              data-seed="logId"
              defaultChecked={isRemeberAccount}
              onChange={this.handleChangeAccount.bind(this)}
            >
              记住账号
            </AgreeItem>
            <AgreeItem data-seed="logId" checked={isRemeberPass} onChange={(e) => this.handlePass(e)}>
              记住密码
            </AgreeItem>
          </Flex>
          {util.isAndroid ? (
            ''
          ) : (
            <Flex className="policy" align="center" justify="center">
              <AgreeItem data-seed="logId" checked={policy} onChange={(e) => this.changeRemember(e)}>
                <span className="agree-txt">
                  登录即代表阅读并同意
                  <a className="zc-txt" onClick={this.showModal('modal')}>
                    隐私政策
                  </a>
                </span>
              </AgreeItem>
            </Flex>
          )}
        </div>
      </div>
    );
  }
}

function loginStateToProps(state) {
  return {
    loginAccount: state.loginReducer.isRemeber,
    loginPass: state.loginReducer.isPass,
    userInfo: state.loginReducer.userInfo,
    password: state.loginReducer.password,
    token: state.loginReducer.token,
  };
}

const loginActionToProps = (dispatch) => ({
  remeberAccount: () => dispatch(saveAccount()),
  remeberPassword: () => dispatch(savePassword()),
  userInfoAction: (data) => dispatch(saveUserInfo(data)),
  passwordAction: (data) => dispatch(savePasswordData(data)),
  tokenAction: (token) => dispatch(saveToken(token)),
  getAppButtonList: (list) => dispatch(saveAPPList(list)),
});

const loginForm = createForm()(Login);

export default connect(loginStateToProps, loginActionToProps)(loginForm);
