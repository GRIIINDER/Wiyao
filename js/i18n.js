(function () {
  "use strict";

  const STORAGE_KEY = "wiyao-lang";

  // Traductions des liens de nav/footer, indexées par href : partagées par
  // toutes les pages sans avoir à taguer chaque lien individuellement.
  const BY_HREF = {
    "proposer.html": { fr: "Proposer un contenu", en: "Suggest content" },
    "test-orientation.html": { fr: "Test d'orientation", en: "Orientation test" },
    "roadmaps.html": { fr: "Roadmaps", en: "Roadmaps" },
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
    { selector: "#nav-parcours .nav-more-toggle", fr: "Parcours ▾", en: "Journey ▾" },
    { selector: "#nav-opportunites .nav-more-toggle", fr: "Opportunités ▾", en: "Opportunities ▾" },
    { selector: "#nav-communaute .nav-more-toggle", fr: "Communauté ▾", en: "Community ▾" },
    { selector: "#nav-contact .nav-more-toggle", fr: "Contact ▾", en: "Contact ▾" },
    { selector: "#nav-parcours .nav-group-label", fr: "Parcours", en: "Journey" },
    { selector: "#nav-opportunites .nav-group-label", fr: "Opportunités", en: "Opportunities" },
    { selector: "#nav-communaute .nav-group-label", fr: "Communauté", en: "Community" },
    { selector: "#nav-contact .nav-group-label", fr: "Contact", en: "Contact" },
    { selector: ".skip-link", fr: "Aller au contenu", en: "Skip to content" },
  ];

  // Titres d'onglet, repérés par leur texte français (la 404 s'affiche à
  // n'importe quelle adresse). Celui d'une roadmap est posé par app.js.
  const TITLES = {
    "WIYAO - Le guide qui accompagne ton parcours tech au Togo": "WIYAO - The guide that walks you through your tech path in Togo",
    "Roadmaps - WIYAO": "Roadmaps - WIYAO",
    "Test d'orientation - WIYAO": "Orientation test - WIYAO",
    "Écoles & universités - WIYAO": "Schools & universities - WIYAO",
    "Calendrier des dates clés - WIYAO": "Key dates calendar - WIYAO",
    "Bourses & financement - WIYAO": "Scholarships & funding - WIYAO",
    "Stages & emploi - WIYAO": "Internships & jobs - WIYAO",
    "Écosystème tech togolais - WIYAO": "Togolese tech ecosystem - WIYAO",
    "Actualités - WIYAO": "News - WIYAO",
    "Convaincs tes parents - WIYAO": "Convince your parents - WIYAO",
    "FAQ - WIYAO": "FAQ - WIYAO",
    "Contact - WIYAO": "Contact - WIYAO",
    "Proposer un contenu - WIYAO": "Suggest content - WIYAO",
    "Recherche - WIYAO": "Search - WIYAO",
    "Page introuvable - WIYAO": "Page not found - WIYAO",
    "À propos & méthodologie - WIYAO": "About & methodology - WIYAO",
    "Mentions légales - WIYAO": "Legal notice - WIYAO",
    "Politique de confidentialité - WIYAO": "Privacy policy - WIYAO",
    "Conditions d'utilisation - WIYAO": "Terms of use - WIYAO",
  };
  let titleFr = null;

  // Contenu propre à index.html (hero + parcours en 6 étapes), repéré par
  // data-i18n-key posé directement dans le HTML de cette page.
  const PAGE_CONTENT = {
    "hero.title": {
      fr: 'Trace ton <span class="hero-accent">parcours tech</span> au Togo',
      en: 'Chart your <span class="hero-accent">tech path</span> in Togo',
    },
    "hero.subtitle": { fr: "De l'orientation au premier emploi, WIYAO éclaire chaque étape de ton parcours dans le numérique : choix du domaine, de la filière et de l'établissement, roadmaps métier, bourses et stages, à Lomé comme dans tout le Togo.", en: "From orientation to your first job, WIYAO sheds light on every stage of your path into tech: choosing a field, a program and an institution, career roadmaps, scholarships and internships, in Lomé and across Togo." },
    "hero.cta": {
      fr: "Faire le test d'orientation",
      en: "Take the orientation test",
    },
    // Bandeau défilant de l'accueil (décoratif) et son bouton pause.
    "marquee.orientation": { fr: "Orientation", en: "Guidance" },
    "marquee.roadmaps": { fr: "Roadmaps", en: "Roadmaps" },
    "marquee.ecoles": { fr: "Écoles", en: "Schools" },
    "marquee.calendrier": { fr: "Calendrier", en: "Calendar" },
    "marquee.bourses": { fr: "Bourses", en: "Scholarships" },
    "marquee.stages": { fr: "Stages", en: "Internships" },
    "marquee.ecosysteme": { fr: "Écosystème", en: "Ecosystem" },
    "marquee.pause": { fr: "Mettre en pause le bandeau défilant", en: "Pause the scrolling banner" },
    // Bandeaux des autres pages (ceux de l'Écosystème et de Témoignages
    // reprennent les clés de leurs rubriques).
    "marquee.dom.dev": { fr: "Développement", en: "Development" },
    "marquee.dom.data": { fr: "Data &amp; IA", en: "Data &amp; AI" },
    "marquee.dom.secu": { fr: "Sécurité", en: "Security" },
    "marquee.dom.produit": { fr: "Produit &amp; Design", en: "Product &amp; Design" },
    "marquee.dom.infra": { fr: "Infrastructure &amp; DevOps", en: "Infrastructure &amp; DevOps" },
    "marquee.dom.marketing": { fr: "Marketing digital", en: "Digital Marketing" },
    "marquee.dom.gestion": { fr: "Gestion &amp; Management", en: "Management" },
    "marquee.quiz.questions": { fr: "14 questions", en: "14 questions" },
    "marquee.quiz.domaine": { fr: "Ton domaine", en: "Your domain" },
    "marquee.quiz.metier": { fr: "Ton métier", en: "Your career" },
    "marquee.quiz.ecoles": { fr: "Tes écoles", en: "Your schools" },
    "marquee.ecoles.filieres": { fr: "Filières", en: "Programs" },
    "marquee.ecoles.niveaux": { fr: "Niveaux", en: "Levels" },
    "marquee.ecoles.admission": { fr: "Admission", en: "Admission" },
    "marquee.ecoles.frais": { fr: "Frais de scolarité", en: "Tuition fees" },
    "marquee.ecoles.bac": { fr: "Série du bac", en: "Bac stream" },
    "marquee.ecoles.lexique": { fr: "Lexique", en: "Glossary" },
    "marquee.cal.candidatures": { fr: "Candidatures", en: "Applications" },
    "marquee.cal.clotures": { fr: "Clôtures", en: "Deadlines" },
    "marquee.cal.concours": { fr: "Concours", en: "Entrance exams" },
    "marquee.cal.resultats": { fr: "Résultats", en: "Results" },
    "marquee.cal.rentrees": { fr: "Rentrées", en: "Start of term" },
    "marquee.bourses.ecoles": { fr: "Bourses des écoles", en: "School scholarships" },
    "marquee.bourses.etat": { fr: "Bourse d'État", en: "State scholarship" },
    "marquee.bourses.banque": { fr: "Financement bancaire", en: "Bank financing" },
    "marquee.bourses.inter": { fr: "Bourses internationales", en: "International scholarships" },
    "marquee.bourses.gratuit": { fr: "Formations sans frais", en: "Tuition-free training" },
    "marquee.stages.plateformes": { fr: "Plateformes d'emploi", en: "Job platforms" },
    "marquee.stages.employeurs": { fr: "Employeurs", en: "Employers" },
    "marquee.stages.ressources": { fr: "Ressources locales", en: "Local resources" },
    "marquee.stages.decrocher": { fr: "Décrocher un stage", en: "Landing an internship" },
    "marquee.actu.evenements": { fr: "Événements", en: "Events" },
    "marquee.actu.formations": { fr: "Formations", en: "Training" },
    "marquee.actu.education": { fr: "Éducation", en: "Education" },
    "marquee.actu.startups": { fr: "Startups", en: "Startups" },
    "marquee.actu.ecosysteme": { fr: "Écosystème", en: "Ecosystem" },
    "marquee.actu.cyber": { fr: "Cybersécurité", en: "Cybersecurity" },
    "marquee.actu.gouvernement": { fr: "Gouvernement", en: "Government" },
    "marquee.faq.wiyao": { fr: "WIYAO", en: "WIYAO" },
    "marquee.faq.frais": { fr: "Frais", en: "Fees" },
    "marquee.contact.question": { fr: "Une question&nbsp;?", en: "A question?" },
    "marquee.contact.correction": { fr: "Une correction&nbsp;?", en: "A correction?" },
    "marquee.contact.ecris": { fr: "Écris-nous", en: "Write to us" },
    "marquee.proposer.ecole": { fr: "Une école", en: "A school" },
    "marquee.proposer.entreprise": { fr: "Une entreprise", en: "A company" },
    "marquee.proposer.communaute": { fr: "Une communauté", en: "A community" },
    "marquee.proposer.evenement": { fr: "Un événement", en: "An event" },
    "marquee.proposer.verifie": { fr: "On vérifie", en: "We check" },
    "marquee.proposer.ajoute": { fr: "On ajoute", en: "We add" },
    // Pages de lecture, 404 et recherche (À propos et Mentions légales
    // reprennent les clés de leurs rubriques).
    "marquee.conf.collecte": { fr: "Collecte de données", en: "Data collection" },
    "marquee.conf.base": { fr: "Base légale", en: "Legal basis" },
    "marquee.conf.droits": { fr: "Tes droits", en: "Your rights" },
    "marquee.conf.conservation": { fr: "Conservation", en: "Retention" },
    "marquee.conf.securite": { fr: "Sécurité", en: "Security" },
    "marquee.conf.mineurs": { fr: "Mineurs", en: "Minors" },
    "marquee.conf.cookies": { fr: "Cookies", en: "Cookies" },
    "marquee.conf.ipdcp": { fr: "IPDCP", en: "IPDCP" },
    "marquee.cgu.services": { fr: "Informations et services", en: "Information and services" },
    "marquee.cgu.conduite": { fr: "Règles de conduite", en: "Rules of conduct" },
    "marquee.cgu.responsabilite": { fr: "Garanties et responsabilité", en: "Warranties and liability" },
    "marquee.cgu.propriete": { fr: "Propriété intellectuelle", en: "Intellectual property" },
    "marquee.cgu.liens": { fr: "Liens et contenus tiers", en: "Third-party links and content" },
    "marquee.cgu.droit": { fr: "Droit applicable", en: "Governing law" },
    "marquee.404.code": { fr: "404", en: "404" },
    "marquee.search.test": { fr: "Test d'orientation", en: "Orientation test" },
    "marquee.search.ecoles": { fr: "Écoles &amp; universités", en: "Schools &amp; universities" },
    "marquee.search.bourses": { fr: "Bourses &amp; financement", en: "Scholarships &amp; funding" },
    "marquee.search.stages": { fr: "Stages &amp; emploi", en: "Internships &amp; jobs" },
    "marquee.search.eco": { fr: "Écosystème togolais", en: "Togolese ecosystem" },
    "marquee.search.actu": { fr: "Actualités", en: "News" },
    "marquee.search.temoin": { fr: "Témoignages", en: "Testimonials" },
    "marquee.search.faq": { fr: "FAQ", en: "FAQ" },
    "hero.guide": { fr: "Première visite ? Découvre en trente secondes <a href=\"about.html\">ce qu'est WIYAO</a>.", en: "First visit? Discover <a href=\"about.html\">what WIYAO is</a> in thirty seconds." },
    "roadmap.print": { fr: "Imprimer / PDF", en: "Print / PDF" },
    "roadmap.reset": { fr: "Réinitialiser la progression", en: "Reset progress" },
    "quiz.primer.title": { fr: "L'informatique, en 7 grands domaines", en: "Tech, in 7 major domains" },
    "quiz.primer.show": { fr: "Voir les 7 domaines", en: "See the 7 domains" },
    "quiz.primer.hide": { fr: "Masquer", en: "Hide" },
    "quiz.primer.desc": {
      fr: "Un aperçu rapide si tu veux t'y repérer : pas besoin de tout connaître par cœur, c'est justement le rôle du test de t'aider à t'y retrouver. Chaque domaine est une catégorie mondiale du secteur tech  ; la dernière ligne de chaque carte, marquée d'un repère, précise sa présence concrète sur le marché togolais.",
      en: "A quick overview if you want your bearings: no need to know it all by heart, that's exactly what the test is here to help you sort out. Each domain is a worldwide tech-sector category; the last line of each card, marked with a pin, points to its concrete presence on the Togolese market.",
    },
    "roadmaps.hero.title": {
      fr: 'Choisis ta <span class="hero-accent">roadmap</span>',
      en: 'Choose your <span class="hero-accent">roadmap</span>',
    },
    "roadmaps.hero.subtitle": { fr: "Une roadmap trace, étape par étape, le chemin d'apprentissage d'un métier ou d'une compétence. WIYAO en propose 89, 60 métiers et 29 compétences tech, chacune adossée à des ressources vérifiées, togolaises comme internationales.", en: "A roadmap charts, step by step, the learning path toward a role or a skill. WIYAO offers 89 of them, 60 roles and 29 tech skills, each grounded in verified resources, both Togolese and international." },
    "roadmaps.hero.propose": { fr: "Un métier ou une compétence manque à l'appel ? <a href=\"proposer.html\">Propose-le</a> : nous le vérifions avant de l'ajouter.", en: "Is a role or a skill missing? <a href=\"proposer.html\">Suggest it</a>: we verify it before adding it." },
    "roadmaps.parmetier.h2": { fr: "Roadmaps par métier", en: "Roadmaps by role" },
    "roadmaps.parmetier.desc": { fr: "Le chemin complet à suivre pour viser un rôle donné.", en: "The full path to follow to aim for a given role." },
    "roadmaps.parcompetence.h2": { fr: "Roadmaps par compétence", en: "Roadmaps by skill" },
    "roadmaps.parcompetence.desc": { fr: "Une compétence précise à maîtriser, utile pour plusieurs métiers.", en: "A specific skill to master, useful across several roles." },
    "roadmaps.noresults": { fr: "Aucune roadmap dans ce domaine pour l'instant. Choisis « Tous » pour tout voir.", en: "No roadmap in this field yet. Pick “All” to see everything." },
    "roadmaps.filter.all": { fr: "Tous", en: "All" },
    "roadmaps.filter.dev": { fr: "Développement", en: "Development" },
    "roadmaps.filter.data": { fr: "Data &amp; IA", en: "Data &amp; AI" },
    "roadmaps.filter.securite": { fr: "Sécurité", en: "Security" },
    "roadmaps.filter.produit": { fr: "Produit &amp; Design", en: "Product &amp; Design" },
    "roadmaps.filter.infra": { fr: "Infrastructure &amp; DevOps", en: "Infrastructure &amp; DevOps" },
    "roadmaps.filter.marketing": { fr: "Marketing digital", en: "Digital Marketing" },
    "roadmaps.filter.gestion": { fr: "Gestion &amp; Management", en: "Management" },
    "journey.title": { fr: "Le parcours WIYAO, dans l'ordre", en: "The WIYAO journey, in order" },
    "journey.desc": {
      fr: "Pas besoin de tout faire d'un coup : voici dans quel ordre avancer, étape par étape.",
      en: "No need to do everything at once: here's the order to move through, step by step.",
    },
    "journey.1.title": { fr: "Découvre ton domaine", en: "Discover your field" },
    "journey.1.desc": {
      fr: "Pas sûr·e de ta voie ? Le test d'orientation identifie en 14 questions le domaine tech, et le métier précis, qui te correspond.",
      en: "Not sure which path? The orientation test identifies the tech field, and the specific role, that suits you in 14 questions.",
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
      fr: 'Compare 32 écoles et universités togolaises : filières, niveaux, admission, frais de scolarité, et les <a href="bourses-financement.html">bourses disponibles</a> pour les alléger.',
      en: 'Compare 32 Togolese schools and universities: programs, levels, admission, tuition fees, and the <a href="bourses-financement.html">scholarships available</a> to ease them.',
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
      fr: "Communautés, hubs et événements togolais : utile à chaque étape, pas seulement à la fin du parcours.",
      en: "Togolese communities, hubs and events: useful at every step, not just at the end of the journey.",
    },
    "journey.6.link": { fr: "Découvrir l'écosystème togolais →", en: "Discover the Togolese ecosystem →" },

    "ecoles.hero.title": {
      fr: 'Trouve l\'<span class="hero-accent">école</span> qu\'il te faut',
      en: 'Find the <span class="hero-accent">school</span> that\'s right for you',
    },
    "ecoles.hero.subtitle": { fr: "32 écoles et universités togolaises qui forment à l'informatique et au numérique, présentées avec leurs filières, leurs niveaux d'études, leurs conditions d'admission et leurs frais, pour comparer en connaissance de cause.", en: "32 Togolese schools and universities that teach computing and digital technology, presented with their programs, levels of study, admission requirements and fees, so you can compare them with full knowledge." },
    "ecoles.hero.propose": { fr: "Une école togolaise manque à l'appel ? <a href=\"proposer.html\">Propose-la</a> : nous la vérifions avant de l'ajouter.", en: "Is a Togolese school missing? <a href=\"proposer.html\">Suggest it</a>: we verify it before adding it." },

    "calendrier.hero.title": {
      fr: 'Ne rate pas ta <span class="hero-accent">date limite</span>',
      en: 'Don\'t miss your <span class="hero-accent">deadline</span>',
    },
    "calendrier.hero.subtitle": { fr: "Le calendrier type d'une candidature au Togo, suivi des dates connues établissement par établissement. Une inscription manquée coûte souvent une année entière : avant tout engagement, vérifie chaque date directement auprès de l'école.", en: "The typical application calendar in Togo, followed by the known dates for each institution. A missed registration often costs a full year: before committing, confirm every date directly with the school." },
    "calendrier.section1.title": { fr: "Le calendrier type", en: "The typical calendar" },
    "calendrier.section1.desc": {
      fr: "Un repère général : chaque établissement a son propre calendrier, parfois différent.",
      en: "A general guide: each school has its own calendar, sometimes different.",
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
    "bourses.hero.subtitle": { fr: "Le coût des études ne devrait pas décider de ton avenir. Voici les bourses, réductions et solutions de financement réelles et vérifiées auxquelles peuvent prétendre les bacheliers et bachelières du Togo, y compris celles des écoles.", en: "The cost of studying should not decide your future. Here are the real, verified scholarships, discounts and funding options available to Togolese high-school graduates, including those offered by the schools themselves." },

    "stages.hero.title": {
      fr: 'Et après la <span class="hero-accent">formation</span> ?',
      en: 'What comes after <span class="hero-accent">training</span>?',
    },
    "stages.hero.subtitle": { fr: "Où chercher un stage ou un premier emploi dans la tech au Togo, et comment mettre toutes les chances de ton côté. Cette page recense des ressources durables plutôt que des offres ponctuelles, trop éphémères pour rester fiables : pour celles-ci, consulte les plateformes présentées ci-dessous.", en: "Where to look for an internship or a first tech job in Togo, and how to give yourself every chance of success. This page lists lasting resources rather than individual openings, which are too short-lived to stay reliable here: for those, turn to the platforms presented below." },
    "stages.hero.propose": { fr: "Une entreprise togolaise qui recrute manque à l'appel ? <a href=\"proposer.html\">Propose-la</a> : nous la vérifions avant de l'ajouter.", en: "Is a hiring Togolese company missing? <a href=\"proposer.html\">Suggest it</a>: we verify it before adding it." },

    "quiz.hero.title": {
      fr: 'Pas sûr·e de ta <span class="hero-accent">voie</span> ?',
      en: 'Not sure about your <span class="hero-accent">path</span>?',
    },
    "quiz.hero.subtitle": { fr: "En 14 questions, ce test identifie le domaine tech qui te correspond, puis le métier le plus cohérent avec tes réponses, et enfin les écoles togolaises adaptées à ton niveau, à ta ville et à ton budget : non pas une étiquette vague, mais un véritable point de départ.", en: "In 14 questions, this test identifies the tech field that suits you, then the role most consistent with your answers, and finally the Togolese schools matched to your level, city and budget: not a vague label, but a genuine starting point." },
    "quiz.hero.faq": { fr: "Tu t'interroges sur la méthode d'orientation ? Consulte la <a href=\"faq.html#orientation\">FAQ orientation &amp; roadmaps</a>.", en: "Curious about how the orientation works? See the <a href=\"faq.html#orientation\">orientation &amp; roadmaps FAQ</a>." },

    "eco.hero.title": {
      fr: 'Écosystème tech <span class="hero-accent">togolais</span>',
      en: 'Togolese tech <span class="hero-accent">ecosystem</span>',
    },
    "eco.hero.subtitle": { fr: "Écoles, communautés, pôles d'innovation et institutions : les acteurs à connaître pour bâtir une carrière dans la tech au Togo.", en: "Schools, communities, innovation hubs and institutions: the key players to know when building a tech career in Togo." },
    "eco.hero.guide": { fr: "Tu cherches une école ? Consulte la page « <a href=\"ecoles.html\">Écoles &amp; universités</a> ». Tu développes et cherches un réseau ? Rejoins les « Communautés et événements ». Tu portes un projet et cherches un accompagnement ? Explore les « Hubs et incubateurs ».", en: "Looking for a school? Visit the \"<a href=\"ecoles.html\">Schools &amp; universities</a>\" page. A developer seeking a network? Join the \"Communities and events\". A founder seeking support? Explore the \"Hubs and incubators\"." },
    "eco.hero.propose": { fr: "Une communauté ou un événement tech togolais manque à l'appel ? <a href=\"proposer.html\">Propose-le</a> : nous le vérifions avant de l'ajouter.", en: "Is a Togolese tech community or event missing? <a href=\"proposer.html\">Suggest it</a>: we verify it before adding it." },
    "eco.jump.communautes": { fr: "Communautés &amp; événements", en: "Communities &amp; events" },
    "eco.jump.femmes": { fr: "Femmes dans la tech", en: "Women in tech" },
    "eco.jump.hubs": { fr: "Hubs &amp; incubateurs", en: "Hubs &amp; incubators" },
    "eco.jump.startups": { fr: "Startups togolaises", en: "Togolese startups" },
    "eco.jump.institutions": { fr: "Institutions &amp; employeurs", en: "Institutions &amp; employers" },
    "eco.jump.cybersecurite": { fr: "Cybersécurité &amp; gouvernance", en: "Cybersecurity &amp; governance" },
    "eco.jump.ressources": { fr: "Ressources en ligne", en: "Online resources" },

    "actu.hero.title": {
      fr: 'Ce qui se passe dans la <span class="hero-accent">tech togolaise</span>',
      en: 'What\'s happening in <span class="hero-accent">Togolese tech</span>',
    },
    "actu.hero.subtitle": { fr: "Événements, lancements, startups, financements : les faits marquants de l'écosystème, sourcés et datés. Aucun flux automatique ici : chaque entrée est vérifiée à la main et accompagnée de sa source.", en: "Events, launches, startups, funding: the ecosystem's notable developments, sourced and dated. No automated feed here: every entry is verified by hand and accompanied by its source." },
    "actu.hero.guide": { fr: "Dernière mise à jour : 9 novembre 2026.", en: "Last updated: November 9, 2026." },
    "actu.hero.propose": { fr: "Une actualité ou un événement tech togolais manque à l'appel ? <a href=\"proposer.html\">Propose-le</a> : nous le vérifions avant de l'ajouter.", en: "Is a Togolese tech event or news item missing? <a href=\"proposer.html\">Suggest it</a>: we verify it before adding it." },
    "actu.meta.date": { fr: "Date", en: "Date" },
    "actu.meta.category": { fr: "Catégorie", en: "Category" },
    "actu.readSource": { fr: "Lire la source", en: "Read source" },
    "actu.t14.date": { fr: "Inscriptions prolongées jusqu'au 30 septembre 2026", en: "Registration extended until September 30, 2026" },
    "actu.t14.h3": { fr: "Nana Tech Tour : une tournée nationale pour les jeunes femmes du numérique", en: "Nana Tech Tour: a national tour for young women in tech" },
    "actu.t14.p": {
      fr: "Tournée nationale du programme gouvernemental Nana Tech pour développer les compétences numériques\n             des jeunes femmes dans six villes : Lomé, Aného, Sokodé, Kpalimé, Atakpamé et Kara. Certificat de\n             participation pour toutes, parcours de formation certifiante offert aux meilleures. Portée par le\n             ministère de l'Efficacité du Service Public et de la Transformation Numérique, avec Djanta Tech\n             Hub, la coopération allemande (GIZ), l'Union européenne, le Luxembourg, Digital Girl, GDG Lomé,\n             RedTeam-TG et Women Techmakers Lomé.",
      en: "National tour of the government's Nana Tech program to build digital skills among young women across six cities: Lomé, Aného, Sokodé, Kpalimé, Atakpamé and Kara. A participation certificate for everyone, with a certifying training track offered to the best participants. Run by the Ministry of Public Service Efficiency and Digital Transformation, with Djanta Tech Hub, German cooperation (GIZ), the European Union, Luxembourg, Digital Girl, GDG Lomé, RedTeam-TG and Women Techmakers Lomé.",
    },
    "actu.t14.cat": { fr: "Formation", en: "Training" },
    "actu.t23.date": { fr: "Samedi 12 décembre 2026, 8h30-16h30, Lomé (lieu pas encore annoncé)", en: "Saturday, December 12, 2026, 8:30am-4:30pm, Lomé (venue not announced yet)" },
    "actu.t23.h3": { fr: "DevFest Lomé 2026 : l'IA et l'agritech au programme, le 12 décembre", en: "DevFest Lomé 2026: AI and agritech on the agenda, December 12" },
    "actu.t23.p": { fr: "GDG Lomé, la communauté locale des Google Developer Groups, tient sa conférence annuelle le samedi 12 décembre 2026, sur le thème « Bâtir l'avenir de l'Agritech » : conférences et démonstrations sur l'intelligence artificielle et l'agritech, ateliers pratiques avec les outils Google (cloud, Android, Flutter, Firebase, web), projets de la communauté et pistes de carrière. Ouvert aux étudiants comme aux développeurs, entrepreneurs et curieux. L'inscription est gratuite mais obligatoire, sur la page de l'événement (500 places). Le lieu n'est pas encore annoncé. La page prévoit aussi une seconde journée consacrée au réseautage (panels, échanges avec des experts), sans en donner la date.", en: "GDG Lomé, the local Google Developer Groups community, holds its annual conference on Saturday, December 12, 2026, themed “Bâtir l'avenir de l'Agritech” (Building the future of agritech): talks and demos on artificial intelligence and agritech, hands-on workshops with Google tools (cloud, Android, Flutter, Firebase, web), community projects and career opportunities. Open to students as well as developers, entrepreneurs and anyone curious. Registration is free but required, on the event page (500 seats). The venue has not been announced yet. The page also mentions a second day devoted to networking (panels, conversations with experts), without giving its date." },
    "actu.t23.cat": { fr: "Événement", en: "Event" },
    "actu.t22.date": { fr: "Du 5 au 7 novembre 2026, Lomé", en: "November 5-7, 2026, Lomé" },
    "actu.t22.h3": { fr: "Afric'innov fête ses dix ans à Lomé, du 5 au 7 novembre 2026", en: "Afric'innov celebrates its tenth anniversary in Lomé, November 5-7, 2026" },
    "actu.t22.p": {
      fr: "Le réseau Afric'innov, né en 2016 avec le soutien de l'Agence française de développement (AFD), fédère plus de 130 structures d'accompagnement des entrepreneurs (incubateurs, accélérateurs) dans 26 pays africains. Son sommet des dix ans a réuni environ 200 participants du Togo et de 17 autres pays à Lomé, autour d'une question : comment accompagner les entrepreneurs à l'ère de l'intelligence artificielle ? Les travaux devaient aboutir le 7 novembre à un « Manifeste de Lomé », suivi d'une feuille de route (expérimentations, initiative AIready, label qualité) et d'un livre blanc.",
      en: "Afric'innov, a network founded in 2016 with support from the French Development Agency (AFD), brings together more than 130 entrepreneur support organizations (incubators, accelerators) in 26 African countries. Its tenth-anniversary summit gathered about 200 participants from Togo and 17 other countries in Lomé, around one question: how to support entrepreneurs in the age of artificial intelligence? The work was to result on November 7 in a \"Lomé Manifesto\", followed by a roadmap (pilots, the AIready initiative, a quality label) and a white paper.",
    },
    "actu.t22.cat": { fr: "Événement", en: "Event" },
    "actu.t24.date": { fr: "Présenté le 3 novembre 2026, inscriptions ouvertes", en: "Presented on November 3, 2026, registration open" },
    "actu.t24.h3": { fr: "SIFA : une formation gratuite aux métiers du numérique pour les 18-35 ans", en: "SIFA: free training in digital careers for 18-35-year-olds" },
    "actu.t24.p": { fr: "Le ministère de l'Éducation nationale présente le programme SIFA (Skills Initiative for Africa), porté par l'Union africaine (AUDA-NEPAD), financé par l'Allemagne (KfW) et opéré au Togo par SAYNA. Il est gratuit et ouvert aux jeunes Togolais de 18 à 35 ans, en trois étapes : une formation en ligne sur la plateforme SAYNA, avec un accompagnement en présentiel dans une quinzaine de hubs (Lomé, Kpalimé, Atakpamé, Sokodé, Kara, Dapaong), dans 10 métiers du numérique (marketing digital, design UX/UI, développement web, WordPress, annotation de données, assistanat virtuel…) ; une certification par un portfolio de projets ; puis une mise en relation avec des entreprises (stages, missions freelance, emplois). Objectif : 1 000 jeunes insérés avant fin 2027. Inscription sur app.sayna.io ou dans un hub partenaire.", en: "The Ministry of National Education presents the SIFA program (Skills Initiative for Africa), led by the African Union (AUDA-NEPAD), funded by Germany (KfW) and run in Togo by SAYNA. It is free and open to young Togolese aged 18 to 35, in three steps: online training on the SAYNA platform, with in-person support in about fifteen hubs (Lomé, Kpalimé, Atakpamé, Sokodé, Kara, Dapaong), in 10 digital careers (digital marketing, UX/UI design, web development, WordPress, data annotation, virtual assistance…); certification through a project portfolio; then connections with companies (internships, freelance missions, jobs). Goal: 1,000 young people in work by the end of 2027. Sign up at app.sayna.io or at a partner hub." },
    "actu.t24.cat": { fr: "Formation", en: "Training" },
    "actu.t21.date": { fr: "Vendredi 30 octobre 2026, UniPod (Université de Lomé)", en: "Friday, October 30, 2026, UniPod (University of Lomé)" },
    "actu.t21.h3": { fr: "D-CLIC : 501 jeunes terminent la 3ᵉ cohorte de formation au numérique", en: "D-CLIC: 501 young people complete the 3rd digital training cohort" },
    "actu.t21.p": {
      fr: "Le 30 octobre 2026, à l'UniPod de l'Université de Lomé, 501 bénéficiaires de la 3ᵉ cohorte du programme « D-CLIC, formez-vous au numérique avec l'OIF » et d'une cohorte spéciale formée dans les centres CLAC ont reçu leur attestation, après environ quatre mois de formation. Six domaines : développement web et mobile, intelligence artificielle, analyse et protection des données, design graphique et fabrication numérique, communication et marketing digital, animation de communautés. Le programme est financé par l'Organisation internationale de la Francophonie et mené par l'incubateur CUBE, qui vise d'abord l'insertion professionnelle (emploi ou création d'entreprise). La prochaine cohorte n'est pas encore annoncée.",
      en: "On October 30, 2026, at the UniPod of the University of Lomé, 501 participants of the 3rd cohort of the program \"D-CLIC, train in digital skills with the OIF\" and of a special cohort trained in the CLAC centers received their certificates, after about four months of training. Six fields: web and mobile development, artificial intelligence, data analysis and protection, graphic design and digital fabrication, digital communication and marketing, community management. The program is funded by the International Organisation of La Francophonie and run by the CUBE incubator, whose main goal is getting people into work (a job or starting a business). The next cohort has not been announced yet.",
    },
    "actu.t21.cat": { fr: "Formation", en: "Training" },
    "actu.t20.date": { fr: "Phase pilote annoncée le 6 octobre 2026", en: "Pilot phase announced on October 6, 2026" },
    "actu.t20.h3": { fr: "Voix du Togo : une plateforme pour apprendre les langues nationales à l'IA", en: "Voice of Togo (Voix du Togo): a platform to teach national languages to AI" },
    "actu.t20.p": {
      fr: "Le ministère de l'Efficacité du Service Public et de la Transformation Numérique, avec l'appui du PNUD, a lancé la phase pilote de « Voix du Togo » : collecter des enregistrements, transcriptions et traductions pour entraîner des modèles d'IA qui comprennent et parlent les langues togolaises, afin que chacun puisse accéder aux services publics, à la santé ou à la justice dans sa langue. Le pilote porte sur le kabyè, l'éwé et le moba ; l'objectif à terme est une cinquantaine de langues. Pour participer : crée un compte avec ton numéro de téléphone sur voixdutogo.gouv.tg, indique les langues que tu parles, lis ou écris, puis lis des textes à voix haute, transcris, traduis ou vérifie les contributions des autres. Les contributions sont rémunérées, selon le portail officiel du gouvernement.",
      en: "The Ministry of Public Service Efficiency and Digital Transformation, with support from UNDP, has launched the pilot phase of \"Voice of Togo\" (Voix du Togo): collecting recordings, transcriptions and translations to train AI models that understand and speak Togolese languages, so that everyone can access public services, health care or justice in their own language. The pilot covers Kabiye, Ewe and Moba; the long-term goal is about fifty languages. To take part: create an account with your phone number on voixdutogo.gouv.tg, list the languages you speak, read or write, then read texts aloud, transcribe, translate or check other people's contributions. Contributions are paid, according to the government's official portal.",
    },
    "actu.t20.cat": { fr: "Gouvernement", en: "Government" },
    "actu.t19.date": { fr: "Rentrée le 26 octobre 2026, inscriptions ouvertes", en: "Starts October 26, 2026, registration open" },
    "actu.t19.h3": { fr: "ESIG Global Success : rentrée de la formation modulaire le 26 octobre 2026", en: "ESIG Global Success: modular training starts October 26, 2026" },
    "actu.t19.p": {
      fr: "Le centre de formation modulaire de l'ESIG Global Success (Lomé) a ouvert les inscriptions pour sa rentrée du 26 octobre 2026, annoncée sur l'affiche officielle de l'école. Ce sont des parcours courts et qualifiants, organisés en modules, pour se former vite, monter en compétences ou se reconvertir. Côté numérique : développement web et création de sites avec les outils IA, initiation à la data et à l'IA, maintenance informatique, réseaux et cybersécurité, marketing digital, infographie. Admission sur dossier et entretien, tarif sur devis. À ne pas confondre avec les cursus diplômants BTS, Licence et Master de l'école, dont la rentrée a eu lieu le 15 septembre. Contact : +228 79 77 36 36 ou formation@esig.tg.",
      en: "The modular training center of ESIG Global Success (Lomé) has opened registration for its October 26, 2026 intake, announced on the school's official poster. These are short, qualifying tracks organized in modules, to train quickly, upskill or change careers. On the digital side: web development and website creation with AI tools, introduction to data and AI, IT maintenance, networks and cybersecurity, digital marketing, graphic design. Admission based on application and interview, price on quote. Not to be confused with the school's BTS, Bachelor's and Master's degree programs, which started on September 15. Contact: +228 79 77 36 36 or formation@esig.tg.",
    },
    "actu.t19.cat": { fr: "Formation", en: "Training" },
    "actu.t18.date": {
      fr: "Samedi 24 octobre 2026, 9h-12h, Institute Polytechnic Defitech (Lomé)",
      en: "Saturday, October 24, 2026, 9am-12pm, Institute Polytechnic Defitech (Lomé)",
    },
    "actu.t18.h3": { fr: "GitHub Dev Days Lomé : atelier pratique GitHub Copilot", en: "GitHub Dev Days Lomé: hands-on GitHub Copilot workshop" },
    "actu.t18.p": {
      fr: "Atelier gratuit consacré à GitHub Copilot (développement assisté par l'IA), dans le cadre de la\n             série mondiale communautaire GitHub Dev Days (1ᵉʳ septembre - 31 octobre 2026). Ouvert à tous\n             niveaux : étudiants, développeurs en poste, simples curieux — l'atelier s'adapte au niveau de\n             chacun. Seul prérequis : un ordinateur portable et un compte GitHub (gratuit à créer).",
      en: "Free workshop on GitHub Copilot (AI-assisted development), part of the global community-led GitHub Dev Days series (September 1 - October 31, 2026). Open to all levels: students, working developers, the simply curious — the workshop adapts to your level. Only requirement: a laptop and a free GitHub account.",
    },
    "actu.t18.cat": { fr: "Formation", en: "Training" },
    "actu.t15.date": { fr: "5-8 octobre 2026", en: "October 5-8, 2026" },
    "actu.t15.h3": { fr: "Nana Tech : formation à l'IA pour chercheuses, enseignantes-chercheuses et doctorantes", en: "Nana Tech: AI training for women researchers, professors and PhD students" },
    "actu.t15.p": {
      fr: "Programme national Nana Tech pour accompagner la montée en compétences des femmes chercheuses\n             togolaises en intelligence artificielle, du 5 au 8 octobre 2026 à l'UniPod (Université de Lomé).\n             Deux parcours : IT (notions de code requises, Python conseillé) et non-IT (ouvert sans prérequis\n             technique, tous domaines dont santé, droit, lettres, SHS, éducation). Au programme : fondements\n             et éthique de l'IA, recherche augmentée avec des outils d'IA générative, analyse de données,\n             projets pratiques. Formation ouverte aux femmes en situation de handicap. Candidatures jusqu'au\n             29 septembre 2026.",
      en: "National Nana Tech program to support the upskilling of Togolese women researchers in artificial intelligence, October 5-8, 2026 at UniPod (University of Lomé). Two tracks: IT (coding basics required, Python recommended) and non-IT (open with no technical prerequisites, any field including health, law, humanities, social sciences, education). Program: foundations and ethics of AI, AI-augmented research with generative AI tools, data analysis, hands-on projects. Open to women with disabilities. Applications close September 29, 2026.",
    },
    "actu.t15.cat": { fr: "Formation", en: "Training" },
    "actu.t16.date": { fr: "Inscriptions du 1ᵉʳ au 30 septembre 2026", en: "Registration September 1-30, 2026" },
    "actu.t16.h3": { fr: "Fata recrute ses ambassadeurs togolais pour la cohorte 2027", en: "Fata recruits its Togolese ambassadors for the 2027 cohort" },
    "actu.t16.p": {
      fr: "L'école de programmation en ligne et gratuite Fata (fondée en Guinée, communauté panafricaine) ouvre\n             son programme d'ambassadeurs au Togo : candidatures ouvertes à tous les étudiants du 1ᵉʳ au\n             30 septembre 2026, pour faire grandir la communauté togolaise autour de son application mobile\n             d'apprentissage du développement web.",
      en: "Fata, a free online programming school founded in Guinea with a pan-African community, is opening its ambassador program in Togo: applications open to all students from September 1 to 30, 2026, to grow the Togolese community around its mobile web-development learning app.",
    },
    "actu.t16.cat": { fr: "Écosystème", en: "Ecosystem" },

    "temoignages.hero.title": {
      fr: 'Convaincs tes <span class="hero-accent">parents</span>',
      en: 'Convince your <span class="hero-accent">parents</span>',
    },
    "temoignages.hero.subtitle": { fr: "Les chiffres du numérique togolais et le parcours de Togolais qui t'ont précédé : de quoi répondre, arguments à l'appui, à l'éternel « et si tu faisais plutôt… ».", en: "The figures behind Togo's digital sector and the journeys of Togolese people who came before you: everything you need to answer, with evidence, the familiar \"why not do something else instead…\"." },

    "faq.hero.title": {
      fr: 'Questions <span class="hero-accent">fréquentes</span>',
      en: 'Frequently asked <span class="hero-accent">questions</span>',
    },
    "faq.hero.subtitle": { fr: "Les questions les plus fréquentes sur WIYAO, et leurs réponses, réunies en un seul endroit.", en: "The most frequently asked questions about WIYAO, and their answers, gathered in one place." },
    "faq.badge": { fr: "Aide &amp; réponses", en: "Help &amp; answers" },
    "contact.hero.title": {
      fr: 'Contacte-<span class="hero-accent">nous</span>',
      en: 'Contact <span class="hero-accent">us</span>',
    },
    "contact.hero.subtitle": { fr: "Une question, une remarque ou une correction à signaler ? Écris-nous. Pour suggérer une école, une entreprise ou un événement, rends-toi plutôt sur la page <a href=\"proposer.html\">Proposer un contenu</a>.", en: "A question, a comment or a correction to report? Write to us. To suggest a school, a company or an event, please use the <a href=\"proposer.html\">Suggest content</a> page instead." },
    "proposer.hero.title": {
      fr: 'Proposer <span class="hero-accent">un contenu</span>',
      en: 'Suggest <span class="hero-accent">content</span>',
    },
    "proposer.hero.subtitle": { fr: "Une école, une entreprise, une communauté ou un événement tech togolais manque sur WIYAO ? Propose-le : chaque suggestion est vérifiée à partir de sources fiables avant d'être publiée.", en: "Is a Togolese school, company, community or tech event missing from WIYAO? Suggest it: every suggestion is checked against reliable sources before it is published." },


    "recherche.hero.title": {
      fr: 'Cherche <span class="hero-accent">n\'importe quoi</span> sur WIYAO',
      en: 'Search for <span class="hero-accent">anything</span> on WIYAO',
    },
    "recherche.hero.subtitle": { fr: "Une seule recherche pour l'ensemble du site, en français comme en anglais : roadmaps, écoles, écosystème togolais, bourses, stages et emploi, actualités, témoignages et FAQ.", en: "A single search across the entire site, in English or French: roadmaps, schools, the Togolese ecosystem, scholarships, internships and jobs, news, testimonials and FAQ." },
    "recherche.suggestions.label": {
      fr: "Essaie par exemple",
      en: "Try for example",
    },
    "recherche.categories.label": {
      fr: "Parcourir par catégorie",
      en: "Browse by category",
    },

    "error404.title": { fr: "Page introuvable", en: "Page not found" },
    "error404.subtitle": { fr: "Cette page n'existe pas ou n'existe plus, à moins que son adresse ne comporte une faute de frappe.", en: "This page does not exist or no longer exists, unless its address contains a typo." },
    "error404.cta.home": { fr: "Retour à l'accueil", en: "Back to home" },
    "error404.cta.search": { fr: "Rechercher sur WIYAO", en: "Search WIYAO" },
    "error404.note": { fr: "Si tu penses qu'un lien est rompu, signale-le-nous depuis la page <a href=\"contact.html\">Contact</a>.", en: "If you believe a link is broken, please report it via the <a href=\"contact.html\">Contact</a> page." },

    "about.hero.title": {
      fr: 'À propos &amp; <span class="hero-accent">méthodologie</span>',
      en: 'About &amp; <span class="hero-accent">methodology</span>',
    },
    "about.hero.subtitle": { fr: "Comment le contenu de WIYAO est conçu, vérifié et tenu à jour : la méthode, les sources et les principes qui fondent sa fiabilité.", en: "How WIYAO's content is designed, verified and kept up to date: the method, the sources and the principles behind its reliability." },

    "mentions.hero.title": {
      fr: 'Mentions <span class="hero-accent">légales</span>',
      en: 'Legal <span class="hero-accent">notice</span>',
    },
    "mentions.hero.subtitle": { fr: "L'éditeur de WIYAO, l'hébergement du site et les conditions dans lesquelles son contenu peut être réutilisé.", en: "WIYAO's publisher, the site's hosting, and the conditions under which its content may be reused." },
    "mentions.hero.updated": {
      fr: "Dernière mise à jour : septembre 2026",
      en: "Last updated: September 2026",
    },

    "confidentialite.hero.title": {
      fr: 'Politique de <span class="hero-accent">confidentialité</span>',
      en: 'Privacy <span class="hero-accent">policy</span>',
    },
    "confidentialite.hero.subtitle": { fr: "Ce que WIYAO fait, et surtout ce qu'il ne fait pas, des informations liées à ton utilisation du site.", en: "What WIYAO does, and above all what it does not do, with information related to your use of the site." },
    "confidentialite.hero.updated": {
      fr: "Dernière mise à jour : octobre 2026",
      en: "Last updated: October 2026",
    },

    "cgu.hero.title": {
      fr: 'Conditions <span class="hero-accent">d\'utilisation</span>',
      en: 'Terms of <span class="hero-accent">use</span>',
    },
    "cgu.hero.subtitle": { fr: "Les règles qui encadrent l'utilisation de WIYAO, à lire avant de parcourir le site.", en: "The rules governing the use of WIYAO, to be read before browsing the site." },
    "cgu.hero.updated": {
      fr: "Dernière mise à jour : septembre 2026",
      en: "Last updated: September 2026",
    },

    "about.s1.h2": { fr: "Le projet", en: "The project" },
    "about.s1.p1": {
      fr: 'WIYAO est un projet communautaire indépendant, sans statut commercial, créé et maintenu à titre personnel par Crédo Ahiafor. L\'idée vient de son propre parcours de bachelier en 2017 : intéressé par le numérique depuis le lycée, il a dû batailler contre sa mère (qui le voyait en pharmacie) et son père (qui le voyait en architecture) pour choisir l\'informatique. Direction l\'UCAO sur les conseils d\'une tante, puis trois spécialisations différentes avant un transfert vers l\'ESGIS suggéré par un ami — en partie parce que son master y durait deux ans au lieu de trois. À chaque étape, il n\'avait pas les bonnes informations pour décider lui-même ; ce sont la famille et les proches qui choisissaient à sa place. WIYAO existe pour que le prochain bachelier togolais ait, dès le départ, les informations comparables qui lui ont manqué. Ce n\'est pas une startup : pas de compte à créer, pas d\'abonnement, pas de publicité, rien à vendre.',
      en: 'WIYAO is an independent community project, with no commercial status, created and maintained personally by Crédo Ahiafor. The idea comes from his own path as a high-school graduate in 2017: interested in digital technology since secondary school, he had to push back against his mother (who saw him in pharmacy) and his father (who saw him in architecture) to choose computer science. He headed to UCAO on his aunt\'s advice, then went through three different specializations before transferring to ESGIS on a friend\'s suggestion — partly because its master\'s program took two years instead of three. At every step, he lacked the right information to decide for himself; it was family and people around him who chose instead. WIYAO exists so the next Togolese high-school graduate has, from the start, the comparable information he didn\'t have. It\'s not a startup: no account to create, no subscription, no ads, nothing to sell.',
    },
    "about.s1.p2.intro": {
      fr: "C'est un guide qui accompagne le bachelier togolais à chaque étape de son parcours tech :",
      en: "It's a guide that walks the Togolese bachelier through every step of their tech journey:",
    },
    "about.s1.p2.list": {
      fr: "<li>Orientation</li><li>Choix de domaine, de filière et d'université</li><li>Roadmaps de carrière et de compétences</li><li>Bourses, stages et emploi</li><li>Écosystème local à connaître</li>",
      en: "<li>Orientation</li><li>Choosing a domain, a track and a university</li><li>Career and skill roadmaps</li><li>Scholarships, internships and jobs</li><li>The local ecosystem worth knowing</li>",
    },
    "about.s1.p2.outro": {
      fr: 'Le site est gratuit, utilisable sans inscription, et hébergé par Vercel : détails complets dans les <a href="mentions-legales.html">mentions légales</a> et la <a href="politique-confidentialite.html">politique de confidentialité</a>.',
      en: 'The site is free, usable without registration, and hosted by Vercel: full details in the <a href="mentions-legales.html">legal notice</a> and the <a href="politique-confidentialite.html">privacy policy</a>.',
    },
    "about.s2.h2": { fr: "Roadmaps par métier", en: "Role-based roadmaps" },
    "about.s2.p.intro": {
      fr: "Les 60 roadmaps par métier s'appuient sur une recherche des offres d'emploi et fiches de poste réellement publiées sur des plateformes togolaises, afin d'identifier les compétences concrètement demandées par les employeurs locaux :",
      en: "The 60 role-based roadmaps are built from research into job postings and role descriptions actually published on Togolese platforms, to identify the skills local employers actually ask for:",
    },
    "about.s2.p.list": {
      fr: '<li><a href="https://emploi.tg" target="_blank" rel="noopener">emploi.tg</a></li><li><a href="https://novojob.com" target="_blank" rel="noopener">novojob.com</a></li><li><a href="https://www.jobrelais.com" target="_blank" rel="noopener">JobRelais</a></li><li>l\'<a href="https://digital.gouv.tg/recrutements" target="_blank" rel="noopener">Agence Togo Digital</a></li><li>et d\'autres sites d\'offres d\'emploi togolais</li>',
      en: '<li><a href="https://emploi.tg" target="_blank" rel="noopener">emploi.tg</a></li><li><a href="https://novojob.com" target="_blank" rel="noopener">novojob.com</a></li><li><a href="https://www.jobrelais.com" target="_blank" rel="noopener">JobRelais (Job Relay)</a></li><li><a href="https://digital.gouv.tg/recrutements" target="_blank" rel="noopener">Togo Digital Agency</a></li><li>and other Togolese job sites</li>',
    },
    "about.s2.p.outro": {
      fr: "Ce contenu est complété par des ressources d'apprentissage reconnues (documentation officielle, cours en ligne francophones et internationaux).",
      en: "This content is complemented by well-established learning resources (official documentation, French and international online courses).",
    },
    "about.s3.h2": { fr: "Roadmaps par compétence", en: "Skill-based roadmaps" },
    "about.s3.p": {
      fr: 'Les 29 roadmaps par compétence suivent une taxonomie standard de l\'industrie (langages, frameworks, outils, pratiques), cohérente avec les référentiels internationaux du secteur, pour rester alignées avec les attentes du marché au-delà du seul contexte togolais.',
      en: 'The 29 skill-based roadmaps follow a standard industry taxonomy (languages, frameworks, tools, practices), consistent with international references in the field, to stay aligned with market expectations beyond the Togolese context alone.',
    },
    "about.s4.h2": { fr: "Limites et mises à jour", en: "Limitations and updates" },
    "about.s4.p1": {
      fr: 'Le marché de l\'emploi et l\'écosystème tech togolais évoluent vite : certaines informations (contacts, programmes de formation, structures citées dans l\'<a href="ecosysteme.html">écosystème togolais</a>) peuvent changer. Vérifie toujours directement auprès des établissements et organismes concernés avant de t\'engager.',
      en: 'The job market and the Togolese tech ecosystem evolve quickly: some information (contacts, training programs, organizations listed in the <a href="ecosysteme.html">Togolese ecosystem</a>) may change. Always check directly with the relevant institutions and organizations before committing.',
    },
    "about.s4.p2": {
      fr: "Contenu vérifié pour la dernière fois en septembre 2026 (60 métiers, 29 compétences).",
      en: "Content last verified in September 2026 (60 roles, 29 skills).",
    },
    "mentions.s1.h2": { fr: "Éditeur du site", en: "Site publisher" },
    "mentions.s1.p1": {
      fr: 'WIYAO est un projet communautaire indépendant, sans statut commercial, édité et maintenu à titre personnel par <a href="https://www.linkedin.com/in/credoahiafor/" target="_blank" rel="noopener">Crédo Ahiafor</a> (<a href="https://github.com/GRIIINDER" target="_blank" rel="noopener">GitHub</a>). Il n\'est affilié à aucune administration ni institution togolaise citée sur le site.',
      en: 'WIYAO is an independent community project, with no commercial status, published and maintained personally by <a href="https://www.linkedin.com/in/credoahiafor/" target="_blank" rel="noopener">Crédo Ahiafor</a> (<a href="https://github.com/GRIIINDER" target="_blank" rel="noopener">GitHub</a>). It is not affiliated with any Togolese administration or institution mentioned on the site.',
    },
    "mentions.s1.p2": {
      fr: "Crédo Ahiafor en est également le directeur de la publication, au sens du Code de la presse et de la communication (loi n°2020-001).",
      en: "Crédo Ahiafor is also the publication director, within the meaning of the Press and Communication Code (law n°2020-001).",
    },
    "mentions.s1.p3.list": {
      fr: '<li><strong>Email :</strong> <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a></li><li><strong>Téléphone :</strong> <a href="tel:+22892236379">+228 92 23 63 79</a> · <a href="tel:+22899113199">+228 99 11 31 99</a></li><li><strong>Adresse :</strong> Lomé, Togo</li>',
      en: '<li><strong>Email:</strong> <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a></li><li><strong>Phone:</strong> <a href="tel:+22892236379">+228 92 23 63 79</a> · <a href="tel:+22899113199">+228 99 11 31 99</a></li><li><strong>Address:</strong> Lomé, Togo</li>',
    },
    "mentions.s2.h2": { fr: "Hébergement", en: "Hosting" },
    "mentions.s2.p": {
      fr: 'Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis : <a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a>.',
      en: 'The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, United States: <a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a>.',
    },
    "mentions.s3.h2": { fr: "Propriété intellectuelle", en: "Intellectual property" },
    "mentions.s3.p": {
      fr: 'Le code source du site est ouvert et consultable sur le <a href="https://github.com/GRIIINDER/Wiyao" target="_blank" rel="noopener">dépôt GitHub</a>. Les contenus (roadmaps, fiches écoles, guides) sont proposés à titre informatif et peuvent être réutilisés en citant la source.',
      en: 'The site\'s source code is open and available on the <a href="https://github.com/GRIIINDER/Wiyao" target="_blank" rel="noopener">GitHub repository</a>. The content (roadmaps, school profiles, guides) is provided for informational purposes and may be reused with attribution.',
    },
    "mentions.s4.h2": { fr: "Transactions électroniques", en: "Electronic transactions" },
    "mentions.s4.p": {
      fr: "WIYAO ne réalise aucune transaction électronique : pas de vente, pas de paiement, pas de contrat conclu en ligne. La loi n°2017-007 relative aux transactions électroniques, qui encadre notamment le commerce électronique togolais, ne s'applique donc pas aux activités du site.",
      en: "WIYAO carries out no electronic transaction: no sale, no payment, no contract concluded online. Law n°2017-007 on electronic transactions, which notably governs Togolese e-commerce, therefore does not apply to the site's activities.",
    },
    "mentions.s5.h2": { fr: "Responsabilité", en: "Liability" },
    "mentions.s5.p": {
      fr: 'Les informations publiées (dates d\'admission, filières, coordonnées d\'écoles ou d\'employeurs) proviennent de sources publiques vérifiées au moment de la rédaction, mais peuvent évoluer. Vérifie toujours les informations sensibles directement auprès des établissements concernés avant de t\'engager : voir aussi la page <a href="about.html">À propos &amp; méthodologie</a>.',
      en: 'The information published (admission dates, programs, contact details for schools or employers) comes from public sources verified at the time of writing, but may change. Always check sensitive information directly with the relevant institutions before committing: see also the <a href="about.html">About &amp; methodology</a> page.',
    },
    "mentions.s6.h2": { fr: "Droit applicable", en: "Governing law" },
    "mentions.s6.p": {
      fr: 'Ces mentions légales sont régies par le droit togolais. Pour les modalités de résolution des litiges, voir les <a href="conditions-utilisation.html">Conditions d\'utilisation</a>.',
      en: 'This legal notice is governed by Togolese law. For dispute resolution details, see the <a href="conditions-utilisation.html">Terms of Use</a>.',
    },
    "mentions.s7.h2": { fr: "Mise à jour de ces mentions légales", en: "Updates to this legal notice" },
    "mentions.s7.p": {
      fr: "Ces mentions légales peuvent être mises à jour à tout moment, notamment pour refléter un changement dans le fonctionnement du site ou dans la réglementation applicable.",
      en: "This legal notice may be updated at any time, in particular to reflect a change in how the site works or in applicable regulations.",
    },

    "conf.s1.h2": { fr: "1. Généralités", en: "1. General" },
    "conf.s1.p1": {
      fr: "La présente politique de confidentialité tient compte de la loi n°2019-014 du 29 octobre 2019 relative à la protection des données à caractère personnel, applicable au Togo.",
      en: "This privacy policy takes into account law n°2019-014 of October 29, 2019 on the protection of personal data, applicable in Togo.",
    },
    "conf.s1.p2": {
      fr: 'WIYAO est un projet communautaire indépendant, édité et maintenu à titre personnel par <a href="https://www.linkedin.com/in/credoahiafor/" target="_blank" rel="noopener">Crédo Ahiafor</a> (<a href="https://github.com/GRIIINDER" target="_blank" rel="noopener">GitHub</a>) : voir les <a href="mentions-legales.html">mentions légales</a>. L\'accès et la navigation sur WIYAO sont volontaires et gratuits et confèrent automatiquement à la personne intéressée le statut de « Visiteur » (ci-après, « Visiteur », « vous »).',
      en: 'WIYAO is an independent community project, published and maintained personally by <a href="https://www.linkedin.com/in/credoahiafor/" target="_blank" rel="noopener">Crédo Ahiafor</a> (<a href="https://github.com/GRIIINDER" target="_blank" rel="noopener">GitHub</a>): see the <a href="mentions-legales.html">legal notice</a>. Access to and browsing of WIYAO are voluntary and free, and automatically grant the person concerned the status of "Visitor" (hereinafter, "Visitor", "you").',
    },
    "conf.s1.p3": {
      fr: "Le site ne proposant ni compte, ni inscription, ni candidature en ligne, il n'existe pas de statut « Utilisateur » distinct : tout le monde navigue sur WIYAO en tant que Visiteur, y compris pour utiliser le test d'orientation ou suivre sa progression sur les roadmaps.",
      en: 'Since the site offers no account, no registration and no online application, there is no separate "User" status: everyone browses WIYAO as a Visitor, including to use the orientation test or track progress on roadmaps.',
    },
    "conf.s2.h2": { fr: "2. Collecte de données personnelles", en: "2. Personal data collection" },
    // Pied de page (identique sur les 20 pages).
    // Formulaires Contact / Proposer, recherche (UX copy, 2026-10-09).
    "form.required": { fr: "Tous les champs avec un <span class=\"required-mark\">*</span> sont obligatoires.", en: "All fields marked <span class=\"required-mark\">*</span> are required." },
    "form.name": { fr: "Nom et prénom(s)", en: "Full name" },
    "form.name.ph": { fr: "Ex : Afi Mensah", en: "e.g. Afi Mensah" },
    "form.email": { fr: "E-mail", en: "Email" },
    "form.email.ph": { fr: "ton@email.com", en: "you@email.com" },
    "form.submit": { fr: "Envoyer le message", en: "Send message" },
    "form.status.sending": { fr: "Envoi en cours…", en: "Sending…" },
    "form.status.sent.contact": { fr: "Merci, ton message est bien parti : on te répond à l'adresse e-mail que tu as indiquée.", en: "Thanks, your message has been sent: we'll reply to the email address you entered." },
    "form.status.sent.proposer": { fr: "Merci, ta proposition est bien partie : on la vérifie avant de l'ajouter, et on te répond à l'adresse e-mail que tu as indiquée.", en: "Thanks, your suggestion has been sent: we'll check it before adding it, and reply to the email address you entered." },
    "form.status.rate": { fr: "Tu as envoyé plusieurs messages en peu de temps : réessaie dans quelques minutes.", en: "You sent several messages in a short time: try again in a few minutes." },
    "form.status.error": { fr: "L'envoi n'a pas abouti. Réessaie dans un instant, ou", en: "Sending failed. Try again in a moment, or" },
    "form.status.mailto": { fr: "ouvre ta messagerie avec ce message", en: "open your email app with this message" },
    "form.trap": { fr: "Ne remplis pas ce champ", en: "Leave this field empty" },
    "form.note": { fr: "Ton message arrive directement dans la boîte e-mail de WIYAO, et on te répond à l'adresse que tu as indiquée. Ce qu'il devient est expliqué dans la <a href=\"politique-confidentialite.html\">politique de confidentialité</a>.", en: "Your message goes straight to WIYAO's inbox, and we reply to the email address you entered. What happens to it is explained in the <a href=\"politique-confidentialite.html\">privacy policy</a>." },
    "contact.intro.title": { fr: "Nous laisser<br>un message", en: "Leave us<br>a message" },
    "contact.intro.desc": { fr: "Une question ou une correction à signaler : écris-nous, on répond directement par email.", en: "A question or a correction to report? Write to us: we reply directly by email." },
    "contact.detail.email": { fr: "E-mail", en: "Email" },
    "contact.detail.phone": { fr: "Téléphone", en: "Phone" },
    "contact.detail.address": { fr: "Adresse", en: "Address" },
    "recherche.categories.aria": { fr: "Catégories du site", en: "Site sections" },
    "backtotop": { fr: "Retour en haut de page", en: "Back to top" },
    "contact.form.subject": { fr: "Ton sujet", en: "Subject" },
    "contact.form.subject.ph": { fr: "Ex : une erreur sur la fiche d'une école", en: "e.g. A mistake on a school's page" },
    "contact.form.message": { fr: "Ton message", en: "Your message" },
    "contact.form.message.ph": { fr: "Dis-nous ce que tu as remarqué ou ce que tu cherches.", en: "Tell us what you noticed or what you're looking for." },
    "proposer.form.type": { fr: "Type de contenu", en: "Type of content" },
    "proposer.form.type.choose": { fr: "Choisis un type", en: "Pick a type" },
    "proposer.form.type.event": { fr: "Événement (meetup, conférence, hackathon...)", en: "Event (meetup, conference, hackathon...)" },
    "proposer.form.type.community": { fr: "Communauté (groupe, association, collectif...)", en: "Community (group, association, collective...)" },
    "proposer.form.type.school": { fr: "Établissement (école, université, centre de formation)", en: "Institution (school, university, training center)" },
    "proposer.form.type.company": { fr: "Entreprise (employeur, offre de stage ou d'emploi)", en: "Company (employer, internship or job offer)" },
    "proposer.form.type.other": { fr: "Autre ressource", en: "Other resource" },
    "proposer.form.city": { fr: "Ville", en: "City" },
    "proposer.form.city.ph": { fr: "Ex : Lomé, Kara...", en: "e.g. Lomé, Kara..." },
    "proposer.form.name": { fr: "Nom", en: "Name" },
    "proposer.form.name.ph": { fr: "Ex : DevFest Lomé, GDG Lomé, ESGIS, Semoa...", en: "e.g. DevFest Lomé, GDG Lomé, ESGIS, Semoa..." },
    "proposer.form.link": { fr: "Lien ou source de vérification", en: "Link or source to verify it" },
    "proposer.form.link.ph": { fr: "Site web, page Facebook, groupe WhatsApp public...", en: "Website, Facebook page, public WhatsApp group..." },
    "proposer.form.date": { fr: "Date (si applicable)", en: "Date (if relevant)" },
    "proposer.form.date.ph": { fr: "Ex : 15 novembre 2026, ou récurrent", en: "e.g. November 15, 2026, or recurring" },
    "proposer.form.desc": { fr: "Description courte", en: "Short description" },
    "proposer.form.desc.ph": { fr: "En quelques phrases : quoi, pour qui, pourquoi ça a sa place sur WIYAO", en: "In a few sentences: what it is, who it's for, why it belongs on WIYAO" },
    "search.input.ph": { fr: "Ex : cybersécurité, Kara, bourse, Gozem, IAI-Togo...", en: "e.g. Kara, Gozem, IAI-Togo, data, DevOps..." },
    "search.input.aria": { fr: "Rechercher sur tout WIYAO", en: "Search all of WIYAO" },
    "hero.reassure.free": { fr: "Gratuit", en: "Free" },
    "legal.title": { fr: "Informations légales", en: "Legal information" },
    "legal.close": { fr: "Fermer", en: "Close" },
    "legal.tab.mentions": { fr: "Mentions légales", en: "Legal notice" },
    "legal.tab.privacy": { fr: "Confidentialité", en: "Privacy" },
    "legal.tab.terms": { fr: "Conditions d'utilisation", en: "Terms of use" },
    "legal.tab.about": { fr: "À propos", en: "About" },
    "hero.reassure.account": { fr: "Sans compte", en: "No account" },
    "hero.reassure.questions": { fr: "14 questions", en: "14 questions" },
    "ecoles.list.h2": { fr: "Liste des écoles", en: "List of schools" },
    "ecoles.filter.domaine": { fr: "Domaine", en: "Field" },
    "ecoles.filter.ville": { fr: "Ville", en: "City" },
    "ecoles.filter.statut": { fr: "Statut", en: "Status" },
    "ecoles.filter.all": { fr: "Tous", en: "All" },
    "ecoles.filter.allCities": { fr: "Toutes", en: "All" },
    "ecoles.filter.public": { fr: "Publique", en: "Public" },
    "ecoles.filter.prive": { fr: "Privée", en: "Private" },
    "ecoles.filter.interetats": { fr: "Inter-États", en: "Inter-state" },
    "ecoles.card.niveaux": { fr: "Niveaux :", en: "Levels:" },
    "ecoles.card.duree": { fr: "Durée :", en: "Duration:" },
    "ecoles.card.admission": { fr: "Admission :", en: "Admission:" },
    "ecoles.card.frais": { fr: "Frais :", en: "Fees:" },
    "ecoles.card.filieres": { fr: "Filières :", en: "Programs:" },
    "ecoles.card.details": { fr: "Admission, durée et frais", en: "Admission, duration and fees" },
    "ecoles.card.site": { fr: "Voir le site officiel →", en: "See official site →" },
    "ecoles.badge.agree": { fr: "Agréé État", en: "State-accredited" },
    "ecoles.noResults": { fr: "Aucune école ne correspond à ces filtres. Essaie « Tous » dans l'un d'eux, ou une autre ville.", en: "No school matches these filters. Try “All” in one of them, or another city." },
    // Noms des 7 domaines (mêmes traductions que DOMAINS[…].nameEn dans data.js).
    "domain.dev": { fr: "Développement", en: "Development" },
    "domain.data": { fr: "Data &amp; IA", en: "Data &amp; AI" },
    "domain.secu": { fr: "Sécurité", en: "Security" },
    "domain.design": { fr: "Produit &amp; Design", en: "Product &amp; Design" },
    "domain.infra": { fr: "Infrastructure &amp; DevOps", en: "Infrastructure &amp; DevOps" },
    "domain.marketing": { fr: "Marketing digital", en: "Digital Marketing" },
    "domain.gestion": { fr: "Gestion &amp; Management", en: "Management" },
    "actu.list.h2": { fr: "Toutes les actualités", en: "All news" },
    "footer.h.contact": { fr: "Contact", en: "Contact" },
    "footer.h.parcours": { fr: "Parcours", en: "Journey" },
    "footer.h.opportunites": { fr: "Opportunités", en: "Opportunities" },
    "footer.h.communaute": { fr: "Communauté", en: "Community" },
    "header.cta": { fr: "Faire le test d'orientation", en: "Take the orientation test" },
    "footer.copyright": { fr: "© 2026 WIYAO. Tous droits réservés.", en: "© 2026 WIYAO. All rights reserved." },
    "conf.s2.p1": {
      fr: "Aucune information personnelle n'est collectée pour naviguer sur WIYAO, répondre au test d'orientation, comparer des écoles ou consulter le calendrier : ces usages ne demandent ni nom, ni email, ni aucune autre donnée. Deux actions volontaires font exception, décrites ci-dessous.",
      en: "No personal information is collected to browse WIYAO, take the orientation test, compare schools or check the calendar: these uses ask for no name, no email, and no other data. Two voluntary actions are the exception, described below.",
    },
    "conf.s2.p2": {
      fr: 'Ta progression sur les roadmaps est enregistrée dans le stockage local (localStorage) de ton navigateur. Cette donnée reste uniquement sur ton appareil, n\'est jamais transmise à un serveur ni à WIYAO, et tu peux l\'effacer à tout moment via le bouton « Réinitialiser la progression » sur une roadmap, ou en vidant les données de ton navigateur.',
      en: 'Your progress on roadmaps is saved in your browser\'s local storage (localStorage). This data stays only on your device, is never sent to a server or to WIYAO, and you can erase it at any time via the "Reset progress" button on a roadmap, or by clearing your browser data.',
    },
    "conf.s2.p4": {
      fr: "Si tu écris à WIYAO avec le formulaire de la page <a href=\"contact.html\">Contact</a> ou de la page <a href=\"proposer.html\">Proposer un contenu</a>, les informations que tu y saisis (nom, email, message ou proposition) sont envoyées par email à l'éditeur du site (voir les <a href=\"mentions-legales.html\">mentions légales</a>). Elles passent par une fonction d'envoi hébergée chez Vercel, l'hébergeur du site, puis par Resend, le service qui achemine l'email. WIYAO ne les enregistre dans aucune base de données et ne s'en sert que pour te répondre ou vérifier ta proposition.",
      en: "If you write to WIYAO with the form on the <a href=\"contact.html\">Contact</a> page or the <a href=\"proposer.html\">Suggest content</a> page, the information you enter there (name, email, message or suggestion) is sent by email to the site's publisher (see the <a href=\"mentions-legales.html\">legal notice</a>). It goes through a sending function hosted by Vercel, the site's host, then through Resend, the service that delivers the email. WIYAO does not save it in any database and only uses it to reply to you or check your suggestion.",
    },
    "conf.s3.h2": { fr: "3. Base légale du traitement", en: "3. Legal basis for processing" },
    "conf.s3.p": {
      fr: "Les seules données personnelles que WIYAO reçoit sont celles que tu envoies toi-même par les formulaires Contact et Proposer : ce traitement repose sur ton consentement, puisque c'est toi qui choisis d'envoyer le formulaire, et il se limite à te répondre ou à vérifier ta proposition. Ta progression sur les roadmaps, elle, reste sur ton appareil.",
      en: "The only personal data WIYAO receives is what you send yourself through the Contact and Suggest forms: this processing is based on your consent, since you choose to send the form, and is limited to replying to you or checking your suggestion. Your progress on roadmaps stays on your device.",
    },
    "conf.s4.h2": { fr: "4. Droits de la personne dont les données font l'objet d'un traitement", en: "4. Rights of the person whose data is processed" },
    "conf.s4.p1": {
      fr: "La loi togolaise n°2019-014 garantit à toute personne dont les données sont traitées un droit à l'information (art. 35), un droit d'accès (art. 39), un droit d'opposition, un droit de rectification et de suppression, ainsi qu'un droit à l'effacement lorsque les données ont été rendues publiques.",
      en: "Togolese law n°2019-014 guarantees anyone whose data is processed a right to information (art. 35), a right of access (art. 39), a right to object, a right of rectification and deletion, as well as a right to erasure when the data has been made public.",
    },
    "conf.s4.p2": {
      fr: "Pour un message envoyé par les formulaires, tu peux à tout moment demander à y accéder, à le faire rectifier ou à le faire supprimer en écrivant à wiya.info@gmail.com. Ta progression sur les roadmaps reste sur ton appareil et sous ton contrôle exclusif : tu peux la consulter, la modifier ou la supprimer toi-même directement dans le navigateur, sans avoir à nous solliciter.",
      en: "For a message sent through the forms, you can ask at any time to access it, correct it or have it deleted by writing to wiya.info@gmail.com. Your progress on roadmaps stays on your device under your exclusive control: you can view, edit or delete it yourself directly in the browser, without needing to contact us.",
    },
    "conf.s4.p3": {
      fr: 'Pour toute question sur ces droits, contacte-nous via la page <a href="contact.html">Contact</a> ou par email à <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a>.',
      en: 'For any question about these rights, contact us via the <a href="contact.html">Contact</a> page or by email at <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a>.',
    },
    "conf.s5.h2": { fr: "5. Conservation des données", en: "5. Data retention" },
    "conf.s5.p": {
      fr: "Les messages envoyés par les formulaires sont conservés dans la boîte email de l'éditeur du site ; tu peux demander leur suppression à tout moment. Ta progression sur les roadmaps reste dans le stockage local de ton navigateur tant que tu ne la supprimes pas toi-même : WIYAO n'a aucun moyen de la supprimer à distance, puisqu'elle ne lui est jamais transmise. WIYAO ne conserve aucune autre donnée.",
      en: "Messages sent through the forms are kept in the site publisher's inbox; you can ask for them to be deleted at any time. Your progress on roadmaps stays in your browser's local storage until you delete it yourself: WIYAO has no way to remove it remotely, since it is never sent to WIYAO. WIYAO keeps no other data.",
    },
    "conf.s6.h2": { fr: "6. Sécurité", en: "6. Security" },
    "conf.s6.p": {
      fr: "WIYAO n'a pas de base de données : les messages des formulaires ne sont enregistrés nulle part sur le site, et leur contenu n'apparaît pas dans les journaux techniques de la fonction d'envoi. La connexion au site et l'envoi du formulaire sont chiffrés (HTTPS), via l'hébergeur Vercel.",
      en: "WIYAO has no database: messages from the forms are not saved anywhere on the site, and their content does not appear in the technical logs of the sending function. The connection to the site and the sending of the form are encrypted (HTTPS), via the host Vercel.",
    },
    "conf.s7.h2": { fr: "7. Mineurs", en: "7. Minors" },
    "conf.s7.p": {
      fr: "WIYAO s'adresse en priorité aux bacheliers togolais, dont une partie est mineure. Le site ne demande jamais d'informations sur l'âge, l'identité, ni aucune autre donnée personnelle pour naviguer, faire le test d'orientation ou comparer les écoles.",
      en: "WIYAO is aimed primarily at Togolese high-school graduates, some of whom are minors. The site never asks for age, identity, or any other personal data to browse, take the orientation test or compare schools.",
    },
    "conf.s8.h2": { fr: "8. Cookies et suivi", en: "8. Cookies and tracking" },
    "conf.s8.p": {
      fr: "WIYAO n'utilise aucun cookie, aucun outil de suivi ou d'analyse tierce (Google Analytics ou équivalent), et n'affiche aucune publicité. Le site utilise uniquement le stockage local (localStorage) de ton navigateur, décrit à la section 2 : ta progression sur les roadmaps et ta langue y sont enregistrées, uniquement sur ton appareil, sans jamais être transmises à un serveur.",
      en: "WIYAO uses no cookies, no third-party tracking or analytics tool (Google Analytics or equivalent), and displays no advertising. The site only uses your browser's local storage (localStorage), described in section 2: your progress on roadmaps and your language are saved there, only on your device, never sent to a server.",
    },
    "conf.s9.h2": { fr: "9. Liens externes", en: "9. External links" },
    "conf.s9.p": {
      fr: "WIYAO renvoie vers des sites tiers (écoles, plateformes d'emploi, dépôt GitHub, réseaux communautaires...). Ces sites ont leurs propres règles de confidentialité, indépendantes de celles de WIYAO.",
      en: "WIYAO links to third-party sites (schools, job platforms, GitHub repository, community networks...). These sites have their own privacy rules, independent of WIYAO's.",
    },
    "conf.s10.h2": { fr: "10. Déclaration auprès de l'autorité togolaise (IPDCP)", en: "10. Declaration to the Togolese authority (IPDCP)" },
    "conf.s10.p": {
      fr: 'La loi n°2019-014 soumet en principe tout traitement de données à caractère personnel à une déclaration préalable auprès de l\'Instance de Protection des Données à Caractère Personnel (IPDCP), l\'autorité togolaise compétente (art. 6), qui délivre un récépissé sous un mois. Elle prévoit aussi que l\'IPDCP peut publier des normes simplifiant ou exonérant cette obligation pour les catégories de traitement les plus courantes et à faible risque (art. 7). Pour toute question sur l\'application de cette règle à un cas précis, l\'IPDCP reste l\'autorité de référence : <a href="mailto:contact@ipdcp.tg">contact@ipdcp.tg</a>, (+228) 22 25 13 34, <a href="https://ipdcp.tg" target="_blank" rel="noopener">ipdcp.tg</a>.',
      en: 'Law n°2019-014 in principle requires any processing of personal data to be declared beforehand to the Personal Data Protection Authority (IPDCP), the competent Togolese authority (art. 6), which issues a receipt within one month. It also provides that the IPDCP may publish rules simplifying or exempting this requirement for the most common, low-risk categories of processing (art. 7). For any question about how this applies to a specific case, the IPDCP is the reference authority: <a href="mailto:contact@ipdcp.tg">contact@ipdcp.tg</a>, (+228) 22 25 13 34, <a href="https://ipdcp.tg" target="_blank" rel="noopener">ipdcp.tg</a>.',
    },
    "conf.s11.h2": { fr: "11. Modifications de cette politique", en: "11. Changes to this policy" },
    "conf.s11.p": {
      fr: "Cette politique peut être mise à jour pour refléter un changement dans le fonctionnement du site ou dans la réglementation applicable.",
      en: "This policy may be updated to reflect a change in how the site works or in applicable regulations.",
    },
    "conf.s12.h2": { fr: "12. Contact", en: "12. Contact" },
    "conf.s12.p": {
      fr: 'Pour toute question sur cette politique, écris-nous via la page <a href="contact.html">Contact</a> ou par email à <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a>.',
      en: 'For any question about this policy, write to us via the <a href="contact.html">Contact</a> page or by email at <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a>.',
    },

    "cgu.s1.h2": { fr: "1. Généralités", en: "1. General" },
    "cgu.s1.p1": {
      fr: 'WIYAO est un projet communautaire indépendant, édité et maintenu à titre personnel par <a href="https://www.linkedin.com/in/credoahiafor/" target="_blank" rel="noopener">Crédo Ahiafor</a> (<a href="https://github.com/GRIIINDER" target="_blank" rel="noopener">GitHub</a>) : voir les <a href="mentions-legales.html">mentions légales</a> pour le détail sur l\'éditeur du site.',
      en: 'WIYAO is an independent community project, published and maintained personally by <a href="https://www.linkedin.com/in/credoahiafor/" target="_blank" rel="noopener">Crédo Ahiafor</a> (<a href="https://github.com/GRIIINDER" target="_blank" rel="noopener">GitHub</a>): see the <a href="mentions-legales.html">legal notice</a> for details on the site publisher.',
    },
    "cgu.s1.p2": {
      fr: "L'accès et la navigation sur WIYAO sont volontaires, libres et gratuits, et confèrent automatiquement à la personne intéressée le statut de « Visiteur » (ci-après, « Visiteur », « vous »).",
      en: 'Access to and browsing of WIYAO are voluntary, free and unrestricted, and automatically grant the person concerned the status of "Visitor" (hereinafter, "Visitor", "you").',
    },
    "cgu.s1.p3": {
      fr: "Le statut de Visiteur implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation (CGU). Nous te recommandons de les lire attentivement avant d'utiliser le site. Si tu n'acceptes pas d'être lié par ces CGU, tu ne dois pas utiliser WIYAO.",
      en: "Visitor status implies full and complete acceptance of these Terms of Use. We recommend you read them carefully before using the site. If you do not accept to be bound by these Terms of Use, you must not use WIYAO.",
    },
    "cgu.s1.p4": {
      fr: "Le Visiteur s'engage à utiliser et naviguer sur WIYAO dans le respect des lois et réglementations applicables ainsi que des présentes CGU.",
      en: "The Visitor agrees to use and browse WIYAO in compliance with applicable laws and regulations as well as these Terms of Use.",
    },
    "cgu.s1.p5": {
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
      fr: "De manière générale, le Visiteur doit utiliser WIYAO, son contenu et ses fonctionnalités conformément aux présentes CGU, aux lois et réglementations en vigueur, aux bonnes mœurs et à l'ordre public, et ce à tout moment.",
      en: "In general, the Visitor must use WIYAO, its content and its features in accordance with these Terms of Use, applicable laws and regulations, good morals and public order, at all times.",
    },
    "cgu.s3.p2": {
      fr: "Plus spécifiquement, et sans limitation aux points ci-après énumérés, le Visiteur ne doit pas :",
      en: "More specifically, and without limitation to the points listed below, the Visitor must not:",
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
      fr: "restreindre ou empêcher un autre Visiteur d'utiliser et de profiter du site ;",
      en: "restrict or prevent another Visitor from using and enjoying the site;",
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
      fr: "envoyer ou diffuser des informations, codes ou contenus susceptibles de nuire, perturber ou endommager le site, son infrastructure, ou les équipements d'autres Visiteurs : logiciels malveillants, virus et autres codes de cette nature inclus, sans s'y limiter.",
      en: "send or distribute information, code or content likely to harm, disrupt or damage the site, its infrastructure, or other Visitors' equipment: including but not limited to malware, viruses and other code of this nature.",
    },
    "cgu.s3.p3": {
      fr: "Le Visiteur qui ne respecte pas les présentes CGU peut voir son accès à WIYAO restreint, afin de préserver la sécurité et la disponibilité du site pour les autres.",
      en: "A Visitor who does not comply with these Terms of Use may have their access to WIYAO restricted, in order to preserve the security and availability of the site for others.",
    },
    "cgu.s4.h2": { fr: "4. Limitation des garanties et de la responsabilité", en: "4. Limitation of warranties and liability" },
    "cgu.s4.p1": {
      fr: 'L\'utilisation de WIYAO se fait sous la responsabilité du Visiteur. WIYAO fait ses meilleurs efforts, à titre bénévole, pour assurer la disponibilité du site et la fiabilité des informations publiées (voir la méthodologie de vérification détaillée sur la page <a href="about.html">À propos &amp; méthodologie</a>), mais ne peut garantir une disponibilité continue ni l\'absence totale d\'erreur.',
      en: 'Use of WIYAO is at the Visitor\'s own responsibility. WIYAO makes its best efforts, on a volunteer basis, to ensure the site\'s availability and the reliability of published information (see the detailed verification methodology on the <a href="about.html">About &amp; methodology</a> page), but cannot guarantee continuous availability or the total absence of errors.',
    },
    "cgu.s4.p2": {
      fr: 'Si tu repères une inexactitude, merci de nous le signaler via la page <a href="contact.html">Contact</a>.',
      en: 'If you spot an inaccuracy, please let us know via the <a href="contact.html">Contact</a> page.',
    },
    "cgu.s4.p3": {
      fr: "WIYAO ne peut être tenu responsable d'un usage de son contenu par un Visiteur ou un tiers à des fins illégales ou pour porter atteinte à des tiers, ni des dommages pouvant résulter d'une intrusion illégitime indépendante de sa volonté.",
      en: "WIYAO cannot be held liable for the use of its content by a Visitor or a third party for illegal purposes or to harm third parties, nor for damages that may result from an illegitimate intrusion beyond its control.",
    },
    "cgu.s4.p4": {
      fr: "WIYAO est exonéré de toute responsabilité pouvant découler de la violation des présentes CGU par le Visiteur.",
      en: "WIYAO is released from any liability that may arise from a Visitor's violation of these Terms of Use.",
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
      fr: "L'accès et l'utilisation de WIYAO ne transfèrent en aucun cas au Visiteur les droits de propriété intellectuelle sur des éléments qui ne lui appartiennent pas déjà.",
      en: "Access to and use of WIYAO does not, under any circumstances, transfer to the Visitor any intellectual property rights over elements that do not already belong to them.",
    },
    "cgu.s6.h2": { fr: "6. Liens et contenus tiers", en: "6. Third-party links and content" },
    "cgu.s6.p": {
      fr: "WIYAO renvoie vers de nombreux sites tiers (écoles, plateformes d'emploi, communautés, organismes publics togolais). Ces liens sont fournis à titre informatif : WIYAO ne contrôle pas le contenu de ces sites, n'en garantit ni l'exactitude ni la disponibilité, et n'est pas responsable des candidatures, transactions ou échanges que le Visiteur effectuerait directement avec eux.",
      en: "WIYAO links to many third-party sites (schools, job platforms, communities, Togolese public bodies). These links are provided for information purposes: WIYAO does not control the content of these sites, does not guarantee their accuracy or availability, and is not responsible for applications, transactions or exchanges the Visitor carries out directly with them.",
    },
    "cgu.s7.h2": { fr: "7. Droit applicable et règlement des litiges", en: "7. Governing law and dispute resolution" },
    "cgu.s7.p": {
      fr: 'Les présentes CGU sont régies par le droit togolais. En cas de litige lié à l\'utilisation de WIYAO, contacte-nous d\'abord via la page <a href="contact.html">Contact</a> pour une résolution à l\'amiable. À défaut d\'accord amiable, les tribunaux togolais sont seuls compétents.',
      en: 'These Terms of Use are governed by Togolese law. In the event of a dispute related to the use of WIYAO, please contact us first via the <a href="contact.html">Contact</a> page for an amicable resolution. Failing an amicable agreement, the Togolese courts have sole jurisdiction.',
    },
    "cgu.s8.h2": { fr: "8. Modifications des CGU", en: "8. Changes to these Terms" },
    "cgu.s8.p": {
      fr: "Les présentes CGU peuvent être mises à jour à tout moment, notamment pour suivre l'évolution des fonctionnalités du site. Les nouvelles CGU sont applicables dès leur publication sur cette page ; il est de la responsabilité du Visiteur de les consulter périodiquement.",
      en: "These Terms of Use may be updated at any time, in particular to keep up with the evolution of the site's features. The new Terms of Use apply as soon as they are published on this page; it is the Visitor's responsibility to review them periodically.",
    },
    "cgu.s9.h2": { fr: "9. Contact", en: "9. Contact" },
    "cgu.s9.p": {
      fr: 'Pour toute question sur ces CGU, écris-nous via la page <a href="contact.html">Contact</a> ou par email à <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a>.',
      en: 'For any question about these Terms of Use, write to us via the <a href="contact.html">Contact</a> page or by email at <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a>.',
    },

    "faq.cat1.h2": { fr: "Sur WIYAO", en: "About WIYAO" },
    "faq.c1.q1": { fr: "C'est gratuit ?", en: "Is it free?" },
    "faq.c1.a1": { fr: "Oui, entièrement. Pas de compte à créer, pas d'abonnement, pas de publicité.", en: "Yes, entirely. No account to create, no subscription, no ads." },
    "faq.c1.q2": { fr: "Il faut créer un compte pour utiliser le site ?", en: "Do I need to create an account to use the site?" },
    "faq.c1.a2": { fr: "Non. Tout le site (roadmaps, test d'orientation, comparateur d'écoles, calendrier) s'utilise sans compte ni inscription.", en: "No. The whole site (roadmaps, orientation test, school comparison, calendar) works without an account or registration." },
    "faq.c1.q3": { fr: "Comment ma progression sur les roadmaps est-elle sauvegardée ?", en: "How is my progress on roadmaps saved?" },
    "faq.c1.a3": { fr: "Uniquement dans le stockage local (localStorage) de ton navigateur, jamais envoyée à un serveur. Si tu changes d'appareil ou de navigateur, ou si tu vides les données de ton navigateur, ta progression est perdue.", en: "Only in your browser's local storage (localStorage), never sent to a server. If you switch device or browser, or clear your browser data, your progress is lost." },
    "faq.c1.q4": { fr: "Est-ce que WIYAO collecte mes données personnelles ?", en: "Does WIYAO collect my personal data?" },
    "faq.c1.a4": {
      fr: "Non pour l'usage courant : aucun outil de suivi (analytics), aucune publicité, et rien n'est demandé pour naviguer, faire le test ou comparer des écoles. Seuls les formulaires Contact et Proposer envoient à WIYAO ce que tu y écris (nom, email, message), par email, pour te répondre. Détails dans la <a href=\"politique-confidentialite.html\">politique de confidentialité</a>.",
      en: "Not for everyday use: no tracking tools (analytics), no advertising, and nothing is asked to browse, take the test or compare schools. Only the Contact and Suggest forms send WIYAO what you write in them (name, email, message), by email, so we can reply. Details in the <a href=\"politique-confidentialite.html\">privacy policy</a>.",
    },
    "faq.c1.q5": { fr: "Qui a créé WIYAO ?", en: "Who created WIYAO?" },
    "faq.c1.a5": {
      fr: 'Un projet communautaire indépendant, sans statut commercial, créé et maintenu à titre personnel par <a href="https://www.linkedin.com/in/credoahiafor/" target="_blank" rel="noopener">Crédo Ahiafor</a> (<a href="https://github.com/GRIIINDER" target="_blank" rel="noopener">GitHub</a>), né de son propre parcours de bachelier en 2017. Détails dans <a href="about.html">À propos &amp; méthodologie</a> et les <a href="mentions-legales.html">mentions légales</a>.',
      en: 'An independent community project, with no commercial status, created and maintained personally by <a href="https://www.linkedin.com/in/credoahiafor/" target="_blank" rel="noopener">Crédo Ahiafor</a> (<a href="https://github.com/GRIIINDER" target="_blank" rel="noopener">GitHub</a>), born from his own path as a Togolese high-school graduate in 2017. Details in <a href="about.html">About &amp; methodology</a> and the <a href="mentions-legales.html">legal notice</a>.',
    },
    "faq.c1.q6": { fr: "Les informations du site sont-elles vérifiées ?", en: "Is the site's information verified?" },
    "faq.c1.a6": {
      fr: "Oui : sourcées activement (sites officiels, presse togolaise, documents signés). Quand une information ne peut pas être confirmée (par exemple des frais de scolarité), le site l'indique clairement plutôt que d'inventer un chiffre. Le marché évolue vite : vérifie toujours en direct auprès de l'établissement ou l'organisme concerné avant de t'engager.",
      en: "Yes: actively sourced (official sites, Togolese press, signed documents). When something can't be confirmed (for example, tuition fees), the site says so clearly rather than making up a number. The market moves fast: always check directly with the relevant institution or organization before committing.",
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
    "faq.c1.q9": { fr: "Comment installer WIYAO comme application sur mon téléphone ?", en: "How do I install WIYAO as an app on my phone?" },
    "faq.c1.a9": {
      fr: "Sur Android (Chrome) : menu ⋮ → « Ajouter à l'écran d'accueil » ou « Installer l'application ». Sur iPhone (Safari) : bouton de partage (icône carrée avec une flèche vers le haut) → « Sur l'écran d'accueil ». Une icône WIYAO apparaît alors comme une application classique, avec accès hors connexion aux pages déjà visitées.",
      en: 'On Android (Chrome): ⋮ menu → "Add to Home screen" or "Install app". On iPhone (Safari): Share button (square icon with an upward arrow) → "Add to Home Screen". A WIYAO icon then appears like a regular app, with offline access to pages already visited.',
    },
    "faq.c1.q10": { fr: "WIYAO est-il accessible si j'ai un handicap (visuel, auditif, moteur) ?", en: "Is WIYAO accessible if I have a disability (visual, hearing, motor)?" },
    "faq.c1.a10": {
      fr: 'Le site applique les bases : navigation au clavier, structure HTML lisible par un lecteur d\'écran, lien d\'évitement vers le contenu, et contrastes de couleur vérifiés. Ce n\'est pas (encore) un site audité pour l\'accessibilité (RGAA/WCAG) : certaines pages peuvent donc rester imparfaites avec un lecteur d\'écran ou un autre outil d\'assistance. Si tu rencontres un blocage, dis-le nous par email à <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a> : on corrige en priorité ce qui empêche réellement d\'utiliser le site.',
      en: 'The site covers the basics: keyboard navigation, screen-reader-friendly HTML structure, a skip link to the main content, and checked color contrast. It hasn\'t (yet) been audited for accessibility (WCAG), so some pages may still work imperfectly with a screen reader or other assistive tool. If you hit a blocker, let us know at <a href="mailto:wiya.info@gmail.com">wiya.info@gmail.com</a>: we\'ll prioritize fixing whatever actually prevents you from using the site.',
    },

    "faq.cat2.h2": { fr: "Sur l'orientation et les roadmaps", en: "About orientation and roadmaps" },
    "faq.c2.q1": { fr: "Je ne sais pas du tout quoi choisir, par où je commence ?", en: "I have no idea what to choose, where do I start?" },
    "faq.c2.a1": {
      fr: 'Par le <a href="test-orientation.html">test d\'orientation</a> : 14 questions pour identifier le domaine tech qui te correspond, puis le métier précis et les écoles adaptés.',
      en: 'With the <a href="test-orientation.html">orientation test</a>: 14 questions to identify the tech field that suits you, then the specific role and matching schools.',
    },
    "faq.c2.q2": { fr: "Quelle est la différence entre roadmap « par métier » et « par compétence » ?", en: 'What\'s the difference between a "role" roadmap and a "skill" roadmap?' },
    "faq.c2.a2": {
      fr: "Une roadmap par métier (ex : Développeur Web) est le chemin complet à suivre pour viser un rôle donné. Une roadmap par compétence (ex : Git &amp; GitHub) couvre un sujet précis, indépendant du métier : utile en complément d'une roadmap métier.",
      en: "A role-based roadmap (e.g. Web Developer) is the complete path to follow to aim for a given role. A skill-based roadmap (e.g. Git &amp; GitHub) covers a specific topic, independent of any role: useful alongside a role roadmap.",
    },
    "faq.c2.q3": { fr: "Je dois suivre toute la roadmap dans l'ordre ?", en: "Do I have to follow the whole roadmap in order?" },
    "faq.c2.a3": {
      fr: "Les étapes marquées comme essentielles sont recommandées dans l'ordre. Les étapes optionnelles peuvent être sautées ou reportées selon ton niveau et ton objectif.",
      en: "Steps marked as essential are recommended in order. Optional steps can be skipped or postponed depending on your level and goal.",
    },
    "faq.c2.q4": { fr: "Le test d'orientation est-il fiable à 100 % ?", en: "Is the orientation test 100% reliable?" },
    "faq.c2.a4": {
      fr: 'Non, et c\'est assumé : 14 questions ne peuvent pas connaître quelqu\'un parfaitement. Le résultat est un point de départ solide, pas un verdict définitif. Confronte-le à un <a href="temoignages.html">témoignage réel</a> de quelqu\'un du métier et explore la roadmap correspondante avant de t\'engager dans une école.',
      en: 'No, and that\'s by design: 14 questions can\'t know someone perfectly. The result is a solid starting point, not a final verdict. Cross-check it against a <a href="temoignages.html">real testimonial</a> from someone in the field and explore the matching roadmap before committing to a school.',
    },
    "faq.c2.q5": { fr: "Le métier suggéré par le test ne me plaît pas, que faire ?", en: "I don't like the role the test suggested, what should I do?" },
    "faq.c2.a5": {
      fr: 'Refais le test avec des réponses différentes, ou explore directement les <a href="roadmaps.html">roadmaps</a> des autres domaines qui t\'intéressent : rien n\'empêche de comparer plusieurs métiers avant de choisir. Le test aide à démarrer, il ne t\'enferme pas dans un seul chemin.',
      en: 'Retake the test with different answers, or explore the <a href="roadmaps.html">roadmaps</a> of other fields that interest you directly: nothing stops you from comparing several roles before choosing. The test helps you get started; it doesn\'t lock you into a single path.',
    },
    "faq.c2.q6": { fr: "Faut-il un Bac scientifique (série C, D) pour faire de l'informatique ?", en: "Do I need a science-track Baccalauréat (series C, D) to study IT?" },
    "faq.c2.a6": {
      fr: 'Non, mais ça aide selon le métier visé. Les séries C, D et E sont les plus courantes en développement, cybersécurité et infrastructure, en particulier pour les concours publics. Les séries littéraires ou économiques (A, B, G) restent accessibles pour le marketing digital, le product management ou l\'UX writing, parfois avec une remise à niveau en logique. Détails dans le guide <a href="ecoles.html#bac">« Quelle série de bac pour quelle filière »</a>.',
      en: 'No, but it helps depending on the target role. Series C, D and E are the most common for development, cybersecurity and infrastructure, especially for public entrance exams. Literary or economics tracks (A, B, G) remain accessible for digital marketing, product management or UX writing, sometimes with a logic refresher. Details in the <a href="ecoles.html#bac">"Which Bac series for which field"</a> guide.',
    },
    "faq.c2.q7": { fr: "Que signifie le badge « Vérifié Togo » sur une roadmap ?", en: 'What does the "Togo-verified" badge on a roadmap mean?' },
    "faq.c2.a7": {
      fr: "Il indique que ce métier a des offres d'emploi confirmées sur le marché togolais actuel. Son absence ne veut pas dire que le métier est inutile : seulement qu'aucune donnée fiable sur le marché local n'a encore été trouvée : les compétences restent transférables et recherchées à l'international.",
      en: "It indicates this role has confirmed job openings on the current Togolese market. Its absence doesn't mean the role is useless: only that no reliable local market data has been found yet: the skills remain transferable and in demand internationally.",
    },
    "faq.c2.q8": { fr: "Je n'ai pas d'ordinateur à la maison, puis-je quand même me former ?", en: "I don't have a computer at home, can I still learn?" },
    "faq.c2.a8": {
      fr: 'Oui, en t\'organisant : cybercafés, salles informatiques des <a href="ecoles.html">écoles</a>, ou espaces gratuits comme les <a href="ecosysteme.html#hubs">hubs et incubateurs</a> (WoeLab, Djanta Tech Hub, Campus 42...). Beaucoup de bases (algorithmique, HTML/CSS) peuvent même s\'apprendre sur smartphone avant de passer à la pratique sur ordinateur.',
      en: 'Yes, by organizing around it: cybercafés, <a href="ecoles.html">school</a> computer labs, or free spaces like <a href="ecosysteme.html#hubs">hubs and incubators</a> (WoeLab, Djanta Tech Hub, Campus 42...). Many fundamentals (algorithms, HTML/CSS) can even be learned on a smartphone before moving to hands-on practice on a computer.',
    },
    "faq.c2.q9": { fr: "Peut-on apprendre l'informatique seul, sans passer par une école ?", en: "Can you learn IT alone, without going through a school?" },
    "faq.c2.a9": {
      fr: 'Oui pour beaucoup de métiers du développement, de la data ou du design : les roadmaps WIYAO sont justement conçues pour l\'auto-formation, avec des ressources gratuites à chaque étape. D\'autres métiers (réseaux, cybersécurité avancée, gestion) bénéficient davantage d\'un encadrement académique ou de certifications reconnues. Dans tous les cas, un <a href="ecosysteme.html">réseau</a> et des projets concrets comptent autant que le diplôme aux yeux des recruteurs tech.',
      en: 'Yes, for many roles in development, data or design: WIYAO\'s roadmaps are precisely designed for self-study, with free resources at every step. Other roles (networking, advanced cybersecurity, management) benefit more from academic training or recognized certifications. Either way, a <a href="ecosysteme.html">network</a> and concrete projects matter as much as a diploma to tech recruiters.',
    },

    "faq.c2.q10": { fr: "Comment convaincre mes parents que la tech est un vrai métier ?", en: "How do I convince my parents that tech is a real career?" },
    "faq.c2.a10": {
      fr: 'Les chiffres et les parcours réels convainquent souvent mieux que les arguments abstraits : la page <a href="temoignages.html">Témoignages</a> réunit les statistiques du numérique togolais (croissance du secteur, salaires) et des portraits sourcés de professionnels togolais qui en vivent, justement pour appuyer la conversation en famille.',
      en: 'Real numbers and real paths often convince better than abstract arguments: the <a href="temoignages.html">Testimonials</a> page gathers statistics about Togolese digital tech (sector growth, salaries) and sourced portraits of Togolese professionals living off it, precisely to support the conversation with your family.',
    },
    "faq.c2.q11": { fr: "Combien gagne-t-on dans la tech au Togo ?", en: "How much do tech jobs pay in Togo?" },
    "faq.c2.a11": {
      fr: "Ça varie selon le métier, l'expérience et l'employeur. La page <a href=\"temoignages.html\">Témoignages</a> donne un repère sourcé (WageIndicator, 2026&nbsp;: 106 000 à 325 000 FCFA par mois pour un concepteur de sites internet), mais aucune grille officielle par métier n'est publiée au Togo&nbsp;: compare avec les offres réelles des plateformes de la page <a href=\"stages-emploi.html\">Stages &amp; emploi</a>.",
      en: "It varies by role, experience and employer. The <a href=\"temoignages.html\">Testimonials</a> page gives one sourced benchmark (WageIndicator, 2026: 106,000 to 325,000 FCFA per month for a web designer), but no official grid by role is published in Togo: compare with real offers on the platforms listed on the <a href=\"stages-emploi.html\">Internships &amp; jobs</a> page.",
    },
    "faq.c2.q12": { fr: "Je suis déjà en cours d'études et je pense m'être trompé de filière, je fais quoi ?", en: "I'm already studying and I think I picked the wrong track, what do I do?" },
    "faq.c2.a12": {
      fr: 'Ça arrive, et ce n\'est pas une catastrophe : plusieurs professionnels togolais de la tech ont changé de voie en cours de route (voir les <a href="temoignages.html">Témoignages</a>). Deux cas différents : si c\'est le domaine qui ne te convient plus, refais le <a href="test-orientation.html">test d\'orientation</a> avec un regard neuf : un changement proche (développement vers data, par exemple) réutilise souvent une bonne partie de ce que tu as déjà appris. Si c\'est plutôt l\'école qui pose problème alors que le domaine te plaît toujours, renseigne-toi sur un transfert vers une autre école pour la même filière plutôt que de tout recommencer. Dans les deux cas, parle-en au service scolarité de ton école actuelle et à quelqu\'un du métier visé avant de décider seul·e : tu sauras concrètement ce que tu perds et gagnes à changer.',
      en: 'It happens, and it\'s not a disaster: several Togolese tech professionals changed direction along the way (see <a href="temoignages.html">Testimonials</a>). Two different cases: if it\'s the field itself that no longer suits you, retake the <a href="test-orientation.html">orientation test</a> with fresh eyes: a nearby switch (development to data, for example) often reuses a lot of what you\'ve already learned. If it\'s the school that\'s the problem while the field still suits you, look into transferring to another school for the same track rather than starting over completely. Either way, talk to your current school\'s academic office and to someone already in the role you\'re aiming for before deciding alone: you\'ll know concretely what you lose and gain by switching.',
    },

    "faq.cat3.h2": { fr: "Sur les écoles et les frais", en: "About schools and fees" },
    "faq.c3.q1": { fr: "Toutes les écoles listées sont-elles reconnues par l'État ?", en: "Are all the listed schools recognized by the State?" },
    "faq.c3.a1": {
      fr: "Le badge « Agréé État » indique une présence sur la liste officielle du Ministère togolais de l'Enseignement Supérieur et de la Recherche (liste des établissements accrédités pour l'année académique 2026-2027, publiée le 24 juillet 2026, 111 établissements dont 13 publics).",
      en: 'The "State-accredited" badge indicates presence on the official list from the Togolese Ministry of Higher Education and Research (list of accredited institutions for the 2026-2027 academic year, published July 24, 2026, 111 institutions including 13 public ones).',
    },
    "faq.c3.q2": { fr: "Comment sont trouvés les frais de scolarité affichés ?", en: "How are the displayed tuition fees found?" },
    "faq.c3.a2": {
      fr: "Par une recherche active sur les sites officiels des écoles, des documents PDF signés et la presse togolaise. Chaque montant publié est sourcé.",
      en: "Through active research on schools' official websites, signed PDF documents and the Togolese press. Every published amount is sourced.",
    },
    "faq.c3.q3": { fr: "Pourquoi certaines écoles n'ont pas leurs frais affichés ?", en: "Why don't some schools have their fees displayed?" },
    "faq.c3.a3": {
      fr: "Parce que l'information n'a pas été trouvée quelque part de fiable et public. Plutôt que d'inventer un montant, WIYAO l'indique « non communiqué publiquement » : il faut alors contacter l'école directement.",
      en: 'Because the information wasn\'t found anywhere reliable and public. Rather than making up a figure, WIYAO marks it "not publicly disclosed": you\'ll need to contact the school directly.',
    },
    "faq.c3.q4": { fr: "WIYAO couvre quelles villes du Togo ?", en: "Which Togolese cities does WIYAO cover?" },
    "faq.c3.a4": {
      fr: "Majoritairement Lomé et Kara, avec des écoles également référencées à Sokodé, Bassar et Atakpamé.",
      en: "Mainly Lomé and Kara, with schools also listed in Sokodé, Bassar and Atakpamé.",
    },
    "faq.c3.q5": { fr: "Quelle est la différence entre BTS, Licence et Master ?", en: "What's the difference between BTS, Licence and Master?" },
    "faq.c3.a5": {
      fr: 'Le BTS (Bac+2) est un diplôme professionnalisant court. La Licence (Bac+3) peut être académique ou professionnelle. Le Master (Bac+5, souvent en 2 ans après la Licence) approfondit une spécialisation. Le <a href="ecoles.html#lexique">lexique des écoles</a> détaille aussi les autres sigles courants (LMD, CAMES, cursus ingénieur...).',
      en: 'The BTS (Bac+2) is a short, career-focused diploma. The Licence (Bac+3) can be academic or professional. The Master (Bac+5, often 2 years after the Licence) deepens a specialization. The <a href="ecoles.html#lexique">schools glossary</a> also explains other common acronyms (LMD, CAMES, engineering track...).',
    },
    "faq.c3.q6": { fr: "Puis-je étudier dans une école togolaise puis continuer mes études à l'étranger ?", en: "Can I study at a Togolese school and then continue abroad?" },
    "faq.c3.a6": {
      fr: 'Oui, c\'est un parcours courant. Un diplôme accrédité CAMES (Conseil Africain et Malgache pour l\'Enseignement Supérieur) ou reconnu par une université partenaire facilite la poursuite d\'études à l\'étranger. Vérifie ce point directement auprès de l\'école visée, et regarde aussi les <a href="bourses-financement.html#international">bourses internationales</a> pour financer une mobilité après une Licence.',
      en: 'Yes, this is a common path. A degree accredited by CAMES (the African and Malagasy Council for Higher Education) or recognized by a partner university makes it easier to continue studying abroad. Check this directly with the school in question, and also look at <a href="bourses-financement.html#international">international scholarships</a> to fund a move abroad after a Licence.',
    },

    "faq.c3.q7": { fr: "Que faire si je rate un concours d'entrée ?", en: "What if I fail an entrance exam?" },
    "faq.c3.a7": {
      fr: 'Ce n\'est pas une impasse : plusieurs écoles togolaises, en particulier privées, admettent en continu sur dossier et entretien, sans concours à date fixe. Le <a href="calendrier.html">calendrier</a> précise, école par école, lesquelles fonctionnent ainsi et à quel moment candidater.',
      en: 'It\'s not a dead end: several Togolese schools, especially private ones, admit on a rolling basis through application review and interview, with no fixed-date entrance exam. The <a href="calendrier.html">calendar</a> shows, school by school, which ones work this way and when to apply.',
    },
    "faq.c3.q8": { fr: "Où trouver les dates d'ouverture des candidatures et des concours ?", en: "Where can I find application and entrance exam dates?" },
    "faq.c3.a8": {
      fr: 'Sur la page <a href="calendrier.html">Calendrier</a> : le calendrier type d\'une candidature au Togo, puis les dates connues école par école (clôture, concours, rentrée), avec la source et l\'année de référence pour chacune.',
      en: 'On the <a href="calendrier.html">Calendar</a> page: the typical application timeline in Togo, then the known dates school by school (deadline, exam, start of term), with the source and reference year for each.',
    },
    "faq.c3.q9": { fr: "Un BTS ou une Licence suffit pour trouver un emploi, ou faut-il un Master ?", en: "Is a BTS or a Licence enough to find a job, or do I need a Master's?" },
    "faq.c3.a9": {
      fr: 'Pour beaucoup de métiers du développement, le niveau de diplôme compte moins qu\'on ne le pense : un portfolio de projets concrets pèse souvent plus qu\'un BTS ou une Licence seule aux yeux d\'un recruteur tech togolais (voir le guide de la page <a href="stages-emploi.html#guide">Stages &amp; emploi</a>). Un Master reste utile pour se spécialiser ou viser des postes à responsabilité, mais n\'est pas un prérequis pour démarrer.',
      en: 'For many development roles, the diploma level matters less than you\'d think: a portfolio of concrete projects often weighs more than a BTS or a Licence alone in the eyes of a Togolese tech recruiter (see the guide on the <a href="stages-emploi.html#guide">Internships &amp; jobs</a> page). A Master\'s remains useful to specialize or aim for senior positions, but isn\'t a prerequisite to get started.',
    },

    "faq.cat5.h2": { fr: "Sur les bourses et le financement", en: "About scholarships and funding" },
    "faq.c5.q1": { fr: "Existe-t-il des bourses pour financer mes études d'informatique au Togo ?", en: "Are there scholarships to fund IT studies in Togo?" },
    "faq.c5.a1": {
      fr: 'Oui, plusieurs types : bourses propres à certaines écoles privées, bourse d\'État togolaise pour les universités publiques, bourses internationales (AUF, coopération bilatérale) et solutions bancaires comme le crédit scolaire. Tout est centralisé sur la page <a href="bourses-financement.html">Bourses &amp; financement</a>.',
      en: 'Yes, several kinds: scholarships specific to some private schools, the Togolese State scholarship for public universities, international scholarships (AUF, bilateral cooperation) and banking options like school loans. Everything is centralized on the <a href="bourses-financement.html">Scholarships &amp; funding</a> page.',
    },
    "faq.c5.q2": { fr: "Qui peut bénéficier de la bourse d'État togolaise ?", en: "Who can get the Togolese State scholarship?" },
    "faq.c5.a2": {
      fr: 'Elle est réservée aux étudiants de nationalité togolaise déjà inscrits dans une université publique (Université de Lomé ou Université de Kara), avec une moyenne « assez-bien » ou plus. Elle ne concerne pas les écoles privées. Le dossier se dépose physiquement auprès de la Direction des Bourses et Stages (DBS), selon un calendrier fixé chaque année : détails dans la section <a href="bourses-financement.html#etat">Bourse d\'État togolaise</a>.',
      en: 'It\'s reserved for Togolese nationals already enrolled in a public university (University of Lomé or University of Kara), with a "assez-bien" average or better. It doesn\'t apply to private schools. The application is filed in person with the Directorate of Scholarships and Internships (DBS), on a calendar set each year: details in the <a href="bourses-financement.html#etat">Togolese State scholarship</a> section.',
    },

    "faq.cat4.h2": { fr: "Après le choix", en: "After you've chosen" },
    "faq.c4.q1": { fr: "Comment trouver un stage ou un emploi ?", en: "How do I find an internship or a job?" },
    "faq.c4.a1": {
      fr: 'Direction la page <a href="stages-emploi.html">Stages &amp; emploi</a> : plateformes togolaises et employeurs numériques qui recrutent régulièrement.',
      en: 'Head to the <a href="stages-emploi.html">Internships &amp; jobs</a> page: Togolese platforms and digital employers that hire regularly.',
    },
    "faq.c4.q2": { fr: "Comment rencontrer d'autres personnes dans la tech togolaise, trouver un mentor ?", en: "How do I meet other people in Togolese tech, find a mentor?" },
    "faq.c4.a2": {
      fr: 'Rejoins une communauté active dans ton domaine : par exemple <a href="https://gdg.community.dev/gdg-lome/" target="_blank" rel="noopener">GDG Lomé</a> ou <a href="https://www.linkedin.com/company/tdevorg/" target="_blank" rel="noopener">TDEV</a> en développement, <a href="https://cotia.tg/" target="_blank" rel="noopener">CoTIA</a> en IA. Chaque <a href="roadmaps.html">roadmap</a> te propose maintenant celles qui correspondent à ton métier. La page <a href="ecosysteme.html#communautes">Écosystème togolais</a> liste toutes les communautés, événements, hubs et incubateurs : le moyen le plus concret de rencontrer des professionnels et un mentor informel, mieux qu\'un contact anonyme sur le site.',
      en: 'Join an active community in your field: for example <a href="https://gdg.community.dev/gdg-lome/" target="_blank" rel="noopener">GDG Lomé</a> or <a href="https://www.linkedin.com/company/tdevorg/" target="_blank" rel="noopener">TDEV</a> for development, <a href="https://cotia.tg/" target="_blank" rel="noopener">CoTIA</a> for AI. Every <a href="roadmaps.html">roadmap</a> now suggests the ones matching your role. The <a href="ecosysteme.html#communautes">Togolese ecosystem</a> page lists every community, event, hub and incubator: the most concrete way to meet professionals and an informal mentor, better than an anonymous contact on the site.',
    },
    "faq.c4.q3": { fr: "Puis-je travailler pour des entreprises étrangères depuis le Togo ?", en: "Can I work for foreign companies from Togo?" },
    "faq.c4.a3": {
      fr: 'Oui, le travail à distance (freelance ou salarié) est une vraie option pour un développeur togolais, via des plateformes comme Upwork, Contra ou Turing. C\'est exigeant (anglais, portfolio solide) mais ça élargit beaucoup le marché au-delà des employeurs locaux : détails dans le guide de la page <a href="stages-emploi.html#guide">Stages &amp; emploi</a>.',
      en: 'Yes, remote work (freelance or salaried) is a real option for a Togolese developer, through platforms like Upwork, Contra or Turing. It\'s demanding (English, a solid portfolio) but it widens the market well beyond local employers: details in the guide on the <a href="stages-emploi.html#guide">Internships &amp; jobs</a> page.',
    },

    "temoin.s1.h2": { fr: "C'est un vrai métier", en: "It's a real career" },
    "temoin.s1.desc": {
      fr: "Le numérique togolais n'est plus une niche : c'est un secteur suivi par le gouvernement, financé par des bailleurs internationaux, et qui recrute réellement.",
      en: "Togolese digital tech is no longer a niche: it's a sector tracked by the government, funded by international donors, and genuinely hiring.",
    },
    "temoin.s1.i1.h4": { fr: "Environ 4 % du PIB", en: "About 4% of GDP" },
    "temoin.s1.i1.p": {
      fr: "Part du numérique dans l'économie togolaise en 2022, selon WeAreTech Africa (mai 2025)&nbsp;: un chiffre en progression, avec un objectif affiché de 10&nbsp;% dans les prochaines années.",
      en: "Digital tech's share of the Togolese economy in 2022, according to WeAreTech Africa (May 2025): a growing figure, with a stated target of 10% in the coming years.",
    },
    "temoin.s1.i2.h4": { fr: "37 000 emplois visés", en: "37,000 jobs targeted" },
    "temoin.s1.i2.p": { fr: 'Objectif de la stratégie nationale « Togo Digital » (2022-2025) grâce au numérique : aucun bilan chiffré final trouvé pour cette période, et une nouvelle stratégie « Togo Digital 2025-2030 » est en préparation.', en: 'Target of the national "Togo Digital" strategy (2022-2025) through digital tech: no final results have been found for this period, and a new "Togo Digital 2025-2030" strategy is in preparation.' },
    "temoin.s1.i3.h4": { fr: "100 millions $ de la Banque mondiale", en: "$100 million from the World Bank" },
    "temoin.s1.i3.p": {
      fr: "Environ 62 milliards de FCFA approuvés en décembre 2024 pour la transformation numérique du Togo&nbsp;: connecter 8 000 institutions publiques au haut débit et plus d'un million de personnes à Internet.",
      en: "About 62 billion FCFA approved in December 2024 for Togo's digital transformation: connecting 8,000 public institutions to broadband and more than a million people to the Internet.",
    },
    "temoin.s1.i4.h4": { fr: "106 000 à 325 000 FCFA/mois", en: "106,000 to 325,000 FCFA/month" },
    "temoin.s1.i4.p": {
      fr: "Fourchette indicative 2026 pour un concepteur de sites internet et multimédia au Togo, selon WageIndicator. C'est une estimation&nbsp;: aucune grille officielle par métier n'est publiée, compare toujours avec les offres réelles.",
      en: "Indicative 2026 range for a web and multimedia designer in Togo, according to WageIndicator. It's an estimate: no official grid by role is published, so always compare with real job offers.",
    },
    "temoin.s1.i5.h4": { fr: "2 milliards+ FCFA de revenus cumulés", en: "2 billion+ FCFA in combined revenue" },
    "temoin.s1.i5.p": { fr: "Revenus déjà générés par les startups numériques togolaises fédérées par TogoTech (Gozem, Semoa, Édolé, MiaPay, Clinicaa...), avec une centaine d'emplois directs créés.", en: "Revenue already generated by the Togolese digital startups united under TogoTech (Gozem, Semoa, Édolé, MiaPay, Clinicaa...), with around a hundred direct jobs created." },
    "temoin.s1.i6.h4": { fr: "Des recruteurs togolais réels", en: "Real Togolese employers" },
    "temoin.s1.i6.p": { fr: "L'Agence Togo Digital recrute régulièrement développeurs, architectes, UX/UI, QA, Scrum Master et data : pas besoin de partir à l'étranger pour trouver un poste.", en: "The Togo Digital Agency (ATD) regularly hires developers, architects, UX/UI, QA, Scrum Masters and data profiles: no need to move abroad to find a job." },
    "temoin.s2.h2": { fr: "Les secteurs qui recrutent", en: "Sectors that are hiring" },
    "temoin.s2.desc": {
      fr: "Le numérique togolais ne se limite pas au développement web : ces secteurs embauchent activement.",
      en: "Togolese digital tech isn't limited to web development: these sectors are actively hiring.",
    },
    "temoin.s2.i1.p": { fr: "Paiement mobile, inclusion financière : l'un des secteurs les plus dynamiques du numérique togolais.", en: "Mobile payments, financial inclusion: one of the most dynamic sectors in Togolese digital tech." },
    "temoin.s2.i2.p": { fr: "Solutions numériques pour l'agriculture, secteur clé de l'économie togolaise.", en: "Digital solutions for agriculture, a key sector of the Togolese economy." },
    "temoin.s2.i3.p": { fr: "Plateformes de vente en ligne et logistique associée, en forte croissance.", en: "Online sales platforms and associated logistics, growing fast." },
    "temoin.s2.i4.p": { fr: "Applications et services numériques pour la santé.", en: "Digital applications and services for healthcare." },
    "temoin.s2.i5.p": { fr: "Technologies éducatives : comme WIYAO.", en: "Educational technology: like WIYAO." },

    "temoin.s3.h2": { fr: "Ils l'ont fait", en: "They did it" },
    "temoin.s3.desc": {
      fr: "Des togolais·es qui ont construit une carrière ou une entreprise dans la tech : parcours vérifiés et sourcés, pas des exemples inventés.",
      en: "Togolese people who built a career or a company in tech: verified, sourced stories, not made-up examples.",
    },
    "temoin.s3.p1.role": { fr: "Fondateur de WoeLab", en: "Founder of WoeLab" },
    "temoin.s3.p1.p": {
      fr: "Architecte et anthropologue, il fonde WoeLab, premier espace « africain de démocratie technologique » du Togo, où il défend le concept #LowHighTech : associer les plus modestes à l'innovation technologique. Il compte la W.Afate, première imprimante 3D africaine construite en déchets informatiques, parmi les meilleurs ambassadeurs de cette vision. Ashoka Fellow depuis 2017.",
      en: "An architect and anthropologist, he founded WoeLab, Togo's first \"African technological democracy\" space, where he champions the #LowHighTech concept: involving the most modest communities in technological innovation. He counts the W.Afate, the first African 3D printer built from computer waste, among the best ambassadors of this vision. Ashoka Fellow since 2017.",
    },
    "temoin.s3.p2.role": { fr: "Inventeur d'une imprimante 3D en déchets électroniques", en: "Inventor of a 3D printer made from e-waste" },
    "temoin.s3.p2.p": {
      fr: "Géographe de formation, sans bagage en informatique : il a fait des études de lettres. Avec le soutien de l'incubateur WoeLab, il met six mois à construire le premier prototype de la première imprimante 3D fabriquée en Afrique à partir de déchets électroniques, récupérés dans les décharges de Lomé. En 2013, le projet « W.AFATE to Mars », mené avec l'équipe de WoeLab et le FacLab (France), remporte la première place sur le site de Paris du NASA International Space Apps Challenge. Récompensé en 2014 à FAB10, à Barcelone.",
      en: "A trained geographer with no computer-science background: he studied literature. With support from the WoeLab incubator, he spent six months building the first prototype of the first 3D printer made in Africa from electronic waste, salvaged from Lomé's landfills. In 2013, the \"W.AFATE to Mars\" project, carried out with the WoeLab team and FacLab (France), took first place at the Paris site of the NASA International Space Apps Challenge. Awarded a prize in 2014 at FAB10 in Barcelona.",
    },
    "temoin.s3.p3.role": { fr: "CEO et cofondateur de Semoa Group", en: "CEO and co-founder of Semoa Group" },
    "temoin.s3.p3.p": {
      fr: "Ingénieur en Business Intelligence diplômé de Polytech Nantes (France), il débute dans le conseil en systèmes d'information pour de grands groupes en Europe, puis revient au Togo fonder Semoa Group, pour concevoir des solutions de paiement adaptées aux habitudes locales. En 2026, Semoa devient la toute première fintech togolaise agréée par la BCEAO comme établissement de paiement full service (PSP).",
      en: "A Business Intelligence engineer who graduated from Polytech Nantes (France), he began in information-systems consulting for large groups in Europe, then returned to Togo to found Semoa Group and design payment solutions suited to local habits. In 2026, Semoa became the very first Togolese fintech licensed by the BCEAO as a full-service payment institution (PSP).",
    },
    "temoin.s3.p4.role": { fr: "Ingénieure logicielle &amp; cofondatrice de GDG Lomé", en: "Software engineer &amp; co-founder of GDG Lomé" },
    "temoin.s3.p4.p": {
      fr: "Ingénieure logicielle et data scientist, cofondatrice de Women Techmakers Lomé et de GDG (Google Developer Group) Lomé. A fondé AFRI TECH HUB, à l'origine d'un kit informatique low-cost pour enseigner la programmation. Mandela Washington Fellow (YALI).",
      en: "Software engineer and data scientist, co-founder of Women Techmakers Lomé and GDG (Google Developer Group) Lomé. Founded AFRI TECH HUB, behind a low-cost computing kit for teaching programming. Mandela Washington Fellow (YALI).",
    },
    "temoin.s3.p5.role": { fr: "Consultante en cybersécurité", en: "Cybersecurity consultant" },
    "temoin.s3.p5.p": {
      fr: "Licence en ingénierie informatique, télécommunication et système, puis masters en administration et sécurité réseau (Université de Reims, France) et en assurance de l'information et cybersécurité (Florida Institute of Technology, États-Unis). De 2014 à 2019, elle gère les incidents informatiques à l'Office Togolais des Recettes, avant de devenir consultante indépendante, notamment pour l'audit sécurité de l'OIF à Paris.",
      en: "Bachelor's in computer engineering, telecommunications and systems, then master's degrees in network administration and security (University of Reims, France) and in information assurance and cybersecurity (Florida Institute of Technology, USA). From 2014 to 2019 she handled IT incidents at the Togolese Revenue Office (OTR), before becoming an independent consultant, notably for the OIF's security audit in Paris.",
    },
    "temoin.s3.p6.role": { fr: "Développeuse web et mobile", en: "Web and mobile developer" },
    "temoin.s3.p6.p": {
      fr: "Développeuse web et mobile originaire de Niamtougou, dans le nord du Togo. Sélectionnée en 2021, à 22 ans, pour l'Anzisha Prize Fellowship avec RBK Pearls, l'entreprise d'accessoires en perles qu'elle a fondée à Lomé en 2019.",
      en: "Web and mobile developer from Niamtougou, in northern Togo. Selected in 2021, at 22, for the Anzisha Prize Fellowship with RBK Pearls, the beaded-accessories business she founded in Lomé in 2019.",
    },
    "temoin.s3.p7.role": { fr: "Cofondateur de Karaba", en: "Co-founder of Karaba" },
    "temoin.s3.p7.p": {
      fr: "Licence en sciences et technologies (Université de Lomé, 2022), puis licence en transformation numérique et certificat en data intelligence (Institut Mines-Télécom Business School, France). Cofondateur et directeur général de Karaba, une IA conversationnelle qui connecte recruteurs et talents dans plus de 20 pays africains ; les candidats y construisent leur profil directement sur WhatsApp.",
      en: "Bachelor's in science and technology (University of Lomé, 2022), then a bachelor's in digital transformation and a certificate in data intelligence (Institut Mines-Télécom Business School, France). Co-founder and CEO of Karaba, a conversational AI that connects recruiters and talent in more than 20 African countries; candidates build their profile directly on WhatsApp.",
    },
    "temoin.s3.p8.role": { fr: "Ingénieure logicielle, à l'origine de SOLIMI", en: "Software engineer behind SOLIMI" },
    "temoin.s3.p8.p": {
      fr: "Ingénieure logicielle, elle crée avec son équipe SOLIMI, une carte prépayée adossée à Visa qu'on peut acheter sans compte bancaire, pour améliorer l'inclusion financière. Finaliste 2022 de l'Africa Prize for Engineering Innovation (Royal Academy of Engineering, Royaume-Uni). « Nous pensons que Solimi peut avoir un impact énorme, à la fois sur les communautés non bancarisées et sur celles à faibles revenus. »",
      en: "A software engineer, she and her team created SOLIMI, a Visa-backed prepaid card that can be bought without a bank account, to improve financial inclusion. 2022 finalist of the Africa Prize for Engineering Innovation (Royal Academy of Engineering, UK). \"We believe Solimi can have an enormous impact on both unbanked and low-income communities.\"",
    },
    "actu.t11.date": { fr: "3 septembre 2026", en: "September 3, 2026" },
    "actu.t11.h3": { fr: "L'ANCy lance un appel à talents en cybersécurité", en: "ANCy launches a call for cybersecurity talent" },
    "actu.t11.p": {
      fr: "L'Agence Nationale de Cybersécurité (ANCy) ouvre un appel à manifestation d'intérêt pour constituer un\n             vivier national d'experts togolais (audits, tests d'intrusion, réponse à incident, formation) :\n             candidatures ouvertes jusqu'au 30 octobre 2026, 17h30. S'inscrit dans la Stratégie nationale de\n             cybersécurité 2024-2028 ; le Togo est classé dans le top 10 africain de l'indice mondial de\n             cybersécurité 2024 de l'UIT (88,8 points).",
      en: "Togo's National Cybersecurity Agency (ANCy) has opened a call for expressions of interest to build a national pool of Togolese experts (audits, penetration testing, incident response, training): applications open until October 30, 2026, 5:30 PM. Part of the 2024-2028 national cybersecurity strategy; Togo ranks in Africa's top 10 on the ITU's 2024 Global Cybersecurity Index (88.8 points).",
    },
    "actu.t11.cat": { fr: "Cybersécurité", en: "Cybersecurity" },
    "actu.t12.date": { fr: "24-29 août 2026", en: "August 24-29, 2026" },
    "actu.t12.h3": { fr: "1ʳᵉ édition de la Togo AI Summer School (TAISS)", en: "1st edition of the Togo AI Summer School (TAISS)" },
    "actu.t12.p": {
      fr: "100 participants sélectionnés parmi plus de 300 candidatures (Togo, Bénin, Niger) pour une semaine de\n             formation intensive à l'UniPod (Université de Lomé) : data science &amp; machine learning, analyse de\n             données &amp; business intelligence, data engineering &amp; MLOps, géo-intelligence &amp; SIG. Portée\n             par Togo AI Lab, soutenue par la coopération allemande (GIZ, ProDigiT).",
      en: "100 participants selected from over 300 applications (Togo, Benin, Niger) for a week of intensive training at UniPod (University of Lomé): data science & machine learning, data analysis & business intelligence, data engineering & MLOps, geo-intelligence & GIS. Run by Togo AI Lab, backed by German cooperation (GIZ, ProDigiT).",
    },
    "actu.t12.cat": { fr: "Formation", en: "Training" },
    "actu.t1.date": { fr: "12-13 août 2026", en: "August 12-13, 2026" },
    "actu.t1.h3": { fr: "Togo IT Days, 2ᵉ édition", en: "Togo IT Days, 2nd edition" },
    "actu.t1.p": {
      fr: "Conférence numérique tenue à l'Hôtel 2 Février (Lomé) : entrepreneuriat numérique, IA, cybersécurité,\n             développement des compétences des jeunes, numérique responsable et inclusion des femmes dans la tech,\n             avec hackathon et espace d'exposition de startups.",
      en: "Digital conference held at the February 2 Hotel (Hôtel 2 Février, Lomé): digital entrepreneurship, AI, cybersecurity, youth skills development, responsible digital practices and women's inclusion in tech, with a hackathon and startup exhibition space.",
    },
    "actu.t1.cat": { fr: "Événement", en: "Event" },
    "actu.t2.date": { fr: "Début août 2026", en: "Early August 2026" },
    "actu.t2.h3": { fr: "1ʳᵉ édition du Kara Digital Summit", en: "1st edition of the Kara Digital Summit" },
    "actu.t2.p": {
      fr: "Événement numérique tenu à Kara pour rapprocher la formation numérique des jeunes en dehors de Lomé,\n             avec un programme de mentorat personnalisé : extension prévue vers Dapaong, Sokodé, Atakpamé et Notsè\n             pour démocratiser l'usage pratique du numérique et de l'IA sur tout le territoire.",
      en: "Digital event held in Kara to bring digital training closer to young people outside Lomé, with a personalized mentoring program: expansion planned to Dapaong, Sokodé, Atakpamé and Notsè to spread practical use of digital tools and AI nationwide.",
    },
    "actu.t2.cat": { fr: "Événement", en: "Event" },
    "actu.t3.date": { fr: "24 juillet 2026", en: "July 24, 2026" },
    "actu.t3.h3": { fr: "Nouvelle liste des établissements accrédités pour 2026-2027", en: "New list of accredited institutions for 2026-2027" },
    "actu.t3.p": {
      fr: 'Le ministère de l\'Enseignement Supérieur publie la liste actualisée : 111 établissements reconnus\n             (13 publics, 98 privés), contre 97 l\'année précédente. Le ministère rappelle : « avant toute\n             inscription, vérifiez que l\'établissement choisi y figure ». WIYAO a mis à jour son comparateur\n             d\'écoles en conséquence (ajout d\'ISBIC-ALG, renommage de Collège de Paris Togo en Ascencia · Keyce,\n             retrait du badge Agréé État de DEFITECH).',
      en: 'The Ministry of Higher Education publishes the updated list: 111 recognized institutions (13 public, 98 private), up from 97 the previous year. The ministry reminds applicants: "before enrolling anywhere, check that the chosen institution is on the list." WIYAO updated its school comparison accordingly (added ISBIC-ALG, renamed Paris College Togo (Collège de Paris Togo) to Ascencia · Keyce, removed the State-accredited badge from DEFITECH).',
    },
    "actu.t3.cat": { fr: "Éducation", en: "Education" },
    "actu.t4.date": { fr: "18-29 mai 2026", en: "May 18-29, 2026" },
    "actu.t4.h3": { fr: "9 startups edtech togolaises accompagnées vers l'international", en: "9 Togolese edtech startups supported toward international markets" },
    "actu.t4.p": {
      fr: "Programme accéléré porté par l'Agence Togo Digital (ATD) avec le soutien de la GIZ (ProDigiT) :\n             9 startups sélectionnées sur 39 candidatures (dont 2 dirigées par des femmes) : MainBridge, Edumiaa,\n             Eforma Africa, ENOVSKY, Edufast, SKULLVI, Deezpro, Nufia et Mon Choix Ma Carrière. Elles participent\n             ensuite à eLearning Africa (Accra) ; les projets les plus avancés reçoivent un accompagnement\n             supplémentaire du Djanta Tech Hub.",
      en: "Accelerator program run by the Togo Digital Agency (ATD) with support from GIZ (ProDigiT): 9 startups selected out of 39 applications (2 of them women-led): MainBridge, Edumiaa, Eforma Africa, ENOVSKY, Edufast, SKULLVI, Deezpro, Nufia and My Choice My Career (Mon Choix Ma Carrière). They then took part in eLearning Africa (Accra); the most advanced projects receive additional support from Djanta Tech Hub.",
    },
    "actu.t4.cat": { fr: "Startups", en: "Startups" },
    "actu.t5.date": { fr: "7 mai 2026", en: "May 7, 2026" },
    "actu.t5.h3": { fr: "Inauguration officielle du Djanta Tech Hub", en: "Official opening of Djanta Tech Hub" },
    "actu.t5.p": {
      fr: 'Incubateur national financé par la Banque mondiale, avec Djanta Academy (formation), Djanta Start\n             (incubation), Nana Tech (entrepreneuriat féminin) et Djanta Lab (recherche). Accompagnera environ\n             72 startups togolaises entre juin 2026 et juillet 2027, et lance le fonds « Start » (subventions\n             moyennes de 15 000 € pour une trentaine d\'entrepreneurs).',
      en: 'National incubator funded by the World Bank, with Djanta Academy (training), Djanta Start (incubation), Nana Tech (women\'s entrepreneurship) and Djanta Lab (research). Will support around 72 Togolese startups between June 2026 and July 2027, and launches the "Start" fund (average grants of €15,000 for around thirty entrepreneurs).',
    },
    "actu.t5.cat": { fr: "Écosystème", en: "Ecosystem" },
    "actu.t6.date": { fr: "26 avril 2026", en: "April 26, 2026" },
    "actu.t6.h3": { fr: "Six centres d'innovation tech annoncés en région", en: "Six regional tech innovation centers announced" },
    "actu.t6.p": {
      fr: 'Le Togo prépare six « Pods » technologiques (incubation, formation, accompagnement de projets) dans les\n             préfectures de Tône, Kozah, Tchaoudjo, Ogou, Kloto et Zio, financés par la Banque mondiale (IDA),\n             objectif : sortir les opportunités numériques de la seule concentration à Lomé. Projet encore en phase\n             préparatoire (appel à manifestation d\'intérêt lancé, aucune construction démarrée à cette date).',
      en: 'Togo is preparing six tech "Pods" (incubation, training, project support) in the Tône, Kozah, Tchaoudjo, Ogou, Kloto and Zio prefectures, funded by the World Bank (IDA), the goal: spread digital opportunities beyond Lomé alone. Project still in the preparatory phase (call for expressions of interest launched, no construction started as of this date).',
    },
    "actu.t6.cat": { fr: "Gouvernement", en: "Government" },
    "actu.t7.date": { fr: "16 avril 2026", en: "April 16, 2026" },
    "actu.t7.h3": { fr: "L'Université de Lomé part à la rencontre des futurs bacheliers", en: "University of Lomé reaches out to future high-school graduates" },
    "actu.t7.p": {
      fr: "Campagne nationale de sensibilisation dans une quarantaine de lycées des régions Maritime, Plateaux\n             Ouest et Centrale : système LMD, filières, conditions d'admission, bourses et vie étudiante, avec\n             temps d'échange dédié aux questions des élèves de première et terminale.",
      en: "National outreach campaign across about forty high schools in the Maritime, Plateaux Ouest and Centrale regions: the LMD system, programs, admission requirements, scholarships and student life, with dedicated Q&amp;A time for 11th and 12th grade students.",
    },
    "actu.t7.cat": { fr: "Éducation", en: "Education" },
    "actu.t8.date": { fr: "24 octobre 2025", en: "October 24, 2025" },
    "actu.t8.h3": { fr: "Lancement du collectif TogoTech", en: "Launch of the TogoTech collective" },
    "actu.t8.p": {
      fr: '13 startups tech togolaises (Gozem, Semoa, Édolé, Solimi, MiaPay, Kondjigbalé, Anaxar,\n             Clinicaa...) s\'unissent en collectif national : plus de 2 milliards FCFA de chiffre d\'affaires cumulé\n             et une centaine d\'emplois directs. Partenariats signés avec Cyber Defense Africa (cybersécurité) et\n             Acquereburu &amp; Partners (cadre juridique). La ministre Cina Lawson y voit « un acte de maturité »\n             pour le secteur.',
      en: '13 Togolese tech startups (Gozem, Semoa, Édolé, Solimi, MiaPay, Kondjigbalé, Anaxar, Clinicaa...) join forces in a national collective: over 2 billion FCFA in combined revenue and around a hundred direct jobs. Partnerships signed with Cyber Defense Africa (cybersecurity) and Acquereburu &amp; Partners (legal framework). Minister Cina Lawson called it "an act of maturity" for the sector.',
    },
    "actu.t8.cat": { fr: "Startups", en: "Startups" },
    "actu.t10.date": { fr: "Rentrée 2025-2026", en: "2025-2026 school year" },
    "actu.t10.h3": { fr: "Une université américaine s'installe au Togo : GUST", en: "An American university sets up in Togo: GUST" },
    "actu.t10.p": {
      fr: 'La Global University of Science &amp; Technology (GUST), fédération académique déjà présente aux\n             États-Unis, au Canada et en France, ouvre son premier campus francophone d\'Afrique à Lomé (quartier\n             Agoè Anomé) : accréditée par le Ministère togolais de l\'Enseignement Supérieur et de la Recherche.',
      en: 'Global University of Science &amp; Technology (GUST), an academic federation already present in the United States, Canada and France, opens its first French-speaking African campus in Lomé (Agoè Anomé district): accredited by the Togolese Ministry of Higher Education and Research.',
    },
    "actu.t10.cat": { fr: "Éducation", en: "Education" },
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
      fr: "Portail régional ouest-africain avec une catégorie Informatique dédiée pour le Togo : la structure existe, le volume d'offres varie selon les périodes.",
      en: "West African regional portal with a dedicated IT category for Togo: the structure exists, though listing volume varies over time.",
    },
    "stages.s1.i5.p": {
      fr: "Utile surtout pour les formations tech (Python, DevOps &amp; Cloud, IA, Power BI) plutôt que pour les offres d'emploi à proprement parler.",
      en: "Mostly useful for tech training listings (Python, DevOps &amp; Cloud, AI, Power BI) rather than job postings as such.",
    },
    "stages.s1.i6.p": {
      fr: "Portail généraliste avec une catégorie Informatique très détaillée (développeur, ingénieur systèmes, technicien support, responsable informatique...), offres pour le Togo confirmées.",
      en: "General job portal with a very detailed IT category (developer, systems engineer, support technician, IT manager...), confirmed listings for Togo.",
    },
    "stages.s1.i7.p": {
      fr: "Annuaire d'entreprises et portail d'offres d'emploi panafricain avec une section togolaise active ; profil professionnel gratuit et candidature en ligne.",
      en: "Pan-African business directory and job portal with an active Togolese section; free professional profile and online applications.",
    },
    "stages.s1.i8.p": {
      fr: "Cabinet de recrutement régional (Togo, Sénégal, Mali, Côte d'Ivoire, Burkina Faso) avec une catégorie Informatique dédiée dans son moteur de recherche d'offres.",
      en: "Regional recruitment firm (Togo, Senegal, Mali, Côte d'Ivoire, Burkina Faso) with a dedicated IT category in its job search engine.",
    },
    "stages.s1.i9.p": {
      fr: "Agrégateur d'offres pour le Togo avec conseils de recherche d'emploi et outils de CV, met en avant les secteurs porteurs locaux (numérique, banque, logistique portuaire).",
      en: "Job aggregator for Togo with job-search advice and CV tools, highlights local high-demand sectors (digital, banking, port logistics).",
    },
    "stages.s1.i10.p": {
      fr: "Les grands moteurs de recherche d'emploi mondiaux indexent aussi des offres basées à Lomé et au Togo : utile en complément des plateformes locales, surtout pour les entreprises internationales.",
      en: "The major global job search engines also index listings based in Lomé and Togo: useful alongside local platforms, especially for international companies.",
    },
    "stages.s1.i11.p": {
      fr: "Portail généraliste avec une section Togo active : particulièrement utile pour les profils marketing digital et community management, moins représentés sur les autres plateformes de cette liste.",
      en: "General-purpose portal with an active Togo section: particularly useful for digital marketing and community management profiles, which are less represented on the other platforms in this list.",
    },
    "stages.s1.i13.p": {
      fr: "Agence togolaise de placement et d'intérim, avec une catégorie Informatique dédiée dans son moteur de recherche d'offres et une couverture au-delà de Lomé (Kara, Sokodé, Atakpamé, Kpalimé, Dapaong...).",
      en: "Togolese staffing and interim placement agency, with a dedicated IT category in its job search engine and coverage beyond Lomé (Kara, Sokodé, Atakpamé, Kpalimé, Dapaong...).",
    },
    "stages.s1.i14.p": {
      fr: "Agrégateur togolais assisté par IA : rassemble en une seule recherche les offres des principales plateformes du pays, classées selon le profil du candidat, actualisées chaque jour.",
      en: "AI-assisted Togolese aggregator: gathers offers from the country's main platforms into a single search, ranked to match the candidate's profile, updated daily.",
    },
    "stages.s1.i15.p": {
      fr: "Plateforme togolaise de recrutement nouvelle génération : plus de 160 offres actives, plus de 100 entreprises partenaires, candidature en un clic, inscription gratuite.",
      en: "Next-generation Togolese recruitment platform: over 160 active listings, over 100 partner companies, one-click applications, free registration.",
    },
    "stages.s1.i16.p": {
      fr: "Cabinet de recrutement et chasse de têtes panafricain (37 pays), avec des pages dédiées par poste IT au Togo (ingénieur informatique industrielle, chef de projet informatique, responsable des systèmes d'information). Plutôt orienté cadres qu'offres en volume.",
      en: "Pan-African recruitment and executive search firm (37 countries), with dedicated pages per IT role in Togo (industrial IT engineer, IT project manager, information systems manager). Geared more toward senior/executive roles than high-volume listings.",
    },
    "stages.s1.i17.p": {
      fr: "Filiale togolaise du réseau international Option Carrière, avec une catégorie Informatique dédiée. Le site bloque la vérification automatisée directe, mais son contenu (stages Python/Django, administrateurs systèmes, développeurs Laravel/Vue.js) est confirmé par plusieurs sources croisées.",
      en: "Togolese branch of the international Option Carrière (Career Option) network, with a dedicated IT category. The site blocks direct automated verification, but its content (Python/Django internships, systems administrators, Laravel/Vue.js developers) is confirmed by several cross-referenced sources.",
    },

    "stages.s2.h2": { fr: "Employeurs qui recrutent des profils tech", en: "Employers hiring tech profiles" },
    "stages.s2.i1.p": {
      fr: "Agence publique pilotant la digitalisation de l'État togolais. Les postes publiés varient dans le temps et ne sont pas toujours techniques ; la candidature spontanée reste une option pour les profils développeur, UX/UI ou data.",
      en: "Public agency leading the digitalization of the Togolese State. Posted roles vary over time and aren't always technical; a spontaneous application remains an option for developer, UX/UI or data profiles.",
    },
    "stages.s2.i2.p": {
      fr: "Coentreprise entre l'État togolais et Asseco Data Systems, opère le CERT national et un SOC. Recrute analystes SOC, consultants et formateurs en cybersécurité.",
      en: "Joint venture between the Togolese State and Asseco Data Systems, operates the national CERT and a SOC. Hires SOC analysts, consultants and cybersecurity trainers.",
    },
    "stages.s2.i3.p": {
      fr: "Deuxième opérateur télécom du pays. Page carrière active, sous forme de candidature spontanée plutôt que d'offres détaillées en permanence ; profils réseaux, télécoms et systèmes concernés.",
      en: "The country's second telecom operator. Active careers page, structured as a spontaneous application rather than a running list of detailed openings; relevant for networks, telecom and systems profiles.",
    },
    "stages.s2.i4.p": {
      fr: "Opérateur télécom historique du Togo (fixe, mobile, Mobile Money), né de la fusion de Togo Telecom et Togocel en 2017, rebaptisé Yas Togo en novembre 2024 dans le cadre du rebranding panafricain du groupe Axian (le Mobile Money Tmoney devient Mixx by Yas). Page carrière active ; recrute régulièrement des profils informatiques (développement, systèmes d'information, réseaux OSS/BSS, data).",
      en: "Togo's historic telecom operator (fixed line, mobile, Mobile Money), born from the 2017 merger of Togo Telecom and Togocel, renamed Yas Togo in November 2024 as part of the Axian group's pan-African rebrand (its Tmoney mobile money service becomes Mixx by Yas). Active careers page; regularly hires IT profiles (development, information systems, OSS/BSS networks, data).",
    },
    "stages.s2.i5.p": {
      fr: "Application de mobilité et de super-app (courses, livraison, paiement mobile) fondée et lancée à Lomé en 2018 : l'un des succès tech les plus visibles nés au Togo, aujourd'hui présente dans plusieurs pays d'Afrique francophone. Recrute régulièrement des profils tech (développement, data, produit) via son portail carrières.",
      en: "Mobility and super-app (rides, delivery, mobile payments) founded and launched in Lomé in 2018: one of the most visible tech success stories to come out of Togo, now present in several French-speaking African countries. Regularly hires tech profiles (development, data, product) via its careers portal.",
    },
    "stages.s2.i6.p": {
      fr: "Institution financière régionale dont le siège se trouve à Lomé. Recrute régulièrement sur des postes IT (réseaux, systèmes, développement, cybersécurité, gestion de projets) ainsi que des stages.",
      en: "Regional financial institution headquartered in Lomé. Regularly hires for IT roles (networks, systems, development, cybersecurity, project management) as well as internships.",
    },
    "stages.s2.i7.p": {
      fr: "Groupe bancaire panafricain dont le siège social se trouve à Lomé. Recrute régulièrement sur des postes IT et réseaux, aux côtés des autres métiers de la banque, dans ses 33 pays d'opération.",
      en: "Pan-African banking group headquartered in Lomé. Regularly hires for IT and network roles, alongside other banking positions, across its 33 countries of operation.",
    },
    "stages.s2.i8.p": {
      fr: "Filiale togolaise du groupe bancaire panafricain Orabank (12 filiales en Afrique de l'Ouest et Centrale). Recrute régulièrement des postes IT (Directeur des Systèmes d'Information, Administrateur Réseau et Systèmes).",
      en: "Togolese subsidiary of the pan-African Orabank banking group (12 subsidiaries across West and Central Africa). Regularly hires for IT roles (Chief Information Officer, Network and Systems Administrator).",
    },
    "stages.s2.i9.p": {
      fr: "Filiale togolaise du groupe bancaire panafricain Bank of Africa. Page carrière active avec des offres IT publiées directement (ex. Administrateur Réseau et Système).",
      en: "Togolese subsidiary of the pan-African Bank of Africa group. Active careers page with IT openings posted directly (e.g. Network and Systems Administrator).",
    },
    "stages.s2.i10.p": {
      fr: "Banque centrale des huit pays de l'UEMOA, avec une agence nationale à Lomé. Recrute régulièrement des profils IT (analyste sécurité des systèmes d'information, techniciens et ingénieurs) pour son siège et ses agences nationales.",
      en: "Central bank of the eight UEMOA countries, with a national agency in Lomé. Regularly hires IT profiles (information systems security analyst, technicians and engineers) for its headquarters and national agencies.",
    },
    "stages.s2.i11.p": {
      fr: "Agence publique togolaise de régulation et de réponse à incident en cybersécurité (CERT.tg). Recrute régulièrement (auditeurs SSI, analystes) et a lancé un appel national pour référencer les talents togolais en cybersécurité (pentest, sécurité applicative, DevSecOps, réponse à incident).",
      en: "Togolese public cybersecurity regulation and incident-response agency (CERT.tg). Regularly hires (IS security auditors, analysts) and launched a national call to register Togolese cybersecurity talent (pentesting, application security, DevSecOps, incident response).",
    },
    "stages.s2.i12.p": {
      fr: "Fintech togolaise fondée à Lomé en 2016, spécialisée dans le paiement digital et la digitalisation du cash (solution Cashpay), présente dans 13 pays d'Afrique. Pas de portail carrières dédié identifié : leur page LinkedIn reste la meilleure piste pour candidater ou suivre leurs annonces.",
      en: "Togolese fintech founded in Lomé in 2016, specializing in digital payments and cash digitization (Cashpay solution), present in 13 African countries. No dedicated careers portal identified: their LinkedIn page remains the best way to apply or follow their announcements.",
    },
    "stages.s2.i13.p": {
      fr: "Cabinet togolais d'expertise informatique et de management créé en 2001 à Lomé, présent dans 11 pays africains à travers ses filiales : éditeur de PERFECT (logiciel de gestion des institutions de microfinance), de solutions de finance digitale et de solutions pour l'État. Recrute régulièrement à Lomé : développeurs Java, Spring, Flutter ou Angular (novembre 2025, avril et septembre 2026) et technicien réseau et sécurité (avril 2026), au niveau Bac+3, le plus souvent avec de l'expérience. Pas d'offres sur son site : les annonces paraissent sur les sites d'emploi togolais, et les candidatures se font par e-mail.",
      en: "Togolese IT and management consulting firm founded in 2001 in Lomé, present in 11 African countries through its subsidiaries: publisher of PERFECT (management software for microfinance institutions), digital finance solutions and government solutions. Hires regularly in Lomé: Java, Spring, Flutter or Angular developers (November 2025, April and September 2026) and a network and security technician (April 2026), at Bac+3 level, usually with experience. No openings on its own website: ads appear on Togolese job sites, and applications go by email.",
    },
    "stages.s2.i14.p": {
      fr: "Filiale togolaise du groupe bancaire panafricain Coris Bank International. Page carrière active avec des postes IT confirmés (support monétique, sécurité opérationnelle, infrastructures techniques), aux côtés des autres métiers de la banque.",
      en: "Togolese subsidiary of the pan-African banking group Coris Bank International. Active careers page with confirmed IT roles (monetics support, operational security, technical infrastructure), alongside the bank's other professions.",
    },
    "stages.s2.i15.p": {
      fr: "Premier terminal à conteneurs d'Afrique de l'Ouest (filiale du groupe MSC), au Port autonome de Lomé. Recrutements confirmés de techniciens IT et d'administrateurs d'applications et bases de données. Pas de portail carrières dédié identifié : candidatures via les agrégateurs togolais.",
      en: "West Africa's first container terminal (MSC group subsidiary), at the Port of Lomé. Confirmed hiring for IT technicians and application/database administrators. No dedicated careers portal identified: apply via Togolese job aggregators.",
    },
    "stages.s2.i16.p": {
      fr: "Autorité portuaire publique togolaise, dotée d'une Direction des Systèmes d'Information qui recrute périodiquement des agents SI (dernier avis confirmé fin 2024, à surveiller pour de nouvelles ouvertures).",
      en: "Togolese public port authority, with an Information Systems Department that periodically hires IS staff (last confirmed notice in late 2024 — worth watching for new openings).",
    },
    "stages.s2.i17.p": {
      fr: "Concessionnaire automobile togolais du groupe panafricain CFAO. A recruté du support technique Windows/Linux/réseau ; le portail carrières du groupe couvre aussi des postes Infrastructure et Réseaux, Direction SI, filtrables par pays (peu d'offres Togo au même moment).",
      en: "Togolese car dealership under the pan-African CFAO group. Has hired Windows/Linux/network technical support; the group's careers portal also covers Infrastructure & Networks and IT Management roles, filterable by country (few Togo listings at any given time).",
    },
    "stages.s2.i18.p": {
      fr: "Coopération allemande au Togo : le projet ProDigiT (transformation digitale de l'économie togolaise, de juillet 2022 à avril 2028) appuie l'Agence Togo Digital, les startups et la digitalisation des petites entreprises. Ses offres sont des postes de conseil en économie numérique plutôt que de développement : conseiller·ère junior en compétences digitales (Bac+5, juin 2024), stage de trois mois (Bac+3, février 2025). Les avis de vacance de la GIZ au Togo paraissent sur les sites d'emploi togolais ; candidatures par e-mail.",
      en: "German development cooperation in Togo: the ProDigiT project (digital transformation of the Togolese economy, July 2022 to April 2028) supports the Togo Digital Agency (ATD), startups and the digitization of small businesses. Its openings are digital-economy consulting roles rather than development jobs: junior advisor in digital skills (Bac+5, June 2024), three-month internship (Bac+3, February 2025). GIZ Togo's vacancy notices appear on Togolese job sites; applications by email.",
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
    "stages.guide.s1.title": { fr: "Construis un portfolio concret.", en: "Build a concrete portfolio." },
    "stages.guide.s1.desc": {
      fr: "Un profil GitHub avec quelques projets terminés (même petits) pèse souvent plus qu'un diplôme seul aux yeux d'un recruteur tech. Termine les roadmaps qui t'intéressent et mets le résultat en ligne.",
      en: "A GitHub profile with a few finished projects (even small ones) often carries more weight than a degree alone in the eyes of a tech recruiter. Finish the roadmaps that interest you and put the result online.",
    },
    "stages.guide.s2.title": { fr: "Passe par le réseau avant les offres publiques.", en: "Go through your network before public listings." },
    "stages.guide.s2.desc": {
      fr: "Beaucoup de stages togolais se trouvent via le bouche-à-oreille dans les communautés (GDG Lomé, PyCon Togo, CoTIA...) avant d'être publiés ailleurs. Assiste aux meetups, pose des questions, propose ton aide sur des projets.",
      en: "Many Togolese internships are found through word of mouth in communities (GDG Lomé, PyCon Togo, CoTIA...) before being posted anywhere else. Attend meetups, ask questions, offer to help on projects.",
    },
    "stages.guide.s3.title": { fr: "Postule directement, même sans offre publiée.", en: "Apply directly, even without a posted opening." },
    "stages.guide.s3.desc": {
      fr: "Beaucoup de PME et d'agences togolaises n'ont pas de page carrière : un e-mail ciblé avec un lien vers ton portfolio a plus d'impact qu'une candidature générique sur un grand site.",
      en: "Many Togolese SMEs and agencies have no careers page: a targeted email with a link to your portfolio has more impact than a generic application on a big site.",
    },
    "stages.guide.s4.title": { fr: "Envisage aussi le travail à distance.", en: "Consider remote work too." },
    "stages.guide.s4.desc": {
      fr: "Des plateformes comme Upwork, Contra ou Turing permettent à un développeur togolais de travailler pour des clients internationaux sans quitter Lomé. C'est exigeant (anglais, portfolio solide) mais ça élargit beaucoup le marché.",
      en: "Platforms like Upwork, Contra or Turing let a Togolese developer work for international clients without leaving Lomé. It's demanding (English, a solid portfolio) but it greatly widens the market.",
    },
    "stages.guide.s5.title": { fr: "Prépare un CV court et concret.", en: "Prepare a short, concrete résumé." },
    "stages.guide.s5.desc": {
      fr: "Un recruteur tech togolais regarde d'abord ce que tu as construit, pas une liste de compétences vagues. Mets en avant 2-3 projets précis plutôt qu'une longue liste de technologies.",
      en: "A Togolese tech recruiter looks first at what you've built, not a vague list of skills. Highlight 2-3 specific projects rather than a long list of technologies.",
    },

    "bourses.s1.h2": { fr: "Bourses proposées directement par les écoles", en: "Scholarships offered directly by schools" },
    "bourses.s1.desc": {
      fr: 'La majorité des écoles privées togolaises proposent leurs propres réductions ou concours de bourses :\n      souvent la piste la plus accessible, mais la moins visible. Détails complets (filières, frais, contact) sur la page\n      <a href="ecoles.html">Écoles &amp; universités</a>.',
      en: 'Most Togolese private schools offer their own discounts or scholarship competitions: often the most accessible option, but the least visible. Full details (programs, fees, contact) on the <a href="ecoles.html">Schools &amp; universities</a> page.',
    },
    "bourses.s1.i1.p": { fr: "Concours d'entrée « doté de bourse » 2026, ouvert à tous les bacheliers (5 000 FCFA d'inscription), en deux sessions : le 4 septembre dans 5 centres (Lomé, Kara, Atakpamé, Sokodé, Dapaong) et le 5 octobre à Lomé. Il donne accès à une bourse pour étudier dans l'une des 10 filières de l'école ; le montant n'est pas précisé (ipnetuniversity.com, page « Concours de bourse 2026 », consultée le 6 novembre 2026).", en: "2026 entrance exam “with scholarships”, open to all high-school graduates (5,000 FCFA registration fee), in two sessions: September 4 in 5 centers (Lomé, Kara, Atakpamé, Sokodé, Dapaong) and October 5 in Lomé. It gives access to a scholarship to study in one of the school's 10 programs; the amount is not specified (ipnetuniversity.com, “Concours de bourse 2026” page, accessed November 6, 2026)." },
    "bourses.s1.i2.p": { fr: "Pas de programme de bourses détaillé sur le site officiel actuel : l'école met en avant la mobilité vers ses universités partenaires en France (dont Le Havre Normandie, l'UPEC et Sorbonne Paris Nord), au Canada (University of Alberta) et en Belgique (HELdB), avec une bourse dans certains cas d'après le témoignage d'un ancien étudiant (esig.tg, consulté le 6 novembre 2026). L'ancienne page FAQ, qui citait les bourses FONAP et au mérite, n'est plus en ligne.", en: "No detailed scholarship program on the current official website: the school highlights mobility to its partner universities in France (including Le Havre Normandie, UPEC and Sorbonne Paris Nord), Canada (University of Alberta) and Belgium (HELdB), with a scholarship in some cases according to a former student's testimonial (esig.tg, accessed November 6, 2026). The former FAQ page, which mentioned FONAP and merit scholarships, is no longer online." },
    "bourses.s1.i4.p": { fr: "Bourse « Étoile Scientifique » de 200 000 FCFA/an réservée aux étudiantes inscrites en informatique, et réduction de 50 000 FCFA/an pour les étudiants d'un même parent. En 2026-2027, la bourse n'est pas cumulable avec la remise du jubilé des 20 ans (ucao-uut.tg/admissions, consulté le 6 novembre 2026).", en: "“Scientific Star” (Étoile Scientifique) scholarship of 200,000 FCFA/year reserved for female students enrolled in computer science, and a 50,000 FCFA/year discount for siblings (students with the same parent). In 2026-2027, the scholarship cannot be combined with the 20th-anniversary discount (ucao-uut.tg/admissions, accessed November 6, 2026)." },
    "bourses.s1.i5.p": { fr: "Concours de bourses donnant droit à une réduction sur les frais de scolarité (montant non précisé). Dernière édition : 18 septembre 2025 ; aucune date annoncée pour 2026-2027 (ecoledescadres.com, consulté le 6 novembre 2026).", en: "Scholarship competition giving a discount on tuition fees (amount not specified). Last edition: September 18, 2025; no date announced for 2026-2027 (ecoledescadres.com, accessed November 6, 2026)." },
    "bourses.s1.i6.p": { fr: "Bourses d'études de l'État et allocations de secours (gérées par la Direction des Bourses et Stages), prix d'excellence du Président, bourses de partenaires privés, soutiens réservés aux filles en sciences (STEM) et bourses de mobilité internationale (Erasmus+, coopérations bilatérales) vers des universités partenaires (univkara.tg, page « Bourses et aides financières », consultée le 6 novembre 2026).", en: "State study grants and emergency allowances (managed by the Scholarships and Internships Directorate), President's excellence awards, private partner scholarships, support reserved for women in science (STEM) and international mobility scholarships (Erasmus+, bilateral cooperation) to partner universities (univkara.tg, \"Scholarships and financial aid\" page, accessed November 6, 2026)." },
    "bourses.s1.i7.p": { fr: "Pour 2026-2027, seule réduction détaillée par l'école : 20 % sur les frais d'inscription (50 000 FCFA) pour les 200 premiers inscrits (échéancier officiel du 8 juin 2026, esatogo.com). Les bannières du site qui annoncent des « bourses d'études » pour les premiers inscrits ne sont ni datées ni détaillées.", en: "For 2026-2027, the only discount the school details: 20% off the registration fee (50,000 FCFA) for the first 200 students to enroll (official payment schedule of June 8, 2026, esatogo.com). The site's banners advertising “study scholarships” for early enrollees are neither dated nor detailed." },
    "bourses.s1.i8.p": { fr: "Réductions 2026-2027 sur les frais de scolarité, non cumulables : demi-bourse (50 %) pour les 10 premiers inscrits, quart de bourse (25 %) pour les 10 suivants, 15 % pour toute inscription avant le 31 octobre 2026 et 10 % pour les nouveaux bacheliers (hest-edu.net, page « Bourses », consultée le 8 novembre 2026).", en: "2026-2027 tuition discounts, not cumulative: half scholarship (50%) for the first 10 students to enroll, quarter scholarship (25%) for the next 10, 15% for any enrollment before October 31, 2026, and 10% for new high-school graduates (hest-edu.net, \"Scholarships\" page, accessed November 8, 2026)." },
    "bourses.s1.i9.p": { fr: "Concours de bourses à l'entrée en Licence 1 et en Master : jusqu'à 75 % de réduction sur les frais de scolarité, épreuves de français, d'anglais et de culture générale (flyer officiel 2026). L'édition 2026 s'est tenue le samedi 3 octobre (esgis.org) ; la prochaine n'est pas encore annoncée.", en: "Scholarship competition for entry into Licence 1 and the Master's: up to 75% off tuition fees, with tests in French, English and general knowledge (official 2026 flyer). The 2026 edition took place on Saturday, October 3 (esgis.org); the next one has not been announced yet." },
    "bourses.s2.h2": { fr: "Bourse d'État togolaise", en: "Togolese State scholarship" },
    "bourses.s2.i1.h4": { fr: "Bourse nationale", en: "National scholarship" },
    "bourses.s2.i1.p": {
      fr: 'Réservée aux étudiants de nationalité togolaise <strong>déjà inscrits dans une université publique togolaise</strong>\n           (Université de Lomé, Université de Kara), avec une moyenne « assez-bien » ou plus. La procédure n\'est pas\n           numérisée : le dossier se dépose physiquement, selon un calendrier fixé chaque année.',
      en: 'Reserved for Togolese nationals <strong>already enrolled in a Togolese public university</strong> (University of Lomé, University of Kara), with a "good" grade average or above. The process is not digitized: applications are filed in person, on a schedule set each year.',
    },
    "bourses.s2.i2.h4": { fr: "Bourses de coopération (étudier à l'étranger)", en: "Cooperation scholarships (studying abroad)" },
    "bourses.s2.i2.p": {
      fr: "Bourses d'États et d'organismes partenaires, relayées par la DBS : AMCI (Maroc), bourse d'excellence de l'UEMOA, bourses vers le Brésil et d'autres pays partenaires. Chaque programme a ses propres critères et dates, publiés au fil de l'année : l'appel pour l'AMCI 2026-2027, par exemple, publié le 20 mai 2026, a fermé dès le 29 mai 2026 (dossiers déposés en personne à la DBS), et la liste des boursiers retenus est parue le 27 août 2026.",
      en: "Scholarships from partner states and bodies, relayed by the DBS: AMCI (Morocco), the WAEMU excellence scholarship, scholarships to Brazil and other partner countries. Each program has its own criteria and dates, published throughout the year: the AMCI 2026-2027 call, for instance, published on May 20, 2026, closed as early as May 29, 2026 (applications filed in person at the DBS), and the list of selected scholars came out on August 27, 2026.",
    },
    "bourses.s2.i3.h4": { fr: "Allocations de secours", en: "Emergency grants" },
    "bourses.s2.i3.p": {
      fr: "Aide financière annuelle de l'État pour les étudiants togolais non boursiers reconnus nécessiteux, inscrits dans une université publique togolaise : demande à adresser également à la DBS.",
      en: "Annual State financial aid for Togolese students without a scholarship who are recognized as being in need, enrolled in a Togolese public university: also requested through the DBS.",
    },
    "bourses.s3.h2": { fr: "Financement bancaire", en: "Bank financing" },
    "bourses.s3.i1.p": { fr: "Crédit à très court terme (10 mois) pour financer les dépenses de rentrée, destiné aux salariés : jusqu'à un mois de salaire net, dans la limite de 2 000 000 FCFA, au taux de 8,5 % hors taxe (TAF), mis en place en 72 heures, avec domiciliation du salaire. Une piste pour tes parents plutôt que pour toi.", en: "Very short-term loan (10 months) to cover back-to-school expenses, for salaried employees: up to one month's net salary, capped at 2,000,000 FCFA, at 8.5% excluding tax (TAF), set up within 72 hours, with salary domiciliation. An option for your parents rather than for you." },
    "bourses.s3.i2.p": { fr: "Offre bancaire pour élèves et étudiants inscrits dans une école publique ou privée (compte épargne rémunéré, carte Visa Classic, SMS Banking Oramobile, e-relevé et My KEAZ) : pas un prêt en soi, mais une base pour gérer ton budget d'études.", en: "Banking package for pupils and students enrolled in a public or private school (interest-bearing savings account, Visa Classic card, Oramobile SMS Banking, e-statement and My KEAZ): not a loan as such, but a base for managing your study budget." },

    "bourses.s4.h2": { fr: "Bourses internationales et régionales accessibles aux Togolais", en: "International and regional scholarships accessible to Togolese students" },
    "bourses.s4.desc": { fr: "Utiles surtout après une Licence, pour un Master ou une spécialisation : à garder en tête pour plus tard dans ton parcours.", en: "Mostly useful after a Bachelor's degree, for a Master's or a specialization: worth keeping in mind for later in your journey." },
    "bourses.s4.i1.p": { fr: "L'Agence universitaire de la Francophonie publie au fil de l'année des appels à candidatures, dont des bourses de mobilité et de recherche ; l'Université de Kara la cite parmi les bourses de ses partenaires. Les conditions changent à chaque appel : vérifie sur la page des appels de l'AUF que ton pays et ton établissement sont éligibles.", en: "The Francophone University Association (AUF) publishes calls for applications throughout the year, including mobility and research scholarships; the University of Kara lists it among its partners' scholarships. Conditions change with each call: check on the AUF calls page that your country and institution are eligible." },
    "bourses.s4.i2.p": {
      fr: "Programme de la Fondation Femmes pour l'Afrique (Fundación Mujeres por África) pour les étudiantes et diplômées de tout le continent africain : des cours en ligne donnés par des universités et instituts des Canaries (Espagne), suivis sans quitter son pays. L'édition 2026 offrait plus de 450 bourses (une formation spécialisée et un cours d'espagnol par candidate), pour des cours de juillet à novembre 2026. Relayé notamment par <a href=\"ecosysteme.html#communautes\">Togolaises In Science</a>.",
      en: "Program of the Women for Africa Foundation (Fundación Mujeres por África) for female students and graduates from across the African continent: online courses taught by universities and institutes in the Canary Islands (Spain), taken without leaving your country. The 2026 edition offered over 450 scholarships (one specialized course and one Spanish course per applicant), for courses from July to November 2026. Promoted notably by <a href=\"ecosysteme.html#communautes\">Togolese Women in Science (TIS)</a>.",
    },
    "bourses.s4.i3.p": { fr: "Bourses d'excellence de l'UEMOA pour des étudiants méritants de chaque État membre, dont le Togo : licence, master ou doctorat dans un établissement implanté dans l'Union (formations en ligne exclues), non cumulables avec une autre bourse. Candidature en ligne ; l'appel 2026 a fermé le 30 août 2026.", en: "WAEMU excellence scholarships for deserving students from each member state, including Togo: Bachelor's, Master's or PhD at an institution based in the Union (online programs excluded), not combinable with another scholarship. Online application; the 2026 call closed on August 30, 2026." },
    "bourses.s4.i4.p": { fr: "Bourses du gouvernement français, gérées par l'ambassade de France au Togo. L'appel 2026-2027 visait les doctorants, pas les bacheliers : nationalité togolaise, 35 ans au plus, Master 2 ou équivalent avec au moins 15/20 de moyenne, préadmission dans un établissement français, séjours en France de 12 mois au plus en alternance avec le Togo (thèses en cotutelle prioritaires ; numérique et IA parmi les filières prioritaires). Candidatures closes le 24 mai 2026.", en: "French government scholarships, managed by the French embassy in Togo. The 2026-2027 call targeted doctoral students, not high-school graduates: Togolese nationality, aged 35 or under, a Master 2 or equivalent with an average of at least 15/20, pre-admission to a French institution, stays in France of 12 months at most alternating with Togo (joint-supervision PhDs prioritized; digital and AI among the priority fields). Applications closed on May 24, 2026." },

    "bourses.s5.h2": { fr: "Se former sans payer de frais de scolarité", en: "Training without paying tuition fees" },
    "bourses.s5.desc": { fr: "Une alternative ou un complément à un cursus classique, surtout pour démarrer ou tester un domaine avant de s'engager financièrement.", en: "An alternative or complement to a traditional program, especially for getting started or testing out a field before committing financially." },
    "bourses.s5.i1.p": { fr: "Académie numérique installée à Adidogomé (Lomé). Ses formations longues sont payantes (design graphique : 150 000 FCFA pour 6 mois, session ouverte depuis le 12 octobre 2026), mais elle organise régulièrement des événements gratuits, en ligne ou à Lomé : webinaires, conférences, master classes.", en: "Digital academy based in Adidogomé (Lomé). Its long courses are paid (graphic design: 150,000 FCFA for 6 months, session running since October 12, 2026), but it regularly holds free events, online or in Lomé: webinars, conferences, master classes." },
    "bourses.s5.i2.p": {
      fr: "Programme gratuit du Ministère de la Transformation Numérique, destiné aux étudiants des universités et écoles togolaises : plateforme d'apprentissage avec IA, assistant pédagogique disponible 24h/24, contenus en français et en anglais, accompagnement par des tuteurs universitaires, format hybride en ligne et présentiel.",
      en: "Free program from the Ministry of Digital Transformation, for students of Togolese universities and schools: AI-powered learning platform, teaching assistant available 24/7, content in French and English, support from university tutors, hybrid online and in-person format.",
    },
    "bourses.s5.i3.p": {
      fr: 'Formations gratuites aux métiers du numérique (développement web/mobile, marketing digital, IA, data, et depuis juillet 2026 la fabrication numérique/FabLab) portées par l\'Organisation Internationale de la Francophonie : plus de 600 jeunes togolais formés depuis 2024. Détails dans l\'<a href="ecosysteme.html#hubs">écosystème togolais</a>.',
      en: 'Free training in digital careers (web/mobile development, digital marketing, AI, data, and since July 2026 digital fabrication/FabLab) run by the International Organisation of La Francophonie (OIF): over 600 young Togolese trained since 2024. Details in the <a href="ecosysteme.html#hubs">Togolese ecosystem</a>.',
    },
    "bourses.s5.i4.h4": { fr: "Ressources en ligne gratuites", en: "Free online resources" },
    "bourses.s5.i4.p": { fr: "Les roadmaps WIYAO s'appuient largement sur des ressources gratuites (documentation officielle, cours en ligne) : de quoi apprendre l'essentiel d'un métier sans frais avant de choisir une école.", en: "WIYAO's roadmaps rely heavily on free resources (official documentation, online courses): enough to learn the essentials of a role at no cost before choosing a school." },
    "bourses.s5.i4.link": { fr: "Voir les roadmaps", en: "See the roadmaps" },

    "eco.main.h2": { fr: "Communautés et événements", en: "Communities and events" },
    "eco.main.intro": {
      fr: "Pas de programme de mentorat centralisé sur WIYAO : ces communautés en sont le meilleur substitut réel, la plupart accueillent les débutants et permettent de rencontrer des professionnels en personne. Deux proposent un mentorat structuré : MSA Togo (parcours en trois paliers) et le Kara Digital Summit.",
      en: "No centralized mentorship program on WIYAO: these communities are the closest real substitute, most welcome beginners and let you meet professionals in person. Two offer structured mentorship: MSA Togo (three-milestone path) and the Kara Digital Summit.",
    },
    "eco.sub1": { fr: "Communautés actives (à rejoindre toute l'année)", en: "Active communities (join anytime)" },
    "eco.c1.p": { fr: "Google Developer Group : meetups réguliers sur le web, le mobile et le cloud.", en: "Google Developer Group: regular meetups on web, mobile and cloud." },
    "eco.c2.p": { fr: "Communauté togolaise de développeurs Python, partenaire de la Python Software Foundation et de la Django Software Foundation. Ateliers et rencontres mensuelles, organise le PyDay Togo.", en: "Togolese community of Python developers, a partner of the Python Software Foundation and the Django Software Foundation. Monthly workshops and meetups, organizes PyDay Togo." },
    "eco.c3.h4": { fr: "CoTIA : Communauté Togolaise d'Intelligence Artificielle", en: "CoTIA: Togolese Artificial Intelligence Community" },
    "eco.c3.p": { fr: "Communauté dédiée à la démocratisation de l'IA au Togo. Organise IndabaX Togo depuis 2021, en partenariat avec le réseau panafricain Deep Learning Indaba.", en: "Community dedicated to democratizing AI in Togo. Has organized IndabaX Togo since 2021, in partnership with the pan-African Deep Learning Indaba network." },
    "eco.c4.p": { fr: "Réseau de clubs tech étudiants présent dans 14 établissements du Togo : Université de Lomé, Université de Kara, IAI-Togo, ESGIS, IPNET, DEFITECH, ESIG, Lomé Business School, UCAO-UUT, LUCAS, IFNTI (Sokodé), ESA, ESCEN et HETM des Lacs (Aného), et dans une dizaine d'autres ailleurs en Afrique (Bénin, Niger, Guinée…). Ateliers, conférences, sessions pratiques et hackathons, avec des équipes renouvelées chaque année universitaire. Si ton école figure dans la liste, rejoins son club.", en: "Network of student tech clubs in 14 institutions in Togo: University of Lomé, University of Kara, IAI-Togo, ESGIS, IPNET, DEFITECH, ESIG, Lomé Business School, UCAO-UUT, LUCAS, IFNTI (Sokodé), ESA, ESCEN and HETM des Lacs (Aného), plus a dozen more elsewhere in Africa (Benin, Niger, Guinea…). Workshops, talks, hands-on sessions and hackathons, with teams renewed every academic year. If your school is on the list, join its club." },
    "eco.c6.h4": { fr: "TDEV : Communauté des Développeurs Togolais", en: "TDEV: Togolese Developers Community" },
    "eco.c6.p": { fr: "Communauté de développeurs togolais depuis 2018, pour les 16-35 ans passionnés de numérique : talks, bourses, sessions de code et événement annuel Code Moment.", en: "Togolese developer community since 2018, for 16-35 year-olds passionate about digital tech: talks, scholarships, coding sessions and the annual Code Moment event." },
    "eco.c7.p": { fr: "Réseau/club d'affaires pour les femmes togolaises en STEM, lancé en mars 2025, 1ᵉʳ chapitre du réseau panafricain Africaines In Tech. Objectif : former 1000 femmes au numérique d'ici 2030.", en: "Network/business club for Togolese women in STEM, launched in March 2025, 1st chapter of the pan-African Africaines In Tech network. Goal: train 1,000 women in digital skills by 2030." },
    "eco.c8.p": { fr: "Communauté togolaise autour de l'éditeur de code assisté par IA Cursor : meetups et ateliers à Lomé sur les agents IA de développement, de mars à août 2026, dont un hackathon à Lomé Business School le 6 juin 2026.", en: "Togolese community around the AI-assisted code editor Cursor: meetups and workshops in Lomé on AI development agents, from March to August 2026, including a hackathon at Lomé Business School on June 6, 2026." },
    "eco.c9.p": { fr: "Communauté d'apprentissage pour débutants complets en programmation, active depuis décembre 2025 : sessions live hebdomadaires (vCODE, chaque vendredi), projets pratiques en binômes, entraide active : Python, JavaScript, C, Java. Plus de 300 membres actifs, rayonnant sur l'Afrique francophone (Togo, Bénin, Côte d'Ivoire, Sénégal).", en: "Learning community for complete programming beginners, active since December 2025: weekly live sessions (vCODE, every Friday), pair-programming practical projects, active peer support: Python, JavaScript, C, Java. Over 300 active members, reaching across French-speaking Africa (Togo, Benin, Côte d'Ivoire, Senegal)." },
    "eco.c11.p": { fr: "Communauté basée à Lomé, dédiée à l'émancipation des jeunes filles dans la tech : découverte des métiers technologiques, leadership et gestion de projet. Référencée au registre officiel de l'écosystème numérique togolais.", en: "Lomé-based community dedicated to empowering young girls in tech: discovering tech careers, leadership and project management. Listed in the official registry of the Togolese digital ecosystem." },
    "eco.c12.p": { fr: "Communauté togolaise autour du Bitcoin, basée à Lomé et référencée au registre officiel de l'écosystème numérique togolais.", en: "Togolese community around Bitcoin, based in Lomé and listed in the official registry of the Togolese digital ecosystem." },
    "eco.c13.h4": { fr: "Chapitre Togolais d'Internet Society (ISOC Togo)", en: "Togolese Chapter of Internet Society (ISOC Togo)" },
    "eco.c13.p": { fr: "Chapitre national actif depuis 2008 (600+ membres), organise le Forum togolais sur la gouvernance de l'Internet et déploie des réseaux communautaires locaux pour l'accès à Internet.", en: "National chapter active since 2008 (600+ members), organizes the Togolese Forum on Internet Governance and deploys local community networks for Internet access." },
    "eco.c14.h4": { fr: "ACAN : Académie Numérique", en: "ACAN: Digital Academy" },
    "eco.c14.p": { fr: "Centre de formation aux métiers du numérique à Adidogomé (Lomé), en trois filières : audiovisuel et image animée, design et création graphique, informatique. Plus de 500 étudiants formés, selon l'académie.", en: "Digital-skills training center in Adidogomé (Lomé), with three tracks: audiovisual and motion graphics, graphic design, computing. Over 500 students trained, according to the academy." },
    "eco.c16.p": { fr: "Chapitre togolais du programme mondial Microsoft Student Ambassadors (anciennement Microsoft Learn Student Ambassadors) : sessions en ligne et événements sur les technologies Microsoft (Azure, IA, GitHub, Copilot, Fabric), avec un parcours en trois paliers (Student Ambassador, Associate, Senior) et du mentorat.", en: "Togolese chapter of Microsoft's global Microsoft Student Ambassadors program (formerly Microsoft Learn Student Ambassadors): online sessions and events on Microsoft technologies (Azure, AI, GitHub, Copilot, Fabric), with a three-milestone path (Student Ambassador, Associate, Senior) and mentoring." },
    "eco.c22.p": { fr: "Communauté de développeurs, créateurs et innovateurs tech basée à Kara. Son site annonce des ateliers (React, DevOps, design UI/UX) et un hackathon à l'Université de Kara en mars et avril 2026.", en: "Community of developers, creators and tech innovators based in Kara. Its website lists workshops (React, DevOps, UI/UX design) and a hackathon at the University of Kara in March and April 2026." },
    "eco.c24.p": { fr: "Communauté togolaise des utilisateurs de LinkedIn : rencontres de réseautage autour des opportunités professionnelles, avec des éditions communes menées aux côtés des chapitres sœurs du Bénin et de la Côte d'Ivoire.", en: "Togolese community of LinkedIn users: networking meetups around professional opportunities, with joint editions held alongside sister chapters in Benin and Côte d'Ivoire." },
    "eco.c25.p": { fr: "Programme mondial de Google pour les femmes dans la tech, porté à Lomé par GDG Lomé : un événement pour la Journée internationale des droits des femmes (IWD) chaque année de 2023 à 2025, le dernier le 26 avril 2025.", en: "Google's global program for women in tech, run in Lomé by GDG Lomé: an International Women's Day (IWD) event every year from 2023 to 2025, the latest on April 26, 2025." },
    "eco.c26.p": { fr: "École de programmation en ligne et gratuite, fondée en Guinée, qui développe une communauté active au Togo via un programme d'ambassadeurs (candidatures pour la cohorte 2027 closes le 30 septembre 2026) : apprentissage du développement web entre pairs, application mobile de révision.", en: "Free online programming school founded in Guinea, now building an active community in Togo through an ambassador program (applications for the 2027 cohort closed on September 30, 2026): peer-based web development learning, with a mobile revision app." },
    "eco.c28.p": { fr: "ONG togolaise de formation aux compétences STEM et à l'entrepreneuriat numérique, active dans 9 pays d'Afrique dont le Togo.", en: "Togolese NGO providing STEM skills and digital entrepreneurship training, active in 9 African countries including Togo." },

    "eco.sub2": { fr: "Événements annuels ou ponctuels", en: "Annual or one-off events" },
    "eco.e1.p": { fr: 'Conférence annuelle organisée par GDG Lomé, la communauté locale des Google Developer Groups. Prochaine édition sur la page <a href="actualites.html">Actualités</a>.', en: 'Annual conference organized by GDG Lomé, the local Google Developer Groups community. Next edition on the <a href="actualites.html">News</a> page.' },
    "eco.e2.p": { fr: "Conférence nationale de la communauté Python togolaise.", en: "National conference of the Togolese Python community." },
    "eco.e3.p": { fr: "1ʳᵉ édition tenue début août 2026 à Kara : rapprocher la formation numérique des jeunes en dehors de Lomé, avec un programme de mentorat personnalisé. Extension prévue vers Dapaong, Sokodé, Atakpamé et Notsè.", en: "1st edition held in early August 2026 in Kara: bringing digital training closer to young people outside Lomé, with a personalized mentoring program. Expansion planned to Dapaong, Sokodé, Atakpamé and Notsè." },
    "eco.e4.p": { fr: "Événement technologique annuel à Lomé (3ᵉ édition en 2025) qui forme, informe et récompense les jeunes talents numériques togolais : ateliers pratiques (Docker, Laravel, sécurité API...), concours Prix TCR, pitchs de projets et vitrine de startups.", en: "Annual tech event in Lomé (3rd edition in 2025) that trains, informs and rewards young Togolese digital talent: hands-on workshops (Docker, Laravel, API security...), the TCR Prize competition, project pitches and a startup showcase." },
    "eco.e5.h4": { fr: "GRIT : Grande Rencontre de l'Innovation Technologique", en: "GRIT: Grand Meeting for Technological Innovation" },
    "eco.e5.p": { fr: "Événement phare annuel de l'écosystème tech togolais, organisé avec GIZ Togo/ProDigiT : startups sélectionnées, bootcamp, rencontres avec investisseurs et partenaires stratégiques.", en: "Flagship annual event of the Togolese tech ecosystem, organized with GIZ Togo/ProDigiT: selected startups, bootcamp, meetings with investors and strategic partners." },
    "eco.e6.p": { fr: "Rassemblement annuel des communautés tech togolaises à l'Institut français du Togo : tables rondes, conférences et expositions pour rencontrer leur public.", en: "Annual gathering of Togolese tech communities at the French Institute of Togo: round tables, talks and exhibitions to meet their audience." },
    "eco.e7.p": { fr: "Conférence numérique de Lomé (2ᵉ édition tenue les 12-13 août 2026 à l'Hôtel 2 Février) : entrepreneuriat numérique, IA, cybersécurité, développement des compétences, numérique responsable et inclusion des femmes dans la tech, avec hackathon et espace d'exposition.", en: "Lomé digital conference (2nd edition held August 12-13, 2026 at the February 2 Hotel, Hôtel 2 Février): digital entrepreneurship, AI, cybersecurity, skills development, responsible digital practices and women's inclusion in tech, with a hackathon and exhibition space." },
    "eco.e8.p": { fr: "Grand salon technologique récurrent (5ᵉ édition en juillet 2026 à l'UniPod) : panels IA, cybersécurité, cloud et blockchain, exposition de solutions numériques et rencontres B2B.", en: "Major recurring tech expo (5th edition in July 2026 at UniPod): AI, cybersecurity, cloud and blockchain panels, digital solutions exhibition and B2B meetings." },
    "eco.e9.h4": { fr: "CTF National : Capture The Flag", en: "National CTF: Capture The Flag" },
    "eco.e9.p": { fr: "Compétition nationale annuelle de cybersécurité organisée par l'ANCy et Cyber Defense Africa. 3ᵉ édition les 28-29 novembre 2025 à Lomé : plus de 350 candidats en présélection en ligne, 10 équipes en finale sur 24h (cryptographie, exploitation de vulnérabilités, rétro-ingénierie, forensique numérique), jusqu'à 2 000 000 FCFA pour l'équipe gagnante. Édition 2026 : présélection en ligne les 6 et 7 novembre, finale à Lomé les 19 et 20 novembre ; réservée aux candidats de nationalité togolaise résidant au Togo (pièce d'identité et extrait de casier judiciaire de moins de 3 mois), inscriptions sur ctf.tg.", en: "Annual national cybersecurity competition organized by ANCy and Cyber Defense Africa. 3rd edition on Nov 28-29, 2025 in Lomé: over 350 candidates in online pre-selection, 10 teams in a 24-hour final (cryptography, vulnerability exploitation, reverse engineering, digital forensics), up to 2,000,000 FCFA for the winning team. 2026 edition: online pre-selection on November 6 and 7, final in Lomé on November 19 and 20; open to Togolese nationals living in Togo (valid ID and a criminal record extract less than 3 months old), registration on ctf.tg." },
    "eco.e10.p": { fr: "Événement annuel togolais dédié au commerce électronique (3ᵉ édition tenue en ligne du 20 au 23 août 2024) : conférences avec des acteurs clés du secteur, experts et institutions sur les enjeux et opportunités du e-commerce en Afrique. Aucune édition 2025 ou 2026 confirmée au moment de la rédaction.", en: "Annual Togolese event dedicated to e-commerce (3rd edition held online August 20-23, 2024): talks with key sector players, experts and institutions on e-commerce challenges and opportunities in Africa. No 2025 or 2026 edition confirmed at the time of writing." },
    "eco.e11.p": { fr: "Atelier gratuit d'une journée pour initier des femmes à la programmation (Python/Django), organisé à distance le 4 février 2023 : antenne togolaise du mouvement international Django Girls. Édition unique à ce jour, pas de suite confirmée.", en: "Free one-day workshop introducing women to programming (Python/Django), held remotely on February 4, 2023: Togolese chapter of the international Django Girls movement. A one-off edition so far, no follow-up confirmed." },
    "eco.e12.h4": { fr: "Hackathons Nationaux d'Innovation CIF", en: "CIF National Innovation Hackathons" },
    "eco.e12.p": { fr: "Hackathon organisé en septembre 2026 par la Confédération des Institutions Financières d'Afrique de l'Ouest (CIF) dans 5 pays dont le Togo : concevoir des outils numériques pour les coopératives financières de la zone UEMOA. Au Togo, l'équipe UMBAJI TEAM l'a emporté (1 500 000 FCFA) avec Yodi Score, un outil de notation des demandes de microcrédit qui fonctionne même sans smartphone, et s'est qualifiée pour la finale régionale de Ouagadougou (grand prix : 4 000 000 FCFA ; résultat pas encore publié au moment de la rédaction).", en: "Hackathon organized in September 2026 by the West African Confederation of Financial Institutions (CIF) across 5 countries including Togo: designing digital tools for UEMOA-zone financial cooperatives. In Togo, UMBAJI TEAM won (1,500,000 FCFA) with Yodi Score, a microcredit application scoring tool that works even without a smartphone, and qualified for the regional final in Ouagadougou (grand prize: 4,000,000 FCFA; result not yet published at the time of writing)." },

    "eco.femmes.h2": { fr: "Femmes dans la tech togolaise", en: "Women in Togolese tech" },
    "eco.femmes.intro": { fr: "Programmes, bourses et communautés dédiés aux femmes et jeunes filles dans le numérique togolais : le détail complet de chacun se trouve sur sa page d'origine, liée ci-dessous.", en: "Programs, scholarships and communities dedicated to women and girls in Togolese tech: the full detail for each lives on its own page, linked below." },
    "eco.f1.p": { fr: "Programme national de l'Agence Togo Digital pour l'autonomisation numérique des femmes, lancé le 14 juin 2024 : formation à l'entrepreneuriat (Nana Tech Entrepreneures), immersion technique intensive (Nana Tech Immersion), incubation de projets numériques (Nana Tech Lab) et tournées de sensibilisation dans plusieurs villes du pays.", en: "National program by the Togo Digital Agency for women's digital empowerment, launched June 14, 2024: entrepreneurship training (Nana Tech Entrepreneures), intensive technical immersion (Nana Tech Immersion), digital project incubation (Nana Tech Lab) and outreach tours in several cities across the country." },
    "eco.f2.p": { fr: 'Réseau togolais de femmes en STEM, 1ᵉʳ chapitre du réseau panafricain Africaines In Tech : objectif 1000 femmes formées au numérique d\'ici 2030. Fiche complète dans <a href="#communautes">Communautés &amp; événements</a>.', en: 'Togolese network of women in STEM, 1st chapter of the pan-African Africaines In Tech network: goal of training 1,000 women in digital skills by 2030. Full profile in <a href="#communautes">Communities &amp; events</a>.' },
    "eco.f3.p": { fr: 'Antenne togolaise du programme mondial Google pour les femmes en tech, adossée à GDG Lomé : ateliers sur l\'équité de genre et événements comme le WTM IWD. Fiche complète dans <a href="#communautes">Communautés &amp; événements</a>.', en: 'Togolese chapter of Google\'s global program for women in tech, run alongside GDG Lomé: workshops on gender equity and events like WTM IWD. Full profile in <a href="#communautes">Communities &amp; events</a>.' },
    "eco.f4.p": { fr: 'Incubateur porté par le Centre Entrepreneurial des Femmes d\'Affaires (FEFA Togo), tourné vers les jeunes femmes de 18 à 35 ans passionnées de numérique. Fiche complète dans <a href="#hubs">Hubs &amp; incubateurs</a>.', en: 'Incubator run by the Business Women\'s Entrepreneurial Center (FEFA Togo), aimed at young women aged 18 to 35 passionate about digital tech. Full profile in <a href="#hubs">Hubs &amp; incubators</a>.' },
    "eco.f5.h4": { fr: "Bourse « Étoile Scientifique » (UCAO-UUT)", en: "\"Scientific Star\" Scholarship (Étoile Scientifique, UCAO-UUT)" },
    "eco.f5.p": { fr: '200 000 FCFA/an réservés aux étudiantes en informatique à l\'UCAO-UUT, plus réduction fratrie. Détails sur la page <a href="bourses-financement.html#ecoles">Bourses &amp; financement</a>.', en: '200,000 FCFA/year reserved for female computer science students at UCAO-UUT, plus a sibling discount. Details on the <a href="bourses-financement.html#ecoles">Scholarships &amp; funding</a> page.' },
    "eco.f6.h4": { fr: "Bourse Learn Africa Canarias", en: "Learn Africa Canarias Scholarship" },
    "eco.f6.p": { fr: "Plus de 450 bourses en 2026 pour des cours en ligne donnés par des universités des Canaries aux étudiantes et diplômées de tout le continent africain, portées par la Fondation Femmes pour l'Afrique. Détails sur la page <a href=\"bourses-financement.html#international\">Bourses &amp; financement</a>.", en: "Over 450 scholarships in 2026 for online courses taught by Canary Islands universities to female students and graduates from across the African continent, run by the Women for Africa Foundation. Details on the <a href=\"bourses-financement.html#international\">Scholarships &amp; funding</a> page." },
    "eco.femmes.outro": { fr: 'Des parcours de femmes togolaises dans la tech, racontés en détail : page <a href="temoignages.html">Témoignages</a>.', en: 'Togolese women\'s tech journeys, told in detail: the <a href="temoignages.html">Testimonials</a> page.' },

    "eco.hubs.h2": { fr: "Hubs et incubateurs", en: "Hubs and incubators" },
    "eco.h1.p": {
      fr: 'Incubateur national inauguré le 7 mai 2026 (financement Banque mondiale), avec Djanta Academy (formation),\n           Djanta Start (incubation), Nana Tech (entrepreneuriat féminin) et Djanta Lab (recherche). Accompagnera\n           environ 72 startups togolaises entre juin 2026 et juillet 2027, et lance le fonds « Start » (subventions\n           d\'environ 15 000 € pour une trentaine d\'entrepreneurs).',
      en: 'National incubator opened on May 7, 2026 (World Bank funded), with Djanta Academy (training), Djanta Start (incubation), Nana Tech (women\'s entrepreneurship) and Djanta Lab (research). Will support around 72 Togolese startups between June 2026 and July 2027, and launches the "Start" fund (grants of around €15,000 for about thirty entrepreneurs).',
    },
    "eco.h2.p": { fr: "Incubateur pour jeunes startups technologiques, inspiré du modèle rwandais K-Lab.", en: "Incubator for young tech startups, inspired by the Rwandan K-Lab model." },
    "eco.h3.p": { fr: "Incubateur formant des jeunes au numérique et à l'entrepreneuriat, en partenariat avec l'OIF.", en: "Incubator training young people in digital skills and entrepreneurship, in partnership with the OIF." },
    "eco.h4.h4": { fr: 'D-CLIC : « Formez-vous au numérique avec l\'OIF »', en: 'D-CLIC: "Get trained in digital skills with the OIF"' },
    "eco.h4.p": {
      fr: "Programme de formation gratuite aux métiers du numérique porté par l'Organisation Internationale de la Francophonie : plus de 600 jeunes formés au Togo entre 2024 et 2026 (développement web/mobile, marketing digital, IA, analyse de données). Une cohorte inédite lancée le 23 juillet 2026 forme aussi aux métiers de la fabrication numérique (impression 3D, FabLab), avec CUBE, UniPod, le Centre CAVRIS (Université de Kara) et Energy Generation.",
      en: "Free training program in digital careers run by the International Organisation of La Francophonie (OIF): over 600 young people trained in Togo between 2024 and 2026 (web/mobile development, digital marketing, AI, data analysis). A new cohort launched on July 23, 2026 also trains in digital fabrication careers (3D printing, FabLab), with CUBE, UniPod, the CAVRIS Center (University of Kara) and Energy Generation.",
    },
    "eco.h5.p": {
      fr: "Premier incubateur de startups au Togo porté par le Centre Entrepreneurial des Femmes d'Affaires (FEFA Togo), actif depuis 2016 : accompagnement en entrepreneuriat, gestion administrative et financière, innovation, TIC, marketing, particulièrement tourné vers les jeunes femmes de 18 à 35 ans passionnées de numérique.",
      en: "Togo's first startup incubator, run by the Businesswomen's Entrepreneurship Center (FEFA Togo), active since 2016: support in entrepreneurship, administrative and financial management, innovation, ICT, marketing, particularly aimed at young women aged 18-35 passionate about digital tech.",
    },
    "eco.h6.p": { fr: "Incubateur public ouvert le 21 mai 2021 à Dapaong (Savanes), deuxième du réseau Nunya Lab après Lomé, porté par le FAIEJ avec le soutien du PNUD. Sa 3ᵉ cohorte, recrutée début 2023 (la plus récente annoncée publiquement à notre connaissance), visait les jeunes de 18 à 35 ans, avec jusqu'à 1 million FCFA de financement par projet en agriculture, élevage, environnement, artisanat, commerce, transport et services. « Banm » signifie « le savoir » en moba.", en: "Public incubator opened on May 21, 2021 in Dapaong (Savanes region), the second in the Nunya Lab network after Lomé, run by FAIEJ with UNDP support. Its 3rd cohort, recruited in early 2023 (the most recent one announced publicly, as far as we know), targeted 18-35-year-olds, with up to 1 million FCFA in funding per project in agriculture, livestock, the environment, crafts, trade, transport and services. “Banm” means “knowledge” in Moba." },
    "eco.h7.p": { fr: "Laboratoire de fabrication numérique créé en août 2012 à Lomé, qui se présente comme « le premier espace africain de démocratie technologique ».", en: "Digital fabrication lab founded in August 2012 in Lomé, which describes itself as \"the first African space of Technology Democracy\"." },
    "eco.h8.p": { fr: "Incubateur public régional lancé le 27 juillet 2021 à Kara avec le PNUD, troisième après ceux de Lomé et de Dapaong (Banm Lab). Actif en 2025 : programme d'incubation annuel pour les jeunes porteurs de projets, avec par exemple une formation à la fiscalité des entreprises animée par l'Office togolais des recettes le 30 septembre 2025.", en: "Regional public incubator launched on July 27, 2021 in Kara with UNDP, the third after those in Lomé and Dapaong (Banm Lab). Active in 2025: a yearly incubation program for young project leaders, including, for example, a training on business taxation led by the Togolese Revenue Office (OTR) on September 30, 2025." },
    "eco.h10.p": {
      fr: "Pôle universitaire d'innovation et de technologie de l'Université de Lomé, ouvert en février 2025. Financé par le PNUD (programme Timbuktoo, 1 milliard+ FCFA) : laboratoires, incubation et mentorat pour jeunes entrepreneurs et chercheurs. Le programme Campus Afrique : Timbuktoo (PNUD/UNESCO), mis en œuvre par UNIPOD, s'est étendu à l'Université de Kara en juillet 2026 après une première phase à Lomé.",
      en: "University of Lomé's innovation and technology hub, opened in February 2025. Funded by UNDP (Timbuktoo program, 1 billion+ FCFA): labs, incubation and mentoring for young entrepreneurs and researchers. The Campus Afrique: Timbuktoo program (UNDP/UNESCO), implemented by UNIPOD, expanded to the University of Kara in July 2026 after an initial phase in Lomé.",
    },
    "eco.h11.p": {
      fr: "Programme lancé le 3 octobre 2025 par IYBA-SEED Togo, avec l'Accélérateur DAGBA, l'incubateur Africa Coworkers et 10 universités publiques et privées : pitchs intra-universitaires, bootcamp, prototypage et mise en relation avec des investisseurs. Chiffres annoncés : 5000 étudiants impliqués, 100 projets accompagnés, 10 transformés en entreprises, 10 000 000 FCFA de fonds d'amorçage.",
      en: "Program launched October 3, 2025 by IYBA-SEED Togo, with the DAGBA Accelerator, the Africa Coworkers incubator and 10 public and private universities: intra-university pitches, bootcamp, prototyping and connecting with investors. Announced figures: 5,000 students involved, 100 projects supported, 10 turned into companies, 10,000,000 FCFA in seed funding.",
    },
    "eco.h12.p": {
      fr: "École de code sans condition de diplôme, lancée le 4 mai 2026 par le Ministère de la Transformation Numérique, en partenariat avec le Groupe AXIAN (via Yas Togo), le réseau international 42 et le soutien de la France : 1ᵉʳ campus 42 d'Afrique de l'Ouest. Pédagogie par projets, apprentissage entre pairs et autonomie ; formations en programmation, data et intelligence artificielle pour plusieurs centaines de jeunes par an.",
      en: "Diploma-free coding school launched May 4, 2026 by the Ministry of Digital Transformation, in partnership with the AXIAN Group (via Yas Togo), the international 42 network and support from France: West Africa's 1st 42 campus. Project-based learning, peer-to-peer teaching and autonomy; training in programming, data and AI for several hundred young people a year.",
    },
    "eco.h13.p": {
      fr: "Communauté togolaise fondée en septembre 2022 par trois jeunes passionnés de technologie : formations pratiques en compétences numériques, intelligence artificielle, cybersécurité et électronique/Arduino, avec une approche « learning by doing ». Ambitionne de devenir un centre de référence en innovation technologique pour les jeunes, avec FabLab et formations certifiantes.",
      en: "Togolese community founded in September 2022 by three young tech enthusiasts: hands-on training in digital skills, artificial intelligence, cybersecurity and electronics/Arduino, with a \"learning by doing\" approach. Aims to become a reference center for youth tech innovation, with a FabLab and certifying training programs.",
    },

    "eco.startups.h2": { fr: "Startups togolaises", en: "Togolese startups" },
    "eco.startups.intro": { fr: 'Un échantillon de startups tech togolaises actives et vérifiées, par secteur. Liste non exhaustive : le <a href="#institutions">portail officiel de l\'écosystème numérique</a> référence 170 startups togolaises au total.', en: 'A sample of active, verified Togolese tech startups, by sector. Non-exhaustive list: the <a href="#institutions">official digital ecosystem portal</a> lists 170 Togolese startups in total.' },
    "eco.s1.p": { fr: "Premier portail togolais de petites annonces automobiles, actif (annonces récentes confirmées).", en: "Togo's first classifieds portal for cars, active (recent listings confirmed)." },
    "eco.s2.p": { fr: "Plateforme numérique de communication entre écoles, familles et élèves, utilisée notamment pour la digitalisation des résultats d'examens.", en: "Digital communication platform between schools, families and students, used in particular to digitize exam results." },
    "eco.s3.p": { fr: "Marque d'ECO-PACKAGING HOUSE, entreprise enregistrée en 2018 à Agoè (Lomé) : elle recycle le papier des sacs de ciment en sacs réutilisables et produit des sacs et emballages en papier biodégradables pour les boutiques, les pharmacies et les boulangeries.", en: "Brand of ECO-PACKAGING HOUSE, a company registered in 2018 in Agoè (Lomé): it recycles cement-bag paper into reusable bags and makes biodegradable paper bags and packaging for shops, pharmacies and bakeries." },
    "eco.s3.link": { fr: "civicbag.com (site archivé)", en: "civicbag.com (archived site)" },
    "eco.s4.p": { fr: "Plateforme fondée en 2015 qui met en relation les acteurs du secteur agricole togolais, plus de 6000 agriculteurs inscrits.", en: "Platform founded in 2015 that connects players in the Togolese agricultural sector, with over 6,000 registered farmers." },
    "eco.s5.p": { fr: "Coopérative fondée en 2014, production de chocolat bio togolais selon des méthodes traditionnelles, distinguée par plusieurs prix internationaux.", en: "Cooperative founded in 2014, producing organic Togolese chocolate using traditional methods, recognized with several international awards." },
    "eco.s6.p": { fr: "Plateforme d'e-santé développée en 2018 avec le Ministère de la Santé et l'UNFPA : suivi du cycle menstruel, de la grossesse et consultation en ligne, plus de 10 000 abonnées.", en: "E-health platform developed in 2018 with the Ministry of Health and UNFPA: menstrual cycle and pregnancy tracking and online consultations, with over 10,000 subscribers." },

    "eco.inst.h2": { fr: "Institutions publiques et employeurs numériques", en: "Public institutions and digital employers" },
    "eco.i1.p": { fr: "Agence publique pilotant la digitalisation des démarches administratives au Togo. Recrute régulièrement sur des postes tech variés : développeurs, architectes, UX/UI, QA, Scrum Master, data.", en: "Public agency leading the digitalization of administrative processes in Togo. Regularly hires for a range of tech roles: developers, architects, UX/UI, QA, Scrum Master, data." },
    "eco.i2.p": {
      fr: "Partenariat entre le Ministère togolais de la Transformation Numérique et CEGA (UC Berkeley), avec le soutien de Google.org : science des données et IA au service des politiques publiques (santé, agriculture, sécurité routière). A notamment recruté des data scientists repérés via un défi organisé sur Zindi (plateforme panafricaine de compétitions de data science) pour prédire la demande en connectivité internet dans les zones mal desservies.",
      en: "Partnership between the Togolese Ministry of Digital Transformation and CEGA (UC Berkeley), with support from Google.org: data science and AI in service of public policy (health, agriculture, road safety). Notably recruited data scientists spotted through a challenge run on Zindi (pan-African data science competition platform) to predict internet connectivity demand in underserved areas.",
    },
    "eco.i3.h4": { fr: "Ministère de l'Efficacité du Service Public et de la Transformation Numérique", en: "Ministry of Public Service Efficiency and Digital Transformation" },
    "eco.i3.p": { fr: "Ministère de tutelle de la stratégie numérique togolaise.", en: "Ministry overseeing Togo's digital strategy." },
    "eco.i4.p": {
      fr: "Collectif national lancé le 24 octobre 2025 réunissant 13 startups tech togolaises fondatrices (Gozem, Semoa, Édolé Africa, Solimi, Miapay, Kondjigbalẽ, Anaxar, Kaba Delivery...) : plus de 2 milliards FCFA de chiffre d'affaires cumulé et une centaine d'emplois directs. Trois startups membres actives (Antamix, E-Business Afrique, Umbaji) l'ont rejoint depuis. Sert de pont entre startups, institutions publiques et investisseurs.",
      en: "National collective launched October 24, 2025 bringing together 13 founding Togolese tech startups (Gozem, Semoa, Édolé Africa, Solimi, Miapay, Kondjigbalẽ, Anaxar, Kaba Delivery...): over 2 billion FCFA in combined revenue and around a hundred direct jobs. Three active member startups (Antamix, E-Business Afrique, Umbaji) have joined since. Serves as a bridge between startups, public institutions and investors.",
    },
    "eco.i5.h4": { fr: "Portail de l'Écosystème Numérique Togolais", en: "Togolese Digital Ecosystem Portal" },
    "eco.i5.p": { fr: "Annuaire officiel du gouvernement recensant les acteurs du numérique togolais : 170 startups, 33 structures d'accompagnement (SAEI), 55 PME et 9 ONG/associations référencées, filtrables par ville et secteur d'activité.", en: "Official government directory listing Togolese digital tech players: 170 startups, 33 support structures (SAEI), 55 SMEs and 9 NGOs/associations listed, filterable by city and industry." },
    "eco.i6.p": { fr: "Chapitre togolais du réseau panafricain Open Source Community Africa (35 chapitres à travers le continent) : rencontres mensuelles, contribution à des projets open source, festival annuel Open Source Festival.", en: "Togolese chapter of the pan-African Open Source Community Africa network (35 chapters across the continent): monthly meetups, contributing to open source projects, annual Open Source Festival." },
    "eco.i7.h4": { fr: "SIN : Société d'Infrastructures Numériques", en: "SIN: Digital Infrastructure Company" },
    "eco.i7.p": { fr: "Société d'État qui déploie et gère les infrastructures numériques stratégiques du Togo : plus de 1 000 km de fibre optique, le data center national de Lomé (premier carrier hotel du pays, inauguré en juin 2021), le point d'échange Internet national et, via la coentreprise CSquared Woezon (44 % SIN, 56 % CSquared), l'exploitation du câble sous-marin Equiano. Elle recrute des profils techniques en CDI : ingénieur réseau, technicien support, chef de projet IT, responsable des systèmes d'information (offres publiées en mai 2025).", en: "State-owned company that deploys and manages Togo's strategic digital infrastructure: more than 1,000 km of fiber optic cable, the national data center in Lomé (the country's first carrier hotel, opened in June 2021), the national Internet exchange point and, through the CSquared Woezon joint venture (44% SIN, 56% CSquared), the operation of the Equiano submarine cable. It hires technical profiles on permanent contracts: network engineer, support technician, IT project manager, head of information systems (openings posted in May 2025)." },
    "eco.i7.link": { fr: "sin.tg (copie archivée, avril 2026)", en: "sin.tg (archived copy, April 2026)" },
    "eco.i8.h4": { fr: "FAIEJ : Fonds d'Appui aux Initiatives Économiques des Jeunes", en: "FAIEJ: Youth Economic Initiatives Support Fund" },
    "eco.i8.p": { fr: "Institution publique togolaise de financement de l'entrepreneuriat des jeunes, a numérisé l'accompagnement des porteurs de projets avec l'application ADACE, développée avec le PNUD (2024).", en: "Togolese public institution funding youth entrepreneurship, digitized support for project owners with the ADACE app, developed with UNDP (2024)." },

    "eco.cyber.h2": { fr: "Cybersécurité et gouvernance", en: "Cybersecurity and governance" },
    "eco.cy1.h4": { fr: "ANCy : Agence Nationale de la Cybersécurité", en: "ANCy: National Cybersecurity Agency" },
    "eco.cy1.p": { fr: "Autorité nationale de sécurité des systèmes d'information, créée par la loi n°2018-026. Sensibilisation, stratégie et compétitions Capture The Flag.", en: "National information systems security authority, created by law n°2018-026. Awareness, strategy and Capture The Flag competitions." },
    "eco.cy2.p": {
      fr: "Équipe togolaise de compétition Capture The Flag (CTF) en cybersécurité, aux résultats internationaux vérifiables : 1ʳᵉ place au Hackerlab CTF 2025, 2ᵉ place aux qualifications Cyberlympics CTF 2023 (54 pays africains éligibles), 3ᵉ place au Sub-Saharan CTF 2023 (150+ équipes), 4ᵉ place à l'ECOWAS CTF 2024 et au picoCTF Afrique 2025, 73ᵉ place sur 2968 équipes au NahamCon CTF 2025.",
      en: "Togolese Capture The Flag (CTF) cybersecurity competition team, with verifiable international results: 1st place at Hackerlab CTF 2025, 2nd place at Cyberlympics CTF 2023 qualifiers (54 eligible African countries), 3rd place at Sub-Saharan CTF 2023 (150+ teams), 4th place at ECOWAS CTF 2024 and picoCTF Africa 2025, 73rd out of 2,968 teams at NahamCon CTF 2025.",
    },
    "eco.cy3.p": { fr: "Centre national de réponse aux incidents de cybersécurité, opéré par Cyber Defense Africa pour le compte de l'ANCy.", en: "National cybersecurity incident response center, operated by Cyber Defense Africa on behalf of the ANCy." },
    "eco.cy4.h4": { fr: "IPDCP : Instance de Protection des Données à Caractère Personnel", en: "IPDCP: Personal Data Protection Authority" },
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
    "eco.cy9.p": { fr: "Forum togolais dédié à la protection des données personnelles ; 2ᵉ édition tenue les 28-29 juillet 2026 à Lomé.", en: "Togolese forum dedicated to personal data protection; 2nd edition held July 28-29, 2026 in Lomé." },
    "eco.cy10.p": { fr: "Chapitre national de l'Open Worldwide Application Security Project (OWASP), organisation internationale de référence pour la sécurité des applications. Diffusion des ressources OWASP, événements techniques (séminaires, ateliers, challenges CTF) et soutien aux étudiants et professionnels togolais.", en: "National chapter of the Open Worldwide Application Security Project (OWASP), the leading international organization for application security. Distributes OWASP resources, runs technical events (seminars, workshops, CTF challenges) and supports Togolese students and professionals." },

    "eco.res.h2": { fr: "Ressources francophones en ligne", en: "French-language online resources" },
    "eco.r1.p": { fr: "Cours structurés en français, du développement web à la data.", en: "Structured courses in French, from web development to data." },
    "eco.r2.h4": { fr: "MDN Web Docs (français)", en: "MDN Web Docs (French)" },
    "eco.r2.p": { fr: "Référence technique pour HTML, CSS et JavaScript.", en: "Technical reference for HTML, CSS and JavaScript." },
    "eco.r3.p": { fr: "Parcours gratuits et certifiants en programmation, avec une communauté active. Pas de version française : les cours sont en anglais.", en: "Free programming tracks with certifications and an active community. No French version: the courses are in English." },
    "eco.r4.p": { fr: "Plateforme française de tutoriels vidéo pour apprendre le développement web : HTML/CSS/JS, PHP, Laravel, React.", en: "French video tutorial platform for learning web development: HTML/CSS/JS, PHP, Laravel, React." },
    "eco.r5.p": { fr: "Communauté francophone de développeurs : forums, tutoriels et actualités couvrant la plupart des langages de programmation.", en: "French-speaking developer community: forums, tutorials and news covering most programming languages." },
    "eco.r6.p": { fr: "Plateforme associative et gratuite de partage de connaissances, avec une section importante dédiée à la programmation et à l'algorithmique.", en: "Free, community-run knowledge-sharing platform, with a large section dedicated to programming and algorithms." },
    "eco.r7.p": { fr: "Référence francophone depuis les années 2000 pour les tutoriels HTML, CSS, JavaScript et les standards du web.", en: "French-language reference since the 2000s for HTML, CSS, JavaScript tutorials and web standards." },
    "eco.r8.p": { fr: "Première plateforme francophone de MOOC au monde, portée par des universités et écoles françaises : plus de 550 cours gratuits, dont plusieurs en informatique et programmation (introduction à Python, algorithmique, socle en informatique).", en: "The world's first French-language MOOC platform, backed by French universities and schools: over 550 free courses, including several in computer science and programming (intro to Python, algorithms, computing fundamentals)." },
    // Textes fixes traduits le 2026-11-07 (Écoles : série de bac et lexique ; titres de fiches).
    "ecoles.fees.note": { fr: "Frais trop élevés ? La page <a href=\"bourses-financement.html\">Bourses &amp; financement</a> recense les bourses proposées par ces écoles, la bourse d'État et d'autres solutions vérifiées. Une question sur l'agrément ou les frais ? Voir la <a href=\"faq.html#ecoles-frais\">FAQ écoles &amp; frais</a>.", en: "Fees too high? The <a href=\"bourses-financement.html\">Scholarships &amp; funding</a> page lists the scholarships offered by these schools, the State scholarship and other verified options. A question about accreditation or fees? See the <a href=\"faq.html#ecoles-frais\">schools &amp; fees FAQ</a>." },
    "ecoles.bac.h2": { fr: "Quelle série de bac pour quelle filière ?", en: "Which Bac series for which program?" },
    "ecoles.bac.cd.h": { fr: "Séries C et D (Mathématiques, Sciences Physiques / SVT)", en: "Series C and D (Mathematics, Physical Sciences / Life and Earth Sciences)" },
    "ecoles.bac.cd.p": { fr: "Les plus demandées pour l'informatique au sens large : développement, cybersécurité, data, infrastructure. C'est la série la plus « généraliste » pour entrer dans le tech togolais, y compris pour les concours publics (Université de Kara, École Nationale Polytechnique).", en: "The most sought-after for computing in the broad sense: development, cybersecurity, data, infrastructure. It's the most \"general\" series for getting into Togolese tech, including for public entrance exams (University of Kara, National Polytechnic School)." },
    "ecoles.bac.e.h": { fr: "Série E (Mathématiques et Technique)", en: "Series E (Mathematics and Technology)" },
    "ecoles.bac.e.p": { fr: "Très recherchée pour les cursus ingénieur et les filières réseaux/systèmes : profil technique apprécié à l'IAI-Togo, UCAO-UUT et dans les écoles polytechniques.", en: "Highly valued for engineering tracks and networks/systems programs: a technical profile appreciated at IAI-Togo, UCAO-UUT and polytechnic schools." },
    "ecoles.bac.f.h": { fr: "Séries F1 à F4 (Bac technique : construction, électronique, électrotechnique, génie civil)", en: "Series F1 to F4 (technical Bac: construction, electronics, electrical engineering, civil engineering)" },
    "ecoles.bac.f.p": { fr: "Un bon point d'entrée pour l'infrastructure, les réseaux, l'IoT et les systèmes embarqués : les bases en électronique/systèmes se transposent bien vers ces filières.", en: "A good entry point for infrastructure, networks, IoT and embedded systems: the basics in electronics/systems carry over well to these programs." },
    "ecoles.bac.g.h": { fr: "Série G (Techniques administratives et de gestion)", en: "Series G (Administrative and management techniques)" },
    "ecoles.bac.g.p": { fr: "Adaptée à l'informatique de gestion, à la gestion &amp; management et au marketing digital : moins aux filières très techniques (réseaux, cybersécurité).", en: "Suited to business computing, management and digital marketing: less so to very technical programs (networks, cybersecurity)." },
    "ecoles.bac.ab.h": { fr: "Séries A et B (Littéraire, Économique)", en: "Series A and B (Literature, Economics)" },
    "ecoles.bac.ab.p": { fr: "Ne ferment pas la porte à la tech : marketing digital, product management, UX writing et community management restent accessibles, parfois avec une remise à niveau en logique/maths selon l'école.", en: "They don't close the door to tech: digital marketing, product management, UX writing and community management remain accessible, sometimes with a refresher in logic/math depending on the school." },
    "ecoles.lex.h2": { fr: "Lexique", en: "Glossary" },
    "ecoles.lex.intro": { fr: "Les sigles qui reviennent sur ce site et sur les sites des écoles togolaises.", en: "The acronyms that come up on this site and on Togolese schools' websites." },
    "ecoles.lex.bt": { fr: "Brevet de Technicien : diplôme professionnalisant en 3 ans, accessible dès le BEPC (avant le Bac), distinct du BTS.", en: "Brevet de Technicien (technician certificate): a 3-year vocational diploma, open from the BEPC (before the Bac), distinct from the BTS." },
    "ecoles.lex.bts": { fr: "Brevet de Technicien Supérieur : diplôme professionnalisant en 2 ans après le Bac.", en: "Brevet de Technicien Supérieur (higher technician certificate): a 2-year vocational diploma after the Bac." },
    "ecoles.lex.licence.h": { fr: "Licence", en: "Licence (bachelor's)" },
    "ecoles.lex.licence": { fr: "Diplôme en 3 ans après le Bac (Bac+3), académique ou professionnelle selon le parcours.", en: "A 3-year degree after the Bac (Bac+3), academic or professional depending on the track: the equivalent of a bachelor's degree." },
    "ecoles.lex.master.h": { fr: "Master", en: "Master (master's)" },
    "ecoles.lex.master": { fr: "Diplôme en 2 ans après la Licence (Bac+5).", en: "A 2-year degree after the Licence (Bac+5): the equivalent of a master's degree." },
    "ecoles.lex.bacplus": { fr: "Notation courante du niveau d'études : le chiffre indique le nombre d'années après le Bac (Bac+2 = BTS, Bac+3 = Licence, Bac+5 = Master ou diplôme d'ingénieur).", en: "Common shorthand for the level of study: the number shows how many years after the Bac (Bac+2 = BTS, Bac+3 = Licence, Bac+5 = Master's or engineering degree)." },
    "ecoles.lex.lmd": { fr: "Licence-Master-Doctorat : système d'organisation des études (en crédits et semestres) adopté par la plupart des universités togolaises et africaines francophones.", en: "Licence-Master-Doctorat (bachelor's-master's-doctorate): the system for organizing studies (in credits and semesters) adopted by most Togolese and French-speaking African universities." },
    "ecoles.lex.cames": { fr: "Conseil Africain et Malgache pour l'Enseignement Supérieur : reconnaît et harmonise la valeur des diplômes entre pays membres.", en: "Conseil Africain et Malgache pour l'Enseignement Supérieur (African and Malagasy Council for Higher Education): recognizes and harmonizes the value of degrees across member countries." },
    "ecoles.lex.auf": { fr: "Agence Universitaire de la Francophonie : réseau international d'universités francophones ; en être membre facilite les échanges et la mobilité.", en: "Agence Universitaire de la Francophonie (Francophone University Association): an international network of French-speaking universities; membership makes exchanges and mobility easier." },
    "ecoles.lex.mesr": { fr: "Ministère de l'Enseignement Supérieur et de la Recherche (Togo) : autorité qui délivre les agréments d'État et publie la liste annuelle des établissements accrédités.", en: "Ministère de l'Enseignement Supérieur et de la Recherche (Togo's Ministry of Higher Education and Research): the authority that grants State accreditation and publishes the annual list of accredited institutions." },
    "ecoles.lex.agrement.h": { fr: "Agrément d'État", en: "State accreditation (agrément d'État)" },
    "ecoles.lex.agrement": { fr: "Reconnaissance officielle d'un établissement privé par le MESR : condition pour que le diplôme ait une pleine valeur légale.", en: "Official recognition of a private institution by the MESR: required for the degree to have full legal value." },
    "ecoles.lex.daas": { fr: "Direction des Affaires Académiques et de la Scolarité : service qui gère les admissions dans les universités publiques comme l'Université de Kara.", en: "Direction des Affaires Académiques et de la Scolarité (Academic and Student Affairs Directorate): the office that handles admissions at public universities such as the University of Kara." },
    "ecoles.lex.vap": { fr: "Validation des Acquis Professionnels : permet d'intégrer une formation (souvent un Master) sur la base de l'expérience plutôt que du seul diplôme.", en: "Validation des Acquis Professionnels (recognition of professional experience): lets you join a program (often a Master's) on the basis of experience rather than your degree alone." },
    "ecoles.lex.ingenieur.h": { fr: "Cursus ingénieur", en: "Engineering track" },
    "ecoles.lex.ingenieur": { fr: "Formation longue (5 ans), encadrée par la Commission des Titres d'Ingénieur (CTI), menant à un diplôme d'ingénieur reconnu.", en: "A long program (5 years), overseen by the Engineering Degree Commission (Commission des Titres d'Ingénieur, CTI), leading to a recognized engineering degree." },
    "ecoles.lex.concours.h": { fr: "Concours", en: "Concours (entrance exam)" },
    "ecoles.lex.concours": { fr: "Épreuve écrite compétitive d'admission, utilisée par les établissements à places limitées (universités publiques, IAI-Togo, certaines grandes écoles).", en: "A competitive written admission exam, used by institutions with limited places (public universities, IAI-Togo, some grandes écoles)." },
    "ecoles.lex.bepc": { fr: "Brevet d'Études du Premier Cycle : diplôme de fin de collège, parfois utilisé comme condition d'entrée pour un BT (ex. FORMATEC).", en: "Brevet d'Études du Premier Cycle: the end-of-middle-school diploma, sometimes required to enter a BT (e.g. FORMATEC)." },
    "ecoles.lex.iso": { fr: "Norme internationale de management de la qualité ; plusieurs écoles togolaises (FORMATEC, ESA Togo, ISM Adonaï) s'en prévalent comme gage de sérieux.", en: "International quality management standard; several Togolese schools (FORMATEC, ESA Togo, ISM Adonaï) cite it as a sign of reliability." },
    "ecoles.lex.uemoa": { fr: "Union Économique et Monétaire Ouest Africaine : les étudiants originaires des pays membres bénéficient parfois de frais réduits (ex. Université de Kara).", en: "Union Économique et Monétaire Ouest Africaine (West African Economic and Monetary Union, WAEMU): students from member countries sometimes pay reduced fees (e.g. University of Kara)." },
    "ecoles.lex.icdl": { fr: "International Computer Driving Licence : certification internationale de compétences bureautiques et numériques de base, utilisée par certains bootcamps (ex. Lomé Digital School).", en: "International Computer Driving Licence: an international certification of basic office and digital skills, used by some bootcamps (e.g. Lomé Digital School)." },
    "bourses.h.ucao": { fr: "UCAO-UUT : Génie Informatique", en: "UCAO-UUT: Computer Engineering" },
    "bourses.h.cadres": { fr: "École des Cadres", en: "School of Executives (École des Cadres)" },
    "bourses.h.kara": { fr: "Université de Kara", en: "University of Kara" },
    "bourses.link.dbs": { fr: "dbs.tg : Direction des Bourses et Stages", en: "dbs.tg: Scholarships and Internships Directorate" },
    "bourses.h.credit": { fr: "Crédit scolaire : Orabank Togo", en: "School loan: Orabank Togo" },
    "bourses.link.credit": { fr: "orabank.net : crédit scolaire", en: "orabank.net: school loan" },
    "bourses.h.pack": { fr: "Pack Étudiants : Orabank Togo", en: "Student pack: Orabank Togo" },
    "bourses.link.pack": { fr: "orabank.net : pack étudiants", en: "orabank.net: student pack" },
    "bourses.h.auf": { fr: "AUF : Agence Universitaire de la Francophonie", en: "AUF: Francophone University Association" },
    "bourses.h.uemoa": { fr: "Bourses d'Excellence UEMOA", en: "WAEMU Excellence Scholarships" },
    "bourses.h.france": { fr: "Bourses France Excellence (Campus France Togo)", en: "France Excellence Scholarships (Campus France Togo)" },
    "bourses.link.france": { fr: "tg.diplomatie.gouv.fr : appel 2026-2027", en: "tg.diplomatie.gouv.fr: 2026-2027 call" },
    "bourses.h.acan": { fr: "ACAN : Académie Numérique", en: "ACAN: Digital Academy" },
    "bourses.h.national": { fr: "Programme national IA, Programmation &amp; Anglais", en: "National AI, Programming &amp; English program" },
    "bourses.h.dclic": { fr: "D-CLIC : OIF", en: "D-CLIC: OIF" },
    // Noms d'organismes traduits (2026-11-08) : sigle gardé pour les reconnaître.
    "org.atd": { fr: "Agence Togo Digital (ATD)", en: "Togo Digital Agency (ATD)" },
    "org.tis": { fr: "Togolaises In Science (TIS)", en: "Togolese Women in Science (TIS)" },
    "org.c2p": { fr: "Code Premier Pas (C2P)", en: "Code First Steps (C2P)" },
    // Marques faites de mots français : traduites, nom d'origine entre parenthèses (2026-11-08).
    "brand.eti": { fr: "Emploi Togo Intérim", en: "Togo Interim Employment (Emploi Togo Intérim)" },
    "brand.optioncarriere": { fr: "Optioncarriere.tg", en: "Optioncarriere.tg (Career Option)" },
    "brand.jobrelais": { fr: "JobRelais", en: "JobRelais (Job Relay)" },
    "brand.zds": { fr: "Zeste de Savoir", en: "Zest of Knowledge (Zeste de Savoir)" },
    "brand.alsacreations": { fr: "Alsacréations", en: "Alsace Creations (Alsacréations)" },
    "stages.h.anpe": { fr: "ANPE : Agence Nationale Pour l'Emploi", en: "ANPE: National Employment Agency" },
    "stages.h.aggregators": { fr: "Agrégateurs internationaux (Indeed, Jooble)", en: "International aggregators (Indeed, Jooble)" },
    "stages.h.yas": { fr: "Yas Togo (ex-Togocom)", en: "Yas Togo (formerly Togocom)" },
    "stages.h.boad": { fr: "BOAD : Banque Ouest Africaine de Développement", en: "BOAD: West African Development Bank" },
    "stages.h.bceao": { fr: "BCEAO (agence de Lomé)", en: "BCEAO (Lomé branch)" },
    "stages.h.ancy": { fr: "ANCy : Agence Nationale de la Cybersécurité", en: "ANCy: National Cybersecurity Agency" },
    "stages.link.coris": { fr: "Carrière Coris Bank International", en: "Coris Bank International careers" },
    "stages.h.pal": { fr: "Port Autonome de Lomé (PAL)", en: "Autonomous Port of Lomé (PAL)" },
    "stages.h.giz": { fr: "GIZ Togo : projet ProDigiT", en: "GIZ Togo: ProDigiT project" },
    "eco.h.tcc": { fr: "Tech Campus Clubs (TCC)", en: "Tech Campus Clubs (TCC)" },
    "eco.h.mlsa": { fr: "MSA Togo : Microsoft Student Ambassadors", en: "MSA Togo: Microsoft Student Ambassadors" },
    "eco.h.ecommerce": { fr: "Semaine du E-commerce", en: "E-commerce Week" },
    "eco.h.innovup": { fr: "INNOV'UP : FEFA Togo", en: "INNOV'UP: FEFA Togo" },
    "eco.djanta.contact": { fr: "contact@djantatechhub.gouv.tg : 656 Avenue de la Nouvelle Marché, Quartier des Étoiles, 01 BP 2274, Lomé - Togo", en: "contact@djantatechhub.gouv.tg: 656 Avenue de la Nouvelle Marché, Quartier des Étoiles, 01 BP 2274, Lomé, Togo" },
    "eco.h.togoailab": { fr: "Togo AI Lab (ex-Togo Data Lab)", en: "Togo AI Lab (formerly Togo Data Lab)" },
    "eco.h.osca": { fr: "OSCA Lomé : Open Source Community Africa", en: "OSCA Lomé: Open Source Community Africa" },
    "eco.h.funmooc": { fr: "FUN MOOC : France Université Numérique", en: "FUN MOOC: France Université Numérique" },
    "ecoles.bac.intro": { fr: "Un repère, pas une règle stricte : beaucoup d'écoles privées togolaises étudient chaque dossier au cas par cas, quelle que soit la série. Mais certaines filières (concours publics, cursus ingénieur) demandent une série précise.", en: "A guideline, not a strict rule: many Togolese private schools review each application case by case, whatever the series. But some programs (public entrance exams, engineering tracks) require a specific series." },
    "temoignages.source": { fr: "Source :", en: "Source:" },
    "temoignages.sources": { fr: "Sources :", en: "Sources:" },
    "eco.jump.aria": { fr: "Aller à une section", en: "Jump to a section" },
  };

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "fr";
  }

  function setLang(lang) {
    const changed = getLang() !== lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
    // app.js reconstruit alors les contenus tirés de data.js (roadmaps,
    // écoles, dates, test d'orientation, recherche).
    if (changed) document.dispatchEvent(new CustomEvent("wiyao:langchange", { detail: { lang: lang } }));
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;

    if (titleFr === null) titleFr = document.title;
    if (Object.prototype.hasOwnProperty.call(TITLES, titleFr)) {
      document.title = lang === "en" ? TITLES[titleFr] : titleFr;
    }

    document
      .querySelectorAll(".site-nav a[href], .footer-links-col a[href], .footer-legal-links a[href]")
      .forEach((el) => {
        const entry = BY_HREF[el.getAttribute("href")];
        if (entry) el.textContent = lang === "en" ? entry.en : entry.fr;
      });

    document.querySelectorAll(".nav-search-icon").forEach((el) => {
      el.setAttribute("aria-label", lang === "en" ? "Search" : "Recherche");
    });

    BY_SELECTOR.forEach(({ selector, fr, en }) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.textContent = lang === "en" ? en : fr;
      });
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const entry = PAGE_CONTENT[el.dataset.i18nPlaceholder];
      if (entry) el.setAttribute("placeholder", lang === "en" ? entry.en : entry.fr);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const entry = PAGE_CONTENT[el.dataset.i18nAriaLabel];
      if (entry) el.setAttribute("aria-label", lang === "en" ? entry.en : entry.fr);
    });

    document.querySelectorAll("[data-i18n-key]").forEach((el) => {
      const entry = PAGE_CONTENT[el.dataset.i18nKey];
      if (entry) el.innerHTML = lang === "en" ? entry.en : entry.fr;
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  function initLangSwitch() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  }

  // Pour les contenus chargés après coup (fenêtre « Informations légales »).
  window.wiyaoApplyLang = () => applyLang(getLang());

  // Pour la recherche (app.js) : texte d'une clé dans une langue donnée, car
  // les pages qu'elle lit par fetch arrivent en français.
  window.wiyaoText = (key, lang) => {
    const entry = PAGE_CONTENT[key];
    return entry ? entry[lang === "en" ? "en" : "fr"] : null;
  };

  document.addEventListener("DOMContentLoaded", () => {
    initLangSwitch();
    applyLang(getLang());
  });
})();
