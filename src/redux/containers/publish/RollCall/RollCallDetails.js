import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { List, Picker, WingBlank, Toast, Carousel, Modal } from 'antd-mobile';
import Header from 'components/common/Header';
import { createForm } from 'rc-form';
require('style/common/common.less');

const Item = List.Item;

class RollCallDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      value: '',
      val: 1,
      callInfo: null,
      files: null,
      disabled: true,
      data: [],
      imgHeight: 376,
      modal1: false,
    };
    this.timer = null;
  }
  componentDidMount() {
    const currentId = this.props.match.params.id;
    if (currentId) {
      React.$ajax.publish.rollCallInfo({ id: currentId }).then((res) => {
        if (res && res.code == 0) {
          console.log(res);
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
  handleChange(type, date) {
    this.setState({
      [type]: date,
    });
  }
  handleOk() {}

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
    const { getFieldProps } = this.props.form;
    let { files, callInfo, disabled } = this.state;
    return (
      <div className="own-listbox">
        <Header title="点名详情" pointer="pointer" />
        <div>
          <List style={{ backgroundColor: 'white' }} className="date-picker-list">
            <Item extra={callInfo ? callInfo.operatorName : '--'}>提交人</Item>
            <Item>
              图片
              <div style={{ float: 'right', overflowX: 'auto' }}>
                {callInfo && callInfo.photoNames.length > 0
                  ? callInfo.photoNames.map((file, index) => (
                      <img
                        onClick={this.showModal('modal1')}
                        key={index}
                        src={`${config.apiUrl}/api/attendance/img?fileName=${file}`}
                        style={{ height: '60px', width: '60px', marginRight: '8px' }}
                      />
                    ))
                  : '--'}
              </div>
            </Item>
            <Item extra={callInfo ? callInfo.content : '--'}>详情</Item>
          </List>
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
              {callInfo &&
                callInfo.photoNames.map((file) => (
                  <a key={file.id} style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}>
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

const RollCallDetailsForm = createForm()(RollCallDetails);
export default withRouter(RollCallDetailsForm);
