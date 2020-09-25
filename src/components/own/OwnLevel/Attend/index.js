import React,{Component} from 'react';
import { List , Picker ,DatePicker,TextareaItem ,InputItem,Stepper,WhiteSpace, WingBlank,Button,Toast,ImagePicker} from 'antd-mobile';
import Reflux from 'reflux';
import commonJs from 'libs/CommonStore';
import { createForm } from 'rc-form';
import ReactMixin from 'react-mixin';
import Header from 'components/common/Header';
import { withRouter,Link } from "react-router-dom";
import moment from 'moment';
import Ajax from 'libs/ajax';
import { loading } from 'libs/util'
require('style/own/ownLevel.less');
const Item = List.Item;
const Brief = Item.Brief;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
function failToast(text,fn) {
  Toast.fail(text, 1);
}
function successToast(text,fn) {
  Toast.success(text, 1,fn,true);
}
class OwnLevelComponent extends Component{
  constructor(props){
  	super(props);
    this.state={
      start:now,
      end:now,
      hasError: false,
      value: '',
      val: 1,
      seasons:[],
      files:null
    }
    this.timer = null;
  }
  handleChange(type,date){
    this.setState({
      [type]:date
    })
  }
  handleOk(){

  }

  
  componentDidMount() {
    Ajax.post('/api/leaveRecord/getLeaveTypeList',  (res) => {
        if(res.code == 0){
        let typeList=[] 
        res.data&&res.data.map((item,index)=>{
          typeList.push({value:item.typeId,label:item.typeName});
          })
        this.setState({
          seasons:typeList,
        });
        }else{
            Toast.info(res.msg);
            return ;
        }
    });
}
  handleNumber(type){
    this.numObj()[type](this);
  }
  numObj(){
    return{
      cut:function(pointer){
        pointer.setState({val:pointer.state.val==0.5?0.5:(pointer.state.val-0.5)})
      },
      add:function(pointer){
        pointer.setState({val:pointer.state.val==99?99:(pointer.state.val+0.5)})
      }
    }
  }
  handleSubmit(){
    let subData = this.props.form.getFieldsValue();
    console.log(subData)
    const { history } = this.props;
    if(typeof subData.type!='undefined' && (subData.type==2 || subData.type==4 || subData.type==8 )){
      if(this.state.files==null || this.state.files.length<=0){
        failToast('请补全信息！');
        return;
      }
    }
    let formData = new FormData();
    for(let key in this.state.files){
      formData.append("files", this.state.files[key].file);
    }    
    this.props.form.validateFields((error) => {
      console.log(this.props.form,'this.props.form');
      if (!error) {
        let isReturn = true;
        Object.keys(subData).forEach((item,index)=>{
          if(typeof subData[item]=='undefined'){
              failToast('请补全信息！');
              isReturn = false;
          };
        })
        if(!isReturn){return false};
        formData.append('leaveStartTimeStr',moment(this.state.start).format('YYYY-MM-DD HH:mm:ss'));
        formData.append('leaveEndTimeStr',moment(this.state.end).format('YYYY-MM-DD HH:mm:ss'));
        formData.append('applyTimeStr',moment(now).format('YYYY-MM-DD HH:mm:ss'));
        formData.append('duration',this.state.val);
        formData.append('type',Number(subData.type[0]));
        formData.append('remark',subData.remark);
        let _this = this
        loading.show('提交中');
        commonJs.ajaxFile('post','/api/leaveRecord/saveInfo',formData,function(result) {
           //  _this.trigger('saveRes',result);
           if(result.code == 0){
              let { history }  = _this.props;
              Toast.info("申请成功!");
              history.goBack();
              loading.hide()
            }else{
                Toast.info(result.msg);
                loading.hide()
                return ;
            }
        }); 
      } else {
        console.log(error);
      }
    });
  }
  onChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files,
    });
  };

  render(){
    const { getFieldProps } = this.props.form;
    let {files,seasons} = this.state;
  	return(
  		<div className="OwnLevel" >
      
        <Header title="请假申请"  pointer='pointer'/>
        <List style={{ backgroundColor: 'white' }} className="date-picker-list">
            <Picker data={seasons} cols={1} {...getFieldProps('type')} className="forss">
              <Item arrow="horizontal">请假类型</Item>
            </Picker>
            <DatePicker
              title="选择日期"
              value={this.state.start}
              onOk={this.handleOk.bind(this)}
              onChange={this.handleChange.bind(this,'start')}
            >
              <Item arrow="horizontal">开始时间</Item>
            </DatePicker>
            <DatePicker
              title="选择日期"
              value={this.state.end}
              onOk={this.handleOk.bind(this)}
              onChange={this.handleChange.bind(this,'end')}
            >
              <Item arrow="horizontal">结束时间</Item>
            </DatePicker>
           <List.Item
            wrap
            extra={
              <div>
                <span className="cut" onClick={this.handleNumber.bind(this,'cut')}>-</span>
                  <em>{(this.state.val+"").substring(0,4)}</em>
                <span className="add" onClick={this.handleNumber.bind(this,'add')}>+</span>
              </div>}
          >
          请假时长
          </List.Item>
          <List.Item>
            <span>上传图片</span><div>  <ImagePicker
              title="图片"
              files={files?files:[]}
              onChange={this.onChange}
              onImageClick={(index, fs) => console.log(index, fs)}
         //     selectable={files.length < 5}
              onAddImageClick={this.onAddImageClick}
            ></ImagePicker></div>
          </List.Item>
            <TextareaItem
            {...getFieldProps('remark')}
            title="请假事由"
            placeholder="请输入请假事由"
            data-seed="logId"
            rows={2}
            autoHeight
          />
         </List>
         <div className="foot">
           <WingBlank>
              <Button className="submit" type="submit" onClick={()=>this.handleSubmit()}>提交</Button><WhiteSpace />
           </WingBlank>
         </div>
       
  		</div>
  	)
  }
}

const OwnLevel = createForm()(OwnLevelComponent);
export default OwnLevel;



// WEBPACK FOOTER //
// ./src/components/own/OwnLevel/Attend/index.js