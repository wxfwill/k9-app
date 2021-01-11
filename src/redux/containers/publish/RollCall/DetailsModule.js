import React, { Component } from 'react';
import { Toast, WingBlank, Carousel, Modal } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
require('./style.less');
class DetailsModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callInfo: {},
      imgHeight: 376,
      modal1: false,
    };
  }
  componentDidMount() {
    const currentId = this.props.id;
    if (currentId) {
      React.$ajax.publish.rollCallInfo({ id: currentId }).then((res) => {
        console.log(res, '================================');
        if (res && res.code == 0) {
          this.setState({
            callInfo: res.data,
          });
        } else {
          Toast.info(res.msg);
          return;
        }
      });
    }
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
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    // const pNode = closest(e.target, '.am-modal-content');
    // if (!pNode) {
    //   e.preventDefault();
    // }
  };
  render() {
    const { callInfo } = this.state;
    return (
      <div>
        <div className="infor-list">
          <p>时间</p>
          <div className="infor-cont">
            <p>{callInfo.opTime ? util.formatDate(callInfo.opTime, 'yyyy-MM-dd hh:mm:ss') : '--'}</p>
          </div>
        </div>
        <div className="infor-list">
          <p>照片</p>
          <div className="infor-cont">
            {callInfo.photoNames && callInfo.photoNames.length > 0 ? (
              <img
                src={`${config.apiUrl}/api/attendance/img?fileName=${callInfo.photoNames[0]}`}
                onClick={this.showModal('modal1')}
              />
            ) : (
              '--'
            )}
          </div>
        </div>
        <div className="infor-list">
          <p>备注</p>
          <div className="infor-cont">
            <p>{callInfo.content ? callInfo.content : '--'}</p>
          </div>
        </div>
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
              {callInfo.photoNames &&
                callInfo.photoNames.map((file, index) => (
                  <a key={index} style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}>
                    <img
                      src={`${config.apiUrl}/api/attendance/img?fileName=${file}`}
                      alt=""
                      style={{ width: '100%', verticalAlign: 'top' }}
                      onLoad={() => {
                        window.dispatchEvent(new Event('resize'));
                        this.setState({ imgHeight: 'auto' });
                      }}
                    />
                  </a>
                ))}
            </Carousel>
          </WingBlank>
        </Modal>
      </div>
    );
  }
}

export default withRouter(DetailsModule);
