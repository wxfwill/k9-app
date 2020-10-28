/*
 * title="参与队员"     //行小标题
 *	initTip="请选择队员"      //普通placeholder
 *	searchTip="请输入查询内容"    //搜索输入框placeholder
 *	clickOk = {(data) => this.clickOk(data)} //点击确定
 *	dataList=[]  总数组
 *	initList=[]  初始选中的数组
 *  showValue = '' 显示值
 *  disabled   bool
 *  useDefaultDom  使用默认的显示列表 bool 默认为true 此时可以带title 和 initTip
 *
 *
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, List, Button, SearchBar, Picker, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';

require('./style.less');
class Choose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      allList: [],
      masterList: [],
      disabled: false,
      useDefaultDom: true,
      isSelectAll: false,
      value: '',
      groupList: [],
      group: '',
    };
  }
  componentDidMount() {
    //获取中队列表
    React.$ajax.publish.getUserGroup().then((res) => {
      if (res && res.code == 0) {
        const list = res.data;
        const groupList = [];
        list.map((item) => {
          groupList.push({ label: item.name, value: item.id });
        });
        this.setState({
          groupList: groupList,
        });
      } else {
        Toast.info(res.msg);
        return;
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    const { modalShow, dataList } = nextProps;
    this.setState({
      modalShow: modalShow,
      masterList: dataList,
      allList: dataList,
      value: '',
      group: '',
    });
  }
  //关闭
  onClose = () => {
    this.setState({
      modalShow: false,
    });
  };
  //确定
  onConfirm = () => {
    let selectedArr = [];
    // this.state.allList.map((item) => {
    //   item.remark && selectedArr.push(item);
    // });
    this.state.masterList.map((item) => {
      item.remark && selectedArr.push(item);
    });
    if (selectedArr && selectedArr.length > 0) {
      this.onClose();
      this.props.clickOk && this.props.clickOk(selectedArr);
    } else {
      Toast.fail('请选择人员!', 1);
    }
  };
  inputChange = (val) => {
    this.setState(
      {
        value: val,
      },
      () => {
        this.filtrateUser();
      }
    );
    // if (!val) {
    //   this.setState({
    //     masterList: this.state.allList,
    //   });
    //   return false;
    // }
    // let arr = [];
    // this.state.allList.map((item) => {
    //   item.name.indexOf(val) > -1 ? arr.push(item) : '';
    // });
    // this.setState({
    //   masterList: arr,
    // });
  };
  searchCancel = () => {
    this.setState({
      masterList: this.state.allList,
      value: '',
    });
  };
  // 选择人员
  selectOption = (data) => {
    const { masterList } = this.state;
    let arr = [];
    if (masterList && masterList.length > 0) {
      console.log(masterList, masterList.length);
      masterList.map((item) => {
        if (data.id === item.id) {
          item.remark = !item.remark;
        }
        arr.push(item);
      });
      this.setState({
        masterList: arr,
      });
      //是否全部被选择
      let bol = false;
      masterList.map((item) => {
        if (!item.remark) {
          bol = true;
        }
      });
      this.setState({
        isSelectAll: !bol ? true : false,
      });
    }
  };
  //全选
  selectAll = () => {
    this.setState(
      {
        isSelectAll: !this.state.isSelectAll,
      },
      () => {
        let arr = [];
        if (this.state.isSelectAll) {
          this.state.masterList.map((item) => {
            item.remark = true;
            arr.push(item);
          });
        } else {
          this.state.masterList.map((item) => {
            item.remark = false;
            arr.push(item);
          });
        }
        this.setState({
          masterList: arr,
        });
      }
    );
  };

  //选择中队
  selectUserGroup = (val) => {
    const group = val && val.length > 0 ? val[0] : '';
    this.setState(
      {
        group: group,
      },
      () => {
        this.filtrateUser();
      }
    );
  };

  //根据姓名和中队筛选队员
  filtrateUser = () => {
    const { group, value, allList } = this.state;
    if (group) {
      let groupArr = [];
      allList.map((item) => {
        if (item.groupId == group) {
          groupArr.push(item);
        }
      });
      let arr = [];
      if (value) {
        groupArr.map((item) => {
          item.name.indexOf(value) > -1 ? arr.push(item) : '';
        });
        this.setState({
          masterList: arr,
        });
      } else {
        this.setState({
          masterList: groupArr,
        });
      }
    } else {
      let arr = [];
      if (value) {
        allList.map((item) => {
          item.name.indexOf(value) > -1 ? arr.push(item) : '';
        });
        this.setState({
          masterList: arr,
        });
      } else {
        this.setState({
          masterList: allList,
        });
      }
    }
  };

  render() {
    const { masterList, disabled, isSelectAll, value, groupList, group } = this.state;
    const { title, initTip, searchTip, showValue, useDefaultDom } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <Modal
        popup
        visible={this.state.modalShow}
        onClose={this.onClose}
        animationType="slide-up"
        // afterClose={() => {
        //   alert('afterClose');
        // }}
      >
        <div className="check-box">
          <div className="header">
            <span className="cancel" onClick={this.onClose}>
              取消
            </span>
            <p className="title">{title}</p>
            <span className="confirm" onClick={this.onConfirm}>
              确定
            </span>
          </div>
          <div className="main">
            <SearchBar
              placeholder={searchTip ? `${searchTip}` : 'search'}
              onChange={(val) => this.inputChange(val)}
              onCancel={() => this.searchCancel()}
              value={value}
            />
            <div className="choice-condition">
              <div className="picker-box">
                <Picker
                  data={groupList}
                  cols={1}
                  onChange={(val) => {
                    this.selectUserGroup(val);
                  }}
                  className="forss"
                  value={[group]}
                >
                  <List.Item arrow="horizontal"></List.Item>
                </Picker>
              </div>
              {/* <Button icon="check-circle" className="select-all choice">
                全选
              </Button> */}
              <Button
                icon="check-circle"
                onClick={this.selectAll}
                className={isSelectAll ? 'select-all choice' : 'select-all'}
              >
                全选
              </Button>
            </div>
            <ul className="person-list clearfix">
              {masterList.length ? (
                masterList.map((item, index) => {
                  return (
                    //   <li>王五</li>
                    //   <li className="choice">牛德华</li>
                    <li
                      key={`${item.id}`}
                      onClick={() => this.selectOption(item)}
                      className={item.remark ? 'choice' : ''}
                    >
                      {item.name}
                    </li>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', lineHeight: '28px', color: '#999999' }}>没有更多数据</div>
              )}
            </ul>
          </div>
        </div>
      </Modal>
    );
  }
}

const ChooseMoudle = createForm()(Choose);
export default withRouter(ChooseMoudle);
