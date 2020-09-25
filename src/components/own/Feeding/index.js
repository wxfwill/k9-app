import React,{Component} from 'react';
import { List , Picker ,DatePicker,TextareaItem ,InputItem,Stepper,WhiteSpace, WingBlank,Button,Toast,Radio,Flex} from 'antd-mobile';
import { createForm } from 'rc-form';
import Header from 'components/common/Header';
import DogBox from 'components/common/CheckBox';
import { withRouter,Link } from "react-router-dom";
import Ajax from 'libs/ajax';
import moment from 'moment';

require('style/publish/pubTraining.less');

const Item = List.Item;
const Brief = Item.Brief;
const RadioItem=Radio.RadioItem;
const typeData = [
  {
    label: '第一餐',
    value: '1',
  },
  {
    label: '第二餐',
    value: '2',
  },{
    label: '清扫',
    value: '3',
  }
];
const statusData = [
  {
    label: '正常',
    value: '0',
  },
  {
    label: '异常',
    value: '1',
  }
];
const data = [
  { value: 0, label: '正常' },
  { value: 1, label: '异常' },
];
function failToast(text,fn) {
  Toast.fail(text, 1);
}
function successToast(text,fn) {
  Toast.success(text, 1,fn,true);
}
class FeedingComponent extends Component{
  constructor(props){
  	super(props);
    this.state={
      hasError: false,
      value: '',
      statusType:'',
      DogList:[],
      disabled: false,
      val: 1,
      selectedName:[],
      selectedId:[],
    }
    this.timer = null;
  }
  componentDidMount(){
    Ajax.post('/api/dog/listAll',{}, (res) => {
      if(res.code == 0){
        this.setState({
          DogList:res.data,
        });
      }else{
        failToast(res.msg);
        return ;
      }
  });
  }
  handleChange(type,date){
    this.setState({
      [type]:date
    })
  }
  handleOk(){

  }
  
  handleSubmit(){
    const { history } = this.props;
    let {selectedId} = this.state;
    this.props.form.validateFields((error) => {
      if (!error) {
        let isReturn = true;
        let subData = this.props.form.getFieldsValue();
        console.log(subData)
        Object.keys(subData).forEach((item,index)=>{
          if(typeof subData[item]=='undefined'||selectedId.length<0){
              failToast('请补全信息！');
              isReturn = false;
          };
        })
        if(!isReturn){return false};
        Ajax.post('/api/feed/reportDailyFeed',{ 
          dogIds:selectedId.join(','),
          reportType:Number(subData.type[0]),
          status:Number(subData.status[0])
        }, (res) => {
            if(res.code == 0){
              successToast("提交成功！",function(){
                history.push('/own');
              })
            }else{
              failToast(res.msg);
              return ;
            }
        });
      } else {
        console.log(error);
      }
    });
  }
  onChange(type,data){
   let handle = this.handleRes()[type];
   typeof handle!=='undefined'&&handle();
  }
  handleRes(){
    const { history } = this.props;
    return{
      saveRes:function(){
        successToast('提交！',function(){
          history.push('/own/leave/attend');
        })
      }
    }
  }

  clickOk(data){
    console.log(data)
    let names=[];
    let ids=[];
    data.forEach(element => {
        names.push(element.name);
        ids.push(element.id);
    });
    this.setState({
      selectedName:names.join(','),
      selectedId:ids
    })
  }

  render(){
    const { getFieldProps } = this.props.form;
    const { statusType} = this.state;
  	return(
  		<div className="add-content" >
        <Header title="饲养情况"  pointer='pointer'/>
        <div className="list-box">
        <List  className="list">
       
       
            <DogBox
                  title="警犬列表"
                  initTip="请选择警犬"     
                  searchTip="请输入查询内容"   
                  disabled={this.state.disabled}
                  clickOk = {(data) => this.clickOk(data)} 
                  dataList={this.state.DogList}
                  showValue={this.state.selectedName}
                  useDefaultDom={true}
              />
              
              </List>
          <List className="list">
            <Picker data={typeData}  cols={1} {...getFieldProps('type')} className="forss">
              <Item arrow="horizontal"><i className="tips">*</i>上报类型</Item>
            </Picker>
          </List>
          <List className="list">
            <Picker data={statusData}  cols={1} {...getFieldProps('status')} className="forss">
              <Item arrow="horizontal"><i className="tips">*</i>状态</Item>
            </Picker>
          </List>

           
        
        
        </div>
         <div className="btn-box">
          
             
                <button className="clear" style={{display:'none'}}>清空</button>
                <button className="publish" onClick={()=>this.handleSubmit()}>提交</button>
            
         </div>
     

    </div>
  	)
  }
}

const Feeding = createForm()(FeedingComponent);
export default withRouter(Feeding);














// WEBPACK FOOTER //
// ./src/components/own/Feeding/index.js