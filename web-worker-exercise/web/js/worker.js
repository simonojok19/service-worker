"use strict";

var curFib = 0;

// TODO
self.postMessage("Hello from the web worker");
self.onmessage = onMessage;


// **********************************
function onMessage(event) {
	console.log('Recieved in the web worker: ', event.data);
	getNextFib();
}

function getNextFib() {
	var fibNum = fib(curFib);
	self.postMessage({ index: curFib, fibNum: fibNum });
	curFib++;
	setTimeout(getNextFib, 0);
}

function fib(n) {
	if (n < 2) {
		return n;
	}
	return fib(n-1) + fib(n-2);
}
