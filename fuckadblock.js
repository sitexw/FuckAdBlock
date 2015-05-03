/*
FuckAdBlock 3.1.0
http://github.com/sitexw/FuckAdBlock
*/

(function(window) {
	var FuckAdBlock = function(options) {
		this._options = {
			checkOnLoad:		false,
			resetOnEnd:			false,
			loopCheckTime:		50,
			loopMaxNumber:		5,
			baitClass:			'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links',
			baitStyle:			'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;'
		};
		this._var = {
			version:			'3.1.0',
			bait:				null,
			checking:			false,
			loop:				null,
			loopNumber:			0,
			event:				{ detected: [], notDetected: [] }
		};
		if(options !== undefined) {
			this.setOption(options);
		}
		var self = this;
		if(self._options.checkOnLoad === true) {
			var eventCallback = function() {
				setTimeout(function() {
						if(self._var.bait === null) {
							self._createBait();
						}
						setTimeout(function() {
							self.check();
						}, 1);
					
				}, 1);
			};
			if(window.addEventListener !== undefined) {
				window.addEventListener('load', eventCallback, false);
			} else {
				window.attachEvent('onload', eventCallback);
			}
		}
	};
	FuckAdBlock.prototype._options = null;
	FuckAdBlock.prototype._var = null;
	FuckAdBlock.prototype._bait = null;
	
	FuckAdBlock.prototype.setOption = function(options, value) {
		if(value !== undefined) {
			var key = options;
			options = {};
			options[key] = value;
		}
		for(var option in options) {
			this._options[option] = options[option];
		}
		return this;
	};

	FuckAdBlock.prototype._createBait = function() {
		var bait = document.createElement('div');
		bait.setAttribute('class', this._options.baitClass);
		bait.setAttribute('style', this._options.baitStyle);
		this._var.bait = window.document.body.appendChild(bait);

		this._var.bait.offsetParent;
		this._var.bait.offsetHeight;
		this._var.bait.offsetLeft;
		this._var.bait.offsetTop;
		this._var.bait.offsetWidth;
		this._var.bait.clientHeight;
		this._var.bait.clientWidth;
	};
	FuckAdBlock.prototype._destroyBait = function() {
		window.document.body.removeChild(this._var.bait);
		this._var.bait = null;
	};
	
	FuckAdBlock.prototype.check = function(loop) {
		if(loop === undefined) {
			loop = true;
		}

		if(this._var.checking === true) {
			return false;
		}
		this._var.checking = true;

		if(this._var.bait === null) {
			this._createBait();
		}

		var self = this;
		this._var.loopNumber = 0;
		if(loop === true) {
			this._var.loop = setInterval(function() {
				self._checkBait(loop);
			}, this._options.loopCheckTime);
		}
		this._checkBait(loop);

		return true;
	};
	FuckAdBlock.prototype._checkBait = function(loop) {
		var detected = false;

		if(this._var.bait === null) {
			this._createBait();
		}

		if(window.document.body.getAttribute('abp') !== null
		|| this._var.bait.offsetParent === null
		|| this._var.bait.offsetHeight == 0
		|| this._var.bait.offsetLeft == 0
		|| this._var.bait.offsetTop == 0
		|| this._var.bait.offsetWidth == 0
		|| this._var.bait.clientHeight == 0
		|| this._var.bait.clientWidth == 0) {
			detected = true;
		}
		if(window.getComputedStyle !== undefined) {
			var baitTemp = window.getComputedStyle(this._var.bait, null);
			if(baitTemp.getPropertyValue('display') == 'none'
			|| baitTemp.getPropertyValue('visibility') == 'hidden') {
				detected = true;
			}
		}

		if(loop === true) {
			this._var.loopNumber++;
			if(this._var.loopNumber >= this._options.loopMaxNumber) {
				clearInterval(this._var.loop);
				this._var.loop = null;
				this._var.loopNumber = 0;
			}
		}

		if(detected === true) {
			if(loop === true) {
				this._var.checking = false;
			}
			this._destroyBait();
			this.emitEvent(true);
		} else if(this._var.loop === null || loop === false) {
			if(loop === true) {
				this._var.checking = false;
			}
			this._destroyBait();
			this.emitEvent(false);
		}
	};
	
	FuckAdBlock.prototype.emitEvent = function(detected) {
		var fns = this._var.event[(detected===true?'detected':'notDetected')];
		for (var i=0;i<fns.length;i++)
		{
			fns[i]();
		}
		if(this._options.resetOnEnd === true) {
			this.clearEvent();
		}
		return this;
	};
	FuckAdBlock.prototype.clearEvent = function() {
		this._var.event.detected = [];
		this._var.event.notDetected = [];
	};
	
	FuckAdBlock.prototype.on = function(detected, fn) {
		this._var.event[(detected===true?'detected':'notDetected')].push(fn);
		return this;
	};
	FuckAdBlock.prototype.onDetected = function(fn) {
		return this.on(true, fn);
	};
	FuckAdBlock.prototype.onNotDetected = function(fn) {
		return this.on(false, fn);
	};
	
	window.FuckAdBlock = FuckAdBlock;
	
	if(window.fuckAdBlock === undefined) {
		window.fuckAdBlock = new FuckAdBlock({
			checkOnLoad: true,
			resetOnEnd: true
		});
	}
})(window);
