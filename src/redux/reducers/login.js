import { LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_CFGS } from "constants/LoginStatus";

const initialState = {
  type: "normal",
  isLogin: false,
  text: "请输入用户信息！",
  user: null,
};
export default function login(state = initialState, action) {
  console.log("action");
  console.log(action);
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        type: "success",
        isLogin: true,
        text: "登录成功！",
        user: {
          ...action.user,
        },
      };
    case LOGIN_CFGS:
      return {
        type: "cfgs",
        data: action.data,
      };
    case LOGIN_ERROR:
      return {
        type: "error",
        isLogin: false,
        text: action.text,
      };
    default:
      return state;
  }
}

// WEBPACK FOOTER //
// ./src/redux/reducers/login.js
