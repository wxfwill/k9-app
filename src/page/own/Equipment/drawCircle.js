//画圆
var drawCircle = function() {
    context.beginPath();
    context.arc(150, 100, radius, 0, Math.PI * 2);
    context.closePath();
    context.lineWidth = 2; //线条宽度
    context.strokeStyle = 'rgba(250,250,50,1)'; //颜色
    context.stroke();
    radius += 0.5; //每一帧半径增加0.5

    //半径radius大于30时，重置为0
    if (radius > 30) {
        radius = 0;
    }
};

//创建一个临时canvas来缓存主canvas的历史图像
var backCanvas = document.createElement('canvas'),
    backCtx = backCanvas.getContext('2d');
    backCanvas.width = width;
    backCanvas.height = height;

    //设置主canvas的绘制透明度
    context.globalAlpha = 0.95;

    //显示即将绘制的图像，忽略临时canvas中已存在的图像
    backCtx.globalCompositeOperation = 'copy';

var render = function() {
    //1.先将主canvas的图像缓存到临时canvas中
    backCtx.drawImage(canvas, 0, 0, width, height);

    //2.清除主canvas上的图像
    context.clearRect(0, 0, width, height);

    //3.在主canvas上画新圆
    drawCircle();

    //4.等新圆画完后，再把临时canvas的图像绘制回主canvas中
    context.drawImage(backCanvas, 0, 0, width, height);
};

