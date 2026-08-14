// Données des roadmaps - WIYAO
// Deux catégories, comme sur roadmap.sh :
// - ROLES : roadmaps par métier (le chemin complet pour un rôle donné)
// - SKILLS : roadmaps par compétence (un sujet précis, indépendant du métier)
// Chaque item : { label, level: "core"|"option", note?, resource?: { label, url } }

const ROLES = {
  "web-dev": {
    type: "role",
    domain: "Développement",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Développeur Web",
    subtitle: "Du HTML au full-stack, avec les ressources disponibles au Togo",
    icon: "🌐",
    sections: [
      {
        title: "1. Bases indispensables",
        items: [
          { label: "Fonctionnement d'Internet, HTTP/HTTPS, DNS", level: "core", resource: { label: "MDN - Comment fonctionne le web", url: "https://developer.mozilla.org/fr/docs/Learn/Getting_started_with_the_web/How_the_Web_works" } },
          { label: "Ligne de commande (bash) et système de fichiers", level: "core", resource: { label: "Voir roadmap compétence Linux", url: "roadmap.html?id=linux" } },
          { label: "Git et GitHub (branches, pull requests, résolution de conflits)", level: "core", resource: { label: "Voir roadmap compétence Git & GitHub", url: "roadmap.html?id=git-github" } },
          { label: "Éditeur de code : VS Code, extensions utiles", level: "core", resource: { label: "Documentation VS Code", url: "https://code.visualstudio.com/docs" } }
        ]
      },
      {
        title: "2. HTML",
        items: [
          { label: "Structure sémantique (header, main, section, article)", level: "core", resource: { label: "MDN - HTML", url: "https://developer.mozilla.org/fr/docs/Web/HTML" } },
          { label: "Formulaires et validation native", level: "core", resource: { label: "MDN - Formulaires web", url: "https://developer.mozilla.org/fr/docs/Learn/Forms" } },
          { label: "Accessibilité de base (attributs ARIA, alt, labels)", level: "option", resource: { label: "MDN - Accessibilité", url: "https://developer.mozilla.org/fr/docs/Web/Accessibility" } }
        ]
      },
      {
        title: "3. CSS",
        items: [
          { label: "Box model, sélecteurs, spécificité", level: "core", resource: { label: "MDN - CSS", url: "https://developer.mozilla.org/fr/docs/Web/CSS" } },
          { label: "Flexbox et Grid", level: "core", resource: { label: "CSS Tricks - Guide Flexbox/Grid", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" } },
          { label: "Responsive design (mobile-first, media queries)", level: "core", resource: { label: "MDN - Responsive design", url: "https://developer.mozilla.org/fr/docs/Learn/CSS/CSS_layout/Responsive_Design" } },
          { label: "Sass/SCSS ou Tailwind CSS", level: "option", resource: { label: "Documentation Tailwind CSS", url: "https://tailwindcss.com/docs" } }
        ]
      },
      {
        title: "4. JavaScript",
        items: [
          { label: "Syntaxe de base, types, fonctions, portée", level: "core", resource: { label: "Voir roadmap compétence JavaScript", url: "roadmap.html?id=javascript" } },
          { label: "DOM et gestion des événements", level: "core", resource: { label: "MDN - Manipulation du DOM", url: "https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model" } },
          { label: "ES6+ (arrow functions, destructuring, modules)", level: "core" },
          { label: "Asynchrone : Promises, async/await, fetch API", level: "core", resource: { label: "MDN - Fonctions asynchrones", url: "https://developer.mozilla.org/fr/docs/Learn/JavaScript/Asynchronous" } },
          { label: "TypeScript", level: "option", resource: { label: "Documentation TypeScript", url: "https://www.typescriptlang.org/docs/" } }
        ]
      },
      {
        title: "5. Frontend avancé",
        items: [
          { label: "Un framework : React, Vue ou Svelte (choisir un seul pour démarrer)", level: "core", resource: { label: "React - Apprendre", url: "https://react.dev/learn" } },
          { label: "Gestion d'état (Context API, Zustand, Redux)", level: "option" },
          { label: "Routing côté client", level: "core" },
          { label: "Outils de build : Vite, bundlers", level: "core", resource: { label: "Documentation Vite", url: "https://vite.dev/guide/" } }
        ]
      },
      {
        title: "6. Notions backend pour le full-stack",
        items: [
          { label: "Node.js et Express, ou équivalent", level: "core", resource: { label: "Documentation Node.js", url: "https://nodejs.org/fr/docs" } },
          { label: "API REST, méthodes HTTP, codes de statut", level: "core" },
          { label: "Bases de données SQL (PostgreSQL/MySQL) et NoSQL (MongoDB)", level: "core", resource: { label: "Voir roadmap compétence SQL", url: "roadmap.html?id=sql" } }
        ]
      },
      {
        title: "7. Déploiement",
        items: [
          { label: "Hébergement statique (Netlify, Vercel, GitHub Pages)", level: "core", resource: { label: "Documentation GitHub Pages", url: "https://docs.github.com/fr/pages" } },
          { label: "Déploiement sur un VPS ou hébergeur local", level: "option" },
          { label: "Nom de domaine .tg et DNS", level: "option" }
        ]
      },
      {
        title: "8. Écosystème togolais",
        items: [
          { label: "IAI-Togo : licence pro informatique, formation continue", level: "core", note: "Institut Africain d'Informatique, Lomé.", resource: { label: "iai-togo.tg", url: "https://new.iai-togo.tg/" } },
          { label: "ESGIS : licence Informatique Réseaux et Télécommunication", level: "core" },
          { label: "HETEC (HEST) : licence/master développement d'applications", level: "core" },
          { label: "GDG Lomé et DevFest Lomé : meetups et conférence annuelle", level: "core", note: "Communauté Google Developer Groups, ateliers réguliers.", resource: { label: "gdg.community.dev/gdg-lome", url: "https://gdg.community.dev/gdg-lome/" } },
          { label: "Djanta Academy (Djanta Tech Hub) : formation aux compétences numériques", level: "option" }
        ]
      }
    ]
  },

  "backend": {
    type: "role",
    domain: "Développement",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Développeur Backend",
    subtitle: "Langages, bases de données, architecture et sécurité",
    icon: "🛠️",
    sections: [
      {
        title: "1. Choisir un langage",
        items: [
          { label: "Node.js (JavaScript/TypeScript)", level: "core", resource: { label: "Documentation Node.js", url: "https://nodejs.org/fr/docs" } },
          { label: "Python (Django, FastAPI)", level: "core", resource: { label: "Voir roadmap compétence Python", url: "roadmap.html?id=python" } },
          { label: "PHP (Laravel)", level: "option", resource: { label: "Documentation Laravel", url: "https://laravel.com/docs" } },
          { label: "Java (Spring Boot) ou Go", level: "option" }
        ]
      },
      {
        title: "2. Fondamentaux",
        items: [
          { label: "Structures de données et algorithmes", level: "core" },
          { label: "Programmation orientée objet", level: "core" },
          { label: "Gestion des erreurs et logs", level: "core" }
        ]
      },
      {
        title: "3. Bases de données",
        items: [
          { label: "SQL : modélisation, jointures, index, transactions", level: "core", resource: { label: "Voir roadmap compétence SQL", url: "roadmap.html?id=sql" } },
          { label: "PostgreSQL ou MySQL en pratique", level: "core", resource: { label: "Documentation PostgreSQL", url: "https://www.postgresql.org/docs/" } },
          { label: "NoSQL : MongoDB, Redis (cache)", level: "core", resource: { label: "Documentation MongoDB", url: "https://www.mongodb.com/docs/manual/" } },
          { label: "ORM (Prisma, Sequelize, SQLAlchemy)", level: "option" }
        ]
      },
      {
        title: "4. API et authentification",
        items: [
          { label: "REST : conception, versionnement, pagination", level: "core" },
          { label: "GraphQL", level: "option", resource: { label: "Documentation GraphQL", url: "https://graphql.org/learn/" } },
          { label: "Authentification JWT, sessions, OAuth2", level: "core", resource: { label: "jwt.io - Introduction aux JWT", url: "https://jwt.io/introduction" } }
        ]
      },
      {
        title: "5. Architecture",
        items: [
          { label: "MVC et design patterns courants", level: "core" },
          { label: "Architecture microservices", level: "option" },
          { label: "Files de messages (RabbitMQ, Kafka)", level: "option" }
        ]
      },
      {
        title: "6. Sécurité",
        items: [
          { label: "OWASP Top 10 (injection SQL, XSS, CSRF)", level: "core", resource: { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" } },
          { label: "Validation des entrées, gestion des secrets (.env)", level: "core" },
          { label: "Limitation de débit (rate limiting), CORS", level: "core" }
        ]
      },
      {
        title: "7. Tests et déploiement",
        items: [
          { label: "Tests unitaires et d'intégration", level: "core" },
          { label: "Docker et conteneurisation", level: "core", resource: { label: "Voir roadmap compétence Docker", url: "roadmap.html?id=docker" } },
          { label: "CI/CD basique (GitHub Actions)", level: "option", resource: { label: "Documentation GitHub Actions", url: "https://docs.github.com/fr/actions" } },
          { label: "Administration d'un serveur Linux", level: "core", resource: { label: "Voir roadmap compétence Linux", url: "roadmap.html?id=linux" } }
        ]
      },
      {
        title: "8. Écosystème togolais",
        items: [
          { label: "Centre Informatique de Calcul (CIC), Université de Lomé", level: "core", note: "Licences pro réseaux/informatique, master sécurité réseaux.", resource: { label: "univ-lome.tg", url: "https://univ-lome.tg/course/informatique-et-systemes/" } },
          { label: "PyCon Togo : conférence nationale Python", level: "core", resource: { label: "pycontg.pytogo.org", url: "https://pycontg.pytogo.org/" } },
          { label: "IAI-Togo et HETEC : formations backend et bases de données", level: "option" }
        ]
      }
    ]
  },

  "devops": {
    type: "role",
    domain: "Infrastructure & DevOps",
    level: "Avancé",
    togoVerified: true,
    title: "DevOps & Cloud",
    subtitle: "Infrastructure, automatisation et exploitation",
    icon: "☁️",
    sections: [
      {
        title: "1. Bases système",
        items: [
          { label: "Administration Linux (processus, permissions, services)", level: "core", resource: { label: "Voir roadmap compétence Linux", url: "roadmap.html?id=linux" } },
          { label: "Scripting bash/shell", level: "core" },
          { label: "Réseaux : TCP/IP, DNS, load balancing", level: "core", resource: { label: "Voir roadmap compétence Réseaux", url: "roadmap.html?id=reseaux" } }
        ]
      },
      {
        title: "2. Versioning et collaboration",
        items: [
          { label: "Git avancé (rebase, cherry-pick, GitFlow)", level: "core", resource: { label: "Voir roadmap compétence Git & GitHub", url: "roadmap.html?id=git-github" } }
        ]
      },
      {
        title: "3. Conteneurisation",
        items: [
          { label: "Docker : images, volumes, réseaux", level: "core", resource: { label: "Voir roadmap compétence Docker", url: "roadmap.html?id=docker" } },
          { label: "Docker Compose pour environnements multi-services", level: "core" },
          { label: "Kubernetes : pods, services, déploiements", level: "option", resource: { label: "Documentation Kubernetes", url: "https://kubernetes.io/fr/docs/home/" } }
        ]
      },
      {
        title: "4. Intégration et livraison continues",
        items: [
          { label: "GitHub Actions ou GitLab CI", level: "core", resource: { label: "Documentation GitHub Actions", url: "https://docs.github.com/fr/actions" } },
          { label: "Jenkins", level: "option", resource: { label: "Documentation Jenkins", url: "https://www.jenkins.io/doc/" } },
          { label: "Stratégies de déploiement (blue-green, canary)", level: "option" }
        ]
      },
      {
        title: "5. Infrastructure as Code",
        items: [
          { label: "Terraform", level: "core", resource: { label: "Documentation Terraform", url: "https://developer.hashicorp.com/terraform/docs" } },
          { label: "Ansible", level: "option", resource: { label: "Documentation Ansible", url: "https://docs.ansible.com/" } }
        ]
      },
      {
        title: "6. Cloud",
        items: [
          { label: "Fondamentaux AWS, Azure ou GCP (compute, storage, IAM)", level: "core", resource: { label: "Voir roadmap compétence Cloud", url: "roadmap.html?id=cloud" } },
          { label: "Certification niveau associate/fundamentals", level: "option" }
        ]
      },
      {
        title: "7. Observabilité",
        items: [
          { label: "Monitoring : Prometheus, Grafana", level: "core", resource: { label: "Documentation Prometheus", url: "https://prometheus.io/docs/introduction/overview/" } },
          { label: "Centralisation des logs (ELK, Loki)", level: "option" }
        ]
      },
      {
        title: "8. Écosystème togolais",
        items: [
          { label: "Djanta Tech Hub / Djanta Academy : formations compétences numériques", level: "core", note: "Lancé en 2026, avec Djanta Lab pour la recherche et l'innovation.", resource: { label: "togofirst.com", url: "https://www.togofirst.com/fr/tic/0805-18921-le-togo-inaugure-le-djanta-tech-hub-nouveau-levier-pour-les-startups-numeriques" } },
          { label: "GDG Lomé : ateliers Google Cloud", level: "core", resource: { label: "gdg.community.dev/gdg-lome", url: "https://gdg.community.dev/gdg-lome/" } },
          { label: "DevFest Lomé : conférence annuelle IA et cloud", level: "option" }
        ]
      }
    ]
  },

  "cyber": {
    type: "role",
    domain: "Sécurité",
    level: "Avancé",
    togoVerified: true,
    title: "Cybersécurité & Réseaux",
    subtitle: "Sécurité offensive, défensive et gouvernance",
    icon: "🔐",
    sections: [
      {
        title: "1. Fondamentaux réseaux",
        items: [
          { label: "Modèle OSI et TCP/IP", level: "core", resource: { label: "Voir roadmap compétence Réseaux", url: "roadmap.html?id=reseaux" } },
          { label: "Routage, switching, VLAN, sous-réseaux", level: "core" },
          { label: "Certification CCNA (recommandée en base)", level: "option", resource: { label: "Cisco - Certification CCNA", url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/ccna/index.html" } }
        ]
      },
      {
        title: "2. Administration système",
        items: [
          { label: "Administration Linux et Windows Server", level: "core", resource: { label: "Voir roadmap compétence Linux", url: "roadmap.html?id=linux" } },
          { label: "Active Directory et gestion des identités", level: "core" }
        ]
      },
      {
        title: "3. Sécurité réseau",
        items: [
          { label: "Pare-feu, segmentation réseau, VPN", level: "core" },
          { label: "IDS/IPS et détection d'intrusion", level: "core" },
          { label: "Durcissement (hardening) des systèmes", level: "core" }
        ]
      },
      {
        title: "4. Cryptographie",
        items: [
          { label: "Chiffrement symétrique et asymétrique", level: "core" },
          { label: "PKI, certificats et TLS", level: "core" }
        ]
      },
      {
        title: "5. Sécurité applicative et audit",
        items: [
          { label: "OWASP Top 10", level: "core", resource: { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" } },
          { label: "Tests d'intrusion (pentest), outils : Nmap, Metasploit, Burp Suite", level: "core", resource: { label: "Documentation Nmap", url: "https://nmap.org/book/man.html" } },
          { label: "Analyse de trafic avec Wireshark", level: "core", resource: { label: "Documentation Wireshark", url: "https://www.wireshark.org/docs/" } },
          { label: "SIEM et gestion des incidents", level: "option" }
        ]
      },
      {
        title: "6. Gouvernance et conformité",
        items: [
          { label: "Loi n°2018-026 sur la cybersécurité et la cybercriminalité (Togo)", level: "core", note: "Cadre légal togolais, base des obligations de sécurité.", resource: { label: "ancy.gouv.tg", url: "https://ancy.gouv.tg/" } },
          { label: "Normes ISO 27001, gestion des risques", level: "core" },
          { label: "Protection des données personnelles", level: "option" }
        ]
      },
      {
        title: "7. Certifications",
        items: [
          { label: "CompTIA Security+", level: "core", resource: { label: "CompTIA Security+", url: "https://www.comptia.org/certifications/security" } },
          { label: "CEH (Certified Ethical Hacker)", level: "option" },
          { label: "CCNA Security / CISSP (niveau avancé)", level: "option" }
        ]
      },
      {
        title: "8. Écosystème togolais",
        items: [
          { label: "ANCy : Agence Nationale de la Cybersécurité du Togo", level: "core", note: "Autorité nationale, organise des Capture The Flag et campagnes de sensibilisation.", resource: { label: "ancy.gouv.tg", url: "https://ancy.gouv.tg/" } },
          { label: "CERT.tg : centre national de réponse aux incidents cyber", level: "core", note: "Opéré par Cyber Defense Africa pour le compte de l'ANCy.", resource: { label: "cert.tg", url: "https://cert.tg/" } },
          { label: "Lomé Digital School : parcours cybersécurité", level: "core", resource: { label: "lomedigitalschool.com", url: "https://lomedigitalschool.com/cybersecurite/" } },
          { label: "Master sécurité des réseaux, Université de Lomé", level: "option" }
        ]
      }
    ]
  },

  "data-ia": {
    type: "role",
    domain: "Data & IA",
    level: "Avancé",
    togoVerified: true,
    title: "Data & Intelligence Artificielle",
    subtitle: "Des statistiques au machine learning appliqué",
    icon: "📊",
    sections: [
      {
        title: "1. Mathématiques et statistiques",
        items: [
          { label: "Algèbre linéaire de base", level: "core" },
          { label: "Statistiques descriptives et probabilités", level: "core" }
        ]
      },
      {
        title: "2. Programmation",
        items: [
          { label: "Python : syntaxe, structures de données", level: "core", resource: { label: "Voir roadmap compétence Python", url: "roadmap.html?id=python" } },
          { label: "Pandas et NumPy", level: "core", resource: { label: "Documentation Pandas", url: "https://pandas.pydata.org/docs/" } },
          { label: "SQL pour l'analyse de données", level: "core", resource: { label: "Voir roadmap compétence SQL", url: "roadmap.html?id=sql" } }
        ]
      },
      {
        title: "3. Visualisation",
        items: [
          { label: "Matplotlib, Seaborn", level: "core", resource: { label: "Documentation Matplotlib", url: "https://matplotlib.org/stable/tutorials/index.html" } },
          { label: "Power BI ou Tableau", level: "option" }
        ]
      },
      {
        title: "4. Machine Learning",
        items: [
          { label: "Scikit-learn : régression, classification, clustering", level: "core", resource: { label: "Scikit-learn - Tutoriels", url: "https://scikit-learn.org/stable/tutorial/index.html" } },
          { label: "Évaluation de modèles (validation croisée, métriques)", level: "core" },
          { label: "Feature engineering", level: "option" }
        ]
      },
      {
        title: "5. Deep Learning",
        items: [
          { label: "Réseaux de neurones, bases", level: "option" },
          { label: "TensorFlow ou PyTorch", level: "option", resource: { label: "PyTorch - Tutoriels", url: "https://pytorch.org/tutorials/" } }
        ]
      },
      {
        title: "6. Mise en production",
        items: [
          { label: "Déploiement de modèles (API Flask/FastAPI)", level: "option", resource: { label: "Documentation FastAPI", url: "https://fastapi.tiangolo.com/" } },
          { label: "Notions de MLOps et monitoring", level: "option" }
        ]
      },
      {
        title: "7. Écosystème togolais",
        items: [
          { label: "PyCon Togo : conférence nationale de la communauté Python", level: "core", resource: { label: "pycontg.pytogo.org", url: "https://pycontg.pytogo.org/" } },
          { label: "Djanta Lab : laboratoire de recherche et innovation", level: "option" },
          { label: "HETEC : parcours intelligence artificielle", level: "option" }
        ]
      }
    ]
  },

  "mobile": {
    type: "role",
    domain: "Développement",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Développement Mobile",
    subtitle: "Natif ou cross-platform, de l'idée au Play Store",
    icon: "📱",
    sections: [
      {
        title: "1. Choisir une approche",
        items: [
          { label: "Cross-platform : Flutter (Dart) ou React Native", level: "core", resource: { label: "Documentation Flutter", url: "https://docs.flutter.dev/" } },
          { label: "Natif Android : Kotlin", level: "option", resource: { label: "Android Developers - Kotlin", url: "https://developer.android.com/kotlin" } },
          { label: "Natif iOS : Swift", level: "option", resource: { label: "Apple Developer - Swift", url: "https://developer.apple.com/swift/" } }
        ]
      },
      {
        title: "2. UI/UX mobile",
        items: [
          { label: "Principes de design mobile-first", level: "core" },
          { label: "Material Design (Android) / Human Interface Guidelines (iOS)", level: "core", resource: { label: "Material Design", url: "https://m3.material.io/" } }
        ]
      },
      {
        title: "3. Architecture et état",
        items: [
          { label: "MVVM ou architecture propre", level: "core" },
          { label: "Gestion d'état : Provider/Riverpod (Flutter) ou Redux (RN)", level: "core" }
        ]
      },
      {
        title: "4. Données et API",
        items: [
          { label: "Consommation d'API REST", level: "core" },
          { label: "Stockage local (SQLite, Hive)", level: "core" },
          { label: "Firebase (auth, base de données temps réel)", level: "option", resource: { label: "Documentation Firebase", url: "https://firebase.google.com/docs" } }
        ]
      },
      {
        title: "5. Fonctionnalités natives",
        items: [
          { label: "Notifications push", level: "core" },
          { label: "Géolocalisation et permissions", level: "core" },
          { label: "Paiement mobile (Flooz, T-Money, Mobile Money)", level: "option", note: "Intégrations pertinentes pour le marché togolais." }
        ]
      },
      {
        title: "6. Publication",
        items: [
          { label: "Google Play Store : préparation et publication", level: "core", resource: { label: "Play Console - Guide de lancement", url: "https://support.google.com/googleplay/android-developer/answer/9859152" } },
          { label: "Apple App Store : préparation et publication", level: "option" }
        ]
      },
      {
        title: "7. Écosystème togolais",
        items: [
          { label: "GDG Lomé : ateliers Android/Flutter", level: "core", resource: { label: "gdg.community.dev/gdg-lome", url: "https://gdg.community.dev/gdg-lome/" } },
          { label: "IAI-Togo et HETEC : bootcamps développement mobile", level: "option" },
          { label: "Djanta Start : incubation pour startups mobiles", level: "option" }
        ]
      }
    ]
  },

  "product-manager": {
    type: "role",
    domain: "Produit & Design",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Product Manager",
    subtitle: "Piloter un produit numérique, de l'idée à la mise en marché",
    icon: "🧭",
    sections: [
      {
        title: "1. Le rôle",
        items: [
          { label: "Différence Product Manager / Product Owner", level: "core", resource: { label: "Atlassian - Product management", url: "https://www.atlassian.com/agile/product-management" } },
          { label: "Cycle de vie d'un produit", level: "core" }
        ]
      },
      {
        title: "2. Découverte utilisateur",
        items: [
          { label: "Entretiens utilisateurs et personas", level: "core" },
          { label: "Analyse de la concurrence", level: "core" }
        ]
      },
      {
        title: "3. Stratégie produit",
        items: [
          { label: "Vision et roadmap produit", level: "core" },
          { label: "Priorisation (RICE, MoSCoW, Kano)", level: "core" }
        ]
      },
      {
        title: "4. Exécution",
        items: [
          { label: "Rédaction de specs et user stories", level: "core" },
          { label: "Méthodologies agiles : Scrum, Kanban", level: "core", resource: { label: "Scrum.org - Ressources", url: "https://www.scrum.org/resources" } },
          { label: "Gestion du backlog", level: "core" }
        ]
      },
      {
        title: "5. Data et métriques",
        items: [
          { label: "KPIs produit, tableaux de bord", level: "core" },
          { label: "A/B testing", level: "option" }
        ]
      },
      {
        title: "6. Outils",
        items: [
          { label: "Jira, Notion, Linear", level: "core" },
          { label: "Lecture de maquettes Figma", level: "option" }
        ]
      },
      {
        title: "7. Écosystème togolais",
        items: [
          { label: "Djanta Start (Djanta Tech Hub) : accompagnement de startups", level: "core" },
          { label: "CUBE : incubateur et formation entrepreneuriat numérique", level: "option" }
        ]
      }
    ]
  },

  "ux-ui": {
    type: "role",
    domain: "Produit & Design",
    level: "Intermédiaire",
    togoVerified: true,
    title: "UX/UI Designer",
    subtitle: "Concevoir des interfaces utiles, claires et agréables à utiliser",
    icon: "🎨",
    sections: [
      {
        title: "1. Fondamentaux du design",
        items: [
          { label: "Théorie des couleurs, typographie, grille", level: "core" },
          { label: "Principes d'ergonomie et de hiérarchie visuelle", level: "core" }
        ]
      },
      {
        title: "2. Recherche utilisateur (UX)",
        items: [
          { label: "Entretiens, personas, parcours utilisateur", level: "core", resource: { label: "Google - Certificat UX Design", url: "https://www.coursera.org/professional-certificates/google-ux-design" } },
          { label: "Architecture de l'information", level: "core" }
        ]
      },
      {
        title: "3. Conception",
        items: [
          { label: "Wireframes basse et haute fidélité", level: "core" },
          { label: "Prototypage interactif", level: "core" }
        ]
      },
      {
        title: "4. Interface (UI)",
        items: [
          { label: "Design systems et composants réutilisables", level: "core" },
          { label: "Accessibilité visuelle (contraste, tailles de police)", level: "core" }
        ]
      },
      {
        title: "5. Outils",
        items: [
          { label: "Figma", level: "core", resource: { label: "Centre d'aide Figma", url: "https://help.figma.com/" } },
          { label: "Adobe XD ou Sketch", level: "option" }
        ]
      },
      {
        title: "6. Tests et itération",
        items: [
          { label: "Tests d'utilisabilité", level: "core" },
          { label: "Itération à partir des retours", level: "core" }
        ]
      },
      {
        title: "7. Écosystème togolais",
        items: [
          { label: "GDG Lomé : ateliers design occasionnels", level: "option" },
          { label: "Djanta Academy : formations compétences numériques", level: "option" }
        ]
      }
    ]
  },

  "data-analyst": {
    type: "role",
    domain: "Data & IA",
    level: "Débutant",
    togoVerified: true,
    title: "Data Analyst",
    subtitle: "Transformer des données brutes en décisions",
    icon: "📈",
    sections: [
      {
        title: "1. Tableurs",
        items: [
          { label: "Excel ou Google Sheets avancé (TCD, formules)", level: "core", resource: { label: "Support Google Sheets", url: "https://support.google.com/docs/topic/9054603" } }
        ]
      },
      {
        title: "2. SQL",
        items: [
          { label: "Requêtes et agrégations", level: "core", resource: { label: "Voir roadmap compétence SQL", url: "roadmap.html?id=sql" } }
        ]
      },
      {
        title: "3. Programmation",
        items: [
          { label: "Python pour l'analyse (Pandas)", level: "core", resource: { label: "Voir roadmap compétence Python", url: "roadmap.html?id=python" } }
        ]
      },
      {
        title: "4. Visualisation",
        items: [
          { label: "Power BI ou Tableau", level: "core", resource: { label: "Documentation Power BI", url: "https://learn.microsoft.com/power-bi/" } },
          { label: "Looker Studio (gratuit)", level: "option" }
        ]
      },
      {
        title: "5. Statistiques",
        items: [
          { label: "Statistiques descriptives, corrélation", level: "core" }
        ]
      },
      {
        title: "6. Communication",
        items: [
          { label: "Storytelling avec les données, tableaux de bord", level: "core" }
        ]
      },
      {
        title: "7. Écosystème togolais",
        items: [
          { label: "PyCon Togo : conférence nationale Python", level: "core", resource: { label: "pycontg.pytogo.org", url: "https://pycontg.pytogo.org/" } },
          { label: "Djanta Lab : recherche et innovation", level: "option" }
        ]
      }
    ]
  },

  "support-it": {
    type: "role",
    domain: "Infrastructure & DevOps",
    level: "Débutant",
    togoVerified: true,
    title: "Support IT / Helpdesk",
    subtitle: "Assister les utilisateurs et maintenir le parc informatique",
    icon: "🖥️",
    sections: [
      {
        title: "1. Systèmes",
        items: [
          { label: "Bases Windows, macOS et Linux", level: "core" },
          { label: "Installation et configuration de postes", level: "core" }
        ]
      },
      {
        title: "2. Réseaux",
        items: [
          { label: "Notions réseau de base", level: "core", resource: { label: "Voir roadmap compétence Réseaux", url: "roadmap.html?id=reseaux" } }
        ]
      },
      {
        title: "3. Diagnostic et support",
        items: [
          { label: "Méthodologie de résolution de problèmes", level: "core" },
          { label: "Gestion de tickets (ITSM)", level: "core" }
        ]
      },
      {
        title: "4. Administration",
        items: [
          { label: "Active Directory, gestion des comptes", level: "core" },
          { label: "Gestion de parc informatique", level: "core" }
        ]
      },
      {
        title: "5. Sécurité de base",
        items: [
          { label: "Sensibilisation aux bonnes pratiques", level: "core" }
        ]
      },
      {
        title: "6. Certifications",
        items: [
          { label: "CompTIA A+", level: "core", resource: { label: "CompTIA A+", url: "https://www.comptia.org/certifications/a" } },
          { label: "ITIL Foundation", level: "option", resource: { label: "ITIL - Axelos", url: "https://www.axelos.com/certifications/itil-service-management" } }
        ]
      },
      {
        title: "7. Écosystème togolais",
        items: [
          { label: "IAI-Togo et ESGIS : formations réseaux et systèmes", level: "core" }
        ]
      }
    ]
  },

  "project-manager": {
    type: "role",
    domain: "Gestion & Management",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Chef de Projet IT",
    subtitle: "Planifier, coordonner et livrer des projets informatiques",
    icon: "📋",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Cycle de vie d'un projet", level: "core" },
          { label: "Waterfall vs Agile", level: "core" }
        ]
      },
      {
        title: "2. Planification",
        items: [
          { label: "Charte de projet, périmètre (WBS)", level: "core" },
          { label: "Planning et diagramme de Gantt", level: "core" }
        ]
      },
      {
        title: "3. Pilotage",
        items: [
          { label: "Gestion des risques", level: "core" },
          { label: "Gestion du budget", level: "core" }
        ]
      },
      {
        title: "4. Outils",
        items: [
          { label: "Jira, Trello ou MS Project", level: "core" }
        ]
      },
      {
        title: "5. Certifications",
        items: [
          { label: "PMP (Project Management Professional)", level: "option", resource: { label: "PMI - Certification PMP", url: "https://www.pmi.org/certifications/project-management-pmp" } },
          { label: "PRINCE2", level: "option", resource: { label: "PRINCE2 - Certification", url: "https://www.prince2.com/eur/prince2-certification" } },
          { label: "Professional Scrum Master (PSM)", level: "option", resource: { label: "Scrum.org - Certifications PSM", url: "https://www.scrum.org/professional-scrum-certifications" } }
        ]
      },
      {
        title: "6. Écosystème togolais",
        items: [
          { label: "CUBE et Djanta Tech Hub : accompagnement de projets numériques", level: "core" }
        ]
      }
    ]
  },

  "qa-testeur": {
    type: "role",
    domain: "Développement",
    level: "Débutant",
    togoVerified: true,
    title: "QA / Testeur Logiciel",
    subtitle: "Garantir la qualité et la fiabilité des logiciels avant leur mise en production",
    icon: "🐞",
    sections: [
      {
        title: "1. Fondamentaux du test",
        items: [
          { label: "Types de tests : unitaire, intégration, système, acceptation", level: "core" },
          { label: "Cycle de vie du test logiciel", level: "core" }
        ]
      },
      {
        title: "2. Tests manuels",
        items: [
          { label: "Rédaction de cas et scénarios de test", level: "core" },
          { label: "Rapport et suivi des anomalies", level: "core" }
        ]
      },
      {
        title: "3. Tests automatisés",
        items: [
          { label: "Selenium", level: "core", resource: { label: "Documentation Selenium", url: "https://www.selenium.dev/documentation/" } },
          { label: "Cypress ou Playwright", level: "option", resource: { label: "Documentation Playwright", url: "https://playwright.dev/docs/intro" } }
        ]
      },
      {
        title: "4. Méthodologie",
        items: [
          { label: "Tests dans un cycle Agile, tests de régression", level: "core" }
        ]
      },
      {
        title: "5. Outils",
        items: [
          { label: "Jira ou TestRail pour le suivi", level: "core" }
        ]
      },
      {
        title: "6. Écosystème togolais",
        items: [
          { label: "IAI-Togo, ESGIS et HETEC : bases en développement logiciel utiles au test", level: "core" }
        ]
      }
    ]
  },

  "sysadmin": {
    type: "role",
    domain: "Infrastructure & DevOps",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Administrateur Systèmes et Réseaux",
    subtitle: "Maintenir et sécuriser l'infrastructure informatique d'une organisation",
    icon: "🖧",
    sections: [
      {
        title: "1. Systèmes",
        items: [
          { label: "Administration Linux et Windows Server", level: "core", resource: { label: "Voir roadmap compétence Linux", url: "roadmap.html?id=linux" } }
        ]
      },
      {
        title: "2. Réseaux",
        items: [
          { label: "Architecture réseau, VLAN, routage", level: "core", resource: { label: "Voir roadmap compétence Réseaux", url: "roadmap.html?id=reseaux" } }
        ]
      },
      {
        title: "3. Virtualisation",
        items: [
          { label: "VMware, Hyper-V ou Proxmox", level: "core" }
        ]
      },
      {
        title: "4. Sauvegarde et continuité",
        items: [
          { label: "Politiques de sauvegarde", level: "core" },
          { label: "Plan de reprise d'activité (PRA)", level: "option" }
        ]
      },
      {
        title: "5. Supervision",
        items: [
          { label: "Zabbix ou Nagios", level: "core", resource: { label: "Documentation Zabbix", url: "https://www.zabbix.com/documentation/current/en/manual" } }
        ]
      },
      {
        title: "6. Certifications",
        items: [
          { label: "CompTIA Network+", level: "option", resource: { label: "CompTIA Network+", url: "https://www.comptia.org/certifications/network" } }
        ]
      },
      {
        title: "7. Écosystème togolais",
        items: [
          { label: "ESGIS, ESSEYI, Université de Lomé (CIC) : formations réseaux et systèmes", level: "core" }
        ]
      }
    ]
  },

  "reseaux-telecoms": {
    type: "role",
    domain: "Infrastructure & DevOps",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Ingénieur Réseaux et Télécommunications",
    subtitle: "Concevoir et exploiter les infrastructures de télécommunication",
    icon: "📡",
    sections: [
      {
        title: "1. Fondamentaux réseaux",
        items: [
          { label: "TCP/IP, routage, commutation", level: "core", resource: { label: "Voir roadmap compétence Réseaux", url: "roadmap.html?id=reseaux" } }
        ]
      },
      {
        title: "2. Télécommunications",
        items: [
          { label: "Téléphonie IP (VoIP)", level: "core" },
          { label: "Réseaux mobiles (3G/4G/5G) et fibre optique", level: "core" }
        ]
      },
      {
        title: "3. Équipements",
        items: [
          { label: "Configuration Cisco ou Huawei", level: "core" }
        ]
      },
      {
        title: "4. Sécurité télécoms",
        items: [
          { label: "Sécurisation des infrastructures réseau", level: "core" }
        ]
      },
      {
        title: "5. Certifications",
        items: [
          { label: "CCNA", level: "core", resource: { label: "Cisco - Certification CCNA", url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/ccna/index.html" } },
          { label: "CCNP", level: "option" }
        ]
      },
      {
        title: "6. Écosystème togolais",
        items: [
          { label: "ESGIS et ESSEYI : bachelor Informatique Réseaux et Télécommunication", level: "core" },
          { label: "Togocom et Moov Africa Togo : principaux employeurs du secteur télécom", level: "option" }
        ]
      }
    ]
  },

  "architecte-logiciel": {
    type: "role",
    domain: "Développement",
    level: "Avancé",
    togoVerified: true,
    title: "Architecte Logiciel",
    subtitle: "Concevoir la structure technique de systèmes complexes",
    icon: "🏗️",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Principes SOLID et design patterns", level: "core" }
        ]
      },
      {
        title: "2. Styles d'architecture",
        items: [
          { label: "Monolithe vs microservices", level: "core" },
          { label: "Architecture événementielle (event-driven)", level: "option" }
        ]
      },
      {
        title: "3. Qualité et performance",
        items: [
          { label: "Scalabilité, disponibilité, résilience", level: "core" }
        ]
      },
      {
        title: "4. Documentation",
        items: [
          { label: "Modélisation d'architecture (C4 model, diagrammes)", level: "core" }
        ]
      },
      {
        title: "5. Cloud et infrastructure",
        items: [
          { label: "Bases cloud nécessaires à l'architecture", level: "core", resource: { label: "Voir roadmap compétence Cloud", url: "roadmap.html?id=cloud" } }
        ]
      },
      {
        title: "6. Écosystème togolais",
        items: [
          { label: "Rôle senior, généralement accessible après plusieurs années en développement backend/DevOps", level: "core" },
          { label: "GDG Lomé : échanges techniques avec la communauté", level: "option" }
        ]
      }
    ]
  },

  "erp-crm": {
    type: "role",
    domain: "Développement",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Développeur ERP/CRM",
    subtitle: "Paramétrer et développer des solutions de gestion d'entreprise",
    icon: "🧩",
    sections: [
      {
        title: "1. Concepts",
        items: [
          { label: "Différence ERP / CRM, modules de gestion", level: "core" }
        ]
      },
      {
        title: "2. Odoo",
        items: [
          { label: "Modules Odoo et personnalisation", level: "core", resource: { label: "Documentation Odoo", url: "https://www.odoo.com/documentation/" } },
          { label: "Développement Python sur Odoo", level: "core", resource: { label: "Voir roadmap compétence Python", url: "roadmap.html?id=python" } }
        ]
      },
      {
        title: "3. Intégration",
        items: [
          { label: "Connexion à des systèmes tiers (API, imports/exports)", level: "core" }
        ]
      },
      {
        title: "4. Déploiement et maintenance",
        items: [
          { label: "Installation, mises à jour, sauvegardes", level: "core" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Peu de filières spécialisées ERP au Togo à ce jour : les bases s'acquièrent via IAI-Togo, ESGIS puis en autoformation et en entreprise", level: "core" }
        ]
      }
    ]
  },

  "iot-embarque": {
    type: "role",
    domain: "Infrastructure & DevOps",
    level: "Avancé",
    togoVerified: true,
    title: "Ingénieur IoT / Systèmes Embarqués",
    subtitle: "Concevoir des objets connectés et des systèmes électroniques intelligents",
    icon: "🔌",
    sections: [
      {
        title: "1. Électronique et microcontrôleurs",
        items: [
          { label: "Arduino, Raspberry Pi, ESP32", level: "core", resource: { label: "Documentation Arduino", url: "https://docs.arduino.cc/" } }
        ]
      },
      {
        title: "2. Programmation embarquée",
        items: [
          { label: "C/C++ pour systèmes embarqués", level: "core" }
        ]
      },
      {
        title: "3. Protocoles IoT",
        items: [
          { label: "MQTT, LoRa", level: "core", resource: { label: "mqtt.org - Documentation", url: "https://mqtt.org/" } }
        ]
      },
      {
        title: "4. Cloud et connectivité",
        items: [
          { label: "Envoi de données vers le cloud, dashboards IoT", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "HETEC : parcours technologies numériques et IA", level: "core" },
          { label: "Djanta Lab : recherche et innovation, domaine émergent au Togo", level: "option" }
        ]
      }
    ]
  },

  "blockchain-web3": {
    type: "role",
    domain: "Développement",
    level: "Avancé",
    togoVerified: true,
    title: "Développeur Blockchain / Web3",
    subtitle: "Construire des applications décentralisées et des smart contracts",
    icon: "⛓️",
    sections: [
      {
        title: "1. Fondamentaux blockchain",
        items: [
          { label: "Mécanismes de consensus, cryptographie de base", level: "core" }
        ]
      },
      {
        title: "2. Smart contracts",
        items: [
          { label: "Solidity et Ethereum", level: "core", resource: { label: "Documentation Solidity", url: "https://docs.soliditylang.org/" } }
        ]
      },
      {
        title: "3. Outils",
        items: [
          { label: "Hardhat, Remix, MetaMask", level: "core", resource: { label: "Ethereum.org - Guides développeurs", url: "https://ethereum.org/en/developers/docs/" } }
        ]
      },
      {
        title: "4. Sécurité",
        items: [
          { label: "Vulnérabilités courantes des smart contracts", level: "core" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Domaine encore émergent au Togo, communauté naissante autour des événements GDG Lomé et DevFest", level: "core" }
        ]
      }
    ]
  },

  "marketing-digital": {
    type: "role",
    domain: "Marketing digital",
    level: "Débutant",
    togoVerified: true,
    title: "Marketing Digital",
    subtitle: "Développer la présence et l'audience d'une marque en ligne",
    icon: "📣",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "SEO (référencement naturel)", level: "core" },
          { label: "SEM et stratégie de contenu", level: "core" }
        ]
      },
      {
        title: "2. Publicité en ligne",
        items: [
          { label: "Meta Ads", level: "core", resource: { label: "Meta Business Help Center", url: "https://www.facebook.com/business/help" } },
          { label: "Google Ads", level: "core", resource: { label: "Centre d'aide Google Ads", url: "https://support.google.com/google-ads" } }
        ]
      },
      {
        title: "3. Analytics",
        items: [
          { label: "Google Analytics, tableaux de bord de performance", level: "core", resource: { label: "Centre d'aide Google Analytics", url: "https://support.google.com/analytics" } }
        ]
      },
      {
        title: "4. Email marketing",
        items: [
          { label: "Campagnes et automatisation", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Djanta Academy et CUBE : formations entrepreneuriat et compétences numériques", level: "core" }
        ]
      }
    ]
  },

  "community-manager": {
    type: "role",
    domain: "Marketing digital",
    level: "Débutant",
    togoVerified: true,
    title: "Community Manager",
    subtitle: "Animer et développer une communauté de marque sur les réseaux sociaux",
    icon: "💬",
    sections: [
      {
        title: "1. Stratégie de contenu",
        items: [
          { label: "Ligne éditoriale, calendrier de publication", level: "core" }
        ]
      },
      {
        title: "2. Gestion des réseaux sociaux",
        items: [
          { label: "Facebook, Instagram, LinkedIn, TikTok", level: "core" }
        ]
      },
      {
        title: "3. Animation de communauté",
        items: [
          { label: "Modération, gestion de crise", level: "core" }
        ]
      },
      {
        title: "4. Analyse de performance",
        items: [
          { label: "Indicateurs d'engagement", level: "core" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Djanta Academy et CUBE : formations numériques accessibles", level: "core" }
        ]
      }
    ]
  },

  "formateur-informatique": {
    type: "role",
    domain: "Gestion & Management",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Formateur en Informatique",
    subtitle: "Transmettre des compétences numériques à des apprenants",
    icon: "🎓",
    sections: [
      {
        title: "1. Pédagogie",
        items: [
          { label: "Conception de programme de formation", level: "core" }
        ]
      },
      {
        title: "2. Expertise technique",
        items: [
          { label: "Maîtrise approfondie du domaine enseigné", level: "core" }
        ]
      },
      {
        title: "3. Outils pédagogiques",
        items: [
          { label: "Plateformes e-learning, supports de cours", level: "core" }
        ]
      },
      {
        title: "4. Évaluation",
        items: [
          { label: "Évaluation des acquis des apprenants", level: "core" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "IAI-Togo, ESGIS, HETEC et Djanta Academy : structures employant des formateurs en informatique", level: "core" }
        ]
      }
    ]
  },

  "consultant-transfo-digitale": {
    type: "role",
    domain: "Gestion & Management",
    level: "Avancé",
    togoVerified: true,
    title: "Consultant en Transformation Digitale",
    subtitle: "Accompagner les organisations dans leur passage au numérique",
    icon: "🧭",
    sections: [
      {
        title: "1. Diagnostic",
        items: [
          { label: "Audit de maturité digitale d'une organisation", level: "core" }
        ]
      },
      {
        title: "2. Stratégie",
        items: [
          { label: "Feuille de route de transformation digitale", level: "core" }
        ]
      },
      {
        title: "3. Conduite du changement",
        items: [
          { label: "Accompagnement des équipes, formation interne", level: "core" }
        ]
      },
      {
        title: "4. Gouvernance IT",
        items: [
          { label: "Choix technologiques, priorisation des investissements", level: "core" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Djanta Tech Hub et CUBE : contexte institutionnel de la transformation numérique togolaise", level: "core" }
        ]
      }
    ]
  },

  "data-engineer": {
    type: "role",
    domain: "Data & IA",
    level: "Avancé",
    togoVerified: true,
    title: "Data Engineer",
    subtitle: "Construire les pipelines qui collectent, transforment et livrent la donnée",
    icon: "🔧",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "SQL avancé et modélisation de données", level: "core", resource: { label: "Voir roadmap compétence SQL", url: "roadmap.html?id=sql" } },
          { label: "Python pour le traitement de données", level: "core", resource: { label: "Voir roadmap compétence Python", url: "roadmap.html?id=python" } }
        ]
      },
      {
        title: "2. Pipelines de données",
        items: [
          { label: "ETL / ELT : extraction, transformation, chargement", level: "core" },
          { label: "Orchestration : Apache Airflow", level: "core", resource: { label: "Documentation Apache Airflow", url: "https://airflow.apache.org/docs/" } }
        ]
      },
      {
        title: "3. Stockage",
        items: [
          { label: "Data warehouse et data lake", level: "core" },
          { label: "Bases NoSQL et systèmes distribués", level: "option" }
        ]
      },
      {
        title: "4. Qualité et gouvernance",
        items: [
          { label: "Qualité de données, tests et monitoring de pipelines", level: "core" }
        ]
      },
      {
        title: "5. Cloud",
        items: [
          { label: "Services de données cloud", level: "option", resource: { label: "Voir roadmap compétence Cloud", url: "roadmap.html?id=cloud" } }
        ]
      },
      {
        title: "6. Écosystème togolais",
        items: [
          { label: "Postes réels observés sur le marché togolais (Data Engineer, apprentissage ou senior)", level: "core" },
          { label: "PyCon Togo : communauté Python pertinente pour ce métier", level: "option", resource: { label: "pycontg.pytogo.org", url: "https://pycontg.pytogo.org/" } }
        ]
      }
    ]
  },

  "dba": {
    type: "role",
    domain: "Data & IA",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Administrateur de Bases de Données (DBA)",
    subtitle: "Garantir la performance, la disponibilité et la sécurité des bases de données",
    icon: "🗃️",
    sections: [
      {
        title: "1. Fondamentaux SQL",
        items: [
          { label: "Modélisation, index, transactions", level: "core", resource: { label: "Voir roadmap compétence SQL", url: "roadmap.html?id=sql" } }
        ]
      },
      {
        title: "2. Administration",
        items: [
          { label: "Installation, configuration, mises à jour des SGBD", level: "core" },
          { label: "Gestion des utilisateurs et des droits d'accès", level: "core" }
        ]
      },
      {
        title: "3. Performance",
        items: [
          { label: "Optimisation des requêtes et des index", level: "core" },
          { label: "Surveillance de la charge et des ressources", level: "core" }
        ]
      },
      {
        title: "4. Sauvegarde et reprise",
        items: [
          { label: "Politiques de sauvegarde et restauration", level: "core" },
          { label: "Haute disponibilité et réplication", level: "option" }
        ]
      },
      {
        title: "5. Sécurité des données",
        items: [
          { label: "Chiffrement, audit d'accès", level: "core" }
        ]
      },
      {
        title: "6. Écosystème togolais",
        items: [
          { label: "Profils DBA recherchés régulièrement sur les job boards togolais (SQL/NoSQL, big data)", level: "core" },
          { label: "ESGIS, Université de Lomé (CIC) : bases en gestion de données", level: "option" }
        ]
      }
    ]
  },

  "graphiste": {
    type: "role",
    domain: "Produit & Design",
    level: "Débutant",
    togoVerified: true,
    title: "Graphiste / Infographiste",
    subtitle: "Créer les visuels et supports de communication d'une marque",
    icon: "🖌️",
    sections: [
      {
        title: "1. Fondamentaux du design graphique",
        items: [
          { label: "Théorie des couleurs, typographie, composition", level: "core" }
        ]
      },
      {
        title: "2. Outils",
        items: [
          { label: "Adobe Photoshop et Illustrator", level: "core" },
          { label: "Canva pour la production rapide", level: "option" }
        ]
      },
      {
        title: "3. Production",
        items: [
          { label: "Identité visuelle, logos, chartes graphiques", level: "core" },
          { label: "Supports imprimés : flyers, roll-ups, affiches", level: "core" },
          { label: "Visuels pour réseaux sociaux", level: "core" }
        ]
      },
      {
        title: "4. Vidéo et montage",
        items: [
          { label: "Montage vidéo de base pour supports digitaux", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Poste fréquemment demandé combiné avec webmaster ou community management dans les PME togolaises", level: "core" }
        ]
      }
    ]
  },

  "webmaster": {
    type: "role",
    domain: "Développement",
    level: "Débutant",
    togoVerified: true,
    title: "Webmaster",
    subtitle: "Gérer et maintenir un site web au quotidien",
    icon: "🧰",
    sections: [
      {
        title: "1. Gestion de site",
        items: [
          { label: "WordPress : installation, thèmes, plugins", level: "core", resource: { label: "Documentation WordPress", url: "https://wordpress.org/documentation/" } },
          { label: "Mises à jour et maintenance courante", level: "core" }
        ]
      },
      {
        title: "2. Contenu",
        items: [
          { label: "Rédaction et publication de contenu web", level: "core" },
          { label: "Bases SEO pour le référencement", level: "core" }
        ]
      },
      {
        title: "3. Technique de base",
        items: [
          { label: "HTML/CSS de base pour les ajustements", level: "core", resource: { label: "Voir roadmap compétence JavaScript", url: "roadmap.html?id=javascript" } },
          { label: "Sauvegarde et sécurité du site", level: "core" }
        ]
      },
      {
        title: "4. Écosystème togolais",
        items: [
          { label: "Rôle courant dans les PME togolaises, souvent combiné avec design graphique et gestion des réseaux sociaux", level: "core" }
        ]
      }
    ]
  },

  "ecommerce-manager": {
    type: "role",
    domain: "Marketing digital",
    level: "Intermédiaire",
    togoVerified: true,
    title: "E-commerce Manager",
    subtitle: "Piloter une boutique en ligne, de la mise en rayon à la vente",
    icon: "🛒",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Plateformes e-commerce : Shopify, WooCommerce", level: "core", resource: { label: "Documentation WooCommerce", url: "https://woocommerce.com/documentation/" } }
        ]
      },
      {
        title: "2. Catalogue et opérations",
        items: [
          { label: "Gestion du catalogue produits, fiches produits", level: "core" },
          { label: "Gestion des commandes et de la logistique", level: "core" }
        ]
      },
      {
        title: "3. Paiement",
        items: [
          { label: "Intégration des paiements mobiles (Flooz, T-Money, Mobile Money)", level: "core", note: "Essentiel pour le marché togolais." }
        ]
      },
      {
        title: "4. Acquisition et conversion",
        items: [
          { label: "Marketing digital appliqué à l'e-commerce", level: "core", resource: { label: "Voir roadmap métier Marketing Digital", url: "roadmap.html?id=marketing-digital" } },
          { label: "Optimisation du taux de conversion", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Catégorie e-commerce active sur les job boards togolais", level: "core" },
          { label: "Djanta Start et CUBE : accompagnement de projets e-commerce", level: "option" }
        ]
      }
    ]
  },

  "dsi-responsable-informatique": {
    type: "role",
    domain: "Gestion & Management",
    level: "Avancé",
    togoVerified: true,
    title: "Responsable Informatique / DSI",
    subtitle: "Piloter la stratégie et les ressources informatiques d'une organisation",
    icon: "🧑‍💼",
    sections: [
      {
        title: "1. Vision stratégique",
        items: [
          { label: "Alignement de la stratégie IT avec les objectifs de l'organisation", level: "core" },
          { label: "Gestion du budget informatique", level: "core" }
        ]
      },
      {
        title: "2. Management d'équipe",
        items: [
          { label: "Encadrement des équipes techniques (dev, infra, support)", level: "core" }
        ]
      },
      {
        title: "3. Infrastructure et sécurité",
        items: [
          { label: "Supervision de l'infrastructure et des systèmes d'information", level: "core", resource: { label: "Voir roadmap métier Administrateur Systèmes et Réseaux", url: "roadmap.html?id=sysadmin" } },
          { label: "Gouvernance de la cybersécurité", level: "core", resource: { label: "Voir roadmap métier Cybersécurité & Réseaux", url: "roadmap.html?id=cyber" } }
        ]
      },
      {
        title: "4. Gestion de projets",
        items: [
          { label: "Pilotage de projets de transformation numérique", level: "core", resource: { label: "Voir roadmap métier Chef de Projet IT", url: "roadmap.html?id=project-manager" } }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Poste recherché régulièrement via des cabinets comme AfricaWork au Togo", level: "core" },
          { label: "Accessible généralement après plusieurs années d'expérience technique", level: "option" }
        ]
      }
    ]
  },

  "informatique-industrielle": {
    type: "role",
    domain: "Infrastructure & DevOps",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Ingénieur en Informatique Industrielle",
    subtitle: "Automatiser et superviser les processus industriels",
    icon: "⚙️",
    sections: [
      {
        title: "1. Automatisation",
        items: [
          { label: "Automates programmables industriels (API/PLC)", level: "core" },
          { label: "Capteurs et actionneurs", level: "core" }
        ]
      },
      {
        title: "2. Supervision",
        items: [
          { label: "Systèmes SCADA de supervision industrielle", level: "core" }
        ]
      },
      {
        title: "3. Réseaux industriels",
        items: [
          { label: "Protocoles industriels (Modbus, Profibus)", level: "core" },
          { label: "Notions réseaux classiques", level: "option", resource: { label: "Voir roadmap compétence Réseaux", url: "roadmap.html?id=reseaux" } }
        ]
      },
      {
        title: "4. Programmation",
        items: [
          { label: "Programmation bas niveau et systèmes embarqués", level: "core", resource: { label: "Voir roadmap métier Ingénieur IoT / Systèmes Embarqués", url: "roadmap.html?id=iot-embarque" } }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Postes réguliers via AfricaWork Togo (Ingénieur et Technicien en Informatique Industrielle)", level: "core" }
        ]
      }
    ]
  },

  "rssi": {
    type: "role",
    domain: "Sécurité",
    level: "Avancé",
    togoVerified: true,
    title: "RSSI / Responsable de la Sécurité des Systèmes d'Information",
    subtitle: "Piloter la stratégie de cybersécurité et la gestion des risques d'une organisation",
    icon: "🛡️",
    sections: [
      {
        title: "1. Bases techniques",
        items: [
          { label: "Solide culture cybersécurité et réseaux", level: "core", resource: { label: "Voir roadmap métier Cybersécurité & Réseaux", url: "roadmap.html?id=cyber" } }
        ]
      },
      {
        title: "2. Gouvernance",
        items: [
          { label: "Politique de sécurité des systèmes d'information (PSSI)", level: "core" },
          { label: "Normes ISO 27001, gestion des risques", level: "core" }
        ]
      },
      {
        title: "3. Conformité",
        items: [
          { label: "Loi n°2018-026 sur la cybersécurité et la cybercriminalité (Togo)", level: "core", resource: { label: "ancy.gouv.tg", url: "https://ancy.gouv.tg/" } },
          { label: "Protection des données personnelles", level: "core" }
        ]
      },
      {
        title: "4. Gestion de crise",
        items: [
          { label: "Plan de réponse aux incidents", level: "core" },
          { label: "Coordination avec un CERT/CSIRT", level: "option", note: "Au Togo, coordination possible avec CERT.tg." }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Poste réel recherché au Togo (ex. BostonSolux Togo)", level: "core" },
          { label: "ANCy et CERT.tg : interlocuteurs institutionnels de référence", level: "core", resource: { label: "cert.tg", url: "https://cert.tg/" } }
        ]
      }
    ]
  },

  "auditeur-ssi": {
    type: "role",
    domain: "Sécurité",
    level: "Avancé",
    togoVerified: true,
    title: "Auditeur en Sécurité des Systèmes d'Information",
    subtitle: "Évaluer la conformité et les vulnérabilités des systèmes d'une organisation",
    icon: "🔍",
    sections: [
      {
        title: "1. Bases techniques",
        items: [
          { label: "Réseaux, systèmes et sécurité applicative", level: "core", resource: { label: "Voir roadmap métier Cybersécurité & Réseaux", url: "roadmap.html?id=cyber" } }
        ]
      },
      {
        title: "2. Méthodologie d'audit",
        items: [
          { label: "Audit organisationnel et technique", level: "core" },
          { label: "Tests d'intrusion dans un cadre d'audit", level: "core" }
        ]
      },
      {
        title: "3. Référentiels",
        items: [
          { label: "ISO 27001, référentiels d'audit reconnus", level: "core" }
        ]
      },
      {
        title: "4. Restitution",
        items: [
          { label: "Rédaction de rapports d'audit et recommandations", level: "core" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Cyber Defense Africa (Togo) : recrute régulièrement des auditeurs SSI", level: "core" },
          { label: "ANCy : autorité nationale de référence en cybersécurité", level: "core", resource: { label: "ancy.gouv.tg", url: "https://ancy.gouv.tg/" } }
        ]
      }
    ]
  },

  "architecte-entreprise": {
    type: "role",
    domain: "Gestion & Management",
    level: "Avancé",
    togoVerified: true,
    title: "Architecte d'Entreprise",
    subtitle: "Aligner les systèmes d'information sur la stratégie globale d'une organisation",
    icon: "🏛️",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Différence architecture d'entreprise / architecture logicielle", level: "core", resource: { label: "Voir roadmap métier Architecte Logiciel", url: "roadmap.html?id=architecte-logiciel" } },
          { label: "Cartographie du système d'information", level: "core" }
        ]
      },
      {
        title: "2. Cadres méthodologiques",
        items: [
          { label: "TOGAF ou cadres équivalents", level: "core" }
        ]
      },
      {
        title: "3. Alignement stratégique",
        items: [
          { label: "Traduction des besoins métier en architecture cible", level: "core" },
          { label: "Feuille de route de transformation du SI", level: "core" }
        ]
      },
      {
        title: "4. Gouvernance",
        items: [
          { label: "Standards, urbanisation du SI, gestion des dépendances", level: "core" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Poste confirmé à l'Agence Togo Digital (ATD), agence publique pilotant la transformation numérique de l'État", level: "core" },
          { label: "Rôle senior, généralement accessible après plusieurs années en architecture logicielle ou conseil IT", level: "option" }
        ]
      }
    ]
  },

  "juriste-it": {
    type: "role",
    domain: "Gestion & Management",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Juriste IT / Droit du Numérique",
    subtitle: "Sécuriser juridiquement les projets technologiques et la conformité numérique",
    icon: "⚖️",
    sections: [
      {
        title: "1. Fondamentaux juridiques",
        items: [
          { label: "Droit des contrats appliqué à l'IT", level: "core" },
          { label: "Propriété intellectuelle et logicielle", level: "core" }
        ]
      },
      {
        title: "2. Protection des données",
        items: [
          { label: "Protection des données personnelles", level: "core" },
          { label: "Cadre légal togolais de la cybersécurité (loi n°2018-026)", level: "core", resource: { label: "ancy.gouv.tg", url: "https://ancy.gouv.tg/" } }
        ]
      },
      {
        title: "3. Contrats et négociation",
        items: [
          { label: "Contrats de prestation IT, SLA, licences logicielles", level: "core" }
        ]
      },
      {
        title: "4. Conformité",
        items: [
          { label: "Veille réglementaire numérique", level: "core" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Poste confirmé à l'Agence Togo Digital (ATD)", level: "core" }
        ]
      }
    ]
  },

  "scrum-master": {
    type: "role",
    domain: "Gestion & Management",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Scrum Master",
    subtitle: "Faciliter l'application des méthodes agiles au sein d'une équipe produit",
    icon: "🔄",
    sections: [
      {
        title: "1. Fondamentaux Agile",
        items: [
          { label: "Manifeste agile, cadre Scrum", level: "core", resource: { label: "Scrum.org - Ressources", url: "https://www.scrum.org/resources" } },
          { label: "Rôles Scrum : Product Owner, équipe de développement", level: "core" }
        ]
      },
      {
        title: "2. Cérémonies",
        items: [
          { label: "Sprint planning, daily, review, rétrospective", level: "core" }
        ]
      },
      {
        title: "3. Facilitation",
        items: [
          { label: "Levée des obstacles (blockers)", level: "core" },
          { label: "Coaching d'équipe et amélioration continue", level: "core" }
        ]
      },
      {
        title: "4. Outils",
        items: [
          { label: "Jira, tableaux Kanban", level: "core" }
        ]
      },
      {
        title: "5. Certifications",
        items: [
          { label: "Professional Scrum Master (PSM)", level: "core", resource: { label: "Scrum.org - Certifications PSM", url: "https://www.scrum.org/professional-scrum-certifications" } }
        ]
      },
      {
        title: "6. Écosystème togolais",
        items: [
          { label: "Poste confirmé à l'Agence Togo Digital (ATD)", level: "core" }
        ]
      }
    ]
  },

  "integrateur-systemes": {
    type: "role",
    domain: "Infrastructure & DevOps",
    level: "Intermédiaire",
    togoVerified: true,
    title: "Intégrateur Systèmes",
    subtitle: "Assembler et faire communiquer différents systèmes et logiciels entre eux",
    icon: "🔗",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Architecture des systèmes existants", level: "core" },
          { label: "Notions réseaux et infrastructure", level: "core", resource: { label: "Voir roadmap compétence Réseaux", url: "roadmap.html?id=reseaux" } }
        ]
      },
      {
        title: "2. Intégration",
        items: [
          { label: "API et interopérabilité entre systèmes", level: "core" },
          { label: "Middleware et bus de données", level: "option" }
        ]
      },
      {
        title: "3. Déploiement",
        items: [
          { label: "Installation et paramétrage de solutions tierces", level: "core" },
          { label: "Tests d'intégration", level: "core" }
        ]
      },
      {
        title: "4. Support",
        items: [
          { label: "Résolution des incidents d'intégration", level: "core" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Poste confirmé à l'Agence Togo Digital (ATD)", level: "core" }
        ]
      }
    ]
  },

  "ux-writer": {
    type: "role",
    domain: "Produit & Design",
    level: "Débutant",
    togoVerified: true,
    title: "UX Writer / Spécialiste en Microcopy",
    subtitle: "Écrire les textes d'interface qui guident et rassurent l'utilisateur",
    icon: "✍️",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Principes de clarté et de concision", level: "core" },
          { label: "Ton et voix de marque", level: "core" }
        ]
      },
      {
        title: "2. Microcopy",
        items: [
          { label: "Boutons, messages d'erreur, états vides", level: "core" },
          { label: "Textes de confirmation et d'onboarding", level: "core" }
        ]
      },
      {
        title: "3. Collaboration",
        items: [
          { label: "Travail en binôme avec les UX/UI Designers", level: "core", resource: { label: "Voir roadmap métier UX/UI Designer", url: "roadmap.html?id=ux-ui" } }
        ]
      },
      {
        title: "4. Tests",
        items: [
          { label: "Tests utilisateurs de contenu", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais",
        items: [
          { label: "Poste confirmé à l'Agence Togo Digital (ATD), rôle encore rare au Togo", level: "core" }
        ]
      }
    ]
  },

  "sre": {
    type: "role",
    domain: "Infrastructure & DevOps",
    level: "Avancé",
    togoVerified: false,
    title: "Site Reliability Engineer (SRE)",
    subtitle: "Garantir la fiabilité, la disponibilité et la performance des systèmes en production",
    icon: "📈",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Administration Linux et scripting", level: "core", resource: { label: "Voir roadmap compétence Linux", url: "roadmap.html?id=linux" } },
          { label: "Notions réseaux et systèmes distribués", level: "core", resource: { label: "Voir roadmap compétence Réseaux", url: "roadmap.html?id=reseaux" } }
        ]
      },
      {
        title: "2. Fiabilité",
        items: [
          { label: "SLI, SLO, SLA et budgets d'erreur", level: "core" },
          { label: "Gestion des incidents et post-mortems", level: "core" }
        ]
      },
      {
        title: "3. Observabilité",
        items: [
          { label: "Monitoring, logging, tracing distribué", level: "core", resource: { label: "Documentation Prometheus", url: "https://prometheus.io/docs/introduction/overview/" } }
        ]
      },
      {
        title: "4. Automatisation",
        items: [
          { label: "Infrastructure as Code", level: "core", resource: { label: "Voir roadmap métier DevOps & Cloud", url: "roadmap.html?id=devops" } },
          { label: "Conteneurisation et orchestration", level: "core", resource: { label: "Voir roadmap compétence Docker", url: "roadmap.html?id=docker" } }
        ]
      }
    ]
  },

  "platform-engineer": {
    type: "role",
    domain: "Infrastructure & DevOps",
    level: "Avancé",
    togoVerified: false,
    title: "Platform Engineer",
    subtitle: "Construire les plateformes internes qui accélèrent le travail des équipes de développement",
    icon: "🧱",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Cloud et conteneurisation", level: "core", resource: { label: "Voir roadmap compétence Cloud", url: "roadmap.html?id=cloud" } }
        ]
      },
      {
        title: "2. Internal Developer Platform",
        items: [
          { label: "Self-service pour les équipes produit", level: "core" },
          { label: "Golden paths et standardisation", level: "core" }
        ]
      },
      {
        title: "3. Outillage",
        items: [
          { label: "Kubernetes et opérateurs", level: "core", resource: { label: "Documentation Kubernetes", url: "https://kubernetes.io/fr/docs/home/" } },
          { label: "CI/CD as a service", level: "core" }
        ]
      },
      {
        title: "4. Culture DevOps",
        items: [
          { label: "Collaboration avec les équipes produit", level: "core" }
        ]
      }
    ]
  },

  "solutions-engineer": {
    type: "role",
    domain: "Gestion & Management",
    level: "Intermédiaire",
    togoVerified: false,
    title: "Solutions Engineer / Ingénieur Avant-Vente",
    subtitle: "Faire le lien technique entre un produit et les besoins d'un client",
    icon: "🤝",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Compréhension technique approfondie du produit vendu", level: "core" },
          { label: "Bases API et intégrations", level: "core" }
        ]
      },
      {
        title: "2. Avant-vente",
        items: [
          { label: "Démonstrations techniques (démos)", level: "core" },
          { label: "Réponse aux appels d'offres techniques", level: "core" }
        ]
      },
      {
        title: "3. Relation client",
        items: [
          { label: "Communication technique à un public non technique", level: "core" }
        ]
      },
      {
        title: "4. Proof of concept",
        items: [
          { label: "Mise en place de POC et pilotes", level: "core" }
        ]
      }
    ]
  },

  "technical-writer": {
    type: "role",
    domain: "Produit & Design",
    level: "Débutant",
    togoVerified: false,
    title: "Rédacteur Technique / Technical Writer",
    subtitle: "Documenter les produits et systèmes pour les rendre compréhensibles",
    icon: "📝",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Clarté, structure, vulgarisation technique", level: "core" },
          { label: "Compréhension de base du produit documenté (code, API)", level: "core" }
        ]
      },
      {
        title: "2. Types de documentation",
        items: [
          { label: "Documentation développeur (API, SDK)", level: "core" },
          { label: "Guides utilisateurs et tutoriels", level: "core" }
        ]
      },
      {
        title: "3. Outils",
        items: [
          { label: "Markdown, générateurs de documentation statique", level: "core" },
          { label: "Outils de gestion de version (Git)", level: "option", resource: { label: "Voir roadmap compétence Git & GitHub", url: "roadmap.html?id=git-github" } }
        ]
      },
      {
        title: "4. Collaboration",
        items: [
          { label: "Travail avec les équipes produit et ingénierie", level: "core" }
        ]
      }
    ]
  },

  "devrel": {
    type: "role",
    domain: "Marketing digital",
    level: "Intermédiaire",
    togoVerified: false,
    title: "Developer Advocate / DevRel Engineer",
    subtitle: "Créer le lien entre une entreprise tech et sa communauté de développeurs",
    icon: "📢",
    sections: [
      {
        title: "1. Fondamentaux techniques",
        items: [
          { label: "Maîtrise pratique du produit ou langage promu", level: "core" }
        ]
      },
      {
        title: "2. Contenu",
        items: [
          { label: "Articles techniques, tutoriels, démos de code", level: "core" },
          { label: "Prises de parole en conférence", level: "core" }
        ]
      },
      {
        title: "3. Communauté",
        items: [
          { label: "Animation de communauté de développeurs", level: "core" },
          { label: "Recueil de retours produit auprès des utilisateurs", level: "core" }
        ]
      },
      {
        title: "4. Écosystème",
        items: [
          { label: "Participation à des meetups et conférences tech", level: "option" }
        ]
      }
    ]
  },

  "analyste-soc": {
    type: "role",
    domain: "Sécurité",
    level: "Intermédiaire",
    togoVerified: false,
    title: "Analyste SOC (Security Operations Center)",
    subtitle: "Surveiller, détecter et réagir aux menaces de sécurité en temps réel",
    icon: "🚨",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Réseaux et systèmes", level: "core", resource: { label: "Voir roadmap compétence Réseaux", url: "roadmap.html?id=reseaux" } }
        ]
      },
      {
        title: "2. Détection",
        items: [
          { label: "SIEM : corrélation et analyse d'alertes", level: "core" },
          { label: "Analyse de logs et de trafic réseau", level: "core" }
        ]
      },
      {
        title: "3. Réponse à incident",
        items: [
          { label: "Triage et qualification des incidents", level: "core" },
          { label: "Escalade et remédiation", level: "core" }
        ]
      },
      {
        title: "4. Certifications",
        items: [
          { label: "CompTIA Security+", level: "option", resource: { label: "CompTIA Security+", url: "https://www.comptia.org/certifications/security" } }
        ]
      }
    ]
  },

  "pentester": {
    type: "role",
    domain: "Sécurité",
    level: "Avancé",
    togoVerified: false,
    title: "Pentester / Ethical Hacker",
    subtitle: "Simuler des attaques pour identifier les failles de sécurité avant les attaquants réels",
    icon: "🕵️",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Réseaux, systèmes, sécurité applicative", level: "core", resource: { label: "Voir roadmap métier Cybersécurité & Réseaux", url: "roadmap.html?id=cyber" } }
        ]
      },
      {
        title: "2. Méthodologie",
        items: [
          { label: "Reconnaissance, exploitation, post-exploitation", level: "core" },
          { label: "OWASP Top 10", level: "core", resource: { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" } }
        ]
      },
      {
        title: "3. Outils",
        items: [
          { label: "Nmap, Metasploit, Burp Suite", level: "core", resource: { label: "Documentation Nmap", url: "https://nmap.org/book/man.html" } }
        ]
      },
      {
        title: "4. Certifications",
        items: [
          { label: "CEH (Certified Ethical Hacker)", level: "option" },
          { label: "OSCP (Offensive Security Certified Professional)", level: "option" }
        ]
      }
    ]
  },

  "dpo": {
    type: "role",
    domain: "Sécurité",
    level: "Avancé",
    togoVerified: false,
    title: "Data Protection Officer (DPO)",
    subtitle: "Garantir la conformité d'une organisation en matière de protection des données",
    icon: "🔏",
    sections: [
      {
        title: "1. Fondamentaux juridiques",
        items: [
          { label: "Cadres de protection des données (RGPD et équivalents)", level: "core" },
          { label: "Droits des personnes concernées", level: "core" }
        ]
      },
      {
        title: "2. Gouvernance",
        items: [
          { label: "Cartographie des traitements de données", level: "core" },
          { label: "Analyses d'impact (AIPD/PIA)", level: "core" }
        ]
      },
      {
        title: "3. Sécurité des données",
        items: [
          { label: "Collaboration avec les équipes sécurité IT", level: "core", resource: { label: "Voir roadmap métier RSSI", url: "roadmap.html?id=rssi" } }
        ]
      },
      {
        title: "4. Sensibilisation",
        items: [
          { label: "Formation des équipes internes", level: "core" }
        ]
      }
    ]
  },

  "product-owner": {
    type: "role",
    domain: "Produit & Design",
    level: "Intermédiaire",
    togoVerified: false,
    title: "Product Owner",
    subtitle: "Porter la vision produit au sein d'une équipe agile et prioriser le backlog",
    icon: "📦",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Différence Product Owner / Product Manager", level: "core", resource: { label: "Voir roadmap métier Product Manager", url: "roadmap.html?id=product-manager" } }
        ]
      },
      {
        title: "2. Backlog",
        items: [
          { label: "Rédaction de user stories", level: "core" },
          { label: "Priorisation et raffinement du backlog", level: "core" }
        ]
      },
      {
        title: "3. Collaboration Scrum",
        items: [
          { label: "Sprint planning et revue de sprint", level: "core", resource: { label: "Voir roadmap métier Scrum Master", url: "roadmap.html?id=scrum-master" } }
        ]
      },
      {
        title: "4. Certifications",
        items: [
          { label: "Professional Scrum Product Owner (PSPO)", level: "option", resource: { label: "Scrum.org - Certifications", url: "https://www.scrum.org/professional-scrum-certifications" } }
        ]
      }
    ]
  },

  "engineering-manager": {
    type: "role",
    domain: "Gestion & Management",
    level: "Avancé",
    togoVerified: false,
    title: "Engineering Manager",
    subtitle: "Encadrer une équipe d'ingénieurs et faire le lien entre technique et organisation",
    icon: "🧑‍🏫",
    sections: [
      {
        title: "1. Bases techniques",
        items: [
          { label: "Solide expérience préalable en développement", level: "core", resource: { label: "Voir roadmap métier Développeur Backend", url: "roadmap.html?id=backend" } }
        ]
      },
      {
        title: "2. Management",
        items: [
          { label: "Recrutement et évaluation des ingénieurs", level: "core" },
          { label: "One-on-one et développement de carrière", level: "core" }
        ]
      },
      {
        title: "3. Livraison",
        items: [
          { label: "Planification technique et gestion des priorités", level: "core" }
        ]
      },
      {
        title: "4. Culture d'équipe",
        items: [
          { label: "Qualité du code et bonnes pratiques d'équipe", level: "core" }
        ]
      }
    ]
  },

  "cto": {
    type: "role",
    domain: "Gestion & Management",
    level: "Avancé",
    togoVerified: false,
    title: "CTO / Directeur Technique",
    subtitle: "Définir et porter la vision technologique globale d'une organisation",
    icon: "🧑‍💻",
    sections: [
      {
        title: "1. Vision technique",
        items: [
          { label: "Choix d'architecture et de stack à long terme", level: "core", resource: { label: "Voir roadmap métier Architecte Logiciel", url: "roadmap.html?id=architecte-logiciel" } }
        ]
      },
      {
        title: "2. Leadership",
        items: [
          { label: "Structuration et recrutement des équipes techniques", level: "core" }
        ]
      },
      {
        title: "3. Stratégie",
        items: [
          { label: "Alignement technologie / objectifs business", level: "core" },
          { label: "Gestion des risques techniques", level: "core" }
        ]
      },
      {
        title: "4. Représentation",
        items: [
          { label: "Interface avec investisseurs et partenaires sur les sujets techniques", level: "option" }
        ]
      }
    ]
  },

  "ux-researcher": {
    type: "role",
    domain: "Produit & Design",
    level: "Intermédiaire",
    togoVerified: false,
    title: "UX Researcher",
    subtitle: "Comprendre les utilisateurs en profondeur pour guider les décisions produit",
    icon: "🔬",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Méthodes de recherche qualitative et quantitative", level: "core" }
        ]
      },
      {
        title: "2. Collecte de données",
        items: [
          { label: "Entretiens utilisateurs, sondages", level: "core" },
          { label: "Tests d'utilisabilité", level: "core" }
        ]
      },
      {
        title: "3. Analyse",
        items: [
          { label: "Synthèse des insights, personas", level: "core" }
        ]
      },
      {
        title: "4. Collaboration",
        items: [
          { label: "Restitution aux équipes produit et design", level: "core", resource: { label: "Voir roadmap métier UX/UI Designer", url: "roadmap.html?id=ux-ui" } }
        ]
      }
    ]
  },

  "technical-program-manager": {
    type: "role",
    domain: "Gestion & Management",
    level: "Avancé",
    togoVerified: false,
    title: "Technical Program Manager (TPM)",
    subtitle: "Coordonner des programmes techniques complexes impliquant plusieurs équipes",
    icon: "🗂️",
    sections: [
      {
        title: "1. Bases techniques",
        items: [
          { label: "Compréhension des systèmes et de l'architecture concernés", level: "core" }
        ]
      },
      {
        title: "2. Coordination",
        items: [
          { label: "Gestion des dépendances entre équipes", level: "core" },
          { label: "Planification de programmes multi-équipes", level: "core" }
        ]
      },
      {
        title: "3. Communication",
        items: [
          { label: "Reporting aux parties prenantes techniques et non techniques", level: "core" }
        ]
      },
      {
        title: "4. Outils",
        items: [
          { label: "Jira, roadmapping multi-projets", level: "core" }
        ]
      }
    ]
  },

  "business-analyst-it": {
    type: "role",
    domain: "Gestion & Management",
    level: "Intermédiaire",
    togoVerified: false,
    title: "Business Analyst IT",
    subtitle: "Traduire les besoins métier en exigences fonctionnelles pour les équipes techniques",
    icon: "📋",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Recueil et analyse des besoins métier", level: "core" }
        ]
      },
      {
        title: "2. Spécifications",
        items: [
          { label: "Rédaction de cahiers des charges fonctionnels", level: "core" },
          { label: "Modélisation de processus (BPMN)", level: "core" }
        ]
      },
      {
        title: "3. Liaison technique",
        items: [
          { label: "Collaboration avec les équipes de développement", level: "core" }
        ]
      },
      {
        title: "4. Validation",
        items: [
          { label: "Recette fonctionnelle et validation utilisateur", level: "core" }
        ]
      }
    ]
  },

  "game-developer": {
    type: "role",
    domain: "Développement",
    level: "Intermédiaire",
    togoVerified: false,
    title: "Développeur de Jeux Vidéo",
    subtitle: "Programmer la logique et les mécaniques d'un jeu vidéo",
    icon: "🎮",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Programmation orientée objet et structures de données", level: "core" },
          { label: "Mathématiques appliquées au jeu (vecteurs, physique de base)", level: "core" }
        ]
      },
      {
        title: "2. Moteurs de jeu",
        items: [
          { label: "Unity (C#)", level: "core", resource: { label: "Documentation Unity", url: "https://docs.unity3d.com/Manual/index.html" } },
          { label: "Unreal Engine (C++/Blueprints)", level: "option", resource: { label: "Documentation Unreal Engine", url: "https://dev.epicgames.com/documentation/en-us/unreal-engine" } }
        ]
      },
      {
        title: "3. Gameplay",
        items: [
          { label: "Systèmes de gameplay, IA de jeu basique", level: "core" }
        ]
      },
      {
        title: "4. Publication",
        items: [
          { label: "Optimisation et publication sur plateformes (Steam, mobile)", level: "option" }
        ]
      }
    ]
  },

  "game-designer": {
    type: "role",
    domain: "Produit & Design",
    level: "Intermédiaire",
    togoVerified: false,
    title: "Game Designer",
    subtitle: "Concevoir les règles, la progression et l'expérience d'un jeu",
    icon: "🕹️",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Mécaniques de jeu et boucles de gameplay", level: "core" },
          { label: "Équilibrage et courbes de progression", level: "core" }
        ]
      },
      {
        title: "2. Documentation",
        items: [
          { label: "Rédaction de game design documents (GDD)", level: "core" }
        ]
      },
      {
        title: "3. Prototypage",
        items: [
          { label: "Prototypage rapide de mécaniques", level: "core" }
        ]
      },
      {
        title: "4. Playtesting",
        items: [
          { label: "Tests de jouabilité et itération", level: "core" }
        ]
      }
    ]
  },

  "ar-vr-developer": {
    type: "role",
    domain: "Développement",
    level: "Avancé",
    togoVerified: false,
    title: "Développeur AR/VR",
    subtitle: "Créer des expériences immersives en réalité augmentée et virtuelle",
    icon: "🥽",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Notions 3D : mesh, textures, éclairage", level: "core" }
        ]
      },
      {
        title: "2. Outils",
        items: [
          { label: "Unity avec AR Foundation / SDK VR", level: "core", resource: { label: "Documentation Unity", url: "https://docs.unity3d.com/Manual/index.html" } }
        ]
      },
      {
        title: "3. Interaction",
        items: [
          { label: "Interfaces immersives, tracking et contrôleurs", level: "core" }
        ]
      },
      {
        title: "4. Optimisation",
        items: [
          { label: "Performance sur casques et appareils mobiles", level: "core" }
        ]
      }
    ]
  },

  "robotique": {
    type: "role",
    domain: "Infrastructure & DevOps",
    level: "Avancé",
    togoVerified: false,
    title: "Ingénieur Robotique",
    subtitle: "Concevoir et programmer des systèmes robotiques autonomes",
    icon: "🤖",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Mécanique, capteurs, actionneurs", level: "core" },
          { label: "Électronique embarquée", level: "core", resource: { label: "Voir roadmap métier Ingénieur IoT / Systèmes Embarqués", url: "roadmap.html?id=iot-embarque" } }
        ]
      },
      {
        title: "2. Programmation",
        items: [
          { label: "C/C++ et Python pour la robotique", level: "core" },
          { label: "ROS (Robot Operating System)", level: "core" }
        ]
      },
      {
        title: "3. Perception et contrôle",
        items: [
          { label: "Vision par ordinateur de base, algorithmes de contrôle", level: "option" }
        ]
      },
      {
        title: "4. Intégration",
        items: [
          { label: "Simulation et tests physiques", level: "core" }
        ]
      }
    ]
  },

  "salesforce-admin": {
    type: "role",
    domain: "Infrastructure & DevOps",
    level: "Intermédiaire",
    togoVerified: false,
    title: "Administrateur Salesforce / CRM",
    subtitle: "Paramétrer et faire évoluer une plateforme CRM au service des équipes commerciales",
    icon: "☁️",
    sections: [
      {
        title: "1. Fondamentaux CRM",
        items: [
          { label: "Concepts de gestion de la relation client", level: "core" }
        ]
      },
      {
        title: "2. Salesforce",
        items: [
          { label: "Configuration des objets, workflows, permissions", level: "core", resource: { label: "Salesforce Trailhead", url: "https://trailhead.salesforce.com/" } }
        ]
      },
      {
        title: "3. Automatisation",
        items: [
          { label: "Flows et automatisations sans code", level: "core" }
        ]
      },
      {
        title: "4. Reporting",
        items: [
          { label: "Tableaux de bord et rapports CRM", level: "core" }
        ]
      }
    ]
  },

  "sap-consultant": {
    type: "role",
    domain: "Gestion & Management",
    level: "Avancé",
    togoVerified: false,
    title: "Consultant SAP",
    subtitle: "Implémenter et paramétrer les modules SAP dans une organisation",
    icon: "🧮",
    sections: [
      {
        title: "1. Fondamentaux ERP",
        items: [
          { label: "Concepts ERP et processus métier", level: "core", resource: { label: "Voir roadmap métier Développeur ERP/CRM", url: "roadmap.html?id=erp-crm" } }
        ]
      },
      {
        title: "2. Modules SAP",
        items: [
          { label: "Spécialisation sur un module (FI/CO, MM, SD...)", level: "core" }
        ]
      },
      {
        title: "3. Paramétrage",
        items: [
          { label: "Configuration et personnalisation des processus", level: "core" }
        ]
      },
      {
        title: "4. Accompagnement",
        items: [
          { label: "Formation des utilisateurs finaux", level: "core" }
        ]
      }
    ]
  },

  "quant-developer": {
    type: "role",
    domain: "Data & IA",
    level: "Avancé",
    togoVerified: false,
    title: "Quant Developer / Analyste Quantitatif",
    subtitle: "Développer des modèles mathématiques et des systèmes pour la finance",
    icon: "📐",
    sections: [
      {
        title: "1. Fondamentaux mathématiques",
        items: [
          { label: "Statistiques avancées, probabilités, calcul stochastique", level: "core" }
        ]
      },
      {
        title: "2. Programmation",
        items: [
          { label: "Python ou C++ pour le calcul haute performance", level: "core", resource: { label: "Voir roadmap compétence Python", url: "roadmap.html?id=python" } }
        ]
      },
      {
        title: "3. Modélisation financière",
        items: [
          { label: "Pricing de produits financiers, gestion des risques", level: "core" }
        ]
      },
      {
        title: "4. Données",
        items: [
          { label: "Traitement de séries temporelles financières", level: "core" }
        ]
      }
    ]
  },

  "growth-hacker": {
    type: "role",
    domain: "Marketing digital",
    level: "Intermédiaire",
    togoVerified: false,
    title: "Growth Hacker",
    subtitle: "Expérimenter rapidement pour accélérer la croissance d'un produit",
    icon: "🚀",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Funnel d'acquisition, activation, rétention (AARRR)", level: "core" }
        ]
      },
      {
        title: "2. Expérimentation",
        items: [
          { label: "Tests A/B et itération rapide", level: "core" }
        ]
      },
      {
        title: "3. Canaux",
        items: [
          { label: "SEO, paid ads, viralité, partenariats", level: "core", resource: { label: "Voir roadmap métier Marketing Digital", url: "roadmap.html?id=marketing-digital" } }
        ]
      },
      {
        title: "4. Analyse",
        items: [
          { label: "Analytics produit et métriques de croissance", level: "core" }
        ]
      }
    ]
  },

  "content-strategist": {
    type: "role",
    domain: "Marketing digital",
    level: "Débutant",
    togoVerified: false,
    title: "Content Strategist",
    subtitle: "Définir la stratégie de contenu d'une marque sur le long terme",
    icon: "📰",
    sections: [
      {
        title: "1. Stratégie",
        items: [
          { label: "Audit de contenu existant", level: "core" },
          { label: "Ligne éditoriale et piliers de contenu", level: "core" }
        ]
      },
      {
        title: "2. Production",
        items: [
          { label: "Calendrier éditorial multi-canal", level: "core" }
        ]
      },
      {
        title: "3. SEO et distribution",
        items: [
          { label: "Optimisation SEO du contenu", level: "core" }
        ]
      },
      {
        title: "4. Mesure",
        items: [
          { label: "Analyse de performance du contenu", level: "core" }
        ]
      }
    ]
  },

  "traffic-manager": {
    type: "role",
    domain: "Marketing digital",
    level: "Intermédiaire",
    togoVerified: false,
    title: "Traffic Manager",
    subtitle: "Piloter les campagnes publicitaires payantes pour maximiser le retour sur investissement",
    icon: "🎯",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Fonctionnement des enchères publicitaires", level: "core" }
        ]
      },
      {
        title: "2. Plateformes",
        items: [
          { label: "Google Ads", level: "core", resource: { label: "Centre d'aide Google Ads", url: "https://support.google.com/google-ads" } },
          { label: "Meta Ads", level: "core", resource: { label: "Meta Business Help Center", url: "https://www.facebook.com/business/help" } }
        ]
      },
      {
        title: "3. Optimisation",
        items: [
          { label: "Ciblage, budgets, optimisation des enchères", level: "core" }
        ]
      },
      {
        title: "4. Reporting",
        items: [
          { label: "Suivi du ROAS et reporting de campagne", level: "core" }
        ]
      }
    ]
  }
};

