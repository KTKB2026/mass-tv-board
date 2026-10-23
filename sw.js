const CACHE = 'mass-tv-v1';
const SHELL = ['./', './index.html', './assets/logo-m-mark.png', './assets/fonts/Sebastien-Slab-Round-FREEWARE.ttf', './assets/vendor/qrcode.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first so sheet edits and new versions show up; cache fallback so
// the board, fonts, and ad images still load when the gym Wi-Fi drops.
// Sheet CSVs skip the cache: the page keeps its own last good copy.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || /output=csv|\.csv(\?|$)/.test(e.request.url)) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() =>
      caches.match(e.request, { ignoreSearch: true })
        .then(m => m || caches.match('./index.html'))
    )
  );
});
