// 价值观考核得分
import React, { Component } from 'react';
import { Button, Icon, List, Modal, Card, TextareaItem, Slider, Popover, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';

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

class AttendanceScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    this.setState({
      visible: visible,
    });
  }

  onClose = () => {
    this.props.onClose({ a: 'ppp' });
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

  log = (name) => {
    return (value) => {
      console.log(`${name}: ${value}`);
    };
  };

  render() {
    const { visible } = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <Modal
        popup
        visible={visible}
        onClose={this.onClose}
        animationType="slide-up"
        afterClose={() => {
          //alert('afterClose');
        }}
        className="SelfAssessment-Modal"
      >
        <List
          renderHeader={() => (
            <div className="modal-title">
              <Icon type="left" onClick={this.onClose} />
              考勤得分
            </div>
          )}
          className="popup-list"
        >
          <div className="self-assessment">
            <div className="card-list">
              <Card>
                <Card.Header
                  title="事假"
                  extra={
                    <Popover
                      overlayClassName="fortest SelfAssessment-Popover"
                      overlayStyle={{ color: 'currentColor' }}
                      visible={this.state.visible}
                      overlay={
                        <div className="detail-box">
                          <p>日期：2020-10-21</p>
                          <p className="title">详细描述：</p>
                          <p>
                            一中队应到12人，实到11人，未参加集训1人，一人请假（
                            <span style={{ color: 'red' }}>张三</span>）
                          </p>
                          <p></p>
                        </div>
                      }
                      align={{
                        overflow: { adjustY: 0, adjustX: 0 },
                        offset: [-10, 0],
                      }}
                    >
                      <span>扣分详情 &gt;</span>
                    </Popover>
                  }
                />
                <Card.Body>
                  <div className="score-box">
                    <span>分数</span>
                    <Slider
                      defaultValue={10}
                      min={0}
                      max={30}
                      onChange={this.log('change')}
                      onAfterChange={this.log('afterChange')}
                    />
                    <div className="score"></div>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Header title="迟到" />
                <Card.Body>
                  <div className="score-box">
                    <span>分数</span>
                    <Slider
                      defaultValue={10}
                      min={0}
                      max={30}
                      onChange={this.log('change')}
                      onAfterChange={this.log('afterChange')}
                    />
                    <div className="score"></div>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Header title="旷工" />
                <Card.Body>
                  <div className="score-box">
                    <span>分数</span>
                    <Slider
                      defaultValue={10}
                      min={0}
                      max={30}
                      onChange={this.log('change')}
                      onAfterChange={this.log('afterChange')}
                    />
                    <div className="score"></div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </List>
      </Modal>
    );
  }
}
const AttendanceScoreWrapper = createForm()(AttendanceScore);
module.exports = AttendanceScoreWrapper;
