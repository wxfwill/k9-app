// 价值观考核得分
import React, { Component } from 'react';
import { Button, Icon, List, Modal, Card, Slider, InputItem, Toast } from 'antd-mobile';
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

class OtherPoints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      causeList: [], //自定义新增考核项
      customIndex: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    this.setState({
      visible: visible,
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

  // 新增考核项
  addCauseList = () => {
    let index = this.state.customIndex + 1;
    let arr = this.state.causeList;
    arr.push({
      key: index,
      reason: '',
      score: 0,
      selfMark: 0,
    });
    this.setState({
      causeList: arr,
      customIndex: index,
    });
  };
  //获取新增考核项原因的值
  getCustomCause = (e, item) => {
    const { causeList } = this.state;
    causeList.map((el) => {
      if (el.key == item.key) {
        el.reason = e;
        this.setState({
          causeList: causeList,
        });
      }
    });
  };
  //获取新增考核原因自定义分数
  getCustomScore = (item) => {
    return (value) => {
      const { causeList } = this.state;
      causeList.map((el) => {
        if (el.key == item.key) {
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
      if (el.key == item.key) {
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
      if (el.key == item.key) {
        el.score = !isNaN(Number(e)) ? Number(e) : 0;
        el.selfMark = !isNaN(Number(e)) ? Number(e) : 0;
        this.setState({
          causeList: causeList,
        });
      }
    });
  };
  //删除新增项
  deleteCustomItem = (item) => {
    const { causeList } = this.state;
    causeList.map((el, index) => {
      if (el.key == item.key) {
        causeList.splice(index, 1);
        this.setState({
          causeList: causeList,
        });
      }
    });
  };

  //关闭表单弹窗，传出数据
  onClose = () => {
    const { causeList } = this.state;
    let total = 0; //计算总得分
    let isPass = true;
    causeList && causeList.length > 0
      ? causeList.map((item) => {
          if (!item.reason) {
            isPass = false;
          }
          total += item.selfMark;
          //delete item.score;
          //delete item.key;
        })
      : null;
    if (!isPass) {
      Toast.fail('加减分原因填写不完整！', 1);
      return;
    }
    this.props.onClose({ total: total, data: causeList });
  };

  render() {
    const { visible, causeList } = this.state;
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
              其它得分
            </div>
          )}
          className="popup-list"
        >
          <div className="self-assessment">
            <div className="card-list">
              {causeList && causeList.length > 0
                ? causeList.map((item, index) => {
                    return (
                      <Card key={index}>
                        <Card.Header
                          title={
                            <div className="card-title">
                              <p>加减分原因：</p>
                              <InputItem
                                value={item.reason}
                                placeholder="请输入"
                                onChange={(e) => this.getCustomCause(e, item)}
                              />
                              <Icon
                                type="cross"
                                onClick={() => {
                                  this.deleteCustomItem(item);
                                }}
                              />
                            </div>
                          }
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
            <div className="add-cause-btn">
              <Button onClick={this.addCauseList}>
                <b>+</b> 新增考核项
              </Button>
            </div>
          </div>
        </List>
      </Modal>
    );
  }
}
const OtherPointsWrapper = createForm()(OtherPoints);
module.exports = OtherPointsWrapper;
