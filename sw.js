const CACHE_NAME = 'oxi-topup-v1';
const urlsToCache = [
  '/oxi-topup/',
  '/oxi-topup/index.html',
  '/oxi-topup/style.css',
  '/oxi-topup/config.js',
  '/oxi-topup/login.html',
  '/oxi-topup/dashboard.html',
  '/oxi-topup/orders.html',
  '/oxi-topup/transactions.html',
  '/oxi-topup/add-money.html',
  '/oxi-topup/product.html',
  '/oxi-topup/leaderboard.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.log('Cache failed:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
