import Reflux from 'reflux';
import actions from './actions';
import Mixins from 'libs/CommonStore';
export default Reflux.createStore({
	mixins:[Mixins],
	listenables:[actions],
	onToLogin(data){
		
	}
})


// WEBPACK FOOTER //
// ./src/components/own/store.js