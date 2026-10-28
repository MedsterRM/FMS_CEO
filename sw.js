// FMS CEO · funciona sin conexión una vez instalado
const CACHE = 'fms-ceo-v1.2.1b';
const FILES = ['./', './index.html', './manifest.webmanifest', './build/icon-192.png', './build/icon-512.png', './build/icon-192-maskable.png', './build/icon-512-maskable.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // primero la red (para recibir actualizaciones); si no hay conexión, lo guardado
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
