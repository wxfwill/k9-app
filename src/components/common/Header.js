import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Icon, DatePicker, Modal, Popover } from 'antd-mobile';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import * as systomStatus from 'actions/systomStatus';
import { saveSocketNewList } from 'store/actions/websocketAction';
import { sendMessage } from 'components/common/websocket';

import { quickData } from 'localData/other';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const Item = Popover.Item;
require('style/common/header.less');
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1: false,
      customContent1: null,
      isShow: false,
      date: now,
      info: '',
      taskType: '',
      poverVisibe: false,
    };
  }
  jump() {
    const { history } = this.props;
    history.goBack();
  }
  handleShow() {
    this.props.handleShow();
  }
  componentDidMount() {
    this.props.changeTimeList && this.props.changeTimeList(null);
    sendMessage({ serviceCode: 'statisticsMsgTips', payload: JSON.stringify({ status: 0 }) }, (data) => {
      console.log('发送成功statisticsMsgTips成功');
      console.log(JSON.parse(data));
      let res = JSON.parse(data);
      if (res.code === 0) {
        // 消息统计
        if (res.serviceCode == 'statisticsMsgTips') {
          console.log('消息统计');
          console.log(res.data);
          this.props.SocketNewListActions(res.data);
        }
      }
    });
    if (this.props.customContent) {
      this.setState({ customContent1: this.props.customContent });
    }
  }
  componentWillUnmount() {}
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
    console.log(opt);
    if(opt.props.value=='网格化搜捕') {
        console.log('进入地图');
        util.CallApp({
          callAppName: 'map',
        });
        return;
    }
    let { history } = this.props;
    this.setState({
      poverVisibe: false,
    });
    opt.props.link && history.push(`${opt.props.link}?titleType=${opt.props.value}`);
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
  handleChange = (data) => {
    console.log('ok');
    console.log(data);
    let time = util.formatDate(new Date(data), 'yyyy-MM-dd');
    this.setState({ customContent1: time });
    this.setState({ date: data });
    this.setState({ isShow: !this.state.isShow });
    this.props.changeTimeList(time);
  };
  hanleCancel = () => {
    this.setState({ isShow: !this.state.isShow });
  };
  handleClick = (e) => {
    e.stopPropagation();
    this.setState({ isShow: !this.state.isShow });
  };
  handleRightClick = (e) => {
    this.props.handleRightTitleClick();
  };
  render() {
    const { user, title, pointer, history, customContent, isSet, isSearch, noColor, customRightTitle, jumpCallBack } = this.props;

    let className = noColor ? 'header nobgcolor' : 'header';
    return (
      <div className={className} ref={this.props.myRef}>
        {typeof pointer !== 'undefined' ? (
          <Icon className="header-pointer" size="md" type="left" onClick={jumpCallBack ? ()=>{jumpCallBack()}:this.jump.bind(this)}></Icon>
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
            overlay={quickData.map((item, index) => {
              return (
                <Item
                  key={index}
                  value={item.title}
                  link={item.link}
                  icon={<img src={item.icon} className="am-icon am-icon-xs" alt="" />}
                >
                  {item.title}
                </Item>
              );
            })}
            onSelect={this.onSelect}
            onVisibleChange={this.handleVisibleChange}
          >
            <span className="header-set">{''}</span>
          </Popover>
        ) : null}
        {typeof customContent !== 'undefined' ? (
          <DatePicker
            mode="date"
            title="选择日期"
            value={this.state.date}
            onOk={this.handleChange.bind(this)}
            onDismiss={this.hanleCancel.bind(this)}
          >
            <span className="header-custom" onClick={(e) => this.handleClick(e)}>
              {this.state.customContent1}
              {this.state.isShow ? (
                <Icon className="icon-down" size="xs" type="up" color="#4B4C4F"></Icon>
              ) : (
                <Icon className="icon-down" size="xs" type="down" color="#4B4C4F"></Icon>
              )}
            </span>
          </DatePicker>
        ) : null}
        {typeof customRightTitle !== 'undefined' ? (
          <span className="header-customRightTitle" onClick={(e) => this.handleRightClick(e)}>
            {customRightTitle}
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
  socketNewList: state.socketReducer.newLIst,
});
const mapDispatchToProps = (dispatch) => ({
  sysActions: bindActionCreators(systomStatus, dispatch),
  SocketNewListActions: (list) => dispatch(saveSocketNewList(list)),
  // createSocket: () => dispatch(createSocket()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
