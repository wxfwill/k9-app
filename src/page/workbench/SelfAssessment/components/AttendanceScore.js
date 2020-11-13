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
      causeList: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible, defaultData } = nextProps;
    this.setState({
      visible: visible,
      causeList: defaultData,
    });
  }

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

  //获取自定义分数
  getCustomScore = (item) => {
    return (value) => {
      const { causeList } = this.state;
      causeList.map((el) => {
        if (el.reason == item.reason) {
          el.score = value;
          el.selfMark = value;
          this.setState({
            causeList: causeList,
          });
        }
      });
    };
  };
  getCustomMark = (e, item) => {
    const { causeList } = this.state;
    causeList.map((el) => {
      if (el.reason == item.reason) {
        el.selfMark = e;
        this.setState({
          causeList: causeList,
        });
      }
    });
  };
  getCustomScores = (e, item) => {
    const { causeList } = this.state;
    causeList.map((el) => {
      if (el.reason == item.reason) {
        el.score = !isNaN(Number(e)) ? Number(e) : 0;
        el.selfMark = !isNaN(Number(e)) ? Number(e) : 0;
        this.setState({
          causeList: causeList,
        });
      }
    });
  };

  //关闭表单弹窗，传出数据
  onClose = () => {
    let arr = [];
    let total = 0; //计算总得分
    this.state.causeList && this.state.causeList.length > 0
      ? this.state.causeList.map((item) => {
          total += item.selfMark;
          //delete item.score;
          //delete item.mark;
          arr.push(item);
        })
      : null;
    this.props.onClose({ total: total, data: arr });
  };

  render() {
    const { visible, causeList } = this.state;
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
              {causeList && causeList.length > 0
                ? causeList.map((item) => {
                    return (
                      <Card key={item.reason}>
                        <Card.Header
                          title={item.reason}
                          //   extra={
                          //     <Popover
                          //       overlayClassName="fortest SelfAssessment-Popover"
                          //       overlayStyle={{ color: 'currentColor' }}
                          //       visible={this.state.visible}
                          //       overlay={
                          //         <div className="detail-box">
                          //           <p>日期：2020-10-21</p>
                          //           <p className="title">详细描述：</p>
                          //           <p>
                          //             一中队应到12人，实到11人，未参加集训1人，一人请假（
                          //             <span style={{ color: 'red' }}>张三</span>）
                          //           </p>
                          //           <p></p>
                          //         </div>
                          //       }
                          //       align={{
                          //         overflow: { adjustY: 0, adjustX: 0 },
                          //         offset: [-10, 0],
                          //       }}
                          //     >
                          //       <span>扣分详情 &gt;</span>
                          //     </Popover>
                          //   }
                        />
                        <Card.Body>
                          <div className="score-box">
                            <span>分数</span>
                            <Slider
                              value={item.score}
                              min={-10}
                              max={10}
                              step={0.5}
                              onChange={this.getCustomScore(item)}
                            />
                            <InputItem
                              value={String(item.selfMark)}
                              onChange={(e) => this.getCustomMark(e, item)}
                              onBlur={(e) => this.getCustomScores(e, item)}
                            />
                          </div>
                        </Card.Body>
                      </Card>
                    );
                  })
                : null}
            </div>
          </div>
        </List>
      </Modal>
    );
  }
}
const AttendanceScoreWrapper = createForm()(AttendanceScore);
module.exports = AttendanceScoreWrapper;
