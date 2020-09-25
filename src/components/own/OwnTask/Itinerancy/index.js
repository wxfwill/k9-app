import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { List, DatePicker, Button, ListView, Toast} from 'antd-mobile';
import Store from './store';
import Actions from './actions';
import { withRouter,Link } from "react-router-dom";
import moment from 'moment';
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

let listData = [];
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
    },
 
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

class Itinerancy extends Component{
    constructor(props){
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state={
          startDate:now,
          dataSource,
          isLoading: true
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
        listData = result.data;
        _this.rData = genData(listData.length);
        _this.setState({
          dataSource: _this.state.dataSource.cloneWithRows(_this.rData),
          isLoading: false,
          height: hei,
        });
      })
    }
    onEndReached = (event) => {
      let _this = this;
      // load new data
      // hasMore: from backend data, indicates whether it is the last page, here is false
      if (this.state.isLoading && !this.state.hasMore) {
        return;
      }
      //到底部触发加载
    /*  this.getContent(moment(now).format('YYYY-MM-DD'), function(result){
          let oldlen = listData.length;
          listData = [...listData, ...result.data];
          if(result.data.length > 0){
              _this.setState({ isLoading: true });
          }
          _this.rData = { ..._this.rData, ...genData(result.data.length, oldlen) };
          _this.setState({
              dataSource: _this.state.dataSource.cloneWithRows(_this.rData),
              isLoading: false,
          });
      })*/
    }
   /* componentWillReceiveProps(nextProps){
      console.log(nextProps,"nextProps");

    }*/
    handleChange(data){
        let _this = this;
        _this.setState({
          startDate: data
        })
        _this.getContent(moment(data).format('YYYY-MM-DD'), function(result){
          let len = result.data.length;
          listData = result.data;
          _this.rData = genData(len);
          _this.setState({
            dataSource: _this.state.dataSource.cloneWithRows(listData),
            isLoading: false
          });
        })
    }
    handleOk(){

    }
    handleLink = (address,id) => {
      let { history }  = this.props;
      history.push({pathname:address, query:id });
    }

    onChange(type,data){
        let handle = this.handleRes()[type];
        typeof handle!=='undefined'&&handle();
    }
    getContent(data, callback){
        let _this = this;
        commonJs.ajaxPost('/api/outdoorTask/myTasks', {taskDate: data}, function(result){
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
            if (listData[rowID] < 0) {
                return null
            }
            let obj = listData[rowID];
            let st = stateArr[obj.status];
            return (
              <div key={rowID} className="list-item" onClick={() => this.handleLink('/itinerancy/detail',obj.id)} >
                  <div className="title">
                   <p> {obj.planName}</p>
                    <span className={st.className}>{st.name}</span>
                  </div>
                  <div className="cont">
                   
                    <div>
                      <span>开始时间：</span>
                      <span>{obj.taskTime ? moment(obj.taskTime).format('YYYY-MM-DD') : '--'}</span>
                    </div>
                    <div>
                      <span>人员：</span>
                      <span>{obj.userNames ? obj.userNames : '--'}</span>
                    </div>
                  </div>
              </div>
            );
        };
        console.log(this.state.dataSource)
        return(
            <div className="own-round" >
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
                    className="own-round-list"
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={() => {
                      return(<div className="foot-tip">
                          {this.state.isLoading ? '加载中...' : '没有更多数据了'}
                      </div>)
                    }}
                    style={{
                     // height: this.state.height,
                      overflow: 'auto',
                      }}
                    renderBodyComponent={() => <MyBody />}
                    renderRow={row}
                    pageSize={10} 
                    initialListSize={10}   
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
export default withRouter(Itinerancy);



// WEBPACK FOOTER //
// ./src/components/own/OwnTask/Itinerancy/index.js