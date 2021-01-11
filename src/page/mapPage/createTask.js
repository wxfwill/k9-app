import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { List, Button, InputItem, TextareaItem, DatePicker, Toast } from 'antd-mobile';
import Header from 'components/common/Header';
require('style/publish/public.less');
require('style/page/mapPage/createTask.less');

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class CreateTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskDate: now,
      taskPlace: '',
      taskData: {},
      isEdit: false, //搜捕区域是否编辑---默认不编辑
    };
  }
  componentDidMount() {
    //获取APP端网格相关数据
    const _this = this;
    window.jsGridData = function (data) {
      alert(data);
      _this.setState({
        taskData: data ? JSON.parse(data) : {},
        taskPlace: data ? JSON.parse(data).taskPlace : '',
      });
    };
  }
  onSubmit = () => {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        let { taskData, taskPlace } = this.state;
        taskData.taskName = value.taskName; //任务名称
        taskData.taskDate = new Date(value.taskDate).getTime(); //util.formatDate(new Date(value.taskDate), 'yyyy-MM-dd hh:mm:ss'); //执行时间
        taskData.taskContent = value.taskContent; //任务内容
        taskData.taskPlace = value.taskPlace ? value.taskPlace : taskPlace;
        React.$ajax.mapPage.publishGridHuntingTask(taskData).then((res) => {
          if (res && res.code == 0) {
            Toast.success('创建成功!', 1);
            util.CallApp({ callAppName: 'createdTask', param: taskData }); //告诉两步路，创建任务成功
          }
        });
      } else {
        Toast.fail('表单填写不完整，请填写完整再提交!', 1);
      }
    });
  };
  render() {
    const { isEdit } = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="创建任务" pointer="pointer" />
          <div className="child-container">
            <div className="components createTask-box">
              <div className="form-main">
                <List className="list">
                  <p className="title">任务名称</p>
                  <InputItem
                    {...getFieldProps('taskName', {
                      initialValue: '',
                      rules: [{ required: true, message: '任务名称不能为空！' }],
                    })}
                    placeholder="请输入任务名称"
                  ></InputItem>
                </List>
                <List className="list">
                  <p className="title">任务内容</p>
                  <TextareaItem {...getFieldProps('taskContent')} placeholder="请输入任务内容" autoHeight rows={1} />
                </List>
                <List className="list">
                  <p className="title">执行时间</p>
                  <DatePicker
                    {...getFieldProps('taskDate', {
                      initialValue: this.state.taskDate,
                      rules: [{ required: true, message: '请选择执行时间！' }],
                    })}
                    //onChange={(date) => this.setState({ date })}
                    placeholder="请选择执行时间"
                  >
                    <List.Item arrow="horizontal"></List.Item>
                  </DatePicker>
                </List>
                <List className="list quyu-list">
                  <p className="title">搜捕区域</p>
                  <InputItem
                    {...getFieldProps('taskPlace', {
                      initialValue: this.state.taskPlace,
                      rules: [{ required: true, message: '任务名称不能为空！' }],
                    })}
                    placeholder="请选择搜捕区域"
                    editable={isEdit}
                    extra={
                      <i
                        className="edit-ico"
                        onClick={() => {
                          this.setState(
                            {
                              isEdit: true,
                            },
                            () => {
                              this.inputRef.focus();
                            }
                          );
                        }}
                      ></i>
                    }
                    onBlur={() => {
                      this.setState({
                        isEdit: false,
                      });
                    }}
                    ref={(el) => (this.inputRef = el)}
                  ></InputItem>
                </List>
              </div>
            </div>
          </div>
          <div className="footer-common">
            <Button type="primary" onClick={this.onSubmit}>
              发布
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
const CreateTaskForm = createForm()(CreateTask);
export default CreateTaskForm;
