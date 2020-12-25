import { LOGIN_ACCOUNT, LOGIN_PASSWORD, USER_INFO, PASSWORD_DATA, USER_TOKEN, APP_BUTTON_LIST } from '../actionTypes';

export function saveAccount() {
  return {
    type: LOGIN_ACCOUNT,
  };
}

export function savePassword() {
  return {
    type: LOGIN_PASSWORD,
  };
}

export function savePasswordData(pass) {
  return {
    type: PASSWORD_DATA,
    pass,
  };
}

export function saveUserInfo(userInfo) {
  return {
    type: USER_INFO,
    userInfo,
  };
}

export function saveToken(token) {
  return {
    type: USER_TOKEN,
    token,
  };
}

// app底部列表
export function saveAPPList(list) {
  return {
    type: APP_BUTTON_LIST,
    list,
  };
}
