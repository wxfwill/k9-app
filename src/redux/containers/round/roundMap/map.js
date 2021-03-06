/*param
    @labelText 我的位置文字标注
    @lat:纬度值
    @lng:经度值
  */
 import { toast } from 'libs/util'

export const tMap = function(options){
      console.log(options)
      this.polyline = null;
      this.polylinePathArr = [];//实时定位
      this.options = options;//配置参数
      this.Event = qq.maps.event;
      this.labelArray = [];//坐标标注数组
      this.gridArray = [];//网格线数组
      this.markerArray = []//标记数组
      this.rectArrs = []//网格区块数组
      this.center = this.getMapCenter(options.lat,options.lng);
      this.setMap();
    }
  //创建地图
   tMap.prototype.setMap = function (options){
      console.log(this.lat+', '+this.lng)
      console.log(this.options)
      let _this = this;
      //let labelText = this.options.labelText;
      //_this.getCityCenter(this.lat,this.lng,labelText); 
      _this.getCityCenter(this.lat,this.lng);   
  }
  //获取城市列表接口设置中心点
  //tMap.prototype.getCityCenter = function(lat,lng,labelText){
  tMap.prototype.getCityCenter = function(lat,lng){
      let _this = this;
      this.map = new qq.maps.Map(document.getElementById('container'),{
        center:this.center,
        zoom: 13,
        zoomControl: true,
        zoomControlOptions: {
            //设置控件位置相对右下角对齐，向左排列
            position: qq.maps.ControlPosition.TOP_LEFT
        },
        mapTypeControlOptions: {
            //设置控件的地图类型ID，ROADMAP显示普通街道地图，SATELLITE显示卫星图像，HYBRID显示卫星图像上的主要街道透明层
            mapTypeIds: [
              qq.maps.MapTypeId.ROADMAP,
              qq.maps.MapTypeId.SATELLITE,
            ],
            //设置控件位置相对上方中间位置对齐
            position: qq.maps.ControlPosition.TOP_CENTER
        }
      });
      /*let label = new qq.maps.Label({
        position: new qq.maps.LatLng(lat,lng),
        map: _this.map,
        content: labelText,
        offset: new qq.maps.Size(8,-40)
      });*/

  }
  //获取地图中心点创建地图
  tMap.prototype.getMapCenter = function(lat,lng){
    let _this = this;
    this.lat = typeof lat=='undefined'? 22.543099:lat;
    this.lng = typeof lng=='undefined'? 114.057868:lng;
    return new qq.maps.LatLng(this.lat, this.lng);
  };
  //设置跳动标记
  tMap.prototype.setBeatMark = function(){
    if(typeof this.options.beatMark !== 'undefined' && this.options.beatMark===false){
      return;
    }
    let _this = this;
    let anchor = new qq.maps.Point(10, 30);
    let size = new qq.maps.Size(32, 30);
    let origin = new qq.maps.Point(0, 0);
    let icon = new qq.maps.MarkerImage('https://lbs.qq.com/javascript_v2/sample/img/plane.png', size, origin, anchor);
    size = new qq.maps.Size(52, 30);
    let originShadow = new qq.maps.Point(32, 0);
    let shadow = new qq.maps.MarkerImage(
        'https://lbs.qq.com/javascript_v2/sample/img/plane.png', 
        size, 
        originShadow,
        anchor 
    );
    let marker = new qq.maps.Marker({
        icon: icon,
        shadow: shadow,
        map: _this.map,
        position: _this.center,
        animation: qq.maps.MarkerAnimation.BOUNCE
    });
    return this;
  }
  //绘图功能
  tMap.prototype.drawingManager = function(){
    let Tmap = this.map,_this =this;
    let drawingManager = new qq.maps.drawing.DrawingManager({
      drawingMode: qq.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
          position: qq.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
              qq.maps.drawing.OverlayType.MARKER,
              qq.maps.drawing.OverlayType.CIRCLE,
              qq.maps.drawing.OverlayType.POLYGON,
              qq.maps.drawing.OverlayType.POLYLINE,
              qq.maps.drawing.OverlayType.RECTANGLE
          ]
      },
      polygonOptions: {
          fillColor:  new qq.maps.Color(0,0,0,0),
          strokeColor: new qq.maps.Color(88, 88, 88, 1),
          strokeWeight: 2,
          clickable: false,
          zIndex:1
      }
    });
    drawingManager.setMap(Tmap);
    this.Event.addListener(drawingManager, 'polygoncomplete', function(event) {
      let latArr = [],lngArr = [];
      $.each(event.path.elems,function(index,item){
        latArr.push(item.lat);
        lngArr.push(item.lng);
      });
      let maxLat = Math.max(...latArr);
      let minLat = Math.min(...latArr);
      let maxLng = Math.max(...lngArr);
      let minLng = Math.min(...lngArr);
      drawingManager.setDrawingMode(null);//绘制完成退出编辑
      _this.createGrid(maxLat,minLat,maxLng,minLng);
      _this.createTestMaker();
      _this.getLabelContent();
      //根据绘图路径画覆盖物
      _this.polygon = new qq.maps.Polygon({
        path: event.path.elems,
        strokeColor: new qq.maps.Color(88, 88, 88, 1),
        strokeWeight: 1,
        fillColor: new qq.maps.Color(0,0,0,.5),
        map:_this.map
      }); 
      _this.polygon.setZIndex(1);
    });
  }
  tMap.prototype.clearOverlay = function(){
    this.setMap(this.options);
    this.setBeatMark();
    this.drawingManager();
  };
  //圈定目标区域范围
  tMap.prototype.createGrid = function(maxLat,minLat,maxLng,minLng){
   let _this = this;
   //目标范围矩形路径
   let path1=[
        new qq.maps.LatLng(maxLat,minLng),
        new qq.maps.LatLng(minLat,minLng),
        new qq.maps.LatLng(minLat,maxLng),
        new qq.maps.LatLng(maxLat,maxLng)
    ];
   //网格路径
   let rowStepSize = (maxLat - minLat)/5;
   let colStepSize = (maxLng - minLng)/5;
   this.maxLat = maxLat;
   this.minLat = minLat;
   this.maxLng = maxLng;
   this.minLng = minLng;
   _this.rowStepSize = rowStepSize;
   _this.colStepSize = colStepSize;

   _this.rowLinePath = [];
   for(let i=1;i<=4;i++){
     Array.prototype.push.call(_this.rowLinePath,
      [
        new qq.maps.LatLng(minLat+rowStepSize*i, minLng),
        new qq.maps.LatLng(minLat+rowStepSize*i, maxLng)
      ]
     );
    }
   _this.colLinePath = [];
   for(let i=1;i<=4;i++){
     Array.prototype.push.call(_this.colLinePath,
      [
        new qq.maps.LatLng(minLat, minLng+colStepSize*i),
        new qq.maps.LatLng(maxLat, minLng+colStepSize*i)
      ]
     );
    }
    let polygon = new qq.maps.Polygon({
      path:path1,
      strokeColor:'#ccc',
      strokeWeight: 0,
      fillColor: new qq.maps.Color(255, 208, 70, 0.3),
      map:_this.map
    }); 
    polygon.setZIndex(0);
    //添加定时器
    setTimeout(function(){
      _this.map.fitBounds(polygon.getBounds());
      _this.ceratePolyline(_this.rowLinePath,_this.colLinePath)
    },500);
  };
  //
