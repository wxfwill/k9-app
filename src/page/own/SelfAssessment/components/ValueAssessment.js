// 价值观考核得分
import React, { Component } from 'react';
import { List, Card } from 'antd-mobile';
import NoData from 'components/common/No-data';

class ValueAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultList: [
        {
          name: '表现/忠诚',
          itemSelfMark: 'itemOneSelfMark',
          itemExplain: 'itemOneExplain',
          itemSquadronMark: 'itemOneSquadronMark',
        },
        {
          name: '激情/干净',
          itemSelfMark: 'itemTwoSelfMark',
          itemExplain: 'itemTwoExplain',
          itemSquadronMark: 'itemTwoSquadronMark',
        },
        {
          name: '团结/担当',
          itemSelfMark: 'itemThreeSelfMark',
          itemExplain: 'itemThreeExplain',
          itemSquadronMark: 'itemThreeSquadronMark',
        },
        {
          name: '奉献',
          itemSelfMark: 'itemFourSelfMark',
          itemExplain: 'itemFourExplain',
          itemSquadronMark: 'itemFourSquadronMark',
        },
      ],
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
    const { mark, setData, defaultList } = this.state;
    return (
      <div>
        <div>
          <Card>
            <Card.Header
              title="价值观考核得分"
              thumb={require('images/own/jiazhi.svg')}
              extra={<span>{mark ? mark : 0}分</span>}
            />
            {defaultList && defaultList.length > 0 ? (
              defaultList.map((item) => {
                return (
                  <Card.Body key={item.name}>
                    <List>
                      <div className="title-score">
                        <b>{item.name}</b>
                        <p>{setData[item.itemSelfMark] ? setData[item.itemSelfMark] : 0}分</p>
                      </div>
                      <div className="self-ass">{setData[item.itemExplain] ? setData[item.itemExplain] : '无'}</div>
                      <div className="opinion">
                        <span>修改意见：</span>
                        <p>{setData[item.itemSquadronMark] ? setData[item.itemSquadronMark] : 0}</p>
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

module.exports = ValueAssessment;
