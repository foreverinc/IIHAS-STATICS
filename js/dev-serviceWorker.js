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
	if (self.Notification && self.Notification.permission === "granted") {
		const data = event.data ? event.data.json() : {};
		const title = data.title || "New Notification";
		const message = data.message || "Hey!! You've got something at Redo";
		const icon = "https://i.ibb.co/YbFPdWS/redo-2-removebg-preview.png";

		const options = {
			body: message,
			tag: "simple-push-demo-notification",
			icon: icon,
			actions: [
				{
					title: "View",
					action: "https://redo-testapp.onrender.com/",
				},
			],
		};

		event.waitUntil(self.registration.showNotification(title, options));
	}
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	event.waitUntil(
		clients.matchAll().then((clientList) => {
			const url = "https://redo-testapp.onrender.com/";
			if (clientList && clientList.length) {
				return clientList[0].focus();
			}

			return clients.openWindow(url);
		})
	);
});
