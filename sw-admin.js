/* Service Worker — Carnavals Admin PWA
   Cache uniquement le shell (HTML/manifest/icônes).
   Tout appel vers api.github.com va toujours au réseau (données temps réel).
*/
const CACHE   = 'cb-admin-v1';
const SHELL   = [
  './live-admin.html',
  './manifest-admin.json',
  './icons/icon-admin-192.png',
  './icons/icon-admin-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Toujours réseau pour l'API GitHub (données live) et les CDN externes
  if (url.hostname !== self.location.hostname) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Shell : cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