const DOMAINS = {
  "Développement": { icon: "💻", description: "Concevoir et construire des logiciels, applications et sites web." },
  "Data & IA": { icon: "📊", description: "Exploiter, analyser et modéliser la donnée." },
  "Sécurité": { icon: "🔐", description: "Protéger les systèmes, les données et les organisations." },
  "Produit & Design": { icon: "🎨", description: "Concevoir des produits et expériences centrées sur l'utilisateur." },
  "Infrastructure & DevOps": { icon: "☁️", description: "Déployer, exploiter et fiabiliser les systèmes et réseaux." },
  "Marketing digital": { icon: "📣", description: "Faire connaître, acquérir et fidéliser via le numérique." },
  "Gestion & Management": { icon: "🧭", description: "Piloter des projets, des équipes et des transformations." }
};

const SKILLS = {
  "git-github": {
    type: "skill",
    title: "Git & GitHub",
    subtitle: "Le contrôle de version, un incontournable pour tous les métiers tech",
    icon: "🔧",
    sections: [
      {
        title: "1. Bases de Git",
        items: [
          { label: "Installation et configuration (git config)", level: "core", resource: { label: "Git - Guide de démarrage", url: "https://git-scm.com/book/fr/v2/D%C3%A9marrage-rapide-Les-bases-de-Git" } },
          { label: "init, add, commit, status, log", level: "core" },
          { label: "Fichier .gitignore", level: "core" }
        ]
      },
      {
        title: "2. Branches et fusion",
        items: [
          { label: "Créer, changer, fusionner une branche (merge)", level: "core" },
          { label: "Gérer les conflits", level: "core" },
          { label: "Rebase", level: "option" }
        ]
      },
      {
        title: "3. Travailler avec GitHub",
        items: [
          { label: "Créer un dépôt, remote, push, pull, clone", level: "core", resource: { label: "GitHub Docs - Démarrer", url: "https://docs.github.com/fr/get-started" } },
          { label: "Pull requests et revue de code", level: "core" },
          { label: "Issues, projects, GitHub Actions", level: "option", resource: { label: "Documentation GitHub Actions", url: "https://docs.github.com/fr/actions" } }
        ]
      },
      {
        title: "4. Bonnes pratiques",
        items: [
          { label: "Convention de nommage des commits", level: "core" },
          { label: "GitFlow ou trunk-based development", level: "option" }
        ]
      }
    ]
  },

  "linux": {
    type: "skill",
    title: "Linux & Ligne de commande",
    subtitle: "Administration système et manipulation en ligne de commande",
    icon: "🐧",
    sections: [
      {
        title: "1. Bases",
        items: [
          { label: "Système de fichiers, navigation (cd, ls, pwd)", level: "core", resource: { label: "Documentation Ubuntu - Bases du terminal", url: "https://ubuntu.com/tutorials/command-line-for-beginners" } },
          { label: "Manipulation de fichiers (cp, mv, rm, mkdir)", level: "core" },
          { label: "Permissions (chmod, chown)", level: "core" }
        ]
      },
      {
        title: "2. Processus et services",
        items: [
          { label: "Gestion des processus (ps, top, kill)", level: "core" },
          { label: "Services systemd", level: "core" }
        ]
      },
      {
        title: "3. Scripting",
        items: [
          { label: "Scripts bash, variables, boucles, conditions", level: "core" },
          { label: "Cron pour les tâches planifiées", level: "option" }
        ]
      },
      {
        title: "4. Réseau et paquets",
        items: [
          { label: "Gestion de paquets (apt, yum)", level: "core" },
          { label: "Commandes réseau de base (ping, curl, ssh)", level: "core" }
        ]
      }
    ]
  },

  "docker": {
    type: "skill",
    title: "Docker & Conteneurisation",
    subtitle: "Empaqueter et exécuter des applications de façon reproductible",
    icon: "🐳",
    sections: [
      {
        title: "1. Concepts",
        items: [
          { label: "Différence conteneur / machine virtuelle", level: "core", resource: { label: "Docker - Vue d'ensemble", url: "https://docs.docker.com/get-started/docker-overview/" } },
          { label: "Images et conteneurs", level: "core" }
        ]
      },
      {
        title: "2. Utilisation",
        items: [
          { label: "Dockerfile : construire une image", level: "core", resource: { label: "Docker - Référence Dockerfile", url: "https://docs.docker.com/reference/dockerfile/" } },
          { label: "Volumes et persistance des données", level: "core" },
          { label: "Réseaux Docker", level: "core" }
        ]
      },
      {
        title: "3. Multi-conteneurs",
        items: [
          { label: "Docker Compose", level: "core", resource: { label: "Docker Compose - Documentation", url: "https://docs.docker.com/compose/" } }
        ]
      },
      {
        title: "4. Pour aller plus loin",
        items: [
          { label: "Optimisation d'images (multi-stage build)", level: "option" },
          { label: "Orchestration avec Kubernetes", level: "option", resource: { label: "Documentation Kubernetes", url: "https://kubernetes.io/fr/docs/home/" } }
        ]
      }
    ]
  },

  "sql": {
    type: "skill",
    title: "SQL & Bases de données relationnelles",
    subtitle: "Modéliser, interroger et optimiser des données structurées",
    icon: "🗄️",
    sections: [
      {
        title: "1. Bases",
        items: [
          { label: "SELECT, WHERE, ORDER BY, LIMIT", level: "core", resource: { label: "PostgreSQL - Tutoriel", url: "https://www.postgresql.org/docs/current/tutorial.html" } },
          { label: "Types de données et contraintes", level: "core" }
        ]
      },
      {
        title: "2. Modélisation",
        items: [
          { label: "Clés primaires, clés étrangères", level: "core" },
          { label: "Normalisation (1NF, 2NF, 3NF)", level: "core" }
        ]
      },
      {
        title: "3. Requêtes avancées",
        items: [
          { label: "Jointures (INNER, LEFT, RIGHT)", level: "core" },
          { label: "Agrégations (GROUP BY, HAVING)", level: "core" },
          { label: "Sous-requêtes et CTE", level: "option" }
        ]
      },
      {
        title: "4. Performance",
        items: [
          { label: "Index et plans d'exécution", level: "core" },
          { label: "Transactions et niveaux d'isolation", level: "option" }
        ]
      }
    ]
  },

  "javascript": {
    type: "skill",
    title: "JavaScript",
    subtitle: "Le langage du web, côté client comme côté serveur",
    icon: "📜",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Variables, types, opérateurs", level: "core", resource: { label: "MDN - Réapprendre JavaScript", url: "https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide" } },
          { label: "Fonctions et portée (scope)", level: "core" },
          { label: "Tableaux et objets", level: "core" }
        ]
      },
      {
        title: "2. ES6+",
        items: [
          { label: "Arrow functions, template literals", level: "core" },
          { label: "Destructuring, spread/rest", level: "core" },
          { label: "Modules import/export", level: "core" }
        ]
      },
      {
        title: "3. Asynchrone",
        items: [
          { label: "Callbacks et Promises", level: "core", resource: { label: "MDN - Programmation asynchrone", url: "https://developer.mozilla.org/fr/docs/Learn/JavaScript/Asynchronous" } },
          { label: "async/await", level: "core" },
          { label: "fetch API et gestion des erreurs réseau", level: "core" }
        ]
      },
      {
        title: "4. Environnements",
        items: [
          { label: "JavaScript dans le navigateur (DOM, événements)", level: "core" },
          { label: "Node.js côté serveur", level: "core", resource: { label: "Documentation Node.js", url: "https://nodejs.org/fr/docs" } }
        ]
      }
    ]
  },

  "python": {
    type: "skill",
    title: "Python",
    subtitle: "Un langage polyvalent : backend, data, automatisation",
    icon: "🐍",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Syntaxe, types, structures de données", level: "core", resource: { label: "Documentation Python", url: "https://docs.python.org/fr/3/tutorial/" } },
          { label: "Fonctions et modules", level: "core" }
        ]
      },
      {
        title: "2. Programmation orientée objet",
        items: [
          { label: "Classes, héritage, encapsulation", level: "core" }
        ]
      },
      {
        title: "3. Écosystème",
        items: [
          { label: "Gestion des paquets (pip, venv)", level: "core" },
          { label: "Tests avec pytest", level: "option" }
        ]
      },
      {
        title: "4. Spécialisations",
        items: [
          { label: "Web : Django ou FastAPI", level: "option", resource: { label: "Documentation FastAPI", url: "https://fastapi.tiangolo.com/" } },
          { label: "Data : Pandas, NumPy", level: "option", resource: { label: "Documentation Pandas", url: "https://pandas.pydata.org/docs/" } },
          { label: "Automatisation de scripts", level: "option" }
        ]
      }
    ]
  },

  "reseaux": {
    type: "skill",
    title: "Réseaux TCP/IP",
    subtitle: "Les fondations de toute infrastructure et de la cybersécurité",
    icon: "🌐",
    sections: [
      {
        title: "1. Modèles de référence",
        items: [
          { label: "Modèle OSI (les 7 couches)", level: "core" },
          { label: "Modèle TCP/IP", level: "core" }
        ]
      },
      {
        title: "2. Adressage",
        items: [
          { label: "Adressage IPv4, sous-réseaux (subnetting)", level: "core" },
          { label: "IPv6, bases", level: "option" }
        ]
      },
      {
        title: "3. Équipements et protocoles",
        items: [
          { label: "Switching, VLAN", level: "core" },
          { label: "Routage statique et dynamique", level: "core" },
          { label: "DNS, DHCP, NAT", level: "core" }
        ]
      },
      {
        title: "4. Sécurité réseau de base",
        items: [
          { label: "Pare-feu et listes de contrôle d'accès (ACL)", level: "core" },
          { label: "VPN", level: "option" }
        ]
      }
    ]
  },

  "cloud": {
    type: "skill",
    title: "Cloud (AWS / Azure / GCP)",
    subtitle: "Les fondamentaux communs aux principaux fournisseurs cloud",
    icon: "☁️",
    sections: [
      {
        title: "1. Concepts",
        items: [
          { label: "IaaS, PaaS, SaaS", level: "core" },
          { label: "Régions et zones de disponibilité", level: "core" }
        ]
      },
      {
        title: "2. Services de base",
        items: [
          { label: "Calcul : machines virtuelles (EC2, VM, Compute Engine)", level: "core", resource: { label: "AWS - Documentation EC2", url: "https://docs.aws.amazon.com/ec2/" } },
          { label: "Stockage objet (S3, Blob Storage, Cloud Storage)", level: "core" },
          { label: "Bases de données managées", level: "core" }
        ]
      },
      {
        title: "3. Réseau et sécurité cloud",
        items: [
          { label: "IAM : gestion des accès et permissions", level: "core" },
          { label: "VPC et groupes de sécurité", level: "core" }
        ]
      },
      {
        title: "4. Pour aller plus loin",
        items: [
          { label: "Facturation et optimisation des coûts", level: "option" },
          { label: "Certification fondamentale (AWS Cloud Practitioner, etc.)", level: "option" }
        ]
      }
    ]
  },

  "react": {
    type: "skill",
    title: "React",
    subtitle: "La bibliothèque JavaScript la plus utilisée pour construire des interfaces",
    icon: "⚛️",
    sections: [
      {
        title: "1. Prérequis",
        items: [
          { label: "JavaScript moderne (ES6+)", level: "core", resource: { label: "Voir roadmap compétence JavaScript", url: "roadmap.html?id=javascript" } }
        ]
      },
      {
        title: "2. Fondamentaux React",
        items: [
          { label: "Composants et JSX", level: "core", resource: { label: "React - Apprendre", url: "https://react.dev/learn" } },
          { label: "Props et state", level: "core" },
          { label: "Hooks : useState, useEffect", level: "core" }
        ]
      },
      {
        title: "3. Concepts avancés",
        items: [
          { label: "Gestion d'état globale (Context, Zustand, Redux)", level: "core" },
          { label: "Routing avec React Router", level: "core" },
          { label: "Hooks personnalisés", level: "option" }
        ]
      },
      {
        title: "4. Écosystème",
        items: [
          { label: "Next.js pour le rendu côté serveur", level: "option", resource: { label: "Documentation Next.js", url: "https://nextjs.org/docs" } },
          { label: "Tests avec React Testing Library", level: "option" }
        ]
      }
    ]
  },

  "vue": {
    type: "skill",
    title: "Vue.js",
    subtitle: "Framework JavaScript progressif, apprécié pour sa courbe d'apprentissage douce",
    icon: "💚",
    sections: [
      {
        title: "1. Prérequis",
        items: [
          { label: "JavaScript moderne (ES6+)", level: "core", resource: { label: "Voir roadmap compétence JavaScript", url: "roadmap.html?id=javascript" } }
        ]
      },
      {
        title: "2. Fondamentaux",
        items: [
          { label: "Templates et directives", level: "core", resource: { label: "Documentation Vue.js", url: "https://vuejs.org/guide/introduction.html" } },
          { label: "Composants et props", level: "core" },
          { label: "Composition API", level: "core" }
        ]
      },
      {
        title: "3. Concepts avancés",
        items: [
          { label: "Gestion d'état avec Pinia", level: "core" },
          { label: "Vue Router", level: "core" }
        ]
      },
      {
        title: "4. Écosystème",
        items: [
          { label: "Nuxt.js pour le rendu côté serveur", level: "option", resource: { label: "Documentation Nuxt", url: "https://nuxt.com/docs" } }
        ]
      }
    ]
  },

  "typescript": {
    type: "skill",
    title: "TypeScript",
    subtitle: "JavaScript typé pour des applications plus robustes et maintenables",
    icon: "🔷",
    sections: [
      {
        title: "1. Prérequis",
        items: [
          { label: "Bases solides en JavaScript", level: "core", resource: { label: "Voir roadmap compétence JavaScript", url: "roadmap.html?id=javascript" } }
        ]
      },
      {
        title: "2. Fondamentaux",
        items: [
          { label: "Types de base, interfaces, types personnalisés", level: "core", resource: { label: "Documentation TypeScript", url: "https://www.typescriptlang.org/docs/" } },
          { label: "Fonctions typées, génériques", level: "core" }
        ]
      },
      {
        title: "3. Concepts avancés",
        items: [
          { label: "Types utilitaires (Partial, Pick, Omit)", level: "core" },
          { label: "Configuration tsconfig.json", level: "core" }
        ]
      },
      {
        title: "4. Intégration",
        items: [
          { label: "TypeScript avec React, Node.js ou Vue", level: "option" }
        ]
      }
    ]
  },

  "nodejs": {
    type: "skill",
    title: "Node.js",
    subtitle: "Exécuter du JavaScript côté serveur pour construire des API et services",
    icon: "🟢",
    sections: [
      {
        title: "1. Prérequis",
        items: [
          { label: "JavaScript asynchrone", level: "core", resource: { label: "Voir roadmap compétence JavaScript", url: "roadmap.html?id=javascript" } }
        ]
      },
      {
        title: "2. Fondamentaux",
        items: [
          { label: "Modules, npm/yarn, gestion de paquets", level: "core", resource: { label: "Documentation Node.js", url: "https://nodejs.org/fr/docs" } },
          { label: "Système de fichiers et event loop", level: "core" }
        ]
      },
      {
        title: "3. Construction d'API",
        items: [
          { label: "Express.js : routes, middlewares", level: "core", resource: { label: "Documentation Express", url: "https://expressjs.com/fr/starter/installing.html" } },
          { label: "Gestion des erreurs et validation", level: "core" }
        ]
      },
      {
        title: "4. Production",
        items: [
          { label: "Variables d'environnement, logs, tests", level: "core" }
        ]
      }
    ]
  },

  "java": {
    type: "skill",
    title: "Java",
    subtitle: "Langage orienté objet incontournable dans les systèmes d'entreprise",
    icon: "☕",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Syntaxe, types, structures de contrôle", level: "core", resource: { label: "Documentation Java (Oracle)", url: "https://docs.oracle.com/en/java/" } },
          { label: "Programmation orientée objet", level: "core" }
        ]
      },
      {
        title: "2. Écosystème",
        items: [
          { label: "Gestion de dépendances : Maven ou Gradle", level: "core" },
          { label: "Collections et généricité", level: "core" }
        ]
      },
      {
        title: "3. Développement d'applications",
        items: [
          { label: "Spring Boot pour les API REST", level: "core", resource: { label: "Documentation Spring Boot", url: "https://spring.io/projects/spring-boot" } },
          { label: "JPA/Hibernate pour l'accès aux données", level: "core" }
        ]
      },
      {
        title: "4. Tests et qualité",
        items: [
          { label: "Tests unitaires avec JUnit", level: "core" }
        ]
      }
    ]
  },

  "cpp": {
    type: "skill",
    title: "C++",
    subtitle: "Langage bas niveau pour la performance : jeux, systèmes, finance",
    icon: "🔵",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Syntaxe, types, pointeurs et références", level: "core", resource: { label: "cppreference.com", url: "https://en.cppreference.com/w/" } },
          { label: "Gestion manuelle de la mémoire", level: "core" }
        ]
      },
      {
        title: "2. Programmation orientée objet",
        items: [
          { label: "Classes, héritage, polymorphisme", level: "core" }
        ]
      },
      {
        title: "3. Bibliothèque standard",
        items: [
          { label: "STL : conteneurs, algorithmes, itérateurs", level: "core" },
          { label: "Smart pointers (RAII)", level: "core" }
        ]
      },
      {
        title: "4. Applications",
        items: [
          { label: "Utilisation courante : moteurs de jeu, robotique, calcul haute performance", level: "core" }
        ]
      }
    ]
  },

  "go": {
    type: "skill",
    title: "Go (Golang)",
    subtitle: "Langage simple et performant, très utilisé pour les services cloud et DevOps",
    icon: "🐹",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Syntaxe, types, structures", level: "core", resource: { label: "Documentation Go", url: "https://go.dev/doc/" } },
          { label: "Gestion des erreurs à la Go", level: "core" }
        ]
      },
      {
        title: "2. Concurrence",
        items: [
          { label: "Goroutines et channels", level: "core" }
        ]
      },
      {
        title: "3. Écosystème",
        items: [
          { label: "Modules Go, gestion de dépendances", level: "core" },
          { label: "Construction d'API avec net/http ou Gin", level: "core" }
        ]
      },
      {
        title: "4. Applications",
        items: [
          { label: "Utilisation courante : outils cloud-native, CLI, microservices", level: "core" }
        ]
      }
    ]
  },

  "php": {
    type: "skill",
    title: "PHP",
    subtitle: "Langage serveur très répandu pour le développement web",
    icon: "🐘",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Syntaxe, types, structures de contrôle", level: "core", resource: { label: "Documentation PHP", url: "https://www.php.net/manual/fr/" } }
        ]
      },
      {
        title: "2. Programmation orientée objet",
        items: [
          { label: "Classes, interfaces, namespaces", level: "core" }
        ]
      },
      {
        title: "3. Écosystème",
        items: [
          { label: "Composer : gestion de dépendances", level: "core" },
          { label: "Laravel : routes, Eloquent ORM, migrations", level: "core", resource: { label: "Documentation Laravel", url: "https://laravel.com/docs" } }
        ]
      },
      {
        title: "4. Bonnes pratiques",
        items: [
          { label: "Sécurité web de base (injection, XSS)", level: "core" }
        ]
      }
    ]
  },

  "kubernetes": {
    type: "skill",
    title: "Kubernetes",
    subtitle: "Orchestrer des conteneurs à grande échelle",
    icon: "☸️",
    sections: [
      {
        title: "1. Prérequis",
        items: [
          { label: "Conteneurisation avec Docker", level: "core", resource: { label: "Voir roadmap compétence Docker", url: "roadmap.html?id=docker" } }
        ]
      },
      {
        title: "2. Concepts de base",
        items: [
          { label: "Pods, deployments, services", level: "core", resource: { label: "Documentation Kubernetes", url: "https://kubernetes.io/fr/docs/home/" } },
          { label: "ConfigMaps et Secrets", level: "core" }
        ]
      },
      {
        title: "3. Réseau et stockage",
        items: [
          { label: "Ingress et exposition des services", level: "core" },
          { label: "Volumes persistants", level: "option" }
        ]
      },
      {
        title: "4. Exploitation",
        items: [
          { label: "Helm pour le packaging d'applications", level: "option" },
          { label: "kubectl et debugging de base", level: "core" }
        ]
      }
    ]
  },

  "terraform": {
    type: "skill",
    title: "Terraform",
    subtitle: "Gérer son infrastructure comme du code, de façon reproductible",
    icon: "🌍",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Concepts Infrastructure as Code", level: "core", resource: { label: "Documentation Terraform", url: "https://developer.hashicorp.com/terraform/docs" } },
          { label: "Syntaxe HCL", level: "core" }
        ]
      },
      {
        title: "2. Utilisation",
        items: [
          { label: "Providers, ressources, variables", level: "core" },
          { label: "State et backends distants", level: "core" }
        ]
      },
      {
        title: "3. Organisation",
        items: [
          { label: "Modules réutilisables", level: "core" }
        ]
      },
      {
        title: "4. Bonnes pratiques",
        items: [
          { label: "Plan/apply en toute sécurité, gestion des environnements", level: "core" }
        ]
      }
    ]
  },

  "flutter": {
    type: "skill",
    title: "Flutter",
    subtitle: "Créer des applications mobiles natives pour Android et iOS avec un seul code",
    icon: "🦋",
    sections: [
      {
        title: "1. Prérequis",
        items: [
          { label: "Bases du langage Dart", level: "core", resource: { label: "Documentation Dart", url: "https://dart.dev/guides" } }
        ]
      },
      {
        title: "2. Fondamentaux Flutter",
        items: [
          { label: "Widgets et arbre de widgets", level: "core", resource: { label: "Documentation Flutter", url: "https://docs.flutter.dev/" } },
          { label: "Layouts et navigation", level: "core" }
        ]
      },
      {
        title: "3. Gestion d'état",
        items: [
          { label: "Provider ou Riverpod", level: "core" }
        ]
      },
      {
        title: "4. Intégration",
        items: [
          { label: "Appels API et stockage local", level: "core" },
          { label: "Publication sur Play Store et App Store", level: "option" }
        ]
      }
    ]
  },

  "kotlin-android": {
    type: "skill",
    title: "Kotlin & Android natif",
    subtitle: "Développer des applications Android natives modernes",
    icon: "📱",
    sections: [
      {
        title: "1. Fondamentaux Kotlin",
        items: [
          { label: "Syntaxe, null-safety, fonctions", level: "core", resource: { label: "Android Developers - Kotlin", url: "https://developer.android.com/kotlin" } }
        ]
      },
      {
        title: "2. Développement Android",
        items: [
          { label: "Activities, Fragments, cycle de vie", level: "core" },
          { label: "Jetpack Compose pour l'UI", level: "core" }
        ]
      },
      {
        title: "3. Architecture",
        items: [
          { label: "MVVM et ViewModel", level: "core" }
        ]
      },
      {
        title: "4. Publication",
        items: [
          { label: "Google Play Console", level: "option", resource: { label: "Play Console - Guide de lancement", url: "https://support.google.com/googleplay/android-developer/answer/9859152" } }
        ]
      }
    ]
  },

  "swift-ios": {
    type: "skill",
    title: "Swift & iOS natif",
    subtitle: "Développer des applications iOS natives avec Swift",
    icon: "🍎",
    sections: [
      {
        title: "1. Fondamentaux Swift",
        items: [
          { label: "Syntaxe, optionnels, structures et classes", level: "core", resource: { label: "Apple Developer - Swift", url: "https://developer.apple.com/swift/" } }
        ]
      },
      {
        title: "2. Développement iOS",
        items: [
          { label: "SwiftUI pour l'interface", level: "core" },
          { label: "Cycle de vie d'une application iOS", level: "core" }
        ]
      },
      {
        title: "3. Architecture",
        items: [
          { label: "MVVM en environnement Apple", level: "core" }
        ]
      },
      {
        title: "4. Publication",
        items: [
          { label: "App Store Connect", level: "option" }
        ]
      }
    ]
  },

  "mongodb": {
    type: "skill",
    title: "MongoDB & NoSQL",
    subtitle: "Bases de données orientées documents pour des besoins flexibles",
    icon: "🍃",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Modèle orienté documents, collections", level: "core", resource: { label: "Documentation MongoDB", url: "https://www.mongodb.com/docs/manual/" } }
        ]
      },
      {
        title: "2. Requêtes",
        items: [
          { label: "CRUD, requêtes et agrégations", level: "core" }
        ]
      },
      {
        title: "3. Modélisation",
        items: [
          { label: "Modélisation orientée documents vs relationnelle", level: "core" },
          { label: "Index et performance", level: "core" }
        ]
      },
      {
        title: "4. Écosystème",
        items: [
          { label: "Mongoose (Node.js) ou drivers officiels", level: "option" }
        ]
      }
    ]
  },

  "graphql": {
    type: "skill",
    title: "GraphQL",
    subtitle: "Un langage de requête flexible pour les API",
    icon: "🔺",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Schémas, types, requêtes et mutations", level: "core", resource: { label: "Documentation GraphQL", url: "https://graphql.org/learn/" } }
        ]
      },
      {
        title: "2. Différence avec REST",
        items: [
          { label: "Avantages et compromis face à une API REST", level: "core" }
        ]
      },
      {
        title: "3. Implémentation",
        items: [
          { label: "Serveur GraphQL (Apollo Server ou équivalent)", level: "core" },
          { label: "Résolveurs (resolvers)", level: "core" }
        ]
      },
      {
        title: "4. Côté client",
        items: [
          { label: "Client Apollo ou urql", level: "option" }
        ]
      }
    ]
  },

  "machine-learning": {
    type: "skill",
    title: "Machine Learning",
    subtitle: "Entraîner des modèles capables d'apprendre à partir de données",
    icon: "🧠",
    sections: [
      {
        title: "1. Prérequis",
        items: [
          { label: "Python et manipulation de données", level: "core", resource: { label: "Voir roadmap compétence Python", url: "roadmap.html?id=python" } },
          { label: "Statistiques et algèbre linéaire de base", level: "core" }
        ]
      },
      {
        title: "2. Apprentissage supervisé",
        items: [
          { label: "Régression et classification", level: "core", resource: { label: "Scikit-learn - Tutoriels", url: "https://scikit-learn.org/stable/tutorial/index.html" } }
        ]
      },
      {
        title: "3. Apprentissage non supervisé",
        items: [
          { label: "Clustering, réduction de dimension", level: "core" }
        ]
      },
      {
        title: "4. Deep Learning",
        items: [
          { label: "Réseaux de neurones, TensorFlow ou PyTorch", level: "option", resource: { label: "PyTorch - Tutoriels", url: "https://pytorch.org/tutorials/" } }
        ]
      },
      {
        title: "5. Mise en production",
        items: [
          { label: "Évaluation, déploiement de modèles", level: "option" }
        ]
      }
    ]
  },

  "solidity": {
    type: "skill",
    title: "Solidity & Smart Contracts",
    subtitle: "Programmer des contrats intelligents sur la blockchain Ethereum",
    icon: "⛓️",
    sections: [
      {
        title: "1. Prérequis",
        items: [
          { label: "Fonctionnement de la blockchain et d'Ethereum", level: "core", resource: { label: "Ethereum.org - Guides développeurs", url: "https://ethereum.org/en/developers/docs/" } }
        ]
      },
      {
        title: "2. Fondamentaux Solidity",
        items: [
          { label: "Syntaxe, types, fonctions de contrat", level: "core", resource: { label: "Documentation Solidity", url: "https://docs.soliditylang.org/" } }
        ]
      },
      {
        title: "3. Développement",
        items: [
          { label: "Hardhat ou Foundry pour le développement local", level: "core" },
          { label: "Tests de smart contracts", level: "core" }
        ]
      },
      {
        title: "4. Sécurité",
        items: [
          { label: "Vulnérabilités courantes (reentrancy, overflow)", level: "core" }
        ]
      }
    ]
  },

  "system-design": {
    type: "skill",
    title: "System Design",
    subtitle: "Concevoir des systèmes logiciels à grande échelle",
    icon: "🗺️",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Scalabilité horizontale vs verticale", level: "core" },
          { label: "Load balancing", level: "core" }
        ]
      },
      {
        title: "2. Données",
        items: [
          { label: "Sharding, réplication de bases de données", level: "core" },
          { label: "Cache (Redis, CDN)", level: "core" }
        ]
      },
      {
        title: "3. Architecture distribuée",
        items: [
          { label: "Files de messages, architecture événementielle", level: "core" },
          { label: "Théorème CAP", level: "option" }
        ]
      },
      {
        title: "4. Étude de cas",
        items: [
          { label: "Concevoir un système connu (ex : raccourcisseur d'URL, flux d'actualités)", level: "core" }
        ]
      }
    ]
  },

  "dsa": {
    type: "skill",
    title: "Data Structures & Algorithms",
    subtitle: "Les fondamentaux algorithmiques utiles pour tout développeur",
    icon: "🧮",
    sections: [
      {
        title: "1. Structures de données",
        items: [
          { label: "Tableaux, listes chaînées, piles, files", level: "core" },
          { label: "Arbres et graphes", level: "core" },
          { label: "Tables de hachage", level: "core" }
        ]
      },
      {
        title: "2. Algorithmes de base",
        items: [
          { label: "Tri et recherche", level: "core" },
          { label: "Récursivité", level: "core" }
        ]
      },
      {
        title: "3. Techniques avancées",
        items: [
          { label: "Programmation dynamique", level: "core" },
          { label: "Parcours de graphes (BFS, DFS)", level: "core" }
        ]
      },
      {
        title: "4. Complexité",
        items: [
          { label: "Notation Big O", level: "core" }
        ]
      }
    ]
  },

  "api-design": {
    type: "skill",
    title: "API Design (REST)",
    subtitle: "Concevoir des API cohérentes, prévisibles et faciles à utiliser",
    icon: "🔌",
    sections: [
      {
        title: "1. Fondamentaux REST",
        items: [
          { label: "Ressources, méthodes HTTP, codes de statut", level: "core" }
        ]
      },
      {
        title: "2. Conception",
        items: [
          { label: "Nommage des routes, versionnement", level: "core" },
          { label: "Pagination, filtrage, tri", level: "core" }
        ]
      },
      {
        title: "3. Sécurité et fiabilité",
        items: [
          { label: "Authentification, rate limiting", level: "core" }
        ]
      },
      {
        title: "4. Documentation",
        items: [
          { label: "OpenAPI/Swagger", level: "core" }
        ]
      }
    ]
  },

  "cicd": {
    type: "skill",
    title: "CI/CD",
    subtitle: "Automatiser les tests et le déploiement du code",
    icon: "🔁",
    sections: [
      {
        title: "1. Fondamentaux",
        items: [
          { label: "Intégration continue vs livraison/déploiement continu", level: "core" }
        ]
      },
      {
        title: "2. Pipelines",
        items: [
          { label: "GitHub Actions", level: "core", resource: { label: "Documentation GitHub Actions", url: "https://docs.github.com/fr/actions" } },
          { label: "GitLab CI ou Jenkins", level: "option" }
        ]
      },
      {
        title: "3. Bonnes pratiques",
        items: [
          { label: "Tests automatisés dans le pipeline", level: "core" },
          { label: "Stratégies de déploiement (blue-green, canary)", level: "option" }
        ]
      },
      {
        title: "4. Sécurité",
        items: [
          { label: "Gestion des secrets dans les pipelines", level: "core" }
        ]
      }
    ]
  }
};

