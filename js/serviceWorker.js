var staticCacheName = "djangopwa-v1";

self.addEventListener("install", function (event) {
	event.waitUntil(
		caches.open(staticCacheName).then(function (cache) {
			return cache.addAll(["/"]); // Specify the URLs to cache inside the array
		})
	);
});

self.addEventListener("fetch", function (event) {
	var requestUrl = new URL(event.request.url);
	if (requestUrl.origin === location.origin) {
		if (requestUrl.pathname === "/") {
			event.respondWith(caches.match("/")); // Specify the URL to match for the home page
			return;
		}
	}
	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		})
	);
});
