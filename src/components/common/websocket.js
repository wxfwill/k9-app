let websocket,
  lockReconnect = false;

import React from 'react';

import store from 'store/index';

let createWebsocket = () => {
  const user = store.getState().loginReducer.userInfo.user;
  let url = user && `${process.env.BASE_WS}/ws/webSocket/${user.id}`;
  console.log('url地址=====' + url);
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
    if (e.code == 1006) {
      closeCheck.reset().start();
    } else {
      closeCheck.reset();
    }
    // React.$ajax.login.checkIsLogin().then((res) => {
    //   if (res && res.code == 0) {
    //     // 重新连接
    //     reconnect();
    //   }
    // });
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

// 心跳
let heartCheck = {
  timeout: 60000, //60秒
  timeoutObj: null,
  reset: function () {
    clearInterval(this.timeoutObj);
    return this;
  },
  start: function () {
    closeCheck.reset();
    this.timeoutObj = setInterval(function () {
      //心跳
      websocket && websocket.send(JSON.stringify({ serviceCode: 'ping' }));
    }, this.timeout);
  },
};

// 非正常关闭时重连
let closeCheck = {
  time: 10000, //10秒
  timeObj: null,
  reset: function () {
    clearInterval(this.timeObj);
    return this;
  },
  start: function () {
    this.timeObj = setInterval(function () {
      console.log(6666);
      lockReconnect = false;
      reconnect();
    }, this.time);
  },
};

//关闭连接
let closeWebSocket = () => {
  heartCheck.reset();
  closeCheck.reset();
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
