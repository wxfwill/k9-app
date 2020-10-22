import React, { Component } from 'react';
import { List, DatePicker, TextareaItem, Picker, Toast, Button, ImagePicker } from 'antd-mobile';
import { createForm } from 'rc-form';
import Header from 'components/common/Header';
import { withRouter } from 'react-router-dom';
import { loading } from 'libs/util';
require('style/publish/public.less');
const Item = List.Item;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
function failToast(text, fn) {
  Toast.fail(text, 1);
}
class Vacation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: now,
      end: now,
      hasError: false,
      value: '',
      val: 0,
      seasons: [],
      files: null,
    };
  }
  componentDidMount() {
    // 获取请假类型
    React.$ajax.publish.getLeaveTypeList().then((res) => {
      if (res && res.code == 0) {
        let typeList = [];
        res.data &&
          res.data.map((item, index) => {
            typeList.push({ value: item.typeId, label: item.typeName });
          });
        this.setState({
          seasons: typeList,
        });
      } else {
        Toast.info(res.msg);
        return;
      }
    });
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  handleSubmit() {
    let subData = this.props.form.getFieldsValue();
    console.log(subData);
    const { history } = this.props;
    if (typeof subData.type != 'undefined' && (subData.type == 2 || subData.type == 4 || subData.type == 8)) {
      if (this.state.files == null || this.state.files.length <= 0) {
        failToast('请补全信息！');
        return;
      }
    }
    let formData = new FormData();
    for (let key in this.state.files) {
      formData.append('files', this.state.files[key].file);
    }
    this.props.form.validateFields((error) => {
      console.log(this.props.form, 'this.props.form');
      if (!error) {
        let isReturn = true;
        Object.keys(subData).forEach((item, index) => {
          if (typeof subData[item] == 'undefined') {
            failToast('请补全信息！');
            isReturn = false;
          }
        });
        if (!isReturn) {
          return false;
        }
        formData.append('leaveStartTimeStr', util.formatDate(new Date(this.state.start), 'yyyy-MM-dd hh:mm:ss'));
        formData.append('leaveEndTimeStr', util.formatDate(new Date(this.state.end), 'yyyy-MM-dd hh:mm:ss'));
        formData.append('applyTimeStr', util.formatDate(new Date(now), 'yyyy-MM-dd hh:mm:ss'));
        formData.append('duration', this.state.val);
        formData.append('type', Number(subData.type[0]));
        formData.append('remark', subData.remark);
        let _this = this;
        loading.show('提交中');
        React.$ajax.publish.leaveSaveInfo(formData).then((res) => {
          if (res && res.code == 0) {
            let { history } = _this.props;
            Toast.info('申请成功!');
            history.goBack();
            loading.hide();
          } else {
            Toast.info(res.msg);
            loading.hide();
            return;
          }
        });
      } else {
        console.log(error);
      }
    });
  }
  handleChange(type, date) {
    let s = this.state.start;
    let e = this.state.end;
    type === 'start' ? (s = date) : (e = date);
    if (s && e) {
      if (e.getTime() - s.getTime() < 0) {
        Toast.info('结束时间不能小于开始时间，请重新选择!');
        return;
      }
    }
    this.setState(
      {
        [type]: date,
      },
      () => {
        //计算请假时长(保留一位小数)
        const start = this.state.start;
        const end = this.state.end;
        if (start && end) {
          this.setState({
            val: parseInt((end.getTime() - start.getTime()) / 1000 / 360) / 10,
          });
        }
      }
    );
  }
  onChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files,
    });
  };
  render() {
    const titleType = util.urlParse(this.props.location.search).titleType;
    const { getFieldProps } = this.props.form;
    let { files, seasons } = this.state;
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title={titleType} pointer="pointer" />
          <div className="child-container">
            <div className="components">
              <div className="form-main">
                <List className="list">
                  <p className="title">请假类型</p>
                  <Picker data={seasons} cols={1} {...getFieldProps('type')} className="forss">
                    <Item arrow="horizontal"></Item>
                  </Picker>
                </List>
                <List className="list">
                  <p className="title">开始时间</p>
                  <DatePicker
                    title="选择日期"
                    value={this.state.start}
                    onChange={this.handleChange.bind(this, 'start')}
                  >
                    <Item arrow="horizontal"></Item>
                  </DatePicker>
                </List>
                <List className="list">
                  <p className="title">结束时间</p>
                  <DatePicker title="选择日期" value={this.state.end} onChange={this.handleChange.bind(this, 'end')}>
                    <Item arrow="horizontal"></Item>
                  </DatePicker>
                </List>
                <List className="list">
                  <p className="title">请假时长</p>
                  <div className="input-item">
                    <div className="value-box">
                      {this.state.val + '' ? <p>{this.state.val}小时</p> : <span>系统自动算出</span>}
                    </div>
                  </div>
                </List>
                <List className="list">
                  <p className="title">请假事由</p>
                  <TextareaItem
                    {...getFieldProps('remark')}
                    placeholder="请输入请假事由"
                    data-seed="logId"
                    rows={2}
                    autoHeight
                  />
                </List>
                <List className="list">
                  <p className="title">上传照片</p>
                  <ImagePicker
                    title="图片"
                    files={files ? files : []}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    //     selectable={files.length < 5}
                  ></ImagePicker>
                </List>
                <List className="list list-button">
                  <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                    提交申请
                  </Button>
                </List>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const VacationForm = createForm()(Vacation);
export default withRouter(VacationForm);
