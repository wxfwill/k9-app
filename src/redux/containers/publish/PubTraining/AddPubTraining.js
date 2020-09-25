import React,{Component} from 'react';
import { List , Picker ,DatePicker,TextareaItem ,InputItem,Stepper,WhiteSpace, WingBlank,Button,Toast,Calendar,Modal,Icon} from 'antd-mobile';
import Reflux from 'reflux';
import { createForm } from 'rc-form';
import ReactMixin from 'react-mixin';
import Header from 'components/common/Header';
import PeopleBox from 'components/common/CheckBox';
import enUS from 'antd-mobile/lib/calendar/locale/en_US';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import PubTrainingMap from './PubTrainingMap';
//import Store from './store';
//import Actions from './actions';
import { withRouter,Link } from "react-router-dom";
import moment from 'moment';
import Ajax from 'libs/ajax';
require('style/publish/pubTraining.less');
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

const placeTypeData = [
  
  {
    label: '基地内',
    value: 1,
  },
  {
    label: '基地外',
    value: 2,
  },

];

class AddPubTrainingComponent extends Component{
  constructor(props){
    super(props);
    this.state={
      start:now,
      end:now,
      trainDate: null,
      dutyInfo:'',
      hasError: false,
      value: '',
      val: 1,   
      isMap:false,
      PeopleList:[],
      selectedName:[],
      selectedId:[],
      typeOption:[],
      typeId:'',
      id:'',
      placeId:'',
      placeType:'',
      placeList:[],
      trainInfo:null,
      disabled: false,
      reportArr: [],
      reportUserId: '',
    }
    this.timer = null;
    this.isRequest = false;
  }
 

  componentDidMount() {
    
   
    // this.timer = setInterval(  this.getUserLocation, 3000)
    Ajax.post('/api/trainingSubject/getAllTrainSubjectName', {
    //     id: this.props.location.query.id
       }, (res) => {
          if(res.code == 0){
            if(this.props.location.query){
              let trainInfo=this.props.location.query
              const typeOption = res.data && res.data.map((t) =>  {
                return {value:  t.id, label: t.name, id: t.id}
              })
             
              this.setState({
                trainInfo:trainInfo.id!==''?trainInfo:null,
                startTime:trainInfo.trainTime,
                selectedId:trainInfo.userIds&&trainInfo.userIds.split(","),
                placeType:trainInfo.placeType,
                typeId:trainInfo.subjectId,
                placeId:trainInfo.placeId,
                id:trainInfo.id,
                reportName: trainInfo.reportName,
                selectedName:trainInfo.userNames,
                trainDate:trainInfo.trainDate?new Date(trainInfo.trainDate):null,
                typeOption:typeOption,
                saveStatus: trainInfo.saveStatus,
                disabled:trainInfo.saveStatus==1?true:false
              });
            }
          }else{
            Toast.info(res.msg);
            return ;
          }
       });
    this.getPlaceList();
    this.getPeople();
  }
  getPeople =() =>{
    Ajax.post('/api/userCenter/getCombatStaff', {
        //     id: this.props.location.query.id
           }, (res) => {
               if(res.code == 0){
                let {selectedId} = this.state;
                if(selectedId){
                  res.data.map((item)=>{
                    selectedId.map((r)=>{
                       if(r==item.id){
                         item.remark=true;
                       }
                     })
                  })
                }
                 this.setState({
                    PeopleList:res.data,
                 });
               }else{
                   Toast.info(res.msg);
                   return ;
               }
           });
  }

  //基地内场地信息
  getPlaceList =() =>{
    Ajax.post('/api/train/listAllTrainPlace', {
        //     id: this.props.location.query.id
           }, (res) => {
               if(res.code == 0){
                const placeList = res.data && res.data.map((t) =>  {
                  return {value:  t.id, label: t.name, id: t.id}
                })
  
                 this.setState({
                  placeList:placeList,
                 });
               }else{
                   Toast.info(res.msg);
                   return ;
               }
           });
  }

