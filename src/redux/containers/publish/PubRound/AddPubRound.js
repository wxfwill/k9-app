import React, { Component } from 'react';
import { List, InputItem, TextareaItem, Calendar, Picker, Button, WhiteSpace, Icon, Grid } from 'antd-mobile';
import { createForm } from 'rc-form';
import Header from 'components/common/Header';
import PeopleBox from 'components/common/CheckBox';
import enUS from 'antd-mobile/lib/calendar/locale/en_US';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import PubRoundMap from './PubRoundMap';
import moment from 'moment';
import { withRouter, Link } from 'react-router-dom';
require('style/publish/public.less');

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class AddPubRoundComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: now,
      end: now,
      dutyInfo: '',
      hasError: false,
      value: '',
      val: 1,
      en: false,
      show: false,
      config: {},
      isMap: false,
      PeopleList: [],
      selectedName: [],
      selectedId: [],
      taskInfo: '',
      id: '',
      disabled: false,
      reportArr: [],
      reportUserId: '9',
      modalShow: false,
    };
    this.timer = null;
    this.isRequest = false;
  }
  handleChange(type, date) {
    this.setState({
      [type]: date,
    });
  }
  handleOk() {}
  componentDidMount() {
    // this.timer = setInterval(  this.getUserLocation, 3000)

    //通过id获取详情数据

    if (Number(this.props.location.query) > 0) {
      const dataObj = { id: this.props.location.query };
      React.$ajax.publish.getDailyPatrolsById(dataObj).then((res) => {
        if (res && res.code == 0) {
          let ids = [];
          let names = [];
          let reportArr = [];
          for (var p in res.data.userMap) {
            ids.push(p);
            names.push(res.data.userMap[p]);
            reportArr.push({ label: res.data.userMap[p], value: p });
          }
          this.setState({
            id: this.props.location.query,
            taskInfo: res.data,
            startTime: res.data.startTime,
            endTime: res.data.endTime,
            selectedId: ids,
            reportName: res.data.reportName,
            selectedName: names,
            reportArr: reportArr,
            reportUserId: res.data.reportUserId + '',
            disabled: res.data.saveStatus == 1 ? true : false,
          });
          this.getPeople();
        } else {
          Toast.info(res.msg);
          return;
        }
      });
    } else {
      this.getPeople();
    }
  }
  getPeople = () => {
    const dataObj = {
      //id: this.props.location.query.id
    };
    React.$ajax.publish.getCombatStaff(dataObj).then((res) => {
      if (res && res.code == 0) {
        let { reportArr } = this.state;
        res.data.map((item) => {
          reportArr.map((r) => {
            if (r.value == item.id) {
              item.remark = true;
            }
          });
        });
        this.setState({
          PeopleList: res.data,
        });
      } else {
        Toast.info(res.msg);
        return;
      }
    });
  };

  showStop = () => {
    const alertInstance = alert('终止任务', '确定终止此任务吗?', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确定', onPress: () => this.stopTask() },
    ]);
  };

  //终止任务
  stopTask = () => {
    const dataObj = {
      id: this.props.location.query,
    };
    React.$ajax.publish.stopPatrols(dataObj).then((res) => {
      if (res && res.code == 0) {
        let { history } = this.props;
        Toast.info('任务已终止！');
        sessionStorage.setItem('currTabs', 1);
        history.goBack();
      } else {
        Toast.info(res.msg);
        return;
      }
    });
  };

  submit = () => {
    if (this.isRequest) {
      return false;
    }
    let errObj = '';
    let { startTime, selectedId, reportUserId } = this.state;
    this.props.form.validateFields((error, value) => {
      if (!startTime || !reportUserId || selectedId.length <= 0) {
        Toast.info('有选项为空！');
        return false;
      }
      if (!error) {
        this.isRequest = true;
        const dataObj = {
          drawShapeDTO: this.state.taskInfo.drawShapeDTO,
          endTime: moment(this.state.endTime).format('YYYY-MM-DD HH:mm:ss'),
          patrolsLocation: this.state.taskInfo.patrolsLocation,
          startTime: moment(this.state.startTime).format('YYYY-MM-DD HH:mm:ss'),
          taskContent: value.taskContent,
          taskName: value.taskName,
          id: this.state.id,
          userIds: this.state.selectedId.join(','),
          reportUserId: this.state.reportUserId,
        };
        React.$ajax.publish.distributeTask(dataObj).then((res) => {
          if (res && res.code == 0) {
            this.isRequest = false;
            /*  this.sendReport(res.data, (result) => {
                            })*/
            let { history } = this.props;
            Toast.info('发布成功！');
            sessionStorage.setItem('currTabs', 1);
            history.goBack();
          } else {
            this.isRequest = false;
            Toast.info(res.msg);
            return;
          }
        });
      } else {
        let data = {};
        errObj = error;
        for (let key in value) {
          data[key] = value[key];
        }
        if (errObj || this.state.selectedId || this.state.reportUserId || this.state.taskInfo) {
          Toast.info('有选项为空！');
        }
        console.log(error);
      }
    });
  };
  sendReport(val, backCall) {
    let user = JSON.parse(sessionStorage.getItem('user'));
    const dataObj = {
      type: 2, //任务类型1训练2巡逻3紧急调配4网格搜捕5定点集合6外勤任务
      dataId: val.id,
      taskName: val.taskName,
      userId: this.state.reportUserId,
      approveUserId: user.id,
    };
    React.$ajax.publish.roundSaveInfo(dataObj).then((res) => {
      if (res && res.code == 0) {
        backCall && backCall(result);
      } else {
        util.toast('选定上报人员失败失败！');
      }
    });
  }
  renderBtn(zh, en, config = {}) {
    config.locale = this.state.en ? enUS : zhCN;
    return (
      <List.Item
        arrow="horizontal"
        onClick={() => {
          document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
          this.setState({
            show: true,
            config,
          });
        }}
      >
        {this.state.en ? en : zh}
      </List.Item>
    );
  }
  changeLanguage = () => {
    this.setState({
      en: !this.state.en,
    });
  };

  onSelectHasDisableDate = (dates) => {
    console.warn('onSelectHasDisableDate', dates);
  };

  onConfirm = (startTime, endTime) => {
    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
    this.setState({
      show: false,
      startTime,
      endTime,
    });
  };

  onCancel = () => {
    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
    this.setState({
      show: false,
      startTime: undefined,
      endTime: undefined,
    });
  };

  onClose = (key) => {
    this.setState({
      [key]: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      isMap: false,
    });
  };

  addCoord() {
    this.setState({ isMap: true });
  }

  clickOk(data) {
    let names = [];
    let ids = [];
    let reportArr = [];
    data.forEach((element) => {
      names.push(element.name);
      ids.push(element.id);
      reportArr.push({ label: element.name, value: element.id });
    });
    this.setState({
      reportUserId: '',
      reportArr: reportArr,
      chooseMembArr: data,
      selectedName: names.join(','),
      selectedId: ids,
      modalShow: false,
    });
  }
  changePeo = (data) => {
    this.setState({
      reportUserId: data[0],
    });
  };
  getMapInfo(data) {
    if (Number(this.props.location.query) > 0) {
      let taskInfo = this.state.taskInfo;
      taskInfo.drawShapeDTO = data.drawShapeDTO;
      taskInfo.patrolsLocation = data.patrolsLocation;
      this.setState({
        taskInfo: taskInfo,
      });
    } else {
      this.setState({
        taskInfo: data,
      });
    }
  }
  showModal = () => {
    this.setState({
      modalShow: true,
    });
  };
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div className="form-main">
        <Header title="发布日常巡逻" pointer="pointer"></Header>
        <div className="list-box">
          <List className="list">
            <p className="title">任务名称</p>
            <InputItem
              title="任务名称"
              {...getFieldProps('taskName', {
                initialValue: this.state.taskInfo ? this.state.taskInfo.taskName : '',
                rules: [{ required: true, message: '任务名称不能为空！' }],
              })}
              placeholder="请输入任务名称"
              disabled={this.state.disabled}
              clear
            ></InputItem>
          </List>
          <List className="list">
            <p className="title">巡逻时间</p>
            <List className="list">
              {this.state.disabled
                ? null
                : this.renderBtn(<span>{/* <i className="tips">*</i>巡逻时间 */}</span>, '', {
                    pickTime: true,
                    showShortcut: true,
                    defaultValue: [
                      this.state.startTime ? new Date(this.state.startTime) : '',
                      this.state.endTime ? new Date(this.state.endTime) : '',
                    ],
                  })}
              {/*this.renderBtn('默认选择范围', 'Selected Date Range', { defaultValue: [new Date(+now - 86400000), new Date(+now - 345600000)] })*/}
              {this.state.startTime && (
                <List.Item disabled={this.state.disabled}>开始时间: {this.state.startTime.toLocaleString()}</List.Item>
              )}
              {this.state.endTime && (
                <List.Item disabled={this.state.disabled}>结束时间: {this.state.endTime.toLocaleString()}</List.Item>
              )}
              {this.state.disabled ? null : (
                <Calendar
                  {...this.state.config}
                  title={'巡逻时间'}
                  visible={this.state.show}
                  onCancel={this.onCancel}
                  onConfirm={this.onConfirm}
                  onSelectHasDisableDate={this.onSelectHasDisableDate}
                  getDateExtra={this.getDateExtra}
                  defaultDate={now}
                  minDate={new Date(+now - 5184000000)}
                  maxDate={new Date(+now + 31536000000)}
                ></Calendar>
              )}
            </List>
          </List>
          <List className="list">
            <p className="title">巡逻地点</p>
            <Picker
              extra="请选择巡逻地点"
              cols={1}
              {...getFieldProps('patrolsLocation', {
                initialValue: this.state.taskInfo ? this.state.taskInfo.patrolsLocation : '',
                rules: [{ required: true, message: '巡逻地点不能为空！' }],
              })}
            >
              <List.Item arrow="horizontal"></List.Item>
            </Picker>
          </List>
          <List className="list">
            <p className="title">巡逻人员</p>
            {/* <Picker
              extra="请选择巡逻人员"
              cols={1}
              {...getFieldProps('selectedName', {
                initialValue: this.state.selectedName,
              })}
            >
              <List.Item arrow="horizontal"></List.Item>
            </Picker> */}
            <List.Item arrow="horizontal" onClick={this.showModal}>
              <InputItem
                {...getFieldProps('selectedName', {
                  initialValue: this.state.selectedName,
                })}
                placeholder="请选择巡逻人员"
                disabled={true}
                clear
              ></InputItem>
            </List.Item>
            <PeopleBox
              searchTip="姓名、警号"
              title="添加人员"
              modalShow={this.state.modalShow}
              clickOk={(data) => this.clickOk(data)}
              dataList={this.state.PeopleList}
              showValue={this.state.selectedName}
            />
          </List>
          <List className="list">
            <p className="title">上报人员</p>
            <Picker
              data={this.state.reportArr}
              extra="请选择上报人员"
              cols={1}
              value={[this.state.reportUserId]}
              onOk={(value) => this.changePeo(value)}
            >
              <List.Item arrow="horizontal"></List.Item>
            </Picker>
          </List>
          <List className="list">
            <p className="title">巡逻说明</p>
            <TextareaItem
              autoHeight="true"
              clear
              disabled={this.state.disabled}
              {...getFieldProps('taskContent', {
                initialValue: this.state.taskInfo ? this.state.taskInfo.taskContent : '',
                rules: [{ required: true, message: '巡逻说明不能为空！' }],
              })}
              placeholder="请输入巡逻说明"
              rows={2}
            />
          </List>
          <List className="list list-button">
            <Button type="primary" onClick={this.submit}>
              发布任务
            </Button>
          </List>
        </div>
      </div>
    );
  }
}

const AddPubRound = createForm()(AddPubRoundComponent);
export default withRouter(AddPubRound);
