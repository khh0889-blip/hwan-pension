/* 연금 허브 캐시 — 셸은 네트워크 우선으로 새 버전을 바로 받고,
   시세 파일(prices.json)은 항상 네트워크에서 먼저 받아온다. 외부 요청은 하지 않습니다. */
const CACHE = 'hwan-pension-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function putInCache(req, res) {
  if (res && res.ok) {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
  }
}

/* 네트워크 우선, 실패·시간 초과면 캐시로 조용히 물러난다. */
function networkFirst(req, timeoutMs) {
  return new Promise((resolve) => {
    let done = false;
    const fallback = () => caches.match(req).then((hit) => hit || Response.error());
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      fallback().then(resolve);
    }, timeoutMs);
    fetch(req).then((res) => {
      putInCache(req, res);
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(res);
    }).catch(() => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      fallback().then(resolve);
    });
  });
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (url.pathname.endsWith('/prices.json')) {
    e.respondWith(networkFirst(req, 6000));
    return;
  }
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith(networkFirst(req, 4500));
    return;
  }
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      putInCache(req, res);
      return res;
    }))
  );
});
