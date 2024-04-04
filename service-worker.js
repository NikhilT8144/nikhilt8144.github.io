// Define the cache name and assets to cache
const cacheName = 'offline-cache';
const assetsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/offline.html', // This is the offline page you want to display
    // Add paths to other assets you want to cache here
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
    event.respondWith(
        // Try to fetch the request from the cache
        caches.match(event.request).then(function(response) {
            // If request is found in cache, return the cached response
            if (response) {
                return response;
            }

            // If request is not found in cache, fetch it from the network
            return fetch(event.request)
                .then(function(response) {
                    // If request is successful, add the response to the cache
                    return caches.open(cacheName).then(function(cache) {
                        cache.put(event.request.url, response.clone());
                        return response;
                    });
                })
                .catch(function(error) {
                    // If request fails (e.g., offline), serve the offline page
                    return caches.match('/offline.html');
                });
        })
    );
});
