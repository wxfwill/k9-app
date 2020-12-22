import React, { Component } from 'react';
import SelectPersonnel from './components/SelectPersonnel';

class AssignPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onSubmit = (data) => {
    console.log(data);
  };
  render() {
    return <SelectPersonnel title="分配队长" onSubmit={this.onSubmit} />;
  }
}

export default AssignPerson;
