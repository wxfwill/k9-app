import React, { Component } from 'react';
import { List, Icon, ListView, Badge } from 'antd-mobile';
import { bindActionCreators } from 'redux';
import * as systomStatus from 'actions/systomStatus';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import NoData from 'components/common/No-data';

const Item = List.Item;
const Brief = Item.Brief;

require('style/own/own.less');
require('style/fontawesome/font-awesome.less');

// import * as news from 'localData/news/mockData';

function formaterList(list) {
  // if (!util.isArray(list)) {
  //   throw new Error(`list 参数必须为数组`);
  // }
  let newList = list ? list : [];
  if (newList.length == 0) {
    return [];
  }
  newList.map((item) => {
    item.icon = require(`images/news/new-${item.type}.svg`);
    item.desc = newsTypeDesc[item.type];
  });
  return newList;
}

const newsTypeDesc = {
  6: '网格化搜捕描述',
  3: '训练了一只狗',
  4: '日常遛狗',
  5: '紧急事件处理',
  1: '休假描述',
  12: '值班描述123',
};

const user = JSON.parse(sessionStorage.getItem('user'));
class News extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.socketNewList.items);
    console.log(9999);

    this.state = {
      newsTypeList: this.formaterList(this.props.socketNewList.items),
      // newsTypeList: [],
      // newList: news.newsTypeData,
    };
  }
  formaterList = (list) => {
    // if (!util.isArray(list)) {
    //   throw new Error(`list 参数必须为数组`);
    // }
    let newList = list ? list : [];
    if (newList.length == 0) {
      return [];
    }
    newList.map((item) => {
      item.icon = require(`images/news/new-${item.type}.svg`);
      item.desc = newsTypeDesc[item.type];
    });
    return newList;
  };
  componentDidMount() {}
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(prevState.newsTypeList);
  //   if (nextProps.socketNewList.items !== prevState.newsTypeList) {
  //     console.log(nextProps.socketNewList.items);
  //     return {
  //       newsTypeList: formaterList(nextProps.socketNewList.items),
  //     };
  //   }
  //   return null;
  // }
  componentWillReceiveProps(nextProps) {
    this.setState({
      newsTypeList: this.formaterList(nextProps.socketNewList.items),
    });
  }
  handleLink = (obj) => {
    //已读信息通过WebSocket通知服务器
    // debugger;
    console.log(this.props);
    this.props.sysActions.socketon({ msgType: 'readMsg', userId: user.id, data: obj.id });
    let { history } = this.props;
    var unReadMsgNum = JSON.parse(sessionStorage.getItem('unReadMsgNum'));
    sessionStorage.setItem('unReadMsgNum', unReadMsgNum - 1);
    let address = '/own/duty';
    let id = obj.dateId;
    if (obj.type == 1) {
      address = '/own/duty';
    } else if (obj.type == 2) {
      address = '/own/DogMange/DogDiagnosis';
    } else if (obj.type == 3) {
      address = '/drill/detail';
    } else if (obj.type == 4) {
      address = '/ownround/map';
    } else if (obj.type == 5) {
      address = '/emdep/map';
    } else if (obj.type == 6) {
      address = '/gridsearch/map';
    } else if (obj.type == 7) {
      address = '/itinerancy/detail';
    } else if (obj.type == 8) {
      address = '/aggpoint/map';
    } else if (obj.type == 9) {
      address = '/drill/detail/trackmap';
    } else if (obj.type == 11) {
      address = '/report/ReportDetail';
    }
    history.push({ pathname: address, query: id });
  };
  addTask = () => {
    alert('添加任务');
  };
  handleNewLIst = (item) => {
    const { history } = this.props;
    // history.push(`${obj.link}?titleType=${obj.text}`); title: item.title
    history.push({ pathname: `/news/list`, search: `?title=${encodeURI(item.typeNote)}&icon=${item.icon}` });
  };
  render() {
    console.log(this.state.newsTypeList);
    console.log('消息数量===' + this.props.socketNewList.total);
    return (
      <div className="Own">
        <Header
          title={this.props.socketNewList.total > 0 ? `消息(${this.props.socketNewList.total})` : '消息'}
          isSet="+"
          handleShow={this.addTask.bind(this)}
        />
        <div className="midder-content">
          <div className="inner-content">
            {this.state.newsTypeList.length > 0 ? (
              this.state.newsTypeList.map((item, index) => {
                return (
                  <List className="new-list" key={index} onClick={() => this.handleNewLIst(item)}>
                    <Item
                      extra={util.getShowTimeAgain(item.nearlyTime, item.systemTime)}
                      align="top"
                      thumb={
                        <Badge text={item.num} overflowCount={99}>
                          <span
                            style={{
                              width: '1.333333rem',
                              height: '1.333333rem',
                              borderRadius: '0.213333rem',
                              overflow: 'hidden',
                              background: `url(${item.icon}) left top no-repeat`,
                              backgroundSize: '100% 100%',
                              display: 'inline-block',
                            }}
                          />
                        </Badge>
                      }
                      multipleLine
                    >
                      <div className="new-title">{item.typeNote}</div>
                      <div className="new-desc">{item.desc}</div>
                    </Item>
                  </List>
                );
              })
            ) : (
              <NoData></NoData>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  socketMsg: state.system && state.system.socketMsg,
  socketNewList: state.socketReducer.newLIst,
});
const mapDispatchToProps = (dispatch) => ({
  sysActions: bindActionCreators(systomStatus, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(News));
