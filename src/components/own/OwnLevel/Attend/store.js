import Reflux from 'reflux';
import actions from './actions';
import Mixins from 'libs/CommonStore';
export default Reflux.createStore({
	mixins:[Mixins],
	listenables:[actions],
	onGetData(data){
		console.log(data);
		let _this = this;
		this.ajaxPost('/api/leaveRecord/appCalendarListInfo',{...data},function(result) {
       	_this.trigger('leaveMsg',result);
    }); 
	},
	onMarkDate(data){
		let _this = this;
		this.ajaxPost('/api/leaveRecord/appCalendarList',{...data},function(result) {
			if(result.code==0){
				_this.trigger('markMsg',result.data);
			}
    });
	}
})