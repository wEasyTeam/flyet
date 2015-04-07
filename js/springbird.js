//全局游戏默认参数
var overoll = {
	canvasOffsetX: 0,
	canvasOffsetY: 0,
	canvasWidth: 600,
	canvasHeight: 430,
	Gap: 50,
	blankSpace: 100,//两个管道间的空白距离
	speedX: 50,//管道左移速度，每秒50像素
	speedY: 80,//小鸟下降速度
	liftHeight: 40,
	birdHeight: 40,
	birdLong: 40,
	pipeNum: 6,
	easyPx: 40//难度间隔，越大越简单。。
},
	presentPipe;

overoll.defaultPipe = {
	pipeHeight: 150,
	pipeWidth: 50,
	pipeoffsetX: overoll.canvasWidth,
	pipeoffsetY: 0,
	pipeGap: overoll.liftHeight + overoll.birdHeight + overoll.easyPx
}

presentPipe = overoll.defaultPipe

var pipeEntity = new Array(overoll.pipeNum),
	canvas = document.getElementById('main');
function initPipe() {
	for(var i = 0; i< overoll.pipeNum; i++) {
			pipeEntity[i] = new Array(2),
			pipeEntity[i][0] = document.createElement('div'),
			pipeEntity[i][1] = document.createElement('div'),
			pipeEntity[i][0].style.width = overoll.defaultPipe.pipeWidth + "px",
			pipeEntity[i][0].className = "rawPipe",
			
			pipeEntity[i][0].style.height = overoll.canvasHeight + "px",
			pipeEntity[i][0].style.top = "10000px",
			pipeEntity[i][1].style.width = overoll.defaultPipe.pipeWidth + "px",
			pipeEntity[i][1].className = "rawPipe",
			pipeEntity[i][1].style.height = overoll.canvasHeight + "px";
			pipeEntity[i][1].style.top = "10000px",
		canvas.appendChild(pipeEntity[i][0]);
		canvas.appendChild(pipeEntity[i][1]);
	}
}

(function backgrd() {
	function Pipe() {
		//上管道参数
		this.pipeHeight = 100,
		this.pipeWidth = 30,
		this.pipeoffsetX = 0,
		this.pipeoffsetY = 0,
		
		//通过上管道和管道间隙控制下管道
		this.pipeGap = overoll.Gap;
	}
	
	Pipe.prototype = {
		
		//先传入一个基线参数，生成一个样例作为lastPipe，然后通过create复制lastPipe的参数，
		//并且（在合理范围内）随机生成上方pipe的高度和gap大小，暂时不考虑随机生成管道宽度
		create: function(pipeFeature) {
			var newPipe = new Pipe(),
				feature;
			if(typeof pipeFeature !== 'object'){
				var lastPipe = pipeArray[pipeArray.length - 1];
				
				//设置管道一般参数
				newPipe.pipeWidth = lastPipe.pipeWidth;
				newPipe.pipeoffsetX = lastPipe.pipeoffsetX + lastPipe.pipeWidth + overoll.blankSpace;
				newPipe.pipeoffsetY = lastPipe.pipeoffsetY;
				newPipe.pipeGap = overoll.birdHeight + Math.round(Math.random()*overoll.liftHeight) + overoll.liftHeight + overoll.easyPx;
				
				//随机生成管道高度参数，以最后一个管道为参考点，防止生成的管道无法通过有效的操作通过
				newPipe.pipeHeight = Math.round(Math.random()*(overoll.canvasHeight - overoll.birdHeight - overoll.easyPx - overoll.liftHeight));
				if(overoll.speedY * overoll.blankSpace/overoll.speedX + lastPipe.pipeHeight <= newPipe.pipeHeight + overoll.easyPx) {
					newPipe.pipeHeight = overoll.speedY * overoll.blankSpace/overoll.speedX -
											overoll.easyPx + lastPipe.pipeHeight - Math.round(Math.random()*lastPipe.pipeHeight);
				} else if(newPipe.pipeHeight < overoll.easyPx) {
					newPipe.pipeHeight = overoll.easyPx;
				}
			}else {
				for(feature in pipeFeature) {
					if(newPipe.hasOwnProperty(feature)) {
						newPipe[feature] = pipeFeature[feature];
					}
				}
			}
			
			return newPipe;
		}
	}

	var pipeFather = new Pipe(),
		pipeArray,
		lastPipe,
		stepWidth = 1.5;//每次move移动的像素数
	
	function createPipe() {
		if(!pipeArray) {
			lastPipe = pipeFather.create(overoll.defaultPipe);
			pipeArray = new Array(overoll.pipeNum - 1);
			
		} else {
			lastPipe = pipeFather.create();
			pipeArray.shift();
		}
		pipeArray.push(lastPipe);
	}
	
	function movePipe() {
		//move
		//检测
		var lastPipe = pipeArray[pipeArray.length - 1];

		if(lastPipe.pipeoffsetX + lastPipe.pipeWidth + overoll.blankSpace <= overoll.canvasOffsetX + overoll.canvasWidth) {
			createPipe();
			//newPipeCreate = 1;
		}
		for(var i = 0; i < pipeArray.length; i++) {
			if(pipeArray[i]) {
				pipeArray[i].pipeoffsetX -= stepWidth;
				if(pipeArray[i].pipeoffsetX - E_T.offset.left < overoll.blankSpace) {
					presentPipe = pipeArray[i];
				}
			}
		}
		showPipe();
	}
	
	function showPipe() {
		for(var i = 0; i < pipeArray.length; i++) {
			if(pipeArray[i]) {
				pipeEntity[i][0].style.top = pipeArray[i].pipeHeight - overoll.canvasHeight + "px";
				pipeEntity[i][0].style.left = pipeArray[i].pipeoffsetX + "px";

				pipeEntity[i][1].style.top = pipeArray[i].pipeHeight + pipeArray[i].pipeGap + "px";
				pipeEntity[i][1].style.left = pipeArray[i].pipeoffsetX + "px";
			}
		}
	}
	window.createPipe = createPipe;
	window.movePipe = movePipe;
}(window, document));