tMap.prototype.ceratePolyline = function(rowLinePath,colLinePath, PolylineStyle ={}){
    let _this = this;
    let newArr = [...rowLinePath,...colLinePath];
    $.each(newArr,function(index,item){
      var path = item
      var polyline = new qq.maps.Polyline({
          //折线是否可点击
          clickable: true,
          //鼠标在折线上时的样式
          cursor: 'crosshair',
          //折线是否可编辑
          editable: false,
          map: _this.map,
          //折线的路径
          path: path,
          //折线的颜色
          // strokeColor: '#000000',
          //可以设置折线的透明度
          strokeColor: new qq.maps.Color(0,153,255),
          //折线的样式
          strokeDashStyle: 'solid',
          //折线的宽度
          strokeWeight: 2,
          //折线是否可见
          visible: true,
          //折线的zIndex
          zIndex: 1000
      }, ...PolylineStyle);
      Array.prototype.push.call(_this.gridArray,polyline);
    })
      
  };
  //添加坐标点标注
tMap.prototype.createTestMaker = function(){
    let _this = this;
    let labelArr = [...this.rowLinePath];
    let otherMakerArr = [];
    labelArr.push(
      [ 
        new qq.maps.LatLng(_this.maxLat,_this.minLng),
        new qq.maps.LatLng(_this.minLat,_this.maxLng)
      ],[
        new qq.maps.LatLng(_this.minLat,_this.minLng),
        new qq.maps.LatLng(_this.maxLat,_this.maxLng)
      ]
    )
    for(let i=1;i<=4;i++){
     Array.prototype.push.call(otherMakerArr,
      [
        new qq.maps.LatLng(_this.minLat+_this.rowStepSize*i, _this.minLng+_this.colStepSize),
        new qq.maps.LatLng(_this.minLat+_this.rowStepSize*i, _this.minLng+_this.colStepSize*2),
        new qq.maps.LatLng(_this.minLat+_this.rowStepSize*i, _this.minLng+_this.colStepSize*3),
        new qq.maps.LatLng(_this.minLat+_this.rowStepSize*i, _this.minLng+_this.colStepSize*4)
      ]
     );
    }
    let resultLabelArray =[...labelArr,..._this.colLinePath,...otherMakerArr];
    $.each(resultLabelArray,function(index,item){
      $.each(item,function(index1,item1){
        var label = new qq.maps.Label({
          position: item1,
          zIndex:3,
          map: _this.map,
          content:item1.lat+'<br/>'+item1.lng,
          style:{userSelect:'none',color:"#000",fontSize:"12px",fontWeight:"bold",background:new qq.maps.Color(0,0,0,0),borderColor:new qq.maps.Color(0,0,0,0)}
        });
        Array.prototype.push.call(_this.labelArray,label);
      });
    })
    this.cZoom = this.map.getZoom();
    this.map.zoomTo(this.cZoom+1);
  };
