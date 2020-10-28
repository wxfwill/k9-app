import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DetailComponent from 'components/DetailComponent/index.js';

class TaskDetal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [
        {
          label: '任务名称',
          value: '塘朗山网格化搜捕训练科目',
        },
        {
          label: '任务描述',
          value: '在塘朗山附近组织山地野战搜捕任务并完成区域搜索',
        },
        {
          label: '执行人员',
          value: '张鑫、李成、谢伟峰',
        },
        {
          label: '执行时间',
          value: '2020-05-21 14:00',
        },
        {
          label: '犬只',
          value: '小黑、小花、小虎',
        },
        {
          label: '搜索区域',
          value: '网格2',
        },
      ],
    };
  }
  render() {
    const { details } = this.state;
    return (
      <div>
        <DetailComponent details={details} />
      </div>
    );
  }
}

export default withRouter(TaskDetal);
