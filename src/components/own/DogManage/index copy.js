//警犬管理

import React, { Component } from "react";
import { List } from "antd-mobile";
import Header from "components/common/Header";
import MyDogNum from "./MyDogNum";

const Item = List.Item;

let ownData = {
  admin: [
    {
      text: "我的警犬",
      myDogNum: true,
      link: "/own/DogManage/MyDogList",
    },
    {
      text: "犬病上报",
      link: "/own/DogManage/SickUpdate",
    },
    {
      text: "警犬运动统计",
      link: "/own/DogManage/DogActivity",
    },
  ],
};

/**
 * 警犬管理
 */
export default class DogManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: ownData.admin,
    };
  }

  handleLink = (item) => {
    let { history } = this.props;
    history.push(item.link);
  };

  render() {
    return (
      <div>
        <Header title="警犬管理" pointer />

        <List className="my-list">
          {this.state.admin.map((item, index) => {
            return (
              <Item key={"list" + index} arrow="horizontal" extra={item.myDogNum ? <MyDogNum /> : ""} onClick={() => this.handleLink(item)}>
                <span className="own-text">{item.text}</span>
              </Item>
            );
          })}
        </List>
      </div>
    );
  }
}

//警犬管理
module.exports = DogManage;

// WEBPACK FOOTER //
// ./src/components/own/DogManage/index.js
