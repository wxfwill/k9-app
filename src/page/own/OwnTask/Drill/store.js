import Reflux from 'reflux';
import actions from './actions';
import Mixins from 'libs/CommonStore';
export default Reflux.createStore({
	mixins:[Mixins],
	listenables:[actions],
	onToLogin(data){
		var _this = this; 
	    this.ajaxPost('/api/userCenter/loginApp',{...data},function(result) {
	       _this.trigger('loginMsg',result);
	    }); 
	}
})


// WEBPACK FOOTER //
// ./src/components/own/OwnTask/Drill/store.js