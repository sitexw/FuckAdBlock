/*
FuckAdBlock 2.0
http://github.com/sitexw/FuckAdBlock
*/

function FuckAdBlock() {
	this.interval = 50;
	this.max = 200;
	this.end_reset = true;
	var start = false;
	var func_true = [];
	var func_false = [];
	var body = null;
	var div = null;
	var loop = null;
	var loo_n = null;
	var loop_func = function() {
		var div_temp = window.getComputedStyle(div,null);
		if(/about:abp/.test(div_temp.getPropertyValue('-moz-binding'))
		|| div_temp.getPropertyValue('display') == 'none'
		|| div_temp.getPropertyValue('visibility') == 'hidden') {
			exe(true);
		} else if(loo_n >= that.max) {
			exe(false);
		}
		loo_n += that.interval;
	}
	var exe = function(type) {
		if(type == true) {
			var array = func_true;
		} else {
			var array = func_false;
		}
		clearInterval(loop);
		body.removeChild(div);
		start = false;
		for(k in array) {
			array[k]();
		}
		if(that.end_reset == true) {
			func_true = [];
			func_false = [];
		}
	}
	this.add = function(type, func) {
		if(type == true) {
			func_true[func_true.length] = func;
		} else {
			func_false[func_false.length] = func;
		}
		return this;
	}
	this.check = function() {
		if(start == true) { return false; }
		start = true;
		div = document.createElement('div');
		div.setAttribute('class', 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links');
		div.setAttribute('style', 'width: 1px !important; height: 1px !important; position: absolute !important; left: -1000px !important; top: -1000px !important;');
		body.appendChild(div);
		loo_n = 0;
		loop = setInterval(loop_func, this.interval);
		loop_func();
	}
	var that = this;
	window.addEventListener('load', function() {
		body = document.getElementsByTagName('body')[0];
		setTimeout(function() {
			fuckAdBlock.check();
		}, 1);
	}, false);
}
var fuckAdBlock = new FuckAdBlock();
