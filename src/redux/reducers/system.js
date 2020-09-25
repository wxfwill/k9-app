import { SIDER_UNFOLD, SOCKET_ON, SOCKET_LEAVE_HOME, NEW_SOCKET} from 'constants/systomStatus';


export default function system(state,action){
	switch(action.type){
		case SIDER_UNFOLD:
			return {
				collapsed:action.state
		  }
		case NEW_SOCKET: 
		  return {
			  socketMsg: action.socketMsg ||{},
		  }
		default:
      return {
				collapsed:false
		  }
	}
}



// WEBPACK FOOTER //
// ./src/redux/reducers/system.js