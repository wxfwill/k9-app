import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DetailComponent from 'components/DetailComponent/index.js';

class DailyPatrolDetal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
    };
  }
  componentDidMount() {
    const item = JSON.parse(util.urlParse(this.props.location.search).id);
    console.log(item);
    this.setState({
      details: [
        { label: '任务名称', value: item.taskName },
        {
          label: '巡逻开始时间',
          value: item.startTime ? util.formatDate(new Date(item.startTime), 'yyyy-MM-dd hh:mm:ss') : null,
        },
        {
          label: '巡逻结束时间',
          value: item.endTime ? util.formatDate(new Date(item.endTime), 'yyyy-MM-dd hh:mm:ss') : null,
        },
        { label: '巡逻地点', value: item.patrolsPlace },
        { label: '巡逻人员', value: item.planUserNames },
        { label: '巡逻说明', value: item.taskContent },
      ],
    });
  }
  render() {
    const { details } = this.state;
    return <DetailComponent details={details} />;
  }
}

export default withRouter(DailyPatrolDetal);
