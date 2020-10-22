import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { List, DatePicker, Button, ListView, Toast, Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import Header from 'components/common/Header';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
require('style/common/common.less');

const Item = List.Item;
const Brief = Item.Brief;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const alert = Modal.alert;
let isFirst = true;

const NUM_ROWS = 10;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];

let listData = [];
const stateArr = [
  {
    className: 'going',
    name: '待审批',
  },
  {
    className: 'nostart',
    name: '驳回',
  },
  {
    className: 'going',
    name: '待销假',
  },
  {
    className: 'end',
    name: '销假已完成',
  },
];

function MyBody(props) {
  return <div className="am-list-body my-body">{props.children}</div>;
}

function genData(len = 0, oldlen = 0) {
  const dataBlob = {};
  for (let i = 0; i < len; i++) {
    const ii = oldlen + i;
    dataBlob[`${ii}`] = `row - ${ii}`;
  }
  return dataBlob;
}

class ApprovalMangement extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      startDate: now,
      dataSource,
      currPage: 1,
      isLoading: true,
      hasMore: true,
    };
    this.timer = null;
  }
  componentDidMount() {
    this.initDate();
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  initDate(data) {
    let _this = this;
    _this.setState({
      startDate: data ? data : now,
      currPage: 1,
    });
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;

    _this.getContent(moment(data).format('YYYY-MM-DD'), function (result) {
      listData = result.data.list;
      _this.rData = genData(listData.length);
      let { hasMore, currPage } = _this.state;
      if (currPage < result.data.totalPage) {
        hasMore = true;
      } else {
        hasMore = false;
      }
      _this.setState({
        dataSource: _this.state.dataSource.cloneWithRows(_this.rData),
        isLoading: false,
        height: hei,
        hasMore: hasMore,
        currPage: 1,
      });
    });
  }
  onEndReached = (event) => {
    let { currPage, isLoading, hasMore, startDate } = this.state;
    currPage++;
    this.setState({
      currPage: currPage,
    });
    let _this = this;
    if (isLoading || !hasMore) {
      return;
    }
    _this.setState({
      isLoading: true,
    });
    //到底部触发加载
    this.getContent(moment(startDate).format('YYYY-MM-DD'), function (result) {
      let oldlen = listData.length;
      listData = [...listData, ...result.data.list];
      if (currPage < result.data.totalPage) {
        hasMore = true;
      } else {
        hasMore = false;
      }
      _this.rData = { ..._this.rData, ...genData(result.data.list.length, oldlen) };
      _this.setState({
        dataSource: _this.state.dataSource.cloneWithRows(_this.rData),
        isLoading: false,
        hasMore: hasMore,
      });
    });
  };
  handleChange(data) {
    this.initDate(data);
  }
  handleOk() {}
  goDetail = (item) => {
    const { history } = this.props;
    //history.push({ pathname: '/own/approvalDetails', query: item.id });
    history.push(`/publish/approvalDetails?id=${item.id}`);
  };
  handleLink = (address, id) => {
    let { history } = this.props;
    history.push({ pathname: address, query: id });
  };

  onChange(type, data) {
    let handle = this.handleRes()[type];
    typeof handle !== 'undefined' && handle();
  }
  getContent(data, callback) {
    const dataObj = { qryDate: data, currPage: this.state.currPage, pageSize: 5 };
    React.$ajax.publish.approvalList(dataObj).then((res) => {
      if (res && res.code == 0) {
        console.log(res);
        callback && callback(res);
      }
    });
  }

  showAlert = (id) => {
    const alertInstance = alert('删除', '确定删除此任务吗?', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确定', onPress: () => this.delTask(id) },
    ]);
  };

  //删除草稿
  delTask = (id) => {
    React.$ajax.publish.deleteApproval({ id: id }).then((res) => {
      if (res && res.code == 0) {
        this.initDate(this.state.startDate);
      } else {
        Toast.info(res.msg);
        return;
      }
    });
  };
  addShow(data) {
    const { history } = this.props;
    history.push('/publish/vacation?titleType=请假申请');
  }
  render() {
    const titleType = util.urlParse(this.props.location.search).titleType;
    const separator = (sectionID, rowID) => <div key={`${sectionID}-${rowID}`} />;
    const row = (rowData, sectionID, rowID) => {
      if (!listData[rowID]) {
        return null;
      }
      let obj = listData[rowID];
      let st = stateArr[obj.headerApproveState];
      // return (
      //   <div key={rowID} className="list-item">
      //     <div className="cont">
      //       <div className="list-title">
      //         {obj.name + '的请假'}
      //         <i className={st.className}>{st.name}</i>
      //       </div>
      //       <div>
      //         <span>请假类型：</span>
      //         <span>{obj.typeName ? obj.typeName : '--'}</span>
      //       </div>
      //       <div>
      //         <span>开始时间：</span>
      //         <span>{obj.leaveStartTime ? moment(obj.leaveStartTime).format('YYYY-MM-DD h:mm:ss') : '--'}</span>
      //       </div>
      //       <div>
      //         <span>结束时间：</span>
      //         <span>{obj.leaveEndTime ? moment(obj.leaveEndTime).format('YYYY-MM-DD h:mm:ss') : '--'}</span>
      //       </div>
      //       <div>
      //         <span>请假时长：</span>
      //         <span>{obj.duration ? obj.duration : '--'}</span>
      //       </div>
      //       <div>
      //         <span>请假事由：</span>
      //         <span>{obj.remark ? obj.remark : '--'}</span>
      //       </div>
      //       <div className="btn-box">
      //         <Button inline size="small" className="detail-btn" onClick={() => this.goDetail(obj)}>
      //           查看详情
      //         </Button>
      //         {/*obj.saveStatus==0 ?
      //                 <Button
      //                   inline
      //                   size="small"
      //                   className="del-btn"
      //                   onClick={()=>this.showAlert(obj.id)}
      //                 >删除</Button>:null*/}
      //       </div>
      //     </div>
      //   </div>
      // );
      return (
        obj && (
          <List className="new-list-type" key={rowID}>
            <Item align="top" multipleLine onClick={() => this.goDetail(obj)}>
              <div className="new-desc">
                <span className="content">{obj.typeName}：</span>
                <span className={st.className}>{st.name}</span>
              </div>
              <div className="new-desc">
                <span className="content">开始时间：</span>
                {obj.leaveStartTime ? moment(obj.leaveStartTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
              </div>
              <div className="new-desc">
                <span className="content">结束时间：</span>
                {obj.leaveEndTime ? moment(obj.leaveEndTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
              </div>
              <div className="new-desc">
                <span className="content">请假时长：</span>
                {obj.duration ? obj.duration : '--'}
              </div>
              <div className="new-desc">
                <span className="content">请假事由：</span>
                {obj.remark ? obj.remark : '--'}
              </div>
              <div className="new-desc">
                {obj.saveStatus == 0 ? (
                  <Button inline size="small" className="del-btn" onClick={() => this.showAlert(obj.id)}>
                    删除
                  </Button>
                ) : null}
              </div>
            </Item>
          </List>
        )
      );
    };
    return (
      <div className="own-listbox">
        <Header title={titleType} pointer />
        <List style={{ backgroundColor: 'white' }} className="date-picker-list">
          <DatePicker
            mode="date"
            title="选择日期"
            value={this.state.startDate}
            onOk={this.handleOk.bind(this)}
            onChange={this.handleChange.bind(this)}
          >
            <Item arrow="horizontal">时间</Item>
          </DatePicker>
        </List>
        <ListView
          //     className="own-info-list own-info-top"
          className="own-info-list"
          ref={(el) => (this.lv = el)}
          dataSource={this.state.dataSource}
          renderFooter={() => {
            return <div className="foot-tip">{this.state.isLoading ? '加载中...' : '没有更多数据了'}</div>;
          }}
          style={{
            //       height: this.state.height,
            overflow: 'auto',
            bottom: '0.1rem',
          }}
          renderBodyComponent={() => <MyBody />}
          renderRow={row}
          pageSize={5}
          initialListSize={5}
          renderSeparator={separator}
          onScroll={() => {
            console.log('scroll');
          }}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
      </div>
    );
  }
}
const ApprovalMangementForm = createForm()(ApprovalMangement);
export default withRouter(ApprovalMangementForm);

// WEBPACK FOOTER //
// ./src/components/own/Approval/index.js