  submit = () => {
    if(this.isRequest){
      return false;
    }
    let errObj = '';
  	
    this.props.form.validateFields((error, value) => {
  /*    if(!this.state.reportUserId){
        Toast.info('有选项为空！')
        return false;
      }*/ 
      let params={
        subjectId: this.state.typeId,
        id:this.state.id,
        placeType:this.state.placeType,
        placeId:this.state.placeId,
        trainDate: this.state.trainDate,
        remark: value.remark,
        userIds:  this.state.selectedId.join(','),
 //       reportUserId: this.state.reportUserId
       }
       if(this.state.placeType==2){
        params.drawShapeDTO = this.state.trainInfo.drawShapeDTO;//在基地内没有这个地图信息！
        params.location = this.state.trainInfo.location;
       }
        if (!error) {
            
            this.isRequest = true;
            Ajax.post('/api/train/publishPlan', params, (res) => {
                   if(res.code == 0){
                        this.isRequest = false;
                        let { history }  = this.props;
                        Toast.info("发布成功！");
                        history.goBack();
                   }else{
                      this.isRequest = false;
                      Toast.info(res.msg);
                      return ;
                   }
               });
          } else {
            let data = {};
            errObj = error;
            for(let key in value){
              data[key] = value[key];
            }

            if(errObj || this.state.selectedId  || (this.state.trainInfo&&this.state.trainInfo.location=='')){
              Toast.info('有选项为空！')
            }

            console.log(error);
          }


     
    });
  }
  sendReport(val, backCall){
      let user = JSON.parse(sessionStorage.getItem('user'));
      let taskName = this.state.typeOption.find((item) => item.value == this.state.typeId);
      let data = {
        type: 1, //任务类型1训练2巡逻3紧急调配4网格搜捕5定点集合6外勤任务
        dataId: val.id,
        taskName: taskName.label,
        userId: this.state.reportUserId,
        approveUserId: user.id
      }
      Ajax.post('/api/taskReport/saveInfo', data, (result) => {
        if(result.code == 0){
          backCall && backCall(result)
        }else{
          util.toast('选定上报人员失败失败！')
        }
      })
  }

  onClose = key => {
    this.setState({
      [key]: false
    })
  }

  handleCancel = (e) => {
    this.setState({
      isMap: false
    });
  }

  addCoord() {
    this.setState({ isMap: true });
  }
 
  clickOk(data){

    let names=[];
    let ids=[];
    let reportArr = [];
    data.forEach(element => {
        names.push(element.name);
        ids.push(element.id);
        reportArr.push({label: element.name, value: element.id})
    });
    this.setState({
      reportUserId: '',
      reportArr: reportArr,
      chooseMembArr: data,
      selectedName:names.join(','),
      selectedId:ids
    })
  }

  getMapInfo(data){

      if(typeof this.props.location.query !='undefined' && this.props.location.query.id!==''){
        let trainInfo=this.state.trainInfo;
        trainInfo.drawShapeDTO=data.drawShapeDTO;
        trainInfo.location=data.location;
        this.setState({
          trainInfo:trainInfo
        })
      }else{
        this.setState({
          trainInfo:data
        })
      }
    
  }
  handleChange(time) {
		this.setState({
			trainDate: time,
		})
	}
	handleOk(){
    
  }
  changeReport = (data) => {

      this.setState({
        reportUserId: data[0]
      })
  }
    

  changePeo = (value) => {

      this.setState({
        typeId: value[0],
    })
  }

  changePlaceType = (value) => {

    this.setState({
      placeType: value[0],
  })
}

changePlaceId = (value) => {

  this.setState({
    placeId: value[0],
})
}
  
