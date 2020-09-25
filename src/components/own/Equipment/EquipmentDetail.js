import React, { Component } from 'react';
import { Flex, WhiteSpace, Button, List, DatePicker } from 'antd-mobile';
import Header from 'components/common/Header';
import Ajax from 'libs/ajax';
import Moment from "moment";

import 'style/own/equipment.less'


export default class EquipmentDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dogInfo: {},
            date: new Date,
            eqData: {},
        }
    }

    componentDidMount() {
        this.getEquipmentList();
    }

    getEquipmentList = (date) => {
        const selectDate = date || this.state.date;
        const MomentDate = Moment(selectDate);
        const qryDate = MomentDate.format('YYYY-MM-DD')
        if(this.props.history.location.query) {
            const {dogId, eqId} = this.props.history.location.query;
            Ajax.post('/api/braceletInfo/getSportData', {dogId, id: eqId, qryDate }, (res) => {
                if(res.code == '0') {
                    this.setState({dogInfo: res.data.dogInfo, eqData: res.data.data})
                }
            })
        }  
    }
  
    render () {
        const {dogInfo, eqData} = this.state;
        return <div className="equipment">
        <Header title="运动信息" pointer />
        <DatePicker
          mode="date"
          title="选择日期"
          extra="Optional"
          value={this.state.date}
          onChange={date => this.setState({ date })}
          onOk={date => {this.getEquipmentList(date)}}
        >
          <List.Item arrow="horizontal">日期</List.Item>
        </DatePicker>
        <List className="border-b-n">
            <List.Item arrow="none">
                <div className="k9_label">
                    <div>{dogInfo.name}</div>
                    <div>设备：{eqData.macAddress}</div>
                </div>
            </List.Item>
            <List.Item arrow="none">
                <div className="k9_label">
                    <div>步数</div>
                    <div>{eqData.steps} 步</div>
                </div>
            </List.Item>
            <List.Item arrow="none">
                <div className="k9_label">
                    <div>能量</div>
                    <div>{eqData.consumeEnergy} 卡路里/cal</div>
                </div>
            </List.Item>
            
      </List>
        </div>
    }
}


// WEBPACK FOOTER //
// ./src/components/own/Equipment/EquipmentDetail.js