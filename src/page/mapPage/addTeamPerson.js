import React, { Component } from 'react';
import { List, Button, SwipeAction } from 'antd-mobile';
import Header from 'components/common/Header';
require('style/publish/public.less');
require('style/page/mapPage/addTeamPerson.less');

class TaskDetal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="搜捕区域一" pointer="pointer" />
          <div className="child-container">
            <div className="components addTeamPerson-box">
              <div className="list-box zuzhang-box">
                <List>
                  <SwipeAction
                    autoClose
                    right={[
                      {
                        text: '删除',
                        onPress: () => console.log('delete'),
                        style: { backgroundColor: '#FF7575', color: 'white' },
                      },
                    ]}
                    onOpen={() => console.log('global open')}
                    onClose={() => console.log('global close')}
                  >
                    <div className="infor clearfix">
                      <div className="fl">
                        <b>谢志伟</b>
                        <span>00238</span>
                        <p className="zuzhang"></p>
                      </div>
                      <p className="fr">海拔：648m</p>
                    </div>
                    <div className="other-infor">
                      <p>最新定位时间：2020-04-24 14:32:38</p>
                      <p>经纬度：N24° 45 16.1 E098° 02 43.8</p>
                    </div>
                  </SwipeAction>
                </List>
              </div>
              <div className="list-box">
                <List>
                  <SwipeAction
                    autoClose
                    right={[
                      {
                        text: '删除',
                        onPress: () => console.log('delete'),
                        style: { backgroundColor: '#FF7575', color: 'white' },
                      },
                    ]}
                    onOpen={() => console.log('global open')}
                    onClose={() => console.log('global close')}
                  >
                    <div className="infor clearfix">
                      <div className="fl">
                        <b>谢志伟</b>
                        <span>00238</span>
                      </div>
                      <p className="fr">海拔：648m</p>
                    </div>
                    <div className="other-infor">
                      <p>最新定位时间：2020-04-24 14:32:38</p>
                      <p>经纬度：N24° 45 16.1 E098° 02 43.8</p>
                    </div>
                  </SwipeAction>
                </List>
              </div>
              <div className="list-box">
                <List>
                  <SwipeAction
                    autoClose
                    right={[
                      {
                        text: '删除',
                        onPress: () => console.log('delete'),
                        style: { backgroundColor: '#FF7575', color: 'white' },
                      },
                    ]}
                    onOpen={() => console.log('global open')}
                    onClose={() => console.log('global close')}
                  >
                    <div className="infor clearfix">
                      <div className="fl">
                        <b>谢志伟</b>
                        <span>00238</span>
                      </div>
                      <p className="fr">海拔：648m</p>
                    </div>
                    <div className="other-infor">
                      <p>最新定位时间：2020-04-24 14:32:38</p>
                      <p>经纬度：N24° 45 16.1 E098° 02 43.8</p>
                    </div>
                  </SwipeAction>
                </List>
              </div>
            </div>
          </div>
          <div className="footer-common addTeamPerson-btn">
            <p
              className="add-btn"
              onClick={() => {
                this.props.history.push('/map/addPlayers');
              }}
            >
              <img src={require('images/mapPage/add.svg')} />
              <b>继续添加</b>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default TaskDetal;
