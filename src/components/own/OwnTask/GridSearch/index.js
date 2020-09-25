import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, DatePicker, WhiteSpace, ListView, Toast} from 'antd-mobile';
import { withRouter } from "react-router-dom";
import moment from 'moment';
import * as loginStatus from 'actions/loginStatus';
import commonJs from 'libs/CommonStore';
require('style/own/ownLevel.less');

const Item = List.Item;
const Brief = Item.Brief;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

let isFirst = true;

const NUM_ROWS = 10;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];

const stateArr = [
    {
      className: 'nostart',
      name: '未开始'
    },
    {
      className: 'going',
      name: '进行中'
    },
    {
      className: 'end',
      name: '已完成'
    },
    {
      className: 'stop',
      name: '已终止'
    }
]
function MyBody(props) {
  return (
    <div className="am-list-body my-body">
        {props.children}
    </div>
  )
}

function genData(len = 0, oldlen = 0) {
  const dataBlob = {};
  for (let i = 0; i < len; i++) {
    const ii = oldlen + i;
    dataBlob[`${ii}`] = `row - ${ii}`;
  }
  return dataBlob;
}

class OwnGridComponent extends Component{
  constructor(props){
    super(props);
    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state={
      startDate:now,
      dataSource,
      hasMore: false,
      isLoading: true,
      hasError: false,
      listData: []
    }
    this.timer = null;
  }
  componentDidMount() {
    let _this = this;
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    //第一次请求列表
    _this.getContent(moment(now).format('YYYY-MM-DD'), function(result){
      //listData = result.data;
      _this.setState({
        listData: result.data
      })
      _this.rData = genData(_this.state.listData.length);
      _this.setState({
        dataSource: _this.state.dataSource.cloneWithRows(_this.rData),
        isLoading: false,
        height: hei,
      });
    })
  }
  onEndReached = (event) => {
    let _this = this;
    if (this.state.isLoading || !this.state.hasMore) {
      return;
    }
    //到底部触发加载
    this.getContent(moment(now).format('YYYY-MM-DD'), function(result){
        let listData = _this.state.listData;
        let oldlen = listData.length;
        if(result.data.length > 0){
            _this.setState({ isLoading: true });
        }
        _this.setState({
            listData: [...listData, ...result.data]
        })
        _this.rData = { ..._this.rData, ...genData(result.data.length, oldlen) };
        _this.setState({
            dataSource: _this.state.dataSource.cloneWithRows(_this.rData),
            isLoading: false,
        });
    })
  }
  handleChange(data){
    let _this = this;
    _this.setState({
      startDate: data
    })
    _this.getContent(moment(data).format('YYYY-MM-DD'), function(result){
      _this.setState({
        listData: result.data
      })
      let len = result.data.length;
      _this.rData = genData(len);
      _this.setState({
        dataSource: _this.state.dataSource.cloneWithRows(result.data),
        isLoading: false
      });
    })
  }
  handleOk(){

  }
  onChange(type,data){
    let handle = this.handleRes()[type];
    typeof handle!=='undefined'&&handle();
  }
  goDetail = (item) => {
    const { history } = this.props;
      //const {area, referencePoint, taskName, taskDetailId, taskType, status} = item;
      history.push({pathname:'/gridsearch/map', query:item.taskDetailId })
  }
  getContent(data, callback){
    let _this = this;
    commonJs.ajaxPost('/api/cmdMonitor/myGridTask', {startDate: data}, function(result){
      if(result.code == 0){
        callback && callback(result);
      }
    })
  }
  render(){
    const separator = (sectionID, rowID) => (
        <div
          key={`${sectionID}-${rowID}`}
        />
    );
    const row = (rowData, sectionID, rowID) => {
      let listData = this.state.listData;
        if (!listData[rowID]) {
            return null
        }
        let obj = listData[rowID];
        let st = stateArr[obj.status];
        return (
          <div 
            key={rowID}
            className="list-item"
            onClick={() => this.goDetail(obj)}
          >
              <div className="title">
                <p>{obj.taskName}</p>
                <span className={st.className}>{st.name}</span>
              </div>
              <div className="cont">
                {/*<div>
                  <span>巡逻人员：</span>
                  <span>{obj.userNames ? obj.userNames : '--'}</span>
                </div>
                <div>
                  <span>巡逻地点：</span>
                  <span>{obj.patrolsPlace ? obj.patrolsPlace : '--'}</span>
                </div>*/}
                <div>
                  <span>搜捕日期：</span>
                  <span>{obj.planStartTime ? moment(obj.planStartTime).format('YYYY-MM-DD') : '--'}</span>
                </div>
              </div>
          </div>
        );
    };
    return(
      <div className="own-grid" >
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
            className="own-grid-list"
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            renderFooter={() => {
              return(<div className="foot-tip">
                  {this.state.isLoading ? '加载中...' : '没有更多数据了'}
              </div>)
            }}
            renderBodyComponent={() => <MyBody />}
            renderRow={row}
            renderSeparator={separator}
            onScroll={() => { console.log('scroll'); }}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
        />
      </div>
    )
  }
}
const cfgsStateToProps = state => ({
  cfgs: state.login
})
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(loginStatus, dispatch)
})
export default connect(cfgsStateToProps, mapDispatchToProps)(withRouter(OwnGridComponent));
//export default withRouter(OwnGridComponent);



// WEBPACK FOOTER //
// ./src/components/own/OwnTask/GridSearch/index.js