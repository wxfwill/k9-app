import React, { Component } from 'react';
import { Flex, WhiteSpace, Button, List } from 'antd-mobile';
import Header from 'components/common/Header';

import 'style/own/equipment.less'



export default class Equipment extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        
    }


    handleJump = (url) => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const token = util.cookieUtil.get('token');
        if(url == 'toApp' && navigator.userAgent) {
            var u = navigator.userAgent; 
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
            if(isAndroid){
                window.AndroidWebView.startBluetooth(JSON.stringify({...user, token}))
            }else{
                window.webkit.messageHandlers.startBluetooth.postMessage(JSON.stringify({...user, token}));
            }
           
        } else {
            this.props.history.push(url);
        }
    }
    render () {
        return <div className="equipment">
        <Header title="智能颈环" pointer />
        <List className="border-b-n">
            <List.Item  arrow="horizontal" multipleLine onClick={() => this.handleJump('/own/equipment/list')} >
                颈环信息
            </List.Item>
            <List.Item  arrow="horizontal" multipleLine onClick={() => this.handleJump('toApp')} >
                连接颈环
            </List.Item>
        </List>
        </div>
    }
}


// WEBPACK FOOTER //
// ./src/components/own/Equipment/Equipment.js