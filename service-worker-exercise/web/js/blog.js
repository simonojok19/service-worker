(function Blog(){
	"use strict";

	var offlineIcon;
	var isOnline = ("onLine" in navigator) ? navigator.onLine: true;
	var isLoggedIn = /isLoggedIn=1/.test(document.cookie.toString() || "");
	var usingSW = ("serviceWorker" in navigator);
	var swRegistration;
	var svcworker; 

	document.addEventListener("DOMContentLoaded",ready,false);
	initServiceWorker().catch((error) => console.log(error));

	// **********************************

	function ready() {
		offlineIcon = document.getElementById("connectivity-status");
		if (!isOnline) {
			console.log(isOnline);
			console.log("!online");
			offlineIcon.classList.remove("hidden");
		}
		window.addEventListener("online", function online() {
			this.console.log("online L");
			offlineIcon.classList.add("hidden");
			isOnline = true;
			sendStatusUpdate();
		});
		window.addEventListener("offline", function offline() {
			this.console.log("offline L");
			offlineIcon.classList.remove("hidden");
			isOnline = false;
			sendStatusUpdate();
		});
	}

	async function initServiceWorker() {
		swRegistration = await navigator.serviceWorker.register(
			"/js/sw.js",
			{updateViaCache: "none"});
		svcworker = swRegistration.installing || swRegistration.waiting || swRegistration.active
		navigator.serviceWorker.addEventListener("controllerchange", function onController() {
			svcworker = navigator.serviceWorker.controller;
			sendStatusUpdate(svcworker);
		});
		navigator.serviceWorker.addEventListener("message", onSWMessage);
	}

	function onSWMessage(event) {
		var { data } = event;
		if (data.requestStatusUpdate) {
			console.log(`Recieved status upate request from service worker`);
			sendStatusUpdate(event.ports && event.ports[0]);
			console.log("event: ", event);
		}
	}

	function sendStatusUpdate(target) {
		sendSWMessage({ statusUpdate: { isOnline, isLoggedIn }}, target);
	}

	async function sendSWMessage(msg, target) {
		if (target) {
			target.postMessage(msg);
		} else if (svcworker) {
			svcworker.postMessage(msg);
		} else {
			navigator.serviceWorker.controller.postMessage(msg);
		}
	}

})();
