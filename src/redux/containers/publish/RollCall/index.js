import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Header from 'components/common/Header';
import { createForm } from 'rc-form';
import { List, TextareaItem, WhiteSpace, WingBlank, Button, Toast, ImagePicker } from 'antd-mobile';

require('style/own/ownLevel.less');

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
function failToast(text, fn) {
  Toast.fail(text, 1);
}

class RollCall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: now,
      end: now,
      hasError: false,
      value: '',
      val: 1,
      files: null,
    };
    this.timer = null;
  }
  handleSubmit() {
    if (this.state.files == null || this.state.files.length <= 0) {
      failToast('请补全信息！');
      return;
    }
    let formData = new FormData();
    for (let key in this.state.files) {
      formData.append('files', this.state.files[key].file);
    }
    this.props.form.validateFields((error) => {
      if (!error) {
        let isReturn = true;
        let subData = this.props.form.getFieldsValue();
        Object.keys(subData).forEach((item, index) => {
          if (typeof subData[item] == 'undefined') {
            failToast('请补全信息！');
            isReturn = false;
          }
        });
        if (!isReturn) {
          return false;
        }
        formData.append('content', subData.remark);
        React.$ajax.publish.rollCallSaveRec(formData).then((res) => {
          if (res && res.code == 0) {
            console.log(res);
            let { history } = this.props;
            Toast.info('提交成功!');
            history.goBack();
          }
        });
      }
    });
  }
  onChange = (files, type, index) => {
    this.setState({
      files,
    });
  };
  onAddImageClick() {}
  render() {
    const titleType = this.props.match.params.titleType;
    const { getFieldProps } = this.props.form;
    let { files, value } = this.state;
    return (
      <div className="OwnLevel">
        <Header title={titleType} pointer="pointer" />
        <List style={{ backgroundColor: 'white' }} className="date-picker-list">
          <List.Item>
            <div>
              {' '}
              <span>上传图片</span>{' '}
              <ImagePicker
                title="图片"
                files={files ? files : []}
                onChange={this.onChange}
                onImageClick={(index, fs) => console.log(index, fs)}
                //     selectable={files.length < 5}
                onAddImageClick={this.onAddImageClick}
              >
                {' '}
                <span>上传图片</span>
              </ImagePicker>
            </div>
          </List.Item>
          <TextareaItem
            {...getFieldProps('remark')}
            title="详情"
            placeholder="请输入详情"
            data-seed="logId"
            rows={2}
            autoHeight
          />
        </List>
        <div className="foot">
          <WingBlank>
            <Button className="submit" type="submit" onClick={() => this.handleSubmit()}>
              提交
            </Button>
            <WhiteSpace />
          </WingBlank>
        </div>
      </div>
    ); //<div>点名</div>;
  }
}

const RollCallForm = createForm()(RollCall);
export default withRouter(RollCallForm);
