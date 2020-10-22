import React, { Component } from 'react';
import { List, Icon, Tabs, DatePicker, Modal, InputItem, TextareaItem, Picker, Toast, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { withRouter, Link } from 'react-router-dom';
import Header from 'components/common/Header';
import Choose from 'components/common/CheckBox';
import PubAggMap from './PubAggMap';

require('style/publish/public.less');

const Item = List.Item;
const alert = Modal.alert;
const titleType = {
  detail: '定点集合详情',
  modify: '定点集合修改',
  add: '定点集合新增',
};

class AddComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assembleTime: '',
      reportArr: [],
      chooseMembArr: [],
      allMembers: [],
      taskName: '',
      members: '',
      userIds: '',
      location: '',
      reportUserId: '',
      pointer: null,
      disabled: false,
      isMap: false,
      modalShow: false,
    };
    this.isRequest = false;
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
  choosePoint = () => {
    this.setState((prevState) => ({
      isMap: !prevState.isMap,
    }));
  };
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  requestAllMembers = (backCall) => {
    React.$ajax.publish.getCombatStaff().then((result) => {
      if (result && result.code == 0) {
        if (this.state.members) {
          let members = this.state.members.split(',');
          let userIds = [];
          result.data.map((item) => {
            if (
              userIds.some((o) => {
                return o == item.name;
              })
            ) {
              item.remark = true;
              userIds.push(item.id);
            }
          });
          this.setState({
            userIds: userIds.join(),
            allMembers: result.data,
          });
        } else {
          this.setState({
            allMembers: result.data,
          });
        }
        backCall && backCall();
      }
    });
  };
  handleChange(time) {
    this.setState({
      assembleTime: time,
    });
  }
  handleOk() {}
  changePeo = (data) => {
    this.setState({
      reportUserId: data[0],
    });
  };
  getMapInfo(data) {
    if (data) {
      this.setState({
        location: data.address,
        pointer: data.pointer,
      });
    }
  }
  clearAll() {
    this.tempCombatTypeValue = [];
    this.setState({
      location: '',
      members: '',
      userIds: '',
      taskName: '',
      assembleTime: null,
      pointer: null,
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

    if (errObj || !this.state.reportUserId) {
      util.toast('有选项为空！');
      return false;
    }
    this.isRequest = true;
    data.assembleTime = data.assembleTime.getTime();
    data.userIds = this.state.userIds.split(',');
    data.location = this.state.location;
    data.lat = this.state.pointer.lat;
    data.lng = this.state.pointer.lng;
    data.reportUserId = this.state.reportUserId;
    React.$ajax.publish.saveAssemblePoint(data).then((result) => {
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
      type: 5, //任务类型1训练2巡逻3紧急调配4网格搜捕5定点集合6外勤任务
      dataId: val.id,
      taskName: val.taskName,
      userId: this.state.reportUserId,
      approveUserId: user.id,
    };
    React.$ajax.publish.aggregateSaveInfo(data).then((result) => {
      if (result && result.code == 0) {
        backCall && backCall(result);
      } else {
        util.toast('选定上报人员失败失败！');
      }
    });
  }
  componentDidMount() {
    if (this.props.location.query && this.props.location.query.titleType) {
      let { titleType, data } = this.props.location.query;
      this.titleType = titleType;
      const { assembleTime, location, taskName, lat, lng, userNames, reportUserName, taskStatus } = data;
      this.setState({
        titleType,
        location,
        taskStatus,
        taskName,
        reportUserName,
        disabled: true,
        assembleTime: new Date(assembleTime),
        members: userNames,
        pointer: { lat, lng },
      });
    }
    this.requestAllMembers();
  }
  showStop = () => {
    const alertInstance = alert('终止任务', '确定终止此任务吗?', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确定', onPress: () => this.stopTask() },
    ]);
  };

  //终止任务
  stopTask = () => {
    React.$ajax.publish
      .stopAssembleTask({
        id: this.props.location.query.data.id,
      })
      .then((res) => {
        if (res.code == 0) {
          let { history } = this.props;
          Toast.info('任务已终止！');
          sessionStorage.setItem('currTabs', 3);
          history.goBack();
        } else {
          Toast.info(res.msg);
          return;
        }
      });
  };

  showModal = () => {
    this.setState({
      modalShow: true,
    });
  };

  render() {
    const { getFieldProps, getFieldDecorator, getFieldError } = this.props.form;
    const {
      disabled,
      assembleTime,
      taskName,
      location,
      members,
      allMembers,
      reportUserId,
      reportArr,
      reportUserName,
      taskStatus,
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
                    {...getFieldProps('taskName', {
                      initialValue: taskName,
                      rules: [{ required: true, message: '任务名称不能为空！' }],
                    })}
                    disabled={disabled}
                    placeholder="请输入任务名称"
                  ></InputItem>
                </List>
                <List className="list">
                  <p className="title">选择日期</p>
                  <DatePicker
                    {...getFieldProps('assembleTime', {
                      initialValue: assembleTime,
                      rules: [{ required: true, message: '选择日期不能为空！' }],
                    })}
                    disabled={disabled}
                    title="请选择日期"
                    value={assembleTime}
                    onOk={this.handleOk.bind(this)}
                    onChange={this.handleChange.bind(this)}
                  >
                    <Item arrow="horizontal"></Item>
                  </DatePicker>
                </List>
                <List className="list">
                  <p className="title">选集合点</p>
                  <div className="input-item" onClick={this.choosePoint.bind(this)}>
                    <div className="value-box">{location ? <p>{location}</p> : <span>请选择集合点</span>}</div>
                    <Icon type="right" />
                  </div>
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
                      onOk={(value) => this.changePeo(value)}
                    >
                      <List.Item arrow="horizontal"></List.Item>
                    </Picker>
                  </List>
                ) : null}
                <List className="list list-button">
                  <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                    发布任务
                  </Button>
                </List>
              </div>
            </div>
          </div>
        </div>
        {/* 地图 */}
        {this.state.isMap ? (
          <PubAggMap
            isMap={this.state.isMap}
            onMapData={(data) => this.getMapInfo(data)}
            onCancel={this.choosePoint}
            onCreate={this.handleCoo}
            initPointer={this.state.pointer}
            disabled={this.state.disabled}
          />
        ) : null}
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

const AggregateAddItem = createForm()(AddComponent);
export default withRouter(AggregateAddItem);

// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubAggregate/AddItem.js
