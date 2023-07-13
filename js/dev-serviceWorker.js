const staticCacheName = "site-static-v0";
const assets = [
	// ... Your existing cached assets
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
				if (
					!fetchResponse ||
					fetchResponse.status !== 200 ||
					fetchResponse.type !== "basic"
				) {
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

self.addEventListener("push", (event) => {
	const data = event.data.json();

	const head = data.head || "New Notification";
	const body =
		data.body ||
		"This is default content. Your notification didn't have one";

	const options = {
		body: body,
		icon: "https://i.imgur.com/MZM3K5w.png",
	};

	event.waitUntil(self.registration.showNotification(head, options));
});
