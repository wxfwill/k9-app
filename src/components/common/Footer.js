import React, { Component } from 'react';
import { Menu, TabBar } from 'antd-mobile';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import { withRouter, Link } from 'react-router-dom';
import * as systomStatus from 'actions/systomStatus';

import { saveAccount, savePassword, saveUserInfo, savePasswordData, saveToken } from '../../store/actions/loginAction';

const newsPic = require('images/nav/info-icon.svg');
const newsActivePic = require('images/nav/info-icon-active.svg');
const mapPic = require('images/nav/map-icon.svg');
const mapActivePic = require('images/nav/map-icon-active.svg');
const releasePic = require('images/nav/work-icon.svg');
const releaseActivePic = require('images/nav/work-icon-active.svg');
const ownPic = require('images/nav/self-icon.svg');
const ownActivePic = require('images/nav/self-icon-active.svg');

require('style/common/footer.less');

class Footer extends Component {
  constructor(props) {
    super(props);
    this.msgList = '';
    this.totalMsgNum = 0;
    // let flag = 'yellowTab';
    let flag = '我';
    if (this.props.history.location.pathname == '/news') {
      // flag = 'blueTab';
      flag = '消息';
    } else if (this.props.history.location.pathname == '/check') {
      //flag = 'redTab';
      flag = '地图';
    } else if (this.props.history.location.pathname == '/workbench') {
      //flag = 'greenTab';
      flag = '工作台';
    }

    let user = this.props.userInfo.user;
    this.state = {
      unReadMsgNum: '',
      selectedTab: flag,
      hidden: false,
      fullScreen: false,
      role: user.role,
      navList: [],
    };
  }

  componentDidMount() {
    this.queryForApp();
  }

  //底部导航列表接口
  queryForApp() {
    React.$ajax.footer.queryForApp().then((res) => {
      console.log(res);
      if (res && res.code == 0) {
        this.setState({
          navList: res.data,
        });
      }
    });
  }

  renderContent(pageText) {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>
          Clicked “{pageText}” tab， show “{pageText}” information
        </div>
      </div>
    );
  }

  render() {
    const { navList } = this.state;
    return (
      <div className="footer">
        <div className="foorter-inner">
          <TabBar unselectedTintColor="#C9CCD4" tintColor="#3D5EBD" barTintColor="white" hidden={this.state.hidden}>
            {navList && navList.length > 0
              ? navList.map((item) => {
                  return (
                    <TabBar.Item
                      title={item.title}
                      key={item.id}
                      icon={{ uri: item.normalIconUrl }}
                      selectedIcon={{ uri: item.highlightIconUrl }}
                      selected={this.state.selectedTab === item.title}
                      badge={
                        item.title == '消息' && this.props.socketNewList.total > 0 ? this.props.socketNewList.total : ''
                      }
                      onPress={() => {
                        this.setState({
                          selectedTab: item.title,
                        });
                        if (item.openType == 'url') {
                          this.props.history.push(item.openAddr);
                        } else {
                          console.log('进入地图');
                          if (util.isAndroid) {
                            window.android && window.android.map();
                            console.log('android进入地图');
                          } else {
                            window.webkit && window.webkit.messageHandlers.map.postMessage(); //IOS
                            console.log('IOS进入地图');
                          }
                        }
                      }}
                    >
                      {this.renderContent(item.title)}
                    </TabBar.Item>
                  );
                })
              : null}
          </TabBar>
        </div>
      </div>
    );
  }
}
// const mapStateToProps = (state) => ({
//   socketMsg: state.system && state.system.socketMsg,
// });
// const mapDispatchToProps = (dispatch) => ({
//   sysActions: bindActionCreators(systomStatus, dispatch),
// });

function loginStateToProps(state) {
  return {
    loginAccount: state.loginReducer.isRemeber,
    loginPass: state.loginReducer.isPass,
    userInfo: state.loginReducer.userInfo,
    password: state.loginReducer.password,
    token: state.loginReducer.token,
    socketNewList: state.socketReducer.newLIst,
  };
}

const loginActionToProps = (dispatch) => ({
  remeberAccount: () => dispatch(saveAccount()),
  remeberPassword: () => dispatch(savePassword()),
  userInfoAction: (data) => dispatch(saveUserInfo(data)),
  passwordAction: (data) => dispatch(savePasswordData(data)),
  tokenAction: (token) => dispatch(saveToken(token)),
});

export default connect(loginStateToProps, loginActionToProps)(withRouter(Footer));

// WEBPACK FOOTER //
// ./src/components/common/Footer.js
