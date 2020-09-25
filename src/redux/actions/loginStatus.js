import * as types from 'constants/LoginStatus';


export const success = (user) =>({type:types.LOGIN_SUCCESS,user});
export const error = (text) => ({type:types.LOGIN_ERROR,text});



// WEBPACK FOOTER //
// ./src/redux/actions/loginStatus.js