const CACHE = 'guia-v1';
const STATIC = ['/', '/index.html', '/guia.pdf', '/manifest.json',
  '/pwa-192x192.png', '/pwa-512x512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(
    ks.filter(k => k !== CACHE).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() =>
      e.request.mode === 'navigate' ? caches.match('/index.html') : Response.error()
    ))
  );
});
