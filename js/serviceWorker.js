const staticChachesName='site-statics'
const assets = [
	'/',
	''
];

self.addEventListener('install', evt => {
	// console.log('service Worker has been installed')
	caches.open(staticChachesName).then(cache => {
		cache.addAll()
	})
});
console.log(self)
//activate the service 
self.addEventListener('activate', evt => {
	// console.log('service worker has been activated')
});

//listen to fetch events
self.addEventListener('fetch', evt => { 
	// console.log('fetch event',evt)
});