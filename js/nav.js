// Enregistrement du service worker - WIYAO
// Placé dans nav.js (chargé sur les 19 pages, 404.html comprise) pour que le
// SW s'installe quelle que soit la première page visitée, pas seulement
// celles avec app.js.
(function () {
  "use strict";

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();

// Menu mobile - WIYAO
(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  var MENU_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  var CLOSE_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

  function setOpen(isOpen) {
    nav.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    toggle.innerHTML = isOpen ? CLOSE_ICON : MENU_ICON;
  }

  toggle.innerHTML = MENU_ICON;

  toggle.addEventListener("click", function () {
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) setOpen(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) setOpen(false);
  });
})();

// Menus déroulants Parcours / Opportunités / Communauté (desktop) - WIYAO
// Trois groupes indépendants dans la barre, un seul ouvert à la fois.
// S'ouvrent au survol (hover) sans avoir besoin de cliquer ; le clic/Entrée
// reste disponible (clavier, écrans tactiles sans vrai survol).
(function () {
  "use strict";

  var groups = Array.prototype.slice.call(document.querySelectorAll(".nav-more"));
  if (!groups.length) return;

  var CLOSE_DELAY = 200; // ms - laisse le temps de traverser l'espace entre le bouton et le menu
  var closeTimers = typeof WeakMap === "function" ? new WeakMap() : null;

  function setOpen(group, isOpen) {
    var toggle = group.querySelector(".nav-more-toggle");
    group.classList.toggle("is-open", isOpen);
    if (toggle) toggle.setAttribute("aria-expanded", String(isOpen));
  }

  function clearCloseTimer(group) {
    if (!closeTimers) return;
    var timer = closeTimers.get(group);
    if (timer) {
      clearTimeout(timer);
      closeTimers.delete(group);
    }
  }

  function closeAll(except) {
    groups.forEach(function (group) {
      if (group !== except) {
        clearCloseTimer(group);
        setOpen(group, false);
      }
    });
  }

  groups.forEach(function (group) {
    var toggle = group.querySelector(".nav-more-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      clearCloseTimer(group);
      var willOpen = !group.classList.contains("is-open");
      closeAll(group);
      setOpen(group, willOpen);
    });

    group.addEventListener("mouseenter", function () {
      clearCloseTimer(group);
      closeAll(group);
      setOpen(group, true);
    });

    group.addEventListener("mouseleave", function () {
      if (!closeTimers) {
        setOpen(group, false);
        return;
      }
      closeTimers.set(group, setTimeout(function () {
        setOpen(group, false);
      }, CLOSE_DELAY));
    });

    group.querySelectorAll(".nav-more-menu a").forEach(function (link) {
      link.addEventListener("click", function () {
        clearCloseTimer(group);
        setOpen(group, false);
      });
    });
  });

  document.addEventListener("click", function (event) {
    var withinAnyGroup = groups.some(function (group) {
      return group.contains(event.target);
    });
    if (!withinAnyGroup) closeAll();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeAll();
  });
})();

