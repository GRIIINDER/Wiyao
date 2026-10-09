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
// Quatre groupes indépendants dans la barre, un seul ouvert à la fois, sur
// ordinateur comme sur mobile (pas de menu hamburger). S'ouvrent au survol
// de la souris ; le clic / Entrée reste disponible (clavier, écrans tactiles).
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
