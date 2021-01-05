import React, { Component } from 'react';
import { Modal, Toast } from 'antd-mobile';
import SelectPersonnel from './components/SelectPersonnel';

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

class AddPlayers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskData: null,
      isModal: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      taskData: nextProps.taskData,
      isModal: nextProps.isModal,
    });
  }

  onClose = (key) => () => {
    this.props.openModal();
  };

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  };
  onSubmit = (data) => {
    console.log(data);
    if (!data || data.length == 0) {
      Toast.fail('请至少选择一位队员!', 1);
      return;
    }
    let userArr = [];
    data.map((item) => {
      item.userType = 2;
      userArr.push({
        userId: item.userId,
        userName: item.userName,
        userType: 2, //用户类型
      });
    });
    this.props.openModal();
    const { taskData } = this.state;
    if (taskData) {
      this.setState({
        taskData: taskData,
      });
      // 添加队员
      React.$ajax.mapPage
        .saveUserList({
          gridHuntingUserTaskDTOS: userArr,
          taskId: taskData.taskId, //任务id
          subTaskId: taskData.subTaskId, //区域id
        })
        .then((res) => {
          if (res && res.code == 0) {
            console.log(res);
          }
        });
    }
  };
  render() {
    const { taskData } = this.state;
    return (
      <div>
        <Modal
          popup
          visible={this.state.isModal}
          onClose={this.onClose('isModal')}
          animationType="slide-up"
          // afterClose={() => {
          //   alert('afterClose');
          // }}
          className="addTeamPerson-modal"
        >
          <SelectPersonnel
            title="分配队员"
            onSubmit={this.onSubmit}
            taskId={taskData ? taskData.taskId : ''}
            targetData={taskData ? taskData.teamPersons : null} //当前区域人员
            jumpCallBack={() => {
              this.props.openModal();
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default AddPlayers;
