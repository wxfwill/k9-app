// 警犬技能考核得分
import React, { Component } from 'react';
import { Button, Icon, List, Modal, Card, TextareaItem, Slider, Popover, InputItem } from 'antd-mobile';

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

class PoliceDog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      causeList: [],
      score: 0,
      selfMark: 0,
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
  getCustomScore = () => {
    return (value) => {
      this.setState({
        score: value,
        selfMark: value,
      });
    };
  };
  getCustomMark = (e) => {
    this.setState({
      selfMark: e,
    });
  };
  getCustomScores = (e) => {
    this.setState({
      score: !isNaN(Number(e)) && Number(e) >= 0 ? Number(e) : 0,
      selfMark: !isNaN(Number(e)) && Number(e) >= 0 ? Number(e) : 0,
    });
  };

  //关闭表单弹窗，传出数据
  onClose = () => {
    this.props.onClose({ total: Math.round((this.state.selfMark / 2) * 10) / 10, data: this.state.selfMark });
  };

  render() {
    const { visible, score, selfMark } = this.state;
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
              警犬技能考核得分
            </div>
          )}
          className="popup-list"
        >
          <div className="self-assessment">
            <div className="card-list">
              <Card>
                <Card.Header title="警犬技能考核得分" />
                <Card.Body>
                  <div className="score-box">
                    <span>分数</span>
                    <Slider value={score} min={0} max={100} step={0.5} onChange={this.getCustomScore()} />
                    <InputItem
                      value={String(selfMark)}
                      onChange={(e) => this.getCustomMark(e)}
                      onBlur={(e) => this.getCustomScores(e)}
                    />
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

module.exports = PoliceDog;
