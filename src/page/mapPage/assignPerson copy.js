import React, { Component } from 'react';
import { Modal, WhiteSpace, WingBlank, SearchBar, Picker, List, Button } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import { createForm } from 'rc-form';
require('style/mapPage/personnel.less');
function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

const season = [
  {
    label: '一中队',
    value: '一中队',
  },
  {
    label: '二中队',
    value: '二中队',
  },
];

class AssignPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1: true,
      isDelete: false,

      allList: [],
      masterList: [],
      isSelectAll: false,
    };
  }

  showModal = (key) => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  };
  onClose = (key) => () => {
    this.setState({
      [key]: false,
    });
  };

  componentWillReceiveProps(nextProps) {
    console.log(nextProps, '=========================');
    const { modalShow, dataList } = nextProps;
    this.setState({
      modalShow: modalShow,
      masterList: dataList,
    });
  }
  inputChange = (val) => {
    if (!val) {
      this.setState({
        masterList: this.state.allList,
      });
      return false;
    }
    let arr = [];
    this.state.allList.map((item) => {
      item.name.indexOf(val) > -1 ? arr.push(item) : '';
    });
    this.setState({
      masterList: arr,
    });
  };
  searchCancel = () => {
    this.setState({
      masterList: this.state.allList,
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
  render() {
    const { masterList, isDelete, isSelectAll } = this.state;
    const { title, initTip, searchTip, showValue, useDefaultDom } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <WingBlank>
        <Modal
          visible={this.state.modal1}
          transparent
          maskClosable={false}
          onClose={this.onClose('modal1')}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          afterClose={() => {
            //alert('afterClose');
          }}
          className="mapPage"
        >
          <div className="personnel-layer">
            <div className="per-head">
              <p className="title">添加小组成员</p>
            </div>
            <div className="per-main">
              <div className="add-per-main">
                <SearchBar
                  placeholder={searchTip ? `${searchTip}` : 'search'}
                  onChange={(val) => this.inputChange(val)}
                  onCancel={() => this.searchCancel()}
                />
                <div className="choice-condition">
                  <div className="picker-box">
                    <Picker data={season} cols={1} {...getFieldProps('district3')} className="forss">
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
            <div className="per-foot per-foot-btn">
              <div className="btns">
                <p className="btn">取消</p>
                <p className="btn canfirm">确定</p>
              </div>
            </div>
          </div>
        </Modal>
        <WhiteSpace />
      </WingBlank>
    );
  }
}

const AssignPersonMoudle = createForm()(AssignPerson);
export default withRouter(AssignPersonMoudle);
