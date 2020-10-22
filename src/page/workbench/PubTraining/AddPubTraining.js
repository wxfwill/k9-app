import React, { Component } from 'react';
import { List, DatePicker, TextareaItem, Picker, Button, Icon, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import Header from 'components/common/Header';
import PeopleBox from 'components/common/CheckBox';
import PubTrainingMap from './PubTrainingMap';
import { withRouter } from 'react-router-dom';
require('style/publish/public.less');
const Item = List.Item;
const Brief = Item.Brief;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
function failToast(text, fn) {
  Toast.fail(text, 1);
}
function successToast(text, fn) {
  Toast.success(text, 1, fn, true);
}

const placeTypeData = [
  {
    label: '基地内',
    value: 1,
  },
  {
    label: '基地外',
    value: 2,
  },
];

class AddPubTrainingComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: now,
      end: now,
      trainDate: null,
      dutyInfo: '',
      hasError: false,
      value: '',
      val: 1,
      isMap: false,
      PeopleList: [],
      selectedName: [],
      selectedId: [],
      typeOption: [],
      typeId: '',
      id: '',
      placeId: '',
      placeType: '',
      placeList: [],
      trainInfo: null,
      disabled: false,
      reportArr: [],
      reportUserId: '',
      modalShow: false,
    };
    this.timer = null;
    this.isRequest = false;
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  componentDidMount() {
    // this.timer = setInterval(  this.getUserLocation, 3000)
    React.$ajax.publish.getAllTrainSubjectName().then((res) => {
      if (res && res.code == 0) {
        console.log(this.props.location, '--------------=================--------------');
        //if (this.props.location.query) {
        let trainInfo = this.props.location.query ? this.props.location.query : { id: '', titleType: '' };
        const typeOption =
          res.data &&
          res.data.map((t) => {
            return { value: t.id, label: t.name, id: t.id };
          });

        this.setState({
          trainInfo: trainInfo.id !== '' ? trainInfo : null,
          startTime: trainInfo.trainTime,
          selectedId: trainInfo.userIds && trainInfo.userIds.split(','),
          placeType: trainInfo.placeType,
          typeId: trainInfo.subjectId,
          placeId: trainInfo.placeId,
          id: trainInfo.id,
          reportName: trainInfo.reportName,
          selectedName: trainInfo.userNames,
          trainDate: trainInfo.trainDate ? new Date(trainInfo.trainDate) : null,
          typeOption: typeOption,
          saveStatus: trainInfo.saveStatus,
          disabled: trainInfo.saveStatus == 1 ? true : false,
        });
        //}
      } else {
        Toast.info(res.msg);
        return;
      }
    });
    this.getPlaceList();
    this.getPeople();
  }
  getPeople = () => {
    React.$ajax.publish.getCombatStaff().then((res) => {
      if (res && res.code == 0) {
        let { selectedId } = this.state;
        if (selectedId) {
          res.data.map((item) => {
            selectedId.map((r) => {
              if (r == item.id) {
                item.remark = true;
              }
            });
          });
        }
        this.setState({
          PeopleList: res.data,
        });
      } else {
        Toast.info(res.msg);
        return;
      }
    });
  };

  //基地内场地信息
  getPlaceList = () => {
    React.$ajax.publish.listAllTrainPlace().then((res) => {
      if (res && res.code == 0) {
        const placeList =
          res.data &&
          res.data.map((t) => {
            return { value: t.id, label: t.name, id: t.id };
          });

        this.setState({
          placeList: placeList,
        });
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

    this.props.form.validateFields((error, value) => {
      /*    if(!this.state.reportUserId){
        Toast.info('有选项为空！')
        return false;
      }*/
      let params = {
        subjectId: this.state.typeId,
        id: this.state.id,
        placeType: this.state.placeType,
        placeId: this.state.placeId,
        trainDate: this.state.trainDate,
        remark: value.remark,
        userIds: this.state.selectedId.join(','),
        //       reportUserId: this.state.reportUserId
      };
      if (this.state.placeType == 2) {
        params.drawShapeDTO = this.state.trainInfo.drawShapeDTO; //在基地内没有这个地图信息！
        params.location = this.state.trainInfo.location;
      }
      if (!error) {
        this.isRequest = true;
        React.$ajax.publish.trainPublishPlan(params).then((res) => {
          if (res && res.code == 0) {
            this.isRequest = false;
            let { history } = this.props;
            Toast.info('发布成功！');
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

        if (errObj || this.state.selectedId || (this.state.trainInfo && this.state.trainInfo.location == '')) {
          Toast.info('有选项为空！');
        }

        console.log(error);
      }
    });
  };
  sendReport(val, backCall) {
    let user = JSON.parse(sessionStorage.getItem('user'));
    let taskName = this.state.typeOption.find((item) => item.value == this.state.typeId);
    let data = {
      type: 1, //任务类型1训练2巡逻3紧急调配4网格搜捕5定点集合6外勤任务
      dataId: val.id,
      taskName: taskName.label,
      userId: this.state.reportUserId,
      approveUserId: user.id,
    };
    React.$ajax.publish.trainSaveInfo(data).then((result) => {
      if (result && result.code == 0) {
        backCall && backCall(result);
      } else {
        util.toast('选定上报人员失败失败！');
      }
    });
  }

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

  getMapInfo(data) {
    console.log(data);
    if (typeof this.props.location.query != 'undefined' && this.props.location.query.id !== '') {
      let trainInfo = this.state.trainInfo;
      trainInfo.drawShapeDTO = data.drawShapeDTO;
      trainInfo.location = data.location;
      this.setState({
        trainInfo: trainInfo,
      });
    } else {
      this.setState(
        {
          trainInfo: data,
        },
        () => {
          console.log(this.state.trainInfo, '--------------=======-----=');
        }
      );
    }
  }
  handleChange(time) {
    this.setState({
      trainDate: time,
    });
  }
  handleOk() {}
  changeReport = (data) => {
    this.setState({
      reportUserId: data[0],
    });
  };

  changePeo = (value) => {
    this.setState({
      typeId: value[0],
    });
  };

  changePlaceType = (value) => {
    this.setState({
      placeType: value[0],
    });
  };

  changePlaceId = (value) => {
    this.setState({
      placeId: value[0],
    });
  };

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
          <Header title="发布训练计划" pointer="pointer"></Header>
          <div className="child-container">
            <div className="components">
              <div className="form-main">
                <List className="list">
                  <p className="title">训练科目</p>
                  <Picker
                    data={this.state.typeOption}
                    placeholder="请选择训练科目"
                    disabled={this.state.disabled}
                    cols={1}
                    {...getFieldProps('subjectName', {
                      initialValue: this.state.trainInfo ? [this.state.trainInfo.subjectId] : '',
                      rules: [{ required: true, message: '训练科目不能为空！' }],
                    })}
                    className="forss"
                    onOk={(value) => this.changePeo(value)}
                  >
                    <List.Item arrow="horizontal"></List.Item>
                  </Picker>
                </List>
                <List className="list">
                  <p className="title">选择日期</p>
                  <DatePicker
                    {...getFieldProps('trainDate', {
                      initialValue: this.state.trainDate,
                      rules: [{ required: true, message: '选择日期不能为空！' }],
                    })}
                    mode="date"
                    disabled={this.state.disabled}
                    title="选择日期"
                    value={this.state.trainDate}
                    onOk={this.handleOk.bind(this)}
                    onChange={this.handleChange.bind(this)}
                  >
                    <Item arrow="horizontal"></Item>
                  </DatePicker>
                </List>
                <List className="list">
                  <p className="title">场地类型</p>
                  <Picker
                    data={placeTypeData}
                    placeholder="请选择场地类型"
                    disabled={this.state.disabled}
                    cols={1}
                    {...getFieldProps('placeType', {
                      initialValue: this.state.trainInfo ? [this.state.trainInfo.placeType] : '',
                      rules: [{ required: true, message: '场地类型不能为空！' }],
                    })}
                    className="forss"
                    onOk={(value) => this.changePlaceType(value)}
                  >
                    <List.Item arrow="horizontal"></List.Item>
                  </Picker>
                </List>
                {this.state.placeType == 2 ? (
                  <List className="list">
                    <p className="title">巡逻地点</p>
                    <div className="input-item" onClick={this.addCoord.bind(this)}>
                      <div className="value-box">
                        {this.state.trainInfo && this.state.trainInfo.location ? (
                          <p>{this.state.trainInfo.location}</p>
                        ) : (
                          <span>请选择训练地点</span>
                        )}
                      </div>
                      <Icon type="right" />
                    </div>
                    {/* <InputItem
                      {...getFieldProps('location', {
                        initialValue: this.state.trainInfo ? this.state.trainInfo.location : '',
                        rules: [{ required: true, message: '训练地点不能为空！' }],
                      })}
                      title="巡逻地点"
                      editable={false}
                      //  disabled={this.state.disabled}
                      clear
                      placeholder="请选择训练地点"
                    >
                      <i className="tips">*</i>训练地点
                      <i className="icon" onClick={this.addCoord.bind(this)}>
                        {this.state.disabled ? '查看' : '添加'}
                      </i>
                    </InputItem> */}
                  </List>
                ) : null}
                {this.state.placeType == 1 ? (
                  <List className="list">
                    <p className="title">巡逻地点</p>
                    <Picker
                      data={this.state.placeList}
                      placeholder="请选择训练地点"
                      disabled={this.state.disabled}
                      cols={1}
                      {...getFieldProps('placeId', {
                        initialValue: this.state.trainInfo ? [this.state.trainInfo.placeId] : '',
                        rules: [{ required: true, message: '训练地点不能为空！' }],
                      })}
                      className="forss"
                      onOk={(value) => this.changePlaceId(value)}
                    >
                      <List.Item arrow="horizontal"></List.Item>
                    </Picker>
                  </List>
                ) : null}
                <List className="list">
                  <p className="title">训练人员</p>
                  <div className="input-item" onClick={this.showModal}>
                    <div className="value-box">
                      {this.state.selectedName && this.state.selectedName.length > 0 ? (
                        <p>{this.state.selectedName}</p>
                      ) : (
                        <span>请选择训练人员</span>
                      )}
                    </div>
                    <Icon type="right" />
                  </div>
                </List>
                <List className="list">
                  <p className="title">训练说明</p>
                  <TextareaItem
                    autoHeight="true"
                    clear
                    disabled={this.state.disabled}
                    {...getFieldProps('remark', {
                      initialValue: this.state.trainInfo ? this.state.trainInfo.remark : '',
                      rules: [{ required: true, message: '训练说明不能为空！' }],
                    })}
                    placeholder="请输入训练说明"
                    rows={2}
                  />
                </List>
                <List className="list list-button">
                  <Button type="primary" onClick={this.submit}>
                    发布
                  </Button>
                </List>
              </div>
            </div>
          </div>
        </div>
        {/* 人员列表 */}
        <PeopleBox
          title="训练人员"
          initTip="请选择队员"
          searchTip="请输入查询内容"
          disabled={this.state.disabled}
          modalShow={this.state.modalShow}
          clickOk={(data) => this.clickOk(data)}
          dataList={this.state.PeopleList}
          showValue={this.state.selectedName}
          useDefaultDom={true}
        />
        {/* 地图 */}
        {this.state.isMap ? (
          <PubTrainingMap
            isMap={this.state.isMap}
            trainInfo={this.state.trainInfo}
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
//ReactMixin.onClass(AddPubRoundComponent,Reflux.listenTo(Store, 'onChange'));
const AddPubTraining = createForm()(AddPubTrainingComponent);
export default withRouter(AddPubTraining);

// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubTraining/AddPubTraining.js
