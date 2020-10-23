import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Header from 'components/common/Header';
import DetailsModule from 'components/common/DetailsModule';
require('style/DetailsModule.less');

class RollCallDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: util.urlParse(this.props.location.search).id,
    };
  }
  render() {
    let { currentId } = this.state;
    return (
      <div className="parent-container">
        <Header title="点名详情" pointer="pointer" />
        <div className="child-container">
          <div className="components">
            <div className="details-box">
              <DetailsModule id={currentId} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(RollCallDetails);
