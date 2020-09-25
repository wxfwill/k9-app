import React,{Component} from 'react';
import { Button, WingBlank } from 'antd-mobile';
import { connect } from 'react-redux';
import Reflux from 'reflux';
import ReactMixin from 'react-mixin';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import Store from './store';
import Actions from './actions';

require('style/fight/fight.less');

class Fight extends Component{
  constructor(props){
  	super(props);
    this.state={
      data:[]
    }
    let { user } = this.props.loginState;
    Actions.getUserData(user.id);
  }
  onChange(type,data){
    util.loading.hide();
    if(type=='userData'){
      this.setState({
        data:data
      })
    }
  }
  render(){
  	return(
  		<div className="fight">
        <Header title="网格化作战"/>
          <WingBlank>
            {this.state.data.map((item,index)=>{
                return(
                  <div className="task" key={index}>
                    <WingBlank>
                      <h3>{item.taskName}</h3>
                      <p>任务内容:{item.content}</p>
                      <p>任务地点:{item.location}</p>
                      <p>任务时间:{new Date(item.taskDate).toLocaleString()}</p>
                      <div className="handle">
                          <Button inline size="small">查看详情</Button>
                          <Button type="primary" inline size="small">领取任务</Button>
                      </div>
                    </WingBlank>
                  </div>
                )
              })}            
          </WingBlank>
        <Footer/>
  		</div>
  	)
  }
}
ReactMixin.onClass(Fight,Reflux.listenTo(Store, 'onChange'));
const mapStateToProps = state => ({
  loginState: state.login
})

export default connect(
  mapStateToProps
)(Fight)














// WEBPACK FOOTER //
// ./src/redux/containers/fight/index.js