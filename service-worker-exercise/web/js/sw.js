"use strict";

const version = 2;
var isOnline = true;
var isLoggedIn = false;

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("message", onMessage);


main().catch(console.error);
async function main() {
    console.log(`Service Worker (${version}) is starting...`);
    await sendMessage({ requestStatusUpdate: true} )
}
function onMessage({ data }) {
    if (data.statusUpdate) {
        ({ isOnline, isLoggedIn } = data.statusUpdate );
        console.log(`Service worker (v${version}) status update
        isOnline: ${isOnline}, isLoggedIn ${isLoggedIn}`);
    }
}


async function sendMessage(msg) {
    var allClients = await clients.matchAll({ includeUncontrolled: true })
    return Promise.all(allClients.map(function clientMsg(clinet) {
        var chan = new MessageChannel();
        chan.port1.onmessage = onMessage;
        return clinet.postMessage(msg, [chan.port2]);}
    )
)
}
async function onInstall(event) {
    console.log(`Service Worker (${version}) is installing...`);
    self.skipWaiting();
}

function onActivate(event) {
    console.log(`Service Worker (${version}) is acticating...`);
    event.waitUntil(handleActivation());
}

async function handleActivation() {
    await clients.claim();
    console.log(`Service worker (${version}) activated`);
}
