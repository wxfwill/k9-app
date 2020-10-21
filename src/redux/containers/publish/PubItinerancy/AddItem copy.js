import React, { Component } from 'react';
import { List, Icon, Tabs, DatePicker, Modal, InputItem, TextareaItem, Picker } from 'antd-mobile';
import Reflux from 'reflux';
import { createForm } from 'rc-form';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import Header from 'components/common/Header';
import Choose from 'components/common/CheckBox';

require('style/publish/pubItinerancy.less');

const Item = List.Item;
const titleType = {
  detail: '外勤任务详情',
  modify: '外勤任务修改',
  add: '外勤任务新增',
};

class AddComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      taskTime: null,
      reportArr: [],
      reportUserId: '',
      allMembers: [],
      initMembers: [],
      name: '',
      members: '',
      content: '',
      userIds: '',
      disabled: false,
      chooseMembArr: [],
    };
    this.isRequest = false;
    if (props.location.query) {
      this.id = props.location.query.id;
      this.titleType = props.location.query.titleType;
    }
  }
  clickOk = (data) => {
    let valArr = [];
    let idArr = [];
    let reportArr = [];
    data.map((item) => {
      valArr.push(item.name);
      idArr.push(item.id);
      reportArr.push({ label: item.name, value: item.id });
    });
    this.setState({
      reportUserId: '',
      reportArr: reportArr,
      chooseMembArr: data,
      members: valArr.join(),
      userIds: idArr.join(),
    });
  };

  requestAllMembers = () => {
    React.$ajax.publish.getCombatStaff().then((result) => {
      if (result && result.code == 0) {
        this.setState({
          allMembers: result.data,
        });
      }
    });
  };
  handleChange(time) {
    this.setState({
      taskTime: time,
    });
  }
  handleOk() {}
  changePeo = (data) => {
    console.log(data);
    this.setState({
      reportUserId: data[0],
    });
  };
  clearAll() {
    this.setState({
      members: '',
      userIds: '',
      taskTime: null,
      name: '',
      content: '',
    });
    this.props.form.resetFields();
    this.state.chooseMembArr.map((item) => {
      item.remark = '';
    });
  }
  handleSubmit() {
    if (this.isRequest) {
      return false;
    }
    let data = {};
    let errObj = '';
    this.props.form.validateFields((err, values) => {
      errObj = err;
      for (let key in values) {
        data[key] = values[key];
      }
    });
    const { members, userIds, reportUserId } = this.state;
    if (errObj || !userIds || !reportUserId) {
      util.toast('有选项为空！');
      return false;
    }
    this.isRequest = true;
    data.members = members;
    data.userIds = userIds;
    data.reportUserId = this.state.reportUserId;
    React.$ajax.publish.legworkDistributeTask(data).then((result) => {
      if (result && result.code == 0) {
        this.isRequest = false;
        util.toast('发布成功！');
        const { history } = this.props;
        history.goBack();
      } else {
        this.isRequest = false;
        util.toast('发布失败！');
      }
    });
  }
  sendReport(val, backCall) {
    let user = JSON.parse(sessionStorage.getItem('user'));
    let data = {
      type: 6, //任务类型1训练2巡逻3紧急调配4网格搜捕5定点集合6外勤任务
      dataId: val.id,
      taskName: val.name,
      userId: this.state.reportUserId,
      approveUserId: user.id,
    };
    React.$ajax.publish.legworkSaveInfo(data).then((result) => {
      if (result && result.code == 0) {
        backCall && backCall(result);
      } else {
        util.toast('选定上报人员失败失败！');
      }
    });
  }
  componentWillMount() {}
  componentDidMount() {
    this.requestAllMembers();
  }
  render() {
    const { getFieldProps, getFieldDecorator, getFieldError } = this.props.form;
    const {
      disabled,
      taskTime,
      name,
      members,
      content,
      allMembers,
      initMembers,
      reportName,
      reportArr,
      reportUserId,
    } = this.state;
    const title = titleType[this.titleType] ? titleType[this.titleType] : titleType.add;
    let errors;
    return (
      <div className="add-content">
        <Header title={title} pointer noColor />
        <div className="list-box">
          <List className="list">
            <DatePicker
              {...getFieldProps('taskTime', {
                initialValue: taskTime,
                rules: [{ required: true, message: '选择日期不能为空！' }],
              })}
              mode="date"
              disabled={disabled}
              title="选择日期"
              value={taskTime}
              onOk={this.handleOk.bind(this)}
              onChange={this.handleChange.bind(this)}
            >
              <Item arrow="horizontal">
                <i className="tips">*</i>开始时间
              </Item>
            </DatePicker>
          </List>
          <List className="list">
            <InputItem
              {...getFieldProps('name', {
                initialValue: name,
                rules: [{ required: true, message: '任务名称不能为空！' }],
              })}
              disabled={disabled}
              placeholder="请输入任务名称"
            >
              <i className="tips">*</i>任务名称
            </InputItem>
          </List>
          <Choose
            title="选择人员"
            initTip=""
            disabled={disabled}
            useDefaultDom={true}
            searchTip="请输入查询内容"
            clickOk={(data) => this.clickOk(data)}
            dataList={allMembers}
            showValue={members}
          />
          {!disabled ? (
            <List className="list">
              <Picker
                data={reportArr}
                placeholder="请选择上报人员"
                cols={1}
                value={[reportUserId]}
                className="forss"
                onOk={(value) => this.changePeo(value)}
              >
                <List.Item arrow="horizontal">
                  <i className="tips">*</i>上报人员
                </List.Item>
              </Picker>
            </List>
          ) : (
            <div className="list pointer-list list-disable">
              <div className="name">
                <i className="tips">*</i>上报人员
              </div>
              <div className="cont">{reportName ? reportName : '----'}</div>
            </div>
          )}
          <List className="list">
            <TextareaItem
              {...getFieldProps('content', {
                initialValue: content,
                rules: [{ required: true, message: '任务描述不能为空！' }],
              })}
              title={
                <span>
                  <i className="tips">*</i>任务描述
                </span>
              }
              disabled={disabled}
              placeholder="任务描述"
              data-seed="logId"
              autoHeight
            />
          </List>
        </div>
        {!disabled ? (
          <div className="btn-box">
            <button className="clear" onClick={() => this.clearAll()} style={{ display: 'none' }}>
              清空
            </button>
            <button className="publish" onClick={() => this.handleSubmit()}>
              发布
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}

const AddItinerancyAddItem = createForm()(AddComponent);
export default withRouter(AddItinerancyAddItem);

// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubItinerancy/AddItem.js
