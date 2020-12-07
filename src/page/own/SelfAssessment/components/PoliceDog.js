import React, { Component } from 'react';
import { List, Card } from 'antd-mobile';

class PoliceDog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setData: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { setData } = nextProps;
    this.setState({
      setData: setData,
    });
  }
  render() {
    const { setData } = this.state;
    return (
      <div>
        <div>
          <Card>
            <Card.Header
              title="警犬技能考核得分"
              thumb={require('images/own/police-dog.svg')}
              extra={<span>{setData ? setData + '分' : '待审核'}</span>}
            />
            <Card.Body>
              <List>
                <div className="title-score">
                  <b>得分</b>
                  <p>{setData ? setData + '分' : '待审核'}</p>
                </div>
              </List>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

module.exports = PoliceDog;
