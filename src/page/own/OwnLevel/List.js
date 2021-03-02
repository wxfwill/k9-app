import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { ListView, List, Modal } from 'antd-mobile';
import { connect } from 'react-redux';
import Header from 'components/common/Header';
import NoData from 'components/common/No-data';
import { saveSocketNewList } from 'store/actions/websocketAction';

require('style/own/rocall.less');

const Item = List.Item;
const alert = Modal.alert;

function MyBody(props) {
  return <div className="rocall-body">{props.children}</div>;
}

class OwnLevelComponent extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.headerHeight = React.createRef();
    this.state = {
      currPage: 1,
      finished: false,
      pageSize: 10,
      qryDateStr: '',
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
    // React.$ajax.own.myGridTaskList({ startDate: per }).then((res) => {
    React.$ajax.own.myTaskApplyList(per).then((res) => {
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
    this.setState({
      herderH:
        ReactDOM.findDOMNode(this.headerHeight.current) &&
        ReactDOM.findDOMNode(this.headerHeight.current).querySelector('.header-title').clientHeight,
    });

    this.setState((nextState) => {
      const hei = document.documentElement.clientHeight - nextState.herderH;
      return {
        height: hei,
      };
    });

    let { currPage, qryDateStr, pageSize } = this.state;
    this.handleSearchList({ currPage, qryDateStr, pageSize });
    this.props.onRef && this.props.onRef('parent', this);
  }
  onEndReached = (event) => {
    if (!this.state.hasMore) {
      return;
    }
    this.setState({ isLoading: true });
    this.setState({ currPage: ++this.state.currPage });

    let { currPage, qryDateStr, pageSize } = this.state;
    this.handleSearchList({ currPage, qryDateStr, pageSize });
  };
  componentWillReceiveProps(nextProps) {}
  handleNoNews = (item) => {
    console.log(item);
    const { history } = this.props;
    //history.push(`/publish/rollCallDetails?id=${item.id}`);
    history.push(`/own/OwnLeaveListDetails?id=${item.id}`);
  };
  renderRow = (rowData) => {
    if (!rowData) {
      throw new Error('rowData 获取的值为空');
    }
    let item = rowData;
    return (
      item && (
        <List className="rollcall-item" key={item.id} onClick={this.handleNoNews.bind(this, item)}>
          <Item
            className="rollcall-img"
            arrow="horizontal"
            thumb={
              <span
                style={{
                  width: '0.853333rem',
                  height: '0.853333rem',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: `url(${require('images/own/own-vacation.svg')}) left top no-repeat`,
                  backgroundSize: '100% 100%',
                  display: 'inline-block',
                }}
              />
            }
          >
            {`${item.name}-${util.formatDate(item.applyTime, 'yyyy-MM-dd')} 请假申请`}
          </Item>
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
      <div className="roll-call-wrap">
        <Header pointer title="请假申请" myRef={this.headerHeight} />
        {this.state.dataSource && (
          <ListView
            ref={(el) => (this.lv = el)}
            dataSource={this.state.dataSource}
            renderFooter={() => (
              <div style={{ padding: '0.4rem', textAlign: 'center' }}>
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
              // console.log('scroll');
            }}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={300}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  socketNewList: state.socketReducer.newLIst,
});
const mapDispatchToProps = (dispatch) => ({
  SocketNewListActions: (list) => dispatch(saveSocketNewList(list)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OwnLevelComponent));
