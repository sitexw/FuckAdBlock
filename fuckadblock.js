/*
 * FuckAdBlock 4.0.0-beta.3
 * Copyright (c) 2013-2015 Valentin Allaire <valentin.allaire@sitexw.fr>
 * Released under the MIT license
 * https://github.com/sitexw/FuckAdBlock
 */

(function(window, instanceName, className) {
	var debug = false;
	var debugName = 'FuckAdBlock';
	
	var FabUtils = function() {
		var self = this;
		var options = {};
		
		this.errors = {
			throwError: function(name, method, type) {
				throw 'Argument "'+name+'" of method "'+method+'" is not an "'+type+'"';
			},
			isObject: function(value, name, method) {
				if(typeof value !== 'object' || Array.isArray(value) === true || value === null) {
					this.throwError(name, method, 'object');
				}
			},
			isArray: function(value, name, method) {
				if(Array.isArray(value) === false) {
					this.throwError(name, method, 'array');
				}
			},
			isFunction: function(value, name, method) {
				if(typeof value !== 'function') {
					this.throwError(name, method, 'function');
				}
			},
			isString: function(value, name, method) {
				if(typeof value !== 'string') {
					this.throwError(name, method, 'string');
				}
			},
			isBoolean: function(value, name, method) {
				if(typeof value !== 'boolean') {
					this.throwError(name, method, 'boolean');
				}
			},
		};
		
		this.options = {
			set: function(optionsList) {
				self.errors.isObject(optionsList, 'optionsList', 'options.set');
				
				for(var key in optionsList) {
					options[key] = optionsList[key];
					self.debug.log('options.set', 'Set "'+key+'" to "'+optionsList[key]+'"');
				}
				return self;
			},
			get: function(key) {
				return options[key];
			},
		};
		
		this.debug = {
			set: function(isEnable) {
				debug = isEnable;
				self.debug.log('debug.set', 'Set debug to "'+debug+'"');
				return self;
			},
			isEnable: function() {
				return debug;
			},
			log: function(method, message) {
				if(debug === true) {
					self.errors.isString(method, 'method', 'debug.log');
					self.errors.isString(message, 'message', 'debug.log');
					
					console.log('['+debugName+']['+method+'] '+message);
				}
			},
		};
		
		this.versionToInt = function(version) {
			var versionInt = '';
			for(var i=0; i<3; i++) {
				var block = version[i]||0;
				if((''+block).length === 1) {
					block = '0'+block;
				}
				versionInt += block;
			}
			return parseInt(versionInt);
		};
	};
	
	var FabPlugin = function() {
		FabUtils.apply(this);
		
		var data = {};
		var callbackDetected = null;
		var callbackUndetected = null;
		
		this.setDetected = function(callback) {
			callbackDetected = callback;
			return this;
		};
		this.callDetected = function() {
			if(callbackDetected === null) {
				return false;
			}
			callbackDetected();
			callbackDetected = null;
			return true;
		};
		
		this.setUndetected = function(callback) {
			callbackUndetected = callback;
			return this;
		};
		this.callUndetected = function() {
			if(callbackUndetected === null) {
				return false;
			}
			callbackUndetected();
			callbackUndetected = null;
			return true;
		};
	};
	
	var Fab = function() {
		FabUtils.apply(this);
		this.options.set({
			timeout: 200,
		});
		
		var self = this;
		var version = [4, 0, 0, 'beta', 3];
		var events = {};
		var pluginsClass = {};
		
		this.getVersion = function(toInt) {
			if(toInt !== true) {
				return version;
			} else {
				this.versionToInt(version);
			}
		};
		
		this.addEvent = function(name, callback) {
			this.errors.isString(name, 'name', 'addEvent');
			this.errors.isFunction(callback, 'callback', 'addEvent');
			
			if(events[name] === undefined) {
				events[name] = [];
			}
			events[name].push(callback);
			this.debug.log('set', 'Event "'+name+'" added');
			return this;
		};
		this.on = function(detected, callback) {
			this.errors.isBoolean(detected, 'detected', 'on');
			this.errors.isFunction(callback, 'callback', 'on');
			
			return this.addEvent(detected===true?'detected':'undetected', callback);
		};
		this.onDetected = function(callback) {
			this.errors.isFunction(callback, 'callback', 'onDetected');
			
			return this.addEvent('detected', callback);
		};
		this.onNotDetected = function(callback) {
			this.errors.isFunction(callback, 'callback', 'onNotDetected');
			
			return this.addEvent('undetected', callback);
		};
		var dispatchEvent = function(name) {
			var eventsList = events[name];
			if(self.debug.isEnable() === true) {
				var eventsNumber = (eventsList!==undefined?eventsList.length:0);
				self.debug.log('dispatchEvent', 'Starts dispatch of events "'+name+'" (0/'+eventsNumber+')');
			}
			if(eventsList !== undefined) {
				for(var i in eventsList) {
					if(self.debug.isEnable() === true) {
						self.debug.log('dispatchEvent', 'Dispatch event "'+name+'" ('+(parseInt(i)+1)+'/'+eventsNumber+')');
					}
					eventsList[i]();
				}
			}
			return this;
		};
		
		this.check = function(pluginsList, optionsList) {
			 if(pluginsList instanceof Array === false && optionsList === undefined) {
				optionsList = pluginsList;
				pluginsList = undefined;
			}
			if(pluginsList === undefined) {
				pluginsList = Object.keys(pluginsClass);
			}
			if(optionsList === undefined) {
				optionsList = {};
			}
			this.errors.isArray(pluginsList, 'pluginsList', 'check');
			this.errors.isObject(optionsList, 'optionsList', 'check');
			this.debug.log('check', 'Starting check');
			
			var plugins = {};
			var pluginsLength = pluginsList.length;
			var pluginsEndLength = 0;
			
			var end = function(pluginName, detected, force) {
				pluginsEndLength++;
				self.debug.log('check', (detected===true?'Positive':'Negative')+'" check of plugin "'+pluginName+'"');
				if(force === true || detected === true || pluginsEndLength === pluginsLength) {
					clearTimeout(timeout);
					for(var name in plugins) {
						plugins[name].instance.stop();
					}
					dispatchEvent(detected===true?'detected':'undetected');
				}
			};
			this.debug.log('check', 'Starting loading plugins (0/'+pluginsLength+') ('+pluginsList.join()+')');
			if(pluginsLength === 0) {
				end('#NoPlugin', false, true);
				return this;
			}
			for(var i in pluginsList) {
				var name = pluginsList[i];
				this.debug.log('check', 'Load plugin "'+name+'" ('+(parseInt(i)+1)+'/'+pluginsLength+')');
				var plugin = plugins[name] = {
					name:		name,
					instance:	new (pluginsClass[name]),
					detected:	null,
				};
				if(optionsList[name] !== undefined) {
					plugin.instance.options.set(optionsList[name]);
				}
				(function(end, plugin) {
					plugin.instance.setDetected(function() {
						plugin.detected = true;
						end(plugin.name, true);
					}).setUndetected(function() {
						plugin.detected = false;
						end(plugin.name, false);
					});
				})(end, plugin);
			}
			for(var name in plugins) {
				plugins[name].instance.start();
			}
			var timeout = setTimeout(function() {
				end('#Timeout', false, true);
			}, this.options.get('timeout'));
			return this;
		};
		
		this.registerPlugin = function(pluginClass) {
			this.errors.isFunction(pluginClass, 'pluginClass', 'registerPlugin');
			this.errors.isString(pluginClass.pluginName, 'pluginClass.pluginName', 'registerPlugin');
			this.errors.isArray(pluginClass.versionMin, 'pluginClass.versionMin', 'registerPlugin');
			if(pluginClass.versionMin.length !== 3) {
				this.errors.throwError('pluginClass.versionMin', 'registerPlugin', 'array with 3 values');
			}
			
			if(pluginsClass[pluginClass.pluginName] === undefined) {
				if(this.versionToInt(version) >= this.versionToInt(pluginClass.versionMin)) {
					pluginsClass[pluginClass.pluginName] = pluginClass;
					this.debug.log('registerPlugin', 'Plugin "'+pluginClass.pluginName+'" registered');
					return true;
				} else {
					throw 'The plugin "'+pluginClass.pluginName+'" ('+pluginClass.versionMin.join('.')+') is too recent for this version of '+debugName+' ('+version.join('.')+')';
				}
			} else {
				throw 'The plugin "'+pluginClass.pluginName+'" is already registered';
			}
			return false;
		};
		
		this.registerPlugin(FabPluginHtml);
		this.registerPlugin(FabPluginHttp);
	};
	Fab.getPluginClass = function() {
		return FabPlugin;
	};
	
	
	var FabPluginHtml = function() {
		Fab.getPluginClass().apply(this, arguments);
		this.options.set({
			loopTime:		50,
			baitElement:	null,
			baitClass:		'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links',
			baitStyle:		'width:1px!important;height:1px!important;position:absolute!important;left:-10000px!important;top:-1000px!important;',
			baitParent:		null,
		});
		
		var data = {};
		
		this.start = function() {
			var self = this;
			if(this.options.get('baitElement') === null) {
				data.bait = this.createBait({
					class: this.options.get('baitClass'),
					style: this.options.get('baitStyle'),
				});
				var baitParent = this.options.get('baitParent');
				if(baitParent === null) {
					window.document.body.appendChild(data.bait);
				} else {
					baitParent.appendChild(data.bait);
				}
			} else {
				data.bait = this.options.get('baitElement');
			}
			var check = function() {
				if(self.checkBait(data.bait, true) === true) {
					self.callDetected();
				}
			};
			data.loopTimeout = setTimeout(check, 1);
			data.loopInterval = setInterval(check, this.options.get('loopTime'));
			return this;
		};
		this.stop = function() {
			clearInterval(data.loopTimeout);
			clearInterval(data.loopInterval);
			var baitParent = this.options.get('baitParent');
			if(baitParent === null) {
				window.document.body.removeChild(data.bait);
			} else {
				baitParent.removeChild(data.bait);
			}
			return this;
		};
		
		this.createBait = function(options) {
			var bait = window.document.createElement('div');
			bait.setAttribute('class', options.class);
			bait.setAttribute('style', options.style);
			bait.offsetParent;
			bait.offsetHeight;
			bait.offsetLeft;
			bait.offsetTop;
			bait.offsetWidth;
			bait.clientHeight;
			bait.clientWidth;
			return bait;
		};
		this.checkBait = function(bait, checkBody) {
			var detected = false;
			if(checkBody === true && (window.document.body.getAttribute('abp') !== null)
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
	};
	FabPluginHtml.pluginName = 'html';
	FabPluginHtml.version = [1, 0, 0];
	FabPluginHtml.versionMin = [4, 0, 0];
	
	
	var FabPluginHttp = function() {
		Fab.getPluginClass().apply(this, arguments);
		this.options.set({
			baitMode:	'ajax',
			baitUrl:	'/ad/banner/_adsense_/_adserver/_adview_.ad.json?adzone=top&adsize=300x250&advid={RANDOM}',
		});
		
		var data = {};
		
		this.start = function() {
			var self = this;
			data.end = false;
			var baitUrl = this.options.get('baitUrl').replace(/\{RANDOM\}/g, function() {
				return parseInt(Math.random()*100000000);
			});
			this._urlCheck(baitUrl, this.options.get('baitMode'), function() {
				if(data.end !== false) { return; }
				data.end = true;
				self.callDetected();
			}, function() {
				if(data.end !== false) { return; }
				data.end = true;
				self.callUndetected();
			});
			return this;
		};
		this.stop = function() {
			data.end = true;
			return this;
		};
		
		this._urlCheck = function(url, mode, cbDetected, cbUndetected) {
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
	};
	FabPluginHttp.pluginName = 'http';
	FabPluginHtml.version = [1, 0, 0];
	FabPluginHttp.versionMin = [4, 0, 0];
	
	
	window[className] = Fab;
	if(window[instanceName] === undefined) {
		var instance = window[instanceName] = new Fab;
		window.addEventListener('load', function() {
			setTimeout(function() {
				instance.check();
			}, 1);
		}, false);
	}
})(window, 'fuckAdBlock', 'FuckAdBlock');