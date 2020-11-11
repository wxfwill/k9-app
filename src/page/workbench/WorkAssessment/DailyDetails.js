import React, { Component } from 'react';
import { Card, WingBlank, WhiteSpace } from 'antd-mobile';
import Header from 'components/common/Header';
require('style/publish/public.less');
require('style/page/workbench/WorkAssessment.less');
class DailyDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="工作日报详情" pointer="pointer" />
          <div className="child-container">
            <div className="components daily-details-components">
              <div className="daily-details">
                <WingBlank size="lg">
                  <WhiteSpace size="lg" />
                  <Card>
                    <Card.Header title="早晨（7:00-9:00）" />
                    <Card.Body>
                      <div>早上起床集合，操场进行训练。</div>
                    </Card.Body>
                  </Card>
                  <WhiteSpace size="lg" />
                  <Card>
                    <Card.Header title="上午（9:00-13:30）" />
                    <Card.Body>
                      <div>早上起床集合，操场进行训练。</div>
                    </Card.Body>
                  </Card>
                  <WhiteSpace size="lg" />
                  <Card>
                    <Card.Header title="下午（15:00-18:00）" />
                    <Card.Body>
                      <div>早上起床集合，操场进行训练。</div>
                    </Card.Body>
                  </Card>
                  <WhiteSpace size="lg" />
                  <Card>
                    <Card.Header title="晚上（19:00-22:00）" />
                    <Card.Body>
                      <div>早上起床集合，操场进行训练。</div>
                    </Card.Body>
                  </Card>
                  <WhiteSpace size="lg" />
                </WingBlank>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = DailyDetails;