  render(){
    const { getFieldProps } = this.props.form;
  	return(
  		<div className="add-content">
        <Header title="发布训练计划" pointer='pointer' pointer noColor/>
        <div className="list-box">
          <List className="list">
            <Picker data={this.state.typeOption}  
                placeholder="请选择训练科目"
                disabled={this.state.disabled}
                cols={1}
                {...getFieldProps('subjectName',{
				    			initialValue: this.state.trainInfo?[this.state.trainInfo.subjectId]:'',
                  rules: [{ required: true, message: '训练科目不能为空！' }]
				    		})}
                className="forss"
                onOk={(value) => this.changePeo(value)}>
              <List.Item arrow="horizontal"><i className="tips">*</i>训练科目</List.Item>
            </Picker>
          </List>
          <List className="list">
            <DatePicker
              {...getFieldProps('trainDate',{
                  initialValue:this.state.trainDate,
                            rules: [{ required: true, message: '选择日期不能为空！' }]
                })}
                  mode="date"
                  disabled={this.state.disabled}
                  title="选择日期"
                  value={this.state.trainDate}
                  onOk={this.handleOk.bind(this)}
                  onChange={this.handleChange.bind(this)}
              >
                  <Item arrow="horizontal"><i className="tips">*</i>开始时间</Item>
              </DatePicker> 
          </List>
          <List className="list">
            <Picker data={placeTypeData}  
                placeholder="请选择场地类型"
                disabled={this.state.disabled}
                cols={1}
                {...getFieldProps('placeType',{
				    			initialValue: this.state.trainInfo?[this.state.trainInfo.placeType]:'',
                  rules: [{ required: true, message: '场地类型不能为空！' }]
				    		})}
                className="forss"
                onOk={(value) => this.changePlaceType(value)}>
              <List.Item arrow="horizontal"><i className="tips">*</i>场地类型</List.Item>
            </Picker>
          </List>
          {this.state.placeType==2?
          <List className="list dress-choose-list">
            <InputItem
              {...getFieldProps('location',{
  				    			initialValue:this.state.trainInfo?this.state.trainInfo.location:'',
                    rules: [{ required: true, message: '训练地点不能为空！' }]
  				    		})}
                title="巡逻地点"
                editable={false}
                //  disabled={this.state.disabled}
                clear
              placeholder="请选择训练地点"
            >
              <i className="tips">*</i>训练地点
              <i className="icon" onClick={this.addCoord.bind(this)}>{this.state.disabled ? '查看' : '添加' }</i>
            </InputItem>
          </List>:null}
          {this.state.placeType==1?
            <List className="list">
              <Picker data={this.state.placeList}  
                  placeholder="请选择训练地点"
                  disabled={this.state.disabled}
                  cols={1}
                  {...getFieldProps('placeId',{
                    initialValue: this.state.trainInfo?[this.state.trainInfo.placeId]:'',
                    rules: [{ required: true, message: '训练地点不能为空！' }]
                  })}
                  className="forss"
                  onOk={(value) => this.changePlaceId(value)}>
                <List.Item arrow="horizontal"><i className="tips">*</i>巡逻地点</List.Item>
              </Picker>
            </List>:null}
          <List className="list">
           {this.state.disabled ?  <InputItem
            title="训练人员"
            {...getFieldProps('selectedName',{
				    			initialValue:this.state.selectedName,
				    		})}
            disabled={this.state.disabled}
          ><i className="tips">*</i>训练人员</InputItem>:
            <PeopleBox
                title="训练人员"
                initTip="请选择队员"     
                searchTip="请输入查询内容"   
                disabled={this.state.disabled}
                clickOk = {(data) => this.clickOk(data)} 
                dataList={this.state.PeopleList}
                showValue={this.state.selectedName}
                useDefaultDom={true}
            />}
          </List>
          {/*!this.state.disabled ?
            <List className="list">
              <Picker data={this.state.reportArr}  
                      placeholder="请选择上报人员"
                      cols={1}
                      value={[this.state.reportUserId]}
                      className="forss"
                      onOk={(value) => this.changeReport(value)}>
                      <List.Item arrow="horizontal"><i className="tips">*</i>上报人员</List.Item>
                  </Picker>
            </List>
            :
            <div className="list pointer-list list-disable">
              <div className="name"><i className="tips">*</i>上报人员</div>
              <div className="cont">
              {
                this.state.trainInfo.reportUserName ? this.state.trainInfo.reportUserName : '----'
              }
              </div>
            </div>
          */}
          <List className="list">
            <TextareaItem
            title={<span><i className="tips">*</i>训练说明</span>}
            autoHeight='true'
            clear
            disabled={this.state.disabled}
            {...getFieldProps('remark',{
                  initialValue: this.state.trainInfo?this.state.trainInfo.remark:'',
                  rules: [{ required: true, message: '训练说明不能为空！' }]
				    		})}
            placeholder="请输入训练说明"
          />
          </List>
        </div>
        { !this.state.disabled ? 
          <div className="btn-box">
            <button className="clear" style={{display:'none'}}>清空</button>
            <button className="publish" onClick={this.submit}>发布</button>
          </div>
          :
          null
        }
        {
          this.state.saveStatus == 0 ? 
          <div className="btn-box only-btn">
            <button className="publish" onClick={this.submit}>发布</button>
          </div>
          : null
        }
    
        {this.state.isMap ? <PubTrainingMap
          isMap={this.state.isMap}
          trainInfo={this.state.trainInfo}
         // handleShow={this.handleShow.bind(this)}
          onMapData={(data)=>this.getMapInfo(data)}
          onCancel={this.handleCancel}
          onCreate={this.handleCoo}
        /> : null}
  		</div>
  	)
  }
}
//ReactMixin.onClass(AddPubRoundComponent,Reflux.listenTo(Store, 'onChange'));
const AddPubTraining = createForm()(AddPubTrainingComponent);
export default withRouter(AddPubTraining);














// WEBPACK FOOTER //
// ./src/redux/containers/publish/PubTraining/AddPubTraining.js