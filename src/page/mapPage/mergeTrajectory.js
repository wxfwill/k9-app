import React, { Component } from 'react';
import { Card, Icon } from 'antd-mobile';
import Header from 'components/common/Header';
require('style/publish/public.less');
require('style/page/mapPage/mergeTrajectory.less');

class MergeTrajectory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackArr: [
        {
          name: '张三',
          number: '0001',
          lg: '0000',
          lt: '1111',
        },
      ],
    };
  }
  onSelect = () => {
    this.props.history.push('/map/assignPerson');
  };
  render() {
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="轨迹合并" pointer="pointer" />
          <div className="child-container">
            <div className="components mergeTrajectory-box">
              <div className="content">
                <Card>
                  <Card.Header title="合并轨迹一" extra={<span className="delete">删除</span>} />
                  <Card.Body>
                    <div className="pers-box" onClick={this.onSelect}>
                      <div className="pers-infor">
                        <div className="name">
                          刘立伟 <span>00238</span>
                        </div>
                        <p>经纬度：N24° 45 16.1 E098° 02 43.8</p>
                      </div>
                      {/* <div className="select">请选择</div> */}
                      <Icon type={'down'} />
                    </div>
                    <div className="line">
                      <i></i>
                    </div>
                    <div className="pers-box" onClick={this.onSelect}>
                      <div className="pers-infor">
                        <div className="name">
                          刘立伟 <span>00238</span>
                        </div>
                        <p>经纬度：N24° 45 16.1 E098° 02 43.8</p>
                      </div>
                      <Icon type={'down'} />
                    </div>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Header title="合并轨迹一" extra={<span className="delete">删除</span>} />
                  <Card.Body>
                    <div className="pers-box" onClick={this.onSelect}>
                      <div className="select">请选择</div>
                      <Icon type={'down'} />
                    </div>
                    <div className="line">
                      <i></i>
                    </div>
                    <div className="pers-box" onClick={this.onSelect}>
                      <div className="select">请选择</div>
                      <Icon type={'down'} />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MergeTrajectory;
