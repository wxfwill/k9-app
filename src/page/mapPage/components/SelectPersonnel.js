import React, { Component } from 'react';
import { SearchBar, Picker, List, Button } from 'antd-mobile';
import Header from 'components/common/Header';
require('style/publish/public.less');
require('style/page/mapPage/SelectPersonnel.less');

class SelectPersonnel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupList: null,
      allMembers: null,
      allList: null,
      userName: '',
      teamId: '',
      allData: null,
      targetData: null,
    };
  }
  componentDidMount() {
    this.queryUserList();
    this.getUserGroup();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        allData: nextProps.allData,
        targetData: nextProps.targetData,
      },
      () => {
        this.queryUserList();
      }
    );
  }

  //获取中队列表
  getUserGroup = () => {
    React.$ajax.publish.getUserGroup().then((res) => {
      if (res && res.code == 0) {
        const list = res.data;
        const groupList = [];
        list.map((item) => {
          groupList.push({ label: item.name, value: item.id });
        });
        this.setState({
          groupList: groupList,
        });
      }
    });
  };
  //获取成员列表
  queryUserList = () => {
    const { userName, teamId, allData, targetData } = this.state;
    const { title, taskId } = this.props;
    React.$ajax.mapPage
      .queryUserList({
        taskId: taskId ? taskId : '', //任务ID
      })
      .then((res) => {
        if (res && res.code == 0) {
          res.data.map((item) => {
            item.remark = false;
            if (title == '分配队长' && targetData) {
              if (item.userId == targetData.userId) {
                item.remark = true;
              }
            } else {
              //分配队员
              if (targetData && targetData.length > 0) {
                targetData.map((el) => {
                  if (item.userId == el.userId) {
                    item.remark = true;
                  }
                });
              }
            }
            //判断人员是否已被选择
            if (allData && allData.length > 0) {
              allData.map((el) => {
                if (item.userId == el.userId) {
                  item.seleted = true;
                }
              });
            }
          });
          this.setState({
            allMembers: res.data,
            allList: res.data,
          });
        }
      });
  };
  // 选择人员
  selectOption = (data) => {
    const { title } = this.props;
    const { allMembers } = this.state;
    let arr = [];
    if (allMembers && allMembers.length > 0) {
      allMembers.map((item) => {
        title == '分配队长' ? (item.remark = false) : null;
        if (data.userId === item.userId) {
          item.remark = !item.remark;
        }
        arr.push(item);
      });
      this.setState({
        allMembers: arr,
      });
    }
  };
  //查询姓名和警号
  inputChange = (val) => {
    this.setState(
      {
        userName: val,
      },
      () => {
        this.filtrateUser();
      }
    );
  };
  //选择中队
  selectUserGroup = (val) => {
    const group = val && val.length > 0 ? val[0] : '';
    console.log(val, group);
    this.setState(
      {
        teamId: group,
      },
      () => {
        this.filtrateUser();
      }
    );
  };
  //根据姓名和中队筛选队员
  filtrateUser = () => {
    const { teamId, userName, allList } = this.state;
    if (teamId) {
      let groupArr = [];
      allList.map((item) => {
        if (item.groupId == teamId) {
          groupArr.push(item);
        }
      });
      let arr = [];
      if (userName) {
        groupArr.map((item) => {
          item.userName.indexOf(userName) > -1 || item.number.indexOf(userName) > -1 ? arr.push(item) : '';
        });
        this.setState({
          allMembers: arr,
        });
      } else {
        this.setState({
          allMembers: groupArr,
        });
      }
    } else {
      let arr = [];
      if (userName) {
        allList.map((item) => {
          item.userName.indexOf(userName) > -1 || item.number.indexOf(userName) > -1 ? arr.push(item) : '';
        });
        console.log(arr);
        this.setState({
          allMembers: arr,
        });
      } else {
        this.setState({
          allMembers: allList,
        });
      }
    }
  };
  onSubmit = () => {
    const { title, onSubmit } = this.props;
    const { allMembers } = this.state;
    let captain = null; //选择队长
    let teamMber = []; //队员
    if (allMembers && allMembers.length > 0) {
      allMembers.map((item) => {
        if (item.remark) {
          title == '分配队长' ? (captain = item) : teamMber.push(item);
        }
      });
    }

    if (title == '分配队长') {
      onSubmit && onSubmit(captain);
    } else {
      onSubmit && onSubmit(teamMber);
    }
  };
  render() {
    const { title, jumpCallBack } = this.props;
    const { groupList, allMembers, userName, teamId } = this.state;
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header
            title={title ? title : '选择人员'}
            pointer="pointer"
            jumpCallBack={
              jumpCallBack
                ? () => {
                    jumpCallBack();
                  }
                : null
            }
          />
          <div className="child-container">
            <div className="components SelectPersonnel-box">
              <div className="search-box">
                <SearchBar
                  placeholder="姓名、警号"
                  onChange={(val) => this.inputChange(val)}
                  //onCancel={() => this.searchCancel()}
                  value={userName}
                />
                <Picker
                  extra="选单位"
                  data={groupList ? groupList : []}
                  cols={1}
                  onChange={(val) => {
                    this.selectUserGroup(val);
                  }}
                  className="forss"
                  value={[teamId]}
                >
                  <List.Item arrow="horizontal"></List.Item>
                </Picker>
              </div>
              <div className="person-box">
                {allMembers && allMembers.length > 0 ? (
                  <ul className="clearfix">
                    {allMembers.map((item) => {
                      return (
                        <li
                          key={`${item.userId}`}
                          onClick={() =>
                            (item.seleted || item.isChose) == 1 && !item.remark ? null : this.selectOption(item)
                          }
                          className={item.remark ? 'choice' : ''}
                          style={
                            (item.seleted || item.isChose) == 1 && !item.remark
                              ? { cursor: 'no-drop', color: '#CFCFD3' }
                              : {}
                          }
                        >
                          {item.userName}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="no-data">没有更多数据</div>
                )}
              </div>
            </div>
          </div>
          <div className="footer-common assignPerson-foot">
            <Button type="primary" onClick={this.onSubmit}>
              提交
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default SelectPersonnel;
