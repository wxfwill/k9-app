import React, { Component } from 'react';
import { List, Icon, DatePicker, PickerView, Modal, InputItem, TextareaItem, Picker, Toast, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { withRouter } from 'react-router-dom';
import Header from 'components/common/Header';
import PeopleBox from 'components/common/CheckBox';
import PubAggMap from './PubEmedepMap';

require('style/publish/public.less');
require('components/common/CheckBox/style.less');

const Item = List.Item;
const alert = Modal.alert;
const titleType = {
  detail: '紧急调配详情',
  modify: '紧急调配修改',
  add: '紧急调配新增',
};

class AddComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalShow: false,
      reportArr: [],
      reportUserId: '',
      startDateStr: null,
      combatType: [],
      combatTypeName: '',
      taskContent: '',
      allMembers: [],
      taskName: '',
      members: '',
      id: '',
      userIds: '',
      location: '',
      disabled: false,
      isMap: false,
      combatTypeArr: [[{ label: '请选择', value: '' }]],
      pubEmedepInfo: null,
      chooseMembArr: [],
      PeopleBoxShow: false,
    };
    this.combatTypeObj = {};
    this.tempCombatTypeValue = [];
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
      PeopleBoxShow: false,
    });
  };
  choosePoint = () => {
    this.setState((prevState) => ({
      isMap: !prevState.isMap,
    }));
  };
  chooseType = () => {
    this.setState((prevState) => ({
      modalShow: !prevState.modalShow,
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
          let { reportArr } = this.state;
          let userIds = [];
          result.data.map((item) => {
            reportArr.map((r) => {
              if (r.value == item.id) {
                item.remark = true;
                userIds.push(item.id);
              }
            });
          });
          /*let members = this.state.members.split(',');
		    		let userIds = [];
			        result.data.map((item) => {
			        	if(userIds.some((o)=>{return o==item.name})){
			        		item.remark = true;
			        		userIds.push(item.id);
			        	}
			        })*/
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
  requestCombatType() {
    React.$ajax.publish.getCombatType().then((result) => {
      if (result && result.code == 0) {
        let { combatTypeArr, combatType } = this.state;
        let initName = '';
        result.data.map((item) => {
          item.id == combatType[0] ? (initName = item.name) : '';
          this.combatTypeObj[item.id] = item.name;
          item.value = item.id;
          item.label = item.name;
          combatTypeArr[0].push(item);
        });
        this.setState((prevState) => ({
          combatTypeArr: combatTypeArr,
          combatTypeName: initName,
        }));
      }
    });
  }
  handleChange(time) {
    this.setState({
      startDateStr: time,
    });
  }
  combatTypeChange = (data) => {
    this.tempCombatTypeValue = data;
  };
  combatOk() {
    this.setState((prevState) => ({
      modalShow: false,
      combatType: this.tempCombatTypeValue,
      combatTypeName: this.combatTypeObj[this.tempCombatTypeValue[0]],
    }));
  }
  combatCancel() {
    this.setState({
      modalShow: false,
    });
  }
  handleOk() {}
  changePeo = (data) => {
    this.setState({
      reportUserId: data[0],
    });
  };
  getMapInfo(data) {
    this.setState({
      pubEmedepInfo: {
        isClose: true,
        drawShapeDTO: data.drawShapeDTO,
        location: data.location,
      },
      location: data.location,
    });
  }
  clearAll() {
    this.tempCombatTypeValue = [];
    this.setState({
      location: '',
      members: '',
      userIds: '',
      startDateStr: null,
      taskName: '',
      taskContent: '',
      location: '',
      pubEmedepInfo: null,
      combatTypeName: '',
      reportUserId: '',
      combatType: this.tempCombatTypeValue,
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
    const { location, userIds, pubEmedepInfo, combatType, reportUserId } = this.state;
    if (errObj || !reportUserId || !userIds || !location || !pubEmedepInfo || combatType.length < 1) {
      util.toast('有选项为空！');
      return false;
    }
    this.isRequest = true;
    data.startDateStr = util.formatDate(data.startDateStr, 'yyyy-MM-dd');
    data.userIds = userIds;
    data.location = location;
    data.drawShapeDTO = {
      coord: pubEmedepInfo.drawShapeDTO.coord,
      drawShapeType: pubEmedepInfo.drawShapeDTO.drawShapeType,
      radius: pubEmedepInfo.drawShapeDTO.radius,
    };
    data.combatType = combatType[0];
    data.reportUserId = this.state.reportUserId;
    data.id = this.state.id;
    React.$ajax.publish.publishEmergencyDeploymentPlan(data).then((result) => {
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
      type: 3, //任务类型1训练2巡逻3紧急调配4网格搜捕5定点集合6外勤任务
      dataId: val.id,
      taskName: val.taskName,
      userId: this.state.reportUserId,
      approveUserId: user.id,
    };
    React.$ajax.publish.emedepSaveInfo(data).then((result) => {
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
      const {
        startDateStr,
        drawShapeDTO,
        taskStatus,
        saveStatus,
        combatType,
        combatTypeName,
        location,
        taskContent,
        taskName,
        reportUserId,
        id,
        lat,
        lng,
        userMap,
        userNames,
        reportUserName,
      } = data;

      this.tempCombatTypeValue = [combatType];
      let reportArr = [];
      for (var p in userMap) {
        reportArr.push({ label: userMap[p], value: p });
      }
      this.setState({
        titleType,
        disabled: saveStatus == 1 ? true : false,
        combatType: this.tempCombatTypeValue,
        startDateStr: startDateStr ? new Date(startDateStr) : null,
        taskContent,
        location,
        saveStatus,
        taskStatus,
        taskName,
        reportArr,
        id,
        reportUserId: reportUserId + '',
        reportUserName,
        members: userNames,
        pubEmedepInfo: {
          drawShapeDTO: drawShapeDTO,
          location: location,
        },
      });
    }
    this.requestCombatType();
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
      .stopEmergency({
        id: this.props.location.query.data.id,
      })
      .then((res) => {
        if (res && res.code == 0) {
          let { history } = this.props;
          Toast.info('任务已终止！');
          sessionStorage.setItem('currTabs', 2);
          history.goBack();
        } else {
          Toast.info(res.msg);
          return;
        }
      });
  };

  showModal = () => {
    this.setState({
      PeopleBoxShow: true,
    });
  };

  render() {
    const { getFieldProps, getFieldDecorator, getFieldError } = this.props.form;
    const {
      modalShow,
      disabled,
      pubEmedepInfo,
      saveStatus,
      combatTypeArr,
      combatTypeName,
      startDateStr,
      combatType,
      taskContent,
      taskName,
      location,
      members,
      allMembers,
      reportUserName,
      reportArr,
      reportUserId,
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
                    clear
                    disabled={disabled}
                    placeholder="请输入任务名称"
                  ></InputItem>
                </List>
                <List className="list">
                  <p className="title">选择日期</p>
                  <DatePicker
                    {...getFieldProps('startDateStr', {
                      initialValue: startDateStr,
                      rules: [{ required: true, message: '选择日期不能为空！' }],
                    })}
                    mode="date"
                    disabled={disabled}
                    title="请选择日期"
                    value={startDateStr}
                    onOk={this.handleOk.bind(this)}
                    onChange={this.handleChange.bind(this)}
                  >
                    <Item arrow="horizontal"></Item>
                  </DatePicker>
                </List>
                <List className="list">
                  <p className="title">作战区域</p>
                  <div className="input-item" onClick={this.choosePoint}>
                    <div className="value-box">{location ? <p>{location}</p> : <span>请选择作战区域</span>}</div>
                    <Icon type="right" />
                  </div>
                </List>
                <List className="list">
                  <p className="title">作战类型</p>
                  <div className="input-item" onClick={this.chooseType}>
                    <div className="value-box">
                      {combatTypeName ? <p>{combatTypeName}</p> : <span>请选择作战类型</span>}
                    </div>
                    <Icon type="right" />
                  </div>
                </List>
                <List className="list">
                  <p className="title">作战人员</p>
                  <div className="input-item" onClick={this.showModal}>
                    <div className="value-box">
                      {this.state.members && this.state.members.length > 0 ? (
                        <p>{this.state.members}</p>
                      ) : (
                        <span>请选择巡逻人员</span>
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
                <List className="list">
                  <p className="title">作战内容</p>
                  <TextareaItem
                    {...getFieldProps('taskContent', {
                      initialValue: taskContent,
                      rules: [{ required: true, message: '作战内容不能为空！' }],
                    })}
                    disabled={disabled}
                    clear
                    placeholder="作战内容"
                    data-seed="logId"
                    autoHeight
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
        <PeopleBox
          searchTip="请输入查询内容"
          title="作战人员"
          modalShow={this.state.PeopleBoxShow}
          clickOk={(data) => this.clickOk(data)}
          useDefaultDom={true}
          dataList={allMembers}
          showValue={members}
        />

        {/* 地图 */}
        {this.state.isMap ? (
          <PubAggMap
            isMap={this.state.isMap}
            onMapData={(data) => this.getMapInfo(data)}
            onCancel={this.choosePoint}
            onCreate={this.handleCoo}
            pubEmedepInfo={pubEmedepInfo}
            disabled={disabled}
          />
        ) : null}
        {/* 作战类型列表 */}
        <Modal popup visible={modalShow} animationType="slide-up">
          <div className="check-box">
            <div className="header">
              <span className="cancel" onClick={this.combatCancel.bind(this)}>
                取消
              </span>
              <p className="title">请选择作战类型</p>
              <span className="confirm" onClick={this.combatOk.bind(this)}>
                确定
              </span>
            </div>
            <div className="main">
              <PickerView
                cols={1}
                onChange={this.combatTypeChange}
                value={combatType}
                data={combatTypeArr}
                cascade={false}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const AggregateAddItem = createForm()(AddComponent);
export default withRouter(AggregateAddItem);

// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubEmedep/AddItem.js