// Fusion pour la recherche par id, quelle que soit la catégorie
const ALL_ROADMAPS = Object.assign({}, ROLES, SKILLS);

// ---- Écoles & universités ----
// Données vérifiées sur les sites officiels de chaque établissement (recherche août 2026).
// Statut "agree" : présence confirmée dans la liste des établissements privés d'enseignement
// supérieur agréés par le Ministère togolais de l'Enseignement Supérieur et de la Recherche
// (arrêté du 4 novembre 2022). null = non applicable (établissement public) ou statut particulier.
const SCHOOLS = {
  "ipnet": {
    name: "IPNET Institute of Technology",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence", "Master", "Formations certifiantes"],
    filieres: ["Intelligence Artificielle", "Science des Données", "Génie Logiciel", "Cybersécurité", "Développement Web & Mobile", "Réseaux, Systèmes & Sécurité"],
    duree: "Licence : 3 ans · Master : 2 ans",
    admission: "Concours d'entrée post-BAC (dossier + épreuves) ; Licence en informatique requise pour le Master",
    frais: "800 000 FCFA (L1) · 900 000 (L2) · 1 000 000 (L3) — exemple filière Cybersécurité, + inscription (50 000 FCFA puis 30 000 FCFA/an) et frais de dossier. Bourses sociales/mérite et paiement en 3 fois (source : ipnetuniversity.com, 2025).",
    site: "https://ipnetuniversity.com",
    description: "Institut privé fondé en 2003, très orienté pratique (80+ partenariats entreprises tech), élu « université la plus innovante du Togo » en 2022.",
    datesCles: {
      mode: "continue",
      note: "Pas de calendrier fixe publié en ligne : test d'admission et entretien de motivation, sans date annoncée.",
      contact: "ipnet@ipnetinstitute.com"
    }
  },
  "iai-togo": {
    name: "Institut Africain d'Informatique (IAI-Togo)",
    ville: ["Lomé"],
    statut: "inter-etats",
    agree: null,
    agreeNote: "École inter-États d'enseignement supérieur (réseau régional créé en 1971) : statut distinct des établissements privés togolais recensés par le Ministère.",
    niveaux: ["Licence Professionnelle", "Ingénieur des Travaux Informatiques", "Ingénieur Concepteur"],
    filieres: ["Génie Logiciel & Systèmes d'Information", "Administration des Systèmes et Réseaux", "Multimédia", "Technologies Web"],
    duree: "Cycle ITI / Licence Pro : 3 ans, avec stage en 2e et 3e années",
    admission: "Concours d'entrée (épreuves d'Anglais, Mathématiques, Français)",
    frais: "Non communiqué publiquement — seuls les frais annexes sont connus (concours : 15 000 FCFA/an, assurance : 1 000 FCFA/an). Contacte l'établissement pour le montant de la scolarité.",
    site: "https://new.iai-togo.tg/officiel",
    description: "École inter-États d'enseignement supérieur en informatique, présente au Togo depuis 2002, référence historique de la formation informatique dans la sous-région.",
    datesCles: {
      mode: "campagne",
      note: "Campagne annuelle avec concours écrit (mathématiques, techniques d'expression, anglais).",
      cloture: "21 août 2026, 17h00",
      concours: "1er septembre 2026",
      anneeReference: "2026-2027",
      urgent: true,
      urgentNote: "Clôture des candidatures le 21 août 2026 — échéance imminente.",
      aVerifier: true
    }
  },
  "esgis": {
    name: "ESGIS Togo (École Supérieure de Gestion, d'Informatique et des Sciences)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence", "Master"],
    filieres: ["Informatique de Gestion", "Développement d'Applications", "Systèmes et Réseaux", "Sécurité Informatique", "Intelligence Artificielle & Big Data"],
    duree: "BTS : 2 ans · Licence : 3 ans · Master : 2 ans après la Licence",
    admission: "Ouvert à tous les bacheliers en 1ère année ; dossier + entretien pour une admission directe en cours de cursus",
    frais: "Non communiqué publiquement — l'école renvoie explicitement au secrétariat local pour les tarifs. (Un document non officiel daté de 2021 circule en ligne mais n'est pas fiable pour l'année en cours.)",
    site: "https://www.esgis.org/",
    description: "École privée accréditée CAMES, présente au Togo, au Bénin et au Gabon, plus de 20 000 étudiants formés en 30 ans.",
    datesCles: {
      mode: "continue",
      note: "Pré-inscriptions conseillées dès la publication des résultats du Bac (juillet-août), places limitées en informatique. Sélection sur dossier et entretien, pas de concours à date fixe."
    }
  },
  "esig": {
    name: "ESIG Global Success (École Supérieure d'Informatique et de Gestion)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence", "Master"],
    filieres: ["Administrateur Réseaux", "Développeur d'Application", "Systèmes Informatiques et Logiciels", "Administration et Sécurité des Réseaux", "Cybersécurité", "Big Data"],
    duree: "BTS : 2 ans · Licence : 3 ans · Master : 2 ans",
    admission: "Pré-inscription en ligne ; le BTS est accessible directement après le Bac",
    frais: "350 000-450 000 FCFA/an (BTS) · 400 000-550 000 (Licence) · 550 000-750 000 (Master), paiement en 2-3 fois. Bourses FONAP, mobilité (Le Havre/Belgique) et mérite scolaire (source : esig.tg/faq).",
    site: "https://esig.tg/",
    description: "École fondée il y a plus de 15 ans, 92 spécialités du BTS au Master, accréditation Cisco Networking Academy, partenariat avec Sorbonne Paris Nord.",
    datesCles: {
      mode: "continue",
      note: "Pré-inscriptions ouvertes en continu, dossier uniquement (pas de concours) : formulaire en ligne puis contact sous 24h.",
      anneeReference: "2026-2027"
    }
  },
  "esiba": {
    name: "ESIBA (École Supérieure d'Informatique, de Business et d'Administration)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence", "Master"],
    filieres: ["Systèmes Informatiques et Logiciels", "Développement d'Application", "Sécurité des Réseaux et Télécommunications", "Informatique et Réseaux (Master)"],
    duree: "Licence : 3 ans · Master : 2 ans",
    admission: "Dossier d'inscription ; Licence en informatique ou domaine connexe requise pour le Master",
    frais: "Licence Systèmes Informatiques & Logiciels : 395 000 FCFA/an (L1-L2), 530 000 (L3). Master Informatique & Réseaux : 680 000 FCFA pour les 2 ans + 15 000 de dossier. Concours de bourses togolais (15 à 75 % de réduction).",
    site: "https://www.esiba.tg/",
    description: "École agréée par l'État togolais, membre de l'Agence Universitaire de la Francophonie (AUF), plus de 36 ans d'expérience en gestion et technologie.",
    datesCles: {
      mode: "inconnu",
      note: "Aucune date publiée en ligne — dossier PDF à soumettre directement.",
      contact: "esiba@esiba.tg / +228 90 81 41 78"
    }
  },
  "formatec": {
    name: "FORMATEC",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Brevet de Technicien", "Licence Professionnelle", "Master Professionnel"],
    filieres: ["Maintenance Informatique", "Administration de Réseaux", "Développeur d'Application", "Analyste Programmeur", "Génie Logiciel"],
    duree: "BT et Licence : 3 ans · Master : 2 ans",
    admission: "BEPC pour le BT · Bac ou BT pour la Licence · Licence Pro pour le Master",
    frais: "Licence Pro (options informatique) : 385 000 FCFA/an (1re-2e année), 450 000 (3e année) + inscription 50 000 FCFA puis 20 000 FCFA/an (source : fiche officielle 2025-2026).",
    site: "https://formatec.tg/",
    description: "Institut technique et professionnel fondé en 1996, certifié ISO 9001 depuis 2015.",
    datesCles: {
      mode: "continue",
      note: "Inscription continue pour les cycles Licence/BTS ; vagues ponctuelles pour les formations courtes.",
      rentree: "6 octobre (référence)",
      anneeReference: "2025-2026"
    }
  },
  "ucao-uut": {
    name: "UCAO-UUT — Département de Génie Informatique",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence", "Ingénierie (Master)"],
    filieres: ["Développement d'Applications", "Réseaux Informatiques et Télécommunication", "Cybersécurité", "Big Data", "Intelligence Artificielle", "Génie Logiciel"],
    duree: "Licence : 3 ans · Ingénierie : 5 ans",
    admission: "Bac scientifique (C, D, E, F) ; bonnes aptitudes en mathématiques et anglais",
    frais: "595 000 FCFA (L1, tarif jubilé) · 758 000 (L2-L3) · 858 000-958 000 (Master). Bourse « Étoile Scientifique » de 200 000 FCFA/an pour les étudiantes en informatique ; réduction fratrie de 50 000 FCFA/an (source : ucao-uut.tg/admissions).",
    site: "https://ucao-uut.tg/formation-recherche/formations/institut-ecole/dgi/",
    description: "Université catholique de plus de 15 000 étudiants ; le Département de Génie Informatique relève de l'École Supérieure d'Ingénieurs, encadrée par le CAMES et la Commission des Titres d'Ingénieur.",
    datesCles: {
      mode: "continue",
      note: "Pré-inscriptions ouvertes dès juillet, jusqu'à la rentrée — pas de date limite stricte.",
      ouverture: "15 juillet (référence)",
      rentree: "23 octobre, rentrée solennelle (référence)",
      anneeReference: "2025-2026"
    }
  },
  "lbs": {
    name: "Lomé Business School (LBS)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Bachelor", "Master", "Executive MBA"],
    filieres: ["Développement Web / Génie Logiciel", "Big Data", "Cloud Computing", "Réseaux et Cybersécurité"],
    duree: null,
    admission: "Inscription en ligne selon le niveau du candidat (Première, Terminale, Bac, Licence, Master)",
    frais: "900 000 FCFA/an (Bachelor) · 1 200 000 FCFA/an (Master) — inclut PC portable, kit et accès numérique (source : brochure officielle 2026-2027).",
    site: "https://lome-bs.com/",
    description: "Se présente comme la 1ère Business School du Togo, forte orientation professionnalisante (stages dès la 1ère année).",
    datesCles: {
      mode: "campagne",
      note: "Campagne annuelle avec test écrit (maths, français, culture générale ou logique selon le niveau) et entretien de motivation.",
      ouverture: "4 août, « semaines du bachelier » (référence)",
      cloture: "26 septembre (référence)",
      anneeReference: "2025-2026",
      aVerifier: true
    }
  },
  "defitech": {
    name: "Institut Polytechnique DEFITECH",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence", "Master"],
    filieres: ["Intelligence Artificielle et Big Data", "Systèmes et Réseaux Informatiques", "Génie Logiciel"],
    duree: "Licence : 3 ans (180 crédits) · Master : 2 ans",
    admission: "Bac ou équivalent pour l'entrée en L1 ; admission directe en L3 possible avec un BTS pertinent",
    frais: "Licence : 35 000 FCFA d'inscription + 485 000 FCFA/an (460 000 en cours du soir) · Master : 50 000 + 650 000 FCFA/an. Paiement en 3 tranches ou 7 mensualités (source : defitech.tg).",
    site: "https://defitech.tg/",
    description: "« L'école des battants », plus de 20 ans d'expérience, convention avec l'Université de Lomé, forte orientation entrepreneuriat.",
    datesCles: {
      mode: "continue",
      note: "Admission sur dossier uniquement, pas de concours.",
      rentree: "mi-octobre (référence 2024, non reconfirmée depuis)",
      anneeReference: "2024-2025",
      aVerifier: true
    }
  },
  "ecole-des-cadres": {
    name: "École des Cadres",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence"],
    filieres: ["Informatique de Gestion", "Systèmes et Réseaux Informatiques", "Développement d'Application", "Sécurité Informatique"],
    duree: null,
    admission: "BAC II requis pour le BTS et la Licence informatique",
    frais: "Non communiqué publiquement. Un concours de bourses a lieu chaque année en septembre (réduction sur les frais de scolarité, montant non précisé).",
    site: "https://ecoledescadres.com/",
    description: "Une des premières écoles professionnelles du Togo (1997), diplômes en partenariat avec l'Université du Littoral Côte d'Opale (France), accréditée CAMES.",
    datesCles: {
      mode: "continue",
      note: "Inscription continue ; un concours de bourses (réduction de frais, pas un concours d'entrée classique) a lieu chaque année en septembre.",
      concours: "18 septembre, concours de bourses (référence)",
      rentree: "29 septembre (référence)",
      anneeReference: "2025-2026"
    }
  },
  "universite-kara": {
    name: "Université de Kara",
    ville: ["Kara"],
    statut: "public",
    agree: null,
    niveaux: ["Licence", "Licence Professionnelle", "Master"],
    filieres: ["Mathématiques et Informatique Appliquées", "Sécurité Informatique et Cybersécurité", "Développement Web et Mobile", "Métiers du Multimédia et de l'Internet"],
    duree: "Licences en 3 ans, avec stage professionnel et soutenance en fin de cycle",
    admission: "Bac C, D ou E (session récente), sélection sur dossier",
    frais: "Master : de 176 500 FCFA/an (recherche, étudiants togolais/UEMOA) à plus d'1 000 000 FCFA (professionnel, étranger) — arrêté officiel 2026-2027. Licence non communiquée publiquement. Bourses d'État togolaises et bourses internationales (France, Inde) existantes.",
    site: "https://univkara.tg/",
    description: "2e université publique du Togo ; la Faculté des Sciences et Techniques (FAST) porte plusieurs licences professionnelles tech.",
    datesCles: {
      mode: "campagne",
      note: "Campagne annuelle publiée chaque année en août via le service DAAS (préinscription en ligne, puis dépôt physique du dossier).",
      ouverture: "18 septembre – 27 octobre, préinscription en ligne (référence 2025-2026)",
      cloture: "5 janvier, dépôt physique du dossier (référence 2025-2026)",
      rentree: "14 septembre 2026 (confirmée)",
      anneeReference: "2025-2026"
    }
  },
  "esa-togo": {
    name: "ESA Togo (École Supérieure des Affaires)",
    ville: ["Lomé", "Kara"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence Professionnelle", "Master Professionnel"],
    filieres: ["Génie Logiciel", "Réseaux et Télécommunications", "Maintenance Informatique et Réseaux", "Cybersécurité et Cybercriminalité"],
    duree: null,
    admission: "Inscriptions continues (critères détaillés non publiés en ligne)",
    frais: "449 999 FCFA/an (BTS/Licence 1-2) · 549 999 (Licence 3) · 669 999-799 999 (Master) + 50 000 FCFA d'inscription (source : échéancier officiel 2026-2027). Bourses ponctuelles par tirage au sort à la rentrée, non garanties chaque année.",
    site: "https://www.esatogo.com/",
    description: "École pluridisciplinaire fondée en 2010, plus de 33 filières, 1ère école togolaise certifiée ISO 9001.",
    datesCles: {
      mode: "continue",
      note: "Admission continue, avis sous 48 à 72h après étude du dossier — pas de date limite.",
      rentree: "5 octobre 2026, 8h (campus Agoè et Super Taco, confirmé)",
      anneeReference: "2026-2027"
    }
  },
  "college-paris-togo": {
    name: "Collège de Paris Togo",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    agreeNote: "Agréé sous le nom officiel « Institut UPSILON Collège de Paris Supérieur ».",
    niveaux: ["Bachelor", "Master / MS"],
    filieres: ["Administrateur des Systèmes d'Information", "Intelligence Artificielle & Big Data"],
    duree: null,
    admission: "Sur dossier (relevés de Bac, diplômes, lettre de motivation, CV)",
    frais: "Non communiqué publiquement — site officiel inaccessible au moment de la recherche, aucune source fiable trouvée.",
    site: "https://togo.collegedeparis.fr/",
    description: "Campus togolais du réseau français Collège de Paris, agréé par l'État togolais sous le nom « Institut UPSILON Collège de Paris Supérieur ».",
    datesCles: {
      mode: "inconnu",
      note: "Admission continue présumée (formulaire en ligne), aucune date confirmée publiquement.",
      contact: "+228 93 23 64 28 / +228 70 52 48 60"
    }
  },
  "epl": {
    name: "École Polytechnique de Lomé (EPL)",
    ville: ["Lomé"],
    statut: "public",
    agree: null,
    niveaux: ["Licence Fondamentale", "Licence Professionnelle", "Master", "Diplôme d'Ingénieur"],
    filieres: ["Informatique et Systèmes", "Intelligence Artificielle & Big Data", "Génie Logiciel", "Systèmes et Réseaux Informatiques"],
    duree: null,
    admission: "Concours d'entrée post-Bac (Bac C, D, E scientifique pour la licence fondamentale)",
    frais: "404 000 FCFA/an (étudiants togolais, inscription incluse) · 514 000 (salariés) · 754 000 (étrangers). Les 20% premiers au concours d'entrée ne paient que 50 000 FCFA de frais pédagogiques, le reste pris en charge par l'établissement (source : presse togolaise, recoupée sur 3 articles).",
    site: "https://univ-lome.tg/",
    description: "École d'ingénieurs publique, composante de l'Université de Lomé depuis 2022 (fusion de l'ENSI et du Centre Informatique et de Calcul).",
    datesCles: {
      mode: "campagne",
      note: "Concours écrit annuel réservé aux nouveaux bacheliers, dépôt possible à Lomé, Kara (DAAS) et dans les directions régionales.",
      ouverture: "17 août – 11 septembre 2026 (annoncé par voie de presse, à recouper avec le PDF officiel univ-lome.tg)",
      concours: "30 septembre 2026 (annoncé par voie de presse)",
      resultats: "11 octobre, campagne précédente (référence officielle confirmée)",
      anneeReference: "2025-2026 (officiel) / 2026-2027 (annoncé, non recoupé)",
      aVerifier: true
    }
  },
  "iaec": {
    name: "IAEC (Institut Africain d'Administration et d'Études Commerciales)",
    ville: ["Lomé", "Kara"],
    statut: "prive",
    agree: true,
    agreeNote: "Ne pas confondre avec le domaine iaec-university.tg, distinct et non vérifié — le site officiel de référence est iaectogo.com.",
    niveaux: ["BTS", "Licence", "Master"],
    filieres: ["Génie Logiciel", "Génie Informatique", "Réseaux et Télécommunications", "Sciences Informatiques et Télécommunications (Master)"],
    duree: null,
    admission: "Formulaire de demande en ligne",
    frais: "BTS : 35 000 FCFA d'inscription + 400 000 FCFA/an · Master : 60 000 + 600 000 FCFA/an. Licence non communiquée publiquement (aucun montant affiché sur le site).",
    site: "https://iaectogo.com/",
    description: "Un des tout premiers établissements privés d'enseignement supérieur du Togo (1986), membre du Groupe BK-Université.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié — confirmation de dossier sous 48h ouvrées après un entretien téléphonique obligatoire.",
      contact: "+228 93 90 66 66"
    }
  },
  "cifop": {
    name: "Centre Informatique de Formation et d'Orientation Professionnelle (CIFOP)",
    ville: ["Lomé", "Sokodé", "Bassar"],
    statut: "prive",
    agree: true,
    niveaux: ["BT", "BTS", "Licence Professionnelle", "Master"],
    filieres: ["Développement d'applications", "Informatique de gestion", "Comptabilité & Gestion", "Marketing", "Transport & Logistique"],
    duree: "BT : 2 ans · BTS : 2 ans · Licence Pro : 3 ans · Master : 2 ans",
    admission: "Sur dossier et test de niveau selon la filière et le cycle visé",
    site: "https://www.cifop-togo.org",
    description: "Centre de formation professionnelle fondé en 1992, seule école de ce comparatif présente hors de Lomé/Kara (campus à Sokodé et Bassar). Revendique 99% d'insertion professionnelle dans les 6 mois suivant le diplôme.",
    frais: "Non communiqué publiquement — contacte l'établissement directement.",
    datesCles: {
      mode: "campagne",
      rentree: "6 octobre 2026 (Licence & BTS 1) · 15 septembre 2026 (BTS 2, BT) · 2-3 novembre 2026 (Master)",
      anneeReference: "2026-2027",
      aVerifier: true,
      contact: "contact@cifoptogo.org"
    }
  },
  "ifnti": {
    name: "Institut de Formation aux Normes et Technologies de l'Informatique (IFNTI)",
    ville: ["Sokodé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence"],
    filieres: ["Informatique"],
    duree: "Licence LMD : 3 ans",
    admission: "Bacheliers scientifiques et étudiants en réorientation, concours d'entrée (10 000 FCFA)",
    site: "https://www.ifnti.com/",
    description: "Institut associatif fondé en 2009 à Sokodé, entièrement dédié à l'informatique (licence LMD), encadrement par des enseignants de niveau ingénieur, groupes de 24 étudiants maximum.",
    frais: "590 000 FCFA/an + 30 000 FCFA d'inscription (source : Edunews, 2022 — à reconfirmer, ces tarifs peuvent avoir changé).",
    datesCles: {
      mode: "continue",
      note: "Inscriptions ouvertes chaque année après le Bac, concours d'entrée obligatoire, pas de date fixe publiée en ligne.",
      contact: "contact@ifnti.com"
    }
  },
  "isac": {
    name: "Institut Supérieur Agata Carelli (ISAC)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence Professionnelle", "Master"],
    filieres: ["Génie Logiciel", "Maintenance et Réseau Informatique"],
    duree: null,
    admission: "Cours du jour et du soir, ouverts aux bacheliers",
    frais: "Non communiqué publiquement — le site les qualifie d'« abordables » sans montant précis.",
    site: "https://www.isactg.net/",
    description: "Institut catholique fondé par les Sœurs Canossiennes en 1999 (Agoè-Légbassito), reconnu par décret en 2015 et jugé « établissement de bonne qualité » par le Ministère en 2016.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne — contacte l'établissement directement."
    }
  },
  "ism-adonai": {
    name: "Institut Supérieur de Management Adonaï (ISM ADONAI)",
    ville: ["Lomé", "Atakpamé", "Kara"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence", "Master"],
    filieres: ["Systèmes Informatiques et Logiciels", "Réseaux Informatiques et Télécommunication", "Cybersécurité", "Maintenance et Réseaux Informatiques", "Génie Logiciel", "Développement d'Application"],
    duree: null,
    admission: "Sur dossier (relevé de notes du Bac certifié, acte de naissance, photo, fiche d'inscription)",
    frais: "Tarif promotionnel constaté pour 2025-2026 : 350 000 FCFA (L1) · 450 000 (L2) · 600 000 (L3) · 700 000 (M1) · 800 000 (M2) — lié à une opération portes ouvertes, à reconfirmer pour les tarifs standards (source : synergieplus.net).",
    site: "https://www.ismadonai.net/fr/nos-formations/",
    description: "École privée multi-pays certifiée ISO 9001:2015, fondée en 2005, présente aussi au Bénin et en Côte d'Ivoire, forte orientation professionnalisante.",
    datesCles: {
      mode: "continue",
      note: "Rentrée en septembre, calendrier précis non publié.",
      aVerifier: true
    }
  },
  "istm": {
    name: "Institut Supérieur de Technologies et de Management (ISTM)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence Professionnelle", "Master Professionnel"],
    filieres: ["Développeur d'Applications", "Administrateur de Réseaux Locaux d'Entreprises", "Maintenance Informatique", "Télécommunication"],
    duree: "BTS : 2 ans (référence)",
    admission: "Non précisée publiquement — à confirmer directement",
    frais: "Non communiqué publiquement.",
    site: "https://istm.tg/",
    description: "Institut privé créé en 2010 (Agoè Assiyéyé), plus de 2000 diplômés, offre diversifiée du BTS au Master en gestion, droit, logistique, informatique et télécoms, stages garantis.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne — contacte l'établissement directement."
    }
  },
  "issec-kouvahey": {
    name: "Institut Supérieur des Sciences Économiques et Commerciales Kouvahey (ISSEC-KOUVAHEY)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BT", "BTS"],
    filieres: ["Informatique de Gestion (option Développeur d'Applications)"],
    duree: "BT : 3 ans · BTS : 2 ans",
    admission: "Bac série C, D, G2, G3, ou BT Comptabilité/Commerce",
    frais: "Non communiqué publiquement.",
    site: "https://www.isseck.com",
    description: "École privée en sciences économiques et commerciales fondée en 2006, convention avec IPAC-France (Bachelor/MBA), cours du jour et du soir.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne — contacte l'établissement directement."
    }
  },
  "jumau-ita": {
    name: "Institut Supérieur des Technologies Avancées Jumau (JUMAU-ITA)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence", "Master", "Doctorat"],
    filieres: ["Génie Logiciel", "Maintenance et Réseaux", "Télécommunications", "Intelligence Artificielle"],
    duree: null,
    admission: "Non précisée publiquement — à confirmer directement",
    frais: "Non communiqué publiquement.",
    site: "https://jumau-ita.com/",
    description: "Institut fondé en 2010, membre de l'International Association of Universities (IAU/UNESCO), a lancé des programmes en intelligence artificielle en 2025.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne — contacte l'établissement directement."
    }
  },
  "imast": {
    name: "Institut de Mathématiques, des Sciences et Technologies (IMaST)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence Professionnelle"],
    filieres: ["Mathématiques-Informatique", "Sécurité Informatique", "Systèmes et Réseaux Informatiques", "Développement d'Applications"],
    duree: null,
    admission: "Bac requis, dossier — cours du jour et du soir disponibles",
    frais: "Non communiqué publiquement.",
    site: "https://imast.tg/",
    description: "Institut privé à Agoè-Nyivé, propose aussi BTS Télécommunications, classe prépa et licence Actuariat.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne — contacte l'établissement directement."
    }
  },
  "ecole-de-finance": {
    name: "École de Finance de Lomé (EFL, ex American Institute of Africa)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence"],
    filieres: ["Génie Logiciel", "Systèmes & Réseau"],
    duree: null,
    admission: "Non précisée publiquement — à confirmer directement",
    frais: "Non communiqué publiquement.",
    site: "https://aua-universities.org/",
    description: "École reconnue par arrêté n°2019/037/MESR/SG/DES, propose surtout des filières gestion/finance/économie ; informatique disponible en BTS et Licence seulement (pas de Master informatique identifié).",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne — contacte l'établissement directement."
    }
  },
  "global-wealth": {
    name: "Global Wealth University (Institut Universitaire Global Wealth, ex-IITM)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Bachelor", "Master"],
    filieres: ["Information Technology Management", "Computer and Software Engineering", "Artificial Intelligence & Robotics", "Computer Science", "Social Media & Digital Technology Management", "Telecommunication & Broadcasting Management"],
    duree: null,
    admission: "Diplôme secondaire pour le Bachelor ; diplôme Bachelor pour le Master (prérequis variables selon spécialité)",
    frais: "250 000-300 000 FCFA/session (Bachelor) · 300 000-350 000 FCFA/session (Master) selon la filière, + frais de candidature (10 000), d'acceptation (10 000), d'examen (35 000/matière/semestre) et de pratique (25 000/semestre) (source : cugw.tg).",
    site: "https://cugw.tg/",
    description: "Fondée en 2012, propose des filières en anglais (Faculty of ICT et Faculty of Sciences), programmes IA/robotique et informatique.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne — contacte l'établissement directement."
    }
  },
  "hest": {
    name: "École des Hautes Études de Sciences et Technologies (HEST)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence", "Master"],
    filieres: ["Systèmes et Réseaux Informatiques", "Développement d'Application", "Maintenance Informatique", "Informatique Industrielle", "Robotique et Intelligence Artificielle", "Cybersécurité", "UX/UI Design", "Génie Logiciel", "Ingénierie Informatique Mobile et Web"],
    duree: "BTS : 2 ans · Licence : 3 ans · Master : 2 ans",
    admission: "BTS : Bac toutes séries · Licence : Bac série scientifique ou équivalent · Master : Licence en sciences et technologies ou équivalent",
    frais: "Non communiqué publiquement — bourses disponibles de 50 000 à 250 000 FCFA (Licence/Master).",
    site: "https://www.hest-edu.net/",
    description: "Une des offres informatique les plus complètes du comparatif (BTS à Master), à Tokoin Wuiti, propose aussi économie/gestion et sciences de l'information et de la communication.",
    datesCles: {
      mode: "continue",
      note: "Rentrée BTS/Licence début octobre, Master mi-novembre (référence 2024-2025, à reconfirmer).",
      anneeReference: "2024-2025",
      aVerifier: true
    }
  },
  "escen": {
    name: "École Supérieure de Commerce et de l'Économie Numérique (ESCEN)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence Professionnelle", "Master Professionnel"],
    filieres: ["Intelligence Artificielle & Génie Logiciel"],
    duree: null,
    admission: "Non précisée publiquement — à confirmer directement",
    frais: "850 000 FCFA (Licence 1) · 1 300 000 FCFA (Master 1) — trouvé par recherche web, non recoupé sur une page officielle, à vérifier.",
    site: "https://escen.university/",
    description: "Se présente comme la 1ère école supérieure d'économie numérique d'Afrique subsaharienne francophone, filière IA & Génie Logiciel en partenariat avec l'école d'ingénieurs ESTIA (Biarritz, France), présentiel et à distance.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne — contacte l'établissement directement."
    }
  },
  "lucas": {
    name: "LUCAS University College",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence", "Master"],
    filieres: ["Développement d'Applications", "Réseaux et Télécommunications", "Sécurité Informatique", "Mathématiques et Informatique"],
    duree: null,
    admission: "Cours du jour, du soir, week-end, ou à distance avec séminaires mensuels",
    frais: "Non communiqué publiquement.",
    site: "https://www.lucas-universities-colleges.net/",
    description: "Fondé en 2018, réseau panafricain (présent aussi au Ghana, Niger, Mali), partenariats pour doubles diplômes avec MBway et My Digital School (France) et Griffith College (Irlande), incubateur pour jeunes entrepreneurs.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne — contacte l'établissement directement."
    }
  },
  "knowbridge": {
    name: "KNOWBRIDGE University Institute",
    ville: ["Sokodé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence", "Master"],
    filieres: ["Cybersécurité", "Génie des Technologies de l'Information"],
    duree: null,
    admission: "Sur dossier (admission.knowbridge.com), traitement 2 à 4 semaines, 2 programmes maximum par candidature",
    frais: "Licence : 590 000 FCFA/an + 30 000 FCFA d'inscription + 10 000 FCFA de dossier · Master : 750 000 FCFA/an + 50 000 FCFA d'inscription + 20 000 FCFA de dossier. Paiement en 3 tranches (source : knowbridge.com/pages/fees).",
    site: "https://www.knowbridge.com/",
    description: "Institut privé à Sokodé, formations en présentiel, à distance et modules flexibles, combine cybersécurité, développement logiciel et intelligence artificielle.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne — contacte l'établissement directement (admission.knowbridge.com)."
    }
  },
  "bakpessi": {
    name: "Institut Supérieur de Management Mgr BAKPESSI",
    ville: ["Kara"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence Professionnelle", "Master Professionnel"],
    filieres: ["Maintenance Informatique", "Développement d'Applications"],
    duree: null,
    admission: "Sur dossier (relevé de notes du Bac, diplôme, acte de naissance, photo, pièce d'identité, lettre de motivation, CV)",
    frais: "Non communiqué publiquement.",
    site: null,
    description: "Institut privé à Kara, fondé pour rapprocher l'enseignement supérieur des populations du nord du Togo ; offre informatique limitée à 2 filières BTS parmi 13 spécialités.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié — contact direct uniquement.",
      contact: "+228 26 60 13 67 / isgmgrb@gmail.com"
    }
  }
};

