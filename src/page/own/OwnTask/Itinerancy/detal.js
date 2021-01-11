import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DetailComponent from 'components/DetailComponent/index.js';

class ItinerancyDetal extends Component {
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
        { label: '任务名称', value: item.planName },
        {
          label: '日期',
          value: item.taskTime ? util.formatDate(item.taskTime, 'yyyy-MM-dd hh:mm:ss') : null,
        },
        { label: '参与人员', value: item.planUserNames },
        { label: '任务描述', value: item.content },
      ],
    });
  }
  render() {
    const { details } = this.state;
    return <DetailComponent details={details} />;
  }
}

export default withRouter(ItinerancyDetal);
