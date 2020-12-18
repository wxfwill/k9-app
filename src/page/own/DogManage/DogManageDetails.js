import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DetailComponent from 'components/DetailComponent/index.js';

class DogManageDetails extends Component {
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
      ? React.$ajax.own.getDogManageDetails({ id: id, ignorePageRequest: true }).then((res) => {
          if (res && res.code == 0) {
            const item = res.data;
            this.setState({
              details: [
                { label: '警犬名称', value: item.dogName },
                {
                  label: '发病日期',
                  value: item.morbidityTime ? util.formatDate(new Date(item.morbidityTime), 'yyyy-MM-dd') : null,
                },
                {
                  label: '发病症状',
                  value: item.symptom,
                },
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

export default withRouter(DogManageDetails);
