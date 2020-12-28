import React, { Component } from 'react';
import SelectPersonnel from './components/SelectPersonnel';

class AssignPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onSubmit = (data) => {
    console.log(data, '选择一位队长');
    //选择队长传递到APP
    util.CallApp({
      callAppName: 'assignCaptain',
      param: {
        userId: data.name,
        userName: data.id,
      },
      callbackName: 'jsAssignLeader',
      callbackFun: this.getAssignLeader,
    });
  };
  //获取APP返回的数据
  getAssignLeader = (data) => {
    //进入地图
    util.CallApp({
      callAppName: 'map',
    });
    console.log(data, '分配队长APP返回数据');
  };
  render() {
    return <SelectPersonnel title="分配队长" onSubmit={this.onSubmit} />;
  }
}

export default AssignPerson;
