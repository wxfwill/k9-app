import React, { Component } from 'react';
import {
  WhiteSpace,
  WingBlank,
  Button,
  Toast,
  Accordion,
  List,
  DatePicker,
  Flex,
  Modal,
  TextareaItem,
} from 'antd-mobile';
import Reflux from 'reflux';
import { createForm } from 'rc-form';
import ReactMixin from 'react-mixin';
import { saveAccount, savePassword, saveUserInfo, savePasswordData, saveToken } from 'store/actions/loginAction';
import { connect } from 'react-redux';
import Header from 'components/common/Header';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import Ajax from 'libs/ajax';
import { CallApp } from 'libs/util';
import Footer from 'components/common/Footer';
const Item = List.Item;
const Brief = Item.Brief;

const allDataList = [
  {
    title: '创建任务',
    link: '/map/createTask',
  },
  {
    title: '分配人员',
    link: '/map/assignPerson',
  },
  {
    title: '发布任务',
    link: '/map/pushTask',
  },
  {
    title: '添加团队人员',
    link: '/map/addTeamPerson',
  },
  {
    title: '任务详情',
    link: '/map/taskDetal',
  },
];
class CheckComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      val: 1,
      automaticData: {},
      autonomyData: {},
      allScore: 0,
      checkDate: moment(new Date()).format('YYYY-MM'),
      modal1: false,
      typeId: 1,
      specificInfo: '暂无数据！',
      allData: allDataList,
    };
  }

  componentDidMount() {
    // this.initDate(moment(new Date()).format('YYYY-MM'));
  }
  initDate(checkDate) {
    const user = this.props.userInfo.user;
    Ajax.post(
      '/api/performanceCheck/performanceCheckInfo',
      {
        userId: user.id,
        checkDate: checkDate,
      },
      (res) => {
        if (res.code == 0) {
          let { autonomyData, automaticData, allScore } = this.state;
          automaticData.dogTrain = [];
          automaticData.dogUse = [];
          automaticData.outdoor = [];
          autonomyData.dailyManage = [];
          autonomyData.trainCheck = [];
          res.data.map((item) => {
            if (item.scoreType == 0) {
              if (item.typeId == 1) {
                automaticData.dogTrain.push(item);
              } else if (item.typeId == 3) {
                automaticData.dogUse.push(item);
              } else if (item.typeId == 5) {
                automaticData.outdoor.push(item);
              }
            } else {
              if (item.typeId == 2) {
                autonomyData.trainCheck.push(item);
              } else if (item.typeId == 4) {
                autonomyData.dailyManage.push(item);
              }
            }
          });
          if (automaticData.dogTrain.length > 0) {
            allScore = Number(allScore) + Number(automaticData.dogTrain[0].totalScore);
          }
          if (automaticData.dogUse.length > 0) {
            allScore = Number(allScore) + Number(automaticData.dogUse[0].totalScore);
          }
          if (automaticData.outdoor.length > 0) {
            allScore = Number(allScore) + Number(automaticData.outdoor[0].totalScore);
          }
          if (autonomyData.trainCheck.length > 0) {
            allScore = Number(allScore) + Number(autonomyData.trainCheck[0].totalScore);
          }
          if (autonomyData.dailyManage.length > 0) {
            allScore = Number(allScore) + Number(autonomyData.dailyManage[0].totalScore);
          }

          this.setState({
            autonomyData: autonomyData,
            automaticData: automaticData,
            allData: res.data,
            allScore: allScore,
            checkDate: checkDate,
          });
        } else {
          Toast.info(res.msg);
          return;
        }
      }
    );
  }

  handleChange(data) {
    this.setState({
      checkDate: moment(new Date(data)).format('YYYY-MM'),
    });
    this.initDate(moment(new Date(data)).format('YYYY-MM'));
  }
  showModal = (message) => (e) => {
    console.log(message, 'message');
    let action = 'getDogTrainInfoById';
    if (message.typeId == 2) {
      action = 'getDogUseInfoById';
    } else if (message.action == 5) {
      action = 'getDutyInfoById';
    }
    Ajax.post(
      '/api/performanceCheck/' + action,
      {
        id: message.id,
      },
      (res) => {
        if (res.code == 0) {
          this.setState({
            specificInfo: res.data,
            typeId: message.typeId,
            mode1: true,
          });
        } else {
          Toast.info(res.msg);
          return;
        }
      }
    );
    e.preventDefault();
    this.setState({
      mode1: true,
    });
  };
  onClose = (key) => () => {
    this.setState({
      mode1: false,
    });
  };
  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  };
  handleItem = (item) => {
    let { history } = this.props;
    history.push(item.link);
  };
  render() {
    const { getFieldProps } = this.props.form;
    let { autonomyData, automaticData, allScore, specificInfo, typeId } = this.state;
    return (
      <div className="Own">
        <Header title="地图" />
        <div className="midder-content">
          <div className="inner-content">
            <List style={{ backgroundColor: 'white' }} className="date-picker-list">
              <DatePicker
                mode="month"
                title="选择月份"
                value={new Date(this.state.checkDate)}
                onChange={(date) => this.handleChange(date)}
              >
                <Item arrow="horizontal">月份</Item>
              </DatePicker>
            </List>
            <div style={{ marginTop: 10, marginBottom: 10 }}>
              {this.state.allData.length > 0
                ? this.state.allData.map((item, index) => {
                    return (
                      <List className="my-list" key={index} onClick={this.handleItem.bind(this, item)}>
                        <Item extra={allScore}> {item.title}</Item>
                      </List>
                    );
                  })
                : null}
            </div>
            <WhiteSpace size="xl" />
            <WhiteSpace size="xl" />
            <WhiteSpace size="xl" />
          </div>
        </div>
        <Footer />
        <Modal
          visible={this.state.modal1}
          transparent
          //  className="check-info-modal"
          maskClosable={false}
          onClose={this.onClose('modal1')}
          title="详细情况"
          footer={[
            {
              text: '返回',
              onPress: () => {
                console.log('ok');
                this.onClose('modal1')();
              },
            },
          ]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div style={{ height: 300, overflow: 'scroll' }}>
            <List style={{ backgroundColor: 'white' }} className="">
              <TextareaItem title="姓  名:" placeholder="" value={specificInfo.name || '--'}></TextareaItem>
              <TextareaItem title="指标名称:" placeholder="" value={specificInfo.item || '--'}></TextareaItem>
              <TextareaItem
                title="开始时间:"
                placeholder=""
                value={specificInfo.startTime ? moment(specificInfo.startTime).format('YYYY-MM-DD h:mm:ss') : '--'}
              ></TextareaItem>
              <TextareaItem
                title="结束时间:"
                placeholder=""
                value={specificInfo.endTime ? moment(specificInfo.endTime).format('YYYY-MM-DD h:mm:ss') : '--'}
              ></TextareaItem>
              <TextareaItem title="地  点:" placeholder="" value={specificInfo.location || '--'}></TextareaItem>
              {typeId == 1 ? <TextareaItem title="警  犬:" value={specificInfo || '--'}></TextareaItem> : null}
            </List>
          </div>
        </Modal>
      </div>
    );
  }
}
function loginStateToProps(state) {
  return {
    loginAccount: state.loginReducer.isRemeber,
    loginPass: state.loginReducer.isPass,
    userInfo: state.loginReducer.userInfo,
    password: state.loginReducer.password,
    token: state.loginReducer.token,
  };
}

const loginActionToProps = (dispatch) => ({
  remeberAccount: () => dispatch(saveAccount()),
  remeberPassword: () => dispatch(savePassword()),
  userInfoAction: (data) => dispatch(saveUserInfo(data)),
  passwordAction: (data) => dispatch(savePasswordData(data)),
  tokenAction: (token) => dispatch(saveToken(token)),
});

const Check = createForm()(CheckComponent);

export default connect(loginStateToProps, loginActionToProps)(withRouter(Check));
