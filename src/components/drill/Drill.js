import React,{Component} from 'react';
import { Toast, Carousel, WhiteSpace, WingBlank , Button } from 'antd-mobile';
import { Progress } from 'components/plugins/progress';
import Reflux from 'reflux';
import ReactMixin from 'react-mixin';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import Store from './store';
import Actions from './actions';
import { CallApp } from 'libs/util'

require('style/drill/drill.less');

const chuji = require('images/chuji.png');
const chujiActive = require('images/chuji-active.png');
const gaoji = require('images/gaoji.png');
const gaojiActive = require('images/gaoji-active.png');
const mockData =[
    [{
      level:'初级训练',
      img:chuji,
      imgActive:chujiActive
    },{
      level:'高级训练',
      img:gaoji,
      imgActive:gaojiActive
    },{
      level:'高级训练',
      img:gaoji,
      imgActive:gaojiActive
    }],[{
      level:'高级训练',
      img:gaoji,
      imgActive:gaojiActive
    },{
      level:'初级训练',
      img:chuji,
      imgActive:chujiActive
    },{
      level:'高级训练',
      img:gaoji,
      imgActive:gaojiActive
    }],[{
      level:'初级训练',
      img:chuji,
      imgActive:chujiActive
    },{
      level:'高级训练',
      img:gaoji,
      imgActive:gaojiActive
    },{
      level:'高级训练',
      img:gaoji,
      imgActive:gaojiActive
    }]
  ]

class Drill extends Component{
  constructor(props){
  	super(props);
    this.state={
      data:mockData,
      locationJson: '1234'
    }
    this.timer = null;
  }
  componentWillMount() {
      // Toast.loading('页面加载中...', 2,function(){}, true);
  }
  getUserLocation = () => {
    CallApp({callAppName: 'getLocationInfo', callbackName: 'sendLocationInfoToJs', callbackFun: this.showLocation})
  }
  showLocation = (msg) => {
    // Toast(msg);
    console.log(msg);
  }
  componentDidMount() {
    // this.timer = setInterval(  this.getUserLocation, 3000)
    this.getUserLocation();
    const self = this;
    window.addEventListener('touchmove', function(){}, { passive: false });
    		var p1 = new Progress({
        el:'progress',//canvas元素id
        deg:360,//绘制角度
        timer:7200,//绘制时间
        lineWidth:9,//线宽
        lineBgColor:'#e2e2e2',//底圆颜色
        lineColor:'#3D8CE8',//动态圆颜色
        textColor:'#3D8CE8',//文本颜色
        fontSize:24,//字体大小
        circleRadius:100,//圆半径
        times:7200,
    });
  }
  componentWillUnmount() {
     clearInterval(this.timer);
  }
 

  render(){
    let { user } = this.props.location;
    if(typeof user=='undefined'){
      user = JSON.parse(sessionStorage.getItem('user'));
    }
  	return(
  		<div className="Drill">
        <Header user={ user }/>
  			<div className="proContainer">
          <span className="tip-text">&nbsp;倒计时</span>
  				<canvas id="progress"></canvas>
          <span className="target">目标02:00:00</span>
  			</div>
        <WingBlank>
          <Carousel
            autoplay={false}
            infinite
            selectedIndex={1}
            autoplay
            dotActiveStyle={{background:'#3D8CE8'}}
          >
            {this.state.data.map((item,index) =>{
              return(
                <div className="options" key={'options'+index}>
                  {item.map((items,indexs)=>{
                    return(
                      <div className={"options"+indexs}  key={'items'+indexs}>
                        <div className="opt-img">
                          <img src={items.img} data-src={items.imgActive} alt=""/>
                        </div>
                        <p>{items.level}</p>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </Carousel>
        </WingBlank>
        <div className="handle">
          <Button type="primary" inline size="small">开始训练</Button>
          <p>今日步数{this.state.locationJson}</p>
        </div>
        <Footer/>
  		</div>
  	)
  }
}

export default Drill;











