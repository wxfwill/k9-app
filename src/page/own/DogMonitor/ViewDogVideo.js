import React, { Component } from 'react';
import {SearchBar, Drawer,List } from 'antd-mobile';

let ezuikit=require('ezuikit');

/**
 * 查看指定的狗视频直播
 */
class ViewDogVideo extends Component{

    constructor(props){
        super(props);
        
    }


    componentDidMount() {
        debugger
        this.refs.videoPlayer.setAttribute('webkit-playsinline','true');
        this.refs.videoPlayer.setAttribute('playsInline','true');
        var player = new ezuikit('myPlayer');
      
        player.on('log', console.log);
    }

    render(){


        return(
            <div>
                <video ref="videoPlayer" id={`myPlayer`}  autoPlay="autoplay" controls="controls" width={`"600"`}>
                    <source src={`http://hls.open.ys7.com/openlive/f01018a141094b7fa138b9d0b856507b.m3u8a`} type={`application/x-mpegURL`} />
                </video>
            </div>

        );
    }
}

module.exports=ViewDogVideo;


// WEBPACK FOOTER //
// ./src/components/own/DogMonitor/ViewDogVideo.js