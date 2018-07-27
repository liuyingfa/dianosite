var tween = {};

tween.timerScoll = null; //挂载整屏切换动画
tween.currentStep = "step1"; //初始为第一步

tween.init = function() {
	tween.resize();
	tween.event(); //配置事件
	tween.configAnmate(); //配置初始动画
	$("body").height(8500);
	tween.reverse3D('.start', '.state1', '.state2', 0.5);
	tween.reverse3D('.button1', '.state1', '.state2', 0.5);
	tween.reverse3D('.button2', '.state1', '.state2', 0.5);
	 
	tween.configTimeScorll(); //整屏切换配置项
	twoAnimate.init();
	threeAnimate.init();
	fiveAnimate.init();

}

$(document).ready(tween.init);

//配置初始动画
tween.configAnmate = function() {
	var initAnimate = new TimelineMax();
	//导航初始化
	initAnimate.to(".menu", 0.5, { opacity: 1 });
	initAnimate.to(".menu", 0.5, { left: 23 }, "-=0.2");
	initAnimate.to(".nav", 0.5, { opacity: 1 });
	//scene初始化主体窗口
	initAnimate.to(".scene1_logo", 0.5, { opacity: 1 });
	initAnimate.staggerTo(".scene1_1 img", 1, { opacity: 1, rotationX: 0, ease: Elastic.easeOut});
	initAnimate.to(".light_left", 0.5, { rotationZ: 0 }, "-=0.5");
	initAnimate.to(".light_right", 0.5, { rotationZ: 0 }, "-=0.5");
	initAnimate.to(".controls", 0.5, { opacity: 1 });
	//右侧滚动条
	initAnimate.to("body", 0, { "overflow-y": "scroll" });
}

tween.reverse3D = function(obj, element1, element2, d) {
	var reverse3DAnimate = new TimelineMax();
	var ele1 = $(obj).find(element1);
	var ele2 = $(obj).find(element2);
	reverse3DAnimate.to(ele1, 0, { rotationX: 0, transformPerspective: 600, transformOrigin: "center bottom" });
	reverse3DAnimate.to(ele2, 0, { rotationX: -90, transformPerspective: 600, transformOrigin: "top center" });

	$(obj).bind("mouseenter", function() {
		var enterAnimate = new TimelineMax();
		enterAnimate.to(ele1, d, { rotationX: 90, top: -ele1.height(),ease:Cubic.easeInOut }, 0);
		enterAnimate.to(ele2, d, { rotationX: 0, top: 0,ease:Cubic.easeInOut }, 0);
	});
	$(obj).bind("mouseleave", function() {
		var leaveAnimate = new TimelineMax();
		leaveAnimate.to(ele1, d, { rotationX: 0, top: 0 ,ease:Cubic.easeInOut}, 0);
		leaveAnimate.to(ele2, d, { rotationX: -90, top: ele2.height() ,ease:Cubic.easeInOut}, 0);
	});
}

//  y/Y 
tween.scale = function() {
	var maxH = $("body").height() - $(window).height();
	var scrolly = $(window).scrollTop();
	var scale = scrolly / maxH;
	return scale;
}

//导航内动画效果
tween.navAnmate = function() {
	var initAnimate = new TimelineMax();
	//导航标签
	$('.nav a').bind('mouseenter', function() {
		var w = $(this).width();
		var l = $(this).offset().left;
		initAnimate.clear();
		initAnimate.to('.line', 0.2, {
			left: l,
			opacity: 1,
			width: w
		});
	});
	$('.nav a').bind('mouseleave', function() {
		initAnimate.clear();
		initAnimate.to('.line', 0.2, {
			opacity: 0
		});
	});
	//导航下来列表
	var languageAnimate = new TimelineMax();
	$('.language').bind('mouseenter', function() {
		languageAnimate.clear();
		languageAnimate.to('.dropdown', 0.5, {
			"display": "block",
			opacity: 1
		});
	});
	$('.language').bind('mouseleave', function() {
		languageAnimate.clear();
		languageAnimate.to('.dropdown', 0.5, {
			"display": "none",
			opacity: 0
		});
	});

	$('.btn_mobile').bind('click', function() {
		var leftAnimate = new TimelineMax();
		leftAnimate.to('.left_nav', 1, {
			left: 0
		});
	});
	$('.l_close').bind('click', function() {
		var closeAnimate = new TimelineMax();
		closeAnimate.to('.left_nav', 1, {
			left: -300
		});

	});

}

