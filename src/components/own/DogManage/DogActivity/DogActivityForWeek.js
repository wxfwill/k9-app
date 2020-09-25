'use strict';
import React, { Component } from 'react';
import {Flex} from 'antd-mobile';

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图。
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

/**
 * 警犬周运动统计
 */
export default class DogActivityForWeek extends Component{

    constructor(props){
        super(props);
        this.state={
            weekSportInfo:''
        }
    }
    componentWillReceiveProps(){
        this.showWeekInfo();
    }
    componentDidMount() {
        this.showWeekInfo();
    }

    showWeekInfo=()=>{
        let {weekSportInfo} = this.props;
        this.setState({weekSportInfo:weekSportInfo});
        let timeData = [];
        let stepData = [];
        let calorieData = [];
        for (const key in weekSportInfo) {
            if (weekSportInfo.hasOwnProperty(key)) {
                timeData.push(key.split("-")[1]+'-'+key.split("-")[2]);
                const element = weekSportInfo[key];
                stepData.push(element&&element.split(",")[0] || 0);
                calorieData.push(element&&element.split(",")[1] || 0);
            }
        }

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('week_container'));

        //绘制周运动折线图
        myChart.setOption({
            tooltip : {
                trigger: 'axis'
            },
            calculable : true,
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: timeData
            },
            legend: {
                data:['步数','卡路里',]
            },
            yAxis: [
                {
                    type : 'value',
                    name : '步数',
                    axisLabel : {
                        formatter: '{value}'
                    }
                },
                {
                    type : 'value',
                    name : '卡路里',
                    axisLabel : {
                        formatter: '{value} '
                    }
                }
            ],
            series: [{
                name:'步数',
                data: stepData,
                lineStyle:{
                    color: '#49a9ee',
                },
                type:'line',
                smooth:true,
            //    symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#dbeefc'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(219,238,252)'
                        }, {
                            offset: 1,
                            color: 'rgb(73,169,238)'
                        }])
                    }
                },
               
            },
            {
                data: calorieData,
                name:'卡路里',
                lineStyle:{
                    color: 'rgb(255, 70, 131)'
                },
                type:'line',
                smooth:true,
            //    symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(255, 70, 131)'
                    }
                },
                yAxisIndex: 1,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    }
                },
            }
        ]    
        },true);
    }
    render () {

        return (
                <Flex direction="row" style={{height:'100%'}}>
                     <Flex.Item ref="myt" id="week_container" style={{height:'100%',}}></Flex.Item>
                </Flex>
        )
    }
}


// WEBPACK FOOTER //
// ./src/components/own/DogManage/DogActivity/DogActivityForWeek.js