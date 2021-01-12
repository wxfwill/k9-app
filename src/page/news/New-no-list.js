import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ListView, List, Modal, Badge } from 'antd-mobile';
import { connect } from 'react-redux';
import NoData from 'components/common/No-data';
import { saveSocketNewList } from 'store/actions/websocketAction';
import { sendMessage } from 'components/common/websocket';
// require("style/own/own.less");
const Item = List.Item;
const alert = Modal.alert;
// moke
function MyBody(props) {
  return <div className="am-list-body my-body">{props.children}</div>;
}

let NUM_SECTIONS = 3;
let dataBlobs = {};

function genData(pIndex = 0) {
  for (let i = 0; i < NUM_SECTIONS; i++) {
    const ii = pIndex * NUM_SECTIONS + i;
    const sectionName = `Section-${ii}`;
    dataBlobs[`${sectionName}-data${ii}`] = sectionName;
  }
  return dataBlobs;
}

class NewNoList extends Component {
  constructor(props) {
    super(props);
    // const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    // const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
    // const dataSource = new ListView.DataSource({
    //   getRowData,
    //   getSectionHeaderData: getSectionData,
    //   rowHasChanged: (row1, row2) => row1 !== row2,
    //   sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    // });
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      currPage: 1,
      param: {
        finished: false,
      },
      pageSize: 10,
      sortFieldName: '',
      sortType: 'desc',
      hasMore: true,
      todoList: [],
      dataSource: ds,
      isLoading: true,
      height: 0,
      // height: (document.documentElement.clientHeight * 3) / 4,
    };
  }
  dicFormat = (title) => {
    let obj = {
      网格化搜捕: '/api/app/pageMyGridSearchTask',
      训练计划: null,
      日常巡逻: null,
      紧急调配: null,
      假期管理: null,
      值班提醒: null,
    };
    return obj[title] ? obj[title] : null;
  };
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
    dataBlobs = {};
  }
  handleSearchList = (per) => {
    let url = this.dicFormat(this.props.typeTitle);
    if (!url) {
      this.setState({ isLoading: false });
      return;
    }
    console.log(url);
    React.$ajax.postData({ url, data: per }).then((res) => {
      if (res.code == 0) {
        let resultData = res.data;
        resultData.list = resultData.list ? resultData.list : [];
        this.state.todoList = this.state.todoList.concat(resultData.list);

        if (this.state.todoList.length < resultData.totalCount) {
          // 可以滑动
          this.state.hasMore = true;
        } else {
          this.state.hasMore = false;
        }
        // let newData = Object.assign({}, this.state.perObj, { currPage: ++1});
        // this.setState({ perObj: newData });
        // this.setState({
        //   dataSource: this.state.dataSource.cloneWithRows(genData(this.state.perObj.currentPage)),
        //   isLoading: false,
        // })
        this.setState(function (prevState) {
          return {
            dataSource: prevState.dataSource.cloneWithRows(this.state.todoList),
            isLoading: false,
          };
        });
      }
    });
  };
  componentDidMount() {
    // this.setState({ isLoading: true });
    console.log('componentDidMount===123456');
    let { currPage, param, pageSize, sortFieldName, sortType } = this.state;
    this.handleSearchList({ currPage, param, pageSize, sortFieldName, sortType });
    this.props.onRef && this.props.onRef('parent', this);
  }
  onEndReached = (event) => {
    if (!this.state.hasMore) {
      return;
    }
    this.setState({ isLoading: true });
    this.setState({ currPage: ++this.state.currPage });

    let { currPage, param, pageSize, sortFieldName, sortType } = this.state;
    this.handleSearchList({ currPage, param, pageSize, sortFieldName, sortType });
  };
  noData = () => {
    console.log('未处理');
  };
  yesData = () => {
    console.log('已处理');
  };
  addTask = () => {};
  cancelTask = () => {
    const taskInstance = alert('提示', '确认取消任务吗?', [
      { text: '取消', onPress: () => console.log('取消') },
      {
        text: '确定',
        onPress: () => {
          console.log('确定');
        },

        // new Promise((resolve) => {
        //   let { history } = this.props;
        //   Toast.info('正在退出...');
        //   React.$ajax.login.loginOut().then((res) => {
        //     if (res.code == 0) {
        //       CallApp({
        //         callAppName: 'stopLocationService',
        //         callbackName: 'sendLocationInfoToJs',
        //         callbackFun: this.showClear,
        //       });
        //       taskInstance.close();
        //       // token
        //       this.props.tokenAction(null);
        //       // 用户信息
        //       this.props.userInfoAction('');
        //       // 关闭socket
        //       closeWebSocket();
        //       Toast.info('退出成功');
        //       history.push('/login');
        //     }
        //   });
        // }),
      },
    ]);
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.tabHeight !== nextProps.tabHeight) {
      const hei = document.documentElement.clientHeight - nextProps.tabHeight - nextProps.headerH;
      this.setState({ height: hei });
    }
  }
  UNSAFE_componentWillMount() {
    // console.log("type======" + this.props.noType);
    // let obj = util.urlParse(this.props.location.search);
    // this.setState({ title: obj.title });
  }
  //进入地图
  intoMap = () => {
    console.log('进入地图');
    util.CallApp({
      callAppName: 'map',
    });
  };
  handleNoNews = (item) => {
    console.log(item);
    sendMessage({ serviceCode: 'readMsg', payload: item.msgIds.join(',') }, (data) => {
      console.log('发送成功readMsg成功');
      console.log(JSON.parse(data));
      let res = JSON.parse(data);
      if (res.code === 0) {
        console.log('阅读消息');
        console.log(res);
        // 消息统计 减1
        if (res.serviceCode == 'statisticsMsgTips') {
          console.log('jing 111111111');
          this.props.SocketNewListActions(res.data);
          this.intoMap();
        }
      }
    });
  };
  renderRow = (rowData) => {
    let index = this.state.todoList.length - 1;
    if (!rowData) {
      throw new Error('rowData 获取的值为空');
    }
    let item = rowData;
    return (
      item && (
        <List className="new-list-type" key={item.taskName} onClick={this.handleNoNews.bind(this, item)}>
          <Item
            extra={
              <div
                className="finsh"
                style={{
                  background: `url(${
                    item.status == 1 ? require('images/news/notodo.svg') : require('images/news/running.svg')
                  }) left top no-repeat`,
                  backgroundSize: '100% 100%',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  zIndex: 200,
                }}
              >
                {''}
              </div>
            }
            align="top"
            thumb={
              <Badge dot={item.msgNew}>
                <span
                  style={{
                    width: '1.333333rem',
                    height: '1.333333rem',
                    borderRadius: '0.213333rem',
                    overflow: 'hidden',
                    background: `url(${util.urlParse(this.props.location.search).icon}) left top no-repeat`,
                    backgroundSize: '100% 100%',
                    display: 'inline-block',
                  }}
                />
              </Badge>
            }
            multipleLine
          >
            <div className="new-title">{item.taskName}</div>
            <div className="new-desc">
              <span className="content">主要内容: </span>
              {item.taskContent}
            </div>
            <div className="new-desc">
              <span className="content">开始时间: </span>
              {/* {util.formatDate(
                new Date('Mon Jan 11 2021 12:43:02 GMT+0800 (中国标准时间)').getTime(),
                'yyyy/MM/dd hh:mm'
              )} */}
              {util.formatDate(item.startTime, 'yyyy-MM-dd hh:mm')}
            </div>
            <div className="new-desc">
              <span className="content">发布人: </span>
              {item.publishUserName}
            </div>
          </Item>
          {item.status == 1 ? (
            <div className="task-btn">
              <span className="task-txt" onClick={() => this.cancelTask()}>
                取消任务
              </span>
            </div>
          ) : (
            ''
          )}
        </List>
      )
    );
  };
  render() {
    const separator = (sectionID, rowID) => {
      return (
        <div
          key={`${sectionID}-${rowID}`}
          style={{
            width: '9.36rem',
            height: '0.32rem',
          }}
        />
      );
    };
    return (
      this.state.dataSource && (
        <ListView
          ref={(el) => (this.lv = el)}
          dataSource={this.state.dataSource}
          renderFooter={() => (
            <div style={{ padding: 30, textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : this.state.todoList.length == 0 ? <NoData /> : '无更多数据了'}
            </div>
          )}
          renderBodyComponent={() => <MyBody />}
          renderRow={(rowData, i) => this.renderRow(rowData, i)}
          renderSeparator={separator}
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          pageSize={1}
          onScroll={() => {
            console.log('scroll');
          }}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={100}
        />
      )
    );
  }
}

const mapStateToProps = (state) => ({
  socketNewList: state.socketReducer.newLIst,
});
const mapDispatchToProps = (dispatch) => ({
  SocketNewListActions: (list) => dispatch(saveSocketNewList(list)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewNoList));
