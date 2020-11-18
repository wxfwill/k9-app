// 价值观考核得分
import React, { Component } from 'react';
import { Icon, List, Modal, Card, TextareaItem, Slider, Popover, InputItem, Toast } from 'antd-mobile';
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

class ValueAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      causeList: [
        {
          name: '表现/忠诚',
          explain: '',
          score: 0,
          mark: 0,
          itemSelfMark: 'itemOneSelfMark',
          itemExplain: 'itemOneExplain',
        },
        {
          name: '激情/干净',
          explain: '',
          score: 0,
          mark: 0,
          itemSelfMark: 'itemTwoSelfMark',
          itemExplain: 'itemTwoExplain',
        },
        {
          name: '团结/担当',
          explain: '',
          score: 0,
          mark: 0,
          itemSelfMark: 'itemThreeSelfMark',
          itemExplain: 'itemThreeExplain',
        },
        {
          name: '奉献',
          explain: '',
          score: 0,
          mark: 0,
          itemSelfMark: 'itemFourSelfMark',
          itemExplain: 'itemFourExplain',
        },
      ],
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

  //获取备注
  getCustomCause = (e, item) => {
    const { causeList } = this.state;
    causeList.map((el) => {
      if (el.name == item.name) {
        el.explain = e;
        this.setState({
          causeList: causeList,
        });
      }
    });
  };
  //获取自定义分数
  getCustomScore = (item) => {
    return (value) => {
      const { causeList } = this.state;
      causeList.map((el) => {
        if (el.name == item.name) {
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
      if (el.name == item.name) {
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
      if (el.name == item.name) {
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
    let obj = {};
    let total = 0; //计算总得分
    let isPass = true;
    this.state.causeList.map((item) => {
      if (!item.explain) {
        isPass = false;
      }
      total += item.mark;
      obj[item.itemSelfMark] = item.mark;
      obj[item.itemExplain] = item.explain;
      //delete item.score;
    });
    // if (!isPass) {
    //   Toast.fail('备注信息填写不完整！', 1);
    //   return;
    // }
    this.props.onClose({ total: total, data: obj });
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
              价值观考核得分
            </div>
          )}
          className="popup-list"
        >
          <div className="self-assessment">
            <div className="card-list">
              {causeList && causeList.length > 0
                ? causeList.map((item) => {
                    return (
                      <Card key={item.name}>
                        <Card.Header title={item.name} />
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
                        <Card.Footer
                          content={
                            <TextareaItem
                              rows={2}
                              placeholder="请输入备注"
                              value={item.explain}
                              onChange={(e) => this.getCustomCause(e, item)}
                            />
                          }
                        />
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
const ValueAssessmentWrapper = createForm()(ValueAssessment);
module.exports = ValueAssessmentWrapper;
