import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, List, Button, WhiteSpace, WingBlank, Icon, Stepper } from 'antd-mobile';

import ButtonComponent from 'components/mapPage/buttonComponent.js';

require('style/mapPage/style.less');
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
class CreateTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal2: true,
      val: 0,
      val1: 0,
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
  onChange = (val) => {
    // console.log(val);
    this.setState({ val });
  };
  onChange1 = (val1) => {
    // console.log(val);
    this.setState({ val1 });
  };
  render() {
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
          <ButtonComponent middleColor="gray" />
          <ButtonComponent middleColor="red" />
          <ButtonComponent />
          <div className="mapage-layer">
            <div className="mapege-box">
              <div className="stepper-box">
                <List>
                  <List.Item
                    wrap
                    extra={
                      <Stepper
                        style={{ width: '100%', minWidth: '100px' }}
                        showNumber
                        max={10}
                        min={0}
                        value={this.state.val}
                        onChange={this.onChange}
                      />
                    }
                  >
                    请输入搜索范围（公里）
                  </List.Item>
                  <List.Item
                    extra={
                      <Stepper
                        style={{ width: '100%', minWidth: '100px' }}
                        showNumber
                        max={10}
                        min={0}
                        value={this.state.val1}
                        onChange={this.onChange1}
                      />
                    }
                  >
                    请输入网格数量
                  </List.Item>
                </List>
              </div>
            </div>
            <div className="btns">
              <Button
                onClick={() => {
                  this.props.history.push('/check');
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  this.props.history.push('/map/pushTask');
                }}
              >
                下一步
              </Button>
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

export default withRouter(CreateTask);
