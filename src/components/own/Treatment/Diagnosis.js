//警犬诊断
import React, { Component } from 'react';
import Header from 'components/common/Header';
import {  WhiteSpace,Accordion,Modal, Picker,Button,WingBlank,InputItem,DatePicker,List} from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment'; 
import Ajax from 'libs/ajax';

require ('style/fontawesome/font-awesome.less')
require("style/own/DogDiagnosis.less");


/**
 * 警犬诊断
 */
class DogDiagnosis extends Component {
    constructor(props){
        super(props);
   
        this.state = {
            diagnosisInfo:"",
            addDiagnosisModal:false,    //隐藏新增警犬诊断记录弹出框
            diseaseTypeArr: [{label: '无', value: 'no'}],
            perscriptionsArr: [],
            diseaseVal: "",
            treatmentVal: "",
            prescriptionsArr: [],
        }
        this.treatmentResultArr = [{label:'治愈',value: 1},{label:'未治愈',value: 2}];
       
        this.sendData = {
            morbidityTime: "",  //发病时间
            disease: "",  //疾病类型
            symptom: "",  //症状
            treatmentResults: "", //治疗结果
            prescriptions:"",//存在的记录  {drug: 21,times: 22,days: 1,purpose: 24}
            //veterinaryId: '',  // 当前用户的id
            prescriptionsDelIds: [],  //删除项id
            id: "",   //项id
            dogId: "", //狗id
        }
        this.drug = '';
        this.times = '';
        this.days = '';
        this.purpose = '';
    }

    getDiseaseInfo(id){
        Ajax.post('/api/treatmentRecord/getDetailById', {id:id}, (res) => { 
            if(res.code == 0){
                let diseaseInfo=res.data;
                this.setState ( {
                    diagnosisInfo:diseaseInfo,
                    addDiagnosisModal:false,    //隐藏新增警犬诊断记录弹出框
                //    diseaseTypeArr: [{label: '无', value: 'no'}],
                    perscriptionsArr: [],
                    diseaseVal: diseaseInfo.disease,
                    treatmentVal: diseaseInfo.treatmentResults,
                    prescriptionsArr: diseaseInfo.prescriptions,
                });
                this.treatmentResultArr = [{label:'治愈',value: 1},{label:'未治愈',value: 2}];
       
                this.sendData = {
                    morbidityTime: diseaseInfo.morbidityTime,  //发病时间
                    disease: diseaseInfo.disease,  //疾病类型
                    symptom: diseaseInfo.symptom,  //症状
                    treatmentResults: diseaseInfo.treatmentResults, //治疗结果
                    prescriptions: diseaseInfo.prescriptions,//存在的记录  {drug: 21,times: 22,days: 1,purpose: 24}
                    //veterinaryId: '',  // 当前用户的id
                    prescriptionsDelIds: [],  //删除项id
                    id: diseaseInfo.id,   //项id
                    dogId: diseaseInfo.dogId, //狗id
                }
            }
        });
    }

    componentDidMount() {
       
        Ajax.post('/api/basicData/diseaseType', {}, (res) => { 
            if(res.code == 0){
                let dataAtt = [];
                res.data.map((obj) => {
                    dataAtt.push({
                        label: obj.name,
                        value: obj.id
                    })
                })
                this.setState(function(prevState){
                    return {
                        diseaseTypeArr: prevState.diseaseTypeArr.concat(dataAtt)
                    }
                })
            }
        });
        if(this.props.history.location.query){
            let id=this.props.history.location.query;
            this.getDiseaseInfo(id);
        }


    }
    //确定提交
    sendInfo = () => {
        let data = this.sendData;
        if(!this.sendData.disease){
            util.toast('疾病类型为必填项！')
            return false;
        }
        if(!this.sendData.treatmentResults){
            util.toast('疾病类型为必填项！')
            return false;
        }
        
        Ajax.post('/api/treatmentRecord/updateOrSaveInfo', this.sendData, (res)=>{
            if(res.code == 0){
                const { history } = this.props;
                history.goBack();
            }
        })
    }
    onClickDiseaseType = (val) => {
        console.log(val)
        this.sendData.disease = val[0] != 'no' ? val[0] : '';
        this.setState({
            diseaseVal: this.sendData.disease
        })
    }
    onClickTreatment = (val) => {
        this.sendData.treatmentResults = val[0];
        this.setState({
            treatmentVal: this.sendData.disease
        })
    }
    /**
     * 新增加警犬诊断记录对话框
     */
    showDiagnosisRecordModal = (e) =>{
        this.setState({addDiagnosisModal:true});        
    }