//滚动条绑定当滚动条滚动的时候页面到达某个时间点   t/T=y/Y    T=t/y/Y（获得总时间点）
tween.scrollStatus = function() {
	var times = tween.scale() * tween.timerScoll.totalDuration();
	tween.timerScoll.seek(times, false);
}


//事件綁定處理
tween.event = function() {
	$(window).resize(tween.resize);
	//导航内移入移出效果
	tween.navAnmate();
	//防止刷新页面浏览器记录滚动条位置
	$(window).bind("scroll", scollFn);
	function scollFn() {
		$(window).scrollTop(0);
	}
	//滚动条绑定当滚动条滚动的时候页面到达某个时间点   t/t
	$(window).bind("scroll", tween.scrollStatus);
	//当在mousedown的时候就解除scroll对应事件函数
	$(window).bind("mousedown", function() {
		$(window).unbind("scroll", scollFn);
	});

	//当鼠标mouseup的时候  计算页面的位置  t/T=y/Y t=T*y/Y
	$(window).bind("mouseup", tween.mouseupFn);
	//给主体添加滚动先去掉浏览器默认滚动行为
	$('.wrapper').bind('mousewheel', function(e) {
		e.preventDefault();
	});
	$('.wrapper').one('mousewheel', mousewheelFn);
	var timer = null;

	function mousewheelFn(e, dir) {
		$(window).unbind("scroll", scollFn);
		if(dir < 1) {
			tween.changeStep('next');
		} else {
			tween.changeStep('perv');
		}
		//过1200ms后再次添加mousewheel事件
		clearInterval(timer);
		timer = setTimeout(function() {
			$('.wrapper').one('mousewheel', mousewheelFn);
		}, 1200);
	}
}
//当鼠标离开的时候
tween.mouseupFn = function() {
	var scale = tween.scale();
	var time = scale * tween.timerScoll.totalDuration();
	//根据计算的时间点获得状态
	var prevStep = tween.timerScoll.getLabelBefore(time);
	var nextStep = tween.timerScoll.getLabelAfter(time);
	//获取状态时间，获得时间差
	var prevTime = tween.timerScoll.getLabelTime(prevStep);
	var nextTime = tween.timerScoll.getLabelTime(nextStep);
	//计算差值
	var prevDvalue = Math.abs(prevTime - time);
	var nextDvalue = Math.abs(nextTime - time);

	/**
	 * 判断当前应该执行状态
	 */
	var step = "";
	if(scale == 0) {
		step = 'step1';
	} else if(scale == 1) {
		step = 'footer';
	} else if(prevDvalue < nextDvalue) {
		step = prevStep;
	} else {
		step = nextStep;
	}
	//滚动的动画
	tween.scrollAndStepAnm(step);
}

tween.scrollAndStepAnm = function(step) {
	//获取动画总时长 t/T(当前状态下动画执行时间/动画总时间/)=y/Y(滚动距离/滚动条滚动最大高度)   y=t/T*Y 比例运算获取滚动距离
	var getTotlTime = tween.timerScoll.totalDuration();//获取总时长
	var cStep = tween.timerScoll.getLabelTime(step);//获取当前时间
	//获取最大滚动距离
	var maxScroll = $("body").height() - $(window).height();
	//获取滚动距离
	var scrollY = cStep / getTotlTime * maxScroll;
	var d = Math.abs(tween.timerScoll.time() - cStep);
	var scrollAnmate = new TimelineMax();
	scrollAnmate.to('html,body', d, {
		scrollTop: scrollY
	});
	tween.timerScoll.tweenTo(cStep);
	//记录当前状态值
	tween.currentStep = step;
}

