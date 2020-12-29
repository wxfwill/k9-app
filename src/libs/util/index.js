require('./util.less');
import moment from 'moment';
//mask
export const mask = {
  maskClass: 'mui-off-canvas-backdrop',
  activeClass: 'mui-active',
  show: function ($container, options) {
    //兼容没有options的情况
    if ($.isPlainObject($container)) {
      options = $container;
      $container = null;
    }

    $container = $container || $('body');
    var activeClass = this.activeClass;
    var maskClass = (options && options.maskClass) || this.maskClass;

    if ($container.length > 0) {
      var $mask = $container.find('.' + maskClass);
      if ($mask.length > 0) {
        $container.find('.' + maskClass).addClass(activeClass);
      } else {
        $container.append('<div class="' + maskClass + ' ' + activeClass + '"></div>');
      }
    }

    if (options && options.clickHide) {
      var _this = this;
      $container.on('click', function () {
        _this.hide();
      });
    }
  },

  hide: function ($container) {
    $container = $container || $('body');
    $container
      .find('.' + this.maskClass)
      .removeClass(this.activeClass)
      .off('click');
  },
};

export const dialog = {
  show: function (content, options, ele) {
    ele = ele ? ele : $('body');
    util.mask.show();
    var $dialog = $(
      [
        '<div class="global-dialog">',
        '<div class="dialog-title"><span>X</span></div>',
        '<div class="dialog-content">' + content + '</div>',
        '</div>',
      ].join('')
    ).appendTo(ele);

    var newStyle = {
      marginTop: '-' + Math.round($dialog.height() / 2) + 'px', //垂直居中
    };
    //设置宽度，水平居中
    if (options && options.width) {
      newStyle.width = options.width + 'px';
      newStyle.marginLeft = '-' + Math.round(options.width / 2) + 'px';
    }
    $dialog.css(newStyle);
    var remove = function () {
      ele.find('.global-dialog').remove();
      util.mask.hide();
    };
    $dialog.find('.dialog-title').on('click', remove);
    $('.mui-off-canvas-backdrop').on('click', remove);
    $dialog.hide = remove;
    return $dialog;
  },
};

//toast
export const toast = function (message, callback) {
  var share = document.createElement('div');
  share.classList.add('mui-toast-container');
  share.innerHTML = '<div class="mui-toast-message">' + message + '</div>';
  document.body.appendChild(share);
  setTimeout(function () {
    document.body.removeChild(share);
    callback && callback();
  }, 1500);
};

//loading
export const loading = {
  show: function (text = '正在加载...') {
    var $body = $('body');
    var $loading = $body.find('.weui_loading_toast');
    // if ($loading.length > 0) {
    //     $loading.show();
    // } else {
    var html = '<div class="weui_loading_toast"><div class="weui_toast"><div class="weui_loading">';
    for (var i = 0; i < 12; i++) {
      html += '<div class="weui_loading_leaf weui_loading_leaf_' + i + '"></div>';
    }
    html += '</div><p class="weui_toast_content">' + text + '</p></div></div>';
    $body.append(html);
    // }
  },
  hide: function () {
    var $body = $('body');
    $body.find('.weui_loading_toast').hide();
  },
};

//加载地图
export const loadMap = function () {
  /* jshint camelcase:false */
  if (typeof window.BMap_loadScriptTime === 'undefined') {
    window.BMap_loadScriptTime = new Date().getTime();

    var ak = 'oe9aBdr0eKpuXX9nsXTsdTFe';
    var src = 'http://api.map.baidu.com/getscript?v=2.0&ak=' + ak + '&services=&t=20150901171226';

    var script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
  }
};

export const getImgUrl = function (url, width, height, cpos) {
  //return url+'?ss=1&w='+width+'&h='+height;
  cpos = cpos || 'center';
  return url + '?crop=1&cpx=0&cpy=0&cpos=' + cpos + '&w=' + width + '&h=' + height;
};

//加载地图
export const shares = function () {
  var share = document.createElement('div');
  share.classList.add('share-container');
  share.innerHTML = '<div class="share-bg"></div>';
  document.body.appendChild(share);
  $(share).on('click', function () {
    document.body.removeChild(share);
  });
};

//去除空格
export const trims = function (value) {
  value = value.replace('/(^s*)|(s*$)/g', '');
  value = value.replace('^:[a-z0-9_]+:$', '');
  return value;
};

//检查手机格式
export const checkMobile = function (tel) {
  var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
  if (reg.test(tel)) {
    return true;
  } else {
    return false;
  }
};

/*
 * @example ?id=123&a=b
 * @return Object {id:123, a=b}
 */
