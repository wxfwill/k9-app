/*
 * title="参与队员"     //行小标题
 *	initTip="请选择队员"      //普通placeholder
 *	searchTip="请输入查询内容"    //搜索输入框placeholder
 *	clickOk = {(data) => this.clickOk(data)} //点击确定
 *	dataList=[]  总数组
 *	initList=[]  初始选中的数组
 *  showValue = '' 显示值
 *  disabled   bool
 *  useDefaultDom  使用默认的显示列表 bool 默认为true 此时可以带title 和 initTip
 *
 *
*/
import React,{Component} from 'react';
import { withRouter } from "react-router-dom";
import { List, SearchBar, Modal, Checkbox } from 'antd-mobile';

require('./style.less');

const CheckboxItem = Checkbox.CheckboxItem;

class Choose extends Component{
	constructor(props){
		super(props);
		this.state = {
			modalShow: false,
			allList: [],
			masterList: [],
			disabled: false,
			useDefaultDom: true
		}
	}
	onOk(){
		this.setState({
			modalShow: false
		})
		let selectedArr = [];
		this.state.allList.map((item) => {
			item.remark && selectedArr.push(item)
		})
		this.props.clickOk && this.props.clickOk(selectedArr);
	}
	chooseShow(){
		if(this.state.disabled){
			return false;
		}
		this.setState({
			modalShow: true
		})
		this.props.chooseShow && this.props.chooseShow();
	}
	selectOption = (data) => {
		data.remark = !data.remark;
	}
	inputChange = (val) => {
		if(!val){
			this.setState({
				masterList: this.state.allList
			})
			return false;
		}
		let arr = [];
		this.state.allList.map((item) => {
			item.name.indexOf(val) > -1 ? arr.push(item) : ''
		})
		this.setState({
			masterList: arr
		})
	}
	searchCancel = () => {
		this.setState({
			masterList: this.state.allList
		})
	}
	componentWillReceiveProps(props){
		if(Array.isArray(props.dataList)){
			this.setState({
				allList: props.dataList,
				masterList: props.dataList,
				useDefaultDom: props.useDefaultDom,
				disabled: props.disabled
			})
		}
		
	}
	componentDidMount() {
		this.setState({
			disabled: this.props.disabled,
			useDefaultDom: this.props.disabled
		})
	}
	render(){
		const { masterList, disabled } = this.state;
		const { title, initTip, searchTip, showValue, useDefaultDom} = this.props;
		return(
			<div>
				{useDefaultDom ?
					<div className={`list choose-list ${disabled ? 'list-disable' : ''}`}>
				    	<div className="left">
				    		<span><i className="tips">*</i>{title ? `${title}` : '标题项'}</span>
				    	</div>
				    	<div className="right">
				    		{showValue?
				    			showValue
				    		: <span>{initTip ? `${initTip}` : ''}</span>
				    		}
				    	</div>
				    	{
				    		disabled ? '' :
				    		<div className="icon" onClick={() => this.chooseShow()}>添加</div>
				    	}
				    	
				    </div>
				: null
				}
				<Modal
					className="choose-modal"
					visible={this.state.modalShow}
					animationType="slide-up"
				>
					<div className="choose-box">
						<List>
							<SearchBar
						        placeholder={searchTip ? `${searchTip}` : "search"}
						        onChange={(val) => this.inputChange(val)}
						        onCancel={() => this.searchCancel()}
						    />
						</List>
						<div className="content">
							<List className="choose-list-box">
								{masterList.length ?
									masterList.map((item, index) => {
										return(
											<CheckboxItem 
												key={`item${index}`} 
												onChange={() => this.selectOption(item)}
												defaultChecked={!!item.remark}
											>
									            {item.name}
									        </CheckboxItem>
										)
									})
								: <div style={{textAlign:'center',lineHeight:'28px',color:'#999999'}}>没有更多数据</div>
								}
							</List>
						</div>
						<div className="btn-box">
							<div className="cancel"  onClick={() => this.onOk()}>取消</div>
							<div className="sure" onClick={() => this.onOk()}>确定</div>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}


export default withRouter(Choose);


// WEBPACK FOOTER //
// ./src/components/common/CheckBox/index.js