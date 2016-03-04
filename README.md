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
Manual:
```
Download "fuckadblock.js" and add it to your website.
```
Bower:
```
bower install fuckadblock
```
Node.js/io.js:
```
npm install fuckadblock
```


Code example
---------------------
```javascript
// Function called if AdBlock is not detected
function adBlockNotDetected() {
	alert('AdBlock is not enabled');
}
// Function called if AdBlock is detected
function adBlockDetected() {
	alert('AdBlock is enabled');
}

// Recommended audit because AdBlock lock the file 'fuckadblock.js' 
// If the file is not called, the variable does not exist 'fuckAdBlock'
// This means that AdBlock is present
if(typeof fuckAdBlock === 'undefined') {
	adBlockDetected();
} else {
	fuckAdBlock.onDetected(adBlockDetected);
	fuckAdBlock.onNotDetected(adBlockNotDetected);
	// and|or
	fuckAdBlock.on(true, adBlockDetected);
	fuckAdBlock.on(false, adBlockNotDetected);
	// and|or
	fuckAdBlock.on(true, adBlockDetected).onNotDetected(adBlockNotDetected);
}

// Change the options
fuckAdBlock.setOption('checkOnLoad', false);
// and|or
fuckAdBlock.setOption({
	debug: true,
	checkOnLoad: false,
	resetOnEnd: false
});
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

// Allows to check if AdBlock is enabled
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
