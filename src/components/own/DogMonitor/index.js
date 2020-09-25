'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { ListView,Icon,SearchBar, Drawer,List } from 'antd-mobile';
import Header from 'components/common/Header';
import FontAwesome from 'react-fontawesome';
import Ajax from 'libs/ajax';
import { toast } from 'libs/util';

import QueryDog from './QueryDog';

require ('style/fontawesome/font-awesome.less')

function MyBody(props) {
    return (
      <div className="am-list-body my-body">
        <span style={{ display: 'none' }}>you can custom body wrap element</span>
        {props.children}
      </div>
    );
  }
  
  const data = [
    {
      img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
      title: 'Meet hotel',
      des: '不是所有的兼职汪都需要风吹日晒',
    },
    {
      img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
      title: 'McDonald\'s invites you',
      des: '不是所有的兼职汪都需要风吹日晒',
    },
    {
      img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
      title: 'Eat the week',
      des: '不是所有的兼职汪都需要风吹日晒',
    },
  ];

  const NUM_SECTIONS = 5;
  const NUM_ROWS_PER_SECTION = 5;
  let pageIndex = 0;
  
  const dataBlobs = {};
  let sectionIDs = [];
  let rowIDs = [];
  function genData(pIndex = 0) {
    for (let i = 0; i < NUM_SECTIONS; i++) {
      const ii = (pIndex * NUM_SECTIONS) + i;
      const sectionName = `Section ${ii}`;
      sectionIDs.push(sectionName);
      dataBlobs[sectionName] = sectionName;
      rowIDs[ii] = [];
  
      for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
        const rowName = `S${ii}, R${jj}`;
        rowIDs[ii].push(rowName);
        dataBlobs[rowName] = rowName;
      }
    }
    sectionIDs = [...sectionIDs];
    rowIDs = [...rowIDs];
}

/**
 * 警犬监控列表
 */
export default class DogMonitor extends Component {
  
  constructor(props){
    super(props);
    
    sectionIDs = [];
    rowIDs = [];

    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
    
    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource,
      isLoading: true,
      height: document.documentElement.clientHeight * 3 / 4
    }

  }

  componentDidMount() {
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    // simulate initial Ajax
    setTimeout(() => {
      genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        isLoading: false,
        height: hei,
      });
    }, 600);
  }

  onEndReached(event){
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
 
    this.setState({ isLoading: true });
    setTimeout(() => {
      genData(++pageIndex);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        isLoading: false,
      });
    }, 1000);
  }

  handleVideoLink = () => {
    let { history }  = this.props; 
    history.push('/own/DogMonitor/ViewDogVideo');
  }

  render() {

    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = data.length - 1;
      }
      const obj = data[index--];
      return (
        <div key={rowID} style={{ padding: '0 15px' }}>
          <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
         {/*   <img style={{ height: '64px', marginRight: '15px' }} src={obj.img} alt="" />*/}
            <div style={{ lineHeight: 1 }}>
              <div style={{ marginBottom: '8px'}}>
                 <span style={{fontSize:18,fontWeight: 'bold' }}>小花</span>  
                 <i style={{marginLeft:35}}><FontAwesome name='video-camera' style={{ fontSize:"15px",color:'#0000FF' }} onClick={()=> this.handleVideoLink()}/></i>
                 <span style={{marginLeft:90}}><FontAwesome name='circle' style={{color:'#EE0000'}}/>1-1001</span>
              </div>
              <div style={{ marginBottom: '8px'}}>训导员：吴世林</div>
              <div >出生日期：2016/03/20</div>
            </div>
          </div>
        </div>
      );
    };
  
    return (
      <div>  
        <Header title="我的警犬监控" pointer />
        <QueryDog/>    
        <ListView
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            //renderHeader={() => <span>header</span>}
            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
            {this.state.isLoading ? 'Loading...' : 'Loaded'}
            </div>)}
            /*renderSectionHeader={sectionData => (
                <div>{`Task ${sectionData.split(' ')[1]}`}</div>
            )}*/
            renderBodyComponent={() => <MyBody />}
            renderRow={row}
            renderSeparator={separator}
            style={{
            height: this.state.height,
            overflow: 'auto',
            }}
            pageSize={4}
            onScroll={() => { console.log('scroll'); }}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
        />
      </div>
    );
  }
  
}

//警犬监控列表
module.exports = DogMonitor;



// WEBPACK FOOTER //
// ./src/components/own/DogMonitor/index.js