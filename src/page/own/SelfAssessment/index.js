import React, { Component } from 'react';
import { List, DatePicker, Picker } from 'antd-mobile';
import Header from 'components/common/Header';
import moment from 'moment';
import NoData from 'components/common/No-data';

require('style/publish/public.less');
require('style/page/own/SelfAssessment.less');

const Item = List.Item;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

const approvalStateArr = [
  { label: '全部', value: null },
  { label: '未审批', value: 1 },
  { label: '已完成', value: 3 },
];

class SelfAssessmentList extends Component {
  constructor(props) {
    super(props);
    this.userInfor = JSON.parse(sessionStorage.getItem('user'));
    this.state = {
      currPage: 1,
      pageSize: 10,
      repDate: now,
      approvalState: null,
      evaluationList: [],
    };
  }
  componentDidMount() {
    this.getPageSelfEvaluation();
  }
  goToUrl = (id) => {
    this.props.history.push({
      pathname: '/own/SelfAssessmentDetail',
      search: `?detalId=${id}&type=detal`,
    });
  };
  // 获取日期
  getRepDate = (date) => {
    this.setState(
      {
        repDate: date,
      },
      () => {
        this.getPageSelfEvaluation();
      }
    );
  };
  // 获取开始和结束时间
  getTime(type) {
    let time = null;
    const { repDate } = this.state;
    if (repDate) {
      const year = moment(repDate).format('YYYY');
      const m = moment(repDate).format('M');
      const dateObj = util.getMontDateRange(year, m);
      if (type == 'start') {
        time = dateObj.start;
      }
      if (type == 'end') {
        time = dateObj.end;
      }
    }
    return time;
  }
  // 获取审批状态
  getApprovalState = (value) => {
    this.setState(
      {
        approvalState: value,
      },
      () => {
        this.getPageSelfEvaluation();
      }
    );
  };
  //查询列表
  getPageSelfEvaluation = () => {
    const { approvalState, currPage, pageSize } = this.state;
    const reqData = {
      currPage: currPage,
      pageSize: pageSize,
      param: {
        approvalState: approvalState, //审批状态
        repDateEnd: this.getTime('end'), //结束时间
        repDateStart: this.getTime('start'), // 开始时间
        userId: [this.userInfor.id], //当前用户id
        groupId: [this.userInfor.role], //当前用户所在的中队id
      },
    };
    React.$ajax.own.getPageSelfEvaluation(reqData).then((res) => {
      if (res && res.code == 0) {
        const data = res.data;
        this.setState({
          evaluationList: data.list,
        });
      }
    });
  };
  render() {
    const { repDate, approvalState, evaluationList } = this.state;
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="自评上报列表" pointer="pointer" />
          <div className="child-container">
            <div className="components own-self-assessment">
              <div className="search-box">
                <div className="condition c-left">
                  <span className="label">考核时间：</span>
                  <p className="cont">{util.formatDate(new Date(repDate), 'yyyy-MM')}</p>
                  <img src={require('images/own/triangle.svg')} />
                  <DatePicker mode="month" value={repDate} onChange={(date) => this.getRepDate(date)}>
                    <List.Item></List.Item>
                  </DatePicker>
                </div>
                <div className="condition c-right">
                  <span className="label">审批状态：</span>
                  <p className="cont">{approvalState == null ? '全部' : approvalState == 1 ? '未审批' : '已完成'}</p>
                  <img src={require('images/own/triangle.svg')} />
                  <Picker
                    data={approvalStateArr}
                    value={[approvalState]}
                    cols={1}
                    className="forss"
                    onChange={(arr) => this.getApprovalState(arr[0])}
                  >
                    <List.Item></List.Item>
                  </Picker>
                </div>
              </div>
              <div className="main">
                {evaluationList && evaluationList.length > 0 ? (
                  evaluationList.map((item) => {
                    return (
                      <Item
                        key={item.id}
                        arrow="horizontal"
                        thumb={require('images/own/self-assessment.svg')}
                        multipleLine
                        onClick={() => this.goToUrl(item.id)}
                        extra={item.selfSumMark}
                        className="custom-item"
                      >
                        {util.formatDate(new Date(item.reportingDate), 'yyyy-MM-dd')} 自评上报表
                      </Item>
                    );
                  })
                ) : (
                  <NoData />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
module.exports = SelfAssessmentList;
