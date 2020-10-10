import { LOGIN_ACCOUNT, LOGIN_PASSWORD, USER_INFO, PASSWORD_DATA, USER_TOKEN } from '../actionTypes';

const initialzeState = {
  isRemeber: true,
  isPass: false,
  password: '',
  userInfo: '',
  token: null,
};

export default function accountReducer(state = initialzeState, action) {
  switch (action.type) {
    case LOGIN_ACCOUNT:
      return {
        ...state,
        isRemeber: !state.isRemeber,
      };
      break;
    case LOGIN_PASSWORD:
      return {
        ...state,
        isPass: !state.isPass,
      };
      break;
    case USER_INFO:
      return {
        ...state,
        userInfo: action.userInfo,
      };
      break;
    case PASSWORD_DATA:
      return {
        ...state,
        password: action.pass,
      };
      break;
    case USER_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    default:
      return state;
      break;
  }
}
