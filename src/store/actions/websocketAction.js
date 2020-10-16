import { SOCKET_LIST_NEWS_MSG } from '../actionTypes';

export function saveSocketNewList(newLIst) {
  return {
    type: SOCKET_LIST_NEWS_MSG,
    newLIst,
  };
}
