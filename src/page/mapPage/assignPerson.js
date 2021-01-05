import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import SelectPersonnel from './components/SelectPersonnel';

class AssignPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allData: null,
      targetData: null,
    };
  }
  componentDidMount() {
    const _this = this;
    window.jsAssignLeader = function (data) {
      console.log(data, '分配队长APP返回数据');
      alert(data);
      _this.getAssignLeader(data);
    };
  }
  onSubmit = (data) => {
    if (!data) {
      Toast.fail('请选择一位队长!', 1);
      return;
    }
    //选择队长传递到APP
    util.CallApp({
      callAppName: 'assignCaptain',
      param: {
        userId: data.userId,
        userName: data.userName,
      },
    });
  };
  //获取APP返回的数据
  getAssignLeader = (data) => {
    let dataObj = JSON.parse(data);
    if (dataObj.target && dataObj.all) {
      dataObj.all.map((item, index) => {
        if (item.userId == dataObj.target.userId) {
          dataObj.all.splice(index, 1);
        }
      });
    }
    this.setState({
      allData: dataObj.all ? dataObj.all : null,
      targetData: dataObj.target ? dataObj.target : null,
    });
  };
  render() {
    const { targetData, allData } = this.state;
    return (
      <SelectPersonnel
        title="分配队长"
        onSubmit={this.onSubmit}
        allData={allData}
        targetData={targetData}
        jumpCallBack={() => {
          util.CallApp({
            callAppName: 'close',
          });
        }}
      />
    );
  }
}

export default AssignPerson;
