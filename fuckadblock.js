/*
 * FuckAdBlock 4.0.0-beta.1
 * Copyright (c) 2015 Valentin Allaire <valentin.allaire@sitexw.fr>
 * Released under the MIT license
 * https://github.com/sitexw/FuckAdBlock
 */

(function(window) {
	var FuckAdBlock = function(option) {
		this._option = {
			checkOnLoad:	false,
			resetOnEnd:		false,
			debug:			false,
			
			domEnable:		true,
			domLoopTime:	50,
			domLoopMax:		5,
			domBaitClass:	'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links',
			domBaitStyle:	'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;',
			
			httpEnable:		true,
			httpTimeout:	200,
			httpBaitUrl:	'/ad/banner/_adsense_/_adserver/_adview_.ad.json?adzone=top&adsize=300x250&advid=1',
		};
		this._var = {
			version:		'4.0.0-beta.1',
			versionExtend:	[4, 0, 0, 'beta', 1],
			
			dom:			{
								bait:		null,
								checking:	false,
								loop:		null,
								loopNumber:	null,
							},
			http:			{
								checking:	false,
							},
			
			event:			{
								all:	{ true: [], false: [], },
								dom:	{ true: [], false: [], },
								http:	{ true: [], false: [], },
							}
		};
		if(option !== undefined) {
			this.setOption(option);
		}
		
		var self = this;
		window.addEventListener('load', function() {
			setTimeout(function() {
				if(self._option.checkOnLoad === true) {
					if(self._option.debug === true) {
						self._log('onLoad', 'A check loading is launched');
					}
					setTimeout(function() {
						self.check();
					}, 1);
				}
			}, 1);
		}, false);
	};
	FuckAdBlock.prototype = {
		_option:	null,
		_var:		null,
		
		_log: function(method, message) {
			console.log('[FuckAdBlock]['+method+'] '+message);
		},
		
		setOption: function(options, value) {
			if(value !== undefined) {
				var key = options;
				options = {};
				options[key] = value;
			}
			for(var option in options) {
				this._option[option] = options[option];
				if(this._option.debug === true) {
					this._log('setOption', 'The option "'+option+'" he was assigned to "'+options[option]+'"');
				}
			}
			return this;
		},
		
		_domBaitCreat: function() {
			var bait = document.createElement('div');
			bait.setAttribute('class', this._option.domBaitClass);
			bait.setAttribute('style', this._option.domBaitStyle);
			bait.offsetParent;
			bait.offsetHeight;
			bait.offsetLeft;
			bait.offsetTop;
			bait.offsetWidth;
			bait.clientHeight;
			bait.clientWidth;
			bait = window.document.body.appendChild(bait);
			
			if(this._option.debug === true) {
				this._log('_domBaitCreat', 'Bait has been created');
			}
			return bait;
		},
		_domBaitDestroy: function() {
			window.document.body.removeChild(this._var.dom.bait);
			this._var.dom.bait = null;
			
			if(this._option.debug === true) {
				this._log('_domBaitDestroy', 'Bait has been removed');
			}
			return this;
		},
		_domBaitCheck: function(bait) {
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
		},
		domCheck: function(loopEnable, baitExternal, callbackEnd, callbackStop) {
			if(loopEnable === undefined) {
				loopEnable = true;
			} else {
				loopEnable = Boolean(loopEnable);
			}
			if(this._option.debug === true) {
				this._log('domCheck', 'An audit was requested '+(loopEnable===true?'with a':'without')+' loop');
			}
			if(baitExternal === undefined) {
				bait = this._domBaitCreat();
				baitExternal = false;
			} else {
				bait = baitExternal;
				baitExternal = true;
			}
			if(callbackEnd === undefined) {
				callbackEnd = function(){};
			}
			if(this._var.dom.checking === true) {
				if(this._option.debug === true) {
					this._log('domCheck', 'A check was canceled because there is already in progress');
				}
				return false;
			}
			this._var.dom.checking = true;
			
			var self = this;
			var loop = null;
			var loopMax = 1;
			var loopNumber = 0;
			var loopTime = this._option.domLoopTime;
			if(callbackStop !== undefined) {
				callbackStop(function() {
					//clearInterval(loop);
					//self._var.dom.checking = false;
				});
			}
			var check = function() {
				loopNumber++;
				var detected = self._domBaitCheck(bait);
				if(self._option.debug === true) {
					self._log('domCheck', 'A check ('+(loopNumber)+'/'+loopMax+' ~'+(loopNumber===1?1:(loopNumber-1)*loopTime)+'ms) was conducted and detection is "'+(detected===true?'positive':'negative')+'"');
				}
				if(detected === true || loopNumber >= loopMax) {
					clearInterval(loop);
					callbackEnd(detected);
					self._var.dom.checking = false;
				}
			};
			if(loopEnable === true) {
				loopMax = self._option.domLoopMax;
				loop = setInterval(check, loopTime);
			}
			setTimeout(check, 1);
			
			return true;
		},
		
		httpCheck: function(url, callbackEnd) {
			if(url === undefined) {
				url = this._option.httpBaitUrl;
			}
			if(callbackEnd === undefined) {
				callbackEnd = function(){};
			}
			if(this._var.http.checking === true) {
				if(this._option.debug === true) {
					this._log('httpCheck', 'A check was canceled because there is already in progress');
				}
				return false;
			}
			this._var.http.checking = true;
			
			if(this._option.debug === true) {
				this._log('httpCheck', 'An audit was requested');
			}
			var self = this;
			var end = function(detected) {
				callbackEnd(detected);
				self._var.http.checking = false;
			};
			var readyStates = [false, false, false, false];
			var status = null;
			var respond = function(responseForce) {
				if(end !== null) {
					if(responseForce !== undefined) {
						end(responseForce);
						end = null;
					} else {
						if(status === 0) {
							end(true);
							end = null;
							return;
						}
						for(var i=0; i<4; i++) {
							if(readyStates[i] === false) {
								end(true);
								end = null;
								return;
							}
						}
						end(false);
					}
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
				xmlHttp.open('GET', url+'&_='+Math.round(Math.random()*100000000), true);
				xmlHttp.send();
			} catch(e) {
				if(e.result == '2153644038') {
					respond(true);
				}
			}
			setTimeout(function() {
				respond(false);
			}, this._option.httpTimeout);
			
			return true;
		},
		
		check: function() {
			var self = this;
			
			if(this._var.dom.checking === true || this._var.http.checking === true) {
				if(this._option.debug === true) {
					this._log('check', 'A check was canceled because there is already in progress');
				}
				return false;
			}
			
			var all = false;
			var types = {
				dom: false,
				http: false,
			};
			var domStopLoop = null;
			var end = function(type, detected) {
				if(types[type] === null) {
					types[type] = detected;
					self.eventDispatch(type, detected);
					if((all === false && detected === true) || (types.dom !== null && types.http !== null)) {
						self.eventDispatch('all', detected);
						all = true;
					} 
				}
			};
			if(this._option.domEnable === true) {
				types.dom = null;
				this.domCheck(true, undefined, function(detected) {
					end('dom', detected);
				}, function(stopLoop) { domStopLoop = stopLoop; });
			}
			if(this._option.httpEnable === true) {
				types.http = null;
				this.httpCheck(undefined, function(detected) {
					end('http', detected);
				});
			}
			
			return true;
		},
		
		eventDispatch: function(type, detected) {
			var events = this._var.event[type][detected];
			if(this._option.debug === true) {
				this._log('eventDispatch', 'An "'+type+'" event with a "'+(detected===true?'positive':'negative')+'" detection was called (0/'+events.length+')');
			}
			for(var i in events) {
				if(this._option.debug === true) {
					this._log('eventDispatch', 'Call function event ("'+type+'"->"'+(detected===true?'detected':'notDetected')+'") '+(parseInt(i)+1)+'/'+events.length);
				}
				events[i]();
			}
			if(this._option.resetOnEnd === true) {
				this.eventClear(type);
			}
			return this;
		},
		eventClear: function(type) {
			if(type === undefined) {
				this._var.event = {
					all:	{ true: [], false: [] },
					dom:	{ true: [], false: [] },
					http:	{ true: [], false: [] },
				};
			} else {
				this._var.event[type] = { true: [], false: [] };
			}
			
			if(this._option.debug === true) {
				if(type === undefined) { type = 'full'; }
				this._log('eventClear', 'The "'+type+'" event list has been cleared');
			}
			return this;
		},
		
		on: function(detected, event, cb) {
			if(cb === undefined) {
				cb = event;
				event = 'all';
			}
			
			this._var.event[event][detected].push(cb);
			if(this._option.debug === true) {
				this._log('on', 'A type of event "'+event+'" in "'+(detected===true?'detected':'notDetected')+'" mode has been added');
			}
			
			return this;
		},
		onDetected: function(cb) {
			return this.on(true, 'all', cb);
		},
		onNotDetected: function(cb) {
			return this.on(false, 'all', cb);
		},
	};
	window.FuckAdBlock = FuckAdBlock;
	
	if(window.fuckAdBlock === undefined) {
		window.fuckAdBlock = new FuckAdBlock({
			checkOnLoad: true,
			resetOnEnd: true
		});
	}
})(window);