const CACHE_NAME = "pr-app-v14";

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
      cache.addAll(["./", "./index.html", "./default-exercises.js", "./firebase-config.js", "./manifest.json"])
    )
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  const shouldFetchFresh =
    e.request.mode === "navigate" ||
    url.pathname.endsWith("/") ||
    url.pathname.endsWith("/index.html") ||
    url.pathname.endsWith("/default-exercises.js") ||
    url.pathname.endsWith("/firebase-config.js") ||
    url.pathname.endsWith("/service-worker.js");

  if (shouldFetchFresh) {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
          return response;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
