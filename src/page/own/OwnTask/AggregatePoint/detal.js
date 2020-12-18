import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DetailComponent from 'components/DetailComponent/index.js';

class AggregatePointDetal extends Component {
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
        { label: '任务名称', value: item.taskName },
        {
          label: '集合时间',
          value: item.assembleTime ? util.formatDate(new Date(item.assembleTime), 'yyyy-MM-dd hh:mm:ss') : null,
        },
        { label: '集合点', value: item.location },
        { label: '人员', value: item.planUserNames },
      ],
    });
  }
  render() {
    const { details } = this.state;
    return <DetailComponent details={details} />;
  }
}

export default withRouter(AggregatePointDetal);
