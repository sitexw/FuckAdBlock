# Do not use in production!

**This Beta is still experimental, and is likely to change significantly!**

*To contribute to this Beta, go here:* https://github.com/sitexw/FuckAdBlock/issues/34

---
---

# FuckAdBlock (4.0.0-beta.2)
Online example: [fuckadblock.sitexw.fr](http://fuckadblock.sitexw.fr)

(A version with a more correct name exists: [BlockAdBlock](https://github.com/sitexw/BlockAdBlock))

## Valid on
- **Google Chrome** (Windows, Mac, Linux, Android, iOS)
- **Mozilla Firefox** (Windows, Mac, Linux, Android, iOS)
- **Internet Explorer** (9+)
- **Safari** (iOS, Mac, Windows)
- **Adblock Browser** (Android, iOS)
- *The list is really very long...*

## Install via
Manual:
```html
Download "fuckadblock.min.js" and add it to your site
```
Bower:
```html
bower install fuck-adblock
```
NodeJS:
```html
npm install fuckadblock
```


## Code example (basic)
```html
<!doctype html>
<html>
<head>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	
	<script>var fuckAdBlock = undefined;</script>
	<script src="./fuckadblock.min.js"></script>
	<script>
		var adBlockDetected = function() {
		    $('h1 span').text('yes');
		}
		var adBlockUndetected = function() {
		    $('h1 span').text('no');
		}
		if(typeof fuckAdBlock === 'undefined') {
			$(document).ready(adBlockDetected);
		} else {
			fuckAdBlock.on(true, adBlockDetected).on(false, adBlockUndetected);
		}
	</script>
</head>
<body style="font-family: Sans-Serif;">
    <h1>AdBlock detected: <span>loading...</span></h1>
</body>
</html>
```

## Code example (instance and plugin)
```html
<!doctype html>
<html>
<head>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	
	<script>var fuckAdBlock = false, FuckAdBlock = undefined;</script>
	<script src="./fuckadblock.min.js"></script>
	<script>
		var adBlockDetected = function() {
			$('h1 span').text('yes');
		}
		var adBlockUndetected = function() {
			$('h1 span').text('no');
		}
		if(typeof FuckAdBlock === 'undefined') {
			$(document).ready(adBlockDetected);
		} else {
			var myFuckAdBlock = new FuckAdBlock;
			myFuckAdBlock.on(true, adBlockDetected).on(false, adBlockUndetected);
			$(document).ready(function() {
				myFuckAdBlock.check(['http'], {
					http: {
						baitMode: 'import',
						baitUrl: 'http://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
					},
				});
			});
		}
	</script>
</head>
<body style="font-family: Sans-Serif;">
	<h1>AdBlock detected: <span>loading...</span></h1>
</body>
</html>
```

## Code example (other)
```javascript
fuckAdBlock.on(true, adBlockDetected);
fuckAdBlock.on(false, adBlockUndetected);
// or
fuckAdBlock.on(true, adBlockDetected).onNotDetected(adBlockNotDetected);

fuckAdBlock.setOption('timeout', 100);
// or
fuckAdBlock.setOption({
	timeout: 100,
});
```

## Default options (FuckAdBlock)
```javascript
// The number of milliseconds at the end of which it is considered that AdBlock is not enabled
timeout: 200
```

## Default options (Plugins)
```javascript
// Plugin "html"

// The number of milliseconds between each check
loopTime: 50
// Allow to use its own HTML element for checking
// If null, then the plugin itself created the element
baitElement: null
// CSS class used to catch AdBlock
baitClass: 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links'
// CSS style used to not see the bait
baitClass: 'width:1px!important;height:1px!important;position:absolute!important;left:-10000px!important;top:-1000px!important;'

// Plugin "http"

// Use HTTP detection by AJAX ('ajax') or script tag ('import')
baitMode: 'ajax'
// The url called for detection
// {RANDOM} is replaced by a random number (useful against the cache)
baitUrl: '/ad/banner/_adsense_/_adserver/_adview_.ad.json?adzone=top&adsize=300x250&advid={RANDOM}'
```

## Method available
```javascript
// Allows to set options
// @options: string|object
// @value:   string (optional)
fuckAdBlock.setOption(options, value);

// Allows to check if AdBlock is enabled
// @plugins: array (optional, default: all plugins)
// @options: object (optional)
fuckAdBlock.check(plugins, options);

// Allows to add an event if AdBlock is detected
// @detected: boolean (true: detected, false: not detected)
// @callback: function
fuckAdBlock.on(detected, callback);
```

## Instance
By default, FuckAdBlock is instantiated automatically.
To block this automatic instantiation, simply create a variable "fuckAdBlock" with a value (null, false, ...) before importing the script.
```html
<script>var fuckAdBlock = false;</script>
<script src="./fuckadblock.min.js"></script>
```
After that, you are free to create your own instances:
```javascript
var myFuckAdBlock = new FuckAdBlock;
```


## Plugin
You can create a plugin like this:

This plugin detects randomly AdBlock. In this case, there is one chance in five that AdBlock is detected.
```html
<!doctype html>
<html>
<head>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	
	<script>var fuckAdBlock = false, FuckAdBlock = undefined;</script>
	<script src="./fuckadblock.min.js"></script>
	<script>
		var adBlockDetected = function() {
			$('h1 span').text('yes');
		}
		var adBlockUndetected = function() {
			$('h1 span').text('no');
		}
		
		if(typeof FuckAdBlock === 'undefined') {
			$(document).ready(adBlockDetected);
		} else {
			var MyPluginRandom = function() {
				this.setOption({
					chanceDetected:	0.5,
				});
				FuckAdBlock.prototype.Plugin.apply(this, arguments);
			};
			MyPluginRandom.prototype = Object.create(FuckAdBlock.prototype.Plugin.prototype);
			MyPluginRandom.prototype.constructor = MyPluginRandom;
			MyPluginRandom.prototype.name = 'random';
			MyPluginRandom.prototype.start = function() {
				var self = this;
				this._data.myTimeout = setTimeout(function() {
					if(Math.random() <= self.getOption('chanceDetected')) {
						self.callDetected();
					} else {
						self.callUndetected();
					}
				}, 100);
				return this;
			};
			MyPluginRandom.prototype.stop = function() {
				clearTimeout(this._data.myTimeout);
				return this;
			};
			FuckAdBlock.prototype.registerPlugin(MyPluginRandom);
			
			var myFuckAdBlock = new FuckAdBlock;
			myFuckAdBlock.on(true, adBlockDetected).on(false, adBlockUndetected);
			$(document).ready(function() {
				myFuckAdBlock.check(['random'], {
					random: {
						chanceDetected: 0.2,
					},
				});
			});
		}
	</script>
</head>
<body style="font-family: Sans-Serif;">
	<h1>AdBlock detected: <span>loading...</span></h1>
</body>
</html>
```
