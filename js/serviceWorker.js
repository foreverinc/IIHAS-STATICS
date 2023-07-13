const staticCacheName = "site-statics-v1.5";


const assets = [
	"/",
	"https://foreverinc.github.io/IIHAS-STATICS/js/main.js",
	"https://foreverinc.github.io/IIHAS-STATICS/js/darkMode.js",
	"https://foreverinc.github.io/IIHAS-STATICS/css/output.css",
	"https://foreverinc.github.io/IIHAS-STATICS/img/default.png",
	"https://foreverinc.github.io/IIHAS-STATICS/img/badge.svg",
	"https://foreverinc.github.io/IIHAS-STATICS/img/header.jpg",
	"https://foreverinc.github.io/IIHAS-STATICS/logo.svg",
	"https://foreverinc.github.io/IIHAS-STATICS/favicon.ico",
	//added
	"/manifest.json",
	"/offline/",
];


// Install service worker
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(staticCacheName).then((cache) => {
			console.log("Cache opened");
			return cache.addAll(assets);
		})
	);
});

// Activate service worker and clean up old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((cacheName) => {
						return (
							cacheName.startsWith("site-static") &&
							cacheName !== staticCacheName
						);
					})
					.map((cacheName) => {
						return caches.delete(cacheName);
					})
			);
		})
	);
});

// Fetch from cache or network
self.addEventListener("fetch", (event) => {
	event.respondWith(
		fetch(event.request)
			.then((fetchResponse) => {
				// Check if the response is valid
				if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== "basic") {
					return fetchResponse;
				}

				// Clone the response
				const responseToCache = fetchResponse.clone();

				// Open the cache and add the response to it
				caches.open(staticCacheName).then((cache) => {
					cache.put(event.request, responseToCache);
				});

				// Return the response
				return fetchResponse;
			})
			.catch(() => {
				// If fetching from the network fails, return the offline page
				return caches.match("/offline/");
			})
	);
});
