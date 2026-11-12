const CACHE_NAME = "wiyao-v456";

const PRECACHE_URLS = [
  "index.html",
  "roadmaps.html",
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
  "js/lang-boot.js",
  "js/vendor/gsap.min.js",
  "js/anim.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/logo-white.png",
  "icons/credo-ahiafor.jpg",
  "fonts/jetbrains-mono-variable-latin.woff2",
  "fonts/jetbrains-mono-variable-latin-ext.woff2",
  "fonts/bricolage-grotesque-variable-latin.woff2",
  "fonts/bricolage-grotesque-variable-latin-ext.woff2",
  "fonts/urbanist-variable-latin.woff2",
  "fonts/urbanist-variable-latin-ext.woff2",
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

  // Une page HTML avec paramètres (roadmap.html?id=…, ou un formulaire envoyé
  // en GET sans JavaScript, nom et e-mail dans l'adresse) n'est jamais écrite
  // dans le cache : réseau d'abord, et hors ligne la même page sans paramètres.
  const url = new URL(request.url);
  const isHtml = request.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname === "/";
  if (isHtml && url.search) {
    const barePath = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\//, "");
    event.respondWith(
      fetch(request).catch(() => caches.match(barePath).then((cached) => cached || caches.match("index.html")))
    );
    return;
  }

  // Hors ligne, un fichier versionné (style.css?v=256, app.js?v=77…) absent
  // du cache retombe sur sa copie précachée sans version : PRECACHE_URLS
  // n'a pas les ?v=, et juste après une mise à jour du service worker le
  // cache ne contient qu'elles, d'où des pages hors ligne sans CSS ni
  // JavaScript (constaté le 2026-11-10). Avec réseau, rien ne change : la
  // version exacte est toujours demandée.
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
        .catch(() => cached || (url.search ? caches.match(request, { ignoreSearch: true }) : undefined));
      return cached || network;
    })
  );
});