//图片切换实例 并且计算滚动条距离
tween.changeStep = function(value) {
	if(value === 'next') {
		var getCurrentTime = tween.timerScoll.getLabelTime(tween.currentStep); //获取当前时间
		var afterStep = tween.timerScoll.getLabelAfter(getCurrentTime);//获取下个状态

		if(!afterStep) return;
		//获取动画总时长 t/T(当前状态下动画执行时间/动画总时间/)=y/Y(滚动距离/滚动条滚动最大高度)   y=t/T*Y 比例运算获取滚动距离
		var getTotlTime = tween.timerScoll.totalDuration();
		var afterTime = tween.timerScoll.getLabelTime(afterStep);
		//获取最大滚动距离
		var maxScroll = $("body").height() - $(window).height();
		//获取滚动距离
		var scrollY = afterTime / getTotlTime * maxScroll;
		//滚动条滚动时间
		var d = Math.abs(tween.timerScoll.time() - afterTime);
		var scrollAnmate = new TimelineMax();
		//滚动条运动
		scrollAnmate.to('html,body', d, {
			scrollTop: scrollY
		});
		//记录当前状态值
		tween.currentStep = afterStep;

	} else {
		var getCurrentTime = tween.timerScoll.getLabelTime(tween.currentStep);
		var beforeStep = tween.timerScoll.getLabelBefore(getCurrentTime);

		if(!beforeStep) return;
		//获取动画总时长 t/T(当前状态下动画执行时间/动画总时间/)=y/Y(滚动距离/滚动条滚动最大高度)   y=t/T*Y 比例运算获取滚动距离
		var getTotlTime = tween.timerScoll.totalDuration();
		var beforeTime = tween.timerScoll.getLabelTime(beforeStep);
		//获取最大滚动距离
		var maxScroll = $("body").height() - $(window).height();
		//获取滚动距离
		var scrollY = beforeTime / getTotlTime * maxScroll;
		var d = Math.abs(tween.timerScoll.time() - beforeTime);
		var scrollAnmate = new TimelineMax();
		scrollAnmate.to('html,body', d, {
			scrollTop: scrollY
		});

		tween.currentStep = beforeStep;
	}

}

//配置整屏切换主动画中每一屏动画
tween.configTimeScorll = function() {
	var time = tween.timerScoll ? tween.timerScoll.time() : 0;
	if(tween.timerScoll) {
		tween.timerScoll.clear();
	}
	tween.timerScoll = new TimelineMax();
	
	tween.timerScoll.to('.scene1',0,{onReverseComplete:function(){
		 twoAnimate.timeline.seek(0);
	}},0);
	
	tween.timerScoll.to('.footer',0,{top:'100%'});
	
	tween.timerScoll.add('step1');
	//切换屏幕动画效果
	tween.timerScoll.to('.scene2', 1, { top: 0 });
	//切换第二屏的菜单3d翻转效果
	tween.timerScoll.to({}, 0.3, {
		onComplete: function() {
             menu.changeMenu("menu_state2");//切换到第二屏调用函数，
		},
		onReverseComplete: function() {
			//回退到第一屏
            menu.changeMenu("menu_state1");
		}
	},'-=0.3s');
	//当切换第二屏的时候翻转第二屏动画
	tween.timerScoll.to({},0.3,{onComplete:function(){
		console.log('statatat');
		twoAnimate.timeline.tweenTo("state1");
	}},"-=0.3s");
 
	tween.timerScoll.add('step2');
	//配置第二屏动画 start
	tween.timerScoll.to({},0,{onComplete:function(){
		twoAnimate.timeline.tweenTo("state2");
	},onReverseComplete:function(){
		twoAnimate.timeline.tweenTo("state1");
	}})
	tween.timerScoll.to({},0.4,{});
	tween.timerScoll.add('point1');
		tween.timerScoll.to({},0,{onComplete:function(){
		twoAnimate.timeline.tweenTo("state3");
	},onReverseComplete:function(){
		twoAnimate.timeline.tweenTo("state2");
	}})
	tween.timerScoll.to({},0.4,{});
	tween.timerScoll.add('point2');
		tween.timerScoll.to({},0,{onComplete:function(){
		twoAnimate.timeline.tweenTo("state4");
	},onReverseComplete:function(){
		twoAnimate.timeline.tweenTo("state3");
	}})
	tween.timerScoll.to({},0.4,{});
	tween.timerScoll.add('point3');
	
	//end
	 
	
	
	tween.timerScoll.to('.scene3', 1, { top: 0,onReverseComplete:function(){
		threeAnimate.timeline.seek(0,false);
	}});
	tween.timerScoll.to({}, 0.1, {
		onComplete: function() {
             menu.changeMenu("menu_state3");
		},
		onReverseComplete: function() {
            menu.changeMenu("menu_state2");
		}
	},'-=0.2');
	//第3屏动画效果
    tween.timerScoll.to({},0.1,{
    	onComplete:function(){
    		threeAnimate.timeline.tweenTo("threeStep1");
    	}
    },'-=0.2');
	tween.timerScoll.add('step3');
		tween.timerScoll.to({},0.4,{onComplete:function(){
		threeAnimate.timeline.tweenTo("threeStep2");
	},onReverseComplete:function(){
		threeAnimate.timeline.tweenTo("threeStep1");
	}})
	tween.timerScoll.to({},0.4,{});
	tween.timerScoll.add('threeStep');

	tween.timerScoll.to('.scene4', 0.8, { top: 0,ease:Cubic.easeInOut });
	tween.timerScoll.add('step4');
	//滚动第五屏幕时，让第四屏幕滚出屏幕外
	tween.timerScoll.to('.scene4', 0.5, { top: -$(window).height(),ease:Cubic.easeInOut });
	tween.timerScoll.to('.scene5', 0.5, {top: 0, 
		onReverseComplete:function(){
		fiveAnimate.timeline.seek(0,false);
		},
		ease:Cubic.easeInOut},'-=0.5');
	tween.timerScoll.to({},0,{onComplete:function(){
		console.log(5);
		fiveAnimate.timeline.tweenTo('fiveStatus');
	}},'-=0.5')
	tween.timerScoll.add('step5');
	
	tween.timerScoll.to('.scene5',0.5,{top:-$('.footer').height(),ease:Cubic.easeInOut});
	tween.timerScoll.to('.footer',0.5,{top:$(window).height()-$('.footer').height(),ease:Cubic.easeInOut},'-=0.5');
	tween.timerScoll.add('footer');
	tween.timerScoll.stop();
	//当改变浏览器大小时，让动画走的之前已到达时间点
	tween.timerScoll.seek(time);
}

