# FuckAdBlock (4.0.0-beta.1)

- **EN**: Detects ad blockers
- **FR**: Permet de détecter les bloqueurs de publicité
- **ES**: Detecta los bloqueadores de anuncios
- **DE**: Erkennt Werbeblocker
- **BR**: Detecta bloqueadores de anúncios
- **JP**: 広告ブロッカーを検出
- **CN**: 检测广告拦截
- **KR**: 광고 차단제를 감지

Online example: http://sitexw.fr/fuckadblock/beta/

(There is also a project, [BlockAdBlock](https://github.com/sitexw/BlockAdBlock), with a more convenient name)

## Valid on
- Google Chrome
- Mozilla Firefox
- Internet Explorer (9+)
- Safari (+iOS)
- Opera
- Adblock Browser (iOS and Android)
- ...

## Install via
Manual:
```
Download "fuckadblock.js" and add it to your website.
```
Bower:
```
bower install fuck-adblock
```
Node.js/io.js:
```
npm install fuckadblock
```

## Code example (basic)
```html
<!doctype html>
<html>
<head>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	
	<script>var fuckAdBlock = undefined;</script>
	<script src="./fuckadblock.js"></script>
	<script>
		var adBlockDetected = function() {
		    $('h1 span').text('yes');
		}
		var adBlockNotDetected = function() {
		    $('h1 span').text('no');
		}
		
		if(typeof fuckAdBlock === 'undefined') {
			adBlockDetected();
		} else {
			fuckAdBlock.on(true, adBlockDetected).on(false, adBlockNotDetected);
		}
	</script>
</head>
<body>
    <h1>AdBlock detected: <span>loading...</span></h1>
</body>
</html>
```

## Code example (other)
```javascript
fuckAdBlock.onDetected(adBlockDetected);
fuckAdBlock.onNotDetected(adBlockNotDetected);
// and|or
fuckAdBlock.on(true, adBlockDetected);
fuckAdBlock.on(false, adBlockNotDetected);
// and|or
fuckAdBlock.on(true, adBlockDetected).onNotDetected(adBlockNotDetected);

// Change the options
fuckAdBlock.setOption('debug', true);
// and|or
fuckAdBlock.setOption({
	debug: true,
	checkOnLoad: false,
	resetOnEnd: false
});
```

## Default options
```javascript
// At launch, check if AdBlock is enabled
// Uses the method fuckAdBlock.check()
checkOnLoad: true

// At the end of the check, is that it removes all events added?
resetOnEnd: true

// Displays the debug in the console (available only from version 3.2 and more)
debug: false


// Do detection by the DOM is enabled?
domEnable: true

// The number of milliseconds between each check
domLoopTime: 50

// The number of negative checks after which there is considered that AdBlock is not enabled
// Time (ms) = 50*(5-1) = 200ms (per default)
domLoopMax: 5

// CSS class used by the DOM bait caught AdBlock
domBaitClass: 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links'

// CSS style used to hide the DOM bait of the users
domBaitStyle: 'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;'


// Do detection by the HTTP is enabled?
httpEnable: true

// The number of milliseconds before you stop the HTTP request
httpTimeout: 200

// URL used to detect via HTTP
httpBaitUrl: '/ad/banner/_adsense_/_adserver/_adview_.ad.json?adzone=top&adsize=300x250&advid=1'
```

## Method available
```javascript
// Allows to set options
// #options: string|object
// #value:   string (optional)
fuckAdBlock.setOption(options, value);

// Allows to check if AdBlock is enabled
fuckAdBlock.check(loop);

// Allows to add an event if AdBlock is detected
// #detected: boolean (true: detected, false: not detected)
// #event:    string (optional)
// #cb:       function
fuckAdBlock.on(detected, cb);

// Alias of fuckAdBlock.on(true|false, cb)
fuckAdBlock.onDetected(cb);
fuckAdBlock.onNotDetected(cb);
```

## Instance
By default, FuckAdBlock is instantiated automatically.
To block this automatic instantiation, simply create a variable "fuckAdBlock" with a value (null, false, ...) before importing the script.
```html
<script>var fuckAdBlock = false;</script>
<script src="./fuckadblock.js"></script>
```
After that, you are free to create your own instances:
```javascript
fuckAdBlock = new FuckAdBlock;
// and|or
myFuckAdBlock = new FuckAdBlock({
	checkOnLoad: true,
	resetOnEnd: true
});
```
