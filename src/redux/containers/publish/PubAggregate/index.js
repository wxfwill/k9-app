import React,{Component} from 'react';
import { List, Icon, Tabs, DatePicker, Modal, ListView, Button ,Toast} from 'antd-mobile';
import Reflux from 'reflux';
import ReactDOM from 'react-dom';
import { createForm } from 'rc-form';
import { withRouter,Link } from "react-router-dom";
import moment from 'moment';
import commonJs from 'libs/CommonStore';

const Item = List.Item;
const alert = Modal.alert;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const pageSize = 10;
let currPage = 1;

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
        {props.children}
    </div>
  )
}

function genData(len = 0) {
  const dataBlob = {};
  for (let i = 0; i < len; i++) {
    const ii = i;
    dataBlob[`${ii}`] = `row - ${ii}`;
  }
  return dataBlob;
}

class PubAggregateComponent extends Component{
  constructor(props){
    super(props);
    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      assembleDate: now,
      dataSource,
      hasMore: true,
      listData: [],
      isLoading: false
    }
  }
  //请求列表
  requestList(data, callback){
    let _this = this;
    let { hasMore } = this.state;
    _this.setState({ isLoading: true });
    commonJs.ajaxPost('/api/cmdMonitor/listAssembleTask', data, function(result){
        if(result.data.totalPage <= currPage){
          hasMore = false;
        }else{
          hasMore = true;
        }
        _this.setState({ isLoading: false, hasMore });
        callback && callback(result);
    })
  }
  initRequestList = (data) => {
    let _this = this;
    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    //第一次请求
    _this.requestList(data,  (result) => {
        let listData = result.data.list;
        _this.rData = genData(result.data.list.length);
        _this.setState({
            listData: listData,
            dataSource: dataSource.cloneWithRows(_this.rData),
        });
    });
  }
  //日期改变
  handleChange(time){
    let _this = this;
    _this.setState({
      assembleDate: time,
      hasMore: true,
    })
    currPage = 1;
    let data = {
      assembleDate: moment(time).format('YYYY-MM-DD'),
      pageSize,
      currPage: currPage
    }
    _this.initRequestList(data)
  }
  handleOk(){
    
  }
  goDetail(data){
    const { history } = this.props;
    let pathname = '/publish/addAggregate';
    history.push({pathname:pathname, query:{titleType: 'detail', data} })
  }
  newList = (listData) => {
    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.rData = genData(listData.length);
    this.setState({
        listData: listData,
        dataSource: dataSource.cloneWithRows(this.rData),
    });
  }
  delItem(data, index){
    let _this = this;
    commonJs.ajaxPost('/api/cmdMonitor/deleteAssembleTaskByIds', {ids:[data.id]}, (result) => {
        if(result.code == 0){
          util.toast('删除成功！');

          let { hasMore, listData } = _this.state;

          listData.splice(index, 1);
          if(_this.state.hasMore){
            let { assembleDate } = _this.state;
            let data = {
              assembleDate: moment(assembleDate).format('YYYY-MM-DD'),
              pageSize,
              currPage:currPage
            }
            _this.requestList(data, (result) => {
              let len = result.data.list.length;
              if( len > 0){
                listData.push(result.data.list[len-1]);
              }
              this.newList(listData)
            })
          }else{
            this.newList(listData)
          }
          return false;
        }
        util.toast('删除失败！');
    })
  }
  onEndReached = (event) => {
    let _this = this;
    const { isLoading, hasMore} = this.state;
    if (isLoading || !hasMore) {
      return;
    }
    let { assembleDate } = this.state;
    //到底部触发加载
    currPage++
    let data = {
      assembleDate: moment(assembleDate).format('YYYY-MM-DD'),
      pageSize,
      currPage:currPage
    }
    _this.requestList(data, function(result){
      let listData = [..._this.state.listData, ...result.data.list];
      _this.rData = genData(listData.length);
      _this.setState({
          listData: listData,
          dataSource: _this.state.dataSource.cloneWithRows(_this.rData),
      });
    })
  }
  componentDidMount(){
    let _this = this;
    currPage = 1;
    let data = {
      assembleDate: moment(this.state.assembleDate).format('YYYY-MM-DD'),
      pageSize,
      currPage: currPage
    }
    _this.initRequestList(data)
  }

  showStop = (id) => {
    const alertInstance = alert('终止任务', '确定终止此任务吗?', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确定', onPress: () => this.stopTask(id) },
    ]);
  
  };


    //终止任务
stopTask = (id)=>{
  commonJs.ajaxPost('/api/cmdMonitor/stopAssembleTask', {
         id: id
       }, (res) => {
           if(res.code == 0){
            let { history }  = this.props;
            Toast.info("任务已终止！");
           }else{
               Toast.info(res.msg);
               return ;
           }
       });
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
        return (
          <div
            key={rowID}
            className="list-item"
          >
              <div className="cont">
                <div className="list-title">
                  <span>{obj.taskName ? obj.taskName : '--'}</span>
                  {obj.taskStatus==3?<i className="stop">终止</i>:<i className="haspush">正常</i>}
                </div>
                <div>
                  <span>集合地点：</span>
                  <span>{obj.location ? obj.location : '--'}</span>
                </div>
                <div>
                  <span>集合人员：</span>
                  <span>{obj.userNames ? obj.userNames : '--'}</span>
                </div>
                <div>
                  <span>集合时间：</span>
                  <span>{obj.assembleTime ? moment(obj.assembleTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
                </div>
                <div>
                  <span>发布时间：</span>
                  <span>{obj.publishDate ? moment(obj.publishDate).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
                </div>
                <div>
                  <span>发布人员：</span>
                  <span>{obj.operator ? obj.operator : '--'}</span>
                </div>
                <div className="btn-box">
                  {obj.taskStatus<2 ?
                      <Button 
                        inline 
                        size="small" 
                        className="stop-btn"
                        onClick={()=>this.showStop(obj.id)}
                      >终止任务</Button>:null}
                  <Button 
                    inline 
                    size="small" 
                    className="detail-btn"
                    onClick={()=>this.goDetail(obj)}
                  >查看详情</Button>
                  {/*<Button
                    inline 
                    size="small" 
                    className="del-btn"
                    onClick={() =>
                      Alert('Delete', '确定删除吗？', [
                        { text: '取消'},
                        { text: '确定', onPress: ()=>this.delItem(obj, rowID)},
                      ])
                    }
                  >
                    删除
                  </Button>*/}
                </div>
              </div>
          </div>
        );
    };
    return(
    <div className="own-round">
      <List style={{ backgroundColor: 'white' }} className="date-picker-list">
          <DatePicker
              mode="date"
              title="选择日期"
              value={this.state.assembleDate}
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
              {this.state.isLoading ? '加载中...' : ''}
              {!this.state.hasMore ? '没有更多数据了' : ''}
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

const PubAggregate = createForm()(PubAggregateComponent);
export default withRouter(PubAggregate);


// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubAggregate/index.js