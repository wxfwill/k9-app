import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { createForm } from 'rc-form';
import { List, Modal, Button, InputItem, TextareaItem, Icon, Popover } from 'antd-mobile';
import commonJs from 'libs/CommonStore';
import Header from 'components/common/Header';
import moment from 'moment';

require('./style.less');

const Item = Popover.Item;

class ReportDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      reportDetail: {},
      commentList: [],
      commentListArr: {},
    };
    this.index = 0;
    this.palce = '';
    this.substation = '';
    this.remark = '';
  }
  requestReportInfo = (val) => {
    let data = {
      id: val,
    };

    commonJs.ajaxPost('/api/taskReport/taskReportInfo', data, (result) => {
      if (result.code == 0) {
        this.requestReportList();

        this.setState({
          id: result.data.id,
          reportDetail: result.data,
        });
      }
    });
  };
  requestReportList = () => {
    commonJs.ajaxPost('/api/taskReport/taskReportCommentList', {}, (result) => {
      if (result.code == 0) {
        this.setState({
          commentList: result.data,
        });
      }
    });
  };

  UNSAFE_componentWillMount() {
    const { query } = this.props.history.location;
    if (query) {
      this.requestReportInfo(query);
    }
  }

  render() {
    const { getFieldProps, getFieldDecorator, getFieldError } = this.props.form;
    const { type } = this.props;
    const { modalShow, reportDetail, commentListArr } = this.state;
    return (
      <div className="report-box" style={{ display: 'block' }}>
        <Header title="上报详情" pointer="pointer" pointer noColor />
        <div className="modal-content">
          <List>
            <div>
              {reportDetail.palce ? (
                <InputItem
                  value={reportDetail.palce}
                  //	defaultValue={reportDetail.palce || ''}
                >
                  查缉区域
                </InputItem>
              ) : null}
              {reportDetail.substation ? (
                <InputItem
                  value={reportDetail.substation}
                  //	defaultValue={reportDetail.substation || ''}
                >
                  分局名称
                </InputItem>
              ) : null}
              {reportDetail.commentList &&
                reportDetail.commentList.map((item, index) => (
                  <InputItem key={'detail' + index} defaultValue={item.number}>
                    {item.commentName}
                  </InputItem>
                ))}
            </div>

            <TextareaItem
              title="任务反馈"
              autoHeight
              labelNumber={5}
              value={reportDetail.remark || ''}
              //     defaultValue={reportDetail.remark+'' || ''}
            />
          </List>
        </div>
      </div>
    );
  }
}

export default createForm()(ReportDetail);

// WEBPACK FOOTER //
// ./src/components/common/Report/ReportDetail.js
