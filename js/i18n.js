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

    "about.s1.h2": { fr: "Le projet", en: "The project" },
    "about.s1.p1": {
      fr: "WIYAO est un projet communautaire indépendant, sans statut commercial, édité et maintenu à titre personnel — inspiré de roadmap.sh et adapté au contexte togolais. Ce n'est pas une startup : pas de compte à créer, pas d'abonnement, pas de publicité, rien à vendre.",
      en: "WIYAO is an independent community project, with no commercial status, published and maintained on a personal basis — inspired by roadmap.sh and adapted to the Togolese context. It's not a startup: no account to create, no subscription, no ads, nothing to sell.",
    },
    "about.s1.p2": {
      fr: 'Il rassemble des roadmaps de carrière pour les métiers et compétences de la tech, avec les écoles, communautés, hubs et institutions à connaître pour construire une carrière tech au Togo. Le site est gratuit, utilisable sans inscription, et hébergé par Vercel — détails complets dans les <a href="mentions-legales.html">mentions légales</a> et la <a href="politique-confidentialite.html">politique de confidentialité</a>.',
      en: 'It brings together career roadmaps for tech roles and skills, along with the schools, communities, hubs and institutions worth knowing to build a tech career in Togo. The site is free, usable without registration, and hosted by Vercel — full details in the <a href="mentions-legales.html">legal notice</a> and the <a href="politique-confidentialite.html">privacy policy</a>.',
    },
    "about.s2.h2": { fr: "Roadmaps par métier", en: "Role-based roadmaps" },
    "about.s2.p": {
      fr: 'Les 60 roadmaps par métier s\'appuient sur une recherche des offres d\'emploi et fiches de poste réellement publiées sur des plateformes togolaises telles que <a href="https://emploi.tg" target="_blank" rel="noopener">emploi.tg</a>, <a href="https://novojob.com" target="_blank" rel="noopener">novojob.com</a>, JobRelais, l\'Agence Togo Digital et d\'autres sites d\'offres d\'emploi togolais, afin d\'identifier les compétences concrètement demandées par les employeurs locaux. Ce contenu est complété par des ressources d\'apprentissage reconnues (documentation officielle, cours en ligne francophones et internationaux).',
      en: 'The 60 role-based roadmaps are built from research into job postings and role descriptions actually published on Togolese platforms such as <a href="https://emploi.tg" target="_blank" rel="noopener">emploi.tg</a>, <a href="https://novojob.com" target="_blank" rel="noopener">novojob.com</a>, JobRelais, Agence Togo Digital and other Togolese job sites, to identify the skills local employers actually ask for. This content is complemented by well-established learning resources (official documentation, French and international online courses).',
    },
    "about.s3.h2": { fr: "Roadmaps par compétence", en: "Skill-based roadmaps" },
    "about.s3.p": {
      fr: "Les 29 roadmaps par compétence suivent une taxonomie standard de l'industrie (langages, frameworks, outils, pratiques), cohérente avec les référentiels internationaux du secteur (dont roadmap.sh), pour rester alignées avec les attentes du marché au-delà du seul contexte togolais.",
      en: "The 29 skill-based roadmaps follow a standard industry taxonomy (languages, frameworks, tools, practices), consistent with international references in the field (including roadmap.sh), to stay aligned with market expectations beyond the Togolese context alone.",
    },
    "about.s4.h2": { fr: "Limites et mises à jour", en: "Limitations and updates" },
    "about.s4.p1": {
      fr: 'Le marché de l\'emploi et l\'écosystème tech togolais évoluent vite : certaines informations (contacts, programmes de formation, structures citées dans l\'<a href="ecosysteme.html">écosystème togolais</a>) peuvent changer. Vérifie toujours directement auprès des établissements et organismes concernés avant de t\'engager.',
      en: 'The job market and the Togolese tech ecosystem evolve quickly: some information (contacts, training programs, organizations listed in the <a href="ecosysteme.html">Togolese ecosystem</a>) may change. Always check directly with the relevant institutions and organizations before committing.',
    },
    "about.s4.p2": {
      fr: "Contenu vérifié pour la dernière fois en juillet 2026 (60 métiers, 29 compétences).",
      en: "Content last verified in July 2026 (60 roles, 29 skills).",
    },
    "about.s5.h2": { fr: "Contribuer", en: "Contribute" },
    "about.s5.p": {
      fr: 'WIYAO est un projet ouvert et perfectible. Pour signaler une erreur, proposer une roadmap ou compléter l\'écosystème togolais, direction le <a href="https://github.com/GRIIINDER/Wiyao" target="_blank" rel="noopener">dépôt GitHub</a>.',
      en: 'WIYAO is an open, evolving project. To report an error, suggest a roadmap or add to the Togolese ecosystem, head to the <a href="https://github.com/GRIIINDER/Wiyao" target="_blank" rel="noopener">GitHub repository</a>.',
    },

    "mentions.s1.h2": { fr: "Éditeur du site", en: "Site publisher" },
    "mentions.s1.p1": {
      fr: "WIYAO est un projet communautaire indépendant, sans statut commercial, édité et maintenu à titre personnel. Il n'est affilié à aucune administration ni institution togolaise citée sur le site.",
      en: "WIYAO is an independent community project, with no commercial status, published and maintained on a personal basis. It is not affiliated with any Togolese administration or institution mentioned on the site.",
    },
    "mentions.s1.p2": {
      fr: 'Contact : <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a> — Lomé, Togo.',
      en: 'Contact: <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a> — Lomé, Togo.',
    },
    "mentions.s2.h2": { fr: "Hébergement", en: "Hosting" },
    "mentions.s2.p": {
      fr: 'Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — <a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a>.',
      en: 'The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, United States — <a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a>.',
    },
    "mentions.s3.h2": { fr: "Propriété intellectuelle", en: "Intellectual property" },
    "mentions.s3.p": {
      fr: 'Le code source du site est ouvert et consultable sur le <a href="https://github.com/GRIIINDER/Wiyao" target="_blank" rel="noopener">dépôt GitHub</a>. Les contenus (roadmaps, fiches écoles, guides) sont proposés à titre informatif et peuvent être réutilisés en citant la source.',
      en: 'The site\'s source code is open and available on the <a href="https://github.com/GRIIINDER/Wiyao" target="_blank" rel="noopener">GitHub repository</a>. The content (roadmaps, school profiles, guides) is provided for informational purposes and may be reused with attribution.',
    },
    "mentions.s4.h2": { fr: "Responsabilité", en: "Liability" },
    "mentions.s4.p": {
      fr: 'Les informations publiées (dates d\'admission, filières, coordonnées d\'écoles ou d\'employeurs) proviennent de sources publiques vérifiées au moment de la rédaction, mais peuvent évoluer. Vérifie toujours les informations sensibles directement auprès des établissements concernés avant de t\'engager — voir aussi la page <a href="about.html">À propos &amp; méthodologie</a>.',
      en: 'The information published (admission dates, programs, contact details for schools or employers) comes from public sources verified at the time of writing, but may change. Always check sensitive information directly with the relevant institutions before committing — see also the <a href="about.html">About &amp; methodology</a> page.',
    },

    "conf.s1.h2": { fr: "1. Généralités", en: "1. General" },
    "conf.s1.p1": {
      fr: "La présente politique de confidentialité tient compte de la loi n°2019-014 du 29 octobre 2019 relative à la protection des données à caractère personnel, applicable au Togo.",
      en: "This privacy policy takes into account law n°2019-014 of October 29, 2019 on the protection of personal data, applicable in Togo.",
    },
    "conf.s1.p2": {
      fr: 'WIYAO est un projet communautaire indépendant, édité et maintenu à titre personnel — voir les <a href="mentions-legales.html">mentions légales</a>. L\'accès et la navigation sur WIYAO sont volontaires et gratuits et confèrent automatiquement à la personne intéressée le statut de « Visiteur » (ci-après, « Visiteur », « vous »).',
      en: 'WIYAO is an independent community project, published and maintained on a personal basis — see the <a href="mentions-legales.html">legal notice</a>. Access to and browsing of WIYAO are voluntary and free, and automatically grant the person concerned the status of "Visitor" (hereinafter, "Visitor", "you").',
    },
    "conf.s1.p3": {
      fr: "Le site ne proposant ni compte, ni inscription, ni candidature en ligne, il n'existe pas de statut « Utilisateur » distinct : tout le monde navigue sur WIYAO en tant que Visiteur, y compris pour utiliser le test d'orientation ou suivre sa progression sur les roadmaps.",
      en: 'Since the site offers no account, no registration and no online application, there is no separate "User" status: everyone browses WIYAO as a Visitor, including to use the orientation test or track progress on roadmaps.',
    },
    "conf.s2.h2": { fr: "2. Collecte de données personnelles", en: "2. Personal data collection" },
    "conf.s2.p1": {
      fr: "Aucune information personnelle n'est collectée, automatiquement ou non, pour un Visiteur qui utilise WIYAO — que ce soit pour consulter les roadmaps, répondre au test d'orientation, comparer des écoles ou consulter le calendrier. Le site ne demande ni nom, ni email, ni aucune autre donnée pour fonctionner.",
      en: "No personal information is collected, automatically or otherwise, for a Visitor using WIYAO — whether to browse roadmaps, take the orientation test, compare schools or check the calendar. The site asks for no name, no email, and no other data to function.",
    },
    "conf.s2.p2": {
      fr: 'Seule exception : ta progression sur les roadmaps est enregistrée dans le stockage local (localStorage) de ton navigateur. Cette donnée reste uniquement sur ton appareil, n\'est jamais transmise à un serveur ni à WIYAO, et tu peux l\'effacer à tout moment via le bouton « Réinitialiser la progression » sur une roadmap, ou en vidant les données de ton navigateur.',
      en: 'The only exception: your progress on roadmaps is saved in your browser\'s local storage (localStorage). This data stays only on your device, is never sent to a server or to WIYAO, and you can erase it at any time via the "Reset progress" button on a roadmap, or by clearing your browser data.',
    },
    "conf.s2.p3": {
      fr: 'Si tu utilises la page <a href="contact.html">Contact</a>, les informations que tu choisis d\'y saisir (nom, email, message) ne sont pas envoyées à un serveur : le bouton « Envoyer » ouvre ton client email habituel avec le message pré-rempli, à toi de l\'envoyer depuis là.',
      en: 'If you use the <a href="contact.html">Contact</a> page, the information you choose to enter there (name, email, message) is not sent to a server: the "Send" button opens your usual email client with the message pre-filled, for you to send from there.',
    },
    "conf.s3.h2": { fr: "3. Droits de la personne dont les données font l'objet d'un traitement", en: "3. Rights of the person whose data is processed" },
    "conf.s3.p1": {
      fr: "La loi togolaise n°2019-014 garantit à toute personne dont les données sont traitées un droit à l'information, un droit d'accès, un droit d'opposition, un droit de rectification et de suppression, ainsi qu'un droit à l'effacement lorsque les données ont été rendues publiques.",
      en: "Togolese law n°2019-014 guarantees anyone whose data is processed a right to information, a right of access, a right to object, a right of rectification and deletion, as well as a right to erasure when the data has been made public.",
    },
    "conf.s3.p2": {
      fr: "WIYAO ne traitant aucune donnée personnelle côté serveur (voir section 2), ces droits n'ont aujourd'hui rien à s'appliquer en pratique. La seule donnée qui existe — ta progression sur les roadmaps — reste sur ton appareil et sous ton contrôle exclusif : tu peux la consulter, la modifier ou la supprimer toi-même directement dans le navigateur, sans avoir à nous solliciter.",
      en: "Since WIYAO processes no personal data server-side (see section 2), these rights currently have nothing to apply to in practice. The only data that exists — your progress on roadmaps — stays on your device under your exclusive control: you can view, edit or delete it yourself directly in the browser, without needing to contact us.",
    },
    "conf.s3.p3": {
      fr: 'Pour toute question sur ces droits, contacte-nous via la page <a href="contact.html">Contact</a> ou par email à <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a>.',
      en: 'For any question about these rights, contact us via the <a href="contact.html">Contact</a> page or by email at <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a>.',
    },
    "conf.s4.h2": { fr: "4. Sécurité", en: "4. Security" },
    "conf.s4.p": {
      fr: "WIYAO ne stockant aucune donnée personnelle sur un serveur, il n'y a pas de base de données à protéger contre une fuite ou un accès non autorisé. La connexion au site est chiffrée (HTTPS), via l'hébergeur Vercel.",
      en: "Since WIYAO stores no personal data on a server, there is no database to protect against a leak or unauthorized access. The connection to the site is encrypted (HTTPS), via the host Vercel.",
    },
    "conf.s5.h2": { fr: "5. Pas de suivi ni de publicité", en: "5. No tracking or advertising" },
    "conf.s5.p": {
      fr: "Le site n'utilise aucun outil d'analyse tierce (Google Analytics ou équivalent), aucun cookie de suivi, et n'affiche aucune publicité.",
      en: "The site uses no third-party analytics tool (Google Analytics or equivalent), no tracking cookie, and displays no advertising.",
    },
    "conf.s6.h2": { fr: "6. Liens externes", en: "6. External links" },
    "conf.s6.p": {
      fr: "WIYAO renvoie vers des sites tiers (écoles, plateformes d'emploi, dépôt GitHub, réseaux communautaires...). Ces sites ont leurs propres règles de confidentialité, indépendantes de celles de WIYAO.",
      en: "WIYAO links to third-party sites (schools, job platforms, GitHub repository, community networks...). These sites have their own privacy rules, independent of WIYAO's.",
    },
    "conf.s7.h2": { fr: "7. Contact", en: "7. Contact" },
    "conf.s7.p": {
      fr: 'Pour toute question sur cette politique, écris-nous via la page <a href="contact.html">Contact</a> ou par email à <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a>.',
      en: 'For any question about this policy, write to us via the <a href="contact.html">Contact</a> page or by email at <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a>.',
    },

    "cgu.s1.h2": { fr: "1. Généralités", en: "1. General" },
    "cgu.s1.p1": {
      fr: 'WIYAO est un projet communautaire indépendant, édité et maintenu à titre personnel — voir les <a href="mentions-legales.html">mentions légales</a> pour le détail sur l\'éditeur du site.',
      en: 'WIYAO is an independent community project, published and maintained on a personal basis — see the <a href="mentions-legales.html">legal notice</a> for details on the site publisher.',
    },
    "cgu.s1.p2": {
      fr: "L'accès et la navigation sur WIYAO sont volontaires, libres et gratuits, et confèrent automatiquement à la personne intéressée le statut d'« Utilisateur » (ci-après, « Utilisateur », « vous »).",
      en: 'Access to and browsing of WIYAO are voluntary, free and unrestricted, and automatically grant the person concerned the status of "User" (hereinafter, "User", "you").',
    },
    "cgu.s1.p3": {
      fr: "Le statut d'Utilisateur implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation (CGU). Nous te recommandons de les lire attentivement avant d'utiliser le site. Si tu n'acceptes pas d'être lié par ces CGU, tu ne dois pas utiliser WIYAO.",
      en: "User status implies full and complete acceptance of these Terms of Use. We recommend you read them carefully before using the site. If you do not accept to be bound by these Terms of Use, you must not use WIYAO.",
    },
    "cgu.s1.p4": {
      fr: "Les présentes CGU peuvent être mises à jour à tout moment, notamment pour suivre l'évolution des fonctionnalités du site. Les nouvelles CGU sont applicables dès leur publication sur cette page ; il est de la responsabilité de l'Utilisateur de les consulter périodiquement.",
      en: "These Terms of Use may be updated at any time, in particular to keep up with the evolution of the site's features. The new Terms of Use apply as soon as they are published on this page; it is the User's responsibility to review them periodically.",
    },
    "cgu.s1.p5": {
      fr: "L'Utilisateur s'engage à utiliser et naviguer sur WIYAO dans le respect des lois et réglementations applicables ainsi que des présentes CGU.",
      en: "The User agrees to use and browse WIYAO in compliance with applicable laws and regulations as well as these Terms of Use.",
    },
    "cgu.s1.p6": {
      fr: "Si une clause des présentes CGU est déclarée nulle et non avenue par une décision de justice, les autres clauses restent valables.",
      en: "If a clause of these Terms of Use is declared null and void by a court decision, the other clauses remain valid.",
    },
    "cgu.s2.h2": { fr: "2. Informations et services fournis", en: "2. Information and services provided" },
    "cgu.s2.p1": {
      fr: 'WIYAO donne accès gratuitement, sans création de compte, à des roadmaps d\'orientation tech, un <a href="test-orientation.html">test d\'orientation</a>, un annuaire d\'<a href="ecoles.html">écoles et universités togolaises</a>, un <a href="calendrier.html">calendrier des dates clés</a>, des ressources sur les <a href="bourses-financement.html">bourses et le financement</a>, des offres de <a href="stages-emploi.html">stages et d\'emploi</a>, ainsi qu\'un panorama de l\'<a href="ecosysteme.html">écosystème tech togolais</a>.',
      en: 'WIYAO gives free access, with no account required, to tech orientation roadmaps, an <a href="test-orientation.html">orientation test</a>, a directory of <a href="ecoles.html">Togolese schools and universities</a>, a <a href="calendrier.html">calendar of key dates</a>, resources on <a href="bourses-financement.html">scholarships and funding</a>, <a href="stages-emploi.html">internship and job</a> listings, as well as an overview of the <a href="ecosysteme.html">Togolese tech ecosystem</a>.',
    },
    "cgu.s2.p2": {
      fr: 'Le site étant accessible sans inscription ni collecte de données personnelles (voir la <a href="politique-confidentialite.html">politique de confidentialité</a>), aucune vérification d\'âge ou de capacité juridique n\'est requise pour le consulter. Les parents ou tuteurs de mineurs restent libres d\'encadrer l\'utilisation d\'Internet par les enfants dont ils ont la charge.',
      en: 'As the site is accessible without registration or personal data collection (see the <a href="politique-confidentialite.html">privacy policy</a>), no age or legal capacity verification is required to consult it. Parents or guardians of minors remain free to oversee their children\'s use of the Internet.',
    },
    "cgu.s3.h2": { fr: "3. Règles de conduite", en: "3. Rules of conduct" },
    "cgu.s3.p1": {
      fr: "De manière générale, l'Utilisateur doit utiliser WIYAO, son contenu et ses fonctionnalités conformément aux présentes CGU, aux lois et réglementations en vigueur, aux bonnes mœurs et à l'ordre public, et ce à tout moment.",
      en: "In general, the User must use WIYAO, its content and its features in accordance with these Terms of Use, applicable laws and regulations, good morals and public order, at all times.",
    },
    "cgu.s3.p2": {
      fr: "Plus spécifiquement, et sans limitation aux points ci-après énumérés, l'Utilisateur ne doit pas :",
      en: "More specifically, and without limitation to the points listed below, the User must not:",
    },
    "cgu.s3.li1": {
      fr: "faire un usage inapproprié ou illicite du contenu de WIYAO, ni l'utiliser pour se livrer à des activités illégales ou préjudiciables aux intérêts ou aux droits de tiers ;",
      en: "make inappropriate or unlawful use of WIYAO's content, or use it to engage in activities that are illegal or harmful to the interests or rights of third parties;",
    },
    "cgu.s3.li2": {
      fr: "faire usage du contenu de WIYAO à des fins illégales ou pour porter atteinte à des tiers ;",
      en: "use WIYAO's content for illegal purposes or to harm third parties;",
    },
    "cgu.s3.li3": {
      fr: "restreindre ou empêcher un autre Utilisateur d'utiliser et de profiter du site ;",
      en: "restrict or prevent another User from using and enjoying the site;",
    },
    "cgu.s3.li4": {
      fr: "copier, distribuer ou modifier le contenu du site à des fins commerciales, en dehors des conditions prévues à la section « Propriété intellectuelle » ci-dessous ;",
      en: 'copy, distribute or modify the site\'s content for commercial purposes, outside the conditions set out in the "Intellectual property" section below;',
    },
    "cgu.s3.li5": {
      fr: "contourner, désactiver ou perturber de quelque manière que ce soit les fonctionnalités liées à la sécurité du site ;",
      en: "circumvent, disable or disrupt in any way the security-related features of the site;",
    },
    "cgu.s3.li6": {
      fr: "envoyer ou diffuser des informations, codes ou contenus susceptibles de nuire, perturber ou endommager le site, son infrastructure, ou les équipements d'autres Utilisateurs — logiciels malveillants, virus et autres codes de cette nature inclus, sans s'y limiter.",
      en: "send or distribute information, code or content likely to harm, disrupt or damage the site, its infrastructure, or other Users' equipment — including but not limited to malware, viruses and other code of this nature.",
    },
    "cgu.s3.p3": {
      fr: "L'Utilisateur qui ne respecte pas les présentes CGU peut voir son accès à WIYAO restreint, afin de préserver la sécurité et la disponibilité du site pour les autres.",
      en: "A User who does not comply with these Terms of Use may have their access to WIYAO restricted, in order to preserve the security and availability of the site for others.",
    },
    "cgu.s4.h2": { fr: "4. Limitation des garanties et de la responsabilité", en: "4. Limitation of warranties and liability" },
    "cgu.s4.p1": {
      fr: 'L\'utilisation de WIYAO se fait sous la responsabilité de l\'Utilisateur. WIYAO fait ses meilleurs efforts, à titre bénévole, pour assurer la disponibilité du site et la fiabilité des informations publiées — voir la méthodologie de vérification détaillée sur la page <a href="about.html">À propos &amp; méthodologie</a> — mais ne peut garantir une disponibilité continue ni l\'absence totale d\'erreur.',
      en: 'Use of WIYAO is at the User\'s own responsibility. WIYAO makes its best efforts, on a volunteer basis, to ensure the site\'s availability and the reliability of published information — see the detailed verification methodology on the <a href="about.html">About &amp; methodology</a> page — but cannot guarantee continuous availability or the total absence of errors.',
    },
    "cgu.s4.p2": {
      fr: 'Si tu repères une inexactitude, merci de nous le signaler via la page <a href="contact.html">Contact</a>.',
      en: 'If you spot an inaccuracy, please let us know via the <a href="contact.html">Contact</a> page.',
    },
    "cgu.s4.p3": {
      fr: "WIYAO ne peut être tenu responsable d'un usage de son contenu par un Utilisateur ou un tiers à des fins illégales ou pour porter atteinte à des tiers, ni des dommages pouvant résulter d'une intrusion illégitime indépendante de sa volonté.",
      en: "WIYAO cannot be held liable for the use of its content by a User or a third party for illegal purposes or to harm third parties, nor for damages that may result from an illegitimate intrusion beyond its control.",
    },
    "cgu.s4.p4": {
      fr: "WIYAO est exonéré de toute responsabilité pouvant découler de la violation des présentes CGU par l'Utilisateur.",
      en: "WIYAO is released from any liability that may arise from a User's violation of these Terms of Use.",
    },
    "cgu.s5.h2": { fr: "5. Propriété intellectuelle", en: "5. Intellectual property" },
    "cgu.s5.p1": {
      fr: 'Le code source de WIYAO est ouvert et consultable sur le <a href="https://github.com/GRIIINDER/Wiyao" target="_blank" rel="noopener">dépôt GitHub</a>. Les contenus rédigés par WIYAO (roadmaps, fiches écoles, guides, textes du site) sont proposés à titre informatif et peuvent être réutilisés à titre non commercial en citant la source.',
      en: 'WIYAO\'s source code is open and available on the <a href="https://github.com/GRIIINDER/Wiyao" target="_blank" rel="noopener">GitHub repository</a>. Content written by WIYAO (roadmaps, school profiles, guides, site text) is provided for informational purposes and may be reused for non-commercial purposes with attribution.',
    },
    "cgu.s5.p2": {
      fr: "Les informations et documents tiers cités sur WIYAO (textes officiels, sites d'écoles, articles de presse, données d'organismes publics) restent la propriété de leurs auteurs ou éditeurs respectifs ; WIYAO n'en revendique aucun droit.",
      en: "Third-party information and documents cited on WIYAO (official texts, school websites, press articles, public organization data) remain the property of their respective authors or publishers; WIYAO claims no rights over them.",
    },
    "cgu.s5.p3": {
      fr: "L'accès et l'utilisation de WIYAO ne transfèrent en aucun cas à l'Utilisateur les droits de propriété intellectuelle sur des éléments qui ne lui appartiennent pas déjà.",
      en: "Access to and use of WIYAO does not, under any circumstances, transfer to the User any intellectual property rights over elements that do not already belong to them.",
    },

    "faq.cat1.h2": { fr: "Sur WIYAO", en: "About WIYAO" },
    "faq.c1.q1": { fr: "C'est gratuit ?", en: "Is it free?" },
    "faq.c1.a1": { fr: "Oui, entièrement. Pas de compte à créer, pas d'abonnement, pas de publicité.", en: "Yes, entirely. No account to create, no subscription, no ads." },
    "faq.c1.q2": { fr: "Il faut créer un compte pour utiliser le site ?", en: "Do I need to create an account to use the site?" },
    "faq.c1.a2": { fr: "Non. Tout le site — roadmaps, test d'orientation, comparateur d'écoles, calendrier — s'utilise sans compte ni inscription.", en: "No. The whole site — roadmaps, orientation test, school comparison, calendar — works without an account or registration." },
    "faq.c1.q3": { fr: "Comment ma progression sur les roadmaps est-elle sauvegardée ?", en: "How is my progress on roadmaps saved?" },
    "faq.c1.a3": { fr: "Uniquement dans le stockage local (localStorage) de ton navigateur, jamais envoyée à un serveur. Si tu changes d'appareil ou de navigateur, ou si tu vides les données de ton navigateur, ta progression est perdue.", en: "Only in your browser's local storage (localStorage), never sent to a server. If you switch device or browser, or clear your browser data, your progress is lost." },
    "faq.c1.q4": { fr: "Est-ce que WIYAO collecte mes données personnelles ?", en: "Does WIYAO collect my personal data?" },
    "faq.c1.a4": {
      fr: 'Non. Aucune collecte de données, aucun outil de suivi (analytics), aucune publicité. Détails dans la <a href="politique-confidentialite.html">politique de confidentialité</a>.',
      en: 'No. No data collection, no tracking tools (analytics), no advertising. Details in the <a href="politique-confidentialite.html">privacy policy</a>.',
    },
    "faq.c1.q5": { fr: "Qui a créé WIYAO ?", en: "Who created WIYAO?" },
    "faq.c1.a5": {
      fr: 'Un projet communautaire indépendant, sans statut commercial, maintenu à titre personnel, inspiré de roadmap.sh et adapté au contexte togolais. Détails dans <a href="about.html">À propos &amp; méthodologie</a> et les <a href="mentions-legales.html">mentions légales</a>.',
      en: 'An independent community project, with no commercial status, maintained on a personal basis, inspired by roadmap.sh and adapted to the Togolese context. Details in <a href="about.html">About &amp; methodology</a> and the <a href="mentions-legales.html">legal notice</a>.',
    },
    "faq.c1.q6": { fr: "Les informations du site sont-elles vérifiées ?", en: "Is the site's information verified?" },
    "faq.c1.a6": {
      fr: "Oui — sourcées activement (sites officiels, presse togolaise, documents signés). Quand une information ne peut pas être confirmée (par exemple des frais de scolarité), le site l'indique clairement plutôt que d'inventer un chiffre. Le marché évolue vite : vérifie toujours en direct auprès de l'établissement ou l'organisme concerné avant de t'engager.",
      en: "Yes — actively sourced (official sites, Togolese press, signed documents). When something can't be confirmed (for example, tuition fees), the site says so clearly rather than making up a number. The market moves fast: always check directly with the relevant institution or organization before committing.",
    },
    "faq.c1.q7": { fr: "Comment signaler une erreur ou proposer un ajout ?", en: "How do I report an error or suggest an addition?" },
    "faq.c1.a7": {
      fr: 'Via le <a href="https://github.com/GRIIINDER/Wiyao/issues" target="_blank" rel="noopener">dépôt GitHub</a> ou par email à <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a>.',
      en: 'Via the <a href="https://github.com/GRIIINDER/Wiyao/issues" target="_blank" rel="noopener">GitHub repository</a> or by email at <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a>.',
    },
    "faq.c1.q8": { fr: "WIYAO fonctionne hors connexion ?", en: "Does WIYAO work offline?" },
    "faq.c1.a8": {
      fr: "Oui. WIYAO est une application web installable (PWA) : une fois une page visitée, elle reste accessible même sans connexion Internet.",
      en: "Yes. WIYAO is an installable web app (PWA): once a page has been visited, it stays accessible even without an internet connection.",
    },

    "faq.cat2.h2": { fr: "Sur l'orientation et les roadmaps", en: "About orientation and roadmaps" },
    "faq.c2.q1": { fr: "Je ne sais pas du tout quoi choisir, par où je commence ?", en: "I have no idea what to choose, where do I start?" },
    "faq.c2.a1": {
      fr: 'Par le <a href="test-orientation.html">test d\'orientation</a> — 12 questions pour identifier le domaine tech qui te correspond, puis les métiers et écoles adaptés.',
      en: 'With the <a href="test-orientation.html">orientation test</a> — 12 questions to identify the tech field that suits you, then matching roles and schools.',
    },
    "faq.c2.q2": { fr: "Quelle est la différence entre roadmap « par métier » et « par compétence » ?", en: 'What\'s the difference between a "role" roadmap and a "skill" roadmap?' },
    "faq.c2.a2": {
      fr: "Une roadmap par métier (ex : Développeur Web) est le chemin complet à suivre pour viser un rôle donné. Une roadmap par compétence (ex : Git &amp; GitHub) couvre un sujet précis, indépendant du métier — utile en complément d'une roadmap métier.",
      en: "A role-based roadmap (e.g. Web Developer) is the complete path to follow to aim for a given role. A skill-based roadmap (e.g. Git &amp; GitHub) covers a specific topic, independent of any role — useful alongside a role roadmap.",
    },
    "faq.c2.q3": { fr: "Je dois suivre toute la roadmap dans l'ordre ?", en: "Do I have to follow the whole roadmap in order?" },
    "faq.c2.a3": {
      fr: "Les étapes marquées comme essentielles sont recommandées dans l'ordre. Les étapes optionnelles peuvent être sautées ou reportées selon ton niveau et ton objectif.",
      en: "Steps marked as essential are recommended in order. Optional steps can be skipped or postponed depending on your level and goal.",
    },

    "faq.cat3.h2": { fr: "Sur les écoles et les frais", en: "About schools and fees" },
    "faq.c3.q1": { fr: "Toutes les écoles listées sont-elles reconnues par l'État ?", en: "Are all the listed schools recognized by the State?" },
    "faq.c3.a1": {
      fr: "Le badge « 🏛️ Agréé État » indique une présence sur la liste officielle du Ministère togolais de l'Enseignement Supérieur (liste des établissements reconnus pour l'année académique 2025-2026, publiée le 30 septembre 2025). Les établissements publics et l'IAI-Togo (institut inter-États) n'ont pas ce badge pour des raisons de statut, pas de qualité.",
      en: 'The "🏛️ State-accredited" badge indicates presence on the official list from the Togolese Ministry of Higher Education (list of recognized institutions for the 2025-2026 academic year, published September 30, 2025). Public institutions and IAI-Togo (an inter-state institute) don\'t carry this badge for reasons of status, not quality.',
    },
    "faq.c3.q2": { fr: "Comment sont trouvés les frais de scolarité affichés ?", en: "How are the displayed tuition fees found?" },
    "faq.c3.a2": {
      fr: "Par une recherche active sur les sites officiels des écoles, des documents PDF signés et la presse togolaise. Chaque montant publié est sourcé.",
      en: "Through active research on schools' official websites, signed PDF documents and the Togolese press. Every published amount is sourced.",
    },
    "faq.c3.q3": { fr: "Pourquoi certaines écoles n'ont pas leurs frais affichés ?", en: "Why don't some schools have their fees displayed?" },
    "faq.c3.a3": {
      fr: "Parce que l'information n'a pas été trouvée quelque part de fiable et public. Plutôt que d'inventer un montant, WIYAO l'indique « non communiqué publiquement » — il faut alors contacter l'école directement.",
      en: 'Because the information wasn\'t found anywhere reliable and public. Rather than making up a figure, WIYAO marks it "not publicly disclosed" — you\'ll need to contact the school directly.',
    },
    "faq.c3.q4": { fr: "WIYAO couvre quelles villes du Togo ?", en: "Which Togolese cities does WIYAO cover?" },
    "faq.c3.a4": {
      fr: "Majoritairement Lomé et Kara, avec des écoles également référencées à Sokodé, Bassar et Atakpamé.",
      en: "Mainly Lomé and Kara, with schools also listed in Sokodé, Bassar and Atakpamé.",
    },

    "faq.cat4.h2": { fr: "Après le choix", en: "After you've chosen" },
    "faq.c4.q1": { fr: "Comment trouver un stage ou un emploi ?", en: "How do I find an internship or a job?" },
    "faq.c4.a1": {
      fr: 'Direction la page <a href="stages-emploi.html">Stages &amp; emploi</a> : plateformes togolaises et employeurs numériques qui recrutent régulièrement.',
      en: 'Head to the <a href="stages-emploi.html">Internships &amp; jobs</a> page: Togolese platforms and digital employers that hire regularly.',
    },
    "faq.c4.q2": { fr: "Comment rencontrer d'autres personnes dans la tech togolaise ?", en: "How do I meet other people in Togolese tech?" },
    "faq.c4.a2": {
      fr: 'La page <a href="ecosysteme.html">Écosystème togolais</a> liste communautés, événements, hubs et incubateurs à connaître.',
      en: 'The <a href="ecosysteme.html">Togolese ecosystem</a> page lists communities, events, hubs and incubators worth knowing.',
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
