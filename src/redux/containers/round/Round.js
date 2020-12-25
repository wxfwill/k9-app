import React, { Component } from 'react';
import { List, Picker, DatePicker, WingBlank } from 'antd-mobile';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { createForm } from 'rc-form';
import Reflux from 'reflux';
import ReactMixin from 'react-mixin';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import Store from './store';
import Actions from './actions';

const Item = List.Item;
const Brief = Item.Brief;
require('style/round/round.less');

class RoundComponent extends Component {
  constructor(props) {
    super(props);
    //let { user } = this.props.loginState;
    let user = JSON.parse(sessionStorage.getItem('user'));
    this.state = {
      roudData: [],
      user: user,
      statusText: {
        // status 0 未开始 1 进行中 2 停止 3 over
        0: '开始巡逻',
        1: '巡逻进行中',
        2: '巡逻暂停',
        3: '任务结束',
      },
    };
    Actions.getRound(user.id); // status 0 未开始 1 进行中 2 停止 3 over
    util.loading.show('数据加载中...');
  }
  onChange(type, data) {
    if (type == 'roundList' && typeof data == 'object') {
      // this.setState({roudData:data},function(){
      //   util.loading.hide();
      // })
      this.setState({ roudData: data });
      //util.loading.hide();
    }
    util.loading.hide();
  }
  handleOk() {}
  handleChange(date) {
    this.setState({ date });
    const { user } = this.state;
    let subDate = date.toLocaleString().split(' ')[0].split('/').join('-0');
    Actions.getRound(user.id, subDate);
    util.loading.show('数据加载中...');
  }
  handleRound = (item) => {
    const { history } = this.props;
    const { area, referencePoint, taskName, taskDetailId, taskType, status } = item;
    history.push({ pathname: '/round/map', query: { area, referencePoint, taskDetailId, taskType, taskName, status } });
  };
  render() {
    const { getFieldProps } = this.props.form;
    const { roudData, statusText } = this.state;
    return (
      <div className="Round">
        <div className="round-header">
          <Header title="巡逻任务列表" />
          <List style={{ backgroundColor: 'white' }}>
            <DatePicker
              mode="date"
              title="选择日期"
              value={this.state.date}
              onOk={this.handleOk.bind(this)}
              onChange={this.handleChange.bind(this)}
            >
              <Item arrow="horizontal">日期</Item>
            </DatePicker>
          </List>
        </div>
        <WingBlank className="duty-list">
          <List>
            {roudData.length >= 1 ? (
              roudData &&
              roudData.map((item, index) => {
                return (
                  <Item
                    className="duty-item"
                    extra={
                      <p
                        className={classnames('mark', { active: item.status == 0 })}
                        onClick={item.status !== 3 ? () => this.handleRound(item) : null}
                      >
                        <span>{statusText[item.status]}</span>
                      </p>
                    }
                    multipleLine
                    key={index}
                  >
                    {item.taskName}{' '}
                    <Brief>
                      {new Date(item.startTime).toLocaleString()}
                      {item.patrolsPlace}
                    </Brief>
                  </Item>
                );
              })
            ) : (
              <WingBlank className="normal-data" size="sm">
                暂无数据...
              </WingBlank>
            )}
          </List>
        </WingBlank>
        <Footer />
      </div>
    );
  }
}
ReactMixin.onClass(RoundComponent, Reflux.listenTo(Store, 'onChange'));
const Round = createForm()(RoundComponent);

const mapStateToProps = (state) => ({
  loginState: state.login,
});
export default connect(mapStateToProps)(Round);

// WEBPACK FOOTER //
// ./src/redux/containers/round/Round.js