//设置每一屏的高度和top值
tween.resize = function() {

	$('.scene').height($(window).height());
	$(".scene:not(':first')").css('top', $(window).height());
	if($(window).width() < 950) {
		$("body").addClass("r950");
		$(".menu").css("top", 0);

	} else {
		$("body").removeClass("r950");
		$(".menu").css("top", 22);
	}
	tween.configTimeScorll();
}
//配置第二屏幕动画
var twoAnimate={}
twoAnimate.timeline=new TimelineMax();
twoAnimate.init=function(){
	twoAnimate.timeline.staggerTo('.scene2_1 img',1.5,{opacity:1,rotationX:0,ease:Elastic.easeOut},0.1);
	//初始化按钮组
	twoAnimate.timeline.to(".points",0.2,{bottom:20},'-=1');
	twoAnimate.timeline.to(".scene2 .point0 .text",0.1,{opacity:1});
	twoAnimate.timeline.to(".scene2 .point0 .point_icon",0.1,{"background-position":"right top"});
	twoAnimate.timeline.add('state1');
	//页面动画
	twoAnimate.timeline.staggerTo('.scene2_1 img',0.4,{opacity:0,rotationX:90},0.1);
	twoAnimate.timeline.staggerTo('.scene2_2 .left',0.4,{opacity:1});
	twoAnimate.timeline.staggerTo('.scene2_2 .right img',0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut})
	//第二个按钮
	twoAnimate.timeline.to('.scene2 .point .text',0,{opacity:0},"-=0.4");
	twoAnimate.timeline.to('.scene2 .point .point_icon',0,{"background-position":"left top"},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point1 .text",0.1,{opacity:1});
	twoAnimate.timeline.to(".scene2 .point1 .point_icon",0.1,{"background-position":"right top"});
	
	twoAnimate.timeline.add('state2');
	twoAnimate.timeline.staggerTo('.scene2_2 .left',0.4,{opacity:0});
	twoAnimate.timeline.staggerTo('.scene2_2 .right img',0.3,{opacity:0,rotationX:90,ease:Cubic.easeInOut});
	twoAnimate.timeline.staggerTo('.scene2_3 .left',0.4,{opacity:1});
	twoAnimate.timeline.staggerTo('.scene2_3 .right img',0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut});
    
    //第三个按钮
	twoAnimate.timeline.to('.scene2 .point .text',0,{opacity:0},"-=0.4");
	twoAnimate.timeline.to('.scene2 .point .point_icon',0,{"background-position":"left top"},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point2 .text",0.1,{opacity:1});
	twoAnimate.timeline.to(".scene2 .point2 .point_icon",0.1,{"background-position":"right top"});
  
	twoAnimate.timeline.add('state3');
	twoAnimate.timeline.staggerTo('.scene2_3 .left',0.4,{opacity:0});
	twoAnimate.timeline.staggerTo('.scene2_3 .right img',0.3,{opacity:0,rotationX:90,ease:Cubic.easeInOut});
	twoAnimate.timeline.staggerTo('.scene2_4 .left',0.4,{opacity:1});
	twoAnimate.timeline.staggerTo('.scene2_4 .right img',0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut});
     
     //第三个按钮
	twoAnimate.timeline.to('.scene2 .point .text',0,{opacity:0},"-=0.4");
	twoAnimate.timeline.to('.scene2 .point .point_icon',0,{"background-position":"left top"},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point3 .text",0.1,{opacity:1});
	twoAnimate.timeline.to(".scene2 .point3 .point_icon",0.1,{"background-position":"right top"});
    twoAnimate.timeline.add('state4');
    twoAnimate.timeline.stop();
}

