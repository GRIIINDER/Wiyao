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
    if (window.innerWidth > 1180) setOpen(false);
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
