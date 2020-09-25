import React,{Component} from 'react';
import { NavBar, Icon, Tabs, WhiteSpace } from 'antd-mobile';
import Reflux from 'reflux';
import { createForm } from 'rc-form';
import ReactMixin from 'react-mixin';
import Store from './store';
import Actions from './actions';
import { withRouter,Link } from "react-router-dom";
import Header from 'components/common/Header';
import GridSearch from './GridSearch';
import OwnRound from './OwnRound';
import EmergencyDeployment from './EmergencyDeployment';
import OwnTraining from './OwnTraining';
import AggregatePoint from './AggregatePoint';
import Drill from './Drill';
import Itinerancy from './Itinerancy';

require('style/own/own.less');

const tabs = [
  { title: '我的训练'},
  { title: '我的巡逻'},
  { title: '紧急调配'},
  { title: '网格搜捕'},
  { title: '定点集合'},
  { title: '外勤任务'}
]

class OwnTaskComponent extends Component{
  constructor(props){
    super(props);
    this.state={
      number: 2,
      activeTab:sessionStorage.getItem('currTabs') || 0
    }
  }
  
  handleChange(){
    console.log(this)
    this.changeTest(this);
    console.log(this.state.number)
    
  }
  
  onChange(){
    
  }
  setCurrTab =(tab,index)=>{
    sessionStorage.setItem('currTabs',index);
  }
  
  changeTest(pointer){
    pointer.setState({
      number: ++pointer.state.number
    })
  }

  refresh =()=>{
    let _this=this;
    let {number} = _this.state;
    this.setState({
      number: ++number
    })
  }

  render(){
    
    const { getFieldProps } = this.props.form;
    const pageIndex = Number(this.state.activeTab);
  	return(
    
  		<div className="own-task">
        {/*
        <NavBar
          className="own-task-title"
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={ this.jump }
          rightContent={[
            <Icon key="0" type="search" onClick={this.handleChange.bind(this)} style={{ marginRight: '16px' }} />
          ]}
        >我的任务{ this.state.number }</NavBar>
        */}
        <Header title="我的任务" refresh={this.refresh.bind(this)} pointer isSearch />
        <Tabs tabs={tabs}
          initialPage={pageIndex}
          tabBarUnderlineStyle={{borderColor:'#15c619'}}
          swipeable={false}
          animated={false}
          useOnPan={false}
          prerenderingSiblingsNumber={0}
          onChange={(tab, index) => {console.log('onChange', tab, index)}}
          onTabClick={(tab, index) => {this.setCurrTab(tab,index)}}
          
        >
          <Drill></Drill>
          <OwnRound></OwnRound>
          <EmergencyDeployment></EmergencyDeployment>
          <GridSearch></GridSearch>
          <AggregatePoint></AggregatePoint>
          <Itinerancy></Itinerancy>
        </Tabs>
  		</div>
  	)
  }
}

ReactMixin.onClass(OwnTaskComponent,Reflux.listenTo(Store, 'onChange'));
const OwnTask = createForm()(OwnTaskComponent);
export default withRouter(OwnTask);














// WEBPACK FOOTER //
// ./src/components/own/OwnTask/index.js