//多点标记并添加判断
  tMap.prototype.createMakers = function(argument){
    let _this = this;
    this.Event.addListener(this.map, 'click', function(event) {
        var marker = new qq.maps.Marker({
          position:event.latLng, 
          map:_this.map,
          zIndex:3
        });
        _this.Event.addListener(marker, 'click', function(event) {
          alert(_this.rectArrs[0].getBounds().contains(event.latLng));
        });
    });
  };
  /************************实时定位**********************/ 
    tMap.prototype.setPolyline = function(){
      this.polyline = new qq.maps.Polyline({
        path:this.polylinePathArr,
        strokeColor:'#1c29d8',
        strokeWeight: 10,
        editable:false,
        map:this.map
      });
    }
    tMap.prototype.drawingPolyline = function(data){
      this.polylinePathArr.push(new qq.maps.LatLng(data.lat, data.lng));
      this.polyline.setMap(this.map);
      this.polyline.setPath(this.polylinePathArr);
    }

  /***********************获取系列********************/ 
  tMap.prototype.getLabelContent = function(argument){
      let _this = this; 
      let latArr = [];
      let lngArr = [];
      let totalArr = [];
      this.labelArray.forEach( function(element, index) {
        Array.prototype.push.call(totalArr,element.content.split('<br/>'));
        Array.prototype.push.call(latArr,element.content.split('<br/>')[0]);
        Array.prototype.push.call(lngArr,element.content.split('<br/>')[1]);
      });
      latArr = Array.from(new Set(latArr)).sort(function(a,b){return b-a;});
      lngArr = Array.from(new Set(lngArr)).sort();
      let len = latArr.length-1;
      let rectArr = [];
      for(let i=0;i<len;i++){
        rectArr.push([latArr[i],lngArr[0],latArr[i],lngArr[1],latArr[i+1],lngArr[1],latArr[i+1],lngArr[0]]);
        rectArr.push([latArr[i],lngArr[1],latArr[i],lngArr[2],latArr[i+1],lngArr[2],latArr[i+1],lngArr[1]]);
        rectArr.push([latArr[i],lngArr[2],latArr[i],lngArr[3],latArr[i+1],lngArr[3],latArr[i+1],lngArr[2]]);
        rectArr.push([latArr[i],lngArr[3],latArr[i],lngArr[4],latArr[i+1],lngArr[4],latArr[i+1],lngArr[3]]);
        rectArr.push([latArr[i],lngArr[4],latArr[i],lngArr[5],latArr[i+1],lngArr[5],latArr[i+1],lngArr[4]]);
      }
      console.log(rectArr.length);
      rectArr.forEach(function(item,index){
        let path=[
          new qq.maps.LatLng(item[0],item[1]),
          new qq.maps.LatLng(item[2],item[3]),
          new qq.maps.LatLng(item[4],item[5]),
          new qq.maps.LatLng(item[6],item[7])
        ];
        var polygon = new qq.maps.Polygon({
            path:path,
            strokeColor: new qq.maps.Color(0,0,0,0),
            strokeWeight: 1,
            zIndex:0,
            fillColor: new qq.maps.Color(0,0,0,0),
            map: _this.map
        });
         var cssC = {
            color: "#f00",
            fontSize: "16px",
            fontWeight: "bold",
            userSelect: "none"
        };
        var label = new qq.maps.Label({
            //如果为true，表示可点击，默认true。
            clickable: true,

            //标签的文本。
            content: index+'',

            //显示标签的地图。
            map: _this.map,

            //相对于position位置偏移值，x方向向右偏移为正值，y方向向下偏移为正值，反之为负。
            offset: new qq.maps.Size(0, -30),

            //标签位置坐标，若offset不设置，默认标签左上角对准该位置。
            position: new qq.maps.LatLng(item[6],item[7]),

            //Label样式。
            style: cssC,

            //如果为true，表示标签可见，默认为true。
            visible: true,

            //标签的z轴高度，zIndex大的标签，显示在zIndex小的前面。
            zIndex: 1000
        });
         Array.prototype.push.call(_this.rectArrs,polygon);
      })
  };
  /********************取消动作系列*******************/ 
  tMap.prototype.clear = function(clearObj){
    if(clearObj) {
      for (i in clearObj) {
        clearObj[i].setMap(null);
      }
    }
  }
  /*清除坐标标注*/ 
  tMap.prototype.clearCoord = function(){
    this.clear(this.labelArray)
  }
  /*清除网格*/
  tMap.prototype.clearGrid=function(){
    this.clear(this.gridArray)
  }
  //判断点是否在区域内
  tMap.prototype.isContains=function(area, pointer){
    return area.getBounds().contains(new qq.maps.LatLng(pointer.lat,pointer.lng))
  }
  //判断两点内的距离
  tMap.prototype.minPointer=function(pointer, pointerArr){
    let start = new qq.maps.LatLng(pointer.lat, pointer.lng);
    let obj = {};
    pointerArr.map(function(item, index){
      let end = new qq.maps.LatLng(item.lat, item.lng);
      let len = Math.round(qq.maps.geometry.spherical.computeDistanceBetween(start, end)*10)/10;
      if(obj.value){
        obj.value > len ? obj.value = len : ''
      }else{
        obj.value = len;
        obj.index = index;
      }
    })
    return pointerArr[obj.index]
  }
  /* 绘制目标矩形区域 */
  tMap.prototype.targetArea = function(a, b, c, d) {
    const _this = this;
    const pointList = [a, c, d, b, a];
    let pointPath = [];
    pointList.forEach((item) => {
      pointPath.push(new qq.maps.LatLng(item.lat, item.lng))
    });
   const polygon = new qq.maps.Polygon({ 
      clickable: false, 
      cursor: 'crosshair',
      editable: false,
      map: _this.map,
      path: pointPath,
      visible: true,
      zIndex: 1000,
      clickable:true
      });
      _this.map.fitBounds(polygon.getBounds()); //根据指定的范围调整地图视野
    return polygon;
  }

  /* 绘制目标多边形区域 */
  tMap.prototype.polygonArea = function(arr) {
    const _this = this;
    const pointList =arr;
    let pointPath = [];
    pointList.forEach((item) => {
      pointPath.push(new qq.maps.LatLng(item.lat, item.lng))
    });
   const polygon = new qq.maps.Polygon({ 
      clickable: false, 
      cursor: 'crosshair',
      editable: false,
      map: _this.map,
      path: pointPath,
      visible: true,
      zIndex: 1000,
      clickable:true
      });
      _this.map.fitBounds(polygon.getBounds()); //根据指定的范围调整地图视野
    return polygon;
  }

  //绘制圆
  tMap.prototype.targetCircle = function(pointer, sRadius, sColor) {
    const _this = this;
    let center = new qq.maps.LatLng(pointer.lat,pointer.lng);
    let strokeColor = sColor ? sColor : "#DC143C";
   const polygon = new qq.maps.Circle({ 
      clickable: false, 
      cursor: 'crosshair',
      editable: false,
      radius: sRadius,
      map: _this.map,
      center: center,
      visible: true,
      zIndex: 1000,
      strokeColor: strokeColor,
      clickable:true
      });
      //_this.map.fitBounds(polygon.getBounds()); //根据指定的范围调整地图视野
    return polygon;
  }

  // 绘制用户轨迹
  tMap.prototype.TrackPoints = function(pointList, sColor) {
    const _this = this;
    let strokeColor = sColor ? sColor : "#DC143C";
    let pointPath = [];
    pointList.forEach((item) => {
      pointPath.push(new qq.maps.LatLng(item.lat, item.lng))
    });
   const polygon = new qq.maps.Polyline({ 
      clickable: false, 
      cursor: 'crosshair',
      editable: false,
      strokeWeight: 5,
      map: _this.map,
      path: pointPath,
      visible: true,
      zIndex: 1000,
      clickable:true,
      strokeColor: strokeColor,
      });
      //_this.map.fitBounds(polygon.getBounds()); //根据指定的范围调整地图视野
    return polygon;
  }
  //改变中心
  tMap.prototype.rPanTo = function(pointer){
    this.map.panTo(new qq.maps.LatLng(pointer.lat, pointer.lng));
  }
