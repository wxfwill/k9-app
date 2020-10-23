import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { withRouter } from 'react-router-dom';
import { Modal, List, Button, WhiteSpace, WingBlank, Icon, InputItem, TextareaItem, DatePicker } from 'antd-mobile';
require('style/mapPage/style.less');
require('style/publish/public.less');

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}
class TaskDetal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal2: true,
      date: now,
    };
  }
  showModal = (key) => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  };
  onClose = (key) => () => {
    this.setState({
      [key]: false,
    });
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
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <WingBlank>
        <Button onClick={this.showModal('modal2')}>popup</Button>
        <WhiteSpace />
        <Modal
          popup
          visible={this.state.modal2}
          onClose={this.onClose('modal2')}
          animationType="slide-up"
          afterClose={() => {
            console.log('afterClose');
          }}
          className="mapPage"
        >
          <div className="mapage-layer">
            <div className="mapege-box">
              <div className="form-main">
                <List className="list" style={{ paddingTop: 0 }}>
                  <p className="title">任务名称</p>
                  <InputItem
                    {...getFieldProps('taskName', {
                      initialValue: '网格化搜捕任务',
                      rules: [{ required: true, message: '任务名称不能为空！' }],
                    })}
                    placeholder="请输入任务名称"
                  ></InputItem>
                </List>
                <List className="list">
                  <p className="title">任务内容</p>
                  <TextareaItem
                    {...getFieldProps('taskContent')}
                    clear
                    placeholder="请输入任务内容"
                    autoHeight
                    rows={1}
                  />
                </List>
                <List className="list">
                  <p className="title">执行时间</p>
                  <DatePicker value={this.state.date} onChange={(date) => this.setState({ date })}>
                    <List.Item arrow="horizontal"></List.Item>
                  </DatePicker>
                </List>
              </div>
            </div>
            <div className="btns">
              <Button
                onClick={() => {
                  this.props.history.push('/map/createTask');
                }}
              >
                上一步
              </Button>
              <Button type="primary">发布</Button>
            </div>
          </div>
          {/* <List renderHeader={() => <div>委托买入</div>} className="popup-list">
            {['股票名称', '股票代码', '买入价格'].map((i, index) => (
              <List.Item key={index}>{i}</List.Item>
            ))}
            <List.Item>
              <Button type="primary" onClick={this.onClose('modal2')}>
                买入
              </Button>
            </List.Item>
          </List> */}
        </Modal>
      </WingBlank>
    );
  }
}

const TaskDetalModule = createForm()(TaskDetal);

export default withRouter(TaskDetalModule);
