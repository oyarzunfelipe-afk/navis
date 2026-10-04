/* NAVIS MF-PM · service worker mínimo: permite instalar la página como aplicación y la abre aunque la red tarde. */
const CACHE = 'navis-v1';
const BASE = ['./', './index.html', './config.js', './estilo.css', './navis.js',
  './panel/', './panel/index.html', './portal/', './portal/index.html',
  './icons/navis-panel-192.png', './icons/navis-panel-512.png', './icons/navis-portal-192.png', './icons/navis-portal-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
