const CACHE_NAME = "wiyao-v12";

const PRECACHE_URLS = [
  "index.html",
  "recherche.html",
  "roadmap.html",
  "ecoles.html",
  "calendrier.html",
  "bourses-financement.html",
  "stages-emploi.html",
  "test-orientation.html",
  "ecosysteme.html",
  "actualites.html",
  "temoignages.html",
  "faq.html",
  "about.html",
  "mentions-legales.html",
  "politique-confidentialite.html",
  "css/style.css",
  "js/app.js",
  "js/data.js",
  "js/nav.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "fonts/cabin-latin.woff2",
  "fonts/cabin-latin-ext.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

// Stale-while-revalidate: serve from cache instantly (works offline), refresh in the background.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
