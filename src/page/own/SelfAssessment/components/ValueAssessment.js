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

  isShowMark = (mark) => {
    return mark ? mark + '分' : '待审批';
  };

  render() {
    const { mark, setData, defaultList } = this.state;
    return (
      <div>
        <div>
          <Card>
            <Card.Header
              title="价值观考核得分"
              thumb={require('images/own/jiazhi.svg')}
              extra={<span>{this.isShowMark(mark)}</span>}
            />
            {defaultList && defaultList.length > 0 ? (
              defaultList.map((item) => {
                return (
                  <Card.Body key={item.name}>
                    <List>
                      <div className="title-score">
                        <b>
                          {item.name}
                          <span>（自评分：{this.isShowMark(setData[item.itemSelfMark])}）</span>
                        </b>
                        <p>{this.isShowMark(setData[item.itemSquadronMark])}</p>
                      </div>
                      <div className="self-ass">{setData[item.itemExplain] ? setData[item.itemExplain] : '无内容'}</div>
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
