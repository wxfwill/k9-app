'use strict';
//热门列表
module.exports = {
	baseUrl :window.baseUrl,
        //'http://www.hcfdev.com/mlsztest/api/'
        // 正式环境
        //'http://www.hcfdev.com/mlsztest/api/',
		//'http://www.52mlsz.com/wx/api/',
		//http://www.hcfdev.com/mlsztest/api/
		//'http://203.195.168.193/mlsztest/index.php/api/'
    timeOut : '30000',  //默认超时30秒
    init : function() {

    },

    ajaxGet : function(url, params, callback) {
        //无查询参数，用于兼容(url,callback)模式
        if (typeof callback === 'undefined' && typeof  params === 'function') {
            callback = params;
            params = {};
        }

        this._ajaxData('get', url, params, callback);
    },

    ajaxPost : function(url, params, callback) {
        //无查询参数，用于兼容(url,callback)模式
        if (typeof callback === 'undefined' && typeof  params === 'function') {
            callback = params;
            params = {};
        }

        this._ajaxData('post', url, params, callback);
    },

    getUserExtInfo: function(){
        var _this = this;
        this.ajaxPost('mobile/getUserExtInfo',{},function (data) {
            window.UserExtraInfo=data;
        },'sync');
    },

    //获取微信签名
    getWxSign : function(callback) {
        var _this = this;
        var url = location.href.split('#')[0];
        this.ajaxPost('cominterface/sign', {url : url}, function(data) {
            //_this.trigger(data, 'wxSign');
            callback && callback(data);
        });
    },

    //获取地理位置
    getLocation : function(lng, lat) {
        var params = {
            lng : lng,
            lat : lat
        };
        var _this = this;
        this.ajaxPost('cominterface/get_location', params, function(data) {
            _this.trigger(data, 'getLocation');
        });
    },

    //微信登陆
    wxLogin : function(callback) {
		/*
		var reg = new RegExp('(^|&)code=([^&]*)(&|$)','i');
		var params = window.location.search.substr(1).match(reg);
        var code = params !== null ? params[2] : '';
		*/
		var begin=window.location.hash.indexOf('?');
		var length=window.location.hash.length;
		var str=window.location.hash.substring(begin,length);
		var url=str.substr(1);
		url= url.split('&');

        var options={
            code:''
        }

        for(var i=0;i<url.length;i++){
    		  var arr=url[i].split('=');
              if(arr[0]=='code'){
    		      options.code=arr[1];
              }else if(arr[0]=='params'){
                    var params=arr[1]+'';

                    var key=[],value=[],result=[];
                    var arr=params.split('/');

                    arr.map(function(item,i){
                        if(i % 2 == 0){
                            key.push(item)
                        }else{
                            value.push(item)
                        }
                    })

                    key.map(function(item,i){
                        result[item]=value[i];
                    })

                    options.type=result['type'];
                    options.obj_id=result['obj_id'];
                    options.source=result['source'];
                    options.uid=result['uid'];
              }
        }
        //Login
        //testLogin
        this.ajaxPost('user/Login',options, function(data) {
            callback && callback(data);
        });
    },

    /**
     * 统一ajax请求获取数据
     * @param type  请求方式
     * @param url   请求地址
     * @param params    请求参数
     * @param callback  回调函数
     * @param sync  同步方式
     * @private
     */
    _ajaxData : function (type, url, params, callback, sync) {
        //无查询参数，用于兼容(url,callback)模式
        if (typeof callback === 'undefined' && typeof  params === 'function') {
            callback = params;
            params = {};
        }

        url=url.indexOf('http')>=0?url:this.baseUrl + url;
        params.t = Math.random();
        var _this = this;
        $.ajax({
            'url': url,
            'type' : type,
            'async': !(sync &&  (sync === 'sync')),
            'data': params,
            'dataType': 'json',
            'timeout' : this.timeout,
            'xhrFields': {
                withCredentials: true
            },
            'success': function (result) {
                util.mask.hide();
                if (result && typeof result.code !== 'undefined' && result.code === 0 && typeof result.data !== 'undefined') {
                    callback && callback(result.data);
                } else {
                    //出错统一处理
                    _this._handleAPIError(result);
                }
            },
            'error' : function(result) {
                util.mask.hide();
                //出错统一处理
                _this._handleAPIError(result);
            }
        });
    },

    /**
     * 对API调用发生的异常错误做处理（容错、提示、记录）
     * @param result
     */
    _handleAPIError : function(result) {
        util.loading.hide();
        if (result && typeof result.statusText && result.statusText === 'timeout') {
            alert('请求超时！');
        }

        //隐藏loading
        /*if ($('.mod-loading:visible').length > 0) {
            $('.mod-loading').hide();
        }*/

        if (result) {
            if (typeof result.code !== 'undefined' && result.code === 2 || result.code === 1) {
                result.msg && util.toast(result.msg);
            } else if (typeof result.responseText !== 'undefined') {
                if (result.msg) {
                    util.toast(result.msg);
                } else {
                    util.toast('您的网络不太给力噢!');
                }
            } else if(result.code===1001){
                /*
                var redirect_url=window.location.href;
                if(redirect_url.indexOf("?") != -1)
                {
                   redirect_url = redirect_url.split("?")[0];
                }
                redirect_url=encodeURIComponent(redirect_url);
                //var url="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+APPID+"&redirect_uri="+redirect_url+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
                //var url="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+APPID+"&redirect_uri="+redirect_url+"&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
                var url="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+APPID+"&redirect_uri=http%3A%2F%2Fwww.hcfdev.com%2Ftest%2F%23%2Fvalidation%2F38&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
                location.href=url;*/
				//location.href = 'http://mp.weixin.qq.com/s?__biz=MzA5MDcxNzk2NA==&mid=206925187&idx=1&sn=bc8bff192af40a8a963115bb5b2a086f&scene=0#rd';
                // util.toast('登陆失败!请关闭页面重新进入');
                if (result.msg) {
                    util.toast(result.msg);
                }
			}
        }
    }
};