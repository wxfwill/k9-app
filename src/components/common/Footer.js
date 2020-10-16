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
const newMsgObj = {
  1: { text: '请假审批', link: '/app/monitoring/leaveCheck' },
  2: { text: '犬病治疗', link: '/app/dog/cure' },
  3: { text: '训练任务', link: '/app/drill/pdogdrill' },
  4: { text: '日常巡逻', link: '/app/monitoring/duty' },
  5: { link: '/app/monitoring/deploy' },
  6: { text: '网格搜捕', link: '/app/monitoring/grid' },
  7: { text: '外出执勤', link: '/app/monitoring/duty' },
  8: { text: '集合点', link: '' },
  9: { text: '', link: '' },
};
class Footer extends Component {
  constructor(props) {
    super(props);
    this.msgList = '';
    this.totalMsgNum = 0;
    let flag = 'yellowTab';
    if (this.props.history.location.pathname == '/news') {
      flag = 'blueTab';
    } else if (this.props.history.location.pathname == '/check') {
      flag = 'redTab';
    } else if (this.props.history.location.pathname == '/publish') {
      flag = 'greenTab';
    }

    let user = this.props.userInfo.user;
    this.state = {
      unReadMsgNum: '',
      selectedTab: flag,
      hidden: false,
      fullScreen: false,
      role: user.role,
    };
  }

  componentWillMount() {}
  componentWillUnmount() {
    //		systomStatus.closeSocket();
  }

  componentWillReceiveProps(nextProps) {
    // if (Immutable.is(Immutable.Map(this.props.socketMsg), Immutable.Map(nextProps.socketMsg))) {
    //   return;
    // }
    // const socketMsg = nextProps.socketMsg;
    // if (socketMsg && socketMsg.msgType == "newMsg") {
    //   const data = socketMsg.data;
    //   this.totalMsgNum = 0;
    //   this.state.unReadMsgNum = socketMsg.unReadMsgNum;
    //   sessionStorage.setItem("unReadMsgNum", socketMsg.unReadMsgNum);
    // } else if (socketMsg && socketMsg.msgType == "msgTipsApp") {
    //   this.state.unReadMsgNum = socketMsg.unReadMsgNum;
    //   sessionStorage.setItem("unReadMsgNum", socketMsg.unReadMsgNum);
    // }
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
    let { pathname } = this.props.location;
    let unReadMsgNum = sessionStorage.getItem('unReadMsgNum') || 100;
    return (
      <div className="footer">
        {/*	<Link to="/news">
					
					<span className={pathname=="/news"?'active':''}>
						<img src={pathname=="/news"?newsActivePic:newsPic} alt="消息"/>
						<span>消息</span>
					</span>
					<span style={{color: 'red'}}>{this.state.unReadMsgNum}</span>
				</Link>
				<Link to="/round">
					<span className={pathname=="/round"?'active':''}>
						<img src={pathname=="/round"?mapActivePic:mapPic} alt="考核"/>
						<span>考核</span>
					</span>
				</Link>
				<Link to="/fight">
					<span className={pathname=="/fight"?'active':''}>
						<img src={pathname=="/fight"?releaseActivePic:releasePic} alt="发布"/>
						<span>发布</span>
					</span>
				</Link>
				<Link to="/own">
					<span className={pathname=="/own"?'active':''}>
						<img src={pathname=="/own"?ownActivePic:ownPic} alt="我的"/>
						<span>我的</span>
					</span>
				</Link>*/}
        <div style={{ display: this.state.role <= 3 ? '' : 'none' }} className="foorter-inner">
          <TabBar unselectedTintColor="#C9CCD4" tintColor="#3D5EBD" barTintColor="white" hidden={this.state.hidden}>
            <TabBar.Item
              title="消息"
              key="news"
              icon={{ uri: newsPic }}
              selectedIcon={{ uri: newsActivePic }}
              selected={this.state.selectedTab === 'blueTab'}
              badge={this.props.socketNewList.total > 0 ? this.props.socketNewList.total : ''}
              onPress={() => {
                this.setState({
                  selectedTab: 'blueTab',
                });
                this.props.history.push('/news');
              }}
              data-seed="logId"
            >
              {this.renderContent('消息')}
            </TabBar.Item>
            <TabBar.Item
              icon={{ uri: mapPic }}
              selectedIcon={{ uri: mapActivePic }}
              title="地图"
              key="check"
              selected={this.state.selectedTab === 'redTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'redTab',
                });
                this.props.history.push('/check');
              }}
              data-seed="logId1"
            >
              {this.renderContent('地图')}
            </TabBar.Item>
            <TabBar.Item
              icon={{ uri: releasePic }}
              selectedIcon={{ uri: releaseActivePic }}
              title="工作台"
              key="publish"
              selected={this.state.selectedTab === 'greenTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'greenTab',
                });
                this.props.history.push('/publish');
              }}
            >
              {this.renderContent('工作台')}
            </TabBar.Item>
            <TabBar.Item
              icon={{ uri: ownPic }}
              selectedIcon={{ uri: ownActivePic }}
              title="我"
              key="own"
              selected={this.state.selectedTab === 'yellowTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'yellowTab',
                });
                this.props.history.push('/own');
              }}
            >
              {this.renderContent('我')}
            </TabBar.Item>
          </TabBar>
        </div>
        <div style={{ display: this.state.role > 3 ? '' : 'none' }}>
          <TabBar unselectedTintColor="#949494" tintColor="#15c619" barTintColor="white" hidden={this.state.hidden}>
            <TabBar.Item
              title="消息"
              key="news"
              icon={{ uri: newsPic }}
              selectedIcon={{ uri: newsActivePic }}
              selected={this.state.selectedTab === 'blueTab'}
              badge={this.state.unReadMsgNum}
              onPress={() => {
                this.setState({
                  selectedTab: 'blueTab',
                });
                this.props.history.push('/news');
              }}
              data-seed="logId"
            >
              {this.renderContent('消息')}
            </TabBar.Item>
            <TabBar.Item
              icon={{ uri: mapPic }}
              selectedIcon={{ uri: mapActivePic }}
              title="考核"
              key="check"
              selected={this.state.selectedTab === 'redTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'redTab',
                });
                this.props.history.push('/check');
              }}
              data-seed="logId1"
            >
              {this.renderContent('考核')}
            </TabBar.Item>

            <TabBar.Item
              icon={{ uri: ownPic }}
              selectedIcon={{ uri: ownActivePic }}
              title="我的"
              key="own"
              selected={this.state.selectedTab === 'yellowTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'yellowTab',
                });
                this.props.history.push('/own');
              }}
            >
              {this.renderContent('我的')}
            </TabBar.Item>
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
