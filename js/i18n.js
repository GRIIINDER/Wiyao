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
  const PAGE_CONTENT = {
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

    "ecoles.hero.title": {
      fr: 'Trouve l\'<span class="hero-accent">école</span> qu\'il te faut',
      en: 'Find the <span class="hero-accent">school</span> that\'s right for you',
    },
    "ecoles.hero.subtitle": {
      fr: "32 écoles et universités togolaises qui forment à l'informatique et au numérique, avec leurs filières, niveaux et conditions d'admission.",
      en: "32 Togolese schools and universities teaching computing and digital skills, with their programs, levels and admission requirements.",
    },

    "calendrier.hero.title": {
      fr: 'Ne rate pas ta <span class="hero-accent">date limite</span>',
      en: 'Don\'t miss your <span class="hero-accent">deadline</span>',
    },
    "calendrier.hero.subtitle": {
      fr: "Le calendrier type d'une candidature au Togo, puis les dates connues école par école.\n       Rater une inscription fait souvent perdre une année entière — vérifie toujours en direct\n       auprès de l'établissement avant de t'engager.",
      en: "The typical application calendar in Togo, followed by known dates school by school. Missing a registration often means losing an entire year — always check directly with the school before committing.",
    },
    "calendrier.section1.title": { fr: "Le calendrier type", en: "The typical calendar" },
    "calendrier.section1.desc": {
      fr: "Un repère général — chaque établissement a son propre calendrier, parfois différent.",
      en: "A general guide — each school has its own calendar, sometimes different.",
    },
    "calendrier.section2.title": { fr: "Dates par école", en: "Dates by school" },
    "calendrier.section2.desc": {
      fr: "Écoles à campagne fixe d'abord, puis celles en admission continue, puis celles sans date publiée.",
      en: "Fixed-intake schools first, then rolling admissions, then schools with no published date.",
    },

    "bourses.hero.title": {
      fr: 'Comment <span class="hero-accent">financer</span> tes études ?',
      en: 'How to <span class="hero-accent">fund</span> your studies?',
    },
    "bourses.hero.subtitle": {
      fr: "Les frais de scolarité ne doivent pas être ce qui t'arrête. Voici les bourses, réductions et solutions\n       de financement réelles et vérifiées accessibles à un·e bachelier·ère togolais·e — écoles comprises.",
      en: "Tuition fees shouldn't be what stops you. Here are the real, verified scholarships, discounts and funding options available to a Togolese high-school graduate — schools included.",
    },

    "stages.hero.title": {
      fr: 'Et après la <span class="hero-accent">formation</span> ?',
      en: 'What comes after <span class="hero-accent">training</span>?',
    },
    "stages.hero.subtitle": {
      fr: "Où chercher un stage ou un premier emploi tech au Togo, et comment mettre toutes les chances de ton côté.\n       Ceci est un annuaire de ressources durables, pas un fil d'offres — les offres du moment changent trop vite\n       pour être fiables ici, direction les plateformes ci-dessous pour ça.",
      en: "Where to look for an internship or a first tech job in Togo, and how to give yourself the best chance. This is a directory of lasting resources, not a listings feed — current openings change too fast to be reliable here, head to the platforms below for that.",
    },

    "quiz.hero.title": {
      fr: 'Pas sûr·e de ta <span class="hero-accent">voie</span> ?',
      en: 'Not sure about your <span class="hero-accent">path</span>?',
    },
    "quiz.hero.subtitle": {
      fr: "12 questions pour identifier le domaine tech qui te correspond, puis les écoles togolaises\n       adaptées à ton niveau, ta ville et ton budget — pas juste un métier, un vrai point de départ.",
      en: "12 questions to identify the tech field that suits you, then the Togolese schools matched to your level, city and budget — not just a job title, a real starting point.",
    },

    "eco.hero.title": {
      fr: 'Écosystème tech <span class="hero-accent">togolais</span>',
      en: 'Togolese tech <span class="hero-accent">ecosystem</span>',
    },
    "eco.hero.subtitle": {
      fr: "Écoles, communautés, hubs d'innovation et institutions à connaître pour construire une carrière tech au Togo.",
      en: "Schools, communities, innovation hubs and institutions to know to build a tech career in Togo.",
    },
    "eco.hero.guide": {
      fr: 'Étudiant·e à la recherche d\'une école ? Direction la page « <a href="ecoles.html">Écoles &amp; universités</a> ». Développeur·se en quête d\'un réseau ? Rejoins les « Communautés et événements ». Porteur·se de projet en recherche d\'accompagnement ? Regarde du côté des « Hubs et incubateurs ».',
      en: 'Student looking for a school? Head to the "<a href="ecoles.html">Schools &amp; universities</a>" page. Developer looking for a network? Join the "Communities and events". Founder looking for support? Check out the "Hubs and incubators".',
    },

    "actu.hero.title": {
      fr: 'Ce qui se passe dans la <span class="hero-accent">tech togolaise</span>',
      en: 'What\'s happening in <span class="hero-accent">Togolese tech</span>',
    },
    "actu.hero.subtitle": {
      fr: "Événements, lancements, startups, financements — les faits marquants récents de l'écosystème, sourcés\n       et datés. Pas un flux automatique : chaque entrée est vérifiée à la main, avec sa source.",
      en: "Events, launches, startups, funding — recent highlights from the ecosystem, sourced and dated. Not an automated feed: every entry is hand-verified, with its source.",
    },
    "actu.hero.guide": { fr: "Dernière mise à jour : 16 août 2026.", en: "Last updated: August 16, 2026." },

    "temoignages.hero.title": {
      fr: 'Convaincs tes <span class="hero-accent">parents</span>',
      en: 'Convince your <span class="hero-accent">parents</span>',
    },
    "temoignages.hero.subtitle": {
      fr: "Les chiffres du numérique togolais, et des togolais qui l'ont fait avant toi — de quoi répondre à\n       « et si tu faisais plutôt... ».",
      en: 'The numbers behind Togolese digital tech, and Togolese people who\'ve done it before you — enough to answer "what if you did X instead...".',
    },

    "faq.hero.title": {
      fr: 'Questions <span class="hero-accent">fréquentes</span>',
      en: 'Frequently asked <span class="hero-accent">questions</span>',
    },
    "faq.hero.subtitle": {
      fr: "Tout ce qu'on te demande le plus souvent sur WIYAO, en un seul endroit.",
      en: "Everything you ask us most often about WIYAO, in one place.",
    },

    "contact.hero.title": {
      fr: 'Contacte-<span class="hero-accent">nous</span>',
      en: 'Contact <span class="hero-accent">us</span>',
    },
    "contact.hero.subtitle": {
      fr: "Une question, une correction à proposer, une école ou un événement à ajouter ? Écris-nous.",
      en: "A question, a correction to suggest, a school or event to add? Write to us.",
    },

    "recherche.hero.title": {
      fr: 'Cherche <span class="hero-accent">n\'importe quoi</span> sur WIYAO',
      en: 'Search for <span class="hero-accent">anything</span> on WIYAO',
    },
    "recherche.hero.subtitle": {
      fr: "Une seule recherche pour tout le site : roadmaps, écoles, écosystème togolais, bourses, stages &amp; emploi\n       et actualités.",
      en: "One search for the entire site: roadmaps, schools, the Togolese ecosystem, scholarships, internships &amp; jobs, and news.",
    },

    "about.hero.title": {
      fr: 'À propos &amp; <span class="hero-accent">méthodologie</span>',
      en: 'About &amp; <span class="hero-accent">methodology</span>',
    },
    "about.hero.subtitle": {
      fr: "Comment le contenu de WIYAO est construit, vérifié et tenu à jour.",
      en: "How WIYAO's content is built, verified and kept up to date.",
    },

    "mentions.hero.title": {
      fr: 'Mentions <span class="hero-accent">légales</span>',
      en: 'Legal <span class="hero-accent">notice</span>',
    },
    "mentions.hero.subtitle": {
      fr: "Qui édite WIYAO, où le site est hébergé, et dans quelles conditions son contenu peut être réutilisé.",
      en: "Who publishes WIYAO, where the site is hosted, and under what conditions its content may be reused.",
    },

    "confidentialite.hero.title": {
      fr: 'Politique de <span class="hero-accent">confidentialité</span>',
      en: 'Privacy <span class="hero-accent">policy</span>',
    },
    "confidentialite.hero.subtitle": {
      fr: "Ce que WIYAO fait, et surtout ne fait pas, avec ce que tu utilises sur le site.",
      en: "What WIYAO does — and importantly, doesn't do — with what you use on the site.",
    },

    "cgu.hero.title": {
      fr: 'Conditions <span class="hero-accent">d\'utilisation</span>',
      en: 'Terms of <span class="hero-accent">use</span>',
    },
    "cgu.hero.subtitle": {
      fr: "Les règles d'utilisation de WIYAO — à lire avant de naviguer sur le site.",
      en: "WIYAO's usage rules — read before browsing the site.",
    },
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
      const entry = PAGE_CONTENT[el.dataset.i18nKey];
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
