FuckAdBlock
===========

Allows you to detect those nasty ad blockers (version 2.2.2)

```
fuckAdBlock.add(true, function() {  /* what to do in case of an ad blocker */  });
fuckAdBlock.add(false, function() {  /* what to do in case of no ad blocker */  });
fuckAdBlock.check(); // check and trigger callbacks
fuckAdBlock.removeAll(); // detach all the delegates 
```
