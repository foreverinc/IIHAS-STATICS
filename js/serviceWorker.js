const staticChache = 'site-statics-v1';
const dynamicChache='pages-cache-v1';

const assets = [
	"/",
	"static/js/main.js",
	"static/css/output.css",
	"static/img/default.png",
	"static/img/badge.svg",
	"static/img/header.jpg",
	"https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap",
	"static/logo.svg",
	"static/favicon.ico",
	//added
	"/manifest.json",
	"https://fonts.gstatic.com/s/ptsans/v17/jizYRExUiTo99u79D0e0ysmIEDQ.woff2",
	"https://fonts.gstatic.com/s/ptsans/v17/jizYRExUiTo99u79D0e0w8mIEDQ.woff2",
	"https://fonts.gstatic.com/s/ptsans/v17/jizYRExUiTo99u79D0e0ycmIEDQ.woff2",
	"https://fonts.gstatic.com/s/ptsans/v17/jizYRExUiTo99u79D0e0x8mI.woff2",
	"https://fonts.gstatic.com/s/ptsans/v17/jizdRExUiTo99u79D0e8fOydIhUdwzM.woff2",
	"https://fonts.gstatic.com/s/ptsans/v17/jizdRExUiTo99u79D0e8fOydKxUdwzM.woff2",
	"https://fonts.gstatic.com/s/ptsans/v17/jizdRExUiTo99u79D0e8fOydIRUdwzM.woff2",
	"/offline/"
];

//cache size limit function

const limitCacheSize = (name, size) => {
	caches.open(name).then(cache => {
		cache.keys().then(keys => {
			if (keys.length > size) {
				cache.delete(keys[0]).then(limitCacheSize(name,size))
			}
		})
	})
}


self.addEventListener('install', evt => {
	// console.log('service Worker has been installed')
	evt.waitUntil(
		caches.open(staticChache).then((cache) => {
			cache.addAll(assets);
		})
	);
	
});

//activate the service 
self.addEventListener('activate', evt => {
	// console.log('service worker has been activated');
	evt.waitUntil(
		caches.keys().then(keys => {
			//console.log(keys)
			return Promise.all(keys
				.filter(key => key !== staticChache && dynamicChache)
				.map(key => caches.delete(key))
			)
		})
	)
});


self.addEventListener("fetch", (evt) => {
	evt.respondWith(
		fetch(evt.request)
			.then((fetchRes) => {
				// Clone the response before caching and returning
				const clonedResponse = fetchRes.clone();
				caches.open(dynamicChache).then((cache) => {
					cache.put(evt.request.url, clonedResponse);
					limitCacheSize(dynamicChache, 15);
				});
				return fetchRes;
			})
			.catch(() => {
				return caches.match(evt.request).then((cacheRes) => {
					return cacheRes || caches.match("/offline/");
				});
			})
	);
});