//配置第三屏幕动画
var threeAnimate = {};
threeAnimate.timeline=new TimelineMax();
threeAnimate.init =function(){
	
	//把第三屏幕里面所有图片翻转-90，透明度为0
	threeAnimate.timeline.to(".scene3 .step img",0,{opacity:0,rotationX:-90,transformPerspective:600,transformOrigin:"center center"})
	threeAnimate.timeline.to(".scene3 .step3_1 img",0.5,{opacity:1,rotationX:0,ease:Cubic.easeInOut});
	threeAnimate.timeline.add("threeStep1");
	
	threeAnimate.timeline.to(".scene3 .step3_1 img",0.5,{opacity:0,rotationX:-90,ease:Cubic.easeInOut});
	threeAnimate.timeline.to(".scene3 .step3_2 img",0.5,{opacity:1,rotationX:0,ease:Cubic.easeInOut});
	threeAnimate.timeline.add("threeStep2");
	threeAnimate.timeline.stop();
	
}
//配置第五屏动画
var fiveAnimate={};
fiveAnimate.timeline=new TimelineMax();
fiveAnimate.init=function(){
	//初始化页面元素
	fiveAnimate.timeline.to('.scene5 .area_content img,.scene5 .button1,.scene5 .button2',0,{opacity:0,rotationX:-90,transformPerspective:600,transformOrigin:"center center"});
	fiveAnimate.timeline.to('.scene5 .scene5_img',0,{top:-220})
	fiveAnimate.timeline.to('.scene5 .scene5_img', 0.5,{top:0,ease:Cubic.easeInOut})
	
	fiveAnimate.timeline.to('.scene5 .area_content img,.scene5 .button1,.scene5 .button2',1,{rotationX:0,opacity:1,ease:Elastic.easeOut},0.2)
	fiveAnimate.timeline.to('.scene5 .lines',0.5,{opacity:1})
	fiveAnimate.timeline.add('fiveStatus');
	fiveAnimate.timeline.stop();
}

//实现导航条3d翻转动画
var menu = {};
//每滚动一屏的时候，就调用这个函数实现3d翻转具体细节
menu.changeMenu = function(stateClass) {
	 var oldMenu=$(".menu");
	 var newMenu =oldMenu.clone();
	 
	 newMenu.removeClass("menu_state1").removeClass("menu_state2").removeClass("menu_state3");
	 newMenu.addClass(stateClass);
	 //清除老导航条
	 oldMenu.addClass("removeMenu");
	 $(".menu_wrapper").append(newMenu);
	 
	 //导航条内动画
	 tween.navAnmate();
	 tween.reverse3D('.start', '.state1', '.state2', 0.5);
	 
	 var menAnimate =new TimelineMax();
	 menAnimate.to(newMenu,0,{top:100, rotationX:-90 ,transformPerspective:600,transformOrigin:"top center"});
	 menAnimate.to(oldMenu,0,{top:22, rotationX:0,transformPerspective:600,transformOrigin:"center bottom"});
	 menAnimate.to(oldMenu,0.3,{top:-55, rotationX:90,ease:Cubic.easeInOut,onComplete:function(){
	 	$(".removeMenu").remove();
	 } }  );
	 menAnimate.to(newMenu,0.3,{rotationX:0,top:22 ,ease:Cubic.easeInOut},'-=0.3'  );

}