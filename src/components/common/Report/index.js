import React,{Component} from 'react';
import { withRouter } from "react-router-dom";
import { createForm } from 'rc-form';
import { List, Modal, Button, InputItem, TextareaItem, Icon, Popover } from 'antd-mobile';
import commonJs from 'libs/CommonStore';
import moment from 'moment';


require('./style.less');

const reportState = ['任务上报', '上报详情']
const approveStatusName = ['待审批', '已审批', '已拒绝']
const Item = Popover.Item;

//type 任务类型1训练2巡逻3紧急调配4网格搜捕5定点集合6外勤任务

class Report extends Component{
	constructor(props){
		super(props);
		this.state = {
			modalShow: false,
			reportDetail: {},
			commentList: [],
			commentListArr: {},
		}
		this.index = 0;
		this.palce = '';
		this.substation = '';
		this.remark = '';
	}
	requestReportInfo = (val, noFirst) => {
		let data = {
			dataId: val.id,
			type: val.type,
		}
		//日常巡逻列表传递的信息是上报信息的id，其他传递的信息是本身任务的id.
		if(this.props.type == 2){
			data = {
				id: val.id,
				type: val.type,
			}
		}
		commonJs.ajaxPost('/api/taskReport/taskReportInfo', data, result => {
		    if(result.code == 0){
		    	/*if(result.data.status == 0){
		    		if(this.props.type != 1 && !noFirst){
		    			this.requestReportList()
		    		}
				}*/
				if(this.props.type != 1 && !noFirst){
					this.requestReportList()
				}
		    	this.setState({
		    		id: result.data.id,
		    		reportDetail: result.data,
		    	})
		    }
	    })
	}
	requestReportList = () => {
		commonJs.ajaxPost('/api/taskReport/taskReportCommentList', {}, result => {
			if(result.code == 0){
		        this.setState({
		        	commentList: result.data
		        })
		    }
		})
	}
	sendReportData = () => {
		const { type } = this.props;
		let { commentListArr, id } = this.state;
		let arr = Object.values(commentListArr);
		let palce = this.palce;
		let substation = this.substation;
		let remark = this.remark;
		let hasNull = arr.some((item) => {
			return !item.commentId || !item.number || !item.commentName
		})
		if(type==6){
			if(!remark){
				util.toast('有选项为空！')
				return false;
			}
		}else{
			if(!palce || !substation || !remark || hasNull){
				util.toast('有选项为空！')
				return false;
			}
		}
		
		let data = {
			palce,
			substation,
			remark,
			status: 1,
			id: id,
			commentList: arr
		}
		commonJs.ajaxPost('/api/taskReport/saveInfo', data, result => {
			if(result.code == 0){
				const { type, id } = this.props;
				this.requestReportInfo({id, type}, true);
		        this.onClose();
		    }
		})
	}
	placeChange = (val) => {
		this.palce = val;
	}
	substationChange = (val) => {
		this.substation = val;
	}
	remarkChange = (val) => {
		this.remark = val;
	}
	onOpen = () => {
		this.setState({
			modalShow: true
		})
	}
	onClose = () => {
		this.setState({
			modalShow: false,
			commentListArr: {}
		})
		this.palce = '';
		this.substation = '';
		this.remark = '';
		this.index = 0;
	}
	delOption = (index) => {
		let { commentListArr } = this.state;
		delete commentListArr[index];
		this.setState({
			commentListArr
		})
	}
	addObject = () => {
		let { commentListArr } = this.state;
		commentListArr[this.index] = {
			commentId: '',
			number: '',
			commentName: ''
		}
		this.setState({
			commentListArr: commentListArr
		})
		this.index++
	}
	onSelect = (data) => {
		let index = data.props['data-seed'];
		let { commentListArr } = this.state;
		for (let countryObj in commentListArr) {
			console.log(commentListArr[countryObj]);
			if(data.key==commentListArr[countryObj].commentId){
				util.toast('不能重复添加！')
				return;
			}
		}
		this.setState((prevState) => {
			prevState.commentListArr[index].commentId = data.key;
			prevState.commentListArr[index].commentName = data.props.value;
			return {
				commentListArr: prevState.commentListArr,
				visible: false,
			}
		})
	}
	inputChange = (val, index) => {
		this.setState((prevState) => {
			prevState.commentListArr[index].number = val;
			return {
				commentListArr: prevState.commentListArr,
			}
		})
	}
	chooseNameCont = (keys, data) => {
		let arr = [];
		data.map((item) => {
			arr.push(<Item key={item.id} data-seed={keys} value={item.commentName}>{item.commentName}</Item>)
		})
		return arr;
	}
	chooseName = (keys, obj) => {
		return (
			<Popover mask
	            overlayClassName="fortest"
	            overlayStyle={{ color: 'currentColor' }}
	            visible={this.state.visible}
	            placement='topLeft'
	            overlay={this.chooseNameCont(keys, this.state.commentList)}
	            align={{
	              overflow: { adjustY: 0, adjustX: 0 },
	              offset: [10, 15],
	            }}
	            onSelect={this.onSelect}
	          >
	            <div className="name">
					<span>{obj.commentName || '项目名称'}</span>
					<Icon className="icon" type="down" size="xs" />
				</div>
          	</Popover>
		)
	}
	componentWillMount(){
		const { type, id } = this.props;
		if(id && type){
			this.requestReportInfo({id, type});
		}
	}
	render(){
		const { getFieldProps, getFieldDecorator, getFieldError } = this.props.form;
		const { type } = this.props;
		const { modalShow, reportDetail, commentListArr } = this.state;
		let stateNum = reportDetail.status > 0 ? 1 : 0;
		return(
			<div className="report-box">
				<Button type="primary" inline size="small" onClick={this.onOpen}>{reportState[stateNum]}</Button>
				<Modal
					className="report-modal"
					popup
					animationType="slide-up"
					visible={modalShow}
					onClose={this.onClose}
				>
					<div className="modal-content">
						{reportDetail.status == 0 ?
							<List renderHeader={() => <div>任务上报</div>}>
							{
									type != 6 ?
							<div>	<InputItem
									type="text"
									placeholder="请输入查缉区域"
									onChange={this.placeChange}
								>
									查缉区域
								</InputItem>
								<InputItem
									onChange={this.substationChange}
									placeholder="请输入分局名称"
								>
									分局名称
								</InputItem></div>
							:
								null
							}
								{
									type != 6 ?
									<div className="add-box">
										<span className="name">添加项目名及人数</span>
							        	<div className="btn" onClick={this.addObject}>添加</div>
							        </div>
							        :
							        null
								}
								{	
									Object.entries(commentListArr).map( (item) => {
										return (
											<InputItem
												key={'comment'+item[0]}
												className="list"
												type="number"
												placeholder="请输入人数"
												onChange={(v) => this.inputChange(v, item[0])}
											>
												{this.chooseName(item[0],item[1])}
												<Icon className="close-icon" type="cross" size="sm" onClick={() => this.delOption(item[0])} />
											</InputItem>
										)
									})
								}
								
								<TextareaItem
									onChange={this.remarkChange}
						            title="任务反馈"
						            autoHeight
						            labelNumber={5}
						            placeholder="请输入任务反馈"
						        />
							</List>
							:
							<List renderHeader={() => <div>上报详情</div>}>
								{/*reportDetail.applys && reportDetail.applys.map((item) => {
									return (
									<div>
										<InputItem
											disabled={true}
											defaultValue={item.approveStatus >= 0 ? approveStatusName[item.approveStatus] : ''}
										>
											审批状态
										</InputItem>
										{
											item.approveUserName ?
											<InputItem
												disabled={true}
												defaultValue={item.approveUserName}
											>
												审批人员
											</InputItem>
											:null
										}
										{
											item.approveStatus > 0 ?
											<InputItem
												disabled={true}
												defaultValue={moment(item.chgDate).format('YYYY-MM-DD HH:mm:ss')}
											>
												审批时间
											</InputItem>
											:null
										}
										{item.approveComment ?
											<TextareaItem
									            title="审批意见"
									            autoHeight
									            disabled={true}
									            labelNumber={5}
									            defaultValue={item.approveComment}
									        />
									        :null
										}
									</div>
									)
								})*/}
							{ type != 6 ?<div><InputItem
									disabled={true}
									defaultValue={reportDetail.palce || ''}
								>
									查缉区域
								</InputItem>
								<InputItem
									disabled={true}
									defaultValue={reportDetail.substation || ''}
								>
									分局名称
								</InputItem>
								{reportDetail.commentList && reportDetail.commentList.map((item,index) => 
									<InputItem
										key={'detail'+index}
										disabled={true}
										defaultValue={item.number}
									>
										{item.commentName}
									</InputItem>
								)}</div>:null
							}
								<TextareaItem
						            title="任务反馈"
						            autoHeight
						            disabled={true}
						            labelNumber={5}
						            defaultValue={reportDetail.remark || ''}
						        />
							</List>
						}
						
					</div>
					<div className="modal-footer">
						<div className="cancel" onClick={this.onClose}>取消</div>
						{reportDetail.status == 0 &&
							<div className="sure" onClick={this.sendReportData}>确定</div>
						}
					</div>
				</Modal>
			</div>
		)
	}
}

export default createForm()(Report);


// WEBPACK FOOTER //
// ./src/components/common/Report/index.js