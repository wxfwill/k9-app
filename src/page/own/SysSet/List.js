import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { ListView, List, Modal, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import Header from 'components/common/Header';
import { saveSocketNewList } from 'store/actions/websocketAction';
import { CallApp } from 'libs/util';
require('style/own/rocall.less');

const Item = List.Item;
const alert = Modal.alert;
let alertInstance = null;
function MyBody(props) {
  return <div className="rocall-body item-list">{props.children}</div>;
}

class RollCallListForm extends Component {
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
      todoList: [
        {
          text: '修改密码',
          label: 'updatePwd',
          link: '/updatePwd',
        },
        {
          text: '清除缓存',
          label: 'clearCache',
          link: null,
        },
      ],
      dataSource: ds,
      isLoading: false,
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
    React.$ajax.publish.rollCallListPage(per).then((res) => {
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
    this.setState(function (prevState) {
      return {
        dataSource: prevState.dataSource.cloneWithRows(this.state.todoList),
        isLoading: false,
      };
    });
    // let { currPage, qryDateStr, pageSize } = this.state;
    // this.handleSearchList({ currPage, qryDateStr, pageSize });
    // this.props.onRef && this.props.onRef('parent', this);
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
  alertCancel = () => {
    console.log('取消');
  };
  showAlert = () => {
    alertInstance = alert('提示', '确认清除所有数据吗?', [
      { text: '取消', onPress: () => this.alertCancel(), style: 'default' },
      {
        text: '确定',
        onPress: () => {
          CallApp({
            callAppName: 'clearCache',
          });
          Toast.info('清除成功');
          alertInstance.close();
        },
      },
    ]);
  };
  handleType = (path) => {
    const { history } = this.props;
    let _this = this;
    return {
      updatePwd() {
        path && history.push(path);
      },
      clearCache() {
        alertInstance = alert('提示', '确认清除所有数据吗?', [
          { text: '取消', onPress: () => _this.alertCancel(), style: 'default' },
          {
            text: '确定',
            onPress: () => {
              CallApp({
                callAppName: 'clearCache',
              });
              Toast.info('清除成功');
              alertInstance.close();
            },
          },
        ]);
      },
    };
  };
  handleNoNews = (item) => {
    this.handleType(item.link)[item.label]();
  };
  renderRow = (rowData) => {
    if (!rowData) {
      throw new Error('rowData 获取的值为空');
    }
    let item = rowData;
    return (
      item && (
        <List className="rollcall-item" key={item.id} onClick={this.handleNoNews.bind(this, item)}>
          <Item className="rollcall-img" arrow="horizontal" thumb={false}>
            {item.text}
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
          className="part-line"
          style={{
            width: '100%',
            height: '1px',
            padding: '0 15px',
            margin: '0 auto',
            background: '#fff',
          }}
        >
          <p
            style={{
              height: '1px',
              margin: '0 auto',
              background: '#f5f5f9',
            }}
          ></p>
        </div>
      );
    };
    return (
      <div className="roll-call-wrap sys-set">
        <Header pointer title="设置" myRef={this.headerHeight} />
        {this.state.dataSource && (
          <ListView
            ref={(el) => (this.lv = el)}
            dataSource={this.state.dataSource}
            renderFooter={false}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RollCallListForm));
