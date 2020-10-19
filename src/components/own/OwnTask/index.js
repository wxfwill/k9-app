import React, { Component } from 'react';
import { List, Button, Toast, Modal, Accordion } from 'antd-mobile';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import { connect } from 'react-redux';
import { saveAccount, savePassword, saveUserInfo, savePasswordData, saveToken } from 'store/actions/loginAction';
import { CallApp } from 'libs/util';
import { withRouter, Link } from 'react-router-dom';

const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;

const iconList = {
  newsPic: require('images/own/news.png'),
  track: require('images/own/track.png'),
  manage: require('images/own/jq.svg'),
  monitoring: require('images/own/monitoring.png'),
  task: require('images/own/task.png'),
  diagnose: require('images/own/diagnose.png'),
  equipment: require('images/own/device.svg'),
  watch: require('images/own/watch.png'),
  leave: require('images/own/leave.png'),
  account: require('images/own/accent.svg'),
  approval: require('images/own/approval.png'),
  holiday: require('images/own/jia.svg'),
  group: require('images/own/group.png'),
  feeding: require('images/own/feeding.png'),
  call: require('images/own/call.png'),
};
const ownPic = require('images/own/user.svg');

require('style/own/own.less');

let myTask = [
  {
    text: '网格化搜捕',
    icon: require('images/own/own-search.svg'),
    link: '',
  },
  {
    text: '日常巡逻',
    icon: require('images/own/jq.svg'),
    link: '',
  },
  {
    text: '紧急调配',
    icon: require('images/own/watch.png'),
    link: '',
  },
  {
    text: '定点集合',
    icon: require('images/own/approval.png'),
    link: '',
  },
  {
    text: '外勤任务',
    icon: require('images/own/jia.svg'),
    link: '',
  },
  {
    text: '训练计划',
    icon: require('images/own/accent.svg'),
    link: '',
  },
];

class OwnTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskData: myTask,
    };
  }
  componentDidMount() {}

  handleJump() {
    let { history } = this.props;
    history.push('test');
  }
  // 点击跳转
  handleLink = (item) => {
    let { history } = this.props;
    history.push(item.link);
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
  render() {
    return (
      <div className="Own">
        <Header pointer title="我的任务" noColor="own" />
        <div className="midder-content">
          <div className="inner-content">
            <div className="list-wrap">
              {this.state.taskData.map((item, index) => {
                return (
                  <List className="list-item" key={index} onClick={this.handleLink.bind(this, item)}>
                    <Item arrow="horizontal" thumb={<img src={item.icon} alt="list-icon" className="list-img" />}>
                      {item.text}
                    </Item>
                  </List>
                );
              })}
            </div>
          </div>
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
});

export default connect(loginStateToProps, loginActionToProps)(withRouter(OwnTask));
