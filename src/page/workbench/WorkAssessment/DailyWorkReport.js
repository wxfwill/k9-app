import React, { Component } from 'react';
import { List, Icon } from 'antd-mobile';
import Header from 'components/common/Header';
require('style/publish/public.less');
require('style/page/workbench/WorkAssessment.less');
class DailyWorkReport extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="工作日报" pointer="pointer" />
          <div className="child-container">
            <div className="components daily-workReport">
              <div className="list-box">
                <List>
                  <div className="list-main">
                    <img src={require('images/publish/head.svg')} />
                    <div className="list-right">
                      <p className="name">
                        <b>张三</b>
                        <span>一中队</span>
                      </p>
                      <div className="time-quantum">
                        <p>
                          <img src={require('images/publish/acc.svg')} /> 早晨
                        </p>
                        <p>
                          <img src={require('images/publish/no-acc.svg')} />
                          上午
                        </p>
                        <p>
                          <img src={require('images/publish/acc.svg')} />
                          下午
                        </p>
                        <p>
                          <img src={require('images/publish/acc.svg')} />
                          晚上
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="list-foot">
                    <span>上报日期：2020-10-29</span>
                    <p
                      onClick={() => {
                        this.props.history.push('/workbench/dailyDetails');
                      }}
                    >
                      查看详情 <Icon type="right" />
                    </p>
                  </div>
                </List>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = DailyWorkReport;
