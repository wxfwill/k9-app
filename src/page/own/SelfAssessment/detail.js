import React, { Component } from 'react';
import { List } from 'antd-mobile';
import Header from 'components/common/Header';
import ValueAssessment from './components/ValueAssessment';
import FourReport from './components/FourReport';
import AttendanceScore from './components/AttendanceScore';
import OtherPoints from './components/OtherPoints';

const Item = List.Item;

require('style/publish/public.less');
require('style/page/own/SelfAssessment.less');
class SelfAssessmentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueSelfSumMark: 0, //价值观考核自评总分
      valueSquadronSumMark: 0, //价值观考核中队总分
      businessSelfSumMark: 0, //业务与内务考核自评总分
      businessSquadronSumMark: 0, //业务与内务考核中队总分
      assessmentValues: null, //价值观考核参数
      otherReasonsDTOS: null, //业务与内考核务参数
      fourWReportStatisticsDTOS: null, //4w报备参数
      attendanceStatisticsDTOS: null, //考勤参数
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
          businessSelfSumMark: data.businessSelfSumMark,
          businessSquadronSumMark: data.businessSquadronSumMark,
          valueSelfSumMark: data.valueSelfSumMark,
          valueSquadronSumMark: data.valueSquadronSumMark,
          assessmentValues: data.assessmentValues,
          otherReasonsDTOS: data.otherReasonsDTOS,
          fourWReportStatisticsDTOS: data.fourWReportStatisticsDTOS,
          attendanceStatisticsDTOS: data.attendanceStatisticsDTOS,
        });
      }
    });
  };
  render() {
    const {
      businessSelfSumMark,
      valueSelfSumMark,
      businessSquadronSumMark,
      valueSquadronSumMark,
      assessmentValues,
      otherReasonsDTOS,
      fourWReportStatisticsDTOS,
      attendanceStatisticsDTOS,
    } = this.state;
    const selftotal = businessSelfSumMark + valueSelfSumMark;
    const total = businessSquadronSumMark + valueSquadronSumMark;
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="我的考核详情" pointer="pointer" />
          <div className="child-container">
            <div className="components own-self-assessment">
              <div className="main detail">
                <div className="top">
                  <Item multipleLine onClick={this.goToUrl} extra={total ? total + '分' : '待审批'} className="custom-item">
                    总分<span>(自评总分：{selftotal}分)</span>
                  </Item>
                </div>
                {/* 价值观考核详情 */}
                <ValueAssessment setData={assessmentValues} mark={valueSquadronSumMark} />
                {/* 4W报备得分 */}
                <FourReport setData={fourWReportStatisticsDTOS} />
                {/* 考勤得分 */}
                <AttendanceScore setData={attendanceStatisticsDTOS} />
                {/* 其它 */}
                <OtherPoints setData={otherReasonsDTOS} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
module.exports = SelfAssessmentDetail;
