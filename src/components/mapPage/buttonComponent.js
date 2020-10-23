import React, { Component } from 'react';
import { Button, Icon } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
require('style/mapPage/buttonComponent.less');
class ButtonComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCaptain: true,
      showTrack: false,
    };
  }
  render() {
    const { middleColor } = this.props;
    const { isCaptain, showTrack } = this.state;
    return (
      <div className="button-component">
        <div className="main">
          <Button
            className={isCaptain ? 'selected' : ''}
            icon={isCaptain ? 'check-circle' : null}
            onClick={() => {
              this.setState({ isCaptain: !isCaptain });
            }}
          >
            只看队长
          </Button>
          <div className={'middle-btn' + ' ' + middleColor}>
            <i></i>
            <p>开始任务</p>
          </div>
          <Button
            className={showTrack ? 'selected' : ''}
            icon={showTrack ? 'check-circle' : null}
            onClick={() => {
              this.setState({ showTrack: !showTrack });
            }}
          >
            显示轨迹
          </Button>
        </div>
      </div>
    );
  }
}
export default withRouter(ButtonComponent);
