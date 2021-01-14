import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DetailComponent from 'components/DetailComponent/index.js';

class GridSearchDetal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
    };
  }
  componentDidMount() {
    const item = JSON.parse(util.urlParse(this.props.location.search).id);
    this.setState({
      details: [
        { label: '主要内容', value: item.taskContent },
        {
          label: '开始时间',
          value: item.startTime ? util.formatDate(item.startTime, 'yyyy-MM-dd hh:mm:ss') : null,
        },
        { label: '发布人', value: item.publishUserName },
      ],
    });
  }
  render() {
    const { details } = this.state;
    return <DetailComponent details={details} />;
  }
}

export default withRouter(GridSearchDetal);
