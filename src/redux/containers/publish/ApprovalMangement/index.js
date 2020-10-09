import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class Approval extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>审批管理</div>;
  }
}

export default withRouter(Approval);
