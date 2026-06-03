/* Service Worker — Carnavals Admin PWA
   Rôle minimal : permettre l'installation PWA.
   live-admin.html = toujours réseau (jamais mis en cache).
   Seules les icônes sont cachées.
*/
const CACHE = 'cb-admin-v3';
const ICONS = [
  './icons/icon-admin-192.png',
  './icons/icon-admin-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ICONS)).then(() => self.skipWaiting())
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

  // Icônes : cache-first
  if (url.pathname.includes('/icons/icon-admin-')) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
    return;
  }

  // Tout le reste (HTML, API GitHub, etc.) : toujours réseau
  e.respondWith(fetch(e.request));
});
