import React,{Component} from 'react';
import { List, Icon, Tabs, DatePicker, Modal, ListView ,Button,Toast} from 'antd-mobile';
import Reflux from 'reflux';
import ReactDOM from 'react-dom';
import { createForm } from 'rc-form';
import { withRouter,Link } from "react-router-dom";
import moment from 'moment';
import commonJs from 'libs/CommonStore';

const Item = List.Item;
const nowTimeStamp = Date.now();
const alert = Modal.alert;
const now = new Date(nowTimeStamp);
const pageSize = 10;
let currPage = 1;
let listData = [];

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

class PubItinerancyComponent extends Component{
  constructor(props){
    super(props);
    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      queryTime: now,
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
    commonJs.ajaxPost('/api/outdoorTask/listPlanData', data, function(result){
        if(result.data.totalPage <= currPage){
          hasMore = false;
        }else{
          hasMore = true;
        }
        _this.setState({ isLoading: false, hasMore });
        callback && callback(result);
        currPage++
    })
  }
  //第一次请求
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
      queryTime: time,
      hasMore: true,
    })
    currPage = 1;
    let data = {
      queryTime: moment(time).format('YYYY-MM-DD'),
      pageSize,
      currPage: currPage
    }
    _this.initRequestList(data)
  }
  handleOk(){
    
  }
  goDetail(){
    
  }
  onEndReached = (event) => {
    let _this = this;
    const { isLoading, hasMore} = this.state;
    if (isLoading || !hasMore) {
      return;
    }
    let { queryTime } = this.state;
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    //到底部触发加载
    let data = {
      queryTime: moment(queryTime).format('YYYY-MM-DD'),
      pageSize,
      currPage:currPage
    }
    _this.requestList(data, function(result){
      let listData = [..._this.state.listData, ...result.data.list];

      //_this.rData = { ..._this.rData, ...genData(result.data.list.length) };
      _this.rData = genData(listData.length);
      _this.setState({
          listData: [...listData, ...result.data.list],
          dataSource: _this.state.dataSource.cloneWithRows(_this.rData),
      });
    })
  }
  componentDidMount(){
    let _this = this;
    let { queryTime } = this.state;
    currPage = 1;
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    let data = {
      queryTime: moment(queryTime).format('YYYY-MM-DD'),
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
  commonJs.ajaxPost('/api/outdoorTask/stopTask', {
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

startOrEndPatral(id,patral) {
  if(patral==1){
    const alertInstance = alert('结束任务', '确定结束此任务吗?', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确定', onPress: () => this.startOrEndMethod(id,patral) },
    ]);
  }else{
    this.startOrEndMethod(id,patral); 
  }
}

//开始,结束任务。
startOrEndMethod(id,patral){
  const _this = this;
  let sendData = {id: id}
  const requstUri = patral ? '/api/outdoorTask/stopTask':'/api/outdoorTask/beginTask';
  commonJs.ajaxPost(requstUri,sendData,(data) => {
   if(data.code == '0') {
    let {listData} = _this.state;
    listData.map((item)=>{
        if(item.id==id){
          if(patral==0){
            item.taskStatus=1
          }else{
            item.taskStatus=2
          }
          
        }
    })
    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    _this.setState({
      listData:listData,
      dataSource: dataSource.cloneWithRows(listData),
    })
   };
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
        console.log(rowID)
        if (!listData[rowID]) {
            return null
        }
        let obj = listData[rowID];
        return (
          <div
            key={rowID}
            className="list-item"
            onClick={() => this.goDetail(obj)}
          >
              <div className="cont">
               {/* <div>
                  <span>任务名称：</span>
                  <span>{obj.name ? obj.name : '--'}</span>
                </div>*/}
                <div className="list-title">
                  <span>{obj.name ? obj.name : '--'}</span>
                  {obj.taskStatus==3?<i className="stop">终止</i>:<i className="haspush">正常</i>}
                </div>
                <div>
                  <span>参与人员：</span>
                  <span>{obj.userNames.length ? obj.userNames.join() : '--'}</span>
                </div>
                <div>
                  <span>上报人员：</span>
                  <span>{obj.reportUserName ? obj.reportUserName : '--'}</span>
                </div>
                <div>
                  <span>勤务说明：</span>
                  <span>{obj.content ? obj.content : '--'}</span>
                </div>
                <div>
                  <span>发布时间：</span>
                  <span>{obj.publishDate ? moment(obj.publishDate).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
                </div>
                <div>
                  <span>发布人员：</span>
                  <span>{obj.operator ? obj.operator : '--'}</span>
                </div>
                {/*obj.taskStatus<2 ?
                  <div className="btn-box">
                      <Button 
                        inline 
                        size="small" 
                        className="stop-btn"
                        onClick={()=>this.showStop(obj.id)}
                      >终止任务</Button>
                  </div>
                :null*/}
                <div className="btn-box">
                  {obj.taskStatus==0 ?
                      <Button 
                        inline 
                        size="small" 
                        className="start-btn"
                        onClick={()=>this.startOrEndPatral(obj.id,0)}
                      >开始任务</Button>:null}
                  {obj.taskStatus==1 ?
                      <Button 
                        inline 
                        size="small" 
                        className="stop-btn"
                        onClick={()=>this.startOrEndPatral(obj.id,1)}
                      >结束任务</Button>:null}
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
              value={this.state.queryTime}
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

const PubItinerancy = createForm()(PubItinerancyComponent);
export default withRouter(PubItinerancy);


// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubItinerancy/index.js