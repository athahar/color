
// Copyright 2010 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var canvas;
var context;
var canvasWidth = 490;
var canvasHeight = 220;
var padding = 25;
var lineWidth = 8;
var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var outlineImage = new Image();
var crayonImage = new Image();
var markerImage = new Image();
var eraserImage = new Image();
var crayonBackgroundImage = new Image();
var markerBackgroundImage = new Image();
var eraserBackgroundImage = new Image();
var crayonTextureImage = new Image();
var clickX = [];
var clickY = [];
var clickColor =[];
var clickTool = [];
var clickSize = [];
var clickDrag = [];
var paint = false;
var curColor = colorBrown;
var curTool = "crayon";
var curSize = "normal";
var mediumStartX = 18;
var mediumStartY = 19;
var mediumImageWidth = 93;
var mediumImageHeight = 46;
var drawingAreaX = 111;
var drawingAreaY = 11;
var drawingAreaWidth = 267;
var drawingAreaHeight = 200;
var toolHotspotStartY = 23;
var toolHotspotHeight = 38;
var sizeHotspotStartY = 157;
var sizeHotspotHeight = 36;
var sizeHotspotWidthObject = {};
sizeHotspotWidthObject.huge = 39;
sizeHotspotWidthObject.large = 25;
sizeHotspotWidthObject.normal = 18;
sizeHotspotWidthObject.small = 16;
var totalLoadResources = 8;
var curLoadResNum = 0;

var elementSrcOnCanvas = null;
/**
* Calls the redraw function after all neccessary resources are loaded.
*/
function resourceLoaded()
{
	if(++curLoadResNum >= totalLoadResources){
		redraw();
	}
}


function changeImage(elementToDraw){
	//$("#canvasDiv canvas")

	outlineImage.src =  elementSrcOnCanvas = elementToDraw;
	redraw();
}

function setColor(colorSelcted){
		curColor = colorSelcted;
}

function setSize(sizeSelected){
		curSize = sizeSelected;
}

function setTool(toolSelected){

	if(toolSelected == 'clearCanvas'){

		clearCanvas();

		// elementSrcOnCanvas saved while setting the img src in changeImage		
		changeImage(elementSrcOnCanvas);
		return;
	}
		curTool = toolSelected;
}


/**
* Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
*/
function prepareCanvas(elementToDraw)
{
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");



	outlineImage.src = elementToDraw;


	// Add mouse events
	// ----------------
	$('#canvas').mousedown(function(e)
	{
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		paint = true;
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		redraw();
	});
	$('#canvas').mousemove(function(e){
		if(paint){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	});
	$('#canvas').mouseup(function(e){
		paint = false;
		redraw();
	});
	$('#canvas').mouseleave(function(e){
		paint = false;
	});


}

/**
* Adds a point to the drawing array.
* @param x
* @param y
* @param dragging
*/
function addClick(x, y, dragging)
{
	clickX.push(x);
	clickY.push(y);
	// clickTool.push(curTool);	
	console.log('curColor - addclick: ' + curColor);
	if(curTool == "eraser"){
		clickColor.push("white");
	}else{
		clickColor.push(curColor);
	}
	//clickColor.push(curColor);
	clickSize.push(curSize);
	clickDrag.push(dragging);
}

/**
* Clears the canvas.
*/
function clearCanvas()
{

	clickX = [];
	clickY = [];
	clickDrag = [];

	context.fillStyle = '#ffffff'; // Work around for Chrome
	context.fillRect(0, 0, canvasWidth, canvasHeight); // Fill in the canvas with white
	canvas.width = canvas.width; // clears the canvas 

}

/**
* Redraws the canvas.
*/
function redraw(){

  canvas.width = canvas.width; // Clears the canvas
  context.strokeStyle = "#df4b26";
  context.lineJoin = "round";
  context.lineWidth = 5;
  var radius;

  for(var i=0; i < clickX.length; i++)
  {
	if(clickSize[i] == "small"){
		radius = 2;
	}else if(clickSize[i] == "normal"){
		radius = 5;
	}else if(clickSize[i] == "large"){
		radius = 10;
	}else if(clickSize[i] == "huge"){
		radius = 20;
	}else{
		alert("Error: Radius is zero for click " + i);
		radius = 0;
	}

    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.strokeStyle = clickColor[i];
     context.lineWidth = radius;
     context.stroke();
  }
  // if(curTool == "crayon") {
  //   context.globalAlpha = 0.4;
  //   context.drawImage(outlineImage, 0, 0, canvasWidth, canvasHeight);
  // }
  context.globalAlpha = 1;

  context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);

}