const percent2percent25 = (URI) => {
  if (URI.indexOf('%') > -1) {
    return URI.replace(/%/g, '%25');
  } else {
    return URI;
  }
};

// 获取url参数
export const urlParse = (src) => {
  let url = decodeURIComponent(src) || null;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url && url.match(reg);
  if (arr) {
    arr.forEach((item) => {
      let temArr = item.substring(1).split('=');
      let key = temArr[0];
      let val = temArr[1];
      obj[key] = val;
    });
  }
  return obj;
};
// 判断是否为数组
export const isArray = (ele) => {
  if (Object.prototype.toString.call(ele) == '[object Array]') {
    return true;
  } else {
    return false;
  }
};

// 时间展示 刚刚 几分钟前 日期
export const getShowTime = (time) => {
  let now = new Date();
  let date = new Date(time);
  // 间隔
  let interval = parseInt((now.getTime() - date.getTime()) / 1000 / 60);
  if (interval == 0) {
    return '刚刚';
  } else if (interval < 60) {
    return interval.toString() + '分钟前';
  } else if (interval < 60 * 24) {
    return parseInt(interval / 60).toString() + '小时前';
  } else if (now.getFullYear() == date.getFullYear()) {
    return (
      (date.getMonth() + 1).toString() +
      '-' +
      date.getDate().toString() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes()
    );
  } else {
    return (
      date.getFullYear().toString().substring(2, 4) +
      '-' +
      (date.getMonth() + 1).toString() +
      '-' +
      date.getDate().toString() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes()
    );
  }
};
/* 格式化时间戳
 */
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
const leftAddZero = (time) => {
  let str = time.toString();
  if (str.length == 1) {
    return '0' + str;
  }
  return str;
};

// 时间展示 刚刚 几分钟前 日期
export const getShowTimeAgain = (startTime, endTime) => {
  let start = new Date(startTime);
  let end = new Date(endTime);
  // 间隔
  let interval = parseInt((end.getTime() - start.getTime()) / 1000 / 60);
  if (interval == 0) {
    return '刚刚';
  } else if (interval < 60) {
    return interval.toString() + '分钟前';
  } else if (interval < 60 * 24) {
    return parseInt(interval / 60).toString() + '小时前';
  } else if (60 * 24 < interval && interval < 60 * 24 * 2) {
    return '1天前';
  } else if (60 * 24 * 2 < interval && interval < 60 * 24 * 3) {
    return '2天前';
  } else if (60 * 24 * 3 < interval && interval < 60 * 24 * 4) {
    return '3天前';
  } else if (60 * 24 * 4 < interval && end.getFullYear() == start.getFullYear()) {
    return (
      leftAddZero(start.getMonth() + 1) +
      '-' +
      leftAddZero(start.getDate()) +
      ' ' +
      leftAddZero(start.getHours()) +
      ':' +
      leftAddZero(start.getMinutes())
    );
  } else if (start.getFullYear().toString() == '1970') {
    return '暂无最新消息';
  } else {
    return (
      start.getFullYear().toString().substring(2, 4) +
      '-' +
      leftAddZero(start.getMonth() + 1) +
      '-' +
      leftAddZero(start.getDate()) +
      ' ' +
      leftAddZero(start.getHours()) +
      ':' +
      leftAddZero(start.getMinutes())
    );
  }
};

//加载更多
export const scrollLoad = function (element, callback) {
  $('#' + element).on('scroll', function () {
    var a = this.scrollTop == 0 ? document.body.clientHeight : this.clientHeight;
    var b = this.scrollTop == 0 ? document.body.scrollTop : this.scrollTop;
    var c = this.scrollTop == 0 ? document.body.scrollHeight : this.scrollHeight;
    if (a + b == c) {
    }
  });
};

