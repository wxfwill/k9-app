let websocket,
  lockReconnect = false;

import React from 'react';

import store from 'store/index';

console.log(process.env.BASE_WS);

const user = store.getState().loginReducer.userInfo.user;
let url = user && `${process.env.BASE_WS}/ws/webSocket/${user.id}`;

let createWebsocket = () => {
  if (!url) return;
  websocket = new WebSocket(url);
  websocket.onopen = function () {
    console.log('测试socket连接成功');
    heartCheck.reset().start();
  };
  websocket.onerror = function () {
    console.log('socket 连接错误，即将重新连接');
    reconnect();
  };
  websocket.onclose = function (e) {
    console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean);
    console.log(React);
    React.$ajax.postData('/api/userCenter/checkLogin').then((res) => {
      if (res && res.code == 0) {
        // 重新连接
        reconnect();
      }
    });
  };
};

let reconnect = () => {
  if (lockReconnect) return;
  //没连接上会一直重连，设置延迟避免请求过多
  setTimeout(function () {
    createWebsocket();
    lockReconnect = false;
  }, 2000);
};

let heartCheck = {
  timeout: 60000, //60秒
  timeoutObj: null,
  reset: function () {
    clearInterval(this.timeoutObj);
    return this;
  },
  start: function () {
    this.timeoutObj = setInterval(function () {
      //心跳
      websocket && websocket.send(JSON.stringify({ serviceCode: 'ping' }));
    }, this.timeout);
  },
};

//关闭连接
let closeWebSocket = () => {
  heartCheck.reset();
  websocket && websocket.close();
};
// 向后端发送数据
let sendMessage = (val, callback) => {
  if (websocket && websocket.readyState == 1) {
    // 连接成功状态下发送数据
    websocket.send(JSON.stringify(val));
    websocket.onmessage = function (event) {
      lockReconnect = true;
      callback && callback(event.data);
    };
  } else {
    // 刷新页面重新连接
    // 关闭
    closeWebSocket();
    // 重连
    createWebsocket();
    if (websocket) {
      websocket.onopen = function () {
        heartCheck.reset().start();
        websocket.send(JSON.stringify(val));
      };
      websocket.onmessage = function (event) {
        lockReconnect = true;
        callback && callback(event.data);
      };
    }
  }
};
export { websocket, createWebsocket, sendMessage, closeWebSocket };
