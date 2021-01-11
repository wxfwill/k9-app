import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DetailComponent from 'components/DetailComponent/index.js';

class LevelDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
    };
  }
  componentDidMount() {
    // //获取详情
    const id = util.urlParse(this.props.location.search).id;
    id
      ? React.$ajax.own.getLeaveInfo({ id: id }).then((res) => {
          if (res && res.code == 0) {
            const item = res.data;
            this.setState({
              details: [
                { label: '请假类型', value: item.typeName },
                {
                  label: '开始时间',
                  value: item.leaveStartTime ? util.formatDate(item.leaveStartTime, 'yyyy-MM-dd hh:mm:ss') : null,
                },
                {
                  label: '结束时间',
                  value: item.leaveEndTime ? util.formatDate(item.leaveEndTime, 'yyyy-MM-dd hh:mm:ss') : null,
                },
                { label: '图片', value: item.fileList, type: 'img' },
                { label: '请假事由', value: item.remark },
              ],
            });
          }
        })
      : null;
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

export default withRouter(LevelDetails);
