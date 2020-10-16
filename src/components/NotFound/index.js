import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

require('style/404.less');

class NotFound extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="nofound-wrap">
        <div className="nofound-inner">
          <img src={require('images/404.svg')} alt="404" />
          <p className="nofound-text">哎呀！ 出错了~</p>
        </div>
      </div>
    );
  }
}

export default withRouter(NotFound);
