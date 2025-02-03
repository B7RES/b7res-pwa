const CACHE_NAME = 'pwa-cache-v15';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa/icon-512x512.png',
  '/pwa/screenshot1.jpg',
  '/pwa/screenshot2.jpg',
  '/pwa/screenshot3.jpg',
  '/pwa/screenshot4.jpg',
  '/pwa/android-icon-192x192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })))
          .catch(err => {
            console.error('Failed to cache', err);
          });
      })
  );
});

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

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
