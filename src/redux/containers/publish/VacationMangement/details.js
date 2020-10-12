import React, { Component } from 'react';
import {
  List,
  Steps,
  Picker,
  DatePicker,
  TextareaItem,
  InputItem,
  Stepper,
  WhiteSpace,
  WingBlank,
  Button,
  Toast,
  ImagePicker,
  Carousel,
  Modal,
} from 'antd-mobile';
import { createForm } from 'rc-form';
import Header from 'components/common/Header';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
require('style/own/ownLevel.less');
const Item = List.Item;
const Brief = Item.Brief;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const Step = Steps.Step;
function failToast(text, fn) {
  Toast.fail(text, 1);
}
function successToast(text, fn) {
  Toast.success(text, 1, fn, true);
}
class LevelDetailsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: now,
      end: now,
      hasError: false,
      value: '',
      val: 1,
      approvalInfo: null,
      files: null,
      disabled: true,
      data: [],
      imgHeight: 376,
      modal1: false,
    };
    this.timer = null;
  }

  componentDidMount() {
    const currentId = util.urlParse(this.props.location.search).id;
    if (currentId) {
      React.$ajax.publish.getLeaveInfo({ id: currentId }).then((res) => {
        if (res && res.code == 0) {
          console.log(res);
          this.setState({
            approvalInfo: res.data,
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
  handleNumber(type) {
    this.numObj()[type](this);
  }
  numObj() {
    return {
      cut: function (pointer) {
        pointer.setState({ val: pointer.state.val == 1 ? 1 : pointer.state.val - 0.5 });
      },
      add: function (pointer) {
        pointer.setState({ val: pointer.state.val + 0.5 });
      },
    };
  }
  handleSubmit(id) {
    let _this = this;
    React.$ajax.publish.leaveAfterApply({ id: id }).then((res) => {
      if (res && res.code == 0) {
        let { history } = _this.props;
        Toast.info('销假成功!');
        history.goBack();
      } else {
        Toast.info(res.msg);
        return;
      }
    });
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
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  };

  render() {
    const { getFieldProps } = this.props.form;
    let { files, approvalInfo, disabled } = this.state;
    console.log(approvalInfo, '=============================');
    if (approvalInfo) {
      console.log(approvalInfo.status, '00000000000000000000');
    }
    return (
      <div className="OwnLevel">
        <Header title="请假申请详情" pointer="pointer" />
        <div>
          <List style={{ backgroundColor: 'white' }} className="date-picker-list">
            <Item extra={approvalInfo ? approvalInfo.typeName : '--'}>请假类型</Item>
            <Item extra={approvalInfo ? moment(approvalInfo.leaveStartTime).format('YYYY-MM-DD h:mm:ss') : '--'}>
              开始时间
            </Item>
            <Item extra={approvalInfo ? moment(approvalInfo.leaveEndTime).format('YYYY-MM-DD h:mm:ss') : '--'}>
              结束时间
            </Item>
            <Item extra={approvalInfo ? approvalInfo.duration : '--'}>请假时长</Item>
            <Item>
              图片
              <div style={{ float: 'right', overflowX: 'auto' }}>
                {approvalInfo && approvalInfo.fileList.length > 0
                  ? approvalInfo.fileList.map((file) => (
                      <img
                        onClick={this.showModal('modal1')}
                        key={file.id}
                        src={`${config.apiUrl}/api/leaveRecord/img?fileName=${file.fileName}`}
                        style={{ height: '60px', width: '60px', marginRight: '8px' }}
                      />
                    ))
                  : '--'}
              </div>
            </Item>
            <Item extra={approvalInfo ? approvalInfo.remark : '--'}>请假事由</Item>
          </List>
          <div className="step-list">
            <Steps
              size="small"
              current={
                approvalInfo
                  ? approvalInfo.status >= 2
                    ? approvalInfo.applys.length + 1
                    : approvalInfo.applys.length
                  : 0
              }
            >
              {approvalInfo && approvalInfo.applys.length > 0 ? (
                <Step
                  title={
                    <Item style={{ marginBottom: '6px' }}>
                      {
                        <div style={{ fontSize: '14px' }}>
                          {approvalInfo.name}&nbsp;&nbsp;&nbsp;
                          {moment(approvalInfo.applyTime).format('YYYY-MM-DD h:mm:ss')}
                          <div style={{ color: '#15c619' }}>提交</div>
                        </div>
                      }
                    </Item>
                  }
                  key={approvalInfo.id}
                  description=""
                ></Step>
              ) : null}
              {approvalInfo && approvalInfo.applys.length > 0
                ? approvalInfo.applys.map((message, index) => (
                    <Step
                      status={message.approveStatus != 2 ? '' : 'error'}
                      title={
                        <Item style={{ marginBottom: '6px' }}>
                          {index < approvalInfo.applys.length - 1 ? (
                            <div style={{ fontSize: '14px' }}>
                              {message.approveUserName}&nbsp;&nbsp;&nbsp;
                              {moment(message.chgDate).format('YYYY-MM-DD h:mm:ss')}
                              {message.approveStatus != 2 ? (
                                <div style={{ color: '#15c619' }}>审批（{message.approveComment}）</div>
                              ) : (
                                <div style={{ color: '#e60012' }}>驳回（{message.approveComment}）</div>
                              )}
                            </div>
                          ) : (
                            <div style={{ fontSize: '14px' }}>
                              {message.approveUserName}&nbsp;&nbsp;&nbsp;
                              {moment(message.chgDate).format('YYYY-MM-DD h:mm:ss')}{' '}
                              {message.approveStatus != 2 ? (
                                message.approveStatus == 0 ? (
                                  <div style={{ color: '#ff9e00' }}>待审批</div>
                                ) : (
                                  <div style={{ color: '#15c619' }}>审批（{message.approveComment}）</div>
                                )
                              ) : (
                                <div style={{ color: '#e60012' }}>驳回（{message.approveComment}）</div>
                              )}
                            </div>
                          )}
                        </Item>
                      }
                      key={message.id}
                      description=""
                    ></Step>
                  ))
                : null}

              {approvalInfo && approvalInfo.status >= 2 ? (
                <Step
                  status={approvalInfo.status == 3 ? 'finish' : ''}
                  title={
                    <Item style={{ marginBottom: '6px' }}>
                      {
                        <div style={{ fontSize: '14px' }}>
                          {approvalInfo.name}&nbsp;&nbsp;&nbsp;
                          {moment(approvalInfo.reportBackTime ? approvalInfo.reportBackTime : new Date()).format(
                            'YYYY-MM-DD h:mm:ss'
                          )}
                          {approvalInfo.status == 2 ? (
                            <div style={{ color: '#ff9e00' }}>待销假</div>
                          ) : (
                            <div style={{ color: '#15c619' }}>已销假</div>
                          )}
                        </div>
                      }
                    </Item>
                  }
                  key={approvalInfo.id + '1'}
                  description=""
                ></Step>
              ) : null}
            </Steps>
          </div>
        </div>
        <div className="foot">
          <WingBlank>
            {disabled && approvalInfo && approvalInfo.status == 2 ? (
              <div>
                <Button className="submit" onClick={() => this.handleSubmit(approvalInfo.id)}>
                  销假
                </Button>
                <WhiteSpace />
              </div>
            ) : null}
          </WingBlank>
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
              {approvalInfo &&
                approvalInfo.fileList.map((file) => (
                  <a key={file.id} style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}>
                    <img
                      src={`${config.apiUrl}/api/leaveRecord/img?fileName=${file.fileName}`}
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

const LevelDetails = createForm()(LevelDetailsComponent);
export default withRouter(LevelDetails);

// WEBPACK FOOTER //
// ./src/components/own/OwnLevel/LevelDetails.js