// Bouton retour en haut - WIYAO
(function () {
  "use strict";

  var button = document.createElement("button");
  button.className = "back-to-top";
  button.type = "button";
  button.setAttribute("aria-label", "Retour en haut de page");
  button.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
  document.body.appendChild(button);

  function toggleVisibility() {
    button.classList.toggle("is-visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();

  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

// Bandeau d'annonce (façon African Tech Journal) - WIYAO
// Fine barre au-dessus de l'en-tête, sur toutes les pages : la première actu
// de actualites.html (l'ordre choisi sur cette page), relue à chaque visite,
// donc jamais à ressaisir ici. Rien n'est enregistré dans le navigateur.
(function () {
  "use strict";

  var header = document.querySelector("header.site-header");
  if (!header || !window.fetch || !window.DOMParser) return;

  var bar = document.createElement("aside");
  bar.className = "announce-bar";
  bar.hidden = true;
  header.parentNode.insertBefore(bar, header);

  var item = null;

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Texte brut d'une traduction (qui peut contenir du HTML), sans rien
  // exécuter ni charger.
  function plain(html) {
    return new DOMParser().parseFromString(String(html), "text/html").body.textContent.replace(/\s+/g, " ").trim();
  }

  function tr(suffix, fallback, en) {
    var v = window.WIYAO_I18N && item.key ? window.WIYAO_I18N.t(item.key + "." + suffix, en ? "en" : "fr") : null;
    return v == null ? fallback : plain(v);
  }

  function render() {
    if (!item) return;
    var en = document.documentElement.lang === "en";
    bar.setAttribute("aria-label", en ? "Announcement" : "Annonce");
    bar.innerHTML =
      '<a class="announce-link" href="actualites.html' + (item.id ? "#" + encodeURIComponent(item.id) : "") + '">' +
      '<span class="announce-tag">' + (en ? "Top story" : "À la une") + "</span>" +
      '<span class="announce-text">' + esc(tr("h3", item.title, en)) + "</span>" +
      (item.date ? '<span class="announce-date">' + esc(tr("date", item.date, en)) + "</span>" : "") +
      '<span class="announce-arrow" aria-hidden="true">→</span></a>';
    bar.hidden = false;
  }

  function read(doc) {
    var card = doc.querySelector("article.actu-card");
    if (!card) return;
    var h3 = card.querySelector(".actu-card-title");
    var date = card.querySelector('.actu-meta-value[data-i18n-key$=".date"]');
    var key = h3 && h3.getAttribute("data-i18n-key");
    item = {
      id: card.id || "",
      key: key ? key.replace(/\.h3$/, "") : "",
      title: h3 ? h3.textContent.replace(/\s+/g, " ").trim() : "",
      date: date ? date.textContent.replace(/\s+/g, " ").trim() : "",
    };
    if (item.title) render();
  }

  // Sur actualites.html, les cartes sont déjà là : pas besoin de les recharger.
  if (document.querySelector("article.actu-card")) {
    document.addEventListener("DOMContentLoaded", function () { read(document); });
  } else {
    // Partagé avec la section actus de l'accueil (js/app.js) : une seule
    // requête pour les deux.
    window.WIYAO_ACTUALITES_HTML = fetch("actualites.html")
      .then(function (r) { return r.ok ? r.text() : Promise.reject(new Error(String(r.status))); });
    window.WIYAO_ACTUALITES_HTML
      .then(function (html) { read(new DOMParser().parseFromString(html, "text/html")); })
      .catch(function () {});
  }

  // i18n.js change l'attribut lang de <html> à chaque bascule FR/EN.
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();

// Chiffres sous les titres, « Défiler » et boutons « Copier » - WIYAO
(function () {
  "use strict";

  function isEn() {
    return document.documentElement.lang === "en";
  }

  // 1) Bandes de chiffres (façon IT Foundation) : data-count-of="sélecteur"
  //    compte les éléments réellement présents sur la page, jamais à la main.
  function fillCounts() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-count-of]"), function (el) {
      var n = document.querySelectorAll(el.getAttribute("data-count-of")).length;
      if (n) el.textContent = n;
    });
  }

  // 2) « Défiler » sous le bandeau de titre des pages internes (pas
  //    l'accueil ni la 404) : descend vers le contenu, sous l'en-tête collant.
  var banner = document.querySelector(".page-title-banner:not(.home-hero)");
  var scrollBtn = null;
  if (banner && !banner.querySelector(".error-code")) {
    scrollBtn = document.createElement("button");
    scrollBtn.type = "button";
    scrollBtn.className = "banner-scroll";
    banner.appendChild(scrollBtn);
    scrollBtn.addEventListener("click", function () {
      var target = banner.nextElementSibling;
      while (target && (target.hidden || target.classList.contains("banner-stats"))) target = target.nextElementSibling;
      if (!target) return;
      var header = document.querySelector("header.site-header");
      var offset = header ? header.offsetHeight + 12 : 0;
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: reduce ? "auto" : "smooth" });
    });
  }

  function renderScroll() {
    if (!scrollBtn) return;
    scrollBtn.innerHTML =
      '<span class="banner-scroll-mouse" aria-hidden="true"><span></span></span><span class="banner-scroll-text">' +
      (isEn() ? "Scroll" : "Défiler") + "</span>";
    scrollBtn.setAttribute("aria-label", isEn() ? "Scroll down to the content" : "Descendre vers le contenu");
  }

  // 3) Boutons « Copier » (façon UI UX Pro Max) : data-copy="valeur", utile
  //    sur un téléphone sans application e-mail configurée.
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      ta.remove();
      if (ok) resolve(); else reject(new Error("copy"));
    });
  }

  function renderCopy() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (btn) {
      if (btn.classList.contains("is-copied")) return;
      var email = btn.getAttribute("data-copy-what") === "email";
      btn.textContent = isEn() ? "Copy" : "Copier";
      btn.setAttribute("aria-label",
        (isEn() ? (email ? "Copy the email address " : "Copy the number ") : (email ? "Copier l'adresse e-mail " : "Copier le numéro ")) +
        btn.getAttribute("data-copy"));
    });
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-copy]") : null;
    if (!btn) return;
    copyText(btn.getAttribute("data-copy")).then(function () {
      btn.classList.add("is-copied");
      btn.textContent = isEn() ? "Copied ✓" : "Copié ✓";
      setTimeout(function () {
        btn.classList.remove("is-copied");
        renderCopy();
      }, 2000);
    }).catch(function () {});
  });

  renderScroll();
  renderCopy();
  document.addEventListener("DOMContentLoaded", fillCounts);
  new MutationObserver(function () {
    renderScroll();
    renderCopy();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
