import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { routes } from './routers';
import { connect } from 'react-redux';
// 路由配置
class Router extends Component {
  constructor(props) {
    super(props);
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    let token = this.props.token;
    return (
      <HashRouter basename="/k9-app">
        <div className="app">
          <Switch>
            {routes.map((item, index) => {
              return (
                <Route
                  key={index}
                  path={item.path}
                  exact
                  render={(props) => {
                    if (!item.auth) {
                      return item.path == '/' ? <Redirect to="/login" /> : <item.component {...props} />;
                    } else {
                      return token ? <item.component {...props} /> : <Redirect to="/login" />;
                    }
                  }}
                />
              );
            })}
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

function loginStateToProps(state) {
  return {
    token: state.loginReducer.token,
  };
}

const loginActionToProps = (dispatch) => ({
  tokenAction: (token) => dispatch(saveToken(token)),
});

export default connect(loginStateToProps, loginActionToProps)(Router);
