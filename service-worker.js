const CACHE_NAME = "pr-app-v3";

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(["./", "./index.html", "./firebase-config.js", "./manifest.json"])
    )
  );
});

self.addEventListener("fetch", e => {
  if (new URL(e.request.url).pathname.endsWith("/firebase-config.js")) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
