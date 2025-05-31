const CACHE_NAME = 'linksall-cache-v1';
const urlsToCache = [
  '/linksall/', // Or '/linksall/index.html' if that's your main page
  '/linksall/styles.css', // Add paths to your CSS files
  '/linksall/script.js',  // Add paths to your JS files
  '/linksall/icon-192x192.png', // Cache your icons
  '/linksall/icon-512x512.png'
  // Add any other important assets
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