//mobile 
  tMap.prototype.setMark = function(image,ownLatlng,otherLatlng){
    var anchor = new qq.maps.Point(6, 6),
        size = new qq.maps.Size(24, 24),
        origin = new qq.maps.Point(0, 0),
        scaleSize = new qq.maps.Size(24, 24),
        ownIcon = new qq.maps.MarkerImage(image.ownPic, size, origin, anchor,scaleSize),
        othersIcon = new qq.maps.MarkerImage(image.othersPic, size, origin, anchor,scaleSize);
    var marker=new qq.maps.Marker({
        icon:ownIcon,
        position:new qq.maps.LatLng(ownLatlng.lat,ownLatlng.lng),
        animation:qq.maps.MarkerAnimation.DROP,
        map:this.map
    });
    otherLatlng.forEach((item,index)=>{
      var marker=new qq.maps.Marker({
        icon:othersIcon,
        position:new qq.maps.LatLng(item.lat,item.lng),
        animation:qq.maps.MarkerAnimation.DROP,
        map:this.map
      });
    })
  }

  tMap.prototype.seteDestinationMark = function(image, otherLatlng) { // 目标地点
    var anchor = new qq.maps.Point(6, 6),
        size = new qq.maps.Size(24, 24),
        origin = new qq.maps.Point(0, 0),
        scaleSize = new qq.maps.Size(24, 24);
    var othersIcon = new qq.maps.MarkerImage(image.othersPic, size, origin, anchor,scaleSize);
    otherLatlng.forEach((item,index)=>{
      var marker=new qq.maps.Marker({
        icon:othersIcon,
        position:new qq.maps.LatLng(item.lat,item.lng),
        animation:qq.maps.MarkerAnimation.DROP,
        map:this.map
      });
    })
  }

  tMap.prototype.setSelfMark = function(image,ownLatlng, markObj) {
    if(markObj){
      markObj.setPosition(new qq.maps.LatLng(ownLatlng.lat,ownLatlng.lng));
      return ;
    }
    var anchor = new qq.maps.Point(6, 6),
    size = new qq.maps.Size(24, 24),
    origin = new qq.maps.Point(0, 0),
    scaleSize = new qq.maps.Size(24, 24),
    ownIcon = new qq.maps.MarkerImage(image.ownPic, size, origin, anchor,scaleSize),
    othersIcon = new qq.maps.MarkerImage(image.othersPic, size, origin, anchor,scaleSize);
    return new qq.maps.Marker({
        icon:ownIcon,
        position:new qq.maps.LatLng(ownLatlng.lat,ownLatlng.lng),
        animation:qq.maps.MarkerAnimation.DROP,
        map:this.map
    });
  }

  tMap.prototype.drivingService = function(start, end, callbackFun) { // 驾车时间
    const options = {
      type: 'LEAST_DISTANCE', // 最短距离
    };
    console.log(start, end, options.type)
    const drivingService = new qq.maps.DrivingService({
      location : "深圳",
      map : this.map
    });
     //设置驾车方案
     drivingService.setPolicy(qq.maps.DrivingPolicy[options.type]);

    drivingService.setComplete(function(result) {
        if (result.type == qq.maps.ServiceResultType.MULTI_DESTINATION) {
          toast("起终点不唯一");
        }
    });
    drivingService.setComplete(function(result) {
      const {distance, duration} = result.detail;
      // result.detail.distance; // 两点之间的道路距离为：
      // result.detail.duration; // 两点之间的行驶时间为：
      console.log(distance, duration);
      callbackFun && callbackFun({distance, duration})
          });
      //设置检索失败回调函数
      drivingService.setError(function(data) {
        alert(data);
      });
    drivingService.search(new qq.maps.LatLng(start.lat, start.lng), new qq.maps.LatLng(end.lat, end.lng));

  }

  tMap.prototype.Polyline = function(path, PolylineStyle) {
    console.log(path, 'path');
    let newPath = [];
    if(Array.isArray(path)) {
      newPath = path.map((item) => {
       return new qq.maps.LatLng(item.lat, item.lng)
      })
    }
    
    new qq.maps.Polyline({
      //折线是否可点击
      clickable: true,
      //鼠标在折线上时的样式
      cursor: 'crosshair',
      //折线是否可编辑
      editable: false,
      map: this.map,
      //折线的路经
      path: newPath,
      //折线的颜色
      strokeColor: '#000000',
      //可以设置折线的透明度
      //strokeColor: new qq.maps.Color(0, 0, 0, 0.5),
      //折线的样式
      strokeDashStyle: 'dash',
      //折线的宽度
      strokeWeight: 3,
      //折线是否可见
      visible: true,
      //折线的zIndex
      zIndex: 1000
  }, ...PolylineStyle);
  }


// WEBPACK FOOTER //
// ./src/redux/containers/round/roundMap/map.js