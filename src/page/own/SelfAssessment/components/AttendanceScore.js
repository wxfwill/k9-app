import React, { Component } from 'react';
import { List, Card } from 'antd-mobile';
import NoData from 'components/common/No-data';

class AttendanceScore extends Component {
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

  isShowMark = (mark) => {
    return mark ? mark + '分' : '';
  };

  render() {
    const { setData } = this.state;
    let total = 0; //计算总分
    setData && setData.length > 0
      ? setData.map((item) => {
          if (item.squadronMark != '') {
            total += item.squadronMark;
          }
        })
      : null;
    return (
      <div>
        <div>
          <Card>
            <Card.Header
              title="考勤得分"
              thumb={require('images/own/checking-in.svg')}
              extra={<span>{this.isShowMark(total)}</span>}
            />
            {setData && setData.length > 0 ? (
              setData.map((item, index) => {
                return (
                  <Card.Body key={item.id}>
                    <List>
                      <div className="title-score">
                        <b>
                          {item.reason}
                          <span>
                            （自评分：{this.isShowMark(item.selfMark)}；次数：{item.travel}）
                          </span>
                        </b>
                        <p>{this.isShowMark(item.squadronMark)}</p>
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

module.exports = AttendanceScore;
