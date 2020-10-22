import React, { Component } from 'react';
import { Badge } from 'antd-mobile';
import Ajax from 'libs/ajax';

export default class MyDogNum extends Component {

    constructor(props){
        super(props); 
    
        this.state = {
            totalnum:'--'
        }
    }  

    componentDidMount() {    
        setTimeout(() => {           
            Ajax.get('/api/dog/getMyDogTotalNum', {}, (res) => { 
                this.setState({
                    totalnum:res.data.totalnum+'头'
                  });  
            });
          }, 600);
    }

    render () {
        const {totalnum}=this.state;
        return <div style={{float:'right'}}>
            <Badge text={totalnum}/>
        </div>

    }
}


// WEBPACK FOOTER //
// ./src/components/own/DogManage/MyDogNum.js