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
    "proposer.html": { fr: "Proposer du contenu", en: "Suggest content" },
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
    "roadmap.reset": { fr: "Réinitialiser la progression", en: "Reset progress" },
    "roadmap.footernote": {
      fr: "Coche les étapes au fur et à mesure. Ta progression est enregistrée localement dans ton navigateur.",
      en: "Check off steps as you go. Your progress is saved locally in your browser.",
    },
    "quiz.primer.title": { fr: "L'informatique, en 7 grands domaines", en: "Tech, in 7 major domains" },
    "quiz.primer.desc": {
      fr: "Un aperçu rapide avant de répondre — pas besoin de tout connaître par cœur, c'est justement le rôle du test de t'aider à t'y retrouver.",
      en: "A quick overview before you answer — no need to know it all by heart, that's exactly what the test is here to help you sort out.",
    },
    "calendrier.sourcenote": {
      fr: "Les dates précises changent chaque année et ne sont pas toujours republiées à temps par les établissements eux-mêmes. Celles marquées « dates de référence » viennent d'une campagne passée et donnent une idée du calendrier habituel, pas une garantie pour l'année en cours.",
      en: "Exact dates change every year and aren't always republished in time by the institutions themselves. Those marked \"reference dates\" come from a past admissions cycle and give an idea of the usual calendar, not a guarantee for the current year.",
    },
    "index.parmetier.h2": { fr: "Roadmaps par métier", en: "Roadmaps by role" },
    "index.parmetier.desc": { fr: "Le chemin complet à suivre pour viser un rôle donné.", en: "The full path to follow to aim for a given role." },
    "index.parcompetence.h2": { fr: "Roadmaps par compétence", en: "Roadmaps by skill" },
    "index.parcompetence.desc": { fr: "Une compétence précise à maîtriser, utile pour plusieurs métiers.", en: "A specific skill to master, useful across several roles." },
    "index.noresults": { fr: "Aucune roadmap ne correspond à ta recherche.", en: "No roadmap matches your search." },
    "index.filter.all": { fr: "Tous", en: "All" },
    "index.filter.dev": { fr: "Développement", en: "Development" },
    "index.filter.data": { fr: "Data &amp; IA", en: "Data &amp; AI" },
    "index.filter.securite": { fr: "Sécurité", en: "Security" },
    "index.filter.produit": { fr: "Produit &amp; Design", en: "Product &amp; Design" },
    "index.filter.infra": { fr: "Infrastructure &amp; DevOps", en: "Infrastructure &amp; DevOps" },
    "index.filter.marketing": { fr: "Marketing digital", en: "Digital Marketing" },
    "index.filter.gestion": { fr: "Gestion &amp; Management", en: "Management" },
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

    "proposer.hero.title": {
      fr: 'Propose du <span class="hero-accent">contenu</span>',
      en: 'Suggest <span class="hero-accent">content</span>',
    },
    "proposer.hero.subtitle": {
      fr: "Un événement tech, une communauté ou une ressource togolaise qui manque sur WIYAO ? Dis-nous-en plus — on vérifie et on ajoute.",
      en: "A tech event, community or Togolese resource missing from WIYAO? Tell us about it — we verify and add it.",
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

    "temoin.s1.h2": { fr: "C'est un vrai métier", en: "It's a real career" },
    "temoin.s1.desc": {
      fr: "Le numérique togolais n'est plus une niche : c'est un secteur suivi par le gouvernement, financé par des bailleurs internationaux, et qui recrute réellement.",
      en: "Togolese digital tech is no longer a niche: it's a sector tracked by the government, funded by international donors, and genuinely hiring.",
    },
    "temoin.s1.i1.h4": { fr: "8 % du PIB togolais", en: "8% of Togolese GDP" },
    "temoin.s1.i1.p": { fr: "Contribution du numérique à l'économie togolaise, contre 4 % en 2022 — objectif affiché : 10 %.", en: "Digital tech's contribution to the Togolese economy, up from 4% in 2022 — stated target: 10%." },
    "temoin.s1.i2.h4": { fr: "37 000 emplois créés", en: "37,000 jobs created" },
    "temoin.s1.i2.p": { fr: 'Nombre d\'emplois que la stratégie nationale « Togo Digital » vise à créer entre 2022 et 2025 grâce au numérique.', en: 'Number of jobs the national "Togo Digital" strategy aims to create between 2022 and 2025 through digital tech.' },
    "temoin.s1.i3.h4": { fr: "100 millions $ de la Banque mondiale", en: "$100 million from the World Bank" },
    "temoin.s1.i3.p": { fr: "Financement accordé en décembre 2024 pour soutenir la transformation numérique togolaise (création d'emplois, compétitivité).", en: "Funding granted in December 2024 to support Togo's digital transformation (job creation, competitiveness)." },
    "temoin.s1.i4.h4": { fr: "700 à 1 300 $/mois", en: "$700 to $1,300/month" },
    "temoin.s1.i4.p": { fr: "Fourchette de salaire pour un développeur, ingénieur système ou chef de projet IT au Togo — nettement au-dessus du salaire moyen national.", en: "Salary range for a developer, systems engineer or IT project manager in Togo — well above the national average salary." },
    "temoin.s1.i5.h4": { fr: "2 milliards+ FCFA de revenus cumulés", en: "2 billion+ FCFA in combined revenue" },
    "temoin.s1.i5.p": { fr: "Revenus déjà générés par les startups numériques togolaises fédérées par TogoTech (Gozem, Semoa, Édolé, MiaPay, Clinicaa...), avec une centaine d'emplois directs créés.", en: "Revenue already generated by the Togolese digital startups united under TogoTech (Gozem, Semoa, Édolé, MiaPay, Clinicaa...), with around a hundred direct jobs created." },
    "temoin.s1.i6.h4": { fr: "Des recruteurs togolais réels", en: "Real Togolese employers" },
    "temoin.s1.i6.p": { fr: "L'Agence Togo Digital recrute régulièrement développeurs, architectes, UX/UI, QA, Scrum Master et data — pas besoin de partir à l'étranger pour trouver un poste.", en: "Agence Togo Digital regularly hires developers, architects, UX/UI, QA, Scrum Masters and data profiles — no need to move abroad to find a job." },
    "temoin.s1.note": {
      fr: "Chiffres 2025-2026, sources : Banque mondiale, Ministère de l'Économie Numérique, Togo First, Agence Ecofin, TogoTech, offres d'emploi Togolaises (emploi.tg, Indeed). Les salaires varient selon l'expérience et l'entreprise — vérifie toujours les offres actuelles avant de te décider.",
      en: "2025-2026 figures, sources: World Bank, Ministry of Digital Economy, Togo First, Agence Ecofin, TogoTech, Togolese job listings (emploi.tg, Indeed). Salaries vary by experience and company — always check current listings before deciding.",
    },

    "temoin.s2.h2": { fr: "Les secteurs qui recrutent", en: "Sectors that are hiring" },
    "temoin.s2.desc": {
      fr: "Le numérique togolais ne se limite pas au développement web : ces secteurs embauchent activement.",
      en: "Togolese digital tech isn't limited to web development: these sectors are actively hiring.",
    },
    "temoin.s2.i1.p": { fr: "Paiement mobile, inclusion financière — l'un des secteurs les plus dynamiques du numérique togolais.", en: "Mobile payments, financial inclusion — one of the most dynamic sectors in Togolese digital tech." },
    "temoin.s2.i2.p": { fr: "Solutions numériques pour l'agriculture, secteur clé de l'économie togolaise.", en: "Digital solutions for agriculture, a key sector of the Togolese economy." },
    "temoin.s2.i3.p": { fr: "Plateformes de vente en ligne et logistique associée, en forte croissance.", en: "Online sales platforms and associated logistics, growing fast." },
    "temoin.s2.i4.p": { fr: "Applications et services numériques pour la santé.", en: "Digital applications and services for healthcare." },
    "temoin.s2.i5.p": { fr: "Technologies éducatives — comme WIYAO.", en: "Educational technology — like WIYAO." },

    "temoin.s3.h2": { fr: "Ils l'ont fait", en: "They did it" },
    "temoin.s3.desc": {
      fr: "Des togolais·es qui ont construit une carrière ou une entreprise dans la tech — parcours vérifiés et sourcés, pas des exemples inventés.",
      en: "Togolese people who built a career or a company in tech — verified, sourced stories, not made-up examples.",
    },
    "temoin.s3.p1.h4": { fr: "Sénamé Koffi Agbodjinou — Fondateur de WoeLab", en: "Sénamé Koffi Agbodjinou — Founder of WoeLab" },
    "temoin.s3.p1.p": {
      fr: "Architecte et anthropologue, il fonde WoeLab à Lomé en 2012 — le premier FabLab d'Afrique de l'Ouest. C'est sous son impulsion que WoeLab produit en 2013 la première imprimante 3D africaine fabriquée à partir de déchets électroniques (W.Afate), distinguée par la NASA. Ashoka Fellow depuis 2017.",
      en: "An architect and anthropologist, he founded WoeLab in Lomé in 2012 — West Africa's first FabLab. Under his leadership, WoeLab produced Africa's first 3D printer made from electronic waste (W.Afate) in 2013, recognized by NASA. Ashoka Fellow since 2017.",
    },
    "temoin.s3.p2.h4": { fr: "Kodjo Afate Gnikou — Inventeur de l'imprimante 3D W.Afate", en: "Kodjo Afate Gnikou — Inventor of the W.Afate 3D printer" },
    "temoin.s3.p2.p": {
      fr: "Géographe de formation, sans parcours informatique initial. En 2013, à WoeLab, il construit en six mois W.Afate — la première imprimante 3D africaine fabriquée à partir de déchets électroniques récupérés dans les décharges de Lomé. Premier prix de l'innovation technologique à la conférence internationale FabLab (Barcelone, 2014).",
      en: "Trained as a geographer, with no initial background in computing. In 2013, at WoeLab, he spent six months building W.Afate — Africa's first 3D printer made from electronic waste salvaged from Lomé's landfills. First prize for technological innovation at the international FabLab conference (Barcelona, 2014).",
    },
    "temoin.s3.p3.h4": { fr: "Edem Adjamagbo — Fondateur &amp; CEO de Semoa", en: "Edem Adjamagbo — Founder &amp; CEO of Semoa" },
    "temoin.s3.p3.p": {
      fr: 'Ingénieur en Business Intelligence (Polytech Nantes), il fonde Semoa après avoir observé, en voyage, un système d\'achat de crédit téléphonique par borne. Semoa devient en janvier 2026 la première fintech togolaise agréée full-service PSP par la BCEAO. « J\'ai découvert que l\'achat de crédit de communication s\'y faisait depuis une borne et non, comme c\'est le cas au Togo, en grattant des recharges téléphoniques en papier. »',
      en: 'A Business Intelligence engineer (Polytech Nantes), he founded Semoa after observing, while traveling, a kiosk-based system for buying phone credit. In January 2026, Semoa became the first Togolese fintech licensed as a full-service PSP by the BCEAO. "I discovered that buying phone credit there was done through a kiosk, rather than scratching paper phone top-up cards like in Togo."',
    },
    "temoin.s3.p4.h4": { fr: "Emefa Ameyo Kpegba — Ingénieure logicielle &amp; cofondatrice de GDG Lomé", en: "Emefa Ameyo Kpegba — Software engineer &amp; co-founder of GDG Lomé" },
    "temoin.s3.p4.p": {
      fr: "Ingénieure logicielle et data scientist, cofondatrice de Women Techmakers Lomé et de GDG (Google Developer Group) Lomé. A fondé AFRI TECH HUB, à l'origine d'un kit informatique low-cost pour enseigner la programmation. Mandela Washington Fellow (YALI).",
      en: "Software engineer and data scientist, co-founder of Women Techmakers Lomé and GDG (Google Developer Group) Lomé. Founded AFRI TECH HUB, behind a low-cost computing kit for teaching programming. Mandela Washington Fellow (YALI).",
    },
    "temoin.s3.p5.h4": { fr: "Innocente Gbékévi — Consultante en cybersécurité", en: "Innocente Gbékévi — Cybersecurity consultant" },
    "temoin.s3.p5.p": {
      fr: "Licence en ingénierie informatique au Togo, puis masters en sécurité réseau (Reims, France) et cybersécurité (Florida Institute of Technology, États-Unis). A travaillé 5 ans à l'Office Togolais des Recettes avant de devenir consultante indépendante, notamment pour un audit sécurité de l'OIF.",
      en: "Bachelor's in computer engineering in Togo, followed by master's degrees in network security (Reims, France) and cybersecurity (Florida Institute of Technology, USA). Worked for 5 years at the Togolese Revenue Authority before becoming an independent consultant, including for an OIF security audit.",
    },
    "temoin.s3.p6.h4": { fr: "Rebecca Taboukouna — Développeuse mobile (Flutter)", en: "Rebecca Taboukouna — Mobile developer (Flutter)" },
    "temoin.s3.p6.p": {
      fr: "Développeuse web et mobile originaire de Niamtougou, spécialisée Flutter. Sélectionnée pour la prestigieuse Anzisha Prize Fellowship (2021) et invitée à la conférence Flutter Forward de Google à Nairobi (2023).",
      en: "Web and mobile developer from Niamtougou, specialized in Flutter. Selected for the prestigious Anzisha Prize Fellowship (2021) and invited to Google's Flutter Forward conference in Nairobi (2023).",
    },
    "temoin.s3.p7.h4": { fr: "Etepe Anahlui — Cofondateur de Karaba", en: "Etepe Anahlui — Co-founder of Karaba" },
    "temoin.s3.p7.p": {
      fr: "Licence en sciences et technologies puis en transformation numérique, certificat en data intelligence (IMT Business School, France). Cofonde Karaba, une IA conversationnelle qui connecte recruteurs et candidats dans plus de 20 pays africains via WhatsApp.",
      en: "Bachelor's in science and technology, then digital transformation, certificate in data intelligence (IMT Business School, France). Co-founded Karaba, a conversational AI that connects recruiters and candidates across more than 20 African countries via WhatsApp.",
    },
    "temoin.s3.p8.h4": { fr: "Matina Gaël Egbidi — Cofondatrice &amp; PDG de SOLIMI", en: "Matina Gaël Egbidi — Co-founder &amp; CEO of SOLIMI" },
    "temoin.s3.p8.p": {
      fr: 'Ingénieure logicielle formée au Maroc, elle fonde SOLIMI en 2020 pour démocratiser l\'accès bancaire via des cartes prépayées Visa sans compte bancaire. Sélectionnée dans la cohorte 2022 de l\'Africa Prize for Engineering Innovation (Royal Academy of Engineering, Royaume-Uni). « Nous pensons que Solimi peut avoir un impact énorme sur les communautés non bancarisées et à faibles revenus. »',
      en: 'A software engineer trained in Morocco, she founded SOLIMI in 2020 to democratize banking access through prepaid Visa cards requiring no bank account. Selected for the 2022 cohort of the Africa Prize for Engineering Innovation (Royal Academy of Engineering, UK). "We believe Solimi can have a huge impact on unbanked and low-income communities."',
    },
    "temoin.s3.note": {
      fr: "Parcours reconstitués à partir de sources publiques (presse togolaise et africaine, sites institutionnels) citées sous chaque portrait — aucun nom, citation ou détail n'est inventé. Certains éléments biographiques (dates précises, cursus complet) n'ont pas pu être confirmés partout et sont volontairement omis plutôt que devinés.",
      en: "Profiles reconstructed from public sources (Togolese and African press, institutional websites) cited under each portrait — no name, quote or detail is invented. Some biographical details (exact dates, full academic history) could not be confirmed everywhere and are deliberately omitted rather than guessed.",
    },

    "actu.t1.date": { fr: "12-13 août 2026", en: "August 12-13, 2026" },
    "actu.t1.h3": { fr: "Togo IT Days, 2ᵉ édition", en: "Togo IT Days, 2nd edition" },
    "actu.t1.p": {
      fr: "Conférence numérique tenue à l'Hôtel 2 Février (Lomé) : entrepreneuriat numérique, IA, cybersécurité,\n             développement des compétences des jeunes, numérique responsable et inclusion des femmes dans la tech,\n             avec hackathon et espace d'exposition de startups.",
      en: "Digital conference held at Hôtel 2 Février (Lomé): digital entrepreneurship, AI, cybersecurity, youth skills development, responsible digital practices and women's inclusion in tech, with a hackathon and startup exhibition space.",
    },
    "actu.t2.date": { fr: "Début août 2026", en: "Early August 2026" },
    "actu.t2.h3": { fr: "1ʳᵉ édition du Kara Digital Summit", en: "1st edition of the Kara Digital Summit" },
    "actu.t2.p": {
      fr: "Événement numérique tenu à Kara pour rapprocher la formation numérique des jeunes en dehors de Lomé,\n             avec un programme de mentorat personnalisé — extension prévue vers Dapaong, Sokodé, Atakpamé et Notsè\n             pour démocratiser l'usage pratique du numérique et de l'IA sur tout le territoire.",
      en: "Digital event held in Kara to bring digital training closer to young people outside Lomé, with a personalized mentoring program — expansion planned to Dapaong, Sokodé, Atakpamé and Notsè to spread practical use of digital tools and AI nationwide.",
    },
    "actu.t3.date": { fr: "24 juillet 2026", en: "July 24, 2026" },
    "actu.t3.h3": { fr: "Nouvelle liste des établissements accrédités pour 2026-2027", en: "New list of accredited institutions for 2026-2027" },
    "actu.t3.p": {
      fr: 'Le ministère de l\'Enseignement Supérieur publie la liste actualisée : 111 établissements reconnus\n             (13 publics, 98 privés), contre 97 l\'année précédente. Le ministère rappelle : « avant toute\n             inscription, vérifiez que l\'établissement choisi y figure ». WIYAO a mis à jour son comparateur\n             d\'écoles en conséquence (ajout d\'ISBIC-ALG, renommage de Collège de Paris Togo en Ascencia · Keyce,\n             retrait du badge Agréé État de DEFITECH).',
      en: 'The Ministry of Higher Education publishes the updated list: 111 recognized institutions (13 public, 98 private), up from 97 the previous year. The ministry reminds applicants: "before enrolling anywhere, check that the chosen institution is on the list." WIYAO updated its school comparison accordingly (added ISBIC-ALG, renamed Collège de Paris Togo to Ascencia · Keyce, removed the State-accredited badge from DEFITECH).',
    },
    "actu.t4.date": { fr: "18-29 mai 2026", en: "May 18-29, 2026" },
    "actu.t4.h3": { fr: "9 startups edtech togolaises accompagnées vers l'international", en: "9 Togolese edtech startups supported toward international markets" },
    "actu.t4.p": {
      fr: "Programme accéléré porté par l'Agence Togo Digital (ATD) avec le soutien de la GIZ (ProDigiT) :\n             9 startups sélectionnées sur 39 candidatures (dont 2 dirigées par des femmes) — MainBridge, Edumiaa,\n             Eforma Africa, ENOVSKY, Edufast, SKULLVI, Deezpro, Nufia et Mon Choix Ma Carrière. Elles participent\n             ensuite à eLearning Africa (Accra) ; les projets les plus avancés reçoivent un accompagnement\n             supplémentaire du Djanta Tech Hub.",
      en: "Accelerator program run by Agence Togo Digital (ATD) with support from GIZ (ProDigiT): 9 startups selected out of 39 applications (2 of them women-led) — MainBridge, Edumiaa, Eforma Africa, ENOVSKY, Edufast, SKULLVI, Deezpro, Nufia and Mon Choix Ma Carrière. They then took part in eLearning Africa (Accra); the most advanced projects receive additional support from Djanta Tech Hub.",
    },
    "actu.t5.date": { fr: "7 mai 2026", en: "May 7, 2026" },
    "actu.t5.h3": { fr: "Inauguration officielle du Djanta Tech Hub", en: "Official opening of Djanta Tech Hub" },
    "actu.t5.p": {
      fr: 'Incubateur national financé par la Banque mondiale, avec Djanta Academy (formation), Djanta Start\n             (incubation), Nana Tech (entrepreneuriat féminin) et Djanta Lab (recherche). Accompagnera environ\n             72 startups togolaises entre juin 2026 et juillet 2027, et lance le fonds « Start » (subventions\n             moyennes de 15 000 € pour une trentaine d\'entrepreneurs).',
      en: 'National incubator funded by the World Bank, with Djanta Academy (training), Djanta Start (incubation), Nana Tech (women\'s entrepreneurship) and Djanta Lab (research). Will support around 72 Togolese startups between June 2026 and July 2027, and launches the "Start" fund (average grants of €15,000 for around thirty entrepreneurs).',
    },
    "actu.t6.date": { fr: "26 avril 2026", en: "April 26, 2026" },
    "actu.t6.h3": { fr: "Six centres d'innovation tech annoncés en région", en: "Six regional tech innovation centers announced" },
    "actu.t6.p": {
      fr: 'Le Togo prépare six « Pods » technologiques (incubation, formation, accompagnement de projets) dans les\n             préfectures de Tône, Kozah, Tchaoudjo, Ogou, Kloto et Zio, financés par la Banque mondiale (IDA) —\n             objectif : sortir les opportunités numériques de la seule concentration à Lomé. Projet encore en phase\n             préparatoire (appel à manifestation d\'intérêt lancé, aucune construction démarrée à cette date).',
      en: 'Togo is preparing six tech "Pods" (incubation, training, project support) in the Tône, Kozah, Tchaoudjo, Ogou, Kloto and Zio prefectures, funded by the World Bank (IDA) — the goal: spread digital opportunities beyond Lomé alone. Project still in the preparatory phase (call for expressions of interest launched, no construction started as of this date).',
    },
    "actu.t7.date": { fr: "16 avril 2026", en: "April 16, 2026" },
    "actu.t7.h3": { fr: "L'Université de Lomé part à la rencontre des futurs bacheliers", en: "University of Lomé reaches out to future high-school graduates" },
    "actu.t7.p": {
      fr: "Campagne nationale de sensibilisation dans une quarantaine de lycées des régions Maritime, Plateaux\n             Ouest et Centrale : système LMD, filières, conditions d'admission, bourses et vie étudiante, avec\n             temps d'échange dédié aux questions des élèves de première et terminale.",
      en: "National outreach campaign across about forty high schools in the Maritime, Plateaux Ouest and Centrale regions: the LMD system, programs, admission requirements, scholarships and student life, with dedicated Q&amp;A time for 11th and 12th grade students.",
    },
    "actu.t8.date": { fr: "24 octobre 2025", en: "October 24, 2025" },
    "actu.t8.h3": { fr: "Lancement du collectif TogoTech", en: "Launch of the TogoTech collective" },
    "actu.t8.p": {
      fr: '13 startups tech togolaises (Gozem, Semoa, Édolé, Solimi, MiaPay, Kondjigbalé, Anaxar,\n             Clinicaa...) s\'unissent en collectif national — plus de 2 milliards FCFA de chiffre d\'affaires cumulé\n             et une centaine d\'emplois directs. Partenariats signés avec Cyber Defense Africa (cybersécurité) et\n             Acquereburu &amp; Partners (cadre juridique). La ministre Cina Lawson y voit « un acte de maturité »\n             pour le secteur.',
      en: '13 Togolese tech startups (Gozem, Semoa, Édolé, Solimi, MiaPay, Kondjigbalé, Anaxar, Clinicaa...) join forces in a national collective — over 2 billion FCFA in combined revenue and around a hundred direct jobs. Partnerships signed with Cyber Defense Africa (cybersecurity) and Acquereburu &amp; Partners (legal framework). Minister Cina Lawson called it "an act of maturity" for the sector.',
    },
    "actu.t9.date": { fr: "6 octobre 2025", en: "October 6, 2025" },
    "actu.t9.h3": { fr: "ACAN lance Orientys, un outil d'orientation numérique pour bacheliers", en: "ACAN launches Orientys, a digital orientation tool for high-school graduates" },
    "actu.t9.p": {
      fr: 'Plateforme en ligne qui suggère 3 métiers du numérique adaptés au profil scolaire d\'un bachelier\n             (série, notes) avec fiches métiers et formations correspondantes au Togo et dans la sous-région.\n             « Le numérique n\'est pas réservé à une élite : il peut devenir une voie pour tous », selon Giovanni\n             Hounkpati, directeur général d\'ACAN.',
      en: 'Online platform that suggests 3 digital careers matched to a high-school graduate\'s academic profile (track, grades), with role profiles and matching training programs in Togo and the sub-region. "Digital tech isn\'t reserved for an elite: it can become a path for everyone," according to Giovanni Hounkpati, ACAN\'s managing director.',
    },
    "actu.t10.date": { fr: "Rentrée 2025-2026", en: "2025-2026 school year" },
    "actu.t10.h3": { fr: "Une université américaine s'installe au Togo : GUST", en: "An American university sets up in Togo: GUST" },
    "actu.t10.p": {
      fr: 'La Global University of Science &amp; Technology (GUST), fédération académique déjà présente aux\n             États-Unis, au Canada et en France, ouvre son premier campus francophone d\'Afrique à Lomé (quartier\n             Agoè Anomé) — accréditée par le Ministère togolais de l\'Enseignement Supérieur et de la Recherche.',
      en: 'Global University of Science &amp; Technology (GUST), an academic federation already present in the United States, Canada and France, opens its first French-speaking African campus in Lomé (Agoè Anomé district) — accredited by the Togolese Ministry of Higher Education and Research.',
    },
    "actu.note": {
      fr: 'WIYAO n\'a pas de flux d\'actualités automatique — chaque entrée ci-dessus est ajoutée et vérifiée manuellement contre une source publique. Pour l\'actualité en continu, suis directement <a href="https://www.togofirst.com/" target="_blank" rel="noopener">Togo First</a> ou les <a href="ecosysteme.html#communautes">communautés tech togolaises</a>.',
      en: 'WIYAO has no automated news feed — every entry above is added and manually verified against a public source. For continuous updates, follow <a href="https://www.togofirst.com/" target="_blank" rel="noopener">Togo First</a> directly or the <a href="ecosysteme.html#communautes">Togolese tech communities</a>.',
    },

    "stages.s1.h2": { fr: "Plateformes d'emploi et de stage", en: "Job and internship platforms" },
    "stages.s1.i1.p": {
      fr: 'Agence publique togolaise de l\'emploi. Sa page « métiers porteurs » classe les métiers informatiques parmi les secteurs prioritaires (ingénieur systèmes/réseau, télécom, développeur, administrateur système, gestionnaire de projet IT...) et référence les écoles qui y forment.',
      en: 'Togolese public employment agency. Its "high-demand careers" page ranks IT roles among priority sectors (systems/network engineer, telecom, developer, systems administrator, IT project manager...) and lists the schools that train for them.',
    },
    "stages.s1.i2.p": {
      fr: "Portail généraliste avec des pages dédiées Informatique et Développeur (offres Flutter, Java Spring, Angular, React Native déjà vues). Le site bloque la vérification automatisée directe, mais son activité est confirmée par de nombreuses sources croisées.",
      en: "General job portal with dedicated IT and Developer pages (Flutter, Java Spring, Angular, React Native listings already seen). The site blocks direct automated verification, but its activity is confirmed by numerous cross-referenced sources.",
    },
    "stages.s1.i3.p": {
      fr: "Cabinet de recrutement basé à Lomé, très actif (emplois, stages, concours, bourses). Pas de catégorie informatique dédiée, mais des offres tech y apparaissent régulièrement.",
      en: "Recruitment firm based in Lomé, very active (jobs, internships, exams, scholarships). No dedicated IT category, but tech listings appear there regularly.",
    },
    "stages.s1.i4.p": {
      fr: "Portail régional ouest-africain avec une catégorie Informatique dédiée pour le Togo — la structure existe, le volume d'offres varie selon les périodes.",
      en: "West African regional portal with a dedicated IT category for Togo — the structure exists, though listing volume varies over time.",
    },
    "stages.s1.i5.p": {
      fr: "Utile surtout pour les formations tech (Python, DevOps &amp; Cloud, IA, Power BI) plutôt que pour les offres d'emploi à proprement parler.",
      en: "Mostly useful for tech training listings (Python, DevOps &amp; Cloud, AI, Power BI) rather than job postings as such.",
    },

    "stages.s2.h2": { fr: "Employeurs qui recrutent des profils tech", en: "Employers hiring tech profiles" },
    "stages.s2.i1.p": {
      fr: "Agence publique pilotant la digitalisation de l'État togolais. Recrute régulièrement développeurs, architectes, UX/UI, QA, Scrum Master, data.",
      en: "Public agency leading the digitalization of the Togolese State. Regularly hires developers, architects, UX/UI, QA, Scrum Masters, data profiles.",
    },
    "stages.s2.i2.p": {
      fr: "Coentreprise entre l'État togolais et Asseco Data Systems, opère le CERT national et un SOC. Recrute analystes SOC, consultants et formateurs en cybersécurité.",
      en: "Joint venture between the Togolese State and Asseco Data Systems, operates the national CERT and a SOC. Hires SOC analysts, consultants and cybersecurity trainers.",
    },
    "stages.s2.i3.p": {
      fr: "Deuxième opérateur télécom du pays. Page carrière active ; historique récent de recrutements réseaux, télécoms et systèmes.",
      en: "The country's second telecom operator. Active careers page; recent history of hiring for networks, telecom and systems roles.",
    },
    "stages.s2.i4.p": {
      fr: "Opérateur télécom historique du Togo (fixe, mobile, Mobile Money), né de la fusion de Togo Telecom et Togocel en 2017. Recrute régulièrement des profils informatiques (développement, systèmes d'information, réseaux OSS/BSS). Pas de portail carrières dédié identifié — les candidatures se font par e-mail directement auprès du service recrutement.",
      en: "Togo's historic telecom operator (fixed line, mobile, Mobile Money), born from the 2017 merger of Togo Telecom and Togocel. Regularly hires IT profiles (development, information systems, OSS/BSS networks). No dedicated careers portal identified — applications go by email directly to the recruitment department.",
    },
    "stages.s2.i5.p": {
      fr: "Application de mobilité et de super-app (courses, livraison, paiement mobile) fondée et lancée à Lomé en 2018 — l'un des succès tech les plus visibles nés au Togo, aujourd'hui présente dans plusieurs pays d'Afrique francophone. Recrute régulièrement des profils tech (développement, data, produit) via son portail carrières.",
      en: "Mobility and super-app (rides, delivery, mobile payments) founded and launched in Lomé in 2018 — one of the most visible tech success stories to come out of Togo, now present in several French-speaking African countries. Regularly hires tech profiles (development, data, product) via its careers portal.",
    },
    "stages.s2.i6.p": {
      fr: "Institution financière régionale dont le siège se trouve à Lomé. Recrute régulièrement sur des postes IT (réseaux, systèmes, développement, cybersécurité, gestion de projets) ainsi que des stages.",
      en: "Regional financial institution headquartered in Lomé. Regularly hires for IT roles (networks, systems, development, cybersecurity, project management) as well as internships.",
    },
    "stages.s2.i7.p": {
      fr: "Groupe bancaire panafricain dont le siège social se trouve à Lomé. Recrute régulièrement sur des postes IT et réseaux, aux côtés des autres métiers de la banque, dans ses 33 pays d'opération.",
      en: "Pan-African banking group headquartered in Lomé. Regularly hires for IT and network roles, alongside other banking positions, across its 33 countries of operation.",
    },
    "stages.s2.note": {
      fr: "D'autres grandes entreprises togolaises recrutent aussi des profils tech, sans page carrière dédiée et fiable identifiée au moment de la rédaction — les offres y passent surtout par les plateformes ci-dessus ou par candidature spontanée directe.",
      en: "Other large Togolese companies also hire tech profiles, without a dedicated and reliable careers page identified at the time of writing — their openings mostly flow through the platforms above or direct unsolicited applications.",
    },

    "stages.s3.h2": { fr: "Ressources locales à ne pas négliger", en: "Local resources not to overlook" },
    "stages.s3.i1.h4": { fr: "Hubs et incubateurs", en: "Hubs and incubators" },
    "stages.s3.i1.p": {
      fr: "Djanta Start, Nunya-Lab, CUBE et les autres incubateurs togolais accompagnent aussi bien la création de projet que l'accès à un premier stage pratique.",
      en: "Djanta Start, Nunya-Lab, CUBE and other Togolese incubators support both starting a project and landing a first hands-on internship.",
    },
    "stages.s3.i1.link": { fr: "Voir les hubs et incubateurs", en: "See the hubs and incubators" },
    "stages.s3.i2.h4": { fr: "Communautés tech", en: "Tech communities" },
    "stages.s3.i2.p": {
      fr: "GDG Lomé, PyCon Togo, CoTIA... la majorité des opportunités locales circulent d'abord dans ces réseaux, avant même d'être publiées quelque part.",
      en: "GDG Lomé, PyCon Togo, CoTIA... most local opportunities circulate first within these networks, before ever being posted anywhere.",
    },
    "stages.s3.i2.link": { fr: "Voir les communautés", en: "See the communities" },

    "stages.guide.h2": { fr: "Comment décrocher un stage ou un emploi tech", en: "How to land a tech internship or job" },
    "stages.guide.p1": {
      fr: "<strong>1. Construis un portfolio concret.</strong> Un profil GitHub avec quelques projets terminés (même petits) pèse souvent plus qu'un diplôme seul aux yeux d'un recruteur tech. Termine les roadmaps qui t'intéressent et mets le résultat en ligne.",
      en: "<strong>1. Build a concrete portfolio.</strong> A GitHub profile with a few finished projects (even small ones) often carries more weight than a degree alone in the eyes of a tech recruiter. Finish the roadmaps that interest you and put the result online.",
    },
    "stages.guide.p2": {
      fr: "<strong>2. Passe par le réseau avant les offres publiques.</strong> Beaucoup de stages togolais se trouvent via le bouche-à-oreille dans les communautés (GDG Lomé, PyCon Togo, CoTIA...) avant d'être publiés ailleurs. Assiste aux meetups, pose des questions, propose ton aide sur des projets.",
      en: "<strong>2. Go through your network before public listings.</strong> Many Togolese internships are found through word of mouth in communities (GDG Lomé, PyCon Togo, CoTIA...) before being posted anywhere else. Attend meetups, ask questions, offer to help on projects.",
    },
    "stages.guide.p3": {
      fr: "<strong>3. Postule directement, même sans offre publiée.</strong> Beaucoup de PME et d'agences togolaises n'ont pas de page carrière : un e-mail ciblé avec un lien vers ton portfolio a plus d'impact qu'une candidature générique sur un grand site.",
      en: "<strong>3. Apply directly, even without a posted opening.</strong> Many Togolese SMEs and agencies have no careers page: a targeted email with a link to your portfolio has more impact than a generic application on a big site.",
    },
    "stages.guide.p4": {
      fr: "<strong>4. Envisage aussi le travail à distance.</strong> Des plateformes comme Upwork, Contra ou Turing permettent à un développeur togolais de travailler pour des clients internationaux sans quitter Lomé. C'est exigeant (anglais, portfolio solide) mais ça élargit beaucoup le marché.",
      en: "<strong>4. Consider remote work too.</strong> Platforms like Upwork, Contra or Turing let a Togolese developer work for international clients without leaving Lomé. It's demanding (English, a solid portfolio) but it greatly widens the market.",
    },
    "stages.guide.p5": {
      fr: "<strong>5. Prépare un CV court et concret.</strong> Un recruteur tech togolais regarde d'abord ce que tu as construit, pas une liste de compétences vagues. Mets en avant 2-3 projets précis plutôt qu'une longue liste de technologies.",
      en: "<strong>5. Prepare a short, concrete résumé.</strong> A Togolese tech recruiter looks first at what you've built, not a vague list of skills. Highlight 2-3 specific projects rather than a long list of technologies.",
    },

    "bourses.s1.h2": { fr: "Bourses proposées directement par les écoles", en: "Scholarships offered directly by schools" },
    "bourses.s1.desc": {
      fr: 'La majorité des écoles privées togolaises proposent leurs propres réductions ou concours de bourses —\n      souvent la piste la plus accessible, mais la moins visible. Détails complets (filières, frais, contact) sur la page\n      <a href="ecoles.html">Écoles &amp; universités</a>.',
      en: 'Most Togolese private schools offer their own discounts or scholarship competitions — often the most accessible option, but the least visible. Full details (programs, fees, contact) on the <a href="ecoles.html">Schools &amp; universities</a> page.',
    },
    "bourses.s1.i1.p": { fr: "Bourses sociales et au mérite, avec possibilité de payer les frais en 3 fois.", en: "Need-based and merit scholarships, with the option to pay fees in 3 installments." },
    "bourses.s1.i2.p": { fr: "Bourses FONAP, bourses de mobilité (Le Havre, Belgique) et bourses au mérite scolaire (source : esig.tg/faq).", en: "FONAP scholarships, mobility scholarships (Le Havre, Belgium) and academic merit scholarships (source: esig.tg/faq)." },
    "bourses.s1.i3.p": { fr: "Concours de bourses togolais donnant droit à une réduction de 15 à 75 % sur les frais de scolarité.", en: "Togolese scholarship competition offering a 15 to 75% discount on tuition fees." },
    "bourses.s1.i4.p": {
      fr: 'Bourse « Étoile Scientifique » de 200 000 FCFA/an réservée aux étudiantes en informatique, plus une réduction fratrie de 50 000 FCFA/an (source : ucao-uut.tg/admissions).',
      en: '"Étoile Scientifique" scholarship of 200,000 FCFA/year reserved for female computer science students, plus a 50,000 FCFA/year sibling discount (source: ucao-uut.tg/admissions).',
    },
    "bourses.s1.i5.p": { fr: "Concours de bourses chaque année en septembre (réduction sur les frais de scolarité, montant variable).", en: "Scholarship competition every September (discount on tuition fees, variable amount)." },
    "bourses.s1.i6.p": { fr: "Accès à la bourse d'État togolaise comme toute université publique, ainsi qu'à des bourses internationales (France, Inde) pour les meilleurs dossiers.", en: "Access to the Togolese State scholarship like any public university, as well as international scholarships (France, India) for the strongest applications." },
    "bourses.s1.i7.p": { fr: "Bourses ponctuelles attribuées par tirage au sort à la rentrée — non garanties chaque année.", en: "One-off scholarships awarded by lottery at the start of the year — not guaranteed annually." },
    "bourses.s1.i8.p": { fr: "Bourses disponibles de 50 000 à 250 000 FCFA selon le niveau (Licence/Master).", en: "Scholarships available from 50,000 to 250,000 FCFA depending on level (Bachelor's/Master's)." },
    "bourses.s1.note": { fr: "Montants et conditions changent d'une année à l'autre — vérifie toujours le détail actuel directement auprès de l'école avant de t'engager.", en: "Amounts and conditions change from year to year — always check the current details directly with the school before committing." },

    "bourses.s2.h2": { fr: "Bourse d'État togolaise", en: "Togolese State scholarship" },
    "bourses.s2.i1.h4": { fr: "Bourse nationale", en: "National scholarship" },
    "bourses.s2.i1.p": {
      fr: 'Réservée aux étudiants de nationalité togolaise <strong>déjà inscrits dans une université publique togolaise</strong>\n           (Université de Lomé, Université de Kara), avec une moyenne « assez-bien » ou plus. La procédure n\'est pas\n           numérisée : le dossier se dépose physiquement, selon un calendrier fixé chaque année.',
      en: 'Reserved for Togolese nationals <strong>already enrolled in a Togolese public university</strong> (Université de Lomé, Université de Kara), with a "good" grade average or above. The process is not digitized: applications are filed in person, on a schedule set each year.',
    },
    "bourses.s2.i2.h4": { fr: "Bourses de coopération (étudier à l'étranger)", en: "Cooperation scholarships (studying abroad)" },
    "bourses.s2.i2.p": {
      fr: "Accords bilatéraux gérés par la DBS : bourses AMCI (Maroc), bourse d'excellence de l'UEMOA, bourses vers le\n           Brésil et d'autres pays partenaires. Chaque programme a ses propres critères et dates, publiés au fil de\n           l'année — l'appel pour l'AMCI 2026-2027 a par exemple été publié début août 2026.",
      en: "Bilateral agreements managed by the DBS: AMCI scholarships (Morocco), UEMOA excellence scholarship, scholarships to Brazil and other partner countries. Each program has its own criteria and dates, published throughout the year — the call for AMCI 2026-2027, for instance, was published in early August 2026.",
    },
    "bourses.s2.i3.h4": { fr: "Allocations de secours", en: "Emergency grants" },
    "bourses.s2.i3.p": {
      fr: "Aide financière ponctuelle pour les étudiants des universités publiques togolaises en difficulté, distincte\n           de la bourse nationale — demande à adresser également à la DBS.",
      en: "One-off financial aid for Togolese public university students in difficulty, separate from the national scholarship — also requested through the DBS.",
    },
    "bourses.s2.note": {
      fr: "Toutes ces demandes se gèrent auprès de la Direction des Bourses et Stages (DBS) — consulte\n      ses annonces à jour avant de constituer un dossier, les délais et critères changent chaque année. Ces bourses ne\n      concernent pas les écoles privées — pour elles, voir les bourses propres à chaque établissement ci-dessus.",
      en: "All these applications are handled through the Direction des Bourses et Stages (DBS) — check its current announcements before putting together an application, as deadlines and criteria change every year. These scholarships don't apply to private schools — for those, see each institution's own scholarships above.",
    },

    "bourses.s3.h2": { fr: "Financement bancaire", en: "Bank financing" },
    "bourses.s3.i1.p": { fr: "Prêt à court terme pour financer une rentrée (frais de scolarité, fournitures), réservé aux titulaires d'un compte courant. Réponse annoncée sous 72h.", en: "Short-term loan to finance a school year (tuition fees, supplies), reserved for checking account holders. Response promised within 72 hours." },
    "bourses.s3.i2.p": { fr: "Offre bancaire pour élèves et étudiants (compte épargne, carte Visa Keaz, SMS Banking) — pas un prêt en soi, mais une base pour gérer ton budget d'études.", en: "Banking package for students (savings account, Visa Keaz card, SMS Banking) — not a loan as such, but a base for managing your study budget." },

    "bourses.s4.h2": { fr: "Bourses internationales et régionales accessibles aux Togolais", en: "International and regional scholarships accessible to Togolese students" },
    "bourses.s4.desc": { fr: "Utiles surtout après une Licence, pour un Master ou une spécialisation — à garder en tête pour plus tard dans ton parcours.", en: "Mostly useful after a Bachelor's degree, for a Master's or a specialization — worth keeping in mind for later in your journey." },
    "bourses.s4.i1.p": { fr: "Bourses de mobilité pour un Master (M1/M2) ou un Doctorat dans un établissement membre de l'AUF, hors du pays d'origine — le Togo fait partie des pays éligibles.", en: "Mobility scholarships for a Master's (M1/M2) or a PhD at an AUF member institution, outside your home country — Togo is among the eligible countries." },
    "bourses.s4.i2.p": {
      fr: 'Programme de bourses (Fondation Femmes pour l\'Afrique) pour des étudiantes africaines, dont togolaises, souhaitant étudier en Espagne — plus de 100 bourses toutes disciplines, relayé notamment par <a href="ecosysteme.html#communautes">Togolaises In Science</a>.',
      en: 'Scholarship program (Fondation Femmes pour l\'Afrique) for African female students, including Togolese, wishing to study in Spain — over 100 scholarships across all disciplines, promoted notably by <a href="ecosysteme.html#communautes">Togolaises In Science</a>.',
    },
    "bourses.s4.i3.p": { fr: "Programme régional pour les meilleurs étudiants des pays membres de l'UEMOA, dont le Togo — appel à candidatures publié annuellement.", en: "Regional program for top students from UEMOA member countries, including Togo — call for applications published annually." },
    "bourses.s4.i4.p": { fr: "Bourses du gouvernement français pour poursuivre des études supérieures en France, ouvertes aux candidatures togolaises via l'ambassade de France.", en: "French government scholarships to pursue higher education in France, open to Togolese applications via the French embassy." },

    "bourses.s5.h2": { fr: "Se former sans payer de frais de scolarité", en: "Training without paying tuition fees" },
    "bourses.s5.desc": { fr: "Une alternative ou un complément à un cursus classique, surtout pour démarrer ou tester un domaine avant de s'engager financièrement.", en: "An alternative or complement to a traditional program, especially for getting started or testing out a field before committing financially." },
    "bourses.s5.i1.p": { fr: "Formation en ligne entièrement gratuite à Adidogomé (Lomé) : blockchain, communication digitale, design graphique, IA et marketing digital.", en: "Entirely free online training in Adidogomé (Lomé): blockchain, digital communication, graphic design, AI and digital marketing." },
    "bourses.s5.i2.p": {
      fr: "Programme gratuit du Ministère de la Transformation Numérique, ouvert à tous les étudiants des universités et écoles togolaises (pas seulement en informatique) : plateforme d'apprentissage avec IA, assistant pédagogique disponible 24h/24, tutorat humain par des enseignants universitaires, format hybride en ligne et présentiel.",
      en: "Free program from the Ministry of Digital Transformation, open to all Togolese university and school students (not just computer science): AI-powered learning platform, teaching assistant available 24/7, human tutoring by university lecturers, hybrid online and in-person format.",
    },
    "bourses.s5.i3.p": {
      fr: 'Formations gratuites aux métiers du numérique (développement web/mobile, marketing digital, IA, data, et depuis juillet 2026 la fabrication numérique/FabLab) portées par l\'Organisation Internationale de la Francophonie — plus de 600 jeunes togolais formés depuis 2024. Détails dans l\'<a href="ecosysteme.html#hubs">écosystème togolais</a>.',
      en: 'Free training in digital careers (web/mobile development, digital marketing, AI, data, and since July 2026 digital fabrication/FabLab) run by the Organisation Internationale de la Francophonie — over 600 young Togolese trained since 2024. Details in the <a href="ecosysteme.html#hubs">Togolese ecosystem</a>.',
    },
    "bourses.s5.i4.h4": { fr: "Ressources en ligne gratuites", en: "Free online resources" },
    "bourses.s5.i4.p": { fr: "Les roadmaps WIYAO s'appuient largement sur des ressources gratuites (documentation officielle, cours en ligne) — de quoi apprendre l'essentiel d'un métier sans frais avant de choisir une école.", en: "WIYAO's roadmaps rely heavily on free resources (official documentation, online courses) — enough to learn the essentials of a role at no cost before choosing a school." },
    "bourses.s5.i4.link": { fr: "Voir les roadmaps", en: "See the roadmaps" },

    "eco.main.h2": { fr: "Communautés et événements", en: "Communities and events" },
    "eco.sub1": { fr: "Communautés actives (à rejoindre toute l'année)", en: "Active communities (join anytime)" },
    "eco.c1.p": { fr: "Google Developer Group : meetups réguliers sur le web, le mobile et le cloud.", en: "Google Developer Group: regular meetups on web, mobile and cloud." },
    "eco.c2.p": { fr: "Communauté togolaise de développeurs Python, partenaire de la Python Software Foundation et de la Django Software Foundation. Ateliers et rencontres mensuelles, organise le PyDay Togo.", en: "Togolese community of Python developers, a partner of the Python Software Foundation and the Django Software Foundation. Monthly workshops and meetups, organizes PyDay Togo." },
    "eco.c3.h4": { fr: "CoTIA — Communauté Togolaise d'Intelligence Artificielle", en: "CoTIA — Togolese Artificial Intelligence Community" },
    "eco.c3.p": { fr: "Communauté dédiée à la démocratisation de l'IA au Togo. Organise IndabaX Togo depuis 2021, en partenariat avec le réseau panafricain Deep Learning Indaba.", en: "Community dedicated to democratizing AI in Togo. Has organized IndabaX Togo since 2021, in partnership with the pan-African Deep Learning Indaba network." },
    "eco.c4.p": { fr: "Club étudiant de l'IAI-Togo organisant ateliers, conférences et hackathons/CTF (dont Hack &amp; Defend) pour ses membres.", en: "IAI-Togo student club organizing workshops, conferences and hackathons/CTFs (including Hack &amp; Defend) for its members." },
    "eco.c5.p": { fr: "Chapitre étudiant Google Developer Student Club rattaché à l'IAI-Togo, participant notamment au DevFest Lomé.", en: "Google Developer Student Club chapter affiliated with IAI-Togo, notably taking part in DevFest Lomé." },
    "eco.c6.h4": { fr: "TDEV — Communauté des Développeurs Togolais", en: "TDEV — Togolese Developers Community" },
    "eco.c6.p": { fr: "Communauté de développeurs togolais depuis 2018, pour les 16-35 ans passionnés de numérique : talks, bourses, sessions de code et événement annuel Code Moment.", en: "Togolese developer community since 2018, for 16-35 year-olds passionate about digital tech: talks, scholarships, coding sessions and the annual Code Moment event." },
    "eco.c7.p": { fr: "Réseau/club d'affaires pour les femmes togolaises en STEM, lancé en mars 2025, 1ᵉʳ chapitre du réseau panafricain Africaines In Tech. Objectif : former 1000 femmes au numérique d'ici 2030.", en: "Network/business club for Togolese women in STEM, launched in March 2025, 1st chapter of the pan-African Africaines In Tech network. Goal: train 1,000 women in digital skills by 2030." },
    "eco.c8.p": { fr: "Communauté togolaise autour de l'éditeur de code assisté par IA Cursor : ateliers pratiques, hackathons (dont un à Lomé Business School) et sessions sur les agents IA de développement, animés par des Cursor Ambassadors togolais.", en: "Togolese community around the AI-assisted code editor Cursor: hands-on workshops, hackathons (including one at Lomé Business School) and sessions on AI development agents, led by Togolese Cursor Ambassadors." },
    "eco.c9.p": { fr: "Communauté d'apprentissage pour débutants complets en programmation, active depuis décembre 2025 : sessions live hebdomadaires (vCODE, chaque vendredi), projets pratiques en binômes, entraide active — Python, JavaScript, C, Java. Plus de 300 membres actifs, rayonnant sur l'Afrique francophone (Togo, Bénin, Côte d'Ivoire, Sénégal).", en: "Learning community for complete programming beginners, active since December 2025: weekly live sessions (vCODE, every Friday), pair-programming practical projects, active peer support — Python, JavaScript, C, Java. Over 300 active members, reaching across French-speaking Africa (Togo, Benin, Côte d'Ivoire, Senegal)." },
    "eco.c10.p": { fr: "Communauté dédiée à l'anglais professionnel pour la tech : vocabulaire technique, présentations, entretiens, préparation au travail à distance et aux communautés tech internationales.", en: "Community dedicated to professional English for tech: technical vocabulary, presentations, interviews, preparation for remote work and international tech communities." },
    "eco.c11.p": { fr: "Communauté dédiée à l'émancipation des jeunes filles dans la tech togolaise : apprentissage des métiers technologiques, leadership et gestion de projet. Référencée à la fois par la communauté tech togolaise et par le registre officiel de l'écosystème numérique.", en: "Community dedicated to empowering young girls in Togolese tech: learning tech careers, leadership and project management. Listed both by the Togolese tech community and the official digital ecosystem registry." },
    "eco.c12.p": { fr: "Communauté togolaise autour du Bitcoin et des cryptomonnaies, référencée au registre officiel de l'écosystème numérique togolais.", en: "Togolese community around Bitcoin and cryptocurrencies, listed in the official registry of the Togolese digital ecosystem." },
    "eco.c13.h4": { fr: "Chapitre Togolais d'Internet Society (ISOC Togo)", en: "Togolese Chapter of Internet Society (ISOC Togo)" },
    "eco.c13.p": { fr: "Chapitre national actif depuis 2008 (600+ membres), organise le Forum togolais sur la gouvernance de l'Internet et déploie des réseaux communautaires locaux pour l'accès à Internet.", en: "National chapter active since 2008 (600+ members), organizes the Togolese Forum on Internet Governance and deploys local community networks for Internet access." },
    "eco.c14.h4": { fr: "ACAN — Académie Numérique", en: "ACAN — Digital Academy" },
    "eco.c14.p": { fr: "Académie de formation en ligne gratuite à Adidogomé (Lomé) : blockchain, communication digitale, design graphique, intelligence artificielle et marketing digital. 500+ étudiants formés.", en: "Free online training academy in Adidogomé (Lomé): blockchain, digital communication, graphic design, artificial intelligence and digital marketing. 500+ students trained." },
    "eco.c15.p": { fr: "Outil d'orientation numérique lancé en octobre 2025 par ACAN : un bachelier renseigne sa série et ses notes de Bac, l'outil suggère 3 métiers du numérique adaptés à son profil avec fiches métier et établissements de formation correspondants au Togo et dans la sous-région.", en: "Digital orientation tool launched in October 2025 by ACAN: a high-school graduate enters their track and Bac grades, and the tool suggests 3 digital careers matched to their profile, with role profiles and matching training institutions in Togo and the sub-region." },
    "eco.c16.p": { fr: "Chapitre togolais du programme mondial Microsoft pour étudiants : apprentissage des technologies Microsoft (Azure, IA, GitHub, Copilot), organisation d'événements techniques et mentorat, avec un parcours de progression (Alpha, Beta, Gold MLSA).", en: "Togolese chapter of Microsoft's global student program: learning Microsoft technologies (Azure, AI, GitHub, Copilot), organizing technical events and mentoring, with a progression path (Alpha, Beta, Gold MLSA)." },
    "eco.c17.p": { fr: "Chapitre étudiant Google Developer Student Club à l'Université de Lomé : ateliers réguliers (ex. développement web HTML/CSS/JS) et développement de solutions numériques pour la communauté universitaire.", en: "Google Developer Student Club chapter at the University of Lomé: regular workshops (e.g. HTML/CSS/JS web development) and building digital solutions for the university community." },
    "eco.c18.p": { fr: "Chapitre étudiant Google Developer Student Club à Lomé Business School : ateliers pratiques (ex. contribution à l'IA de Google via Google Crowdsource).", en: "Google Developer Student Club chapter at Lomé Business School: hands-on workshops (e.g. contributing to Google's AI via Google Crowdsource)." },
    "eco.c19.p": { fr: "Communauté togolaise de développeurs mobiles autour du framework Flutter : codelabs, événements (dont un Flutter Forward Extended à Lomé) et formulaire d'adhésion ouvert.", en: "Togolese mobile developer community around the Flutter framework: codelabs, events (including a Flutter Forward Extended in Lomé) and an open membership form." },
    "eco.c20.p": { fr: "Première alliance des designers numériques togolais (association loi 1901, fondée en 2014) : professionnalisation du secteur, tarification freelance, plaidoyer pour l'intégration du design numérique dans les cursus scolaires et supérieurs.", en: "First alliance of Togolese digital designers (a French law 1901 association, founded in 2014): professionalizing the sector, freelance pricing, advocacy for including digital design in school and higher education curricula." },
    "eco.c21.p": { fr: "Groupe local du réseau mondial de meetups WordPress (700+ groupes) : blogging, développement et webdesign autour de WordPress, ouvert aux débutants comme aux professionnels.", en: "Local chapter of the global WordPress meetup network (700+ groups): blogging, development and web design around WordPress, open to beginners and professionals alike." },
    "eco.c22.p": { fr: "Communauté de développeurs, créateurs et innovateurs tech basée à Kara — l'une des rares communautés actives structurées en dehors de Lomé.", en: "Community of developers, creators and tech innovators based in Kara — one of the few structured active communities outside Lomé." },
    "eco.c23.p": { fr: 'Communauté de cartographie libre créée en 2013, au service de l\'action humanitaire et de l\'aide au développement : rencontre mensuelle « Quartier à la carte » pour les cartographes togolais.', en: 'Free/open mapping community created in 2013, in service of humanitarian action and development aid: monthly "Quartier à la carte" (Neighborhood on the Map) meetup for Togolese mapmakers.' },
    "eco.c24.p": { fr: "Communauté togolaise des utilisateurs de LinkedIn : rencontres de réseautage autour des opportunités professionnelles, avec des éditions communes menées aux côtés des chapitres sœurs du Bénin et de la Côte d'Ivoire.", en: "Togolese community of LinkedIn users: networking meetups around professional opportunities, with joint editions held alongside sister chapters in Benin and Côte d'Ivoire." },

    "eco.sub2": { fr: "Événements annuels ou ponctuels", en: "Annual or one-off events" },
    "eco.e1.p": { fr: "Conférence annuelle de GDG Lomé, l'un des plus grands rassemblements tech du pays.", en: "Annual conference by GDG Lomé, one of the country's largest tech gatherings." },
    "eco.e2.p": { fr: "Conférence nationale de la communauté Python togolaise.", en: "National conference of the Togolese Python community." },
    "eco.e3.p": { fr: "1ʳᵉ édition tenue début août 2026 à Kara : rapprocher la formation numérique des jeunes en dehors de Lomé, avec un programme de mentorat personnalisé. Extension prévue vers Dapaong, Sokodé, Atakpamé et Notsè.", en: "1st edition held in early August 2026 in Kara: bringing digital training closer to young people outside Lomé, with a personalized mentoring program. Expansion planned to Dapaong, Sokodé, Atakpamé and Notsè." },
    "eco.e4.p": { fr: "Événement technologique annuel à Lomé (3ᵉ édition en 2025) qui forme, informe et récompense les jeunes talents numériques togolais : ateliers pratiques (Docker, Laravel, sécurité API...), concours Prix TCR, pitchs de projets et vitrine de startups.", en: "Annual tech event in Lomé (3rd edition in 2025) that trains, informs and rewards young Togolese digital talent: hands-on workshops (Docker, Laravel, API security...), the TCR Prize competition, project pitches and a startup showcase." },
    "eco.e5.h4": { fr: "GRIT — Grande Rencontre de l'Innovation Technologique", en: "GRIT — Grand Meeting for Technological Innovation" },
    "eco.e5.p": { fr: "Événement phare annuel de l'écosystème tech togolais, organisé avec GIZ Togo/ProDigiT : startups sélectionnées, bootcamp, rencontres avec investisseurs et partenaires stratégiques.", en: "Flagship annual event of the Togolese tech ecosystem, organized with GIZ Togo/ProDigiT: selected startups, bootcamp, meetings with investors and strategic partners." },
    "eco.e6.p": { fr: "Rassemblement annuel des communautés tech togolaises à l'Institut français du Togo : tables rondes, conférences et expositions pour rencontrer leur public.", en: "Annual gathering of Togolese tech communities at the Institut français du Togo: round tables, talks and exhibitions to meet their audience." },
    "eco.e7.p": { fr: "Conférence numérique de Lomé (2ᵉ édition tenue les 12-13 août 2026 à l'Hôtel 2 Février) : entrepreneuriat numérique, IA, cybersécurité, développement des compétences, numérique responsable et inclusion des femmes dans la tech, avec hackathon et espace d'exposition.", en: "Lomé digital conference (2nd edition held August 12-13, 2026 at Hôtel 2 Février): digital entrepreneurship, AI, cybersecurity, skills development, responsible digital practices and women's inclusion in tech, with a hackathon and exhibition space." },
    "eco.e8.p": { fr: "Grand salon technologique récurrent (5ᵉ édition en juillet 2026 à l'UniPod) : panels IA, cybersécurité, cloud et blockchain, exposition de solutions numériques et rencontres B2B.", en: "Major recurring tech expo (5th edition in July 2026 at UniPod): AI, cybersecurity, cloud and blockchain panels, digital solutions exhibition and B2B meetings." },

    "eco.hubs.h2": { fr: "Hubs et incubateurs", en: "Hubs and incubators" },
    "eco.h1.p": {
      fr: 'Incubateur national inauguré le 7 mai 2026 (financement Banque mondiale), avec Djanta Academy (formation),\n           Djanta Start (incubation), Nana Tech (entrepreneuriat féminin) et Djanta Lab (recherche). Accompagnera\n           environ 72 startups togolaises entre juin 2026 et juillet 2027, et lance le fonds « Start » (subventions\n           d\'environ 15 000 € pour une trentaine d\'entrepreneurs).',
      en: 'National incubator opened on May 7, 2026 (World Bank funded), with Djanta Academy (training), Djanta Start (incubation), Nana Tech (women\'s entrepreneurship) and Djanta Lab (research). Will support around 72 Togolese startups between June 2026 and July 2027, and launches the "Start" fund (grants of around €15,000 for about thirty entrepreneurs).',
    },
    "eco.h2.p": { fr: "Incubateur pour jeunes startups technologiques, inspiré du modèle rwandais K-Lab.", en: "Incubator for young tech startups, inspired by the Rwandan K-Lab model." },
    "eco.h3.p": { fr: "Incubateur formant des jeunes au numérique et à l'entrepreneuriat, en partenariat avec l'OIF.", en: "Incubator training young people in digital skills and entrepreneurship, in partnership with the OIF." },
    "eco.h4.h4": { fr: 'D-CLIC — « Formez-vous au numérique avec l\'OIF »', en: 'D-CLIC — "Get trained in digital skills with the OIF"' },
    "eco.h4.p": {
      fr: "Programme de formation gratuite aux métiers du numérique porté par l'Organisation Internationale de la Francophonie : plus de 600 jeunes formés au Togo entre 2024 et 2026 (développement web/mobile, marketing digital, IA, analyse de données). Une cohorte inédite lancée le 23 juillet 2026 forme aussi aux métiers de la fabrication numérique (impression 3D, FabLab), avec CUBE, UniPod, le Centre CAVRIS (Université de Kara) et Energy Generation.",
      en: "Free training program in digital careers run by the Organisation Internationale de la Francophonie: over 600 young people trained in Togo between 2024 and 2026 (web/mobile development, digital marketing, AI, data analysis). A new cohort launched on July 23, 2026 also trains in digital fabrication careers (3D printing, FabLab), with CUBE, UniPod, the CAVRIS Center (University of Kara) and Energy Generation.",
    },
    "eco.h5.p": {
      fr: "Premier incubateur de startups au Togo porté par le Centre Entrepreneurial des Femmes d'Affaires (FEFA Togo), actif depuis 2016 : accompagnement en entrepreneuriat, gestion administrative et financière, innovation, TIC, marketing — particulièrement tourné vers les jeunes femmes de 18 à 35 ans passionnées de numérique.",
      en: "Togo's first startup incubator, run by the Centre Entrepreneurial des Femmes d'Affaires (FEFA Togo), active since 2016: support in entrepreneurship, administrative and financial management, innovation, ICT, marketing — particularly aimed at young women aged 18-35 passionate about digital tech.",
    },
    "eco.h6.p": { fr: "Accélérateur de startups basé dans la région des Savanes, extension de l'incubateur de Lomé.", en: "Startup accelerator based in the Savanes region, an extension of the Lomé incubator." },
    "eco.h7.p": { fr: "Premier FabLab togolais, créé en 2012 à Lomé. À l'origine de la première imprimante 3D africaine fabriquée à partir de déchets électroniques (W.Afate), distinguée par la NASA en 2013.", en: "Togo's first FabLab, created in 2012 in Lomé. Behind Africa's first 3D printer made from electronic waste (W.Afate), recognized by NASA in 2013." },
    "eco.h8.p": { fr: "Incubateur public régional à Kara, lancé en 2021 pour accompagner les jeunes porteurs de projets, dans le même réseau que Nunya-Lab et Banm Lab.", en: "Regional public incubator in Kara, launched in 2021 to support young project leaders, part of the same network as Nunya-Lab and Banm Lab." },
    "eco.h9.p": { fr: "Premier incubateur de la région Centrale, ouvert en 2020 à Sokodé. Mentorat et formation en agriculture, artisanat et numérique.", en: "First incubator in the Centrale region, opened in 2020 in Sokodé. Mentoring and training in agriculture, crafts and digital skills." },
    "eco.h10.p": {
      fr: "Pôle universitaire d'innovation et de technologie de l'Université de Lomé, ouvert en février 2025. Financé par le PNUD (programme Timbuktoo, 1 milliard+ FCFA) : laboratoires, incubation et mentorat pour jeunes entrepreneurs et chercheurs. Le programme Campus Afrique — Timbuktoo (PNUD/UNESCO), mis en œuvre par UNIPOD, s'est étendu à l'Université de Kara en juillet 2026 après une première phase à Lomé.",
      en: "University of Lomé's innovation and technology hub, opened in February 2025. Funded by UNDP (Timbuktoo program, 1 billion+ FCFA): labs, incubation and mentoring for young entrepreneurs and researchers. The Campus Afrique — Timbuktoo program (UNDP/UNESCO), implemented by UNIPOD, expanded to the University of Kara in July 2026 after an initial phase in Lomé.",
    },
    "eco.h11.p": {
      fr: "Programme lancé le 3 octobre 2025 par IYBA-SEED Togo, avec l'Accélérateur DAGBA, l'incubateur Africa Coworkers et 10 universités publiques et privées : pitchs intra-universitaires, bootcamp, prototypage et mise en relation avec des investisseurs. Chiffres annoncés : 5000 étudiants impliqués, 100 projets accompagnés, 10 transformés en entreprises, 10 000 000 FCFA de fonds d'amorçage.",
      en: "Program launched October 3, 2025 by IYBA-SEED Togo, with the DAGBA Accelerator, the Africa Coworkers incubator and 10 public and private universities: intra-university pitches, bootcamp, prototyping and connecting with investors. Announced figures: 5,000 students involved, 100 projects supported, 10 turned into companies, 10,000,000 FCFA in seed funding.",
    },

    "eco.inst.h2": { fr: "Institutions publiques et employeurs numériques", en: "Public institutions and digital employers" },
    "eco.i1.p": { fr: "Agence publique pilotant la digitalisation des démarches administratives au Togo. Recrute régulièrement sur des postes tech variés : développeurs, architectes, UX/UI, QA, Scrum Master, data.", en: "Public agency leading the digitalization of administrative processes in Togo. Regularly hires for a range of tech roles: developers, architects, UX/UI, QA, Scrum Master, data." },
    "eco.i2.p": {
      fr: "Partenariat entre le Ministère togolais de la Transformation Numérique et CEGA (UC Berkeley), avec le soutien de Google.org : science des données et IA au service des politiques publiques (santé, agriculture, sécurité routière). A notamment recruté des data scientists repérés via un défi organisé sur Zindi (plateforme panafricaine de compétitions de data science) pour prédire la demande en connectivité internet dans les zones mal desservies.",
      en: "Partnership between the Togolese Ministry of Digital Transformation and CEGA (UC Berkeley), with support from Google.org: data science and AI in service of public policy (health, agriculture, road safety). Notably recruited data scientists spotted through a challenge run on Zindi (pan-African data science competition platform) to predict internet connectivity demand in underserved areas.",
    },
    "eco.i3.h4": { fr: "Ministère de l'Efficacité du Service Public et de la Transformation Numérique", en: "Ministry of Public Service Efficiency and Digital Transformation" },
    "eco.i3.p": { fr: "Ministère de tutelle de la stratégie numérique togolaise.", en: "Ministry overseeing Togo's digital strategy." },
    "eco.i4.p": {
      fr: "Collectif national lancé le 24 octobre 2025 réunissant 13 startups tech togolaises fondatrices (Gozem, Semoa, Édolé Africa, Solimi, Miapay, Kondjigbalẽ, Anaxar, Kaba Delivery...) — plus de 2 milliards FCFA de chiffre d'affaires cumulé et une centaine d'emplois directs. Trois startups membres actives (Antamix, E-Business Afrique, Umbaji) l'ont rejoint depuis. Sert de pont entre startups, institutions publiques et investisseurs.",
      en: "National collective launched October 24, 2025 bringing together 13 founding Togolese tech startups (Gozem, Semoa, Édolé Africa, Solimi, Miapay, Kondjigbalẽ, Anaxar, Kaba Delivery...) — over 2 billion FCFA in combined revenue and around a hundred direct jobs. Three active member startups (Antamix, E-Business Afrique, Umbaji) have joined since. Serves as a bridge between startups, public institutions and investors.",
    },
    "eco.i5.h4": { fr: "Portail de l'Écosystème Numérique Togolais", en: "Togolese Digital Ecosystem Portal" },
    "eco.i5.p": { fr: "Annuaire officiel du gouvernement recensant les acteurs du numérique togolais : 170 startups, 33 structures d'accompagnement (SAEI), 55 PME et 9 ONG/associations référencées, filtrables par ville et secteur d'activité.", en: "Official government directory listing Togolese digital tech players: 170 startups, 33 support structures (SAEI), 55 SMEs and 9 NGOs/associations listed, filterable by city and industry." },
    "eco.i6.p": { fr: "Chapitre togolais du réseau panafricain Open Source Community Africa (35 chapitres à travers le continent) : rencontres mensuelles, contribution à des projets open source, festival annuel Open Source Festival.", en: "Togolese chapter of the pan-African Open Source Community Africa network (35 chapters across the continent): monthly meetups, contributing to open source projects, annual Open Source Festival." },

    "eco.cyber.h2": { fr: "Cybersécurité et gouvernance", en: "Cybersecurity and governance" },
    "eco.cy1.h4": { fr: "ANCy — Agence Nationale de la Cybersécurité", en: "ANCy — National Cybersecurity Agency" },
    "eco.cy1.p": { fr: "Autorité nationale de sécurité des systèmes d'information, créée par la loi n°2018-026. Sensibilisation, stratégie et compétitions Capture The Flag.", en: "National information systems security authority, created by law n°2018-026. Awareness, strategy and Capture The Flag competitions." },
    "eco.cy2.p": {
      fr: "Équipe togolaise de compétition Capture The Flag (CTF) en cybersécurité, aux résultats internationaux vérifiables : 1ʳᵉ place au Hackerlab CTF 2025, 2ᵉ place aux qualifications Cyberlympics CTF 2023 (54 pays africains éligibles), 3ᵉ place au Sub-Saharan CTF 2023 (150+ équipes), 4ᵉ place à l'ECOWAS CTF 2024 et au picoCTF Afrique 2025, 73ᵉ place sur 2968 équipes au NahamCon CTF 2025.",
      en: "Togolese Capture The Flag (CTF) cybersecurity competition team, with verifiable international results: 1st place at Hackerlab CTF 2025, 2nd place at Cyberlympics CTF 2023 qualifiers (54 eligible African countries), 3rd place at Sub-Saharan CTF 2023 (150+ teams), 4th place at ECOWAS CTF 2024 and picoCTF Africa 2025, 73rd out of 2,968 teams at NahamCon CTF 2025.",
    },
    "eco.cy3.p": { fr: "Centre national de réponse aux incidents de cybersécurité, opéré par Cyber Defense Africa pour le compte de l'ANCy.", en: "National cybersecurity incident response center, operated by Cyber Defense Africa on behalf of the ANCy." },
    "eco.cy4.h4": { fr: "IPDCP — Instance de Protection des Données à Caractère Personnel", en: "IPDCP — Personal Data Protection Authority" },
    "eco.cy4.p": { fr: "Autorité administrative indépendante chargée de contrôler le respect de la loi sur les données personnelles, créée par la loi n°2019-014 et opérationnalisée en 2024-2025.", en: "Independent administrative authority responsible for overseeing compliance with the personal data law, created by law n°2019-014 and made operational in 2024-2025." },
    "eco.cy5.p": { fr: "Régulateur des communications électroniques et des postes. Depuis la loi n°2022-009, partage avec l'ANCy la compétence d'accréditation des prestataires de services de confiance.", en: "Regulator of electronic communications and postal services. Since law n°2022-009, shares with the ANCy the authority to accredit trusted service providers." },
    "eco.cy6.h4": { fr: "Loi n°2019-014 relative à la protection des données à caractère personnel", en: "Law n°2019-014 on the protection of personal data" },
    "eco.cy6.p": { fr: "Cadre juridique togolais régissant la collecte, le traitement et la protection des données personnelles ; base légale de l'IPDCP.", en: "Togolese legal framework governing the collection, processing and protection of personal data; the IPDCP's legal basis." },
    "eco.cy7.p": {
      fr: 'Société publique-privée mandatée par l\'ANCy pour sécuriser les systèmes d\'information de l\'État et opérer le CERT.tg. Organise les « Cafés de la Cybersécurité », rencontres trimestrielles de professionnels.',
      en: 'Public-private company mandated by the ANCy to secure the State\'s information systems and operate CERT.tg. Organizes the "Cybersecurity Cafés," quarterly gatherings of professionals.',
    },
    "eco.cy8.h4": { fr: "Sommet de la Cybersécurité de Lomé (2022)", en: "Lomé Cybersecurity Summit (2022)" },
    "eco.cy8.p": {
      fr: 'Premier sommet africain de chefs d\'État sur la cybersécurité, coorganisé avec la Commission économique des Nations Unies pour l\'Afrique, ayant abouti à la « Déclaration de Lomé ».',
      en: 'First African summit of heads of state on cybersecurity, co-organized with the United Nations Economic Commission for Africa, which resulted in the "Lomé Declaration."',
    },
    "eco.cy9.h4": { fr: "Forum International sur la Protection des Données à Caractère Personnel (FIPDCP)", en: "International Forum on Personal Data Protection (FIPDCP)" },
    "eco.cy9.p": { fr: "Forum togolais dédié à la protection des données personnelles ; 2ᵉ édition prévue en juillet 2026 à Lomé.", en: "Togolese forum dedicated to personal data protection; 2nd edition planned for July 2026 in Lomé." },

    "eco.res.h2": { fr: "Ressources francophones en ligne", en: "French-language online resources" },
    "eco.r1.p": { fr: "Cours structurés en français, du développement web à la data.", en: "Structured courses in French, from web development to data." },
    "eco.r2.h4": { fr: "MDN Web Docs (français)", en: "MDN Web Docs (French)" },
    "eco.r2.p": { fr: "Référence technique pour HTML, CSS et JavaScript.", en: "Technical reference for HTML, CSS and JavaScript." },
    "eco.r3.p": { fr: "Parcours gratuits et certifiants en programmation, avec communauté active.", en: "Free, certifying programming tracks, with an active community." },
    "eco.r4.p": { fr: "Plateforme française de tutoriels vidéo pour apprendre le développement web : HTML/CSS/JS, PHP, Laravel, React.", en: "French video tutorial platform for learning web development: HTML/CSS/JS, PHP, Laravel, React." },
    "eco.r5.p": { fr: "Communauté francophone de développeurs : forums, tutoriels et actualités couvrant la plupart des langages de programmation.", en: "French-speaking developer community: forums, tutorials and news covering most programming languages." },
    "eco.r6.p": { fr: "Plateforme associative et gratuite de partage de connaissances, avec une section importante dédiée à la programmation et à l'algorithmique.", en: "Free, community-run knowledge-sharing platform, with a large section dedicated to programming and algorithms." },
    "eco.r7.p": { fr: "Référence francophone depuis les années 2000 pour les tutoriels HTML, CSS, JavaScript et les standards du web.", en: "French-language reference since the 2000s for HTML, CSS, JavaScript tutorials and web standards." },
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
