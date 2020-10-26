import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import DetailComponent from 'components/DetailComponent/index.js';

class TrainingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
    };
  }
  componentDidMount() {
    //获取详情
    // const id = util.urlParse(this.props.location.search).id;
    // id
    //   ? React.$ajax.publish.getAllTrainSubjectName({ id: id }).then((res) => {
    //       console.log(res, '--------------=================--------------');
    //       if (res && res.code == 0) {
    //         this.setState({
    //           details: [],
    //         });
    //       } else {
    //         Toast.info(res.msg);
    //         return;
    //       }
    //     })
    //   : null;
    const item = JSON.parse(util.urlParse(this.props.location.search).id);
    this.setState({
      details: [
        { label: '训练科目', value: item.subjectName },
        { label: '开始时间', value: item.trainDate ? util.formatDate(new Date(item.trainDate), 'yyyy-MM-dd') : null },
        { label: '场地类型', value: item.planId },
        { label: '巡逻地点', value: item.placeName },
        { label: '训练人员', value: item.planUserNames },
        { label: '训练说明', value: item.trainRemark },
      ],
    });
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

export default withRouter(TrainingDetail);
