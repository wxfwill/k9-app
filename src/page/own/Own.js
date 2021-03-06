import React, { Component } from 'react';
import { List, Button, Toast, Modal, Accordion } from 'antd-mobile';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import { connect } from 'react-redux';
import { saveAccount, savePassword, saveUserInfo, savePasswordData, saveToken } from 'store/actions/loginAction';
import { CallApp } from 'libs/util';
import { withRouter, Link } from 'react-router-dom';
import { closeWebSocket } from 'components/common/websocket';
import * as own from 'localData/own/ownTask';
const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;
let alertInstance = null;

require('style/own/own.less');

class Own extends Component {
  constructor(props) {
    super(props);
    let userInfos = this.props.userInfo.user;
    this.state = {
      data: own.appMenu,
      userImg: userInfos.photo
        ? `${process.env.BASE_URL}/api/user/showImg?fileName=${userInfos.photo}`
        : require('images/own/user.svg'),
    };
  }
  loginOutMeth = (msg) => {
    console.log('App返回信息====' + msg);
    alert('App返回信息====' + msg);
    let { history } = this.props;
    Toast.info('正在退出...');
    React.$ajax.login.loginOut().then((res) => {
      if (res.code == 0) {
        alertInstance.close();
        // token
        this.props.tokenAction(null);
        // 用户信息
        this.props.userInfoAction('');
        // 关闭socket
        closeWebSocket();
        Toast.info('退出成功');
        history.push('/login');

        //APP端退出登录
        // if (util.isAndroid) {
        //   window.android && window.android.signOut();
        //   console.log('退出安卓');
        // } else {
        //   window.webkit && window.webkit.messageHandlers.signOut.postMessage(null); //IOS
        //   console.log('退出IOS');
        //   alert('IOS退出');
        // }
      }
    });
  };
  showAlert = () => {
    let _this = this;
    alertInstance = alert('提示', '确认退出吗?', [
      { text: '取消', onPress: () => this.alertCancel(), style: 'default' },
      {
        text: '确定',
        onPress: () =>
          // util.CallApp({
          //   callAppName: 'signOut',
          //   // param: { jsMethod: 'jsLoginOut' },
          //   // callbackName: 'jsLoginOut',
          //   // callbackFun: _this.loginOutMeth,
          // }),
          //new Promise((resolve) => {
          {
            let { history } = this.props;
            Toast.info('正在退出...');
            React.$ajax.login.loginOut().then((res) => {
              if (res.code == 0) {
                //APP端退出登录
                CallApp({
                  callAppName: 'signOut',
                });
                alertInstance.close();
                // token
                this.props.tokenAction(null);
                // 用户信息
                this.props.userInfoAction('');
                // 关闭socket
                closeWebSocket();
                Toast.info('退出成功', 1, null, false);
                history.push('/login');
              }
            });
          },
        //}),
      },
    ]);
  };
  alertCancel = () => {
    console.log('取消');
  };
  componentDidMount() {}

  handleJump() {
    let { history } = this.props;
    history.push('test');
  }
  // 点击跳转
  handleLink = (item) => {
    console.log(item);
    if (item.text == '轨迹查看') {
      util.CallApp({
        callAppName: 'map',
      });
      return;
    }
    let { history } = this.props;
    history.push(item.link);
  };
  // 退出登录
  logout = () => {
    this.showAlert();
  };
  UNSAFE_componentWillMount() {
    console.log('use');
    console.log(this.props.location);
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  onChange = (key) => {
    console.log(key);
  };
  formatRoles = (list) => {
    if (list && list.length > 0) {
      return list.map((item, index) => {
        return (
          <span key={index}>
            <i>{item.roleName || item.name}</i>
            {index == list.length - 1 ? null : '/'}
          </span>
        );
      });
    } else {
      return '无';
    }
  };
  handleSet = () => {
    let { history } = this.props;
    history.push('/own/SysSetList');
  };
  render() {
    let user = this.props.userInfo;
    console.log(user);
    return (
      <div className="Own">
        <Header title="我" noColor="own" />
        <div className="midder-content">
          <div className="inner-content">
            <List className="border-b-n">
              <Item
                //  arrow="horizontal"
                thumb={<img src={this.state.userImg} alt="user" className="user-img" />}
                multipleLine
                //   onClick={this.handleJump.bind(this)}
              >
                <p className="user-name">
                  {user.user && user.user.name}
                  {/* <span className="sysSet">
                    <img src={require('images/own/set.png')} alt="设置" />
                    设置
                  </span> */}
                </p>
                <Brief>职务：{this.formatRoles(user.roles)}</Brief>
                <Brief>部门：{this.formatRoles(user.orgs)}</Brief>
                <Brief>电话：{user.user.telphone ? user.user.telphone : '无'}</Brief>
              </Item>
              <div className="sysSet" onClick={this.handleSet}>
                <img src={require('images/own/set.png')} alt="设置" />
              </div>
            </List>
            <div className="list-wrap">
              {this.state.data.map((item, index) => {
                return (
                  <List className="list-item" key={index} onClick={this.handleLink.bind(this, item)}>
                    <Item arrow="horizontal" thumb={<img src={item.icon} alt="list-icon" className="list-img" />}>
                      {item.text}
                    </Item>
                  </List>
                );
              })}
            </div>
            <Button size="small" className="layout-btn" onClick={this.logout.bind(this)}>
              退出登录
            </Button>
          </div>
        </div>
        <Footer />
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
});

export default connect(loginStateToProps, loginActionToProps)(withRouter(Own));
