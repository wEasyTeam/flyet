//h = 0.5 * g * t^2
var E_T = {
	upTime: 0.2,
	upCelerate: 0.7,
	downCelerate: 0.6,
	upSpeed: 0,
	max_upSpeed: 6,
	min_upSpeed: -8,
	downSpeed: 6,
	gameHeight: 450,
	gameTop: 10,
	imageWidth: 30,
	imageHeight: 30,
	dieImg: "img/et.gif",
	upImg: "img/up.gif",
	downImg: "img/down.gif",
	id: "",
	$elem: null,
	offset: {
		top: "",
		left: ""
	},
	
	init: function(fylId, up_speed, down_speed, top, left, image_width, image_height, new_image) {
		id = fylId;
		upSpeed = up_speed || 0;
		downSpeed = down_speed || 10;
		height = top || "100";
		E_T.imageWidth = image_width || 30;
		E_T.imageHeight = image_height || 30;
		newImage = new_image ||"/image2.png";
		E_T.$elem = $("#"+id);
		E_T.died = false;
		//
		E_T.$elem.css({
			"width": E_T.imageWidth,
			"height": E_T.imageHeight
		});
		E_T.$elem.attr({
			"width": E_T.imageWidth,
			"height": E_T.imageHeight,
		});
		
		$("#"+id).offset()
		
		// $("#"+id).css("top",(height || 250) +"px");
		// $("#"+id).css("left",(left || 250) +"px");
		E_T.offset = {
			top: $("#"+id).offset().top - $('#main').offset().top,
			left: $("#"+id).offset().left - $('#main').offset().left
		};
	},
	up: function() {
		if(E_T.offset.top < E_T.gameTop) {
			return ;
		}
		if(E_T.offset.top > E_T.gameHeight) {
			E_T.die();
			return ;
		}
		E_T.offset.top -= E_T.upSpeed;
		E_T.$elem.css("top", E_T.offset.top + "px");
	},
	down: function() {
		if(E_T.offset.top > E_T.gameHeight) {
			E_T.die();
			return ;
		}
		E_T.offset.top += E_T.downSpeed;
		E_T.$elem.css("top", E_T.offset.top + "px");
	},
	
	die: function() {
		if (!E_T.died) {
			E_T.died = true;
			$("#"+id).attr("src", E_T.dieImg);
		}
	},
	//modify at 2014/6/25 by:lvjs 修改对小鸟对键盘和点击事件的相应策略，重复点击不会累计，动画更加合理
	move: function () {
		if(playMode === 0) {
			if(E_T.upSpeed > E_T.min_upSpeed) {
				E_T.upSpeed -= E_T.downCelerate;
			}
		} else {
			if(keyInfo.space > 0 && E_T.upSpeed <= E_T.max_upSpeed) {
				E_T.upSpeed += E_T.upCelerate;
			} else if(keyInfo.space < 0 && E_T.upSpeed > E_T.min_upSpeed){
				E_T.upSpeed -= E_T.downCelerate;
			}
		}
		E_T.up();
	}
};
