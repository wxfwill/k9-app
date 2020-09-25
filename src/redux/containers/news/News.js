import React, { Component } from "react";
import { List, Icon, ListView, Badge } from "antd-mobile";
import Reflux from "reflux";
import ReactDOM from "react-dom";
import ReactMixin from "react-mixin";
import { bindActionCreators } from "redux";
import * as systomStatus from "actions/systomStatus";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import moment from "moment";
import FontAwesome from "react-fontawesome";
import { withRouter, Link } from "react-router-dom";
import Ajax from "libs/ajax";
import { toast } from "libs/util";
import { connect } from "react-redux";
const Item = List.Item;
const Brief = Item.Brief;

require("style/own/own.less");
require("style/fontawesome/font-awesome.less");

// moke
import { newsTypeData } from "./new-data.js";

let currentPage = 0; //当前页码
const isRead = (
  <span style={{ marginLeft: 90 }}>
    <FontAwesome name="circle" style={{ color: "#EE0000" }} />{" "}
  </span>
);
function genData(NUM_ROWS = 15, pIndex = 0) {
  const dataBlob = {};
  for (let i = 0; i < NUM_ROWS; i++) {
    const ii = pIndex * NUM_ROWS + i;
    dataBlob[`${ii}`] = `row - ${ii}`;
  }
  return dataBlob;
}
const new1 = require("images/news/new-w.svg");

const newTypeArr = {
  6: require("images/news/new-w.svg"),
  3: require("images/news/new-x.svg"),
  4: require("images/news/new-r.svg"),
  5: require("images/news/new-jing.svg"),
  7: require("images/news/new-jia.svg"),
  8: require("images/news/new-z.svg"),
};

function MyBody(props) {
  return <div className="am-list-body my-body">{props.children}</div>;
}

const user = JSON.parse(sessionStorage.getItem("user"));
class News extends Component {
  constructor(props) {
    super(props);

    //console.log(this.props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    console.log("====dataSource=======");
    console.log(dataSource);
    this.state = {
      newList: newsTypeData,
      hasMore: false,
      totalPage: -1, //消息列表总页数
      //newsList:[], //消息列表
      createTime: "",
      initRows: 15,
      dataSource,
      isLoading: true,
      height: (document.documentElement.clientHeight * 3) / 4,
    };
    //console.log(this.state.dataSource)
    this.newsList = [];
    this.rows = 15;
  }

  listMyNews(currPage = 0) {
    React.$ajax.post("/api/msgTips/listPageByTime", { currPage: currPage, userid: user.id, createTime: this.state.createTime }, (res) => {
      //    this.state.totalPage=res.data.totalPage;
      if (res.data.isEnd == 1 && res.data.data.length == 15) {
        //当前页小于总页数时,允许滑动加载
        this.state.hasMore = true;
        this.state.createTime = res.data.data[res.data.data.length - 1].createTime;
      } else {
        this.state.hasMore = false;
      }

      const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;

      this.newsList = this.newsList.concat(res.data.data);
      this.rows = this.newsList.length;
      this.setState(function (prevState) {
        return {
          dataSource: prevState.dataSource.cloneWithRows(genData(this.newsList.length, currentPage)),
          isLoading: false,
          height: hei,
        };
      });
    });
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    // this.listMyNews(); //获取我的消息列表
  }

