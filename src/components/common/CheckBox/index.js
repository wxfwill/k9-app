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
import { Modal, List, Button, WhiteSpace, WingBlank, Icon, SearchBar, Picker } from 'antd-mobile';
import { createForm } from 'rc-form';

require('./style.less');
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
    };
  }
  componentWillReceiveProps(nextProps) {
	  console.log(nextProps,'=========================')
    const { modalShow, dataList } = nextProps;
    this.setState({
      modalShow: modalShow,
      masterList: dataList,
    });
  }
  onClose = (key) => () => {
    this.setState({
      modalShow: false,
    });
    let selectedArr = [];
    // this.state.allList.map((item) => {
    //   item.remark && selectedArr.push(item);
    // });
    this.state.masterList.map((item) => {
      item.remark && selectedArr.push(item);
    });
    this.props.clickOk && this.props.clickOk(selectedArr);
  };
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

  render() {
    const { masterList, disabled, isSelectAll } = this.state;
    const { title, initTip, searchTip, showValue, useDefaultDom } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <Modal
        popup
        visible={this.state.modalShow}
        onClose={this.onClose('modalShow')}
        animationType="slide-up"
        // afterClose={() => {
        //   alert('afterClose');
        // }}
      >
        <div className="check-box">
          <div className="header">
            <span className="cancel" onClick={this.onClose('modalShow')}>
              取消
            </span>
            <p className="title">{title}</p>
            <span className="confirm" onClick={this.onClose('modalShow')}>
              确定
            </span>
          </div>
          <div className="main">
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
      </Modal>
    );
  }
}

const ChooseMoudle = createForm()(Choose);
export default withRouter(ChooseMoudle);
