import React, { Component } from 'react';
import SelectPersonnel from './components/SelectPersonnel';

class AddPlayers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onSubmit = (data) => {
    console.log(data);
  };
  render() {
    return <SelectPersonnel title="分配队员" onSubmit={this.onSubmit} />;
  }
}

export default AddPlayers;
