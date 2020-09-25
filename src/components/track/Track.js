import React, { Component } from 'react';
import { Flex, WhiteSpace, Button, InputItem, List, DatePicker, Picker, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment';
import Header from 'components/common/Header';
import Ajax from 'libs/ajax';
import 'style/track/track.less'

class Track extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate:'',
            endDate:'',
            userId: '',
            userData: [],
        }
    }

    componentDidMount() {
        this.getAllUser();
    }
    getTracks = () => {
        const {userId, startDate, endDate} = this.state;
        if(!userId) {
            Toast.info('请选择警员！')
            return ;
        } else if (!startDate) {
            Toast.info('请选择开始时间！');
            return ;
        } else if (!endDate) {
            Toast.info('请选择开始时间！');
            return ;
        }
     /*   else if(moment(endDate).format('x')-moment(startDate).format('x')>86400000){
            Toast.info('时间间隔必须在一天内！');
            return ;
        }*/
          else if(moment(startDate).add(24,'h').isBefore(moment(endDate))) {
             Toast.info('时间间隔不得超过24小时！');
             return ;
         }
        // 请求的轨迹数据，可以使用redux共享数据或者先跳转到轨迹页面再请求接口
        Ajax.post('/api/cmdMonitor/qryTrochoid', {
            userId,
            startTime: moment(startDate).format('x'),
            endTime: moment(endDate).format('x'),
        }, (res) => {
            if(res.code == 0){
                let { history }  = this.props;
                const startTime = moment(startDate).format('x');
                const endTime = moment(endDate).format('x');
                 history.push({pathname:'/track/map', query:{res,userId,startTime,endTime} });
            }else{
                Toast.info('没有轨迹信息，请重新设置条件！');
                 return ;
            }
        });
    }
    getAllUser = () => {
       
        Ajax.post('/api/userCenter/getTrainer', (res) => {
           
            if(res.code == 0) {
                const newData = res.data && res.data.map((t) =>  {
                    return {value: t.name, label: t.name, id: t.id}
                })
                this.setState({userData: newData});
            }else if(res.code == 10001){
                Toast.info('未登陆，请重新登陆！');
                let { history }  = this.props;
                history.push('/login');
                return ;
            }
        });
    }
    changePeo = (value) => {
        const userData = this.state.userData;
        console.log(value, userData)
        userData.forEach((t) => {
            if(t.value == value[0]) {
                this.setState({
                    userId: t.id
                })
            }
        })
    }
    render() {
        console.log(this.state)
        const { getFieldProps } = this.props.form;
        const { userData } = this.state;
        return <div className="track">
        <Header title={'轨迹搜索'} pointer="pointer"/>
  
            {/* <InputItem
                {...getFieldProps('autofocus')}
                clear
                labelNumber={7}
                placeholder="警员姓名/警号"
                ref={el => this.autoFocusInst = el}
            >警员姓名/警号 </InputItem> */}
          
            <Picker data={userData} cols={1} {...getFieldProps('district3')} className="forss"
               onOk={(value) => this.changePeo(value)}
            >
                <List.Item arrow="horizontal">警员</List.Item>
            </Picker>

            <List className="date-picker-list" style={{ backgroundColor: 'white' }}>

            <DatePicker
                value={this.state.startDate}
                onChange={date => this.setState({ startDate:date })}
            >
                <List.Item arrow="horizontal">开始时间</List.Item>
            </DatePicker>
            <DatePicker
                value={this.state.endDate}
                onChange={date => this.setState({ endDate:date })}
            >
                <List.Item arrow="horizontal">结束时间</List.Item>
            </DatePicker>
            </List>
            <Button type="primary" style={{position: 'absolute',bottom: '0', width: '100%'}}
                onClick={this.getTracks}
            >搜索</Button>
        </div>
    }
}

export default createForm()(Track);


// WEBPACK FOOTER //
// ./src/components/track/Track.js