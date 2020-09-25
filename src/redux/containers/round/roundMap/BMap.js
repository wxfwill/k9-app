const controlObj = {
 top_right_navigation: new BMap.NavigationControl(
     {anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}) //右上角
    
}

export const BDMap = function(id="container") {
    this.map = new BMap.Map(id);
}

BDMap.prototype.centerAndZoom = function(center,zoom=11) { // 设置中心点和缩放
    this.map.centerAndZoom(new BMap.Point(center.lng, center.lat), zoom);    
}  


BDMap.prototype.drawRectangle = function(a, d) {
    const pStart = new BMap.Point(a.lng,a.lat);
	const pEnd = new BMap.Point(d.lng,d.lat);
    const rectangle = new BMap.Polygon([
        new BMap.Point(pStart.lng,pStart.lat),
        new BMap.Point(pEnd.lng,pStart.lat),
        new BMap.Point(pEnd.lng,pEnd.lat),
        new BMap.Point(pStart.lng,pEnd.lat)
      ], {
            strokeColor:"blue",
            strokeWeight:2,
            strokeOpacity:0.5, 
            // fillColor:'#0c6',
            // fillOpacity: 0.5,
    });  //创建矩形
      this.map.addOverlay(rectangle);
}

BDMap.prototype.addControl = function(type = 'top_right_navigation') {
    this.map.addControl(controlObj[type]);
}

BDMap.prototype.setMarker = function(point, img) {
    var pt = new BMap.Point(point.lng, point.lat);
	var myIcon = new BMap.Icon(img, new BMap.Size(60,60));
	var marker2 = img ?new BMap.Marker(pt,{icon:myIcon}): new BMap.Marker(pt);  // 创建标注
	this.map.addOverlay(marker2);   
}

/*
// 百度地图API功能
var map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
var output = "从上地到西单驾车需要";
var searchComplete = function (results){
    if (transit.getStatus() != BMAP_STATUS_SUCCESS){
        return ;
    }
    var plan = results.getPlan(0);
    output += plan.getDuration(true) + "\n";                //获取时间
    output += "总路程为：" ;
    output += plan.getDistance(true) + "\n";             //获取距离
}
var transit = new BMap.DrivingRoute(map, {renderOptions: {map: map},
    onSearchComplete: searchComplete,
    onPolylinesSet: function(){        
        setTimeout(function(){alert(output)},"1000");
}});
transit.search("上地", "西单");
*/

