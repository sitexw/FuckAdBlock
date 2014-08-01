FuckAdBlock (v3.0.1)
===========

Allows you to detect those nasty ad blockers.
Online exemple: http://sitexw.fr/fuckadblock/


Valid on :
---------------------
- Google Chrome
- Mozilla Firefox
- Internet Explorer
- Safari
- Opera

Code exemple
---------------------
```
// Function called if AdBlock is not detected
function adBlockNotDetected() {
	alert('AdBlock is not actived');
}
// Function called if AdBlock is detected
function adBlockDetected() {
	alert('AdBlock is actived');
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
fuckAdBlock.setOptions('checkOnLoad', false);
// and|or
fuckAdBlock.setOptions({
	checkOnLoad: false,
	resetOnEnd: false
});
```

Default options
---------------------
```
// At launch, check if AdBlock is enabled
// Uses the method fuckAdBlock.check()
checkOnLoad: true

// At the end of the check, is that it removes all events added ?
resetOnEnd: true

// The number of milliseconds between each check
loopCheckTime: 50

// The number of negative checks after which there is considered that AdBlock is not actived
// Time (ms) = 50*(5-1) = 200ms (per default)
loopMaxNumber: 5

// CSS class used by the bait caught AdBlock
baitClass: 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links'

// CSS style used to hide the bait of the users
baitStyle: 'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;'
```

Method available
---------------------
```
// Allows to set options
// #options: string|object
// #value:   string
fuckAdBlock.setOption(options, value);

// Allows to check if AdBlock is enabled
// The parameter 'loop' allows checking without loop several times according to the value of 'loopMaxNumber'
// Exemple: loop=true  => time~=200ms (time varies depending on the configuration)
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
