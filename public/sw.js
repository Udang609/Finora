const CACHE_NAME = 'finora-v2';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './pwa-192x192.png',
  './pwa-512x512.png',
  './apple-touch-icon.png'
];

const precacheBuildAssets = async (cache) => {
  try {
    const response = await fetch('./index.html', { cache: 'no-cache' });
    if (!response.ok) return;

    const html = await response.clone().text();
    const urls = Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g))
      .map((match) => match[1])
      .filter((url) => url.startsWith('./assets/'));

    await Promise.all(
      urls.map((url) =>
        fetch(url)
          .then((asset) => (asset.ok ? cache.put(url, asset) : undefined))
          .catch(() => undefined)
      )
    );
  } catch {
    /* Offline shell still works from the navigations cache. */
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        await cache.addAll(CORE_ASSETS);
        await precacheBuildAssets(cache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

const staleWhileRevalidate = (request) => {
  return caches.open(CACHE_NAME).then((cache) => {
    return cache.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && (response.ok || response.type === 'opaque')) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    });
  });
};

const networkFirstNavigation = (request) => {
  return fetch(request)
    .then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      return response;
    })
    .catch(() =>
      caches
        .match(request)
        .then((cached) => cached || caches.match('./index.html'))
    );
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
