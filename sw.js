const CACHE_NAME = "wiyao-v271";

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
  "contact.html",
  "proposer.html",
  "about.html",
  "mentions-legales.html",
  "politique-confidentialite.html",
  "conditions-utilisation.html",
  "css/style.css",
  "js/app.js",
  "js/data.js",
  "js/nav.js",
  "js/assistant.js",
  "js/i18n.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/logo-white.png",
  "icons/credo-ahiafor.jpg",
  "fonts/jetbrains-mono-variable-latin.woff2",
  "fonts/jetbrains-mono-variable-latin-ext.woff2",
];

function isHtmlRequest(request) {
  if (request.mode === "navigate") return true;
  try {
    const url = new URL(request.url);
    return url.pathname.endsWith(".html") || url.pathname === "/" || url.pathname === "";
  } catch (e) {
    return false;
  }
}

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

// HTML with a query string (contact form fallback, roadmap?id=, etc.) is never
// written to Cache Storage: a GET with name/email/message in the URL must not
// persist in the service worker. Other same-origin GETs stay stale-while-revalidate.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) return;

  const url = new URL(request.url);
  if (isHtmlRequest(request) && url.search) {
    const barePath = url.pathname === "/" || url.pathname === "" ? "index.html" : url.pathname.replace(/^\//, "");
    event.respondWith(
      fetch(request).catch(() => caches.match(barePath).then((cached) => cached || caches.match("index.html")))
    );
    return;
  }

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