const VILLES = {
  "Lomé": { icon: "🏙️" },
  "Kara": { icon: "🏘️" },
  "Sokodé": { icon: "🏘️" },
  "Bassar": { icon: "🏘️" },
  "Atakpamé": { icon: "🏘️" }
};

// ---- Test d'orientation ----
// Chaque réponse pointe vers un domaine (voir DOMAINS). Le score final classe
// les 7 domaines selon le nombre de réponses correspondantes.
const QUIZ_QUESTIONS = [
  {
    type: "domain",
    question: "Qu'est-ce qui t'attire le plus dans la tech ?",
    options: [
      { label: "Construire des applications et des sites qui marchent bien", domain: "Développement" },
      { label: "Comprendre des chiffres, des tendances, entraîner des modèles", domain: "Data & IA" },
      { label: "Protéger des systèmes contre les attaques", domain: "Sécurité" },
      { label: "Créer des interfaces belles et faciles à utiliser", domain: "Produit & Design" },
      { label: "Faire tourner des serveurs et des infrastructures fiables", domain: "Infrastructure & DevOps" },
      { label: "Faire connaître un produit ou une marque en ligne", domain: "Marketing digital" },
      { label: "Organiser, planifier, piloter des équipes et des projets", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Dans un jeu vidéo, tu préfères plutôt...",
    options: [
      { label: "Créer des mods ou du contenu personnalisé", domain: "Développement" },
      { label: "Optimiser ta stratégie à partir de statistiques", domain: "Data & IA" },
      { label: "Chercher les failles et les limites du jeu", domain: "Sécurité" },
      { label: "Personnaliser ton avatar et ton interface", domain: "Produit & Design" },
      { label: "Monter et administrer un serveur multijoueur", domain: "Infrastructure & DevOps" },
      { label: "Streamer ou créer du contenu autour du jeu", domain: "Marketing digital" },
      { label: "Organiser un tournoi entre joueurs", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Face à un problème, ton premier réflexe...",
    options: [
      { label: "Écrire du code pour le résoudre", domain: "Développement" },
      { label: "Analyser des données pour comprendre pourquoi", domain: "Data & IA" },
      { label: "Chercher comment quelqu'un pourrait en abuser", domain: "Sécurité" },
      { label: "Repenser l'expérience pour que ça n'arrive plus", domain: "Produit & Design" },
      { label: "Vérifier si l'infrastructure tient la charge", domain: "Infrastructure & DevOps" },
      { label: "Communiquer dessus pour rassurer tout le monde", domain: "Marketing digital" },
      { label: "Réunir les bonnes personnes pour trancher", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Ton environnement de travail idéal...",
    options: [
      { label: "Seul·e, concentré·e, à écrire du code", domain: "Développement" },
      { label: "Entouré·e de tableaux de données et de graphiques", domain: "Data & IA" },
      { label: "En veille permanente, à surveiller des menaces", domain: "Sécurité" },
      { label: "Avec des maquettes, des couleurs, du visuel", domain: "Produit & Design" },
      { label: "En salle serveur ou sur des consoles cloud", domain: "Infrastructure & DevOps" },
      { label: "Sur les réseaux sociaux, au contact d'une audience", domain: "Marketing digital" },
      { label: "En réunion, à coordonner plusieurs personnes", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Ce qui te frustre le plus...",
    options: [
      { label: "Un code mal écrit qui plante", domain: "Développement" },
      { label: "Des données mal organisées ou peu fiables", domain: "Data & IA" },
      { label: "Une faille de sécurité qu'on préfère ignorer", domain: "Sécurité" },
      { label: "Une interface confuse et pénible à utiliser", domain: "Produit & Design" },
      { label: "Un serveur qui tombe en panne au mauvais moment", domain: "Infrastructure & DevOps" },
      { label: "Une campagne qui rate complètement sa cible", domain: "Marketing digital" },
      { label: "Un projet lancé sans plan clair", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Ce que tu ferais gratuitement, sur ton temps libre...",
    options: [
      { label: "Bidouiller un petit projet de code perso", domain: "Développement" },
      { label: "Explorer un jeu de données qui t'intéresse", domain: "Data & IA" },
      { label: "Regarder des vidéos sur des CTF ou du piratage éthique", domain: "Sécurité" },
      { label: "Redessiner l'appli d'une marque que tu utilises", domain: "Produit & Design" },
      { label: "Monter ton propre serveur ou Raspberry Pi", domain: "Infrastructure & DevOps" },
      { label: "Créer du contenu et faire grandir une page", domain: "Marketing digital" },
      { label: "Organiser un événement ou un club", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Une matière scolaire où tu es à l'aise...",
    options: [
      { label: "Algorithmique et logique", domain: "Développement" },
      { label: "Mathématiques et statistiques", domain: "Data & IA" },
      { label: "Informatique, avec l'envie de comprendre comment ça marche vraiment", domain: "Sécurité" },
      { label: "Arts plastiques et créativité visuelle", domain: "Produit & Design" },
      { label: "Sciences physiques et systèmes", domain: "Infrastructure & DevOps" },
      { label: "Communication et langues", domain: "Marketing digital" },
      { label: "Économie et gestion", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Dans un projet d'équipe, ton rôle naturel...",
    options: [
      { label: "Celui ou celle qui code la solution", domain: "Développement" },
      { label: "Celui ou celle qui analyse les résultats", domain: "Data & IA" },
      { label: "Celui ou celle qui teste et cherche les failles", domain: "Sécurité" },
      { label: "Celui ou celle qui soigne la présentation", domain: "Produit & Design" },
      { label: "Celui ou celle qui s'assure que tout tourne techniquement", domain: "Infrastructure & DevOps" },
      { label: "Celui ou celle qui présente et « vend » le projet", domain: "Marketing digital" },
      { label: "Celui ou celle qui coordonne l'équipe", domain: "Gestion & Management" }
    ]
  },
  {
    type: "niveau",
    question: "Une fois ton domaine identifié : quel niveau veux-tu viser pour commencer ?",
    options: [
      { label: "Un diplôme court et professionnalisant (BTS, Brevet de Technicien)", value: "court" },
      { label: "Une Licence classique (Bac+3)", value: "licence" },
      { label: "Directement un cursus long (Master, Ingénieur)", value: "long" },
      { label: "Je ne sais pas encore", value: "peu-importe" }
    ]
  },
  {
    type: "ville",
    question: "Où peux-tu ou veux-tu étudier ?",
    options: [
      { label: "À Lomé", value: "Lomé" },
      { label: "À Kara", value: "Kara" },
      { label: "À Sokodé", value: "Sokodé" },
      { label: "À Bassar", value: "Bassar" },
      { label: "À Atakpamé", value: "Atakpamé" },
      { label: "Peu importe, je peux me déplacer", value: "peu-importe" }
    ]
  },
  {
    type: "statut",
    question: "Qu'est-ce qui correspond le mieux à ta situation budgétaire ?",
    options: [
      { label: "Je dois viser le public, gratuit ou presque", value: "public" },
      { label: "Je peux payer une école privée, avec un budget serré", value: "prive" },
      { label: "Le budget n'est pas un frein majeur", value: "peu-importe" }
    ]
  },
  {
    type: "priorite",
    question: "Qu'est-ce qui compte le plus pour toi dans une école ?",
    options: [
      { label: "Que le diplôme soit officiellement reconnu (agrément d'État, CAMES)", value: "agree" },
      { label: "Une formation concrète, avec beaucoup de pratique et de stages", value: "pratique" },
      { label: "Peu importe, je regarderai au cas par cas", value: "peu-importe" }
    ]
  }
];

// ---- Calendrier académique togolais (repère général) ----
// Enchaînement habituel d'une année de candidature au Togo. Les mois sont
// volontairement donnés comme des périodes indicatives ("généralement") : ils
// varient d'un établissement à l'autre — voir les dates précises par école
// dans SCHOOLS[id].datesCles quand elles existent.
const ACADEMIC_TIMELINE = [
  {
    periode: "Juin – Juillet",
    titre: "Résultats du BAC",
    description: "Publication des résultats du baccalauréat togolais. C'est le point de départ : la plupart des dossiers de candidature demandent une attestation ou un relevé du BAC."
  },
  {
    periode: "Juillet – Septembre",
    titre: "Période de candidature",
    description: "Ouverture des inscriptions dans la majorité des écoles et universités. Beaucoup d'écoles privées togolaises admettent en continu sur cette période, sans date limite stricte."
  },
  {
    periode: "Août – Septembre",
    titre: "Concours d'entrée",
    description: "Pour les établissements qui en organisent un (universités publiques, grandes écoles comme l'EPL ou l'IAI-Togo) : épreuves écrites, généralement sur cette fenêtre."
  },
  {
    periode: "Septembre – Octobre",
    titre: "Résultats d'admission",
    description: "Publication des listes d'admis pour les établissements à concours ou à sélection sur dossier."
  },
  {
    periode: "Octobre – Novembre",
    titre: "Rentrée académique",
    description: "Début des cours dans la plupart des écoles et universités togolaises."
  }
];

// Mots-clés utilisés pour relier un domaine (voir DOMAINS) aux filières réelles
// des écoles (voir SCHOOLS) — recherche insensible à la casse dans les filières.
const DOMAIN_KEYWORDS = {
  "Développement": ["développement", "génie logiciel", "logiciel", "programmeur", "application", "web", "mobile"],
  "Data & IA": ["intelligence artificielle", "data", "science des données", "statistique"],
  "Sécurité": ["cybersécurité", "sécurité", "cybercriminalité"],
  "Produit & Design": ["multimédia", "design", "infographie", "webdesign"],
  "Infrastructure & DevOps": ["réseaux", "systèmes", "administrateur", "maintenance informatique", "télécommunication"],
  "Marketing digital": ["marketing", "économie numérique", "commerce"],
  "Gestion & Management": ["gestion", "management"]
};
