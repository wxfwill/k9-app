import { createStore } from 'redux';
import Socket from './websocket';

const reducer = (state, action) => {
  if (action.type) {
    state = new Socket(() => {
      console.log(action);
    });
  }
  return state;
};

let store = createStore(reducer);

export default store;
