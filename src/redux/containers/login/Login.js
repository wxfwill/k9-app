import React, { Component } from 'react';
import { Button, Toast, Checkbox, Flex, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'react-redux';
import { saveAccount, savePassword, saveUserInfo, savePasswordData } from '../../../store/actions/loginAction';

const AgreeItem = Checkbox.AgreeItem;

var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器

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
const logoPic = require('images/icon_logo.png');
class Login extends Component {
  constructor(props) {
    super(props);
    // this.isLogin();
    this.state = {
      isRemeberAccount: true, // 是否记住账户
      isRemeberAccVal: '',
      isRemeberPass: true, // 是否记住密码
      isRemeberPassVal: '',
      policy: true,
      modal: false,
    };
  }
  isLogin() {
    //通过token判断登录是否有效
    React.$ajax.post(
      '/api/userCenter/checkLogin',
      {
        //     id: this.props.location.query.id
      },
      (res) => {
        if (res.code == 0) {
          //	CallApp({callAppName: 'stopLocationService', callbackName: 'sendLocationInfoToJs', callbackFun: this.showClear})
          let { history } = this.props;
          let user = res.data === null ? '' : res.data.user;
          const { rememberName, rememberPassword, username, password } = this.state;
          sessionStorage.setItem('user', JSON.stringify(user));
          sessionStorage.setItem('appMenu', JSON.stringify(res.data.appMenu));
          rememberName ? Storage.setItem('k9username', username) : Storage.removeItem('k9username');
          rememberPassword ? Storage.setItem('k9password', password) : Storage.removeItem('k9password');
          const token = util.cookieUtil.get('token');
          Storage.setItem('token', res.data.token);
          history.push({ pathname: '/own', user: user });
          if (isAndroid) {
            window.AndroidWebView &&
              window.AndroidWebView.showInfoFromJs(
                JSON.stringify({
                  token,
                  id: user.id,
                  gpsInterval: res.data.cfgs.gpsInterval,
                  braceletInterval: res.data.cfgs.braceletInterval,
                  account: user.account,
                })
              );
          } else {
            // window.webkit.messageHandlers.showInfoFromJs.postMessage(
            //   JSON.stringify({
            //     token,
            //     id: user.id,
            //     gpsInterval: res.data.cfgs.gpsInterval,
            //     braceletInterval: res.data.cfgs.braceletInterval,
            //     account: user.account,
            //   })
            // );
          }
        }
      }
    );
  }
  showClear = (msg) => {};
  handleSubmit() {
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
        // 用户信息
        this.props.userInfoAction(res.data);
        this.props.remeberPassword();
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('appMenu', JSON.stringify(res.data.appMenu));
        history.push({ pathname: '/own', state: user });
        const token = util.cookieUtil.get('token');
        localStorage.setItem('token', res.data.token);
        if (isAndroid) {
          window.AndroidWebView &&
            window.AndroidWebView.showInfoFromJs(
              JSON.stringify({
                token,
                id: user.id,
                gpsInterval: res.data.cfgs.gpsInterval,
                braceletInterval: res.data.cfgs.braceletInterval,
                account: user.account,
              })
            );
        } else {
          // window.webkit.messageHandlers.showInfoFromJs.postMessage(
          //   JSON.stringify({
          //     token,
          //     id: user.id,
          //     gpsInterval: res.data.cfgs.gpsInterval,
          //     braceletInterval: res.data.cfgs.braceletInterval,
          //     account: user.account,
          //   })
          // );
        }
        // CallApp({callAppName: 'showInfoFromJs', param: {token}})
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
            <div className="foget-text">忘记密码?</div>
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
          {isAndroid ? (
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
  };
}

const loginActionToProps = (dispatch) => ({
  remeberAccount: () => dispatch(saveAccount()),
  remeberPassword: () => dispatch(savePassword()),
  userInfoAction: (data) => dispatch(saveUserInfo(data)),
  passwordAction: (data) => dispatch(savePasswordData(data)),
});

const loginForm = createForm()(Login);

export default connect(loginStateToProps, loginActionToProps)(loginForm);
