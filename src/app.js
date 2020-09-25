import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Routes from "router/router";
import { AppContainer } from "react-hot-loader";
process.env.NODE_ENV == "development" && require("mock/mockData.js");
import "lib-flexible/flexible.js";
import Ajax from "libs/ajax";
import store from "./store/index";

React.$ajax = Ajax;
require("normalize.css");
require("style/app.less");
import "antd-mobile/dist/antd-mobile.less";

const App = {
  run: function () {
    render(
      <AppContainer>
        <Provider store={store}>
          <Routes />
        </Provider>
      </AppContainer>,
      document.getElementById("root")
    );
  },
};
App.run();
if (module.hot) {
  module.hot.accept("router/router", () => {
    App.run();
  });
}
