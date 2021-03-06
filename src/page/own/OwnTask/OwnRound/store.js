import Reflux from 'reflux';
import actions from './actions';
import Mixins from 'libs/CommonStore';
export default Reflux.createStore({
	mixins:[Mixins],
	listenables:[actions],
	subData(data){
		let _this = this;
		this.ajaxPost('/api/leaveRecord/saveInfo',{...data},function(result) {
       	_this.trigger('saveRes',result);
    }); 
	}
})