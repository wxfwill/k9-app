import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DetailComponent from 'components/DetailComponent/index.js';

class EmergencyDeploymentDetal extends Component {
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
          label: '日期',
          value: item.planStartDate ? util.formatDate(new Date(item.planStartDate), 'yyyy-MM-dd') : null,
        },
        { label: '作战区域', value: item.location },
        { label: '作战类型', value: item.combatTypeName },
        { label: '作战人员', value: item.planUserNames },
        { label: '作战内容', value: item.taskContent },
      ],
    });
  }
  render() {
    const { details } = this.state;
    return <DetailComponent details={details} />;
  }
}

export default withRouter(EmergencyDeploymentDetal);
