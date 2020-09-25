

import React, { Component } from 'react';
import {SearchBar, Drawer,List } from 'antd-mobile';
import Ajax from 'libs/ajax';
import { toast } from 'libs/util'

/**
 * 输入警犬名称或编号查找警犬
 */
export default class QueryDog extends Component{

    constructor(props){
    super(props);
      this.state = {
        open:false,
        SearchText:'',
        dogList: []
      }
    }    

    onOpenChange=(...args) =>{
        this.setState({ open: !this.state.open });
    }

    getDogs (text) {
        clearTimeout(this.timer);
        this.setState({SearchText: text})
        const self = this;
        this.timer = setTimeout(() => {
            Ajax.post('/api/dog/getByNameOrNumber', {dogName: text}, (res) => { 
                if(res.code == 0) {
                    this.setState({dogList: res.data, open:true})
                }      
            });
        }, 500)
        
    }

    renderSidebar (){
        const {dogList} = this.state;
        return dogList.map((item) => {
        return <List.Item 
         key={item.id+'slider'} 
         arrow="horizontal" 
         style={{width: document.documentElement.clientWidth}}
         onClick={() => {
             this.setState({open:false,  SearchText: item.name, dogId: item.id})
         }}
         >{item.name}</List.Item>
        })
    }

    render (){

        const {SearchText,open} = this.state;

        return (

            <div>
                <SearchBar
                    placeholder="输入警犬名称或者编号" 
                    value={SearchText}
                    onChange={(value) => {this.getDogs(value)}}
                    onCancel={() => {
                        this.setState({open: false,SearchText:''})
                    }}             
                />
                <Drawer            
                    style={{ minHeight: document.documentElement.clientHeight, top: 100,  display: open?'block':'none'}}
                    enableDragHandle
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                    sidebar={this.renderSidebar()}
                    open={open}
                    onOpenChange={this.onOpenChange}
                >''
                </Drawer>
            </div>

        )
    }

}


// WEBPACK FOOTER //
// ./src/components/own/DogMonitor/QueryDog.js