import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class DogReport extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>犬病上报</div>;
  }
}

export default withRouter(DogReport);
