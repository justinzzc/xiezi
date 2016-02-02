/**
 * Created by zhongzhuo on 2016/2/2.
 */
var canvasWidth =Math.min(600,$(window).width()-20)
var canvasHeight = canvasWidth;

var canvas = document.getElementById("canvas");
var cxt = canvas.getContext("2d");

var strokeColor = "black"
var isMoused = false;
var lastLoc = {x:0,y:0};
var lastTime = 0;
var lastLineWidth = -1;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

$(".control").css("width",canvasWidth+"px");
drawGrid();
$("#clear").click(function(){
    cxt.clearRect(0,0,canvasWidth,canvasHeight);
    drawGrid();
});
$(".color-btn").click(function(){
    $(".color-btn").removeClass("select-btn");
    $(this).addClass("select-btn");
    strokeColor = $(this).css("background-color");
});
function beginStroke(point){
    isMoused = true;
    lastLoc = windowToCanvas(point.x, point.y);
    lastTime = new Date().getTime();
}
function endStroke(){
    isMoused = false;
    lastLineWidth = -1;
}
function moveStroke(point){
    var curLoc = windowToCanvas(point.x, point.y);
    var curTime = new Date().getTime();
    var s = calcDistance(lastLoc.x,lastLoc.y,curLoc.x,curLoc.y);
    var t = (curTime - lastTime) == 0 ? 1 : (curTime - lastTime);
    var lineWidth = calcLineWidth(t,s);
    console.log(lineWidth);
    cxt.beginPath();
    cxt.moveTo(lastLoc.x,lastLoc.y);
    cxt.lineTo(curLoc.x,curLoc.y);
    cxt.strokeStyle = strokeColor;
    cxt.lineWidth = lineWidth;
    cxt.lineCap = "round";
    cxt.lineJoin = "round";
    cxt.stroke();
    lastLoc = curLoc;
    lastTime = curTime;
    lastLineWidth = lineWidth;
}
canvas.onmousedown = function(e){
    e.preventDefault();
    beginStroke({x:e.clientX,y:e.clientY});
};
canvas.onmouseup = function(e){
    e.preventDefault();
    endStroke()
};
canvas.onmouseout = function(e){
    e.preventDefault();
    endStroke();
};
canvas.onmousemove = function(e){
    e.preventDefault();
    if(isMoused){
        moveStroke({x:e.clientX,y:e.clientY});
    }
};
canvas.addEventListener("touchstart",function(e){
    e.preventDefault();
    touch = e.touches[0];
    beginStroke({x:touch.pageX,y:touch.pageY});
});
canvas.addEventListener("touchmove",function(e){
    e.preventDefault();
    if(isMoused){
        touch = e.touches[0];
        moveStroke({x:touch.pageX,y:touch.pageY});
    }
});
canvas.addEventListener("touchend",function(e){
    e.preventDefault();
    endStroke();
});

var minV = 0.1;
var maxV = 10;
var minLineWidth = 1;
var maxLineWidth = 30;
function calcLineWidth(t,s){
    var v = s/t;
    var resultLineWidth = 0;
    if(v <= minV){
        resultLineWidth = maxLineWidth;
    }else if(v >= maxV){
        resultLineWidth = minLineWidth;
    }else{
        resultLineWidth = maxLineWidth - (v-minV)/(maxV-minV)*(maxLineWidth-minLineWidth);
    }
    if(lastLineWidth == -1){
        return resultLineWidth;
    }else{
        return lastLineWidth*2/3 + resultLineWidth/3;
    }
}

function calcDistance(x1,y1,x2,y2){
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function windowToCanvas(x,y){
    var bbox = canvas.getBoundingClientRect();
    return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)};
}

function drawGrid(){
    cxt.save();
    cxt.strokeStyle = "rgb(230,11,9)";

    cxt.beginPath();
    cxt.moveTo(3,3);
    cxt.lineTo(canvasWidth-3,3);
    cxt.lineTo(canvasWidth-3,canvasHeight-3);
    cxt.lineTo(3,canvasHeight-3);
    cxt.closePath();
    cxt.lineWidth = 6;
    cxt.stroke();

    cxt.beginPath();
    /*cxt.moveTo(0,0);
    cxt.lineTo(canvasWidth,canvasHeight);

    cxt.moveTo(0,canvasHeight);
    cxt.lineTo(canvasWidth,0);

    cxt.moveTo(canvasWidth/2,0);
    cxt.lineTo(canvasWidth/2,canvasHeight);

    cxt.moveTo(0,canvasHeight/2);
    cxt.lineTo(canvasWidth,canvasHeight/2);*/

    drawDashLine(cxt,0,0,canvasWidth,canvasHeight);
    drawDashLine(cxt,0,canvasHeight,canvasWidth,0);
    drawDashLine(cxt,canvasWidth/2,0,canvasWidth/2,canvasHeight);
    drawDashLine(cxt,0,canvasHeight/2,canvasWidth,canvasHeight/2);

    cxt.lineWidth = 1;
    cxt.stroke();

    cxt.restore();
}

function drawDashLine(ctx, x1, y1, x2, y2, dashLength){
    var dashLen = dashLength === undefined ? 5 : dashLength,
        xpos = x2 - x1, //得到横向的宽度;
        ypos = y2 - y1, //得到纵向的高度;
        numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
    //利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
    for(var i=0; i<numDashes; i++){
        if(i % 2 === 0){
            ctx.moveTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i);
            //有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
        }else{
            ctx.lineTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i);
        }
    }
    //ctx.stroke();
}