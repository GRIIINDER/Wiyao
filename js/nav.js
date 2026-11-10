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

// Menus déroulants Parcours / Opportunités / Communauté / Contact - WIYAO
// Quatre groupes indépendants dans la barre, un seul ouvert à la fois. S'ouvrent
// au survol de la souris ; le clic / Entrée reste disponible (clavier, écrans
// tactiles). Sous 1 080 px, ils sont remplacés par le menu « hamburger ».
(function () {
  "use strict";

  var groups = Array.prototype.slice.call(document.querySelectorAll(".nav-more"));
  if (!groups.length) return;

  var CLOSE_DELAY = 200; // ms - laisse le temps de traverser l'espace entre le bouton et le menu
  var closeTimers = typeof WeakMap === "function" ? new WeakMap() : null;
  var hoverOpenedAt = new Map();

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
      // Un clic juste après l'ouverture au survol garde le menu ouvert
      // (sinon le survol l'ouvre et le clic le referme aussitôt).
      var justHovered = Date.now() - (hoverOpenedAt.get(group) || 0) < 800;
      var willOpen = justHovered || !group.classList.contains("is-open");
      hoverOpenedAt.delete(group);
      closeAll(group);
      setOpen(group, willOpen);
    });

    // Survol à la souris seulement : sur écran tactile, un appui déclenche
    // aussi un « survol » juste avant le clic, qui refermait aussitôt le menu.
    group.addEventListener("pointerenter", function (event) {
      if (event.pointerType !== "mouse") return;
      clearCloseTimer(group);
      closeAll(group);
      if (!group.classList.contains("is-open")) hoverOpenedAt.set(group, Date.now());
      setOpen(group, true);
    });

    group.addEventListener("pointerleave", function (event) {
      if (event.pointerType !== "mouse") return;
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

// En-tête façon Woudy - WIYAO
// La barre prend un fond dès qu'on défile, une fine barre bleue suit la
// lecture, et sous 1 080 px le bouton « hamburger » ouvre le panneau des menus.
(function () {
  "use strict";

  var header = document.querySelector("header.site-header");
  if (!header) return;
  var progress = document.querySelector(".scroll-progress");
  var ticking = false;

  function update() {
    ticking = false;
    var root = document.documentElement;
    var y = window.pageYOffset || root.scrollTop;
    header.classList.toggle("is-scrolled", y > 8);
    if (progress) {
      var max = root.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    }
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener("resize", update);
  update();

  var burger = header.querySelector(".nav-burger");
  var nav = header.querySelector(".site-nav");
  if (!burger || !nav) return;

  function setMenu(isOpen) {
    header.classList.toggle("is-menu-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
  }

  burger.addEventListener("click", function (event) {
    event.stopPropagation();
    setMenu(!header.classList.contains("is-menu-open"));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  document.addEventListener("click", function (event) {
    if (header.classList.contains("is-menu-open") && !nav.contains(event.target)) setMenu(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && header.classList.contains("is-menu-open")) {
      setMenu(false);
      burger.focus();
    }
  });

  // Retour à la largeur d'ordinateur : le panneau n'a plus lieu d'être.
  var wide = window.matchMedia("(min-width: 1080px)");
  var onWide = function () {
    if (wide.matches) setMenu(false);
  };
  if (wide.addEventListener) wide.addEventListener("change", onWide);
  else if (wide.addListener) wide.addListener(onWide);
})();

// Informations légales en fenêtre (comme Woudy) - WIYAO
// Les liens légaux du bas du pied de page ouvrent une fenêtre à onglets qui
// affiche le contenu des pages correspondantes, chargé depuis ces pages (le
// texte ne vit qu'à un seul endroit). Ctrl / clic milieu, ou sans JavaScript :
// la page s'ouvre normalement.
(function () {
  "use strict";

  var links = document.querySelectorAll(".footer-legal-links a");
  if (!links.length || !window.fetch || !window.DOMParser) return;

  var TABS = [
    { href: "mentions-legales.html", key: "legal.tab.mentions", fr: "Mentions légales", en: "Legal notice" },
    { href: "politique-confidentialite.html", key: "legal.tab.privacy", fr: "Confidentialité", en: "Privacy" },
    { href: "conditions-utilisation.html", key: "legal.tab.terms", fr: "Conditions d'utilisation", en: "Terms of use" },
    { href: "about.html", key: "legal.tab.about", fr: "À propos", en: "About" },
  ];
  var CLOSE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

  var cache = {};
  var modal = null;
  var dialog, panel, tabs = [];
  var current = -1;
  var lastFocus = null;

  function isEn() {
    return document.documentElement.lang === "en";
  }
  function t(fr, en) {
    return isEn() ? en : fr;
  }
  function moving() {
    return window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function build() {
    modal = document.createElement("div");
    modal.className = "legal-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="legal-dialog" role="dialog" aria-modal="true" aria-labelledby="legal-title">' +
      '<button type="button" class="legal-close" data-i18n-aria-label="legal.close" aria-label="' + t("Fermer", "Close") + '">' + CLOSE_SVG + "</button>" +
      '<h2 class="legal-title" id="legal-title" data-i18n-key="legal.title">' + t("Informations légales", "Legal information") + "</h2>" +
      '<div class="legal-tabs" role="tablist" aria-labelledby="legal-title"></div>' +
      '<div class="legal-panel" id="legal-panel" role="tabpanel" tabindex="0"></div>' +
      "</div>";
    document.body.appendChild(modal);
    dialog = modal.querySelector(".legal-dialog");
    panel = modal.querySelector(".legal-panel");
    var list = modal.querySelector(".legal-tabs");

    TABS.forEach(function (tab, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "legal-tab";
      b.id = "legal-tab-" + i;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", "legal-panel");
      b.setAttribute("data-i18n-key", tab.key);
      b.textContent = t(tab.fr, tab.en);
      b.addEventListener("click", function () { select(i); });
      list.appendChild(b);
      tabs.push(b);
    });

    // Flèches, Début, Fin : d'un onglet à l'autre (motif ARIA des onglets).
    list.addEventListener("keydown", function (e) {
      var next = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: TABS.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      next = (next + TABS.length) % TABS.length;
      select(next);
      tabs[next].focus();
    });

    modal.querySelector(".legal-close").addEventListener("click", close);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) close();
    });
    modal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      // La touche Tab reste dans la fenêtre.
      var f = Array.prototype.filter.call(
        dialog.querySelectorAll('a[href], button, [tabindex="0"]'),
        function (el) { return el.getClientRects().length > 0; }
      );
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Contenu d'une page : son introduction et ses sections, sans le titre
  // (l'onglet le donne) ; les titres h2 deviennent h3 sous le titre de la
  // fenêtre, et les id sont retirés (pas de doublon dans la page).
  function extract(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var main = doc.querySelector("main");
    var box = document.createElement("div");
    if (!main) return box;
    Array.prototype.forEach.call(main.querySelectorAll(":scope > .hero, :scope > .about-section"), function (part) {
      box.appendChild(document.importNode(part, true));
    });
    Array.prototype.forEach.call(box.querySelectorAll("script, h1"), function (el) { el.remove(); });
    Array.prototype.forEach.call(box.querySelectorAll("[id]"), function (el) { el.removeAttribute("id"); });
    Array.prototype.forEach.call(box.querySelectorAll("h2"), function (h2) {
      var h3 = document.createElement("h3");
      Array.prototype.forEach.call(h2.attributes, function (a) { h3.setAttribute(a.name, a.value); });
      while (h2.firstChild) h3.appendChild(h2.firstChild);
      h2.replaceWith(h3);
    });
    return box;
  }

  function render(i, content) {
    if (i !== current) return;
    panel.replaceChildren(content);
    if (window.wiyaoApplyLang) window.wiyaoApplyLang();
    dialog.scrollTop = 0;
    if (moving()) {
      window.gsap.fromTo(
        Array.prototype.slice.call(panel.querySelectorAll(".hero > *, .about-section"), 0, 8),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.04, clearProps: "opacity,transform" }
      );
    }
  }

  function select(i) {
    current = i;
    tabs.forEach(function (b, k) {
      b.setAttribute("aria-selected", String(k === i));
      b.tabIndex = k === i ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", "legal-tab-" + i);
    if (cache[i]) {
      render(i, cache[i].cloneNode(true));
      return;
    }
    var loading = document.createElement("p");
    loading.className = "legal-status";
    loading.textContent = t("Chargement…", "Loading…");
    panel.replaceChildren(loading);
    fetch(TABS[i].href, { credentials: "same-origin" })
      .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
      .then(function (html) {
        cache[i] = extract(html);
        render(i, cache[i].cloneNode(true));
      })
      .catch(function () {
        if (i !== current) return;
        var p = document.createElement("p");
        p.className = "legal-status";
        p.textContent = t("Ce contenu n'a pas pu être chargé. ", "This content could not be loaded. ");
        var a = document.createElement("a");
        a.href = TABS[i].href;
        a.textContent = t("Ouvrir la page", "Open the page");
        p.appendChild(a);
        panel.replaceChildren(p);
      });
  }

  function open(i, trigger) {
    if (!modal) build();
    lastFocus = trigger || document.activeElement;
    modal.hidden = false;
    document.documentElement.classList.add("legal-open");
    select(i);
    tabs[i].focus();
    if (moving()) {
      window.gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power1.out", clearProps: "opacity" });
      window.gsap.fromTo(dialog, { opacity: 0, y: 28, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out", clearProps: "opacity,transform" });
    }
  }

  function close() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.documentElement.classList.remove("legal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  Array.prototype.forEach.call(links, function (a) {
    a.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var href = a.getAttribute("href");
      var i = TABS.findIndex(function (tab) { return tab.href === href; });
      if (i < 0) return;
      e.preventDefault();
      open(i, a);
    });
  });
})();

// Test d'orientation sur téléphone : la bulle de l'assistant s'efface
// pendant qu'on répond (elle cachait la question) - WIYAO
(function () {
  "use strict";

  var quiz = document.getElementById("quiz-section");
  if (!quiz || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(function (entries) {
    document.body.classList.toggle("quiz-in-view", entries[0].isIntersecting);
  }, { threshold: 0.15 }).observe(quiz);
})();

// Bandeaux défilants (façon MoonShot) - WIYAO
// La liste est recopiée jusqu'à couvrir l'écran le plus large, puis doublée :
// la piste glisse de la moitié de sa largeur, en boucle sans à-coup. Vitesse
// constante quelle que soit la langue. Le bouton pause garde le bandeau
// immobile (clavier, tactile) ; le CSS l'arrête aussi au survol et avec le
// réglage « réduire les animations ». window.wiyaoMarquee sert aux bandeaux
// construits après coup (celui d'une roadmap, par app.js).
(function () {
  "use strict";

  // Le bandeau occupe toute la largeur de la fenêtre, barre de défilement exclue.
  var measuring = false;
  function measureScrollbar() {
    var width = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--scrollbar", Math.max(0, width) + "px");
  }

  function initMarquee(marquee) {
    if (marquee.hasAttribute("data-marquee-ready")) return;
    marquee.setAttribute("data-marquee-ready", "");
    if (!measuring) {
      measuring = true;
      measureScrollbar();
      window.addEventListener("resize", measureScrollbar);
      window.addEventListener("load", measureScrollbar);
    }

    var track = marquee.querySelector(".marquee-track");
    var list = track && track.querySelector(".marquee-list");
    if (!list) return;

    // Marge de 50 % : la liste est mesurée en français, la traduction
    // anglaise (appliquée ensuite) peut être plus courte.
    var target = 1.5 * Math.max(window.screen ? window.screen.width : 0, window.innerWidth, 1280);
    // Plancher de 200 px : une liste encore masquée (largeur nulle) ne doit
    // pas déclencher des milliers de copies.
    var width = Math.max(list.getBoundingClientRect().width, 200);
    for (var i = 1; i < Math.ceil(target / width); i++) track.appendChild(list.cloneNode(true));
    Array.prototype.slice.call(track.children).forEach(function (copy) {
      track.appendChild(copy.cloneNode(true));
    });

    function setSpeed() {
      // 30 px par seconde (45 au départ, ralenti à la demande de l'utilisateur).
      track.style.animationDuration = Math.max(20, track.scrollWidth / 2 / 30) + "s";
    }
    setSpeed();
    window.addEventListener("load", setSpeed);

    var pause = marquee.querySelector(".marquee-pause");
    if (pause) {
      pause.addEventListener("click", function () {
        var paused = pause.getAttribute("aria-pressed") !== "true";
        pause.setAttribute("aria-pressed", String(paused));
        marquee.classList.toggle("is-paused", paused);
      });
    }
    // Bandeau construit après coup (roadmap) : revoir les boutons flottants.
    if (window.wiyaoFloatCheck) window.wiyaoFloatCheck();
  }

  window.wiyaoMarquee = initMarquee;
  Array.prototype.forEach.call(document.querySelectorAll("[data-marquee]"), initMarquee);
})();

// Bouton flottant du test d'orientation (façon « Get Tickets » de MoonShot) - WIYAO
// Remplace le bouton de l'en-tête : en bas à gauche de l'écran sur toutes les
// pages, sauf le test lui-même et une roadmap (le test est dans le menu).
(function () {
  "use strict";

  var page = location.pathname.split("/").pop() || "index.html";
  if (page === "test-orientation.html" || document.body.classList.contains("page-roadmap")) return;

  var link = document.createElement("a");
  link.className = "cta-float";
  link.href = "test-orientation.html";
  // i18n.js est chargé avant ce script : le bouton naît dans la langue
  // affichée, sans passer par le français (2026-11-10).
  var label = (window.wiyaoText && window.wiyaoText("header.cta", document.documentElement.lang === "en" ? "en" : "fr")) ||
    "Faire le test d'orientation";
  link.innerHTML =
    '<span class="cta-float-label" data-i18n-key="header.cta">' + label + "</span>" +
    '<span class="cta-float-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></span>';
  document.body.appendChild(link);
})();

// Bouton retour en haut - WIYAO
// Chaque page s'ouvre sur une introduction plein écran : remonter tout en
// haut obligeait à refaire défiler un écran entier pour retrouver le contenu.
// Le bouton remonte donc au sommaire de la page s'il y en a un, sinon au
// début du contenu, juste sous l'introduction et le bandeau défilant
// (2026-11-10). L'en-tête, collé en haut, reste accessible.
(function () {
  "use strict";

  var main = document.querySelector("main");
  var marquee = main && main.querySelector(".marquee");
  var target = (main && main.querySelector(":scope > .eco-jump-nav")) || (marquee && marquee.nextElementSibling);
  var key = target && target.matches(".eco-jump-nav") ? "backtotop.sommaire" : target ? "backtotop.contenu" : "backtotop";
  var lang = document.documentElement.lang === "en" ? "en" : "fr";
  var fallback = { "backtotop.sommaire": "Remonter au sommaire", "backtotop.contenu": "Remonter au début du contenu", backtotop: "Retour en haut de page" };

  var button = document.createElement("button");
  button.className = "back-to-top";
  button.type = "button";
  button.setAttribute("aria-label", (window.wiyaoText && window.wiyaoText(key, lang)) || fallback[key]);
  button.setAttribute("data-i18n-aria-label", key);
  button.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
  document.body.appendChild(button);

  function toggleVisibility() {
    button.classList.toggle("is-visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();

  button.addEventListener("click", function () {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!target) {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      return;
    }
    // La marge de défilement globale (scroll-padding-top) garde la cible
    // sous l'en-tête collé ; le focus suit, pour le clavier et les
    // lecteurs d'écran.
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
})();

// Boutons flottants qui cèdent la place au bouton pause - WIYAO
// Sur téléphone, le bandeau défilant est en bas du premier écran et son
// bouton pause tombait pile sous la bulle de l'assistant : un appui ouvrait
// l'assistant au lieu d'arrêter le bandeau (2026-11-08). La bulle et le
// bouton « haut de page » s'effacent (classe is-yielding) tant qu'ils
// recouvrent un bouton pause visible, et reviennent dès que le bandeau s'est
// éloigné. Ils ne bougent pas : rien ne se décale sous le doigt.
(function () {
  "use strict";

  var pending = false;

  function overlaps(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  function update() {
    pending = false;
    var pauses = [];
    Array.prototype.forEach.call(document.querySelectorAll(".marquee-pause"), function (pause) {
      // Bouton masqué (« réduire les animations », impression) : ignoré.
      if (pause.getClientRects().length) pauses.push(pause.getBoundingClientRect());
    });
    Array.prototype.forEach.call(document.querySelectorAll(".wiyao-assistant-toggle, .back-to-top"), function (el) {
      // Assistant ouvert : sa bulle sert à le refermer, elle reste.
      var open = el.getAttribute("aria-expanded") === "true";
      var box = el.getBoundingClientRect();
      var covers = !open && pauses.some(function (rect) { return overlaps(box, rect); });
      el.classList.toggle("is-yielding", covers);
    });
  }

  function schedule() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(update);
    // Secours si l'affichage est suspendu (requestAnimationFrame en pause) :
    // update est sans effet de bord, le lancer deux fois ne gêne pas.
    window.setTimeout(function () {
      if (pending) update();
    }, 120);
  }

  window.wiyaoFloatCheck = schedule;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  document.addEventListener("click", schedule, true);
  document.addEventListener("DOMContentLoaded", schedule);
  window.addEventListener("load", function () {
    schedule();
    // Après l'arrivée animée de l'introduction et du bandeau (anim.js).
    window.setTimeout(schedule, 1500);
  });
  document.addEventListener("wiyao:langchange", schedule);
})();

// ---- Liens de partage WhatsApp écrits dans le HTML (plan marketing,
// 2026-11-10 ; page Témoignages). Le message suit la langue affichée :
// data-share-text est une clé de i18n.js, data-share-url l'adresse partagée.
// Sans JavaScript, le message français écrit dans href reste valable. Rien
// n'est collecté : c'est un simple lien wa.me.
(function () {
  function refresh(link) {
    if (!window.wiyaoText) return;
    const lang = document.documentElement.lang === "en" ? "en" : "fr";
    const text = window.wiyaoText(link.dataset.shareText, lang);
    if (text) link.href = "https://wa.me/?text=" + encodeURIComponent(text + "\n" + link.dataset.shareUrl);
  }
  function refreshAll() {
    document.querySelectorAll("a[data-share-text][data-share-url]").forEach(refresh);
  }
  document.addEventListener("click", function (e) {
    const link = e.target.closest && e.target.closest("a[data-share-text][data-share-url]");
    if (link) refresh(link);
  });
  window.addEventListener("load", refreshAll);
  document.addEventListener("wiyao:langchange", refreshAll);
})();
