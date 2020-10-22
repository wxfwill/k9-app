import React, { Component } from 'react';
import { List, Icon, DatePicker, InputItem, TextareaItem, Picker, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { withRouter } from 'react-router-dom';
import Header from 'components/common/Header';
import Choose from 'components/common/CheckBox';

require('style/publish/public.less');

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
      modalShow: false,
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
      modalShow: false,
    });
  };
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
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
  showModal = () => {
    this.setState({
      modalShow: true,
    });
  };
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
      <div className="layer-main">
        <div className="parent-container">
          <Header title={title} pointer="pointer"></Header>
          <div className="child-container">
            <div className="components">
              <div className="form-main">
                <List className="list">
                  <p className="title">任务名称</p>
                  <InputItem
                    {...getFieldProps('name', {
                      initialValue: name,
                      rules: [{ required: true, message: '任务名称不能为空！' }],
                    })}
                    disabled={disabled}
                    placeholder="请输入任务名称"
                  ></InputItem>
                </List>
                <List className="list">
                  <p className="title">选择日期</p>
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
                    <Item arrow="horizontal"></Item>
                  </DatePicker>
                </List>
                <List className="list">
                  <p className="title">选择人员</p>
                  <div className="input-item" onClick={this.showModal}>
                    <div className="value-box">
                      {this.state.members && this.state.members.length > 0 ? (
                        <p>{this.state.members}</p>
                      ) : (
                        <span>请选择人员</span>
                      )}
                    </div>
                    <Icon type="right" />
                  </div>
                </List>
                {this.state.members && this.state.members.length > 0 ? (
                  <List className="list">
                    <p className="title">上报人员</p>
                    <Picker
                      data={reportArr}
                      placeholder="请选择上报人员"
                      cols={1}
                      value={[reportUserId]}
                      className="forss"
                      onOk={(value) => this.changePeo(value)}
                    >
                      <List.Item arrow="horizontal"></List.Item>
                    </Picker>
                  </List>
                ) : null}
                <List className="list">
                  <p className="title">任务描述</p>
                  <TextareaItem
                    {...getFieldProps('content', {
                      initialValue: content,
                      rules: [{ required: true, message: '任务描述不能为空！' }],
                    })}
                    disabled={disabled}
                    data-seed="logId"
                    autoHeight
                    placeholder="请填写相关任务描述"
                    rows={2}
                  />
                </List>
                <List className="list list-button">
                  <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                    发布
                  </Button>
                </List>
              </div>
            </div>
          </div>
        </div>
        {/* 人员列表 */}
        <Choose
          title="选择人员"
          initTip=""
          disabled={disabled}
          useDefaultDom={true}
          modalShow={this.state.modalShow}
          searchTip="请输入查询内容"
          clickOk={(data) => this.clickOk(data)}
          dataList={allMembers}
          showValue={members}
        />
      </div>
    );
  }
}

const AddItinerancyAddItem = createForm()(AddComponent);
export default withRouter(AddItinerancyAddItem);

// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubItinerancy/AddItem.js
