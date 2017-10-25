FuckAdBlock (v3.2.1)
===========

You can detect nasty ad blockers.
Online example: http://sitexw.fr/fuckadblock/

(There is also a project, [BlockAdBlock](https://github.com/sitexw/BlockAdBlock), with a more convenient name)

*Come and see the future of FuckAdBlock: [V4 Beta](https://github.com/sitexw/FuckAdBlock/tree/v4.x)*


Valid on
---------------------
- Google Chrome
- Mozilla Firefox
- Internet Explorer (8+)
- Safari
- Opera

Install via
---------------------
NPM:
```
npm install fuckadblock
```
Bower:
```
bower install fuckadblock
```
CDN :
```
https://cdnjs.cloudflare.com/ajax/libs/fuckadblock/3.2.1/fuckadblock.min.js
https://cdn.jsdelivr.net/npm/fuckadblock@3.2.1/fuckadblock.min.js
```
Integrity:
```
sha256-4/8cdZfUJoNm8DLRzuKwvhusQbdUqVov+6bVj9ewL7U= (fuckadblock.js)
sha256-xjwKUY/NgkPjZZBOtOxRYtK20GaqTwUCf7WYCJ1z69w= (fuckadblock.min.js)
```


Code example
---------------------
Ideally positioned at the end of `<body>`.
```javascript
// Function called if AdBlock is not detected
function adBlockNotDetected() {
	alert('AdBlock is not enabled');
}
// Function called if AdBlock is detected
function adBlockDetected() {
	alert('AdBlock is enabled');
}

// We look at whether FuckAdBlock already exists.
if(typeof fuckAdBlock !== 'undefined' || typeof FuckAdBlock !== 'undefined') {
	// If this is the case, it means that something tries to usurp are identity
	// So, considering that it is a detection
	adBlockDetected();
} else {
	// Otherwise, you import the script FuckAdBlock
	var importFAB = document.createElement('script');
	importFAB.onload = function() {
		// If all goes well, we configure FuckAdBlock
		fuckAdBlock.onDetected(adBlockDetected)
		fuckAdBlock.onNotDetected(adBlockNotDetected);
	};
	importFAB.onerror = function() {
		// If the script does not load (blocked, integrity error, ...)
		// Then a detection is triggered
		adBlockDetected(); 
	};
	importFAB.integrity = 'sha256-xjwKUY/NgkPjZZBOtOxRYtK20GaqTwUCf7WYCJ1z69w=';
	importFAB.crossOrigin = 'anonymous';
	importFAB.src = 'https://cdnjs.cloudflare.com/ajax/libs/fuckadblock/3.2.1/fuckadblock.min.js';
	document.head.appendChild(importFAB);
}
```

Default options
---------------------
```javascript
// At launch, check if AdBlock is enabled
// Uses the method fuckAdBlock.check()
checkOnLoad: true

// At the end of the check, is that it removes all events added ?
resetOnEnd: true

// The number of milliseconds between each check
loopCheckTime: 50

// The number of negative checks after which there is considered that AdBlock is not enabled
// Time (ms) = 50*(5-1) = 200ms (per default)
loopMaxNumber: 5

// CSS class used by the bait caught AdBlock
baitClass: 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links'

// CSS style used to hide the bait of the users
baitStyle: 'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;'

// Displays the debug in the console (available only from version 3.2 and more)
debug: false
```

Method available
---------------------
```javascript
// Allows to set options
// #options: string|object
// #value:   string
fuckAdBlock.setOption(options, value);

// Manually check if AdBlock is enabled.
// Returns `true` upon completion of check.
// Returns `false` if check cannot be performed (eg due to another check in progress).
// The parameter 'loop' allows checking without loop several times according to the value of 'loopMaxNumber'
// Example: loop=true  => time~=200ms (time varies depending on the configuration)
//          loop=false => time~=1ms
// #loop: boolean (default: true)
fuckAdBlock.check(loop);

// Allows to manually simulate the presence of AdBlock or not
// #detected: boolean (AdBlock is detected ?)
fuckAdBlock.emitEvent(detected);

// Allows to clear all events added via methods 'on', 'onDetected' and 'onNotDetected'
fuckAdBlock.clearEvent();

// Allows to add an event if AdBlock is detected
// #detected: boolean (true: detected, false: not detected)
// #fn:       function
fuckAdBlock.on(detected, fn);

// Similar to fuckAdBlock.on(true|false, fn)
fuckAdBlock.onDetected(fn);
fuckAdBlock.onNotDetected(fn);
```

Instance
---------------------
*(Available only from version 3.1 and more)*
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
