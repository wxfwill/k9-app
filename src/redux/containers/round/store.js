import Reflux from 'reflux';
import actions from './actions';
import Mixins from 'libs/CommonStore';
export default Reflux.createStore({
	mixins:[Mixins],
	listenables:[actions],
	onGetRound(id,date){
		var _this = this; 
		if(typeof date=='undefined'){
			date=''
		}
	    this.ajaxPost('/api/cmdMonitor/myPatrolsTask',{userId:id,startDate:date},function(result) {
	    	if(result.code==0){
	      		_this.trigger('roundList',result.data);	    		
	    	}
	    }); 
	}
})


// WEBPACK FOOTER //
// ./src/redux/containers/round/store.js