import React, { Component } from 'react';
import { List, SwipeAction, Toast, Modal } from 'antd-mobile';
import Header from 'components/common/Header';
import AddPlayers from './addPlayers';
require('style/publish/public.less');
require('style/page/mapPage/addTeamPerson.less');

const $alert = Modal.alert;

class TaskDetal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamPersons: null,
      taskId: '',
      subTaskId: '',
      subTaskNumber: '',
      isModal: false,
    };
  }

  componentDidMount() {
    //获取APP端网格相关数据
    const _this = this;
    window.jsTaskData = function (data) {
      _this.setState(
        {
          taskId: data ? JSON.parse(data).taskId : '', //任务id
          subTaskId: data ? JSON.parse(data).subTaskId : '', //区域id
          subTaskNumber: data ? JSON.parse(data).subTaskNumber : '', //区域编号
        },
        () => {
          _this.queryUserPointList();
        }
      );
    };
  }
  //获取区域成员列表
  queryUserPointList = () => {
    const { taskId, subTaskId } = this.state;
    React.$ajax.mapPage
      .queryUserPointList({
        taskId: taskId, //任务id
        subTaskId: subTaskId, //区域id
      })
      .then((res) => {
        if (res && res.code == 0) {
          this.setState({
            teamPersons: res.data,
          });
        }
      });
  };
  //删除队员
  removePlayer = (id) => {
    const alertInstance = $alert('删除', '是否确认？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      {
        text: '确认',
        onPress: () => {
          React.$ajax.mapPage
            .deleteUser({
              taskId: this.state.taskId, //任务id
              userTaskId: id,
            })
            .then((res) => {
              alertInstance.close();
              if (res && res.code == 0) {
                Toast.success('操作成功!', 1);
                this.queryUserPointList();
                util.CallApp({
                  callAppName: 'modifyMembers',
                });
              }
            });
        },
      },
    ]);
  };
  //打开
  openModal = () => {
    this.setState({
      isModal: !this.state.isModal,
    });
  };
  render() {
    const { teamPersons, taskId, subTaskId, subTaskNumber, isModal } = this.state;
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header
            title={'搜捕区域' + subTaskNumber}
            pointer="pointer"
            jumpCallBack={() => {
              util.CallApp({
                callAppName: 'close',
              });
            }}
          />
          <div className="child-container">
            <div className="components addTeamPerson-box">
              {teamPersons && teamPersons.length > 0
                ? teamPersons.map((item) => {
                    return (
                      <div className={item.userType == 1 ? 'list-box zuzhang-box' : 'list-box'} key={item.userId}>
                        <List>
                          <SwipeAction
                            autoClose
                            right={
                              item.userType != 1
                                ? [
                                    {
                                      text: '删除',
                                      onPress: () => this.removePlayer(item.id),
                                      style: { backgroundColor: '#FF7575', color: 'white' },
                                    },
                                  ]
                                : []
                            }
                            onOpen={() => console.log('global open')}
                            onClose={() => console.log('global close')}
                          >
                            <div className="infor clearfix">
                              <div className="fl">
                                <b>{item.userName}</b>
                                <span>{item.number}</span>
                                {item.userType == 1 ? <p className="zuzhang"></p> : null}
                              </div>
                              <p className="fr">海拔：{item.elevation ? item.elevation + 'm' : ''}</p>
                            </div>
                            <div className="other-infor">
                              <p>
                                最新定位时间：
                                {item.locTime ? util.formatDate(item.locTime, 'yyyy-MM-dd hh:mm:ss') : ''}
                              </p>
                              <p>
                                经纬度：{item.longitude} {item.latitude}
                              </p>
                            </div>
                          </SwipeAction>
                        </List>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div className="footer-common addTeamPerson-btn">
            <p className="add-btn" onClick={this.openModal}>
              <img src={require('images/mapPage/add.svg')} />
              <b>继续添加</b>
            </p>
          </div>
        </div>
        {/* 分配队员 */}
        <AddPlayers
          isModal={isModal}
          taskData={{ taskId: taskId, subTaskId: subTaskId, teamPersons: teamPersons }}
          openModal={this.openModal}
          refresh={this.queryUserPointList}
        />
      </div>
    );
  }
}

export default TaskDetal;
