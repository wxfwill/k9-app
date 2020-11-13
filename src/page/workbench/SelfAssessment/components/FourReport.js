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

class FourReport extends Component {
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

  //获取自定义分数
  getCustomScore = (item) => {
    return (value) => {
      const { causeList } = this.state;
      causeList.map((el) => {
        if (el.reason == item.reason) {
          el.score = value;
          el.mark = value;
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
        el.mark = e;
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
        el.mark = !isNaN(Number(e)) ? Number(e) : 0;
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
          total += item.mark;
          delete item.score;
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
              4W报备得分
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
                        <Card.Header title={item.reason} extra={<span>{item.travel}次</span>} />
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
                              value={String(item.mark)}
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
const FourReportWrapper = createForm()(FourReport);
module.exports = FourReportWrapper;
