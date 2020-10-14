import React, { Component } from 'react';

export default class Bundle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mod: null,
    };
  }
  componentWillMount() {
    this.load(this.props);
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }
  load(props) {
    this.setState({
      mod: null,
    });
    //注意这里，使用Promise对象; mod.default导出默认
    const self = this;
    props.load().then(function (mod) {
      console.log(mod, 'mod');
      self.setState({
        mod: mod.default ? mod.default : mod,
      });
    });
  }
  render() {
    return this.state.mod ? this.props.children(this.state.mod) : null;
  }
}

// WEBPACK FOOTER //
// ./src/router/Bundle.js
