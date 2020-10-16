import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

import loginReducer from './reducers/loginReducer';
import socketReducer from './reducers/websocketReducer';

const rootReducer = combineReducers({
  loginReducer,
  socketReducer,
});

// redux持久化
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['loginReducer', 'socketReducer'], // 白名单
};

const myPersistReducer = persistReducer(persistConfig, rootReducer);

const initialzeSate = {};

const store = createStore(myPersistReducer, initialzeSate, composeEnhancers(applyMiddleware(...middleware)));
// const store = createStore(myPersistReducer, initialzeSate, applyMiddleware(...middleware));

export const persistor = persistStore(store);

export default store;
