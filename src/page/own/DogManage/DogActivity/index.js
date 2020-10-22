'use strict';
import React, { Component } from 'react';
import { Accordion,Progress,List,Card,Flex,WhiteSpace,DatePicker,InputItem,Picker,Toast} from 'antd-mobile';
import Header from 'components/common/Header';
import Ajax from 'libs/ajax';

import DogActivityForMonth from './DogActivityForMonth';
import DogActivityForWeek from './DogActivityForWeek'


const CardBody=Card.Body;
const Item = List.Item;
/**
 * 警犬运动量信息
 */
export default class DogActivity extends Component{
    constructor(props){
        super(props);
      
        this.state={
          dogList:[],
          pickerValue:'',
          dogSportInfo:''
        }
    }
    componentDidMount(){
        //在Process组件上面使用barStyle属性调整进度条的高度无效,改用下面的方式来修改该组件的样式
   /*     let bar=document.getElementsByClassName('am-progress-bar')[0];
        bar.style.height='25px';
        bar.style.background='#108ee9';*/
        this.getMyDogList();
    }
    
    getMyDogSportInfo=(id)=>{
        let _this=this;
        Ajax.post('/api/dog/getMyDogSportStatistics', {
            dogId:id,
        }, (res) => {
            if(res.code == 0){
                _this.setState({
                    dogSportInfo:res.data,
                });
            }else{
                Toast.info(res.msg);
                return ;
            }
        });
    }
    getMyDogList=()=>{
        let _this=this;
        Ajax.get('/api/dog/listMyDog', {
        }, (res) => {
            if(res.code == 0){
                let dogList=[];
                res.data.map((item)=>{
                    dogList.push({value:item.id,label:item.name})
                })
                _this.setState({
                    dogList:dogList,
                    pickerValue:dogList.length>0 ? [dogList[0].value] : ''
                });
                if(dogList.length>0){
                    _this.getMyDogSportInfo(dogList[0].value);
                }else{
                    Toast.info("暂无警犬信息！");  
                }
               
            }else{
                Toast.info(res.msg);
                return ;
            }
        });
  
    }

    getMyDogById=(v)=>{
        this.setState({ pickerValue: v })
        this.getMyDogSportInfo(v[0]);
    }
    render() {
        let {dogList,dogSportInfo}=this.state
        return (
            <div>
                <Header title="警犬运动统计" pointer />
                <div style={{ marginTop: 10, marginBottom: 10 }}>
                <List style={{ backgroundColor: 'white' }} className="date-picker-list">
                    <Picker
                        title="警犬"
                        extra="请选择警犬"
                        data={dogList}
                        value={this.state.pickerValue}
                        onChange={v => this.getMyDogById(v)}
                        onOk={v => this.getMyDogById(v)}
                        cols={1} 
                        >
                         <Item arrow="horizontal">我的警犬</Item>
                        </Picker>
                </List>
                    <Accordion defaultActiveKey="0" className="my-accordion">
                        <Accordion.Panel header="今日运动">
                            <Card >
                            <CardBody>
                                <Flex direction="row">
                                    <Flex.Item >步数：</Flex.Item>
                                    <Flex.Item style={{ flex:2}}>
                                        {dogSportInfo.todayConsumeEnergy&&dogSportInfo.todayConsumeEnergy.split(',')[0] || '--'}
                                    </Flex.Item>
                                </Flex>
                                <WhiteSpace size="lg" />
                                <Flex direction="row">
                                     <Flex.Item >卡路里：</Flex.Item>
                                     <Flex.Item style={{ flex:2}}>
                                     {dogSportInfo.todayConsumeEnergy&&dogSportInfo.todayConsumeEnergy.split(',')[1] || '--'}
                                    </Flex.Item>    
                                </Flex>
                                <WhiteSpace size="lg" />
                                <Flex direction="row">
                                     <Flex.Item >温度：</Flex.Item>
                                     <Flex.Item style={{ flex:2}}>
                                     {dogSportInfo.todayConsumeEnergy&&dogSportInfo.todayConsumeEnergy.split(',')[2] || '--'}
                                    </Flex.Item>    
                                </Flex>
                            </CardBody>
                            </Card> 
                        </Accordion.Panel>

                        <Accordion.Panel header="本周运动" className="pad">
                            <Card>
                                <CardBody style={{height:400}}>
                                    <Flex direction="row">
                                        <Flex.Item ><b>近一周运动</b></Flex.Item>
                                        <Flex.Item style={{flex:3}}>
                                     {/*     <DatePicker
                                            mode="date"
                                            title="选择日期"
                                         
                                        >
                                            <Item arrow="horizontal"> </Item>
                                        </DatePicker>
                                        <InputItem defaultValue="" placeholder="" data-seed="logId" labelNumber="2" ></InputItem>*/}
                                        </Flex.Item>
                                    </Flex>
                                   <DogActivityForWeek ref="weekInfo" weekSportInfo={dogSportInfo.weekSportInfo}/>     
                                </CardBody>
                            </Card> 
                        </Accordion.Panel>
                    {/*    <Accordion.Panel header="本月运动" className="pad">
                            <Card>
                                <CardBody style={{height:400}}>
                                    <Flex direction="row">
                                        <Flex.Item><b>近一个月运动</b></Flex.Item>
                                        <Flex.Item style={{flex:3}}>
                                          <InputItem defaultValue="Title" placeholder="please input content" data-seed="logId" labelNumber="2" >本月</InputItem>
                                        </Flex.Item>
                                    </Flex>
                                   <DogActivityForMonth/>     
                                </CardBody>
                            </Card>                            
                        </Accordion.Panel>*/}
                    </Accordion>
                 </div>                
            </div>
        );
    }

}

//警犬运动量信息
module.exports = DogActivity;


// WEBPACK FOOTER //
// ./src/components/own/DogManage/DogActivity/index.js