    /**
     * 提交警犬诊断记录
     */
    submitDiagnosisRecord = (par) =>{
        if(!par){
            this.setState({addDiagnosisModal:false});
            return false;
        }
        if(!this.drug || !this.times || !this.days || !this.purpose){
            util.toast('有选项没填写！');
            return false;
        }
        this.setState({addDiagnosisModal:false});
        this.sendData.prescriptions.push({
            drug: this.drug,
            times: this.times,
            days: this.days,
            purpose: this.purpose
        })
        this.setState({
            prescriptionsArr: this.sendData.prescriptions
        })
        console.log(this.state.prescriptionsArr)
        this.drug = '';
        this.times = '';
        this.days = '';
        this.purpose = '';
        //{drug: 21,times: 22,days: 1,purpose: 24}
    }
    onChangeDate = (val) => {
        this.setState({
            oDate: val
        })
    }
    onChangeDrug = (val) => {      
        this.drug = val;
    }
    onChangeDays = (val) => {
        this.days = val;
    }
    onChangeTimes = (val) => {
        this.times = val;
    }
    onChangePurpose = (val) => {
        this.purpose = val;
    }

    render(){
        const { getFieldProps } = this.props.form;
        const {diagnosisInfo}=this.state;
        let prescriptionsArr = this.state.prescriptionsArr;
        return (
            <div className="own">
                <Header title={diagnosisInfo.dogName+"诊断"} pointer />
                <Button className="own-diagnosis-btn" type="primary" onClick={() => this.sendInfo()}>提交</Button>
                <div className="own-diagnosis-content">
                    {/*
                    <div className="diagnosis-item">
                        <div className="diagnosis-item-content">申请日期</div>
                        <div className="diagnosis-item-extra"><span>2018-05-05</span></div>     
                    </div>
                    */}
                    <WhiteSpace size="xs"/>
                    <div className="diagnosis-item">
                        <div className="diagnosis-item-content">申请日期</div>
                        <div className="diagnosis-item-extra"><span>{moment(diagnosisInfo.applyTime).format('YYYY-MM-DD')}</span></div>     
                    </div>
                    <WhiteSpace size="xs"/>
                    <div className="diagnosis-item">
                        <div className="diagnosis-item-content">发病日期</div>
                        <div className="diagnosis-item-extra"><span>{moment(diagnosisInfo.morbidityTime).format('YYYY-MM-DD')}</span></div>     
                    </div>
                    <WhiteSpace size="xs"/>
                    <div className="diagnosis-item">
                        <div className="diagnosis-item-content">训导员</div>
                        <div className="diagnosis-item-extra"><span>{diagnosisInfo.trainerName}</span></div>     
                    </div>
                    <WhiteSpace size="xs"/>
                    <div className="diagnosis-item">
                        <div className="diagnosis-item-content">警犬名称</div>
                        <div className="diagnosis-item-extra"><span>{diagnosisInfo.dogName}</span></div>     
                    </div>                     
                    <WhiteSpace size="xs"/>
                    <div className="diagnosis-item">
                        <div className="diagnosis-item-content">发病症状</div>
                        <div className="diagnosis-item-extra"><span>{diagnosisInfo.symptom}</span></div>     
                    </div> 
                    {/*<WhiteSpace size="xs"/>
                    <div className="diagnosis-item">
                        <div className="diagnosis-item-content">疾病类型</div>
                        <div className="diagnosis-item-extra"><span>请选择<i className="arrow-horizontal"></i></span></div>     
                    </div>*/}
                    <WhiteSpace size="xs"/>
                    <Picker 
                        data={this.state.diseaseTypeArr}
                        value={[this.sendData.disease]}
                        cols={1}
                        onOk={val => this.onClickDiseaseType(val)}
                    >
                        <List.Item arrow="horizontal">疾病类型</List.Item>
                    </Picker>
                    {/*
                    <WhiteSpace size="xs"/>
                    <div className="diagnosis-item">
                        <div className="diagnosis-item-content">治疗结果</div>
                        <div className="diagnosis-item-extra"><span>请选择<i className="arrow-horizontal"></i></span></div>     
                    </div>
                    */}
                    <WhiteSpace size="xs"/>
                    <Picker 
                        data={this.treatmentResultArr}
                        cols={1}
                        value={[this.sendData.treatmentResults]}
                        onChange={v => this.setState({ treatmentVal: v })}
                        onOk={val => this.onClickTreatment(val)}
                    >
                        <List.Item arrow="horizontal">治疗结果</List.Item>
                    </Picker>
                    <WhiteSpace size="xs"/>
                        <div className="diagnosis-item">
                            <div className="diagnosis-item-content" style={{fontWeight:900}}>新增治疗记录</div>
                            <div className="diagnosis-item-extra"><Button className="diag-add-record" onClick={() => this.showDiagnosisRecordModal()}>添加</Button></div>     
                        </div>
                        {prescriptionsArr.length > 0 ?
                        <Accordion className="own-diagnosis-accor">
                            {prescriptionsArr.map((obj, index) => {
                                return(
                                <Accordion.Panel key={index} header={"治疗记录"+(index+1)} className="pad">
                                    <div>
                                        {/*
                                        <div className="diagnosis-item">
                                            <div className="diagnosis-item-content">治疗日期</div>
                                            <div className="diagnosis-item-extra"><span></span></div>     
                                        </div>
                                        <WhiteSpace size="xs"/>
                                        */}
                                        <div className="diagnosis-item">
                                            <div className="diagnosis-item-content">药物或操作</div>
                                            <div className="diagnosis-item-extra"><span>{obj.drug}</span></div>     
                                        </div>
                                        <WhiteSpace size="xs"/>
                                        <div className="diagnosis-item">
                                            <div className="diagnosis-item-content">次数</div>
                                            <div className="diagnosis-item-extra"><span>{obj.times}</span></div>     
                                        </div>                     
                                        <WhiteSpace size="xs"/>
                                        <div className="diagnosis-item">
                                            <div className="diagnosis-item-content">用法</div>
                                            <div className="diagnosis-item-extra"><span>{obj.purpose}</span></div>     
                                        </div> 
                                        <WhiteSpace size="xs"/>
                                        <div className="diagnosis-item">
                                            <div className="diagnosis-item-content">天数</div>
                                            <div className="diagnosis-item-extra"><span>{obj.days}</span></div>     
                                        </div>
                                    </div>
                                </Accordion.Panel>
                                )
                            })}
                        </Accordion>
                        : ''
                        }
                </div>
                

                
                
                <Modal popup visible={this.state.addDiagnosisModal} animationType="slide-up">
                    <div className="diagnosis-modal-date">
                        <WingBlank>

                            {/*
                            <DatePicker
                                mode="date"
                                title="Select Date"
                                extra="选择时间"
                                value={this.state.date}
                                onChange={date => this.onChangeDate(date)}
                            >
                                <List.Item arrow="horizontal">治疗日期</List.Item>
                            </DatePicker>
                            */}
                            <InputItem
                                clear
                                placeholder="药物或操作"
                                onChange={val => this.onChangeDrug(val)}
                            >
                                药物或操作
                            </InputItem>
                            <InputItem
                                clear
                                placeholder="次数"
                                onChange={val => this.onChangeTimes(val)}
                            >
                                次数
                            </InputItem>
                            <InputItem
                                clear
                                placeholder="用法"
                                onChange={val => this.onChangePurpose(val)}
                            >
                                用法
                            </InputItem>
                            <InputItem
                                clear
                                placeholder="天数"
                                onChange={val => this.onChangeDays(val)}
                            >
                                天数
                            </InputItem>
                            <div className="diag-btn-box">
                                <Button inline className="diag-btn-cancel" onClick={ () => this.submitDiagnosisRecord()}>取消</Button>
                                <Button inline className="diag-btn-sure" type="primary" onClick={ () => this.submitDiagnosisRecord('sure')}>确定</Button>
                            </div>
                        </WingBlank>
                    </div>
                </Modal>


            </div>
        );

    }

}

const DogDiagnosisWrapper = createForm()(DogDiagnosis);
module.exports=DogDiagnosisWrapper;


// WEBPACK FOOTER //
// ./src/components/own/Treatment/Diagnosis.js