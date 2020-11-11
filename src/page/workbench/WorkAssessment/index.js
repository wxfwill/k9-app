import React, { Component } from 'react';
import { Button, TextareaItem, Accordion } from 'antd-mobile';
import Header from 'components/common/Header';
import { createForm } from 'rc-form';
require('style/publish/public.less');
require('style/page/workbench/WorkAssessment.less');
class WorkAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onChange = (key) => {
    console.log(key);
  };
  onSubmit = () => {};
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="工作上报" pointer="pointer" />
          <div className="child-container">
            <div className="components">
              <div className="work-assessment">
                <Accordion className="my-accordion" onChange={this.onChange}>
                  <Accordion.Panel header={<p className="time morning">早晨（7:00-8:00）</p>} className="pad">
                    <TextareaItem
                      {...getFieldProps('morning', {
                        initialValue: '这里输入文字',
                      })}
                      rows={5}
                      count={50}
                    />
                  </Accordion.Panel>
                  <Accordion.Panel header={<p className="time forenoon">上午（9:00-11:30）</p>} className="pad">
                    <TextareaItem
                      {...getFieldProps('forenoon', {
                        initialValue: '这里输入文字',
                      })}
                      rows={5}
                      count={50}
                    />
                  </Accordion.Panel>
                  <Accordion.Panel header={<p className="time afternoon">下午（15:00-18:00）</p>} className="pad">
                    <TextareaItem
                      {...getFieldProps('afternoon', {
                        initialValue: '这里输入文字',
                      })}
                      rows={5}
                      count={50}
                    />
                  </Accordion.Panel>
                  <Accordion.Panel header={<p className="time evening">晚上（19:00-22:00）</p>} className="pad">
                    <TextareaItem
                      {...getFieldProps('evening', {
                        initialValue: '这里输入文字',
                      })}
                      rows={5}
                      count={50}
                    />
                  </Accordion.Panel>
                </Accordion>
              </div>
            </div>
          </div>
          <div className="footer-common">
            <Button type="primary" onClick={this.onSubmit}>
              提交
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
const WorkAssessmentWrapper = createForm()(WorkAssessment);
module.exports = WorkAssessmentWrapper;
