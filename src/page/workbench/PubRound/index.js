
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { List, DatePicker, Button, ListView, Toast,Modal} from 'antd-mobile';
import { createForm } from 'rc-form';
import { withRouter,Link } from "react-router-dom";
import moment from 'moment';
import commonJs from 'libs/CommonStore';

const Item = List.Item;
const Brief = Item.Brief;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const alert = Modal.alert;
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
      name: '未发布'
    },
    {
      className: 'end',
      name: '已发布'
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

class PubRoundComponent extends Component{
    constructor(props){
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state={
          startDate:now,
          dataSource,
          currPage:1,
          isLoading: true,
          hasMore: true,
        }
        this.timer = null;
    }
    componentDidMount() {
      this.initDate();
    }
    initDate(data){
      listData = [];
      let _this = this;
      _this.setState({
        startDate: data?data:now,
      })
      const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
   
      _this.getContent(moment(data).format('YYYY-MM-DD'), function(result){
        listData = result.data.list;
        _this.rData = genData(listData.length);
        let {hasMore,currPage}=_this.state;
        if(currPage <result.data.totalPage){
             hasMore=true;
          }else{
            hasMore=false;
          }
          const dataSource = new ListView.DataSource({
              rowHasChanged: (row1, row2) => row1 !== row2,
          });
        _this.setState({
          dataSource: dataSource.cloneWithRows(_this.rData),
          isLoading: false,
          height: hei,
          hasMore:hasMore,
          currPage:1,
        });
      },true)
    }
    onEndReached = (event) => {
      if (isLoading || !hasMore) {
        return;
      }
      let {currPage,isLoading,hasMore,startDate}=this.state;
      currPage++;
      this.setState({
          currPage:currPage
      })
      let _this = this;
      _this.setState({
        isLoading:true
      })
      //到底部触发加载
      this.getContent(moment(startDate).format('YYYY-MM-DD'), function(result){
          let oldlen = listData.length;
          listData = [...listData, ...result.data.list];
          if(currPage <result.data.totalPage){
               hasMore=true;
            }else{
              hasMore=false;
            }
          _this.rData = { ..._this.rData, ...genData(result.data.list.length, oldlen) };
          _this.setState({
              dataSource: _this.state.dataSource.cloneWithRows(_this.rData),
              isLoading: false,
              hasMore:hasMore
          });
      },false)
    }
    handleChange(data){
      this.setState({
        currPage:1
      })
      this.initDate(data);
    }
    handleOk(){

    }
    goDetail = (item) => {
      const { history } = this.props;
      if(item.saveStatus==0){
        history.push({pathname:'/publish/round', query:item.id })
      }else{
        history.push({pathname:'/publish/roundDetails', query:item.id })
      }
    }
    handleLink = (address,id) => {
      let { history }  = this.props;
      history.push({pathname:address, query:id });
    }

    onChange(type,data){
        let handle = this.handleRes()[type];
        typeof handle!=='undefined'&&handle();
    }
    getContent(data, callback,flag){
        let _this = this;
        let {currPage} = _this.state;
        commonJs.ajaxPost('/api/dailyPatrols/listDailyPatrols', {qryDate: data,currPage:flag? 1 : currPage,pageSize:10}, function(result){
          if(result.code == 0){
            callback && callback(result);
          }
        })
    }

    showAlert = (id) => {
      const alertInstance = alert('删除', '确定删除此任务吗?', [
        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
        { text: '确定', onPress: () => this.delTask(id) },
      ]);
    
    };

    showStop = (id) => {
      const alertInstance = alert('终止任务', '确定终止此任务吗?', [
        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
        { text: '确定', onPress: () => this.stopTask(id) },
      ]);
    
    };

    //删除草稿
    delTask=(id)=>{
      commonJs.ajaxPost('/api/dailyPatrols/delTaskById', {
             id: id
          }, (res) => {
              if(res.code == 0){
                  this.initDate(this.state.startDate);
              }else{
                  Toast.info(res.msg);
                  return ;
              }
          });
    }
      //终止任务
  stopTask = (id)=>{
    let _this = this
    commonJs.ajaxPost('/api/cmdMonitor/stopPatrols', {
           id: id
         }, (res) => {
             if(res.code == 0){
              let { history }  = _this.props;
              listData.map((item)=>{
                  if(item.id==id){
                    item.taskStatus=3
                  }
              })
              const dataSource = new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            });
              _this.setState({
                dataSource: dataSource.cloneWithRows(listData),
              })
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
    const requstUri = patral ? '/api/cmdMonitor/stopPatrols':'/api/cmdMonitor/beginPatrols';
    commonJs.ajaxPost(requstUri,sendData,(data) => {
     if(data.code == '0') {
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
            if (!listData[rowID]) {
                return null
            }
            let obj = listData[rowID];
            let st = stateArr[obj.saveStatus];
            return (
              <div
                key={rowID}
                className="list-item"
              
              >
                  <div className="cont">
                    <div className="list-title">
                      <span>{obj.taskName}</span>
                      {obj.taskStatus==3?<i className="stop">已终止</i>:(obj.saveStatus == 1 ? <i className="haspush">已发布</i> : <i className="nopush">未发布</i>)}
                    </div>
                    <div>
                      <span>巡逻人员：</span>
                      <span>{obj.userNameList ? obj.userNameList.join("，") : '--'}</span>
                    </div>
                    <div>
                      <span>巡逻地点：</span>
                      <span>{obj.patrolsLocation ? obj.patrolsLocation : '--'}</span>
                    </div>
                    <div>
                      <span>巡逻日期：</span>
                      <span>{obj.startTime ? moment(obj.startTime).format('YYYY-MM-DD') : '--'} 至 {obj.endTime ? moment(obj.endTime).format('YYYY-MM-DD') : '--'}</span>
                    </div>
                    <div>
                      <span>巡逻说明：</span>
                      <span>{obj.taskContent ? obj.taskContent : '--'}</span>
                    </div>
                    <div className="btn-box">
                     {/*obj.saveStatus==1&&obj.taskStatus<2 ?
                      <Button 
                        inline 
                        size="small" 
                        className="stop-btn"
                        onClick={()=>this.showStop(obj.id)}
                      >终止任务</Button>:null*/}
                      {obj.saveStatus==1&&obj.taskStatus==0 ?
                      <Button 
                        inline 
                        size="small" 
                        className="start-btn"
                        onClick={()=>this.startOrEndPatral(obj.id,0)}
                      >开始任务</Button>:null}
                       {obj.saveStatus==1&&obj.taskStatus==1 ?
                      <Button 
                        inline 
                        size="small" 
                        className="stop-btn"
                        onClick={()=>this.startOrEndPatral(obj.id,1)}
                      >结束任务</Button>:null}
                      <Button 
                        inline 
                        size="small" 
                        className="detail-btn"
                        onClick={() => this.goDetail(obj)}
                      >查看详情</Button>
                     
                      {/*obj.saveStatus==0 ?
                      <Button 
                        inline 
                        size="small" 
                        className="del-btn"
                        onClick={()=>this.showAlert(obj.id)}
                      >删除</Button>:null*/}
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
const PubRound = createForm()(PubRoundComponent);
export default withRouter(PubRound);



// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubRound/index.js