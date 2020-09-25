import React,{Component} from 'react';
import { withRouter ,Link } from "react-router-dom";
import { List} from 'antd-mobile';
import moment from 'moment';

const Item = List.Item;
const Brief = Item.Brief;
const ownPic = require('images/others.png');

class ContentList extends Component{
	constructor(props){
		super(props);
	}
	goDetail(item) {
		console.log(item)
		if(item.status == 3){
			return ;
		}
		const { history } = this.props;
    	const {area, referencePoint, taskName, taskDetailId, taskType, status} = item;
    	history.push({pathname:'/round/map', query:{area, referencePoint, taskDetailId, taskType, taskName, status} })
	}
	render(){
		let { contList } = this.props;
		console.log(contList)
		return (
			<List className="grid-search-list">
            {
            	contList.length > 0 ?
                	contList.map((item, index) => {
	                    return(
	                      <Item
	                        key={'list'+index}
	                        multipleLine
	                        arrow="horizontal"
	                        onClick={this.goDetail(item).bind(this)}
	                      >
	                        {item.taskName}
	                        <Brief>
	                          {moment(item.planStartTime).format('YYYY-MM-DD HH:mm')}
	                          <img src={ownPic} alt="pic" />
	                        </Brief>
	                      </Item>
	                    )
                  	})
            	: <div className="own-noinfo">暂无数据</div>
        	}
        	</List>
        )
    
	}
}
export default withRouter(ContentList);