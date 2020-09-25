import React,{Component} from 'react';
import { DatePicker, List, WingBlank , Button } from 'antd-mobile';
import Reflux from 'reflux';
import ReactMixin from 'react-mixin';
import Header from 'components/common/Header';
import Store from './store';
import Actions from './actions';

require('style/drill/drillList.less');
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const Item = List.Item;
const Brief = Item.Brief;
class DrillDetail extends Component{
  constructor(props){
  	super(props);
    this.state = {
      date: now,
      detailData:[{
        date:'01-01',
        subject:'中级训练',
        drillTimer:'02:03:16',
        exercise:'6721'
      },{
        date:'01-02',
        subject:'中级训练',
        drillTimer:'02:03:16',
        exercise:'6721'
      },{
        date:'01-03',
        subject:'高级训练',
        drillTimer:'02:03:16',
        exercise:'6721'
      },{
        date:'01-04',
        subject:'中级训练',
        drillTimer:'02:03:16',
        exercise:'6721'
      },{
        date:'01-05',
        subject:'中级训练',
        drillTimer:'02:03:16',
        exercise:'6721'
      },{
        date:'01-06',
        subject:'高级训练',
        drillTimer:'02:03:16',
        exercise:'6721'
      }]
    }
  }
  handleChange(val){
    console.log(val.toLocaleString());
  }
  render(){
    const { user } = this.props.location;
  	return(
  		<div className="drill-list">
        <Header title='训练列表' pointer='pointer'/>
         <List className="date-picker-list" style={{ backgroundColor: 'white' }}>
            <DatePicker
              mode="date"
              title="选择日期"
              extra="Optional"
              value={this.state.date}
              onOk={this.handleChange.bind(this)}
              onChange={date => this.setState({ date })}
            >
              <List.Item arrow="horizontal">日期</List.Item>
            </DatePicker>
         </List>
         <div className="search-content">
            <div className="shadow-box">
              <List className="my-list">
                <Item className="search-header">
                  <span>时间</span>
                  <span className="center-span-01">训练科目</span>
                  <span className="center-span-02">训练时长</span>
                  <span>运动量</span>
                </Item>
              </List>
              <List className="result-data">
                {this.state.detailData.map((item,index)=>{
                  return(
                    <Item key={'detailData'+index}>
                      <span>{item.date}</span>
                      <span>{item.subject}</span>
                      <span>{item.drillTimer}</span>
                      <span>{item.exercise}</span>
                    </Item>
                  )
                })}
              </List>
            </div>
         </div>
  		</div>
  	)
  }
}

export default DrillDetail;











