/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
const version = '#VERSION_NO#';
let offlineUrl = '#OFFLINE_URL#';

// if its a local instance, then switch to /offline.html
// use includes(..) on a substr so it doesn't get caught in the find/replace of prod
if (offlineUrl.includes('OFFLINE_URL')) {
  offlineUrl = '/offline.html';
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

  // this is the install of the service-worker NOT the install of the WPA to desktop
  // here we establish the offline-cache which contains the offline page.
  // if the user somehow nukes this specific cache they will have issues
  addEventListener('install', (event) => {
    event.waitUntil(
      (async function () {
        const cache = await caches.open('offline-cache');
        await cache.addAll([offlineUrl]);
      })()
    );
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

  // this listener must be set AFTER all the caches are setup
  addEventListener('fetch', (event) => {
    const { request } = event;

    // Always bypass for range requests, due to browser bugs
    if (request.headers.has('range')) return;
    event.respondWith(
      (async function () {
        // Try to get from the cache:
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;

        console.log(request);
        if (
          request.mode === 'navigate' &&
          request.referrerPolicy === 'unsafe-url'
        ) {
          console.log('Service worker pinging root, why?');
          return;
        }

        try {
          // get from the network
          return await fetch(request);
        } catch (err) {
          // If this was a navigation, show the offline page:
          if (request.mode === 'navigate' || request.url.pathname === '/') {
            return caches.match(offlineUrl);
          }
          // Otherwise throw
          console.info('Service Worker Fetch Issue', err);
        }
      })()
    );
  });
}
