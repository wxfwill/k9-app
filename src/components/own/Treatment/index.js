//警犬诊断
import React, { Component } from 'react';
import { List} from 'antd-mobile';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import Ajax from 'libs/ajax';
import moment from 'moment'; 



const Item = List.Item;

const pageSize=10;
let curPage=1;


/**
 * 警犬诊断列表
 */
export default class DogTreatmentList extends Component{
    constructor(props){
      super(props);
      this.state = {
        treatmentRecordList:null    //诊断列表
      }
    }

    handleLink = (item) => {
      let { history }  = this.props;
      history.push({pathname:'/own/DogMange/DogDiagnosis',query:item.id});
    }

    componentDidMount() {   
     
        setTimeout(() => {           

            Ajax.post('/api/treatmentRecord/list', {currPage:curPage,pageSize:pageSize}, (res) => { 
                this.setState({treatmentRecordList:res.data.list});
            });

          }, 600);
    }

    render(){
        return(
            <div className="Own">
                <Header title="警犬诊断列表" pointer />
                <List  className="my-list">
                    { this.state.treatmentRecordList && this.state.treatmentRecordList.map((item,index)=>{
                        return(
                            <Item key={'item_r_'+item.id} extra={moment(item.morbidityTime).format('YYYY-MM-DD')} arrow="horizontal" onClick={() => this.handleLink(item)}><span className="own-text">{item.dogName}</span></Item>
                        )})
                    }
                </List>
                <div style={{height: '90px'}}></div>
                <Footer/>
            </div>
        )
    }
}





// WEBPACK FOOTER //
// ./src/components/own/Treatment/index.js