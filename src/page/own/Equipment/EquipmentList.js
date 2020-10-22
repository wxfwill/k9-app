import React, { Component } from 'react';
import { Flex, WhiteSpace, Button, List } from 'antd-mobile';
import Header from 'components/common/Header';
import Ajax from 'libs/ajax';

import 'style/own/equipment.less'


export default class EquipmentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eqData: [],
        }
    }

    componentDidMount() {
        this.getEquipmentList();
    }

    getEquipmentList = () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        Ajax.post('/api/braceletInfo/getBraceletByUserId', {userId: user.id}, (res) => {
            if(res.code == '0') {
                this.setState({eqData: res.data})
            }
        })
    }
  
    render () {
        const eqData = this.state.eqData
        
        return <div className="equipment">
        <Header title="颈环信息" pointer />
        <List className="border-b-n">
        <List.Item arrow="none" >
                    <div className="k9_label">
                        <div>犬名</div>
                        <div>设备地址</div>
                    </div>
                </List.Item>
        {
            eqData.map((item, index) => {
                return <List.Item  key={`item_${index}`} arrow="none" onClick={() => {this.props.history.push({pathname: '/own/equipment/detail', query: {dogId: item.dogId, eqId: item.id}})}}>
                    <div className="k9_label">
                        <div>{item.dogName}</div>
                        <div>{item.uniqueNo}</div>
                    </div>
                </List.Item>
            })
        }
            
      </List>
        </div>
    }
}


// WEBPACK FOOTER //
// ./src/components/own/Equipment/EquipmentList.js