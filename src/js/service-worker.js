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
  self.addEventListener('install', async (event) => {
    event.waitUntil(
      caches.open(offlineCacheName).then((cache) => cache.add(offlineUrl))
    );
  });

  // navigationPreload.enable();

  const networkOnly = new workbox.strategies.NetworkOnly();
  const navigationHandler = async (params) => {
    try {
      // Attempt a network request.
      return await networkOnly.handle(params).catch(() => {
        console.log('...');
      });
    } catch (error) {
      // If it fails, return the cached HTML.
      return caches.match(offlineUrl, {
        cacheName: offlineCacheName,
      });
    }
  };

  // Register this strategy to handle all navigations.
  workbox.routing.registerRoute(
    new workbox.routing.NavigationRoute(navigationHandler)
  );

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
