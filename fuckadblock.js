/*
 * FuckAdBlock 4.0.0-beta.2
 * Copyright (c) 2014-2015 Valentin Allaire <valentin.allaire@sitexw.fr>
 * Released under the MIT license
 * https://github.com/sitexw/FuckAdBlock
 */

(function(window, instanceName, className) {
	var FuckAdBlockOption = function(options) {
		this.setOption(options||{});
	};
	FuckAdBlockOption.prototype.option = null;
	FuckAdBlockOption.prototype.setOption = function(key, value) {
		if(this.option === null) {
			this.option = {};
		}
		var options = {};
		if(typeof key !== 'string' && value === undefined) {
			options = key;
		} else {
			options[key] = value;
		}
		for(var key in options) {
			this.option[key] = options[key];
		}
		return this;
	};
	FuckAdBlockOption.prototype.getOption = function(key) {
		if(this.option === null) {
			return undefined;
		}
		var value = this.option[key];
		if(typeof value === 'function') {
			return value(this);
		} else {
			return value;
		}
	};
	
	
	var FuckAdBlockPlugin = function() {
		FuckAdBlockOption.apply(this, arguments);
		this._data = {};
	};
	FuckAdBlockPlugin.prototype = Object.create(FuckAdBlockOption.prototype);
	FuckAdBlockPlugin.prototype.constructor = FuckAdBlockPlugin;
	FuckAdBlockPlugin.prototype.debug = false,
	FuckAdBlockPlugin.prototype._data = null,
	FuckAdBlockPlugin.prototype.callbackDetected = null,
	FuckAdBlockPlugin.prototype.callbackUndetected = null,
	FuckAdBlockPlugin.prototype.setDetected = function(callback) {
		this.callbackDetected = callback;
		return this;
	};
	FuckAdBlockPlugin.prototype.callDetected = function(callback) {
		if(typeof this.callbackDetected !== 'function') {
			return false;
		}
		this.callbackDetected();
		this.callbackDetected = null;
		return true;
	};
	FuckAdBlockPlugin.prototype.setUndetected = function(callback) {
		this.callbackUndetected = callback;
		return this;
	};
	FuckAdBlockPlugin.prototype.callUndtected = function(callback) {
		if(typeof this.callbackUndetected !== 'function') {
			return false;
		}
		this.callbackUndetected();
		this.callbackUndetected = null;
		return true;
	};
	FuckAdBlockPlugin.prototype.name = null;
	FuckAdBlockPlugin.prototype.start = null;
	FuckAdBlockPlugin.prototype.stop = null;
	
	
	var FuckAdBlock = function() {
		this.setOption({
			timeout: 200,
		});
		FuckAdBlockOption.apply(this, arguments);
		this._event = {};
	};
	FuckAdBlock.prototype = Object.create(FuckAdBlockOption.prototype);
	FuckAdBlock.prototype.constructor = FuckAdBlock;
	FuckAdBlock.prototype._version = [4, 0, 0, 'beta', 2];
	FuckAdBlock.prototype._event = null;
	FuckAdBlock.prototype.Plugin = FuckAdBlockPlugin;
	FuckAdBlock.prototype._pluginClass = {};
	FuckAdBlock.prototype.registerPlugin = function(Class) {
		if(this._pluginClass[Class.prototype.name] === undefined) {
			this._pluginClass[Class.prototype.name] = Class;
			return true;
		}
		return false;
	};
	FuckAdBlock.prototype.addEvent = function(name, callback) {
		if(this._event[name] === undefined) {
			this._event[name] = [];
		}
		this._event[name].push(callback);
		return this;
	};
	FuckAdBlock.prototype.on = function(detected, callback) {
		return this.addEvent(detected===true?'detected':'undetected', callback);
	};
	FuckAdBlock.prototype.onDetected = function(callback) {
		return this.addEvent('detected', callback);
	};
	FuckAdBlock.prototype.onNotDetected = function(callback) {
		return this.addEvent('undetected', callback);
	};
	FuckAdBlock.prototype.dispatchEvent = function(name) {
		var events = this._event[name];
		if(events !== undefined) {
			for(var i in events) {
				events[i]();
			}
		}
		return this;
	};
	FuckAdBlock.prototype.clearEvent = function() {
		this._event = {};
		return this;
	};
	FuckAdBlock.prototype.check = function(pluginList, options) {
		 if(pluginList instanceof Array === false && options === undefined) {
			options = pluginList;
			pluginList = undefined;
		}
		if(pluginList === undefined) {
			pluginList = Object.keys(this._pluginClass);
		}
		if(options === undefined) {
			options = {};
		}
		var self = this;
		var plugins = {};
		var pluginsLength = 0;
		var end = function(detected) {
			endLength++;
			if(detected === true || endLength === pluginsLength) {
				clearTimeout(timeout);
				for(var name in plugins) {
					plugins[name].instance.stop();
				}
				self.dispatchEvent(detected===true?'detected':'undetected');
			}
		};
		var endLength = 0;
		for(var i in pluginList) {
			pluginsLength++;
			var name = pluginList[i];
			var plugin = plugins[name] = {
				instance:	new (this._pluginClass[name]),
				detected:	null,
			};
			if(options[name] !== undefined) {
				plugin.instance.setOption(options[name]);
			}
			plugin.instance.setDetected(function() {
				plugin.detected = true;
				end(true);
			}).setUndetected(function() {
				plugin.detected = false;
				end(false);
			});
		}
		for(var name in plugins) {
			plugins[name].instance.start();
		}
		var timeout = setTimeout(function() {
			end(false);
		}, this.getOption('timeout'));
		return this;
	};
	
	
	var FuckAdBlockPluginHtml = function() {
		this.setOption({
			loopTime:		50,
			baitElement:	null,
			baitClass:		'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links',
			baitStyle:		'width:1px!important;height:1px!important;position:absolute!important;left:-10000px!important;top:-1000px!important;',
		});
		FuckAdBlock.prototype.Plugin.apply(this, arguments);
	};
	FuckAdBlockPluginHtml.prototype = Object.create(FuckAdBlock.prototype.Plugin.prototype);
	FuckAdBlockPluginHtml.prototype.constructor = FuckAdBlockPluginHtml;
	FuckAdBlockPluginHtml.prototype.name = 'html';
	FuckAdBlockPluginHtml.prototype.start = function() {
		var self = this;
		if(this.getOption('baitElement') === null) {
			this._data.bait = this._createBait({
				class: this.getOption('baitClass'),
				style: this.getOption('baitStyle'),
			});
		} else {
			this._data.bait = this.getOption('baitElement');
		}
		var check = function() {
			if(self._checkBait(self._data.bait) === true) {
				self.callDetected();
			}
		};
		this._data.loop = setInterval(check, this.getOption('loopTime'));
		setTimeout(check, 1);
		return this;
	};
	FuckAdBlockPluginHtml.prototype.stop = function() {
		clearInterval(this._data.loop);
		window.document.body.removeChild(this._data.bait);
		return this;
	};
	FuckAdBlockPluginHtml.prototype._createBait = function(options) {
		var bait = document.createElement('div');
		bait.setAttribute('class', options.class);
		bait.setAttribute('style', options.style);
		bait.offsetParent;
		bait.offsetHeight;
		bait.offsetLeft;
		bait.offsetTop;
		bait.offsetWidth;
		bait.clientHeight;
		bait.clientWidth;
		bait = window.document.body.appendChild(bait);
		return bait;
	};
	FuckAdBlockPluginHtml.prototype._checkBait = function(bait) {
		var detected = false;
		if(window.document.body.getAttribute('abp') !== null
		|| bait.offsetParent === null
		|| bait.offsetHeight == 0
		|| bait.offsetLeft == 0
		|| bait.offsetTop == 0
		|| bait.offsetWidth == 0
		|| bait.clientHeight == 0
		|| bait.clientWidth == 0) {
			detected = true;
		} else {
			var baitComputedStyle = window.getComputedStyle(bait);
			if(baitComputedStyle.getPropertyValue('display') == 'none'
			|| baitComputedStyle.getPropertyValue('visibility') == 'hidden') {
				detected = true;
			}
		}
		return detected;
	};
	
	
	var FuckAdBlockPluginHttp = function() {
		this.setOption({
			baitMode:	'ajax',
			baitUrl:	'/ad/banner/_adsense_/_adserver/_adview_.ad.json?adzone=top&adsize=300x250&advid={RANDOM}',
		});
		FuckAdBlock.prototype.Plugin.apply(this, arguments);
	};
	FuckAdBlockPluginHttp.prototype = Object.create(FuckAdBlock.prototype.Plugin.prototype);
	FuckAdBlockPluginHttp.prototype.constructor = FuckAdBlockPluginHttp;
	FuckAdBlockPluginHttp.prototype.name = 'http';
	FuckAdBlockPluginHttp.prototype.start = function() {
		var self = this;
		this._data.end = false;
		var baitUrl = this.getOption('baitUrl').replace('{RANDOM}', Math.round(Math.random()*100000000));
		this._urlCheck(baitUrl, this.getOption('baitMode'), function() {
			if(self._data.end !== false) { return; }
			self._data.end = true;
			self.callDetected();
		}, function() {
			if(self._data.end !== false) { return; }
			self._data.end = true;
			self.callUndtected();
		});
		return this;
	};
	FuckAdBlockPluginHttp.prototype.stop = function() {
		this._data.end = true;
		return this;
	};
	FuckAdBlockPluginHttp.prototype._urlCheck = function(url, mode, cbDetected, cbUndetected) {
		var endSend = false;
		var end = function(detected) {
			if(endSend !== false) { return; };
			endSend = true;
			if(detected === true) {
				cbDetected();
			} else {
				cbUndetected();
			}
		};
		if(mode === 'ajax') {
			var readyStates = [false, false, false, false];
			var status = null;
			var respond = function(responseForce) {
				if(responseForce !== undefined) {
					end(responseForce);
				} else {
					if(status === 0) {
						end(true);
						return;
					}
					for(var i=0; i<4; i++) {
						if(readyStates[i] === false) {
							end(true);
							return;
						}
					}
					end(false);
				}
			};
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.onreadystatechange = function() {
				readyStates[xmlHttp.readyState-1] = true;
				try {
					status = xmlHttp.status;
				} catch(e) {}
				if(xmlHttp.readyState === 4) {
					respond();
				}
			};
			try {
				xmlHttp.open('GET', url, true);
				xmlHttp.send();
			} catch(e) {
				if(e.result == '2153644038') {
					respond(true);
				}
			}
		} else if(mode === 'import') {
			var element = document.createElement('script');
			element.src = url;
			element.onerror = function() {
				end(true);
				window.document.body.removeChild(element);
			};
			element.onload = function() {
				end(false);
				window.document.body.removeChild(element);
			};
			window.document.body.appendChild(element);
		} else {
			end(false);
		}
	};
	
	FuckAdBlock.prototype.registerPlugin(FuckAdBlockPluginHtml);
	FuckAdBlock.prototype.registerPlugin(FuckAdBlockPluginHttp);
	
	window[className] = FuckAdBlock;
	if(window[instanceName] === undefined) {
		window[instanceName] = new FuckAdBlock;
		window.addEventListener('load', function() {
			setTimeout(function() {
				window[instanceName].check();
			}, 1);
		}, false); 
	}
})(window, 'fuckAdBlock', 'FuckAdBlock');