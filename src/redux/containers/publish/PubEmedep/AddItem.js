import React, { Component } from 'react';
import { List, Icon, Tabs, DatePicker, PickerView, Modal, InputItem, TextareaItem, Picker, Toast } from 'antd-mobile';
import Reflux from 'reflux';
import { createForm } from 'rc-form';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import Header from 'components/common/Header';
import Choose from 'components/common/CheckBox';
import PubAggMap from './PubEmedepMap';

require('style/publish/pubEmedep.less');

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
    data.startDateStr = moment(data.startDateStr).format('YYYY-MM-DD');
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
      <div className="add-content">
        <Header title={title} pointer noColor />
        <div className="list-box">
          <List className="list">
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
              <Item arrow="horizontal">
                <i className="tips">*</i>选择日期
              </Item>
            </DatePicker>
          </List>
          <List className="list">
            <InputItem
              {...getFieldProps('taskName', {
                initialValue: taskName,
                rules: [{ required: true, message: '任务名称不能为空！' }],
              })}
              clear
              disabled={disabled}
              placeholder="请输入任务名称"
            >
              <i className="tips">*</i>任务名称
            </InputItem>
          </List>
          <div className={`list pointer-list ${disabled ? 'list-disable' : ''}`}>
            <div className="name">
              <i className="tips">*</i>作战区域
            </div>
            <div className="cont">{location ? location : ''}</div>
            <div className="icon" onClick={() => this.choosePoint()}>
              {disabled ? '查看' : '添加'}
            </div>
          </div>
          <div className={`list pointer-list ${disabled ? 'list-disable' : ''}`}>
            <div className="name">
              <i className="tips">*</i>作战类型
            </div>
            <div className="cont">{combatTypeName ? combatTypeName : ''}</div>
            {disabled ? (
              ''
            ) : (
              <div className="icon" onClick={() => this.chooseType()}>
                选择
              </div>
            )}
          </div>
          <Choose
            title="作战人员"
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
                className="forss"
                value={[reportUserId]}
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
              <div className="cont">{reportUserName ? reportUserName : '----'}</div>
            </div>
          )}
          <List className="list">
            <TextareaItem
              {...getFieldProps('taskContent', {
                initialValue: taskContent,
                rules: [{ required: true, message: '作战内容不能为空！' }],
              })}
              title={
                <span>
                  <i className="tips">*</i>作战内容
                </span>
              }
              disabled={disabled}
              clear
              placeholder="作战内容"
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

        {disabled && taskStatus < 2 ? (
          <div className="btn-box only-btn">
            <button className="stop" onClick={this.showStop}>
              终止任务
            </button>
          </div>
        ) : null}
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
        <Modal popup visible={modalShow} animationType="slide-up">
          <div className="pick-view-btn">
            <span className="cancel" onClick={() => this.combatCancel()}>
              取消
            </span>
            <span className="sure" onClick={() => this.combatOk()}>
              确定
            </span>
            <div>请选择作战类型</div>
          </div>
          <PickerView
            cols={1}
            onChange={this.combatTypeChange}
            value={combatType}
            data={combatTypeArr}
            cascade={false}
          />
        </Modal>
      </div>
    );
  }
}

const AggregateAddItem = createForm()(AddComponent);
export default withRouter(AggregateAddItem);

// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubEmedep/AddItem.js
