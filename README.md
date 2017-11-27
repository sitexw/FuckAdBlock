
# Use with caution!

**This Beta is still experimental and the bugs may be present.**

*To contribute to this Beta, go here:* https://github.com/sitexw/FuckAdBlock/issues/34

---
---
---

# FuckAdBlock (4.0.0-beta.3)
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
bower install fuckadblock
```
NPM:
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
	    // We create the function that will be executed if AdBlock is detected
		var adBlockDetected = function() {
		    $('h1 span').text('yes');
		}
	    // We create the function that will be executed if AdBlock is NOT detected
		var adBlockUndetected = function() {
		    $('h1 span').text('no');
		}
		// We observe if the variable "fuckAdBlock" exists
		if(typeof  FuckAdBlock === 'undefined') {
		    // If it does not exist, it means that AdBlock blocking the script FuckAdBlock
		    // Therefore the function "adBlockDetected" is executed
		    // PS: The function is executed on the "document ready" in order to select the HTML with jQuery
			$(document).ready(adBlockDetected);
		} else {
		    // Otherwise, our functions we add to FuckAdBlock for a classic detection
			fuckAdBlock.on(true, adBlockDetected).on(false, adBlockUndetected);
		}
	</script>
</head>
<body style="font-family: Sans-Serif;">
    <h1>AdBlock detected: <span>loading...</span></h1>
</body>
</html>
```

## Code example (instance and plugin option)
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

## Code example (maximum security)
```html
<!doctype html>
<html>
<head>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    
    <!--
		The variables used by FuckAdBlock is initialized
		to be sure that another script has not used
	-->
    <script>var fuckAdBlock = undefined, FuckAdBlock = undefined;</script>
    <!--
		Added the attribute "integrity" to be sure that the original script
		is not modified by an extension or other.
    -->
    <script src="./fuckadblock.min.js" integrity="sha256-YQPO7mqk9cszSMNteCQ6YaPdRYmlJuR7CG1JP/CUa3s="></script>
    <script>
        var adBlockDetected = function() {
            $('h1 span').text('yes');
        }
        var adBlockUndetected = function() {
            $('h1 span').text('no');
        }
        if(typeof  FuckAdBlock === 'undefined') {
            $(document).ready(adBlockDetected);
        } else {
            fuckAdBlock.on(true, adBlockDetected).on(false, adBlockUndetected);
        }
        // It removes the variable "fuckadblock" and "FuckAdBlock
        // so that it not be exploited by another script later
        // but beware, you can not use it too!
        fuckAdBlock = undefined;
        
        // Do not use FuckAdBlock outside this area
        // (between importing the script and the line above)
    </script>
</head>
<body style="font-family: Sans-Serif;">
    <h1>AdBlock detected: <span>loading...</span></h1>
</body>
</html>
```
List of SHA256:
- **fuckadblock.js:** `sha256-flllputoHvX4pZ2s1ujIJj3Lu1EuRB5TL+6UKpDEx+o=`
- **fuckadblock.min.js:** `sha256-YQPO7mqk9cszSMNteCQ6YaPdRYmlJuR7CG1JP/CUa3s=`

More information about the attribute "integrity": [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)

## Code example (other)
```javascript
fuckAdBlock.on(true, adBlockDetected);
fuckAdBlock.on(false, adBlockUndetected);
// or
fuckAdBlock.onDetected(true, adBlockDetected).onNotDetected(adBlockNotDetected);

fuckAdBlock.options.set({
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
// Chose the area (HTML element) which will add the bait
// If null, "window.document.body" used
baitParent: null

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
// @options: object
fuckAdBlock.options.set(options);


// Allows to check if AdBlock is enabled
// @plugins: array (optional, default: all plugins)
// @options: object (optional, options selected plugins)
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
				FuckAdBlock.getPluginClass().apply(this, arguments);
				this.options.set({
					chanceDetected:	0.5,
				});
				
				var data = {};
				
				this.start = function() {
					var self = this;
					data.myTimeout = setTimeout(function() {
						if(Math.random() <= self.options.get('chanceDetected')) {
							self.callDetected();
						} else {
							self.callUndetected();
						}
					}, 100);
					return this;
				};
				this.stop = function() {
					clearTimeout(data.myTimeout);
					return this;
				};
			};
			MyPluginRandom.pluginName = 'random';
			MyPluginRandom.versionMin = [4, 0, 0];
			
			var myFuckAdBlock = new FuckAdBlock;
			myFuckAdBlock.registerPlugin(MyPluginRandom);
			myFuckAdBlock.on(true, adBlockDetected).on(false, adBlockUndetected);
			$(document).ready(function() {
				myFuckAdBlock.check(['random'], {
					random: {
						chanceDetected: 0.20,
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

## Plugin list

Here is a list of plugins (official or not):

*No plugins for now*
