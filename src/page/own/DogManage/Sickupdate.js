import React, { Component } from 'react';
import {Button, List, DatePicker, InputItem, SearchBar,Drawer,TextareaItem } from 'antd-mobile';
import moment from 'moment';
import Header from 'components/common/Header';

import { createForm } from 'rc-form';

import Ajax from 'libs/ajax';
import { toast } from 'libs/util'


/**
 * 犬病上报
 */
class SickUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            dogList: [],
            open: false,
            SearchText: '',
            dogId: '',
            symptom: '',
        };
        this.timer = null;
    }

    componentDidMount() {
        
    }
    getDogs = (text) => {
        clearTimeout(this.timer);
        this.setState({SearchText: text})
        const self = this;
        this.timer = setTimeout(() => {
            Ajax.post('/api/dog/getByNameOrNumber', {dogName: text}, (res) => { 
                if(res.code == 0) {
                    this.setState({dogList: res.data, open:true})
                }      
            });
        }, 500)
    
    }

    renderSidebar = () => {
       const {dogList} = this.state;
       return dogList.map((item) => {
       return <List.Item 
        key={item.id+'slider'} 
        arrow="horizontal" 
        style={{width: document.documentElement.clientWidth}}
        onClick={() => {
            this.setState({open:false,  SearchText: item.name, dogId: item.id})
        }}
        >{item.name}</List.Item>
       })
   }

   submit = () => {
        const {date, dogId} = this.state;
        let symptom=this.props.form.getFieldValue("symptom");
        if(dogId == "") {
            toast("请选择犬只！");
            return
        } else if (symptom == "") {
            toast("请填写发病症状！")
            return
        }

        const user = JSON.parse(sessionStorage.getItem("user"));

        Ajax.post('/api/treatmentRecord/reportDisease', {dogId, morbidityTime: moment(date).format('YYYY-MM-DD'), symptom, userId: user.id}, (res) => { 
            if(res.code == 0) {
                toast('上报成功！')
                setTimeout(()=> { this.props.history.push('/own')}, 1500)
            }      
        });

   }

    render () {
        const { getFieldProps } = this.props.form;
        const {SearchText, open} = this.state;

        return <div className="sick_update">
        <Header title="犬病上报" pointer />
        <DatePicker
          mode="date"
          title="选择日期"
          extra="Optional"
          value={this.state.date}
          onChange={date => this.setState({ date })}
          // onOk={date => {this.getEquipmentList(date)}}
        >
          <List.Item arrow="horizontal">日期</List.Item>
        </DatePicker>
        <List>
            <SearchBar
                placeholder="输入警犬名称或者编号" 
                value={SearchText}
                onChange={(value) => {this.getDogs(value)}}
                onCancel={() => {this.setState({open: false})}}
            />
             <Drawer
                // className="my-drawer"
                style={{ minHeight: document.documentElement.clientHeight, top: 42,  display: open?'block':'none'}}
                enableDragHandle
                contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                sidebar={this.renderSidebar()}
                open={this.state.open}
                onOpenChange={this.onOpenChange}
            >''</Drawer>
        </List>
        <List>
            <TextareaItem
                {...getFieldProps('symptom')}
                clear
                title="疾病症状："
                placeholder="描述疾病症状"
                autoHeight
                rows={6}
            />
        </List>
     
           <Button  type="primary" style={{position: 'absolute', bottom:0, width: '100%'}} onClick={this.submit}>上报</Button>
       
        </div>
    }
}

const SickUpdateWrapper = createForm()(SickUpdate);
module.exports=SickUpdateWrapper;


// WEBPACK FOOTER //
// ./src/components/own/DogManage/Sickupdate.js