  componentWillReceiveProps(nextProps) {
    // debugger;
    console.log(123456);
    const socketMsg = nextProps.socketMsg;
    console.log(socketMsg);
    if (socketMsg && socketMsg.msgType == "newMsg") {
      const data = socketMsg.data;
      let newData = data;
      console.log(newData[0], "=======socket");
      this.newsList.unshift(newData[0]);
      //this.newsList = newData.concat(this.newsList)
      //this.rows = this.newsList.length;

      const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
      const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
      const dataSource = new ListView.DataSource({
        getRowData,
        getSectionHeaderData: getSectionData,
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
      //this.newsList[0] = this.newsList[this.newsList.length-1]
      //this.newsList.unshift(this.newsList[this.newsList.length-1])
      this.rows = this.newsList.length;
      this.setState({
        createTime: this.newsList[this.newsList.length - 1].createTime,
        dataSource: dataSource.cloneWithRows(genData(this.newsList.length, 0)),
        isLoading: false,
      });
    }
  }

  onEndReached = (event) => {
    if (!this.state.hasMore) {
      return;
    }

    this.setState({
      isLoading: true,
    });
    // this.listMyNews(currentPage);
  };
  handleLink = (obj) => {
    //已读信息通过WebSocket通知服务器
    // debugger;
    console.log(this.props);
    this.props.sysActions.socketon({ msgType: "readMsg", userId: user.id, data: obj.id });
    let { history } = this.props;
    var unReadMsgNum = JSON.parse(sessionStorage.getItem("unReadMsgNum"));
    sessionStorage.setItem("unReadMsgNum", unReadMsgNum - 1);
    let address = "/own/duty";
    let id = obj.dateId;
    if (obj.type == 1) {
      address = "/own/duty";
    } else if (obj.type == 2) {
      address = "/own/DogMange/DogDiagnosis";
    } else if (obj.type == 3) {
      address = "/drill/detail";
    } else if (obj.type == 4) {
      address = "/ownround/map";
    } else if (obj.type == 5) {
      address = "/emdep/map";
    } else if (obj.type == 6) {
      address = "/gridsearch/map";
    } else if (obj.type == 7) {
      address = "/itinerancy/detail";
    } else if (obj.type == 8) {
      address = "/aggpoint/map";
    } else if (obj.type == 9) {
      address = "/drill/detail/trackmap";
    } else if (obj.type == 11) {
      address = "/report/ReportDetail";
    }
    history.push({ pathname: address, query: id });
  };
  addTask = () => {
    alert("添加任务");
  };
  handleNewLIst = (item) => {
    const { history } = this.props;
    history.push({ pathname: `/news/list?title=${item.title}` });
  };
  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: "#F5F5F9",
          height: 8,
          borderTop: "1px solid #ECECED",
          borderBottom: "1px solid #ECECED",
        }}
      />
    );

    //let {totalPage,newsList}=this.state;
    let { totalPage } = this.state;
    let newsList = this.newsList;

    let index = newsList.length - 1;

    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        return null;
      }
      const obj = newsList[rowID];
      //console.log(obj)
      return (
        <div key={rowID} style={{ padding: "0 15px" }}>
          <div style={{ display: "-webkit-box", display: "flex", padding: "15px 0" }} onClick={() => this.handleLink(obj)}>
            <div style={{ lineHeight: 1, width: "100%" }}>
              <div style={{ marginBottom: "8px" }}>
                <span style={{ fontSize: 15, fontWeight: "bold" }}>{obj.title ? obj.title : "--"}</span>
                <div style={{ float: "right" }}>
                  {" "}
                  {obj.status == 0 ? isRead : ""}
                  {obj.createTime ? moment(obj.createTime).format("MM-DD") : "--"}{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    return (
      <div className="Own">
        <Header title="消息" isSet="+" handleShow={this.addTask.bind(this)} />
        <div className="midder-content">
          <div className="inner-content">
            {this.state.newList.length > 0 &&
              this.state.newList.map((item, index) => {
                return (
                  <List className="new-list" key={index} onClick={() => this.handleNewLIst(item)}>
                    <Item
                      extra="8分钟前"
                      align="top"
                      thumb={
                        <Badge text={item.num} overflowCount={99}>
                          <span
                            style={{
                              width: "1.333333rem",
                              height: "1.333333rem",
                              borderRadius: "0.213333rem",
                              overflow: "hidden",
                              background: `url(${item.icon}) left top no-repeat`,
                              backgroundSize: "100% 100%",
                              display: "inline-block",
                            }}
                          />
                        </Badge>
                      }
                      multipleLine
                    >
                      <div className="new-title">{item.title}</div>
                      <div className="new-desc">{item.desc}</div>
                    </Item>
                  </List>
                );
              })}

            {/* <ListView
              className="own-round-list"
              ref={(el) => (this.lv = el)}
              dataSource={this.state.dataSource}
              renderFooter={() => (
                <div style={{ paddingTop: "12px", paddingBottom: "48px", textAlign: "center" }}>
                  {this.state.isLoading ? "加载..." : "没有更多数据了"}
                </div>
              )}
              renderRow={row}
              renderSeparator={separator}
              renderBodyComponent={() => <MyBody />}
              style={{
                height: this.state.height,
                overflow: "auto",
              }}
              onScroll={() => {
                console.log("scroll");
              }}
              pageSize={this.rows}
              initialListSize={this.rows}
              scrollRenderAheadDistance={500}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={10}
            /> */}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  socketMsg: state.system && state.system.socketMsg,
});
const mapDispatchToProps = (dispatch) => ({
  sysActions: bindActionCreators(systomStatus, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(News));

// WEBPACK FOOTER //
// ./src/redux/containers/news/News.js
