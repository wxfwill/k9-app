import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Header from 'components/common/Header';
import { createForm } from 'rc-form';
import { List, TextareaItem, Toast, ImagePicker, Result, Icon } from 'antd-mobile';
import DetailsModule from './DetailsModule';

require('./style.less');

const Item = List.Item;

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
      files: [],
      isRemark: false,
      currentTime: '',
      isSuccess: false,
      currentId: '',
    };
    this.timer = null;
  }

  componentDidMount() {
    this.getCurrentTime();
  }

  componentWillUnmount() {
    //清除定时器
    this.timer && clearTimeout(this.timer);
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
        formData.append('content', subData.remark ? subData.remark:'');
        React.$ajax.publish.rollCallSaveRec(formData).then((res) => {
          if (res && res.code == 0) {
            Toast.info('提交成功!');
            this.setState({
              isSuccess: true,
              currentId: res.data.id,
            });
            // let { history } = this.props;
            // history.goBack();
          }
        });
      }
    });
  }
  onChange = (files, type, index) => {
    this.setState(
      {
        files,
      },
      () => {
        this.handleSubmit();
      }
    );
  };

  //是否显示备注框
  getIsRemark = () => {
    this.setState({ isRemark: !this.state.isRemark });
  };
  //获取当前时间
  getCurrentTime = () => {
    const date = new Date();
    const time = add0(date.getHours()) + ':' + add0(date.getMinutes()) + ':' + add0(date.getSeconds());
    this.setState({ currentTime: time });
    function add0(time) {
      return time < 10 ? '0' + time : time;
    }
    this.timer = setTimeout(() => {
      this.getCurrentTime();
    }, 1000);
  };

  render() {
    const titleType = util.urlParse(this.props.location.search).titleType;
    const { getFieldProps } = this.props.form;
    let { files, value, isRemark, currentTime, isSuccess, currentId } = this.state;
    const { history } = this.props;
    return (
      <div className="parent-container">
        <Header
          title={titleType}
          pointer="pointer"
          customRightTitle="点名记录"
          handleRightTitleClick={() => {
            history.push('/own/callList');
          }}
        />
        <div className="child-container">
          <div className="components">
            <div className="dianming-box">
              <div className="dianming-main">
                {isSuccess ? (
                  <div className="succ-box">
                    <div className="succ-top">
                      <Result
                        img={<Icon type="check-circle" className="spe" style={{ fill: '#22A772' }} />}
                        title="点名签到成功"
                      />
                    </div>
                    <div className="infor">
                      <DetailsModule id={currentId} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="banner">
                      <img src={require('images/rollCall/dianming.png')} />
                    </div>
                    <div className="remark">
                      {isRemark ? (
                        <TextareaItem
                          {...getFieldProps('remark')}
                          placeholder="请输入..."
                          data-seed="logId"
                          rows={2}
                          autoHeight
                          clear
                          //onBlur={this.getIsRemark}
                          ref={(input) => {
                            input && input.focus(); // 设置焦点
                          }}
                        />
                      ) : (
                        <p className="tishi" onClick={this.getIsRemark}>
                          添加备注…
                        </p>
                      )}
                    </div>
                    <div className="curt-time">{currentTime}</div>
                    <div className="upload">
                      <img src={require('images/rollCall/camera.png')} />
                      <ImagePicker
                        files={files ? files : []}
                        onChange={this.onChange}
                        onImageClick={(index, fs) => console.log(index, fs)}
                        selectable={files.length < 1}
                      ></ImagePicker>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    ); //<div>点名</div>;
  }
}

const RollCallForm = createForm()(RollCall);

export default withRouter(RollCallForm);
