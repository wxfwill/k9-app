import React, { Component } from 'react';
import { List, Card } from 'antd-mobile';
import NoData from 'components/common/No-data';

class OtherPoints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mark: '',
      setData: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { mark, setData } = nextProps;
    this.setState({
      mark: mark,
      setData: setData,
    });
  }

  render() {
    const { mark, setData } = this.state;
    return (
      <div>
        <div>
          <Card>
            <Card.Header
              title="业务和内务考核得分"
              thumb={require('images/own/yewu.svg')}
              extra={<span>{mark ? mark : 0}分</span>}
            />
            {setData && setData.length > 0 ? (
              setData.map((item) => {
                return (
                  <Card.Body key={item.id}>
                    <List>
                      <div className="title-score">
                        <b>{item.id}</b>
                        <p>{item.selfMark ? item.selfMark : 0}分</p>
                      </div>
                      <div className="self-ass">{item.reason ? item.reason : '无'}</div>
                      <div className="opinion">
                        <span>修改意见：</span>
                        <p>{item.squadronMark ? item.squadronMark : 0}</p>
                      </div>
                    </List>
                  </Card.Body>
                );
              })
            ) : (
              <NoData />
            )}
          </Card>
        </div>
      </div>
    );
  }
}

module.exports = OtherPoints;
