import React, { Component } from 'react';
import { Card, Toast } from 'antd-mobile';
import Header from 'components/common/Header';
require('style/publish/public.less');
require('style/page/mapPage/mergeTrajectory.less');

class MergeTrajectory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackArr: [],
    };
  }
  componentDidMount() {
    //获取APP端网格人员数据
    const _this = this;
    window.JsStaffAcquisition = function (data) {
      let trackArr = JSON.parse(data);
      if (trackArr.length > 0) {
        _this.setState({
          trackArr: trackArr,
        });
      }
    };
  }
  //选择人员
  onChoose = (userId) => {
    const { trackArr } = this.state;
    trackArr.map((item) => {
      if (item.userId == userId) {
        item.choose = !item.choose;
      }
    });
    this.setState({
      trackArr: trackArr,
    });
  };
  //合并
  onSubmit = () => {
    const { trackArr } = this.state;
    let arr = [];
    trackArr.map((item) => {
      if (item.choose) {
        arr.push({ userTaskId: item.userTaskId });
      }
    });
    if (arr.length < 2) {
      Toast.fail('至少选择两位人员合并!', 1);
    } else {
      //合并人员轨迹
      util.CallApp({
        callAppName: 'mergeTrack',
        param: {
          param: arr,
        },
      });
    }
  };
  //取消
  onCancel = () => {
    const { trackArr } = this.state;
    trackArr.map((item) => {
      item.choose = false;
    });
    this.setState({
      trackArr: trackArr,
    });
  };
  //查看个人轨迹
  onCheck = (e, userTaskId) => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
    util.CallApp({
      callAppName: 'lookTrack',
      param: {
        userTaskId: userTaskId,
      },
    });
  };
  render() {
    const { trackArr } = this.state;
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header
            title="轨迹合并"
            pointer="pointer"
            jumpCallBack={() => {
              util.CallApp({
                callAppName: 'close',
              });
            }}
          />
          <div className="child-container">
            <div className="components mergeTrajectory-box">
              <div className="radio-list">
                {trackArr && trackArr.length > 0
                  ? trackArr.map((item) => {
                      return (
                        <Card
                          key={item.userId}
                          onClick={() => {
                            this.onChoose(item.userId);
                          }}
                        >
                          <Card.Body>
                            <div className="radio-cont">
                              <div className={item.choose ? 'radio-ico choose' : 'radio-ico'}></div>
                              <dl className="radio-infor">
                                <dt>
                                  {item.userName} <span>{item.number}</span>
                                </dt>
                                <dd>
                                  经纬度：{item.lat} , {item.lng}
                                </dd>
                              </dl>
                              <div className="check">
                                {item.choose ? (
                                  <span
                                    onClick={(e) => {
                                      this.onCheck(e, item.userTaskId);
                                    }}
                                  >
                                    查看
                                  </span>
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      );
                    })
                  : null}
              </div>
            </div>
          </div>
          <div className="footer-common mergeTrajectory-foot">
            <b className="btn cancel" onClick={this.onCancel}>
              取消
            </b>
            <b className="btn" onClick={this.onSubmit}>
              合并
            </b>
          </div>
        </div>
      </div>
    );
  }
}

export default MergeTrajectory;
