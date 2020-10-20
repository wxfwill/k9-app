import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { ListView, List, Modal } from 'antd-mobile';
import { connect } from 'react-redux';
import NoData from 'components/common/No-data';
import { saveSocketNewList } from 'store/actions/websocketAction';

require('style/own/own.less');
const Item = List.Item;
const alert = Modal.alert;

function MyBody(props) {
  return <div className="am-list-body my-body">{props.children}</div>;
}

class OwnGridList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      currPage: 1,
      finished: false,
      pageSize: 10,
      sortFieldName: '',
      sortType: 'desc',
      hasMore: true,
      todoList: [],
      dataSource: ds,
      isLoading: true,
      height: 0,
    };
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  handleSearchList = (per) => {
    React.$ajax.news.gridSearchList(per).then((res) => {
      if (res.code == 0) {
        let resultData = res.data;
        this.state.todoList = this.state.todoList.concat(resultData.list);

        if (this.state.todoList.length < resultData.totalCount) {
          // 可以滑动
          this.state.hasMore = true;
        } else {
          this.state.hasMore = false;
        }
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
    let { currPage, finished, pageSize, sortFieldName, sortType } = this.state;
    this.handleSearchList({ currPage, finished, pageSize, sortFieldName, sortType });
    this.props.onRef && this.props.onRef('parent', this);
  }
  onEndReached = (event) => {
    if (!this.state.hasMore) {
      return;
    }
    this.setState({ isLoading: true });
    this.setState({ currPage: ++this.state.currPage });

    let { currPage, finished, pageSize, sortFieldName, sortType } = this.state;
    this.handleSearchList({ currPage, finished, pageSize, sortFieldName, sortType });
  };
  noData = () => {
    console.log('未处理');
  };
  yesData = () => {
    console.log('已处理');
  };
  addTask = () => {};
  componentWillReceiveProps(nextProps) {
    console.log('nextProps===网格化搜捕');
    if (this.props.tabHeight !== nextProps.tabHeight) {
      const hei = document.documentElement.clientHeight - nextProps.tabHeight - nextProps.headerH;
      this.setState({ height: hei });
    }
  }
  handleNoNews = (item) => {};
  renderRow = (rowData) => {
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
              <span
                style={{
                  width: '1.066667rem',
                  height: '1.066667rem',
                  borderRadius: '0.213333rem',
                  overflow: 'hidden',
                  background: `url(${require('images/own/tasktab/active-grild.svg')}) left top no-repeat`,
                  backgroundSize: '100% 100%',
                  display: 'inline-block',
                }}
              />
            }
            multipleLine
          >
            <div className="new-title">{item.taskName}</div>
            <div className="new-desc">
              <span className="content">主要内容:</span>
              {item.taskContent}
            </div>
            <div className="new-desc">
              <span className="content">开始时间:</span>
              {util.formatDate(new Date(item.planStartTime), 'yyyy-MM-dd hh:mm')}
            </div>
            <div className="new-desc">
              <span className="content">发布人:</span>
              {item.operatorName}
            </div>
          </Item>
          {
            <div className="task-btn">
              <span className="task-txt">查看详情</span>
            </div>
          }
          {/* {item.status == 1 ? (
            <div className="task-btn">
              <span className="task-txt" onClick={() => this.cancelTask()}>
                取消任务
              </span>
            </div>
          ) : (
            ''
          )} */}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OwnGridList));
