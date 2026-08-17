(function () {
  "use strict";

  const STORAGE_KEY = "wiyao-lang";

  // Traductions des liens de nav/footer, indexées par href — partagées par
  // toutes les pages sans avoir à taguer chaque lien individuellement.
  const BY_HREF = {
    "recherche.html": { fr: "Recherche", en: "Search" },
    "test-orientation.html": { fr: "Test d'orientation", en: "Orientation test" },
    "index.html": { fr: "Roadmaps", en: "Roadmaps" },
    "ecoles.html": { fr: "Écoles & universités", en: "Schools & universities" },
    "calendrier.html": { fr: "Calendrier", en: "Calendar" },
    "stages-emploi.html": { fr: "Stages & emploi", en: "Internships & jobs" },
    "ecosysteme.html": { fr: "Écosystème togolais", en: "Togolese tech ecosystem" },
    "bourses-financement.html": { fr: "Bourses & financement", en: "Scholarships & funding" },
    "actualites.html": { fr: "Actualités", en: "News" },
    "temoignages.html": { fr: "Témoignages", en: "Testimonials" },
    "faq.html": { fr: "FAQ", en: "FAQ" },
    "contact.html": { fr: "Contact", en: "Contact" },
    "about.html": { fr: "À propos & méthodologie", en: "About & methodology" },
    "mentions-legales.html": { fr: "Mentions légales", en: "Legal notice" },
    "politique-confidentialite.html": { fr: "Politique de confidentialité", en: "Privacy policy" },
    "conditions-utilisation.html": { fr: "Conditions d'utilisation", en: "Terms of use" },
  };

  // Éléments de nav/footer sans href, repérés par sélecteur CSS stable
  // (structure identique sur toutes les pages).
  const BY_SELECTOR = [
    { selector: ".nav-more-toggle", fr: "Plus ▾", en: "More ▾" },
    { selector: ".nav-search-text", fr: "Recherche", en: "Search" },
    { selector: ".footer-links-grid > .footer-links-col:nth-child(1) h5", fr: "Parcours", en: "Journey" },
    { selector: ".footer-links-grid > .footer-links-col:nth-child(2) h5", fr: "Plus", en: "More" },
    { selector: ".footer-links-grid > .footer-links-col:nth-child(3) h5", fr: "Projet", en: "Project" },
    { selector: ".footer-social-col h5", fr: "Suivez-nous", en: "Follow us" },
    { selector: ".footer-bottom p:first-child", fr: "© 2026 WIYAO. Tous droits réservés.", en: "© 2026 WIYAO. All rights reserved." },
    { selector: ".footer-slogan", fr: "Trace ton parcours tech au Togo.", en: "Chart your tech path in Togo." },
  ];

  // Contenu propre à index.html (hero + parcours en 6 étapes), repéré par
  // data-i18n-key posé directement dans le HTML de cette page.
  const INDEX_CONTENT = {
    "hero.title": {
      fr: 'Trace ton <span class="hero-accent">parcours tech</span> au Togo',
      en: 'Chart your <span class="hero-accent">tech path</span> in Togo',
    },
    "hero.subtitle": {
      fr: "Des roadmaps communautaires pour tous les métiers de la tech, avec les écoles, communautés et ressources disponibles à Lomé et au Togo.",
      en: "Community-built roadmaps for every tech role, alongside the schools, communities and resources available in Lomé and across Togo.",
    },
    "hero.cta": {
      fr: "Pas sûr·e de ta voie ? Fais le test d'orientation →",
      en: "Not sure which path? Take the orientation test →",
    },
    "hero.guide": {
      fr: 'Nouveau·elle ici ? Découvre <a href="about.html">ce qu\'est WIYAO</a> en 30 secondes.',
      en: 'New here? See <a href="about.html">what WIYAO is</a> in 30 seconds.',
    },
    "journey.title": { fr: "Le parcours WIYAO, dans l'ordre", en: "The WIYAO journey, in order" },
    "journey.desc": {
      fr: "Pas besoin de tout faire d'un coup — voici dans quel ordre avancer, étape par étape.",
      en: "No need to do everything at once — here's the order to move through, step by step.",
    },
    "journey.1.title": { fr: "Découvre ton domaine", en: "Discover your field" },
    "journey.1.desc": {
      fr: "Pas sûr·e de ta voie ? Le test d'orientation identifie en 12 questions le domaine tech qui te correspond.",
      en: "Not sure which path? The orientation test identifies the tech field that suits you in 12 questions.",
    },
    "journey.1.link": { fr: "Faire le test d'orientation →", en: "Take the orientation test →" },
    "journey.2.title": { fr: "Suis ta roadmap", en: "Follow your roadmap" },
    "journey.2.desc": {
      fr: "Une fois le métier ou la compétence choisie, la roadmap te montre précisément quoi apprendre, dans quel ordre.",
      en: "Once you've picked a role or skill, the roadmap shows you exactly what to learn, and in what order.",
    },
    "journey.2.link": { fr: "Voir les roadmaps →", en: "See the roadmaps →" },
    "journey.3.title": { fr: "Choisis ton école", en: "Choose your school" },
    "journey.3.desc": {
      fr: 'Compare 31 écoles et universités togolaises : filières, niveaux, admission, frais de scolarité — et les <a href="bourses-financement.html">bourses disponibles</a> pour les alléger.',
      en: 'Compare 31 Togolese schools and universities: programs, levels, admission, tuition fees — and the <a href="bourses-financement.html">scholarships available</a> to ease them.',
    },
    "journey.3.link": { fr: "Comparer les écoles →", en: "Compare schools →" },
    "journey.4.title": { fr: "Vise les bonnes dates", en: "Aim for the right dates" },
    "journey.4.desc": {
      fr: "Concours, inscriptions, rentrées : le calendrier te dit quand agir pour ne rien rater.",
      en: "Entrance exams, registration, start of term: the calendar tells you when to act so you don't miss anything.",
    },
    "journey.4.link": { fr: "Voir le calendrier →", en: "See the calendar →" },
    "journey.5.title": { fr: "Prépare ton stage ou ton premier emploi", en: "Prepare your internship or first job" },
    "journey.5.desc": {
      fr: "Plateformes togolaises, employeurs qui recrutent des profils tech, et un guide pratique pour te démarquer.",
      en: "Togolese platforms, employers hiring tech profiles, and a practical guide to stand out.",
    },
    "journey.5.link": { fr: "Voir stages &amp; emploi →", en: "See internships &amp; jobs →" },
    "journey.6.title": { fr: "Reste connecté·e à l'écosystème", en: "Stay connected to the ecosystem" },
    "journey.6.desc": {
      fr: "Communautés, hubs et événements togolais — utile à chaque étape, pas seulement à la fin du parcours.",
      en: "Togolese communities, hubs and events — useful at every step, not just at the end of the journey.",
    },
    "journey.6.link": { fr: "Découvrir l'écosystème togolais →", en: "Discover the Togolese ecosystem →" },
  };

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "fr";
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;

    document
      .querySelectorAll(".site-nav a[href], .footer-links-col:not(.footer-social-col) a[href]")
      .forEach((el) => {
        if (el.classList.contains("nav-search-link")) return;
        const entry = BY_HREF[el.getAttribute("href")];
        if (entry) el.textContent = lang === "en" ? entry.en : entry.fr;
      });

    document.querySelectorAll(".nav-search-link").forEach((el) => {
      el.setAttribute("aria-label", lang === "en" ? "Search" : "Recherche");
    });

    BY_SELECTOR.forEach(({ selector, fr, en }) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.textContent = lang === "en" ? en : fr;
      });
    });

    document.querySelectorAll("[data-i18n-key]").forEach((el) => {
      const entry = INDEX_CONTENT[el.dataset.i18nKey];
      if (entry) el.innerHTML = lang === "en" ? entry.en : entry.fr;
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    const notice = document.getElementById("i18n-notice");
    if (notice) notice.hidden = lang !== "en";
  }

  function initLangSwitch() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLangSwitch();
    applyLang(getLang());
  });
})();
