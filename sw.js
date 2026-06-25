const CACHE = 'stash-v2';
const ASSETS = ['./','index.html','manifest.webmanifest','icon-180.png','icon-512.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('supabase.co') || url.includes('jsdelivr')) return; // always live
  if (e.request.mode === 'navigate' || e.request.destination === 'document') {
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then(m => m || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(m => m || fetch(e.request)));
});
