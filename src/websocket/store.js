import { createStore } from 'redux';
import Socket from './websocket';

const reducer = (state = {}, action) => {
  if (action.type === 'websocket') {
    state.ws = new Socket((data) => {
      sessionStorage.setItem('socketData', data);
    });
  }
  return state;
};

let store = createStore(reducer);

export default store;
