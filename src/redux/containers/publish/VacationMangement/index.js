import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class Vacation extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>请假申请</div>;
  }
}

export default withRouter(Vacation);
