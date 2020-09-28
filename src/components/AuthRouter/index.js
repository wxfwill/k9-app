import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// import { menusAll } from '@/router/menusAll';

// 白名单权限
const myAuth = ['/newHome'];

// 跳转
function redirectTo(props) {
  let user = localStorage.getItem('token');
  // 只要用户没有登录，一律跳转到首页
  if (!user) {
    return <Redirect to="/login" />;
  } else {
    if (myAuth.indexOf(props.path) != -1) {
      return <Route {...props} />;
    } else if (props.path == '/') {
      return <Redirect to="/login" />;
    } else {
      return <Route {...props} />;
    }
  }
}

// 是否有权限
const AuthRouter = (props) => {
  // console.log(props);
  return redirectTo(props);
};

export default AuthRouter;
