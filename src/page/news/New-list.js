import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Tabs, List, Badge } from 'antd-mobile';
import Header from 'components/common/Header';
import NewNoList from './New-no-list';
import NewYesList from './New-yes-list';
require('style/own/own.less');
const tabs = [
  { title: '待办', label: 'no-done' },
  { title: '已办', sub: 'yes-done' },
];

class NewList extends Component {
  constructor(props) {
    super(props);
    this.headerHeight = React.createRef();
    this.tabHeight = React.createRef();
    this.state = {
      title: '',
      tabH: 0,
      herderH: 0,
      tabType: 'no-done',
      key: 0,
    };
    // this.parent = null;
    // this.listRef = (e) => {
    //   this.parent = e;
    // };
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  componentDidMount() {
    console.log(666);
  }
  addTask = () => {};
  UNSAFE_componentWillMount() {
    let obj = util.urlParse(this.props.location.search);
    if (JSON.stringify(obj) == '{}') {
      this.props.history.push('/news');
      return;
    } else {
      this.setState({ title: obj.title });
    }
  }
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
    console.log('111' + item);
    this.setState({ tabType: item.sub });
    console.log(this.parent.noData());
  };
  render() {
    return (
      this.state.title && (
        <div className="new-list-wrap Own">
          {/* <Header pointer title={this.state.title} isSet="+" ref={(el) => (this.headerHeight = el)} handleShow={this.addTask.bind(this)} /> */}
          <Header
            pointer
            title={this.state.title}
            myRef={this.headerHeight}
            isSet="+"
            handleShow={this.addTask.bind(this)}
          />
          <Tabs
            ref={this.tabHeight}
            tabs={tabs}
            initialPage={0}
            prerenderingSiblingsNumber={0}
            swipeable={false}
            onTabClick={(tab, index) => {
              this.handleClickTab(tab, index);
            }}
          >
            <div style={{ boxSizing: 'border-box' }}>
              <NewNoList
                onRef={this.onRef.bind(this)}
                tabHeight={this.state.tabH}
                headerH={this.state.herderH}
                typeTitle={this.state.title}
              ></NewNoList>
            </div>
            <div style={{ boxSizing: 'border-box', height: '100%' }}>
              <NewYesList
                tabHeight={this.state.tabH}
                headerH={this.state.herderH}
                typeTitle={this.state.title}
              ></NewYesList>
            </div>
          </Tabs>
        </div>
      )
    );
  }
}

export default withRouter(NewList);
