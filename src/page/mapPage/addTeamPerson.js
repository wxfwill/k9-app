import React, { Component } from 'react';
import { Modal, WhiteSpace, WingBlank } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
require('style/mapPage/personnel.less');

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
    this.state = { modal1: true, isDelete: false };
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
    const { isDelete } = this.state;
    return (
      <WingBlank>
        <Modal
          visible={this.state.modal1}
          transparent
          maskClosable={false}
          onClose={this.onClose('modal1')}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          afterClose={() => {
            //alert('afterClose');
          }}
          className="mapPage"
        >
          <div className="personnel-layer">
            <div className="per-head">
              <p className="title">搜捕区域一</p>
            </div>
            <div className="per-main">
              <div className="per-content">
                <div className="per-list">
                  <div className="left-info">
                    <div className="per-name">
                      <p>谢志伟</p>
                      <span>0023</span>
                      <b></b>
                    </div>
                    <p className="per-titme">最新定位时间：2020-04-24 14:32:38</p>
                  </div>
                  <div className="right-del"></div>
                </div>
                <div className="per-list">
                  <div className="left-info">
                    <div className="per-name">
                      <p>谢志伟</p>
                      <span>0023</span>
                    </div>
                    <p className="per-titme">最新定位时间：2020-04-24 14:32:38</p>
                  </div>
                  <div className="right-del">
                    {isDelete ? (
                      <p className="per-delete">确认删除</p>
                    ) : (
                      <img
                        src={require('images/mapPage/delete.svg')}
                        onClick={() => {
                          this.setState({ isDelete: true });
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="per-list">
                  <div className="left-info">
                    <div className="per-name">
                      <p>谢志伟</p>
                      <span>0023</span>
                    </div>
                    <p className="per-titme">最新定位时间：2020-04-24 14:32:38</p>
                  </div>
                  <div className="right-del">
                    <p className="per-delete">确认删除</p>
                  </div>
                </div>
                <div className="per-list">
                  <div className="left-info">
                    <div className="per-name">
                      <p>谢志伟</p>
                      <span>0023</span>
                    </div>
                    <p className="per-titme">最新定位时间：2020-04-24 14:32:38</p>
                  </div>
                  <div className="right-del">
                    <img src={require('images/mapPage/delete.svg')} />
                  </div>
                </div>
                <div className="per-list">
                  <div className="left-info">
                    <div className="per-name">
                      <p>谢志伟</p>
                      <span>0023</span>
                    </div>
                    <p className="per-titme">最新定位时间：2020-04-24 14:32:38</p>
                  </div>
                  <div className="right-del">
                    <img src={require('images/mapPage/delete.svg')} />
                  </div>
                </div>
                <div className="per-list">
                  <div className="left-info">
                    <div className="per-name">
                      <p>谢志伟</p>
                      <span>0023</span>
                    </div>
                    <p className="per-titme">最新定位时间：2020-04-24 14:32:38</p>
                  </div>
                  <div className="right-del">
                    <img src={require('images/mapPage/delete.svg')} />
                  </div>
                </div>
              </div>
            </div>
            <div className="per-foot">
              <p
                className="continue-add"
                onClick={() => {
                  this.props.history.push('/map/assignPerson');
                }}
              >
                <img src={require('images/mapPage/add.svg')} />
                <b>继续添加</b>
              </p>
            </div>
          </div>
        </Modal>
        <WhiteSpace />
      </WingBlank>
    );
  }
}

export default withRouter(TaskDetal);
