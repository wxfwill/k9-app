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

const ownPic = require('images/own/user.svg');

require('style/own/own.less');

class Own extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: own.appMenu,
    };
  }
  showAlert = () => {
    const alertInstance = alert('提示', '确认退出吗?', [
      { text: '取消', onPress: () => this.alertCancel(), style: 'default' },
      {
        text: '确定',
        onPress: () =>
          new Promise((resolve) => {
            let { history } = this.props;
            Toast.info('正在退出...');
            React.$ajax.login.loginOut().then((res) => {
              if (res.code == 0) {
                CallApp({
                  callAppName: 'stopLocationService',
                  callbackName: 'sendLocationInfoToJs',
                  callbackFun: this.showClear,
                });
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
                if (util.isAndroid) {
                  window.android && window.android.signOut();
                  console.log('退出安卓');
                } else {
                  window.webkit && window.webkit.messageHandlers.signOut.postMessage(); //IOS
                  console.log('退出IOS');
                }
              }
            });
          }),
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
    let { history } = this.props;
    history.push(item.link);
  };
  // 退出登录
  logout = () => {
    this.showAlert();
  };
  componentWillMount() {
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
  render() {
    let user = this.props.userInfo;
    return (
      <div className="Own">
        <Header title="我" noColor="own" />
        <div className="midder-content">
          <div className="inner-content">
            <List className="border-b-n">
              <Item
                //  arrow="horizontal"
                thumb={<img src={ownPic} alt="user" className="user-img" />}
                multipleLine
                //   onClick={this.handleJump.bind(this)}
              >
                <p className="user-name">{user.user && user.user.name}</p>
                <Brief>职务：中队长</Brief>
                <Brief>部门：{'警犬大队三中队'}</Brief>
                <Brief>电话：{1333333333}</Brief>
              </Item>
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
