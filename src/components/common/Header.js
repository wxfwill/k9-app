import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Icon, Modal, Popover } from 'antd-mobile';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import * as systomStatus from 'actions/systomStatus';
// import { createSocket } from '../../store/actions/socketStatus';
// import WebsocketClass from 'components/common/websocket';
import store from 'websocket/store';
const Item = Popover.Item;
require('style/common/header.less');
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1: false,
      info: '',
      taskType: '',
      poverVisibe: false,
    };
    this.timer = null;
  }
  jump() {
    const { history } = this.props;
    history.goBack();
  }
  componentWillMount() {
    //初始化socket连接
    store.dispatch({ type: true });
    // if (typeof this.props.socketMsg == "undefined") {
    //   this.props.sysActions.newSocket();
    // } else {
    //   if (systomStatus.reWebsocket().readyState == 2 || systomStatus.reWebsocket().readyState == 3) {
    //     this.props.sysActions.newSocket();
    //   } else {
    //     systomStatus.reWebsocket().send(JSON.stringify({ msgType: "HeartBeat" }));
    //   }
    // }
    // this.timer = setInterval(this.openWebsocket, 30000);
    // setTimeout(() => {
    //   const ws = store.getState();
    //   ws.$soctket_emit(JSON.stringify({ msgType: 'HeartBeat' }), () => {
    //     console.log('发送成功', 'hahahahhhhhhhhhhhhhhhhhhhhhh');
    //   });
    // }, 5000);
  }

  openWebsocket = () => {
    // if (systomStatus.reWebsocket().readyState == 2 || systomStatus.reWebsocket().readyState == 3) {
    //   this.props.sysActions.newSocket();
    // } else {
    //   systomStatus.reWebsocket().send(JSON.stringify({ msgType: 'HeartBeat' }));
    // }
    const ws = store.getState();
    ws.$soctket_emit(JSON.stringify({ msgType: 'HeartBeat' }), () => {
      console.log('发送成功');
    });
  };
  handleShow() {
    this.props.handleShow();
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    if (systomStatus && systomStatus.reWebsocket() && systomStatus.reWebsocket().readyState == 1) {
      systomStatus.reWebsocket().send(JSON.stringify({ msgType: 'HeartBeat' }));
    }
    //		systomStatus.closeSocket();
  }
  componentWillReceiveProps(nextProps) {
    if (Immutable.is(Immutable.Map(this.props.socketMsg), Immutable.Map(nextProps.socketMsg))) {
      return;
    }
    const socketMsg = nextProps.socketMsg;
    let url = this.props.history.location.pathname;
    if (socketMsg && socketMsg.msgType == 'stopTask') {
      this.setState({
        modal1: true,
        info: socketMsg.data.msg + '!',
        taskType: socketMsg.data.taskType,
      });
    } else if (socketMsg && socketMsg.msgType == 'msgTipsApp') {
      sessionStorage.setItem('unReadMsgNum', socketMsg.unReadMsgNum);
      if (url == '/own/OwnTask') {
        this.props.refresh();
      }
    } else if (socketMsg && socketMsg.msgType == 'taskStatus') {
      //定点集合(url=='/aggpoint/map'&&taskType==5)
      let id = socketMsg.data.id;
      let status = socketMsg.data.status;
      if (
        (url == '/ownround/map' && socketMsg.data.type == 2) ||
        (url == '/gridsearch/map' && socketMsg.data.type == 4) ||
        (url == '/emdep/map' && socketMsg.data.type == 3) ||
        (url == '/itinerancy/detail' && socketMsg.data.type == 6)
      ) {
        this.props.updateTaskStatus(id, status);
      }
      //在任务列表时刷新
      if (url == '/own/OwnTask') {
        this.props.refresh();
      }
    }
  }
  onSelect = (opt) => {
    console.log(opt.props.value);
    this.setState({
      poverVisibe: false,
      selected: opt.props.value,
    });
  };
  handleVisibleChange = (visible) => {
    console.log('visible');
    console.log(visible);
    this.setState({
      poverVisibe: visible,
    });
  };
  showModal = (key) => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  };
  onClose = (key) => () => {
    let { taskType } = this.state;
    let url = this.props.history.location.pathname;
    //定点集合(url=='/aggpoint/map'&&taskType==5)
    if (
      (url == '/ownround/map' && taskType == 2) ||
      (url == '/gridsearch/map' && taskType == 4) ||
      (url == '/emdep/map' && taskType == 3) ||
      (url == '/itinerancy/detail' && taskType == 6)
    ) {
      this.props.closeTask();
    }
    if (url == '/own/OwnTask') {
      this.props.refresh();
    }
    this.setState({
      [key]: false,
    });
  };

  render() {
    const { user, title, pointer, history, customSet, isSet, isSearch, noColor } = this.props;
    let className = noColor ? 'header nobgcolor' : 'header';
    return (
      <div className={className} ref={this.props.myRef}>
        {typeof pointer !== 'undefined' ? (
          <Icon className="header-pointer" size="md" type="left" onClick={this.jump.bind(this)}></Icon>
        ) : null}
        {typeof user !== 'undefined' ? (
          <div className="user-container">
            <em className="user-img"></em>
            <span>{user.name}</span>
          </div>
        ) : null}
        {typeof user !== 'undefined' ? <Link to="/drill/detail" className="header-menu"></Link> : null}
        {typeof title !== 'undefined' ? <span className="header-title">{title}</span> : null}
        {typeof isSet !== 'undefined' ? (
          <Popover
            mask={false}
            visible={this.state.poverVisibe}
            overlay={[
              <Item
                key="1"
                value="name"
                icon={<img src={require('images/own/own-name.svg')} className="am-icon am-icon-xs" alt="" />}
                data-seed="logId"
              >
                点名
              </Item>,
              <Item
                key="2"
                value="dogReport"
                icon={<img src={require('images/own/own-dog.svg')} className="am-icon am-icon-xs" alt="" />}
              >
                犬病上报
              </Item>,
              <Item
                key="3"
                value="leaveApply"
                icon={<img src={require('images/own/own-jia.svg')} className="am-icon am-icon-xs" alt="" />}
              >
                请假申请
              </Item>,
              <Item
                key="4"
                value="track"
                icon={<img src={require('images/own/own-sou.svg')} className="am-icon am-icon-xs" alt="" />}
              >
                网格化搜捕
              </Item>,
            ]}
            onSelect={this.onSelect}
            onVisibleChange={this.handleVisibleChange}
          >
            <span className="header-set">{''}</span>
          </Popover>
        ) : null}
        {typeof customSet !== 'undefined' ? (
          <span className="header-set" onClick={this.handleShow.bind(this)}>
            {''}
          </span>
        ) : null}
        {typeof isSearch !== 'undefined' ? <Icon className="header-search" type="search" size="md" /> : null}
        <Modal
          visible={this.state.modal1}
          transparent
          maskClosable={false}
          onClose={this.onClose('modal1')}
          title="提示信息"
          footer={[
            {
              text: '知道了',
              onPress: () => {
                this.onClose('modal1')();
              },
            },
          ]}
        >
          <div style={{ marginBottom: 15, marginTop: 15, height: 'auto' }}>{this.state.info}</div>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  socketMsg: state.system && state.system.socketMsg,
});
const mapDispatchToProps = (dispatch) => ({
  sysActions: bindActionCreators(systomStatus, dispatch),
  // createSocket: () => dispatch(createSocket()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));

// WEBPACK FOOTER //
// ./src/components/common/Header.js
