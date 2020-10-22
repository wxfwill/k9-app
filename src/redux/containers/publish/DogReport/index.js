import React, { Component } from 'react';
import { Button, List, DatePicker, TextareaItem, Picker } from 'antd-mobile';
import Header from 'components/common/Header';
import { createForm } from 'rc-form';
import { toast } from 'libs/util';
import { QuickList } from 'localData/DogReport';
require('style/publish/public.less');
/**
 * 犬病上报
 */
class DogReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      dogList: [],
      open: false,
      SearchText: '',
      dogId: '',
      symptom: '',
    };
    this.timer = null;
  }

  componentDidMount() {
    this.queryDogList();
  }

  // 查询所有警犬
  queryDogList = () => {
    React.$ajax.publish.getByNameOrNumber({ dogName: '' }).then((res) => {
      if (res && res.code == 0) {
        let list = [];
        res.data.map((item) => {
          list.push({ label: item.name, value: item.id });
        });
        this.setState({ dogList: list });
      }
    });
  };

  submit = () => {
    //const { date, dogId } = this.state;
    const { date } = this.state;
    let dogId = this.props.form.getFieldValue('dogId') ? this.props.form.getFieldValue('dogId')[0] : '';
    let symptom = this.props.form.getFieldValue('symptom');
    if (dogId == '') {
      toast('请选择犬只！');
      return;
    } else if (symptom == '') {
      toast('请填写发病症状！');
      return;
    }
    const user = JSON.parse(sessionStorage.getItem('user'));
    const dataObj = { dogId, morbidityTime: util.formatDate(new Date(date), 'yyyy-MM-dd'), symptom, userId: user.id };
    React.$ajax.publish.reportDisease(dataObj).then((res) => {
      if (res && res.code == 0) {
        toast('上报成功！');
        this.props.history.push('/own');
      }
    });
  };

  //添加快捷输入
  shortcutInput = (val) => {
    const symptom = this.props.form.getFieldValue('symptom');
    this.setState(
      {
        symptom: symptom + val,
      },
      () => {
        this.props.form.setFieldsValue({ symptom: this.state.symptom });
      }
    );
  };

  render() {
    const { getFieldProps } = this.props.form;
    const { dogList, symptom } = this.state;
    return (
      <div className="layer-main">
        <div className="parent-container">
          <Header title="犬病上报" pointer="pointer" />
          <div className="child-container">
            <div className="components">
              <div className="form-main">
                <List className="list">
                  <p className="title">警犬名称</p>
                  <Picker data={dogList} cols={1} {...getFieldProps('dogId')} className="forss">
                    <List.Item arrow="horizontal"></List.Item>
                  </Picker>
                </List>
                <List className="list">
                  <p className="title">发病日期</p>
                  <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="Optional"
                    value={this.state.date}
                    onChange={(date) => this.setState({ date })}
                    // onOk={date => {this.getEquipmentList(date)}}
                  >
                    <List.Item arrow="horizontal"></List.Item>
                  </DatePicker>
                </List>
                <List className="list">
                  <p className="title">发病症状</p>
                  <TextareaItem
                    {...getFieldProps('symptom', {
                      initialValue: this.state.symptom ? this.state.symptom : '',
                    })}
                    clear
                    placeholder="描述疾病症状"
                    defaultValue={symptom}
                    autoHeight
                    rows={3}
                  />
                  <div className="list-botm">
                    <p className="lit-tle">快捷输入</p>
                    <div className="tag-container">
                      {QuickList &&
                        QuickList.map((item) => {
                          return (
                            <p
                              className="tag-list"
                              key={item.label}
                              onClick={() => {
                                this.shortcutInput(item.label);
                              }}
                            >
                              {item.label}
                            </p>
                          );
                        })}
                    </div>
                  </div>
                </List>
                <List className="list list-button">
                  <Button type="primary" onClick={this.submit}>
                    上报
                  </Button>
                </List>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const DogReportWrapper = createForm()(DogReport);
module.exports = DogReportWrapper;