//滚动事件
export const scroll = {
  getScrollTop: function () {
    var scrollTop = 0,
      bodyScrollTop = 0,
      documentScrollTop = 0;
    if (document.body) {
      bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
    return scrollTop;
  },
  //文档的总高度
  getScrollHeight: function () {
    var scrollHeight = 0,
      bodyScrollHeight = 0,
      documentScrollHeight = 0;
    if (document.body) {
      bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = bodyScrollHeight - documentScrollHeight > 0 ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
  },
  //浏览器视口的高度
  getWindowHeight: function () {
    var windowHeight = 0;
    if (document.compatMode == 'CSS1Compat') {
      windowHeight = document.documentElement.clientHeight;
    } else {
      windowHeight = document.body.clientHeight;
    }
    return windowHeight;
  },
  hitBottom: function (callback, height = 50) {
    if (this.getScrollHeight() - (this.getScrollTop() + this.getWindowHeight()) <= height) {
      callback && callback();
    }
  },
};

export const date = {
  format: function (timestamp, timeFormat = 'h:i:s') {
    var timeType = timeFormat.split(':');
    var d = new Date(timestamp * 1000); //根据时间戳生成的时间对象
    var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

    var time = '';
    var _this = this;
    timeType.map(function (data) {
      switch (data) {
        case 'h':
          time += ' ' + _this.checkTime(d.getHours());
          break;
        case 'i':
          time += ':' + _this.checkTime(d.getMinutes());
          break;
        case 's':
          time += ':' + _this.checkTime(d.getSeconds());
          break;
      }
    });

    date = date + time;

    return date;
  },
  checkTime: function (i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  },
};

//倒计时
export const countDown = function (deadTime) {
  deadTime = deadTime.replace(/\-/g, '/');
  var EndTime = new Date(deadTime); //截止时间
  var NowTime = new Date();
  var t = EndTime.getTime() - NowTime.getTime();

  var d = Math.floor(t / 1000 / 60 / 60 / 24) >= 0 ? Math.floor(t / 1000 / 60 / 60 / 24) : 0;
  var h = Math.floor((t / 1000 / 60 / 60) % 24) >= 0 ? Math.floor((t / 1000 / 60 / 60) % 24) : 0;
  var m = Math.floor((t / 1000 / 60) % 60) >= 0 ? Math.floor((t / 1000 / 60) % 60) : 0;
  var s = Math.floor((t / 1000) % 60) >= 0 ? Math.floor((t / 1000) % 60) : 0;

  h = d * 24 + h < 99 ? d * 24 + h : 99;

  if (h > 0) {
    h = h.toString();
    var h_l = h.substr(h.length - 1, 1);
    var h_h = h.length > 1 ? h.substr(h.length - 2, 1) : 0;
  } else {
    var h_l = 0;
    var h_h = 0;
  }

  if (m > 0) {
    m = m.toString();
    var m_l = m.substr(m.length - 1, 1);
    var m_h = m.length > 1 ? m.substr(m.length - 2, 1) : 0;
  } else {
    var m_l = 0;
    var m_h = 0;
  }

  if (s > 0) {
    s = s.toString();
    var s_l = s.substr(s.length - 1, 1);
    var s_h = s.length > 1 ? s.substr(s.length - 2, 1) : 0;
  } else {
    var s_l = 0;
    var s_h = 0;
  }

  return (
    '<span>' +
    h_h +
    '</span><span>' +
    h_l +
    '</span>:<span>' +
    m_h +
    '</span><span>' +
    m_l +
    '</span>:<span>' +
    s_h +
    '</span><span>' +
    s_l +
    '</span>'
  );
};

export const cookieUtil = {
  get: function (name) {
    let cookieName = encodeURIComponent(name) + '=',
      cookieStart = document.cookie.indexOf(cookieName),
      cookieValue = null;
    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(';', cookieStart);
      if (cookieEnd == -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
  },
  set: function (name, value, expires, path, domain, secure) {
    let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires instanceof Date) {
      cookieText += ';expires=' + expires.toGMTString();
    }
    if (path) {
      cookieText += ';path=' + path;
    }
    if (domain) {
      cookieText += ';domain=' + domain;
    }
    if (secure) {
      cookieText += ';secure';
    }
    document.cookie = cookieText;
  },
  unset: function (name, path, domain, secure) {
    this.set(name, '', new Date(0), path, domain, secure);
  },
};

// 调用app方法，以及回掉
export const CallApp = function ({ callAppName, param, callbackName, callbackFun }) {
  // 判断param是否为空 JSON.stringify(param)
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
  var otherParams = param ? param : '';
  var resData = JSON.stringify({
    jsMethod: callbackName ? callbackName : null,
    ...otherParams,
  });
  console.log(resData, '------------');
  // IOS
  if (!isAndroid) {
    if (window.webkit) {
      window.webkit.messageHandlers[callAppName].postMessage(resData);
    } else {
      console.log('is no in app');
    }
    // 安卓
  } else {
    if (window.android) {
      window.android[callAppName](resData);
    } else {
      console.log('is no in app');
    }
  }
  if (callbackName) {
    window[callbackName] = function (msg) {
      callbackFun(msg);
    };
  }
};

// 根据年月计算出一个月的开始和结束日期
export const getMontDateRange = (year, month) => {
  let startDate = moment([Number(year), Number(month) - 1]);
  let endDate = moment(startDate).endOf('month');
  return { start: moment(startDate).format('YYYY-MM-DD'), end: moment(endDate).format('YYYY-MM-DD') };
};
