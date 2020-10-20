import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Tabs, List, Badge } from 'antd-mobile';
import Header from 'components/common/Header';
// 网格化搜捕
import OwnGridList from './GridSearch';
// 训练计划
import Drill from './Drill';
// 日常巡逻
import DailyPatrol from './DailyPatrol';
//紧急调配
import EmergencyDeployment from './EmergencyDeployment';
// 定点集合
import OwnEmDepComponent from './AggregatePoint';
// 外勤任务
import Itinerancy from './Itinerancy';

require('style/own/ownTask.less');
const tabs = [
  {
    title: '网格化搜捕',
    label: '0',
    id: 0,
    icon: require('images/own/tasktab/grild.svg'),
    ActiveIcon: require('images/own/tasktab/active-grild.svg'),
  },
  {
    title: '训练计划',
    label: '1',
    id: 1,
    icon: require('images/own/tasktab/xun.svg'),
    ActiveIcon: require('images/own/tasktab/active-xun.svg'),
  },
  {
    title: '日常巡逻',
    label: '2',
    id: 2,
    icon: require('images/own/tasktab/daily.svg'),
    ActiveIcon: require('images/own/tasktab/active-daily.svg'),
  },
  {
    title: '紧急调配',
    label: '3',
    id: 3,
    icon: require('images/own/tasktab/jing.svg'),
    ActiveIcon: require('images/own/tasktab/active-jing.svg'),
  },
  {
    title: '定点集合',
    label: '4',
    id: 4,
    icon: require('images/own/tasktab/ding.svg'),
    ActiveIcon: require('images/own/tasktab/active-ding.svg'),
  },
  {
    title: '外勤任务',
    label: '5',
    id: 5,
    icon: require('images/own/tasktab/task.svg'),
    ActiveIcon: require('images/own/tasktab/active-task.svg'),
  },
];

class OwnTask extends Component {
  constructor(props) {
    super(props);
    this.headerHeight = React.createRef();
    this.tabHeight = React.createRef();
    this.state = {
      title: '',
      defaultKey: 0,
      tabH: 0,
      herderH: 0,
      tabType: '0',
      key: 0,
    };
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  addTask = () => {};
  componentWillMount() {}
  componentDidMount() {
    this.setState({
      tabH:
        ReactDOM.findDOMNode(this.tabHeight.current) &&
        ReactDOM.findDOMNode(this.tabHeight.current).querySelector('.am-tabs-tab-bar-wrap').clientHeight,
      herderH:
        ReactDOM.findDOMNode(this.headerHeight.current) &&
        ReactDOM.findDOMNode(this.headerHeight.current).querySelector('.header-title').clientHeight,
    });
  }
  onRef = (name, ref) => {
    if (name == 'parent') {
      this.parent = ref;
    }
  };
  handleClickTab = (item, index) => {
    this.setState({ defaultKey: index });
  };
  render() {
    return (
      <div className="ownTask">
        <Header
          pointer
          title="我的任务"
          myRef={this.headerHeight}
          handleShow={this.addTask.bind(this)}
          noColor="own"
          key={this.state.defaultKey}
          customContent="请选择时间"
        />
        <Tabs
          ref={this.tabHeight}
          tabs={tabs}
          renderTab={(tab) => {
            return (
              <div className="header-tab">
                <img src={this.state.defaultKey == tab.id ? tab.ActiveIcon : tab.icon} alt="icon" />
                {this.state.defaultKey == tab.id ? (
                  <span className="active-text">{tab.title}</span>
                ) : (
                  <span>{tab.title}</span>
                )}
              </div>
            );
          }}
          initialPage={0}
          prerenderingSiblingsNumber={0}
          swipeable={false}
          onTabClick={(tab, index) => {
            this.handleClickTab(tab, index);
          }}
        >
          <div style={{ boxSizing: 'border-box' }}>
            <OwnGridList tabHeight={this.state.tabH} headerH={this.state.herderH}></OwnGridList>
          </div>
          <div style={{ boxSizing: 'border-box', height: '100%' }}>
            <Drill tabHeight={this.state.tabH} headerH={this.state.herderH}></Drill>
          </div>
          <div style={{ boxSizing: 'border-box' }}>
            <DailyPatrol tabHeight={this.state.tabH} headerH={this.state.herderH}></DailyPatrol>
          </div>
          <div style={{ boxSizing: 'border-box' }}>
            <EmergencyDeployment tabHeight={this.state.tabH} headerH={this.state.herderH}></EmergencyDeployment>
          </div>
          <div style={{ boxSizing: 'border-box' }}>
            <OwnEmDepComponent tabHeight={this.state.tabH} headerH={this.state.herderH}></OwnEmDepComponent>
          </div>
          <div style={{ boxSizing: 'border-box', height: '100%' }}>
            <Itinerancy tabHeight={this.state.tabH} headerH={this.state.herderH}></Itinerancy>
          </div>
        </Tabs>
      </div>
    );
  }
}

export default withRouter(OwnTask);
