// Define the cache name and assets to cache
const cacheName = 'offline-cache';
const offlinePage = '/offline.html';
const offlineImage = '/offline.png';

// Assets to cache
const assetsToCache = [
    offlinePage,
    offlineImage,
    '/icon.png'
];

// Install the Service Worker
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(assetsToCache);
        })
    );
});

// Intercept fetch requests
self.addEventListener('fetch', function(event) {
    const requestUrl = new URL(event.request.url);

    // Serve the offline page for all requests
    event.respondWith(
        caches.match(offlinePage)
    );
});
