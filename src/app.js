import React from 'react';
import ReactDOM from 'react-dom';
import RouterArr from 'router/index';
import 'lib-flexible/flexible.js';

// redux
import { Provider } from 'react-redux';
import store from './store/index';

// redux持久化
import { persistor } from './store/index';
import { PersistGate } from 'redux-persist/lib/integration/react';

// ajax请求
import api from './http/index';
React.$ajax = api;
React.store = store;

// 全局样式
require('style/app.less');

class App extends React.Component {
  render() {
    return (
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <RouterArr />
        </Provider>
      </PersistGate>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
