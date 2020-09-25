import React, { Component, Fragment } from "react";

class Test extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <input type="file" capture="camera" accept="image/*" multiple />
      </div>
    );
  }
}
export default Test;

// WEBPACK FOOTER //
// ./src/components/test/index.js
