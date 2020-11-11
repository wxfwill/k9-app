import React, { Component } from 'react';
import { Card, WingBlank, WhiteSpace, Icon, DatePicker, List } from 'antd-mobile';
import { createForm } from 'rc-form';
require('style/publish/public.less');
require('style/page/workbench/WorkAssessment.less');

const Item = List.Item;

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class RankingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: now,
    };
  }
  render() {
    return (
      <div className="layer-main">
        <div className="parent-container">
          {/* <Header title="报备排行榜" pointer="pointer" /> */}
          <div className="child-container">
            <div className="components">
              <div className="ranking-list">
                <div className="top">
                  <Icon
                    type="left"
                    className="return"
                    onClick={() => {
                      this.props.history.goBack();
                    }}
                  />
                  <div className="text">
                    <span>每日报备</span>
                    <p>排行榜</p>
                    <div className="date-box">
                      <DatePicker
                        mode="date"
                        title="选择日期"
                        extra="Optional"
                        value={this.state.date}
                        onChange={(date) => this.setState({ date })}
                      >
                        <List.Item arrow="horizontal">
                          {util.formatDate(new Date(this.state.date), 'yyyy-MM-dd')}
                        </List.Item>
                      </DatePicker>
                      <p>{util.formatDate(new Date(this.state.date), 'yyyy-MM-dd')}</p>
                      <Icon type="down" />
                    </div>
                  </div>
                </div>
                <div className="content">
                  <div className="tab">
                    <ul>
                      <li className="w15">排名</li>
                      <li className="w20">姓名</li>
                      <li className="w30">类型</li>
                      <li className="w20">次数</li>
                      <li className="w15">分数</li>
                    </ul>
                  </div>
                  <List className="my-list">
                    <Item
                      extra={
                        <ul>
                          <li className="w15">
                            <img src={require('images/publish/gold.svg')} />
                          </li>
                          <li className="w20">独孤求败</li>
                          <li className="w30">协助破案</li>
                          <li className="w20">2</li>
                          <li className="w15">19</li>
                        </ul>
                      }
                    />
                    <Item
                      extra={
                        <ul>
                          <li className="w15">
                            <img src={require('images/publish/silver.svg')} />
                          </li>
                          <li className="w20">独孤求败</li>
                          <li className="w30">协助破案</li>
                          <li className="w20">2</li>
                          <li className="w15">19</li>
                        </ul>
                      }
                    />
                    <Item
                      extra={
                        <ul>
                          <li className="w15">
                            <img src={require('images/publish/copper.svg')} />
                          </li>
                          <li className="w20">独孤求败</li>
                          <li className="w30">协助破案</li>
                          <li className="w20">2</li>
                          <li className="w15">19</li>
                        </ul>
                      }
                    />
                    <Item
                      extra={
                        <ul>
                          <li className="w15">4</li>
                          <li className="w20">独孤求败</li>
                          <li className="w30">协助破案</li>
                          <li className="w20">2</li>
                          <li className="w15">19</li>
                        </ul>
                      }
                    />
                  </List>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const RankingListWrapper = createForm()(RankingList);
module.exports = RankingListWrapper;
