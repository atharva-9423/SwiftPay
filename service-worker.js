self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('swiftpay-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/script.js'
        // add other needed files
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
