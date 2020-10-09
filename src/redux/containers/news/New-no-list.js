import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { ListView, List } from 'antd-mobile';
// require("style/own/own.less");
const Item = List.Item;
// moke
function MyBody(props) {
  return <div className="am-list-body my-body">{props.children}</div>;
}
import { newsListNoTypeData } from './new-data.js';

let NUM_SECTIONS = 5;
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
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      currentPage: 0,
      newsListNoTypeData,
      dataSource,
      isLoading: true,
      height: (document.documentElement.clientHeight * 3) / 4,
    };
  }
  componentWillUnmount() {
    // this.setState = (state, callback) => {
    //   return;
    // };
    dataBlobs = {};
    console.log('离开了');
  }
  componentDidMount() {
    // console.log("height===000");
    // console.log(this.props.tabHeight);
    // console.log(ReactDOM.findDOMNode(this.lv));
    // const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    // simulate initial Ajax
    console.log('componentDidMount数据');
    // genData();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(genData(this.state.currentPage)),
      isLoading: false,
    });
    this.props.onRef && this.props.onRef('parent', this);
  }
  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.setState({ currentPage: ++this.state.currentPage });
      console.log(this.state.currentPage);
      // genData(this.state.currentPage);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(genData(this.state.currentPage)),
        isLoading: false,
      });
    }, 1000);
  };
  noData = () => {
    console.log('未处理');
  };
  yesData = () => {
    console.log('已处理');
  };
  addTask = () => {};
  componentWillReceiveProps(nextProps) {
    console.log('nextProps====');
    console.log(nextProps);
    if (this.props.tabHeight !== nextProps.tabHeight) {
      console.log(nextProps.tabHeight);
      console.log(nextProps.headerH);
      const hei = document.documentElement.clientHeight - nextProps.tabHeight - nextProps.headerH;
      this.setState({ height: hei });
    }
  }
  componentWillMount() {
    // console.log("type======" + this.props.noType);
    // let obj = util.urlParse(this.props.location.search);
    // this.setState({ title: obj.title });
  }
  render() {
    const separator = (sectionID, rowID) => {
      //   console.log("sectionID" + sectionID);
      //   console.log("rowID" + rowID);
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
    let index = 0;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = this.state.newsListNoTypeData.length - 1;
      }
      const item = this.state.newsListNoTypeData && this.state.newsListNoTypeData[index++];
      return (
        item && (
          <List className="new-list-type" key={rowID}>
            <Item
              extra={<div className="finsh">{''}</div>}
              align="top"
              thumb={
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
              }
              multipleLine
            >
              <div className="new-title">{item.title}</div>
              <div className="new-desc">
                <span className="content">主要内容:</span>
                {item.content}
              </div>
              <div className="new-desc">
                <span className="content">发布时间:</span>
                {item.startTime}
              </div>
              <div className="new-desc">
                <span className="content">发布人:</span>
                {item.pusher}
              </div>
            </Item>
          </List>
        )
      );
    };
    return (
      this.state.dataSource && (
        <ListView
          ref={(el) => (this.lv = el)}
          dataSource={this.state.dataSource}
          renderFooter={() => (
            <div style={{ padding: 30, textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : '无更多数据了'}
            </div>
          )}
          renderBodyComponent={() => <MyBody />}
          renderRow={row}
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
          onEndReachedThreshold={10}
        />
      )
    );
  }
}

export default withRouter(NewNoList);
