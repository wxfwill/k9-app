import { SOCKET_LIST_NEWS_MSG, LOGIN_PASSWORD, USER_INFO, PASSWORD_DATA, USER_TOKEN } from '../actionTypes';

const initialzeState = {
  newLIst: [],
};

export default function accountReducer(state = initialzeState, action) {
  switch (action.type) {
    case SOCKET_LIST_NEWS_MSG:
      return {
        ...state,
        newLIst: action.newLIst,
      };
      break;
    default:
      return state;
      break;
  }
}
