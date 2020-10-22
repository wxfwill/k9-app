import React,{Component} from 'react';
import { List , Picker ,DatePicker,TextareaItem ,InputItem,Stepper,WhiteSpace, WingBlank,Button,Toast,ImagePicker} from 'antd-mobile';
import commonJs from 'libs/CommonStore';
import { createForm } from 'rc-form';
import Header from 'components/common/Header';
import { withRouter,Link } from "react-router-dom";
import moment from 'moment';
import Ajax from 'libs/ajax';
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
   
}

  handleSubmit(){
  
    const { history } = this.props;
    if(this.state.files==null || this.state.files.length<=0){
      failToast('请补全信息！');
      return;
    }
    let formData = new FormData();
    for(let key in this.state.files){
      formData.append("files", this.state.files[key].file);
    }    
    this.props.form.validateFields((error) => {
      if (!error) {
        let isReturn = true;
        let subData = this.props.form.getFieldsValue();
        Object.keys(subData).forEach((item,index)=>{
          if(typeof subData[item]=='undefined'){
              failToast('请补全信息！');
              isReturn = false;
          };
        })
        if(!isReturn){return false};
        formData.append('content',subData.remark);
        let _this = this
        commonJs.ajaxFile('post','/api/attendance/saveRec',formData,function(result) {
           if(result.code == 0){
              let { history }  = _this.props;
              Toast.info("提交成功!");
              history.goBack();
            }else{
                Toast.info(result.msg);
                return ;
            }
        }); 
      } else {
        console.log(error);
      }
    });
  }
  onChange = (files, type, index) => {
    this.setState({
      files,
    });
  };

  render(){
    const { getFieldProps } = this.props.form;
    let {files} = this.state;
  	return(
  		<div className="OwnLevel" >
      
        <Header title="点名"  pointer='pointer'/>
        <List style={{ backgroundColor: 'white' }} className="date-picker-list">
          <List.Item>
            <div> <span>上传图片</span> <ImagePicker
              title="图片"
              files={files?files:[]}
              onChange={this.onChange}
              onImageClick={(index, fs) => console.log(index, fs)}
         //     selectable={files.length < 5}
              onAddImageClick={this.onAddImageClick}
            > <span>上传图片</span></ImagePicker></div>
          </List.Item>
            <TextareaItem
            {...getFieldProps('remark')}
            title="详情"
            placeholder="请输入详情"
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
// ./src/components/own/Call/AddCall.js