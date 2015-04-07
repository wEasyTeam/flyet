var conut = 0,
	keyInfo = {
		'space': 0,
		'click': 0
	},
	repeatTime = 30,
	initUpSpd = 9,
	playMode = 0;

function checkETAndGround(game) {
	if (E_T.died) {
		game.end();
	}
}
function checkETAndPipe(game) {
	if (presentPipe.pipeHeight !== 0 && 
			(presentPipe.pipeoffsetX < E_T.offset.left + E_T.imageWidth)) {
		
		if (!game.scored) {
			game.updateScores();
			game.scored = true;
		}
		
		if (presentPipe.pipeHeight >= E_T.offset.top) {
			E_T.die();
			game.end();
		} else if ((presentPipe.pipeHeight + presentPipe.pipeGap) <=
				(E_T.imageWidth + E_T.offset.top)) {
			E_T.die();
			game.end();
		}
	} else {
		if (game.scored) {
			game.scored = false;
		}
	}

}

function ETfly() {
	this.going = false;
	this.started = false;
	this.ready = false;
	this.scored = false;
}

ETfly.prototype = {
	start: function () {
		this.going = true;
		if (!this.started) {
			// 初始化 E.T
			E_T.init('fly-et');
			
			// 初始化障碍物
			initPipe();
			createPipe();
			roll();
			this.moveAll();
		}
		this.started = true;
		
	},
	
	restart: function () {
		this.going = true;
		if (!this.started) {
			$('#fly-en').removeAttr('style');
			// 初始化 E.T
			E_T.init('fly-et');
			
			// 初始化障碍物
			initPipe();
			createPipe();
		
			this.moveAll();
		}
		this.started = true;
		
	},
	
	pause: function () {
		this.going = false;
		clearTimeout(goRoll);
	},
	
	end: function () {
		this.going = false;
		$('#over').removeClass('none');
		$('#score').text($("#mark").text());
		$("#mark").addClass('none');
		clearTimeout(goRoll);
		$('#restart-game').focus();
		// 执行画面跳转到 “开始界面”
	},
	
	updateScores: function () {
		var score = parseInt($("#mark").text(), 10);
		
		$("#mark").text(score + 1);
	},
	
	region: function () {
		checkETAndGround(this);
		checkETAndPipe(this);
	},
	
	moveAll: function() {
		var now = new Date(),
			leaveTime,
			that = this;
			
		if(!this.going) {
			return false;
		}
		
		// 执行所有对象移动
		E_T.move();
		movePipe();
		
		// 执行碰撞检测
		this.region();
		
		leaveTime = repeatTime - (new Date() - now);
		leaveTime = leaveTime > 0 ? leaveTime : 0;
		
		setTimeout(function () {
			that.moveAll();
		}, leaveTime);
	}
};
function setCookie(name,value){ 
　　var exp = new Date(); 
　　exp.setTime(exp.getTime() + 1*60*60*1000);//有效期1小时 
　　document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
}

//取得cookie  
function getCookie(name) {  
	 var nameEQ = name + "=";  
	 var ca = document.cookie.split(';');    //把cookie分割成组  
	 for(var i=0;i < ca.length;i++) {  
		 var c = ca[i];                      //取得字符串  
		 while (c.charAt(0)==' ') {          //判断一下字符串有没有前导空格  
			 c = c.substring(1,c.length);      //有的话，从第二位开始取  
		 }  
		 if (c.indexOf(nameEQ) == 0) {       //如果含有我们要的name  
			return unescape(c.substring(nameEQ.length,c.length));    //解码并截取我们要值  
		 }  
	 }  
	 return false;  
}

(function() {
	var fET = new ETfly();

	function initView() {
		// 显示开始界面
		
		//初始化 外星人，背景以及障碍物
	}
	
	function initControl() {
		$('#change-mode').on('change', function() {
			playMode = parseInt(this.value);
			setCookie('playMode', playMode);
		});
		playMode = getCookie('playMode');
		$('#change-mode').val(playMode);

		$(document).on('mousedown', function (e) {
		
		//e.preventDefault();
			if(fET.started) {
				if(playMode == 0) {
					E_T.upSpeed = initUpSpd;
				} else {
					keyInfo.space = 1;
				}
				
			// 开始游戏前第一次点击
			} else if (fET.ready) {
				fET.start();
				$(".ready, .figure").addClass('none');
			}
		});
		$(document).on('mouseup', function(){
				keyInfo.space = -1;
		});
		$(document).on('keydown', function (e) {
			var keyNum = '' + e.which;
			
			if (keyNum === '32') {
				e.preventDefault();
				if(fET.started) {
					
					//modify at 2014/6/25 (+= -> =, delete addup clicks or keydowns)
					if(playMode == 0) {
						E_T.upSpeed = initUpSpd;
					} else {
						keyInfo.space = 1;
					}

				// 开始游戏前第一次点击
				} else if (fET.ready) {
					fET.start();
					$(".ready, .figure").addClass('none');
				}
			}
		});
		$(document).on('keyup', function() {
				keyInfo.space = -1;
		})
		
		// 给开始安钮添加 启动游戏 画布事件
		$('#start-game').on('click', function () {
			// 执行画面跳转到 “准备开始界面”
			$("#begin").removeClass('none');
			$('#index').addClass('none');
			$('#about-us').addClass("none");
			fET.ready = true;
		}).focus();
	
		$('#restart-game').on('click', function () {
			window.location.reload();
		});
	}
	
	$(function() {
		initView();
		initControl();
	});
}());



