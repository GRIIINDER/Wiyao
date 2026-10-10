// Animations sobres de WIYAO (GSAP, js/vendor/gsap.min.js) - WIYAO
// - l'introduction de la page apparaît en cascade au chargement ;
// - les cartes et sections montent légèrement quand elles entrent à l'écran ;
// - la signature WIYAO du pied de page se dévoile de bas en haut.
// Rien ne tourne en boucle. Avec le réglage « réduire les animations », ou si
// GSAP ne se charge pas, tout reste affiché normalement : le contenu n'est
// masqué qu'au moment où l'animation est prête à le faire réapparaître.
(function () {
  "use strict";

  if (!window.gsap || !("IntersectionObserver" in window)) return;
  var gsap = window.gsap;

  // Éléments révélés au défilement. Le test d'orientation (réponses qui se
  // reconstruisent à chaque question) et l'introduction (animée à part) sont
  // exclus.
  var UNITS = [
    ".journey-step",
    ".card",
    ".eco-item",
    ".timeline-item",
    ".domain-primer-item",
    ".faq-item",
    ".faq-ask",
    ".about-section",
    "#roadmap-detail .section",
    ".contact-card",
    ".roadmap-category > h2",
    ".roadmap-category > .category-desc",
    ".eco-section > h2",
    ".eco-section > p",
    ".related-section > h2",
  ].map(function (s) { return "main " + s; }).join(", ");

  var EASE = "power2.out";

  function isShown(el) {
    return el.getClientRects().length > 0;
  }

  function init() {
    var mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", function () {
      var main = document.querySelector("main");
      if (!main) return;
      var startedAt = Date.now();

      // 1. Introduction : les éléments de .hero (ou, à défaut, du premier
      //    bloc visible) déjà à l'écran au chargement, en cascade.
      var hero = main.querySelector(".hero");
      var introRoot = hero && isShown(hero) ? hero : Array.prototype.find.call(main.children, isShown);
      var intro = introRoot
        ? Array.prototype.filter.call(introRoot.children, function (el) {
            return isShown(el) && el.getBoundingClientRect().top < window.innerHeight;
          }).slice(0, 6)
        : [];
      function inIntro(el) {
        return intro.some(function (i) { return i === el || i.contains(el); });
      }
      if (intro.length) {
        gsap.from(intro, {
          opacity: 0,
          y: 16,
          duration: 0.7,
          ease: EASE,
          stagger: 0.08,
          clearProps: "opacity,transform",
        });
      }

      // 2. Cartes et sections au défilement, par petits lots en cascade.
      var units = Array.prototype.filter.call(main.querySelectorAll(UNITS), function (el) {
        if (!isShown(el) || el.closest("#quiz-section")) return false;
        return !inIntro(el);
      });
      // Pas d'animation imbriquée : on garde l'élément le plus extérieur.
      units = units.filter(function (el) {
        return !units.some(function (other) {
          return other !== el && other.contains(el);
        });
      });

      var pending = new Set(units);
      gsap.set(units, { opacity: 0, y: 24, transition: "none" });

      function reveal(batch, delay) {
        batch.forEach(function (el) { pending.delete(el); });
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: EASE,
          delay: delay,
          stagger: { amount: Math.min(0.45, 0.07 * (batch.length - 1)) },
          clearProps: "opacity,transform,transition",
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
        reveal(batch, Date.now() - startedAt < 400 ? 0.25 : 0);
      }, { rootMargin: "0px 0px -8% 0px" });
      units.forEach(function (el) { io.observe(el); });

      // 3. Signature du pied de page : dévoilement de bas en haut.
      var mark = document.querySelector(".footer-wordmark");
      var markIo = null;
      if (mark && isShown(mark)) {
        gsap.set(mark, { clipPath: "inset(100% 0% 0% 0%)" });
        markIo = new IntersectionObserver(function (entries) {
          if (!entries.some(function (e) { return e.isIntersecting; })) return;
          markIo.disconnect();
          gsap.to(mark, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power3.out",
            clearProps: "clipPath",
          });
        }, { rootMargin: "0px 0px -10% 0px" });
        markIo.observe(mark);
      }

      // Impression (ex. roadmap en PDF) : tout s'affiche, même ce qui
      // n'est pas encore passé à l'écran.
      function showAll() {
        io.disconnect();
        if (markIo) markIo.disconnect();
        var rest = Array.from(pending);
        pending.clear();
        gsap.set(rest, { clearProps: "opacity,transform,transition" });
        if (mark) gsap.set(mark, { clearProps: "clipPath" });
      }
      window.addEventListener("beforeprint", showAll);

      return function () {
        window.removeEventListener("beforeprint", showAll);
        io.disconnect();
        if (markIo) markIo.disconnect();
      };
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
