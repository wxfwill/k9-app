import React, { Component } from "react";
import { toast } from "libs/util";
import Config from "./const";
import store from "../store/index";

console.log("store=======");
console.log(store.getState().loginReducer.isPass);

store.subscribe(() => {
  console.log("subscribe");
  console.log(store.getState().loginReducer.isPass);
});

// @connect(
//     (state)=>({ispass1:state}),   //第一个参数，state里的属性放到props里面
//     {saveAccount,savePassword,saveUserInfo,savePasswordData}    //方法放到props里
// )

let Storage = {};
if (localStorage) {
  Storage = localStorage;
} else {
  Storage = {
    getItem: () => {},
    setItem: () => {},
    removeItem: () => {},
  };
}

/**
 * 统一ajax请求获取数据
 * @param type  请求方式
 * @param url   请求地址
 * @param params    请求参数
 * @param callback  回调函数
 * @param sync  同步方式
 * @private
 */
function _ajaxData(type, url, params, callback, sync) {
  console.log("ajax==" + process.env.NODE_ENV);

  if (process.env.NODE_ENV != "development") {
    url = Config.api + url;
    // url = window.location.origin+url;
  }

  let token = util.cookieUtil.get("token");
  if (!token) {
    token = Storage.getItem("token");
  }
  $.ajax({
    url: url,
    type: type,
    async: !(sync && sync === "sync"),
    data: params,
    contentType: "application/json",
    Accept: "application/json",
    dataType: "json",
    //'timeout' : 8000,
    xhrFields: {
      withCredentials: true,
    },
    crossDomain: true,
    // beforeSend: function(xhr) {
    //     console.log("xhr",xhr)
    //     xhr.setRequestHeader("Authorization", "headertest");
    // },
    headers: {
      "x-requested-with": "XMLHttpRequest",
      Authorization: token,
    },
    success: function (result) {
      util.mask.hide();
      console.log("code22");
      console.log(result);

      if (typeof result.code != "undefined" && result.code == 0) {
        typeof result.data.token == "string" && util.cookieUtil.set("token", result.data.token);
        callback && callback(result);
      } else if (typeof result.code != "undefined" && result.code == 501) {
        callback && callback(result);
      } else {
        _handleAPIError(result); //出错统一处理
      }
    },
    error: function (result) {
      console.log("code");
      console.log(result);
      util.mask.hide();
      //出错统一处理
      if (JSON.parse(result.response).status_code == 422) {
        callback && callback(result);
      } else {
        _handleAPIError(result);
      }
    },
  });
}

//文件上传
function ajaxFile(type, url, params, callback, sync) {
  // if(process.env.NODE_ENV!='development'){
  //url = Config.api+url;
  url = window.location.origin + url;
  // }

  let token = util.cookieUtil.get("token");
  if (!token) {
    token = Storage.getItem("token");
  }
  $.ajax({
    url: url,
    type: "post",
    async: !(sync && sync === "sync"),
    data: params,
    contentType: false,
    processData: false,
    dataType: "json",
    //'timeout' : 8000,
    xhrFields: {
      withCredentials: true,
    },
    crossDomain: true,
    // beforeSend: function(xhr) {
    //     console.log("xhr",xhr)
    //     xhr.setRequestHeader("Authorization", "headertest");
    // },
    headers: {
      "x-requested-with": "XMLHttpRequest",
      Authorization: token,
    },
    success: function (result) {
      util.mask.hide();

      if (typeof result.code != "undefined" && result.code == 0) {
        typeof result.data.token == "string" && util.cookieUtil.set("token", result.data.token);
        callback && callback(result);
      } else if (typeof result.code != "undefined" && result.code == 501) {
        callback && callback(result);
      } else {
        _handleAPIError(result); //出错统一处理
      }
    },
    error: function (result) {
      // debugger;
      console.log(result);
      util.mask.hide();
      //出错统一处理
      if (JSON.parse(result.response).status_code == 422) {
        callback && callback(result);
      } else {
        _handleAPIError(result);
      }
    },
  });
}

function _handleAPIError(result) {
  util.loading.hide();
  if (result && typeof result.statusText && result.statusText === "timeout") {
    alert("请求超时！");
  }
  if (result) {
    if ((typeof result.code !== "undefined" && result.code === 2) || result.code === 1) {
      result.msg && util.toast(result.msg);
    } else if (typeof result.responseText !== "undefined") {
      if (result.msg) {
        util.toast(result.msg);
      } else {
        util.toast("请求错误!");
      }
    } else if (result.code == -1) {
      util.toast("系统出现未知错误,请稍后重试");
    } else if (result.code === 10001) {
      let msg = "未登录";
      if (result.msg) {
        msg = result.msg;
      }

      util.toast(msg, function () {
        sessionStorage.removeItem("user");
        Storage.removeItem("k9username");
        Storage.removeItem("k9password");

        util.cookieUtil.unset("token");
        window.location.href = "/";
      });
    } else if (result.code === 20001) {
      util.toast("无权限");
    }
  }
}

function ajaxGet(url, params, callback) {
  //无查询参数，用于兼容(url,callback)模式
  if (typeof callback === "undefined" && typeof params === "function") {
    callback = params;
    params = {};
  }
  params.t = Math.random();
  _ajaxData("get", url, params, callback);
}

function ajaxPost(url, params, callback) {
  //无查询参数，用于兼容(url,callback)模式
  if (typeof callback === "undefined" && typeof params === "function") {
    callback = params;
    params = {};
  }
  params.t = Math.random();
  _ajaxData("post", url, JSON.stringify(params), callback);
}

const ajax = {
  get: ajaxGet,
  post: ajaxPost,
  file: ajaxFile,
};
export default ajax;

// WEBPACK FOOTER //
// ./src/libs/ajax.js
