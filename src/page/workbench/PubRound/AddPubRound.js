import React, { Component } from 'react';
import { List, InputItem, TextareaItem, Calendar, Picker, Button, WhiteSpace, Icon, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import Header from 'components/common/Header';
import PeopleBox from 'components/common/CheckBox';
import enUS from 'antd-mobile/lib/calendar/locale/en_US';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import PubRoundMap from './PubRoundMap';
import { withRouter } from 'react-router-dom';
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
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
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
          endTime: util.formatDate((this.state.endTime), 'yyyy-MM-dd hh:mm:ss'),
          patrolsLocation: this.state.taskInfo.patrolsLocation,
          startTime: util.formatDate((this.state.startTime), 'yyyy-MM-dd hh:mm:ss'),
          taskContent: value.taskContent,
          taskName: value.taskName,
          id: this.state.id,
          userIds: this.state.selectedId.join(','),
          reportUserId: this.state.reportUserId,
        };
        React.$ajax.publish.distributeTask(dataObj).then((res) => {
          if (res && res.code == 0) {
            this.isRequest = false;

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
  renderBtn = () => {
    let configs = {
      pickTime: true,
      showShortcut: true,
      defaultValue: [
        this.state.startTime ? new Date(this.state.startTime) : '',
        this.state.endTime ? new Date(this.state.endTime) : '',
      ],
    };
    configs.locale = this.state.en ? enUS : zhCN;
    document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
    this.setState({
      show: true,
      config: configs,
    });
  };
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

  addCoord = () => {
    this.setState({ isMap: true });
  };

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
      <div className="layer-main">
        <div className="parent-container">
          <Header title="发布日常巡逻" pointer="pointer"></Header>
          <div className="child-container">
            <div className="components">
              <div className="form-main">
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
                  <div className="input-item" onClick={this.renderBtn}>
                    <div className="value-box">
                      {this.state.startTime && this.state.endTime ? (
                        <p>
                          开始时间：{this.state.startTime.toLocaleString()}
                          <br />
                          结束时间：{this.state.endTime.toLocaleString()}
                        </p>
                      ) : (
                        <span>请选择巡逻时间</span>
                      )}
                    </div>
                    <Icon type="right" />
                  </div>
                </List>
                <List className="list">
                  <p className="title">巡逻地点</p>
                  <div className="input-item" onClick={this.addCoord}>
                    <div className="value-box">
                      {this.state.taskInfo && this.state.taskInfo.patrolsLocation ? (
                        <p>{this.state.taskInfo.patrolsLocation}</p>
                      ) : (
                        <span>请选择巡逻地点</span>
                      )}
                    </div>
                    <Icon type="right" />
                  </div>
                </List>
                <List className="list">
                  <p className="title">巡逻人员</p>
                  <div className="input-item" onClick={this.showModal}>
                    <div className="value-box">
                      {this.state.selectedName && this.state.selectedName.length > 0 ? (
                        <p>{this.state.selectedName}</p>
                      ) : (
                        <span>请选择巡逻人员</span>
                      )}
                    </div>
                    <Icon type="right" />
                  </div>
                </List>
                {this.state.selectedName && this.state.selectedName.length > 0 ? (
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
                ) : null}
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
                    placeholder="请填写相关任务描述"
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
          </div>
        </div>
        {/* 时间选择器 */}
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
        {/* 巡逻人员列表 */}
        <PeopleBox
          searchTip="姓名、警号"
          title="添加人员"
          modalShow={this.state.modalShow}
          clickOk={(data) => this.clickOk(data)}
          dataList={this.state.PeopleList}
          showValue={this.state.selectedName}
        />
        {/* 地图 */}
        {this.state.isMap ? (
          <PubRoundMap
            isMap={this.state.isMap}
            taskInfo={this.state.taskInfo}
            // handleShow={this.handleShow.bind(this)}
            onMapData={(data) => this.getMapInfo(data)}
            onCancel={this.handleCancel}
            onCreate={this.handleCoo}
          />
        ) : null}
      </div>
    );
  }
}

const AddPubRound = createForm()(AddPubRoundComponent);
export default withRouter(AddPubRound);
