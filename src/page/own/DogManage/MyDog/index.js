'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { ListView,Icon,List } from 'antd-mobile';
import Header from 'components/common/Header';
import Ajax from 'libs/ajax';
import { toast } from 'libs/util';

  let currentPage=1; //当前页码

  function genData(NUM_ROWS=25,pIndex = 0) {
    const dataBlob = {};
    for (let i = 0; i < NUM_ROWS; i++) {
      const ii = (pIndex * NUM_ROWS) + i;
      dataBlob[`${ii}`] = `row - ${ii}`;
    }
    return dataBlob;
  }


/**
 * 我的警犬列表
 */
export default class MyDogList extends Component {

    constructor(props){
      super(props);

      const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
      const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
      
      const dataSource = new ListView.DataSource({
        getRowData,
        getSectionHeaderData: getSectionData,
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });  
      
      this.state = {
          hasMore:false,
          totalPage:-1, //警犬列表总页数
          dogList:{}, //警犬列表
          dataSource,
          isLoading: true,
          height: document.documentElement.clientHeight * 3 / 4
        }
    }    

    listMyDog (currPage=1) {
     
      if(this.state.totalPage!=-1 && currentPage>this.state.totalPage){
        return;
      }
      
      Ajax.get('/api/dog/myDogs', {currPage:currPage}, (res) => { 
          this.state.dogList=res.data.list;
          this.state.totalPage=res.data.totalPage;

          if(currentPage<this.state.totalPage){ //当前页小于总页数时,允许滑动加载
            this.state.hasMore=true;
          }

          const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
          
          setTimeout(() => {

            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(genData(res.data.list.length,--currentPage)),
              isLoading: false,
              height: hei
            });
          }, 600);

      });
      
    }

    componentDidMount() {
      this.setState({ isLoading: true });
      this.listMyDog(); //获取我的警犬列表
    }

    onEndReached = (event) =>{

      if (!this.state.hasMore) {
           return;
      }
  
      this.setState({ isLoading: true });
      this.listMyDog(++currentPage);
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
    
    let {totalPage,dogList}=this.state;

    let index = dogList.length - 1;
    const row = (rowData, sectionID, rowID) => {
      
      if (index < 0) {
        return null;
      }
      const obj = dogList[index--];
      if(obj.sex==1){
        obj.sexc='公';
      } else if(obj.sex==0){
        obj.sexc='母';
      } else{
        obj.sexc='--';
      }

      return (
        <div key={rowID} style={{ padding: '0 15px' }}>
          <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
            <img style={{ height: '64px', marginRight: '15px' }} src={obj.img} alt=""/>
            <div style={{ lineHeight: 1 }}>
              <div style={{ marginBottom: '8px'}}>
                <span style={{fontSize:18,fontWeight: 'bold' }}>{obj.name}</span>  
              </div>
              <div style={{ marginBottom: '8px'}}>品种/性别：{obj.breedName}/{obj.sexc}</div>
              <div>出生日期：{obj.birthdayStr}</div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div>  
        <Header title="我的警犬" pointer />   
        <ListView
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
            {this.state.isLoading ? '加载中...' : '没有更多数据了'}
            </div>)} 
            renderRow={row}
            renderSeparator={separator}
            style={{
            height: this.state.height,
            overflow: 'auto',
            }}
            pageSize={totalPage}        
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
        />
      </div>
    );
  }
}

//我的警犬列表
module.exports = MyDogList;


// WEBPACK FOOTER //
// ./src/components/own/DogManage/MyDog/index.js