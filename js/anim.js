// Animations de WIYAO (GSAP, js/vendor/gsap.min.js) - WIYAO
// Partout sur le site, jamais en boucle :
// - au chargement : l'en-tête puis l'introduction de la page arrivent en cascade ;
// - au défilement : titres, cartes, listes, frises, colonnes du pied de page
//   entrent à l'écran (chacun à sa façon), les barres de progression se
//   remplissent, les numéros du parcours apparaissent ;
// - la signature WIYAO du pied de page se dévoile au rythme du défilement ;
// - aux interactions : menus déroulants, panneau du menu « hamburger »,
//   accordéons (FAQ, fiches écoles), filtres, « Voir les N autres », questions
//   et résultats du test, résultats de recherche, cases cochées d'une roadmap,
//   changement de langue.
// Avec le réglage « réduire les animations », ou si GSAP ne se charge pas, tout
// reste affiché normalement : le contenu n'est masqué qu'au moment où
// l'animation est prête à le faire réapparaître.
(function () {
  "use strict";

  if (!window.gsap || !("IntersectionObserver" in window)) return;
  var gsap = window.gsap;
  var EASE = "power3.out";
  var CLEAR = "opacity,transform,transition";

  // Éléments révélés au défilement. Le test d'orientation et la recherche
  // (contenus reconstruits à chaque réponse ou saisie) ont leur propre
  // animation plus bas.
  var UNITS = [
    "main .journey-step",
    "main .card",
    "main .eco-item",
    "main .timeline-item",
    "main .dates-row",
    "main .domain-primer-item",
    "main .faq-item",
    "main .faq-ask",
    "main .about-section",
    "main #roadmap-detail .section",
    "main .contact-card",
    "main .filter-group",
    "main .eco-jump-nav",
    "main .domain-group-title",
    "main .domain-group-desc",
    "main .domain-group-toggle",
    "main .roadmap-category > h2",
    "main .roadmap-category > .category-desc",
    "main .eco-section > h2",
    "main .eco-section > p",
    "main .related-section > h2",
    ".footer-col",
    ".footer-copy",
    ".footer-legal-links li",
  ].join(", ");

  function each(list, fn) {
    Array.prototype.forEach.call(list, fn);
  }
  function filter(list, fn) {
    return Array.prototype.filter.call(list, fn);
  }
  function isShown(el) {
    return el.getClientRects().length > 0;
  }
  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }
  function outermost(list) {
    return list.filter(function (el) {
      return !list.some(function (other) {
        return other !== el && other.contains(el);
      });
    });
  }

  // Chaque famille d'éléments entre à sa façon.
  function fromVars(el) {
    if (el.matches("h2, .domain-group-title, .filter-group, .eco-jump-nav")) return { opacity: 0, x: -28 };
    if (el.matches(".timeline-item, .dates-row, .faq-item, .footer-legal-links li")) return { opacity: 0, x: -18 };
    if (el.matches(".card, .eco-item, .journey-step, .domain-primer-item, .contact-card, .faq-ask")) {
      return { opacity: 0, y: 40, scale: 0.96 };
    }
    return { opacity: 0, y: 26 };
  }

  function cascade(targets, from, extra) {
    if (!targets.length) return null;
    var vars = { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.5, ease: EASE, stagger: 0.05, clearProps: CLEAR, overwrite: "auto" };
    for (var k in extra) vars[k] = extra[k];
    return gsap.fromTo(targets, from, vars);
  }

  function init() {
    var mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", function () {
      var main = document.querySelector("main");
      if (!main) return;
      var footer = document.querySelector("footer.site-footer");
      var startedAt = Date.now();
      var observers = [];
      var cleanups = [];
      function listen(target, type, fn, opts) {
        target.addEventListener(type, fn, opts);
        cleanups.push(function () { target.removeEventListener(type, fn, opts); });
      }

      // 1. En-tête au chargement : logo, menus, langue, recherche, test.
      var head = filter(document.querySelectorAll(
        ".site-header-top > .brand, nav.site-nav > .nav-more, .header-actions .lang-switch, " +
        ".header-actions .nav-search-icon, .header-actions .header-cta, .header-actions .nav-burger"
      ), isShown);
      cascade(head, { opacity: 0, y: -16 }, { duration: 0.6, stagger: 0.05 });

      // 2. Introduction de la page (ce qui est à l'écran au chargement).
      var hero = main.querySelector(".hero");
      var introRoot = hero && isShown(hero) ? hero : Array.prototype.find.call(main.children, isShown);
      var intro = introRoot
        ? filter(introRoot.children, function (el) {
            return isShown(el) && el.getBoundingClientRect().top < window.innerHeight;
          }).slice(0, 6)
        : [];
      function inIntro(el) {
        return intro.some(function (i) { return i === el || i.contains(el); });
      }
      cascade(intro, { opacity: 0, y: 22 }, { duration: 0.8, stagger: 0.09, delay: 0.15 });

      // 3. Révélations au défilement.
      var units = outermost(filter(document.querySelectorAll(UNITS), function (el) {
        if (!isShown(el) || el.classList.contains("sr-only")) return false;
        if (el.closest("#quiz-section, #quiz-results, #global-search-results")) return false;
        return !inIntro(el);
      }));
      var pending = new Set(units);
      units.forEach(function (el) {
        var from = fromVars(el);
        from.transition = "none";
        gsap.set(el, from);
      });

      function reveal(batch, delay) {
        batch.forEach(function (el) { pending.delete(el); });
        gsap.to(batch, {
          opacity: 1, x: 0, y: 0, scale: 1,
          duration: 0.75,
          ease: EASE,
          delay: delay,
          stagger: { amount: Math.min(0.5, 0.08 * (batch.length - 1)) },
          clearProps: CLEAR,
          overwrite: "auto",
        });
        // Numéros du parcours de l'accueil : petit rebond après la carte.
        batch.forEach(function (el, i) {
          var num = el.querySelector(".journey-step-number");
          if (num) {
            gsap.from(num, { scale: 0.3, opacity: 0, duration: 0.6, ease: "back.out(2.2)", delay: delay + 0.2 + i * 0.08, clearProps: "opacity,transform" });
          }
        });
      }

      var io = new IntersectionObserver(function (entries) {
        var batch = entries
          .filter(function (e) { return e.isIntersecting; })
          .map(function (e) { return e.target; })
          .sort(function (a, b) {
            return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
          });
        if (!batch.length) return;
        batch.forEach(function (el) { io.unobserve(el); });
        // Ce qui est déjà à l'écran au chargement suit l'introduction.
        reveal(batch, Date.now() - startedAt < 400 ? 0.35 : 0);
      }, { rootMargin: "0px 0px -40px 0px" });
      units.forEach(function (el) { io.observe(el); });
      observers.push(io);

      // Filet de sécurité : pendant le défilement, tout ce qui est déjà à
      // l'écran (ou dépassé) s'affiche, même si l'observateur l'a manqué.
      var catchTimer = 0;
      function catchUp() {
        if (catchTimer || !pending.size) return;
        catchTimer = window.setTimeout(function () {
          catchTimer = 0;
          var vh = window.innerHeight;
          var batch = Array.from(pending).filter(function (el) {
            return isShown(el) && el.getBoundingClientRect().top < vh;
          });
          batch.forEach(function (el) { io.unobserve(el); });
          if (batch.length) reveal(batch, 0);
        }, 200);
      }
      listen(window, "scroll", catchUp, { passive: true });
      cleanups.push(function () { window.clearTimeout(catchTimer); });

      // Barres de progression : elles se remplissent en entrant à l'écran.
      var fillIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          fillIo.unobserve(e.target);
          gsap.from(e.target, { scaleX: 0, transformOrigin: "0% 50%", duration: 1.1, ease: EASE, delay: 0.2, clearProps: "transform" });
        });
      });
      each(main.querySelectorAll(".progress-fill"), function (f) {
        if (isShown(f)) fillIo.observe(f);
      });
      observers.push(fillIo);

      // 4. Interactions.
      var wide = window.matchMedia("(min-width: 1080px)");

      // Menus déroulants : les liens arrivent en cascade à l'ouverture.
      each(document.querySelectorAll(".nav-more"), function (group) {
        var wasOpen = false;
        var mo = new MutationObserver(function () {
          var open = group.classList.contains("is-open");
          if (open && !wasOpen && wide.matches) {
            cascade(group.querySelectorAll(".nav-more-menu a"), { opacity: 0, x: -12 }, { duration: 0.35, stagger: 0.04 });
          }
          wasOpen = open;
        });
        mo.observe(group, { attributes: true, attributeFilter: ["class"] });
        observers.push(mo);
      });

      // Panneau du menu « hamburger » : il glisse, puis les groupes arrivent.
      var header = document.querySelector("header.site-header");
      var nav = document.querySelector("nav.site-nav");
      if (header && nav) {
        var menuWasOpen = false;
        var headerMo = new MutationObserver(function () {
          var open = header.classList.contains("is-menu-open");
          if (open && !menuWasOpen && !wide.matches) {
            gsap.fromTo(nav, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.35, ease: EASE, clearProps: "opacity,transform" });
            cascade(nav.querySelectorAll(".nav-more"), { opacity: 0, y: 14 }, { duration: 0.4, stagger: 0.06, delay: 0.05 });
          }
          menuWasOpen = open;
        });
        headerMo.observe(header, { attributes: true, attributeFilter: ["class"] });
        observers.push(headerMo);
      }

      // Accordéons (FAQ, fiches écoles) : le contenu glisse à l'ouverture.
      listen(document, "toggle", function (event) {
        var d = event.target;
        if (!d || d.tagName !== "DETAILS" || !d.open || d.classList.contains("primer-fold")) return;
        cascade(filter(d.children, function (k) { return k.tagName !== "SUMMARY"; }), { opacity: 0, y: -10 }, { duration: 0.4 });
      }, true);

      // Clics : cases d'une roadmap, langue, filtres, « Voir les N autres ».
      listen(document, "click", function (event) {
        var t = event.target.closest && event.target.closest(".check, .lang-btn, .domain-chip, .domain-group-toggle");
        if (!t) return;
        if (t.matches(".check")) {
          gsap.fromTo(t, { scale: 0.6 }, { scale: 1, duration: 0.45, ease: "back.out(3)", clearProps: "transform" });
          return;
        }
        if (t.matches(".lang-btn")) {
          gsap.fromTo([main, footer].filter(Boolean), { opacity: 0.35 }, { opacity: 1, duration: 0.45, ease: "power1.out", clearProps: "opacity" });
          return;
        }
        var scope = t.closest(".domain-group, section") || main;
        var expanding = t.matches(".domain-group-toggle");
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            var cards = filter(scope.querySelectorAll(expanding ? ".card-extra" : ".card, .eco-item"), function (c) {
              return isShown(c) && inView(c) && !pending.has(c);
            }).slice(0, 24);
            cascade(cards, { opacity: 0, y: 18, scale: 0.97 }, { duration: 0.45, stagger: 0.03 });
          });
        });
      });

      // Contenus reconstruits : questions et résultats du test, recherche.
      function animateRebuilt(container, selector) {
        var raf = 0;
        function run() {
          raf = 0;
          var items = filter(container.querySelectorAll(selector), function (el) {
            return isShown(el) && inView(el);
          }).slice(0, 16);
          cascade(outermost(items), { opacity: 0, y: 16 }, { duration: 0.45, stagger: 0.05 });
          each(container.querySelectorAll(".progress-fill"), function (f) {
            if (isShown(f)) gsap.from(f, { scaleX: 0, transformOrigin: "0% 50%", duration: 1, ease: EASE, delay: 0.25, clearProps: "transform" });
          });
        }
        var mo = new MutationObserver(function () {
          if (!raf) raf = window.requestAnimationFrame(run);
        });
        mo.observe(container, { childList: true });
        observers.push(mo);
        return run;
      }
      var quizQuestion = document.getElementById("quiz-question");
      if (quizQuestion) animateRebuilt(quizQuestion, ".quiz-question-title, .quiz-option, .quiz-back")();
      var quizResults = document.getElementById("quiz-results");
      if (quizResults) animateRebuilt(quizResults, ":scope > *");
      var searchResults = document.getElementById("global-search-results");
      if (searchResults) animateRebuilt(searchResults, ".search-result")();

      // Impression (ex. roadmap en PDF) : tout s'affiche, même ce qui
      // n'est pas encore passé à l'écran.
      function showAll() {
        observers.forEach(function (o) { o.disconnect(); });
        var rest = Array.from(pending);
        pending.clear();
        gsap.set(rest, { clearProps: CLEAR });
      }
      listen(window, "beforeprint", showAll);

      return function () {
        observers.forEach(function (o) { o.disconnect(); });
        cleanups.forEach(function (fn) { fn(); });
      };
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
