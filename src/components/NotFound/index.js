import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class NotFound extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>404 NotFound</div>;
  }
}

export default withRouter(NotFound);
