import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'router/index';
process.env.NODE_ENV == 'development' && require('mock/mockData.js');
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

// 全局样式
require('normalize.css');
require('style/app.less');
import 'antd-mobile/dist/antd-mobile.less';

class App extends React.Component {
  render() {
    return (
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <Router />
        </Provider>
      </PersistGate>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
