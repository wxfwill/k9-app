import Reflux from 'reflux';
import actions from './actions';
import Mixins from 'libs/CommonStore';
export default Reflux.createStore({
	mixins:[Mixins],
	listenables:[actions],
	onGetUserData(id){
		var _this = this; 
    this.ajaxPost('/api/cmdMonitor/myGridSearchTask',{userId:id},function(result) {
    		if(result.code==0){
    			_this.trigger('userData',result.data);
    		}
    }); 
	}
})


// WEBPACK FOOTER //
// ./src/redux/containers/fight/store.js