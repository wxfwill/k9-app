import { LOGIN_ACCOUNT, LOGIN_PASSWORD, USER_INFO, PASSWORD_DATA } from "../actionTypes";

const initialzeState = {
  isRemeber: true,
  isPass: false,
  password: "",
  userInfo: "",
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
    default:
      return state;
      break;
  }
}
