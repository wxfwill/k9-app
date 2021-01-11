import React from 'react';
import { List, DatePicker, Picker, ListView } from 'antd-mobile';
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

function MyBody(props) {
  return <div className="am-list-body my-body">{props.children}</div>;
}

class SelfAssessmentList extends React.Component {
  constructor(props) {
    super(props);
    this.userInfor = JSON.parse(sessionStorage.getItem('user'));
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      currPage: 1,
      pageSize: 10,
      totalPage: 0,
      repDate: null, //now,
      approvalState: null,
      evaluationList: [],
      isLoading: true,
      hasMore: true,
      dataSource: ds,
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
        currPage: 1,
        evaluationList: [],
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
        currPage: 1,
        evaluationList: [],
      },
      () => {
        this.getPageSelfEvaluation();
      }
    );
  };
  //查询列表
  getPageSelfEvaluation = () => {
    this.setState({
      hasMore: false,
    });
    const { approvalState, currPage, pageSize, evaluationList, dataSource } = this.state;
    const reqData = {
      currPage: currPage,
      pageSize: pageSize,
      param: {
        approvalState: approvalState, //审批状态
        repDateEnd: this.getTime('end'), //结束时间
        repDateStart: this.getTime('start'), // 开始时间
        userId: this.userInfor.id ? [this.userInfor.id] : null, //当前用户id
        groupId: this.userInfor.role ? [this.userInfor.role] : null, //当前用户所在的中队id
      },
    };
    React.$ajax.own.getPageSelfEvaluation(reqData).then((res) => {
      if (res && res.code == 0) {
        const data = res.data;
        this.setState(
          {
            evaluationList: [...evaluationList, ...data.list],
            isLoading: false,
            hasMore: true,
            totalPage: data.totalPage,
          },
          () => {
            this.setState({
              dataSource: dataSource.cloneWithRows(this.state.evaluationList),
            });
          }
        );
      }
    });
  };

  onEndReached = (event) => {
    const { isLoading, hasMore, currPage, totalPage } = this.state;
    if (isLoading && !hasMore) {
      return;
    }
    if (currPage < totalPage) {
      this.setState({ isLoading: true, currPage: currPage + 1 });
      this.getPageSelfEvaluation();
    }
  };

  render() {
    const { repDate, approvalState, evaluationList } = this.state;
    const row = (rowData) => {
      const item = rowData;
      return (
        <div>
          {item ? (
            <Item
              key={item.id}
              arrow="horizontal"
              thumb={require('images/own/self-assessment.svg')}
              multipleLine
              onClick={() => this.goToUrl(item.id)}
              extra={item.selfEvaluationSumMark}
              className="custom-item"
            >
              {util.formatDate(item.reportingDate, 'yyyy-MM-dd')} 考核表
            </Item>
          ) : null}
        </div>
      );
    };
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="我的考核" pointer="pointer" />
          <div className="child-container">
            <div className="components own-self-assessment">
              <div className="search-box">
                <div className="condition c-left">
                  <span className="label">考核时间：</span>
                  {repDate ? <p className="cont">{util.formatDate(repDate, 'yyyy-MM')}</p> : '全部'}
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
                <ListView
                  ref={(el) => (this.lv = el)}
                  dataSource={this.state.dataSource}
                  renderFooter={() => (
                    <div style={{ padding: 16, textAlign: 'center' }}>
                      {this.state.isLoading ? 'Loading...' : evaluationList.length == 0 ? <NoData /> : '无更多数据了'}
                    </div>
                  )}
                  renderBodyComponent={() => <MyBody />}
                  renderRow={row}
                  className="am-list"
                  pageSize={1}
                  scrollRenderAheadDistance={500}
                  onEndReached={this.onEndReached}
                  onEndReachedThreshold={10}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = SelfAssessmentList;
