import React, { Component } from 'react';
import { WingBlank, Carousel, Modal } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import Header from 'components/common/Header';
require('./style/index.less');
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
class DetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1: false,
      currentImg: '',
      imgHeight: 376,
    };
  }
  showModal = (key, img) => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
      currentImg: img,
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
    const { details, title } = this.props;
    return (
      <div className="detail-main">
        <Header title={title ? title : '详情'} pointer="pointer" />
        <div className="content">
          <div className="components">
            <div className="detail-component">
              {details && details.length > 0
                ? details.map((item, index) => {
                    return (
                      <div className="infor-list" key={index}>
                        <p>{item.label}</p>
                        <div className="infor-cont">
                          {item.type === 'img' ? (
                            item.value && item.value.length > 0 ? (
                              item.value.map((element, key) => {
                                return (
                                  <img
                                    src={`${config.localUrl}/api/attendance/img?fileName=${element.fileName}`}
                                    onClick={this.showModal(
                                      'modal1',
                                      `${config.localUrl}/api/attendance/img?fileName=${element.fileName}`
                                    )}
                                    key={key}
                                  />
                                );
                              })
                            ) : (
                              <p>--</p>
                            )
                          ) : (
                            <p>{item.value ? item.value : '--'}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                : null}
              <Modal
                visible={this.state.modal1}
                transparent
                maskClosable={false}
                onClose={this.onClose('modal1')}
                title="图片详情"
                footer={[
                  {
                    text: '返回',
                    onPress: () => {
                      console.log('ok');
                      this.onClose('modal1')();
                    },
                  },
                ]}
                wrapProps={{ onTouchStart: this.onWrapTouchStart }}
              >
                <WingBlank>
                  <Carousel autoplay={false} infinite>
                    <a style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}>
                      <img
                        src={this.state.currentImg}
                        alt=""
                        style={{ width: '100%', verticalAlign: 'top' }}
                        onLoad={() => {
                          window.dispatchEvent(new Event('resize'));
                          this.setState({ imgHeight: 'auto' });
                        }}
                      />
                    </a>
                  </Carousel>
                </WingBlank>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(DetailComponent);
