/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
const version = '#VERSION_NO#';
let offlineUrl = '#OFFLINE_URL#';
const offlineCacheName = 'offline-cache';

// if its a local instance, then switch to /offline.html
// use includes(..) on a substr so it doesn't get caught in the find/replace of prod
if (offlineUrl.includes('OFFLINE_URL')) {
  offlineUrl = 'offline.html';
}

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js'
);

if (workbox) {
  // Skip waiting for service worker update
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      console.log('skip waiting');
      skipWaiting();
    }
  });

  // new junk to satisfy August 2021 update
  self.addEventListener('install', (event) => {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(offlineCacheName);
        // Setting {cache: 'reload'} in the new request will ensure that the
        // response isn't fulfilled from the HTTP cache; i.e., it will be from
        // the network.
        await cache.add(new Request(offlineUrl, { cache: 'reload' }));
      })()
    );
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
  });

  // new junk to satisfy August 2021 update
  self.addEventListener('fetch', (event) => {
    // We only want to call event.respondWith() if this is a navigation request
    // for an HTML page.
    if (event.request.mode === 'navigate') {
      event.respondWith(
        (async () => {
          try {
            // Always try the network first.
            const networkResponse = await fetch(event.request);
            return networkResponse;
          } catch (error) {
            // catch is only triggered if an exception is thrown, which is likely
            // due to a network error.
            // If fetch() returns a valid HTTP response with a response code in
            // the 4xx or 5xx range, the catch() will NOT be called.
            console.log('Fetch failed; returning offline page instead.', error);

            const cache = await caches.open(offlineCacheName);
            const cachedResponse = await cache.match(offlineUrl);
            return cachedResponse;
          }
        })()
      );
    }

    // If our if() condition is false, then this fetch handler won't intercept the
    // request. If there are any other fetch handlers registered, they will get a
    // chance to call event.respondWith(). If no fetch handlers call
    // event.respondWith(), the request will be handled by the browser as if there
    // were no service worker involvement.
  });

  // no caching on wordpress routes
  workbox.routing.registerRoute(
    new RegExp('/wp/'),
    new workbox.strategies.NetworkOnly()
  );

  // Javascript
  workbox.routing.registerRoute(
    /\.js$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'js-cache',
    })
  );

  // CSS
  workbox.routing.registerRoute(
    /\.css$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'css-cache',
    })
  );

  // Fonts
  workbox.routing.registerRoute(
    /\.(?:ttf|woff|woff2)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'font-cache',
    })
  );

  // Images
  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // Google Analytics
  workbox.googleAnalytics.initialize();

  // Google Fonts stylesheets with a stale-while-revalidate strategy.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets-cache',
    })
  );

  // Cache the underlying font files with a cache-first strategy for 1 year.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts-webfonts-cache',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    })
  );
}
