import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
require('style/mapPage/taskDetal.less');

class TaskDetal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="taskDetal">
        <div className="infor-list">
          <p>任务名称</p>
          <div className="infor-cont">
            <p>塘朗山网格化搜捕训练科目</p>
          </div>
        </div>
        <div className="infor-list">
          <p>任务描述</p>
          <div className="infor-cont">
            <p>在塘朗山附近组织山地野战搜捕任务并完成区域搜索</p>
          </div>
        </div>
        <div className="infor-list">
          <p>执行人员</p>
          <div className="infor-cont">
            <p>张鑫、李成、谢伟峰</p>
          </div>
        </div>
        <div className="infor-list">
          <p>训练时间</p>
          <div className="infor-cont">
            <p>2020-05-21 14:00</p>
          </div>
        </div>
        <div className="infor-list">
          <p>训练警犬</p>
          <div className="infor-cont">
            <p>小黑、小花、小虎</p>
          </div>
        </div>
        <div className="infor-list">
          <p>搜索区域</p>
          <div className="infor-cont">
            <p>网格2</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(TaskDetal);
