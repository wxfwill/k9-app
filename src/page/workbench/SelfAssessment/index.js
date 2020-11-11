import React, { Component } from 'react';
import { Button, Icon, List, Modal, Card, TextareaItem, Slider, Popover, InputItem } from 'antd-mobile';
import Header from 'components/common/Header';
import { createForm } from 'rc-form';
require('style/publish/public.less');
require('style/page/workbench/SelfAssessment.less');

const Item = List.Item;

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
class SelfAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openjiazhi: false,
      open4W: false,
      openCheckingin: false,
      openOther: false,
      visible: false,
      causeList: [],
    };
  }
  addCauseList = () => {
    let arr = this.state.causeList;
    arr.push({ title: '000' });
    this.setState({
      causeList: arr,
    });
  };
  onSubmit = () => {};

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
    const { causeList } = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="自评表上报" pointer="pointer" />
          <div className="child-container">
            <div className="components">
              <div className="self-assessment">
                <List>
                  <Item extra={<p style={{ color: '#2D2E31' }}>自评分：90</p>}>姓名：张三</Item>
                  <Item extra="待评分" arrow="horizontal" onClick={this.showModal('openjiazhi')}>
                    价值观考核得分
                  </Item>
                  <Item extra="待评分" arrow="horizontal" onClick={this.showModal('open4W')}>
                    4W报备得分
                  </Item>
                  <Item extra="-4.5" arrow="horizontal" onClick={this.showModal('openCheckingin')}>
                    考勤得分
                  </Item>
                  <Item extra="待评分" arrow="horizontal" onClick={this.showModal('openOther')}>
                    业务与内务考核得分
                  </Item>
                </List>
              </div>
            </div>
          </div>
          <div className="footer-common">
            <Button type="primary">提交</Button>
          </div>
        </div>
        {/* 价值观考核得分 */}
        <Modal
          popup
          visible={this.state.openjiazhi}
          onClose={this.onClose('openjiazhi')}
          animationType="slide-up"
          afterClose={() => {
            //alert('afterClose');
          }}
          className="SelfAssessment-Modal"
        >
          <List
            renderHeader={() => (
              <div className="modal-title">
                <Icon type="left" onClick={this.onClose('openjiazhi')} />
                价值观考核得分
              </div>
            )}
            className="popup-list"
          >
            <div className="self-assessment">
              <div className="card-list">
                <Card>
                  <Card.Header title="表现/忠诚" />
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
                  <Card.Footer
                    content={
                      <TextareaItem
                        {...getFieldProps('biaoxian', {
                          initialValue: '',
                        })}
                        rows={2}
                        placeholder="请输入备注"
                      />
                    }
                  />
                </Card>
                <Card>
                  <Card.Header title="激情/干净" />
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
                  <Card.Footer
                    content={
                      <TextareaItem
                        {...getFieldProps('biaoxian', {
                          initialValue: '',
                        })}
                        rows={2}
                        placeholder="请输入备注"
                      />
                    }
                  />
                </Card>
                <Card>
                  <Card.Header title="价值观考核" />
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
                  <Card.Footer
                    content={
                      <TextareaItem
                        {...getFieldProps('biaoxian', {
                          initialValue: '',
                        })}
                        rows={2}
                        placeholder="请输入备注"
                      />
                    }
                  />
                </Card>
              </div>
            </div>
          </List>
        </Modal>
        {/* 4W报备得分 */}
        <Modal
          popup
          visible={this.state.open4W}
          onClose={this.onClose('open4W')}
          animationType="slide-up"
          afterClose={() => {
            //alert('afterClose');
          }}
          className="SelfAssessment-Modal"
        >
          <List
            renderHeader={() => (
              <div className="modal-title">
                <Icon type="left" onClick={this.onClose('open4W')} />
                4W报备得分
              </div>
            )}
            className="popup-list"
          >
            <div className="self-assessment">
              <div className="card-list">
                <Card>
                  <Card.Header
                    title="抓捕现场"
                    extra={
                      <Popover
                        overlayClassName="fortest SelfAssessment-Popover"
                        overlayStyle={{ color: 'currentColor' }}
                        visible={this.state.visible}
                        overlay={<div>heheheh</div>}
                        align={{
                          overflow: { adjustY: 0, adjustX: 0 },
                          offset: [-10, 0],
                        }}
                      >
                        <span>12次 &gt;</span>
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
                  <Card.Header title="安检任务" />
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
                  <Card.Header title="实战演练" />
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
                  <Card.Header title="带班训练" />
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
        {/* 考勤得分 */}
        <Modal
          popup
          visible={this.state.openCheckingin}
          onClose={this.onClose('openCheckingin')}
          animationType="slide-up"
          afterClose={() => {
            //alert('afterClose');
          }}
          className="SelfAssessment-Modal"
        >
          <List
            renderHeader={() => (
              <div className="modal-title">
                <Icon type="left" onClick={this.onClose('openCheckingin')} />
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
        {/* 业务与内务考核得分 */}
        <Modal
          popup
          visible={this.state.openOther}
          onClose={this.onClose('openOther')}
          animationType="slide-up"
          afterClose={() => {
            //alert('afterClose');
          }}
          className="SelfAssessment-Modal"
        >
          <List
            renderHeader={() => (
              <div className="modal-title">
                <Icon type="left" onClick={this.onClose('openOther')} />
                业务与内务考核得分
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
                                <InputItem {...getFieldProps('input' + index)} placeholder="请输入" />
                              </div>
                            }
                          />
                          <Card.Body>
                            <div className="score-box">
                              <span>分数</span>
                              <Slider
                                defaultValue={0}
                                min={-30}
                                max={30}
                                onChange={this.log('change')}
                                onAfterChange={this.log('afterChange')}
                              />
                              <div className="score"></div>
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
      </div>
    );
  }
}
const SelfAssessmentWrapper = createForm()(SelfAssessment);
module.exports = SelfAssessmentWrapper;
