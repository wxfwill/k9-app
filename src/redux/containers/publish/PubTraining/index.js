
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
      className: 'nopush',
      name: '未发布'
    },
    {
      className: 'haspush',
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

class PubTrainingComponent extends Component{
    constructor(props){
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state={
          startDate:now,
          currPage:1,
          dataSource,
          isLoading: true,
          hasMore: true,
        }
        this.timer = null;
    }
    componentDidMount() {
      this.initData();
    }

    initData(data){
      listData = [];
      let _this = this;
      _this.setState({
        startDate: data?data:now,
      })
      const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
      //第一次请求列表
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
          hasMore:hasMore,
          height: hei,
          currPage:1
        });
      },true)
    }
    onEndReached = (event) => {
      let {currPage,isLoading,hasMore,startDate}=this.state;
      let _this = this;
      if (isLoading || !hasMore) {
        return;
      }
      _this.setState({
        isLoading:true
      })
      currPage++;
      this.setState({
          currPage:currPage
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
              hasMore:hasMore,
          });
      },false)
    }
    handleChange(data){
      this.setState({
        currPage:1
      })
      this.initData(data);
    }
    handleOk(){

    }
      goDetail = (item) => {
      const { history } = this.props;
      history.push({pathname:'/publish/training', query:item })
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
        commonJs.ajaxPost('/api/train/listPlanPage', {trainDate: data,currPage:flag? 1 : currPage,pageSize:10}, function(result){
          if(result.code == 0){
            callback && callback(result);
          }
        })
    }

    showAlert = (id) => {
      const alertInstance = alert('删除', '确定删除此任务吗?', [
        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
        { text: '确定', onPress: () => this.delTraining(id) },
      ]);
    
    };

    //删除草稿
    delTraining=(id)=>{
      commonJs.ajaxPost('/api/train/deleteByIds', {
             ids: [id]
           }, (res) => {
               if(res.code == 0){
                this.initData(this.state.startDate);
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
                     <span> {obj.subjectName}</span>
                      {obj.saveStatus == 1 ? <i className="haspush">已发布</i> : <i className="nopush">未发布</i>}
                    </div>
                    <div>
                      <span>训练人员：</span>
                      <span>{obj.userNames ? obj.userNames: '--'}</span>
                    </div>
                    <div>
                      <span>训练场地：</span>
                      <span>{obj.location ? obj.location : '--'}</span>
                    </div>
                    <div>
                      <span>训练日期：</span>
                      <span>{obj.trainDate ? moment(obj.trainDate).format('YYYY-MM-DD') : '--'}</span>
                    </div>
                    <div>
                      <span>训练说明：</span>
                      <span>{obj.remark ? obj.remark : '--'}</span>
                    </div>
                    <div className="btn-box">
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
const PubTraining = createForm()(PubTrainingComponent);
export default withRouter(PubTraining);



// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubTraining/index.js