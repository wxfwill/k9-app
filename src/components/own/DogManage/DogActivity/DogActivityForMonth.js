'use strict';
import React, { Component } from 'react';
import {Flex} from 'antd-mobile';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图。
import 'echarts/lib/chart/line';

/**
 * 警犬月运动统计
 */
export default class DogActivityForMonth extends Component{

    componentDidMount() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('month_container'));

        //绘制月运动折线图
        myChart.setOption({
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                areaStyle: {}
            }]    
        },true);
    }

    render () {

        return (
                <Flex direction="row" style={{height:'100%'}}>
                     <Flex.Item ref="myt" id="month_container" style={{height:'100%'}}></Flex.Item>
                </Flex>
        )
    }
}


// WEBPACK FOOTER //
// ./src/components/own/DogManage/DogActivity/DogActivityForMonth.js