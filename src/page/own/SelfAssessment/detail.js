import React, { Component } from 'react';
import { List, Card } from 'antd-mobile';
import Header from 'components/common/Header';
import ValueAssessment from './components/ValueAssessment';
import OtherPoints from './components/OtherPoints';

const Item = List.Item;

require('style/publish/public.less');
require('style/page/own/SelfAssessment.less');
class SelfAssessmentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueSelfSumMark: 0, //价值观考核自评总分
      businessSelfSumMark: 0, //业务与内务考核自评总分
      assessmentValues: null, //价值观考核参数
      otherReasonsDTOS: null, //业务与内考核务参数
    };
  }
  componentDidMount() {
    if (util.urlParse(this.props.location.search).detalId) {
      let id = util.urlParse(this.props.location.search).detalId;
      this.getSelfEvaluation(id);
    }
  }
  getSelfEvaluation = (assessmentId) => {
    React.$ajax.own.getSelfEvaluation({ assessmentId }).then((res) => {
      if (res && res.code == 0) {
        const data = res.data;
        this.setState({
          businessSelfSumMark: data.businessSelfSumMark ? data.businessSelfSumMark : 0,
          valueSelfSumMark: data.valueSelfSumMark ? data.valueSelfSumMark : 0,
          assessmentValues: data.assessmentValues,
          otherReasonsDTOS: data.otherReasonsDTOS,
        });
      }
    });
  };
  render() {
    const { businessSelfSumMark, valueSelfSumMark, assessmentValues, otherReasonsDTOS } = this.state;
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="自评上报详情" pointer="pointer" />
          <div className="child-container">
            <div className="components own-self-assessment">
              <div className="main detail">
                <div className="top">
                  <Item
                    multipleLine
                    onClick={this.goToUrl}
                    extra={businessSelfSumMark + valueSelfSumMark + '分'}
                    className="custom-item"
                  >
                    总分
                  </Item>
                </div>
                {/* 价值观考核详情 */}
                {assessmentValues ? <ValueAssessment setData={assessmentValues} mark={valueSelfSumMark} /> : null}
                {/* 业务与内务考核得分 */}
                {otherReasonsDTOS ? <OtherPoints setData={otherReasonsDTOS} mark={businessSelfSumMark} /> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
module.exports = SelfAssessmentDetail;
