// Données des roadmaps - WIYAO
// Deux catégories :
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
    titleEn: "Web Developer",
    subtitle: "Du HTML au full-stack, avec les ressources disponibles au Togo",
    subtitleEn: "From HTML to full-stack, with resources available in Togo",
    icon: "globe",
    sections: [
      {
        title: "1. Bases indispensables", titleEn: "1. Essential foundations",
        items: [
          { label: "Fonctionnement d'Internet, HTTP/HTTPS, DNS", labelEn: "How the Internet works, HTTP/HTTPS, DNS", level: "core", resource: { label: "MDN - Comment fonctionne le web", labelEn: "MDN - How the web works", url: "https://developer.mozilla.org/fr/docs/Learn/Getting_started_with_the_web/How_the_Web_works" } },
          { label: "Ligne de commande (bash) et système de fichiers", labelEn: "Command line (bash) and file system", level: "core", resource: { label: "Voir roadmap compétence Linux", labelEn: "See the Linux skill roadmap", url: "roadmap.html?id=linux" } },
          { label: "Git et GitHub (branches, pull requests, résolution de conflits)", labelEn: "Git and GitHub (branches, pull requests, resolving conflicts)", level: "core", resource: { label: "Voir roadmap compétence Git & GitHub", labelEn: "See the Git & GitHub skill roadmap", url: "roadmap.html?id=git-github" } },
          { label: "Éditeur de code : VS Code, extensions utiles", labelEn: "Code editor: VS Code, useful extensions", level: "core", resource: { label: "Documentation VS Code", labelEn: "VS Code documentation", url: "https://code.visualstudio.com/docs" } },
          { label: "Outils de développement du navigateur (DevTools) : inspecter, déboguer, mesurer les performances", labelEn: "Browser developer tools (DevTools): inspect, debug, measure performance", level: "core", resource: { label: "MDN - Qu'est-ce que sont les outils de développement ?", labelEn: "MDN - What are browser developer tools?", url: "https://developer.mozilla.org/fr/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools" } }
        ]
      },
      {
        title: "2. HTML", titleEn: "2. HTML",
        items: [
          { label: "Structure sémantique (header, main, section, article)", labelEn: "Semantic structure (header, main, section, article)", level: "core", resource: { label: "MDN - HTML", labelEn: "MDN - HTML", url: "https://developer.mozilla.org/fr/docs/Web/HTML" } },
          { label: "Formulaires et validation native", labelEn: "Forms and native validation", level: "core", resource: { label: "MDN - Formulaires web", labelEn: "MDN - Web forms", url: "https://developer.mozilla.org/fr/docs/Learn_web_development/Extensions/Forms" } },
          { label: "Accessibilité de base (attributs ARIA, alt, labels)", labelEn: "Accessibility basics (ARIA attributes, alt, labels)", level: "option", resource: { label: "MDN - Accessibilité", labelEn: "MDN - Accessibility", url: "https://developer.mozilla.org/fr/docs/Web/Accessibility" } }
        ]
      },
      {
        title: "3. CSS", titleEn: "3. CSS",
        items: [
          { label: "Box model, sélecteurs, spécificité", labelEn: "Box model, selectors, specificity", level: "core", resource: { label: "MDN - CSS", labelEn: "MDN - CSS", url: "https://developer.mozilla.org/fr/docs/Web/CSS" } },
          { label: "Flexbox et Grid", labelEn: "Flexbox and Grid", level: "core", resource: { label: "CSS Tricks - Guide Flexbox/Grid", labelEn: "CSS Tricks - Flexbox/Grid guide", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" } },
          { label: "Responsive design (mobile-first, media queries)", labelEn: "Responsive design (mobile-first, media queries)", level: "core", resource: { label: "MDN - Responsive design", labelEn: "MDN - Responsive design", url: "https://developer.mozilla.org/fr/docs/Learn/CSS/CSS_layout/Responsive_Design" } },
          { label: "Sass/SCSS ou Tailwind CSS", labelEn: "Sass/SCSS or Tailwind CSS", level: "option", resource: { label: "Documentation Tailwind CSS", labelEn: "Tailwind CSS documentation", url: "https://tailwindcss.com/docs" } }
        ]
      },
      {
        title: "4. JavaScript", titleEn: "4. JavaScript",
        items: [
          { label: "Syntaxe de base, types, fonctions, portée", labelEn: "Basic syntax, types, functions, scope", level: "core", resource: { label: "Voir roadmap compétence JavaScript", labelEn: "See the JavaScript skill roadmap", url: "roadmap.html?id=javascript" } },
          { label: "DOM et gestion des événements", labelEn: "DOM and event handling", level: "core", resource: { label: "MDN - Manipulation du DOM", labelEn: "MDN - Manipulating the DOM", url: "https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model" } },
          { label: "ES6+ (arrow functions, destructuring, modules)", labelEn: "ES6+ (arrow functions, destructuring, modules)", level: "core" },
          { label: "Asynchrone : Promises, async/await, fetch API", labelEn: "Asynchronous code: Promises, async/await, fetch API", level: "core", resource: { label: "MDN - Fonctions asynchrones", labelEn: "MDN - Asynchronous JavaScript", url: "https://developer.mozilla.org/fr/docs/Learn/JavaScript/Asynchronous" } },
          { label: "TypeScript", labelEn: "TypeScript", level: "option", resource: { label: "Documentation TypeScript", labelEn: "TypeScript documentation", url: "https://www.typescriptlang.org/docs/" } }
        ]
      },
      {
        title: "5. Frontend avancé", titleEn: "5. Advanced frontend",
        items: [
          { label: "Un framework : React, Vue ou Svelte (choisir un seul pour démarrer)", labelEn: "A framework: React, Vue or Svelte (pick just one to start)", level: "core", resource: { label: "React - Apprendre", labelEn: "React - Learn", url: "https://react.dev/learn" } },
          { label: "Gestion d'état (Context API, Zustand, Redux)", labelEn: "State management (Context API, Zustand, Redux)", level: "option" },
          { label: "Routing côté client", labelEn: "Client-side routing", level: "core" },
          { label: "Outils de build : Vite, bundlers", labelEn: "Build tools: Vite, bundlers", level: "core", resource: { label: "Documentation Vite", labelEn: "Vite documentation", url: "https://vite.dev/guide/" } }
        ]
      },
      {
        title: "6. Notions backend pour le full-stack", titleEn: "6. Backend basics for full-stack",
        items: [
          { label: "Node.js et Express, ou équivalent", labelEn: "Node.js and Express, or equivalent", level: "core", resource: { label: "Documentation Node.js", labelEn: "Node.js documentation", url: "https://nodejs.org/fr/docs" } },
          { label: "API REST, méthodes HTTP, codes de statut", labelEn: "REST APIs, HTTP methods, status codes", level: "core" },
          { label: "Bases de données SQL (PostgreSQL/MySQL) et NoSQL (MongoDB)", labelEn: "SQL databases (PostgreSQL/MySQL) and NoSQL (MongoDB)", level: "core", resource: { label: "Voir roadmap compétence SQL", labelEn: "See the SQL skill roadmap", url: "roadmap.html?id=sql" } },
          { label: "Authentification et sessions : JWT, OAuth", labelEn: "Authentication and sessions: JWT, OAuth", level: "core" },
          { label: "Mise en cache avec Redis pour accélérer les temps de réponse", labelEn: "Caching with Redis to speed up response times", level: "option" },
          { label: "Tests automatisés (Jest, Vitest)", labelEn: "Automated testing (Jest, Vitest)", level: "option" }
        ]
      },
      {
        title: "7. Déploiement", titleEn: "7. Deployment",
        items: [
          { label: "Hébergement statique (Netlify, Vercel, GitHub Pages)", labelEn: "Static hosting (Netlify, Vercel, GitHub Pages)", level: "core", resource: { label: "Documentation GitHub Pages", labelEn: "GitHub Pages documentation", url: "https://docs.github.com/fr/pages" } },
          { label: "Déploiement sur un VPS ou hébergeur local", labelEn: "Deploying to a VPS or a local host", level: "option" },
          { label: "Nom de domaine .tg et DNS", labelEn: ".tg domain name and DNS", level: "option" }
        ]
      },
      {
        title: "8. CMS et sites e-commerce", titleEn: "8. CMS and e-commerce sites",
        items: [
          { label: "Systèmes de gestion de contenu (CMS) : WordPress, thèmes et plugins", labelEn: "Content management systems (CMS): WordPress, themes and plugins", level: "option", resource: { label: "Documentation WordPress", labelEn: "WordPress documentation", url: "https://wordpress.org/documentation/" } },
          { label: "Boutique en ligne : WooCommerce ou Shopify, catalogue et paiement", labelEn: "Online store: WooCommerce or Shopify, catalog and payment", level: "option", resource: { label: "Documentation WooCommerce", labelEn: "WooCommerce documentation", url: "https://woocommerce.com/documentation/" } }
        ]
      },
      {
        title: "9. Écosystème togolais", titleEn: "9. Togolese ecosystem",
        items: [
          { label: "IAI-Togo : licence pro informatique, formation continue", labelEn: "IAI-Togo: professional bachelor's in computer science, continuing education", level: "core", note: "Institut Africain d'Informatique, Lomé.", noteEn: "African Institute of Computer Science (IAI-Togo), Lomé.", resource: { label: "iai-togo.tg", labelEn: "iai-togo.tg", url: "https://new.iai-togo.tg/" } },
          { label: "ESGIS : licence Informatique Réseaux et Télécommunication", labelEn: "ESGIS: bachelor's in Computer Science, Networks and Telecommunications", level: "core" },
          { label: "HETEC (HEST) : licence/master développement d'applications", labelEn: "HETEC (HEST): bachelor's/master's in application development", level: "core" },
          { label: "GDG Lomé et DevFest Lomé : meetups et conférence annuelle", labelEn: "GDG Lomé and DevFest Lomé: meetups and annual conference", level: "core", note: "Communauté Google Developer Groups, ateliers réguliers.", noteEn: "Google Developer Groups community, regular workshops.", resource: { label: "gdg.community.dev/gdg-lome", labelEn: "gdg.community.dev/gdg-lome", url: "https://gdg.community.dev/gdg-lome/" } },
          { label: "Djanta Academy (Djanta Tech Hub) : formation aux compétences numériques", labelEn: "Djanta Academy (Djanta Tech Hub): digital skills training", level: "option" }
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
    titleEn: "Backend Developer",
    subtitle: "Langages, bases de données, architecture et sécurité",
    subtitleEn: "Languages, databases, architecture and security",
    icon: "server",
    sections: [
      {
        title: "1. Choisir un langage", titleEn: "1. Choose a language",
        items: [
          { label: "Node.js (JavaScript/TypeScript)", labelEn: "Node.js (JavaScript/TypeScript)", level: "core", resource: { label: "Documentation Node.js", labelEn: "Node.js documentation", url: "https://nodejs.org/fr/docs" } },
          { label: "Python (Django, FastAPI)", labelEn: "Python (Django, FastAPI)", level: "core", resource: { label: "Voir roadmap compétence Python", labelEn: "See the Python skill roadmap", url: "roadmap.html?id=python" } },
          { label: "PHP (Laravel)", labelEn: "PHP (Laravel)", level: "option", resource: { label: "Documentation Laravel", labelEn: "Laravel documentation", url: "https://laravel.com/docs" } },
          { label: "Java (Spring Boot) ou Go", labelEn: "Java (Spring Boot) or Go", level: "option" }
        ]
      },
      {
        title: "2. Fondamentaux", titleEn: "2. Fundamentals",
        items: [
          { label: "Structures de données et algorithmes", labelEn: "Data structures and algorithms", level: "core" },
          { label: "Programmation orientée objet", labelEn: "Object-oriented programming", level: "core" },
          { label: "Gestion des erreurs et logs", labelEn: "Error handling and logging", level: "core" }
        ]
      },
      {
        title: "3. Bases de données", titleEn: "3. Databases",
        items: [
          { label: "SQL : modélisation, jointures, index, transactions", labelEn: "SQL: modeling, joins, indexes, transactions", level: "core", resource: { label: "Voir roadmap compétence SQL", labelEn: "See the SQL skill roadmap", url: "roadmap.html?id=sql" } },
          { label: "PostgreSQL ou MySQL en pratique", labelEn: "PostgreSQL or MySQL in practice", level: "core", resource: { label: "Documentation PostgreSQL", labelEn: "PostgreSQL documentation", url: "https://www.postgresql.org/docs/" } },
          { label: "NoSQL : MongoDB, Redis (cache)", labelEn: "NoSQL: MongoDB, Redis (cache)", level: "core", resource: { label: "Documentation MongoDB", labelEn: "MongoDB documentation", url: "https://www.mongodb.com/docs/manual/" } },
          { label: "ORM (Prisma, Sequelize, SQLAlchemy)", labelEn: "ORM (Prisma, Sequelize, SQLAlchemy)", level: "option" }
        ]
      },
      {
        title: "4. API et authentification", titleEn: "4. APIs and authentication",
        items: [
          { label: "REST : conception, versionnement, pagination", labelEn: "REST: design, versioning, pagination", level: "core" },
          { label: "GraphQL", labelEn: "GraphQL", level: "option", resource: { label: "Documentation GraphQL", labelEn: "GraphQL documentation", url: "https://graphql.org/learn/" } },
          { label: "Authentification JWT, sessions, OAuth2", labelEn: "JWT authentication, sessions, OAuth2", level: "core", resource: { label: "jwt.io - Introduction aux JWT", labelEn: "jwt.io - Introduction to JWT", url: "https://jwt.io/introduction" } },
          { label: "Idempotence et gestion des erreurs API (codes HTTP, formats d'erreur)", labelEn: "Idempotency and API error handling (HTTP codes, error formats)", level: "core" }
        ]
      },
      {
        title: "5. Architecture", titleEn: "5. Architecture",
        items: [
          { label: "MVC et design patterns courants", labelEn: "MVC and common design patterns", level: "core" },
          { label: "Architecture microservices", labelEn: "Microservices architecture", level: "option" },
          { label: "Files de messages (RabbitMQ, Kafka)", labelEn: "Message queues (RabbitMQ, Kafka)", level: "option" }
        ]
      },
      {
        title: "6. Sécurité", titleEn: "6. Security",
        items: [
          { label: "OWASP Top 10 (injection SQL, XSS, CSRF)", labelEn: "OWASP Top 10 (SQL injection, XSS, CSRF)", level: "core", resource: { label: "OWASP Top 10", labelEn: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" } },
          { label: "Validation des entrées, gestion des secrets (.env)", labelEn: "Input validation, secrets management (.env)", level: "core" },
          { label: "Limitation de débit (rate limiting), CORS", labelEn: "Rate limiting, CORS", level: "core" }
        ]
      },
      {
        title: "7. Tests et déploiement", titleEn: "7. Testing and deployment",
        items: [
          { label: "Tests unitaires et d'intégration", labelEn: "Unit and integration tests", level: "core" },
          { label: "Docker et conteneurisation", labelEn: "Docker and containerization", level: "core", resource: { label: "Voir roadmap compétence Docker", labelEn: "See the Docker skill roadmap", url: "roadmap.html?id=docker" } },
          { label: "CI/CD basique (GitHub Actions)", labelEn: "Basic CI/CD (GitHub Actions)", level: "option", resource: { label: "Documentation GitHub Actions", labelEn: "GitHub Actions documentation", url: "https://docs.github.com/fr/actions" } },
          { label: "Administration d'un serveur Linux", labelEn: "Linux server administration", level: "core", resource: { label: "Voir roadmap compétence Linux", labelEn: "See the Linux skill roadmap", url: "roadmap.html?id=linux" } },
          { label: "Observabilité : logs structurés, métriques, tracing", labelEn: "Observability: structured logs, metrics, tracing", level: "option" }
        ]
      },
      {
        title: "8. Écosystème togolais", titleEn: "8. Togolese ecosystem",
        items: [
          { label: "Centre Informatique de Calcul (CIC), Université de Lomé", labelEn: "Computing Center (Centre Informatique de Calcul, CIC), University of Lomé", level: "core", note: "Licences pro réseaux/informatique, master sécurité réseaux.", noteEn: "Professional bachelor's in networks/computer science, master's in network security.", resource: { label: "univ-lome.tg", labelEn: "univ-lome.tg", url: "https://univ-lome.tg/course/informatique-et-systemes/" } },
          { label: "PyCon Togo : conférence nationale Python", labelEn: "PyCon Togo: national Python conference", level: "core", resource: { label: "pycontg.pytogo.org", labelEn: "pycontg.pytogo.org", url: "https://pycontg.pytogo.org/" } },
          { label: "IAI-Togo et HETEC : formations backend et bases de données", labelEn: "IAI-Togo and HETEC: backend and database training", level: "option" }
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
    titleEn: "DevOps & Cloud",
    subtitle: "Infrastructure, automatisation et exploitation",
    subtitleEn: "Infrastructure, automation and operations",
    icon: "infinity",
    sections: [
      {
        title: "1. Bases système", titleEn: "1. System basics",
        items: [
          { label: "Administration Linux (processus, permissions, services)", labelEn: "Linux administration (processes, permissions, services)", level: "core", resource: { label: "Voir roadmap compétence Linux", labelEn: "See the Linux skill roadmap", url: "roadmap.html?id=linux" } },
          { label: "Scripting bash/shell", labelEn: "Bash/shell scripting", level: "core" },
          { label: "Réseaux : TCP/IP, DNS, load balancing", labelEn: "Networking: TCP/IP, DNS, load balancing", level: "core", resource: { label: "Voir roadmap compétence Réseaux", labelEn: "See the Networking skill roadmap", url: "roadmap.html?id=reseaux" } }
        ]
      },
      {
        title: "2. Versioning et collaboration", titleEn: "2. Versioning and collaboration",
        items: [
          { label: "Git avancé (rebase, cherry-pick, GitFlow)", labelEn: "Advanced Git (rebase, cherry-pick, GitFlow)", level: "core", resource: { label: "Voir roadmap compétence Git & GitHub", labelEn: "See the Git & GitHub skill roadmap", url: "roadmap.html?id=git-github" } }
        ]
      },
      {
        title: "3. Conteneurisation", titleEn: "3. Containerization",
        items: [
          { label: "Docker : images, volumes, réseaux", labelEn: "Docker: images, volumes, networks", level: "core", resource: { label: "Voir roadmap compétence Docker", labelEn: "See the Docker skill roadmap", url: "roadmap.html?id=docker" } },
          { label: "Docker Compose pour environnements multi-services", labelEn: "Docker Compose for multi-service environments", level: "core" },
          { label: "Kubernetes : pods, services, déploiements", labelEn: "Kubernetes: pods, services, deployments", level: "option", resource: { label: "Documentation Kubernetes", labelEn: "Kubernetes documentation", url: "https://kubernetes.io/fr/docs/home/" } },
          { label: "Orchestration managée dans le cloud (EKS, GKE, AKS) plutôt que Kubernetes auto-géré", labelEn: "Managed orchestration in the cloud (EKS, GKE, AKS) rather than self-managed Kubernetes", level: "option" }
        ]
      },
      {
        title: "4. Intégration et livraison continues", titleEn: "4. Continuous integration and delivery",
        items: [
          { label: "GitHub Actions ou GitLab CI", labelEn: "GitHub Actions or GitLab CI", level: "core", resource: { label: "Documentation GitHub Actions", labelEn: "GitHub Actions documentation", url: "https://docs.github.com/fr/actions" } },
          { label: "Jenkins", labelEn: "Jenkins", level: "option", resource: { label: "Documentation Jenkins", labelEn: "Jenkins documentation", url: "https://www.jenkins.io/doc/" } },
          { label: "Stratégies de déploiement (blue-green, canary)", labelEn: "Deployment strategies (blue-green, canary)", level: "option" },
          { label: "DevSecOps : scan de vulnérabilités et de dépendances intégré au pipeline CI/CD", labelEn: "DevSecOps: vulnerability and dependency scanning built into the CI/CD pipeline", level: "option" },
          { label: "GitOps : déploiement continu piloté par l'état déclaré dans Git (ArgoCD, FluxCD)", labelEn: "GitOps: continuous deployment driven by the state declared in Git (ArgoCD, FluxCD)", level: "option" }
        ]
      },
      {
        title: "5. Infrastructure as Code", titleEn: "5. Infrastructure as Code",
        items: [
          { label: "Terraform", labelEn: "Terraform", level: "core", resource: { label: "Documentation Terraform", labelEn: "Terraform documentation", url: "https://developer.hashicorp.com/terraform/docs" } },
          { label: "Ansible", labelEn: "Ansible", level: "option", resource: { label: "Documentation Ansible", labelEn: "Ansible documentation", url: "https://docs.ansible.com/" } },
          { label: "Gestion des secrets (Vault, secrets managers cloud) plutôt que des identifiants en clair", labelEn: "Secrets management (Vault, cloud secrets managers) rather than plain-text credentials", level: "option" }
        ]
      },
      {
        title: "6. Cloud", titleEn: "6. Cloud",
        items: [
          { label: "Fondamentaux AWS, Azure ou GCP (compute, storage, IAM)", labelEn: "AWS, Azure or GCP fundamentals (compute, storage, IAM)", level: "core", resource: { label: "Voir roadmap compétence Cloud", labelEn: "See the Cloud skill roadmap", url: "roadmap.html?id=cloud" } },
          { label: "Certification niveau associate/fundamentals", labelEn: "Associate/fundamentals-level certification", level: "option" }
        ]
      },
      {
        title: "7. Observabilité", titleEn: "7. Observability",
        items: [
          { label: "Monitoring : Prometheus, Grafana", labelEn: "Monitoring: Prometheus, Grafana", level: "core", resource: { label: "Documentation Prometheus", labelEn: "Prometheus documentation", url: "https://prometheus.io/docs/introduction/overview/" } },
          { label: "Centralisation des logs (ELK, Loki)", labelEn: "Log centralization (ELK, Loki)", level: "option" }
        ]
      },
      {
        title: "8. Écosystème togolais", titleEn: "8. Togolese ecosystem",
        items: [
          { label: "Djanta Tech Hub / Djanta Academy : formations compétences numériques", labelEn: "Djanta Tech Hub / Djanta Academy: digital skills training", level: "core", note: "Lancé en 2026, avec Djanta Lab pour la recherche et l'innovation.", noteEn: "Launched in 2026, with Djanta Lab for research and innovation.", resource: { label: "togofirst.com", labelEn: "togofirst.com (in French)", url: "https://www.togofirst.com/fr/tic/0805-18921-le-togo-inaugure-le-djanta-tech-hub-nouveau-levier-pour-les-startups-numeriques" } },
          { label: "GDG Lomé : ateliers Google Cloud", labelEn: "GDG Lomé: Google Cloud workshops", level: "core", resource: { label: "gdg.community.dev/gdg-lome", labelEn: "gdg.community.dev/gdg-lome", url: "https://gdg.community.dev/gdg-lome/" } },
          { label: "DevFest Lomé : conférence annuelle IA et cloud", labelEn: "DevFest Lomé: annual AI and cloud conference", level: "option" }
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
    titleEn: "Cybersecurity & Networks",
    subtitle: "Sécurité offensive, défensive et gouvernance",
    subtitleEn: "Offensive security, defensive security and governance",
    icon: "lock",
    sections: [
      {
        title: "1. Fondamentaux réseaux", titleEn: "1. Networking fundamentals",
        items: [
          { label: "Modèle OSI et TCP/IP", labelEn: "OSI and TCP/IP models", level: "core", resource: { label: "Voir roadmap compétence Réseaux", labelEn: "See the Networking skill roadmap", url: "roadmap.html?id=reseaux" } },
          { label: "Routage, switching, VLAN, sous-réseaux", labelEn: "Routing, switching, VLANs, subnets", level: "core" },
          { label: "Certification CCNA (recommandée en base)", labelEn: "CCNA certification (recommended as a foundation)", level: "option", resource: { label: "Cisco - Certification CCNA", labelEn: "Cisco - CCNA certification", url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html" } }
        ]
      },
      {
        title: "2. Administration système", titleEn: "2. System administration",
        items: [
          { label: "Administration Linux et Windows Server", labelEn: "Linux and Windows Server administration", level: "core", resource: { label: "Voir roadmap compétence Linux", labelEn: "See the Linux skill roadmap", url: "roadmap.html?id=linux" } },
          { label: "Active Directory et gestion des identités", labelEn: "Active Directory and identity management", level: "core" }
        ]
      },
      {
        title: "3. Sécurité réseau", titleEn: "3. Network security",
        items: [
          { label: "Pare-feu, segmentation réseau, VPN", labelEn: "Firewalls, network segmentation, VPN", level: "core" },
          { label: "IDS/IPS et détection d'intrusion", labelEn: "IDS/IPS and intrusion detection", level: "core" },
          { label: "Durcissement (hardening) des systèmes", labelEn: "System hardening", level: "core" }
        ]
      },
      {
        title: "4. Cryptographie", titleEn: "4. Cryptography",
        items: [
          { label: "Chiffrement symétrique et asymétrique", labelEn: "Symmetric and asymmetric encryption", level: "core" },
          { label: "PKI, certificats et TLS", labelEn: "PKI, certificates and TLS", level: "core" }
        ]
      },
      {
        title: "5. Sécurité applicative et audit", titleEn: "5. Application security and auditing",
        items: [
          { label: "OWASP Top 10", labelEn: "OWASP Top 10", level: "core", resource: { label: "OWASP Top 10", labelEn: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" } },
          { label: "Tests d'intrusion (pentest), outils : Nmap, Metasploit, Burp Suite", labelEn: "Penetration testing (pentest), tools: Nmap, Metasploit, Burp Suite", level: "core", resource: { label: "Documentation Nmap", labelEn: "Nmap documentation", url: "https://nmap.org/book/man.html" } },
          { label: "Analyse de trafic avec Wireshark", labelEn: "Traffic analysis with Wireshark", level: "core", resource: { label: "Documentation Wireshark", labelEn: "Wireshark documentation", url: "https://www.wireshark.org/docs/" } },
          { label: "SIEM et gestion des incidents", labelEn: "SIEM and incident management", level: "option" },
          { label: "Framework MITRE ATT&CK : cartographier les tactiques et techniques d'attaque connues", labelEn: "MITRE ATT&CK framework: mapping known attack tactics and techniques", level: "option", resource: { label: "MITRE ATT&CK", labelEn: "MITRE ATT&CK", url: "https://attack.mitre.org/" } },
          { label: "Processus de réponse à incident : préparation, identification, confinement, éradication, retour à la normale, retour d'expérience", labelEn: "Incident response process: preparation, identification, containment, eradication, recovery, lessons learned", level: "option" }
        ]
      },
      {
        title: "6. Sécurité Cloud", titleEn: "6. Cloud security",
        items: [
          { label: "Sécurité des environnements cloud : IAM, chiffrement au repos/en transit, configuration", labelEn: "Securing cloud environments: IAM, encryption at rest/in transit, configuration", level: "core" },
          { label: "Modèle de responsabilité partagée (IaaS/PaaS/SaaS) : ce qui relève du fournisseur cloud vs de l'entreprise", labelEn: "Shared responsibility model (IaaS/PaaS/SaaS): what falls to the cloud provider vs the company", level: "option" }
        ]
      },
      {
        title: "7. Gouvernance et conformité", titleEn: "7. Governance and compliance",
        items: [
          { label: "Loi n°2018-026 sur la cybersécurité et la cybercriminalité (Togo)", labelEn: "Law no. 2018-026 on cybersecurity and cybercrime (Togo)", level: "core", note: "Cadre légal togolais, base des obligations de sécurité.", noteEn: "Togolese legal framework, the basis of security obligations.", resource: { label: "ancy.gouv.tg", labelEn: "ancy.gouv.tg", url: "https://ancy.gouv.tg/" } },
          { label: "Normes ISO 27001, gestion des risques", labelEn: "ISO 27001 standards, risk management", level: "core" },
          { label: "Concept de Zero Trust : ne faire confiance à rien par défaut, vérifier systématiquement", labelEn: "Zero Trust: trust nothing by default, always verify", level: "option" },
          { label: "Protection des données personnelles", labelEn: "Personal data protection", level: "option" }
        ]
      },
      {
        title: "8. Certifications", titleEn: "8. Certifications",
        items: [
          { label: "CompTIA Security+", labelEn: "CompTIA Security+", level: "core", resource: { label: "CompTIA Security+", labelEn: "CompTIA Security+", url: "https://www.comptia.org/certifications/security" } },
          { label: "CEH (Certified Ethical Hacker)", labelEn: "CEH (Certified Ethical Hacker)", level: "option" },
          { label: "CCNA Security / CISSP (niveau avancé)", labelEn: "CCNA Security / CISSP (advanced level)", level: "option" }
        ]
      },
      {
        title: "9. Écosystème togolais", titleEn: "9. Togolese ecosystem",
        items: [
          { label: "ANCy : Agence Nationale de la Cybersécurité du Togo", labelEn: "ANCy: Togo's National Cybersecurity Agency", level: "core", note: "Autorité nationale, organise des Capture The Flag et campagnes de sensibilisation.", noteEn: "National authority; runs Capture The Flag competitions and awareness campaigns.", resource: { label: "ancy.gouv.tg", labelEn: "ancy.gouv.tg", url: "https://ancy.gouv.tg/" } },
          { label: "CERT.tg : centre national de réponse aux incidents cyber", labelEn: "CERT.tg: national cyber incident response center", level: "core", note: "Opéré par Cyber Defense Africa pour le compte de l'ANCy.", noteEn: "Operated by Cyber Defense Africa on behalf of ANCy.", resource: { label: "cert.tg", labelEn: "cert.tg", url: "https://cert.tg/" } },
          { label: "Lomé Digital School : parcours cybersécurité", labelEn: "Lomé Digital School: cybersecurity track", level: "core", resource: { label: "lomedigitalschool.com", labelEn: "lomedigitalschool.com", url: "https://lomedigitalschool.com/cybersecurite/" } },
          { label: "Master sécurité des réseaux, Université de Lomé", labelEn: "Master's in network security, University of Lomé", level: "option" }
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
    titleEn: "Data & Artificial Intelligence",
    subtitle: "Des statistiques au machine learning appliqué",
    subtitleEn: "From statistics to applied machine learning",
    icon: "cpu",
    sections: [
      {
        title: "1. Mathématiques et statistiques", titleEn: "1. Mathematics and statistics",
        items: [
          { label: "Algèbre linéaire de base", labelEn: "Basic linear algebra", level: "core" },
          { label: "Statistiques descriptives et probabilités", labelEn: "Descriptive statistics and probability", level: "core" }
        ]
      },
      {
        title: "2. Programmation et préparation des données", titleEn: "2. Programming and data preparation",
        items: [
          { label: "Python : syntaxe, structures de données", labelEn: "Python: syntax, data structures", level: "core", resource: { label: "Voir roadmap compétence Python", labelEn: "See the Python skill roadmap", url: "roadmap.html?id=python" } },
          { label: "Pandas et NumPy", labelEn: "Pandas and NumPy", level: "core", resource: { label: "Documentation Pandas", labelEn: "Pandas documentation", url: "https://pandas.pydata.org/docs/" } },
          { label: "SQL pour l'analyse de données", labelEn: "SQL for data analysis", level: "core", resource: { label: "Voir roadmap compétence SQL", labelEn: "See the SQL skill roadmap", url: "roadmap.html?id=sql" } },
          { label: "Nettoyage et préparation des données (data wrangling)", labelEn: "Data cleaning and preparation (data wrangling)", level: "core" }
        ]
      },
      {
        title: "3. Visualisation", titleEn: "3. Visualization",
        items: [
          { label: "Matplotlib, Seaborn", labelEn: "Matplotlib, Seaborn", level: "core", resource: { label: "Documentation Matplotlib", labelEn: "Matplotlib documentation", url: "https://matplotlib.org/stable/tutorials/index.html" } },
          { label: "Power BI ou Tableau", labelEn: "Power BI or Tableau", level: "option" }
        ]
      },
      {
        title: "4. Machine Learning", titleEn: "4. Machine Learning",
        items: [
          { label: "Scikit-learn : régression, classification, clustering", labelEn: "Scikit-learn: regression, classification, clustering", level: "core", resource: { label: "Scikit-learn - Tutoriels", labelEn: "Scikit-learn - Tutorials", url: "https://scikit-learn.org/stable/getting_started.html" } },
          { label: "Évaluation de modèles (validation croisée, métriques)", labelEn: "Model evaluation (cross-validation, metrics)", level: "core" },
          { label: "Feature engineering", labelEn: "Feature engineering", level: "option" }
        ]
      },
      {
        title: "5. Deep Learning et IA générative", titleEn: "5. Deep Learning and generative AI",
        items: [
          { label: "Réseaux de neurones, bases", labelEn: "Neural network basics", level: "option" },
          { label: "TensorFlow ou PyTorch", labelEn: "TensorFlow or PyTorch", level: "option", resource: { label: "PyTorch - Tutoriels", labelEn: "PyTorch - Tutorials", url: "https://pytorch.org/tutorials/" } },
          { label: "Traitement du langage naturel (NLP) : tokenisation, modèles de langage", labelEn: "Natural language processing (NLP): tokenization, language models", level: "option" },
          { label: "Grands modèles de langage (LLM) : APIs, prompt engineering", labelEn: "Large language models (LLMs): APIs, prompt engineering", level: "option" },
          { label: "RAG (Retrieval-Augmented Generation) et bases vectorielles", labelEn: "RAG (Retrieval-Augmented Generation) and vector databases", level: "option" }
        ]
      },
      {
        title: "6. Mise en production", titleEn: "6. Putting models into production",
        items: [
          { label: "Déploiement de modèles (API Flask/FastAPI)", labelEn: "Model deployment (Flask/FastAPI API)", level: "option", resource: { label: "Documentation FastAPI", labelEn: "FastAPI documentation", url: "https://fastapi.tiangolo.com/" } },
          { label: "Suivi d'expérimentations (MLflow, Weights & Biases)", labelEn: "Experiment tracking (MLflow, Weights & Biases)", level: "option" },
          { label: "Notions de MLOps et monitoring", labelEn: "MLOps and monitoring basics", level: "option" },
          { label: "IA responsable et éthique : biais, transparence, impact sur les utilisateurs", labelEn: "Responsible and ethical AI: bias, transparency, impact on users", level: "option" }
        ]
      },
      {
        title: "7. Écosystème togolais", titleEn: "7. Togolese ecosystem",
        items: [
          { label: "PyCon Togo : conférence nationale de la communauté Python", labelEn: "PyCon Togo: national conference of the Python community", level: "core", resource: { label: "pycontg.pytogo.org", labelEn: "pycontg.pytogo.org", url: "https://pycontg.pytogo.org/" } },
          { label: "Djanta Lab : laboratoire de recherche et innovation", labelEn: "Djanta Lab: research and innovation lab", level: "option" },
          { label: "HETEC : parcours intelligence artificielle", labelEn: "HETEC: artificial intelligence track", level: "option" }
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
    titleEn: "Mobile Development",
    subtitle: "Natif ou cross-platform, de l'idée au Play Store",
    subtitleEn: "Native or cross-platform, from idea to the Play Store",
    icon: "smartphone",
    sections: [
      {
        title: "1. Choisir une approche", titleEn: "1. Choose an approach",
        items: [
          { label: "Cross-platform : Flutter (Dart) ou React Native", labelEn: "Cross-platform: Flutter (Dart) or React Native", level: "core", resource: { label: "Documentation Flutter", labelEn: "Flutter documentation", url: "https://docs.flutter.dev/" } },
          { label: "Natif Android : Kotlin", labelEn: "Native Android: Kotlin", level: "option", resource: { label: "Android Developers - Kotlin", labelEn: "Android Developers - Kotlin", url: "https://developer.android.com/kotlin" } },
          { label: "Natif iOS : Swift", labelEn: "Native iOS: Swift", level: "option", resource: { label: "Apple Developer - Swift", labelEn: "Apple Developer - Swift", url: "https://developer.apple.com/swift/" } },
          { label: "Jeux mobiles : approche différente, avec un moteur de jeu (Unity, Godot) plutôt qu'un framework applicatif classique", labelEn: "Mobile games: a different approach, using a game engine (Unity, Godot) rather than a classic app framework", level: "option", note: "Filière distincte, voir la roadmap dédiée.", noteEn: "A separate track, see the dedicated roadmap.", resource: { label: "Voir roadmap métier Développeur de Jeux Vidéo", labelEn: "See the Video Game Developer career roadmap", url: "roadmap.html?id=game-developer" } }
        ]
      },
      {
        title: "2. UI/UX mobile", titleEn: "2. Mobile UI/UX",
        items: [
          { label: "Principes de design mobile-first", labelEn: "Mobile-first design principles", level: "core" },
          { label: "Material Design (Android) / Human Interface Guidelines (iOS)", labelEn: "Material Design (Android) / Human Interface Guidelines (iOS)", level: "core", resource: { label: "Material Design", labelEn: "Material Design", url: "https://m3.material.io/" } }
        ]
      },
      {
        title: "3. Architecture et état", titleEn: "3. Architecture and state",
        items: [
          { label: "MVVM ou architecture propre", labelEn: "MVVM or clean architecture", level: "core" },
          { label: "Gestion d'état : Provider/Riverpod (Flutter) ou Redux (RN)", labelEn: "State management: Provider/Riverpod (Flutter) or Redux (RN)", level: "core" }
        ]
      },
      {
        title: "4. Données et API", titleEn: "4. Data and APIs",
        items: [
          { label: "Consommation d'API REST", labelEn: "Consuming REST APIs", level: "core" },
          { label: "Stockage local (SQLite, Hive)", labelEn: "Local storage (SQLite, Hive)", level: "core" },
          { label: "Firebase (auth, base de données temps réel)", labelEn: "Firebase (auth, real-time database)", level: "option", resource: { label: "Documentation Firebase", labelEn: "Firebase documentation", url: "https://firebase.google.com/docs" } }
        ]
      },
      {
        title: "5. Fonctionnalités natives", titleEn: "5. Native features",
        items: [
          { label: "Notifications push", labelEn: "Push notifications", level: "core" },
          { label: "Géolocalisation et permissions", labelEn: "Geolocation and permissions", level: "core" },
          { label: "Paiement mobile (Flooz, Mixx by Yas, Mobile Money)", labelEn: "Mobile payment (Flooz, Mixx by Yas, Mobile Money)", level: "option", note: "Intégrations pertinentes pour le marché togolais.", noteEn: "Integrations that matter for the Togolese market." }
        ]
      },
      {
        title: "6. Tests et fiabilité", titleEn: "6. Testing and reliability",
        items: [
          { label: "Tests unitaires et de widgets/composants", labelEn: "Unit and widget/component tests", level: "core" },
          { label: "Mode hors-ligne (offline-first) et synchronisation des données", labelEn: "Offline-first mode and data synchronization", level: "core", note: "Essentiel vu la connectivité variable au Togo.", noteEn: "Essential given Togo's variable connectivity." },
          { label: "Tests sur appareils réels à faible/moyenne gamme", labelEn: "Testing on real low/mid-range devices", level: "option" }
        ]
      },
      {
        title: "7. Publication", titleEn: "7. Publishing",
        items: [
          { label: "Google Play Store : préparation et publication", labelEn: "Google Play Store: preparation and publishing", level: "core", resource: { label: "Play Console - Guide de lancement", labelEn: "Play Console - Launch guide", url: "https://support.google.com/googleplay/android-developer/answer/9859152" } },
          { label: "Apple App Store : préparation et publication", labelEn: "Apple App Store: preparation and publishing", level: "option" }
        ]
      },
      {
        title: "8. Écosystème togolais", titleEn: "8. Togolese ecosystem",
        items: [
          { label: "GDG Lomé : ateliers Android/Flutter", labelEn: "GDG Lomé: Android/Flutter workshops", level: "core", resource: { label: "gdg.community.dev/gdg-lome", labelEn: "gdg.community.dev/gdg-lome", url: "https://gdg.community.dev/gdg-lome/" } },
          { label: "IAI-Togo et HETEC : bootcamps développement mobile", labelEn: "IAI-Togo and HETEC: mobile development bootcamps", level: "option" },
          { label: "Djanta Start : incubation pour startups mobiles", labelEn: "Djanta Start: incubation for mobile startups", level: "option" }
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
    titleEn: "Product Manager",
    subtitle: "Piloter un produit numérique, de l'idée à la mise en marché",
    subtitleEn: "Steering a digital product, from idea to market launch",
    icon: "compass",
    sections: [
      {
        title: "1. Le rôle", titleEn: "1. The role",
        items: [
          { label: "Différence Product Manager / Product Owner", labelEn: "Product Manager vs Product Owner", level: "core", resource: { label: "Atlassian - Product management", labelEn: "Atlassian - Product management", url: "https://www.atlassian.com/agile/product-management" } },
          { label: "Cycle de vie d'un produit", labelEn: "Product life cycle", level: "core", resource: { label: "Aha! - Le cycle de vie produit", labelEn: "Aha! - The product life cycle", url: "https://www.aha.io/roadmapping/guide/what-is-the-product-lifecycle" } }
        ]
      },
      {
        title: "2. Découverte utilisateur", titleEn: "2. User discovery",
        items: [
          { label: "Entretiens utilisateurs et personas", labelEn: "User interviews and personas", level: "core", resource: { label: "SVPG - Les personas en product management", labelEn: "SVPG - Personas in product management", url: "https://www.svpg.com/personas-for-product-management/" } },
          { label: "Framework Jobs to be Done (JTBD)", labelEn: "Jobs to be Done (JTBD) framework", level: "option", resource: { label: "Aha! - Le framework Jobs to be Done", labelEn: "Aha! - The Jobs to be Done framework", url: "https://www.aha.io/roadmapping/guide/release-management/what-is-the-jobs-to-be-done-framework" } },
          { label: "Analyse de la concurrence", labelEn: "Competitive analysis", level: "core", resource: { label: "Aha! - Analyser la concurrence", labelEn: "Aha! - Analyzing the competition", url: "https://www.aha.io/roadmapping/guide/product-strategy/how-should-product-managers-research-competitors" } }
        ]
      },
      {
        title: "3. Stratégie produit", titleEn: "3. Product strategy",
        items: [
          { label: "Vision et roadmap produit", labelEn: "Product vision and roadmap", level: "core", resource: { label: "Atlassian - Le product roadmap", labelEn: "Atlassian - The product roadmap", url: "https://www.atlassian.com/agile/product-management/product-roadmaps" } },
          { label: "Objectifs et résultats clés (OKR)", labelEn: "Objectives and key results (OKRs)", level: "core", resource: { label: "Atlassian - Le guide des OKR", labelEn: "Atlassian - The OKR guide", url: "https://www.atlassian.com/agile/agile-at-scale/okr" } },
          { label: "Priorisation (RICE, MoSCoW, Kano)", labelEn: "Prioritization (RICE, MoSCoW, Kano)", level: "core", resource: { label: "Atlassian - Frameworks de priorisation", labelEn: "Atlassian - Prioritization frameworks", url: "https://www.atlassian.com/agile/product-management/prioritization-framework" } },
          { label: "Stratégie de mise sur le marché (go-to-market)", labelEn: "Go-to-market strategy", level: "option", resource: { label: "ProductPlan - Stratégie go-to-market", labelEn: "ProductPlan - Go-to-market strategy", url: "https://www.productplan.com/glossary/go-to-market-strategy" } }
        ]
      },
      {
        title: "4. Exécution", titleEn: "4. Execution",
        items: [
          { label: "Rédaction de specs et user stories", labelEn: "Writing specs and user stories", level: "core", resource: { label: "Atlassian - Les user stories", labelEn: "Atlassian - User stories", url: "https://www.atlassian.com/agile/project-management/user-stories" } },
          { label: "Méthodologies agiles : Scrum, Kanban", labelEn: "Agile methodologies: Scrum, Kanban", level: "core", resource: { label: "Scrum.org - Ressources", labelEn: "Scrum.org - Resources", url: "https://www.scrum.org/resources" } },
          { label: "Gestion du backlog", labelEn: "Backlog management", level: "core", resource: { label: "Atlassian - Gérer le backlog produit", labelEn: "Atlassian - Managing the product backlog", url: "https://www.atlassian.com/agile/scrum/backlogs" } }
        ]
      },
      {
        title: "5. Data et métriques", titleEn: "5. Data and metrics",
        items: [
          { label: "KPIs produit, tableaux de bord, North Star Metric", labelEn: "Product KPIs, dashboards, North Star Metric", level: "core", resource: { label: "Amplitude - Trouver son North Star Metric", labelEn: "Amplitude - Finding your North Star Metric", url: "https://amplitude.com/blog/product-north-star-metric" } },
          { label: "Outils d'analytics produit (Amplitude, Mixpanel, Google Analytics)", labelEn: "Product analytics tools (Amplitude, Mixpanel, Google Analytics)", level: "option", resource: { label: "Centre d'aide Google Analytics", labelEn: "Google Analytics Help Center", url: "https://support.google.com/analytics/" } },
          { label: "A/B testing", labelEn: "A/B testing", level: "option", resource: { label: "Pendo - L'A/B testing en product management", labelEn: "Pendo - A/B testing in product management", url: "https://www.pendo.io/pendo-blog/product-management-101-a-b-testing/" } }
        ]
      },
      {
        title: "6. Outils", titleEn: "6. Tools",
        items: [
          { label: "Jira, Notion, Linear", labelEn: "Jira, Notion, Linear", level: "core", resource: { label: "Atlassian - Jira", labelEn: "Atlassian - Jira", url: "https://www.atlassian.com/software/jira" } },
          { label: "Lecture de maquettes Figma", labelEn: "Reading Figma mockups", level: "option", resource: { label: "Figma Learn - Centre d'aide", labelEn: "Figma Learn - Help Center", url: "https://help.figma.com/hc/en-us" } }
        ]
      },
      {
        title: "7. Écosystème togolais", titleEn: "7. Togolese ecosystem",
        items: [
          { label: "Djanta Start (Djanta Tech Hub) : accompagnement de startups", labelEn: "Djanta Start (Djanta Tech Hub): startup support", level: "core", resource: { label: "djantatechhub.gouv.tg", labelEn: "djantatechhub.gouv.tg", url: "https://djantatechhub.gouv.tg/" } },
          { label: "CUBE : incubateur et formation entrepreneuriat numérique", labelEn: "CUBE: incubator and digital entrepreneurship training", level: "option", resource: { label: "togofirst.com - L'incubateur CUBE", labelEn: "togofirst.com - The CUBE incubator (in French)", url: "https://www.togofirst.com/fr/tic/0801-15491-togo-l-incubateur-cube-et-l-oif-pour-former-300-jeunes-au-digital-et-a-lentrepreneuriat" } }
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
    titleEn: "UX/UI Designer",
    subtitle: "Concevoir des interfaces utiles, claires et agréables à utiliser",
    subtitleEn: "Designing interfaces that are useful, clear and pleasant to use",
    icon: "layout",
    sections: [
      {
        title: "1. Fondamentaux du design", titleEn: "1. Design fundamentals",
        items: [
          { label: "Théorie des couleurs, typographie, grille", labelEn: "Color theory, typography, grids", level: "core" },
          { label: "Principes d'ergonomie et de hiérarchie visuelle", labelEn: "Principles of usability and visual hierarchy", level: "core" },
          { label: "Conception centrée utilisateur (norme internationale ISO 9241-210)", labelEn: "Human-centered design (international standard ISO 9241-210)", level: "option", resource: { label: "ISO 9241-210", labelEn: "ISO 9241-210", url: "https://www.iso.org/standard/77520.html" } }
        ]
      },
      {
        title: "2. Recherche utilisateur (UX)", titleEn: "2. User research (UX)",
        items: [
          { label: "Entretiens, personas, parcours utilisateur", labelEn: "Interviews, personas, user journeys", level: "core", resource: { label: "Google - Certificat UX Design", labelEn: "Google - UX Design Certificate", url: "https://www.coursera.org/professional-certificates/google-ux-design" } },
          { label: "Architecture de l'information", labelEn: "Information architecture", level: "core" },
          { label: "Tests d'utilisabilité modérés vs non modérés", labelEn: "Moderated vs unmoderated usability testing", level: "option" }
        ]
      },
      {
        title: "3. Conception", titleEn: "3. Design",
        items: [
          { label: "Wireframes basse et haute fidélité", labelEn: "Low- and high-fidelity wireframes", level: "core" },
          { label: "Prototypage interactif", labelEn: "Interactive prototyping", level: "core" }
        ]
      },
      {
        title: "4. Interface (UI)", titleEn: "4. Interface (UI)",
        items: [
          { label: "Design systems et composants réutilisables", labelEn: "Design systems and reusable components", level: "core" },
          { label: "Accessibilité visuelle (contraste, tailles de police)", labelEn: "Visual accessibility (contrast, font sizes)", level: "core" },
          { label: "Normes d'accessibilité WCAG (Web Content Accessibility Guidelines)", labelEn: "WCAG accessibility standards (Web Content Accessibility Guidelines)", level: "core", resource: { label: "W3C - WCAG", labelEn: "W3C - WCAG", url: "https://www.w3.org/WAI/standards-guidelines/wcag/" } }
        ]
      },
      {
        title: "5. Outils", titleEn: "5. Tools",
        items: [
          { label: "Figma", labelEn: "Figma", level: "core", resource: { label: "Centre d'aide Figma", labelEn: "Figma Help Center", url: "https://help.figma.com/" } },
          { label: "Adobe XD ou Sketch", labelEn: "Adobe XD or Sketch", level: "option" }
        ]
      },
      {
        title: "6. Tests et itération", titleEn: "6. Testing and iteration",
        items: [
          { label: "Tests d'utilisabilité", labelEn: "Usability testing", level: "core" },
          { label: "Itération à partir des retours", labelEn: "Iterating on feedback", level: "core" },
          { label: "Références Nielsen Norman Group : heuristiques d'utilisabilité reconnues mondialement", labelEn: "Nielsen Norman Group references: internationally recognized usability heuristics", level: "option", resource: { label: "Nielsen Norman Group", labelEn: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/ten-usability-heuristics/" } }
        ]
      },
      {
        title: "7. Écosystème togolais", titleEn: "7. Togolese ecosystem",
        items: [
          { label: "GDG Lomé : ateliers design occasionnels", labelEn: "GDG Lomé: occasional design workshops", level: "option" },
          { label: "Djanta Academy : formations compétences numériques", labelEn: "Djanta Academy: digital skills training", level: "option" }
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
    titleEn: "Data Analyst",
    subtitle: "Transformer des données brutes en décisions",
    subtitleEn: "Turning raw data into decisions",
    icon: "trending-up",
    sections: [
      {
        title: "1. Fondamentaux de l'analyse de données", titleEn: "1. Data analysis fundamentals",
        items: [
          { label: "Les 4 types d'analyse : descriptive (que s'est-il passé), diagnostique (pourquoi), prédictive (que va-t-il se passer), prescriptive (que faire)", labelEn: "The 4 types of analysis: descriptive (what happened), diagnostic (why), predictive (what will happen), prescriptive (what to do)", level: "core", resource: { label: "EPSI - Les méthodes d'analyse de données", labelEn: "EPSI - Data analysis methods (in French)", url: "https://www.epsi.fr/actualites/donnees-methodes-analyse" } },
          { label: "Cycle de vie de la donnée : collecte, nettoyage, exploration, analyse, visualisation, communication", labelEn: "Data life cycle: collection, cleaning, exploration, analysis, visualization, communication", level: "core", resource: { label: "IBM - Data lifecycle management", labelEn: "IBM - Data lifecycle management", url: "https://www.ibm.com/think/topics/data-lifecycle-management" } }
        ]
      },
      {
        title: "2. Tableurs", titleEn: "2. Spreadsheets",
        items: [
          { label: "Formules avancées (RECHERCHEV/RECHERCHEX, INDEX/EQUIV, SI imbriqués)", labelEn: "Advanced formulas (VLOOKUP/XLOOKUP, INDEX/MATCH, nested IFs)", level: "core", resource: { label: "Aide Google Docs - RECHERCHEV (VLOOKUP)", labelEn: "Google Docs Help - VLOOKUP", url: "https://support.google.com/docs/answer/3093318?hl=fr" } },
          { label: "Tableaux croisés dynamiques (TCD) et mise en forme conditionnelle", labelEn: "Pivot tables and conditional formatting", level: "core", resource: { label: "Aide Google Docs - Tableaux croisés dynamiques", labelEn: "Google Docs Help - Pivot tables", url: "https://support.google.com/docs/answer/1272900?hl=fr&co=GENIE.Platform%3DDesktop" } },
          { label: "Validation de données et nettoyage de base (doublons, espaces, formats)", labelEn: "Data validation and basic cleaning (duplicates, spaces, formats)", level: "core", resource: { label: "Aide Google Docs - Liste déroulante et validation", labelEn: "Google Docs Help - Dropdown lists and validation", url: "https://support.google.com/docs/answer/186103?hl=fr&co=GENIE.Platform%3DDesktop" } }
        ]
      },
      {
        title: "3. SQL", titleEn: "3. SQL",
        items: [
          { label: "Requêtes de base : SELECT, WHERE, ORDER BY, agrégations (COUNT, SUM, AVG)", labelEn: "Basic queries: SELECT, WHERE, ORDER BY, aggregations (COUNT, SUM, AVG)", level: "core", resource: { label: "Voir roadmap compétence SQL", labelEn: "See the SQL skill roadmap", url: "roadmap.html?id=sql" } },
          { label: "Jointures (JOIN) entre plusieurs tables", labelEn: "Joins (JOIN) across multiple tables", level: "core", resource: { label: "W3Schools - SQL JOIN", labelEn: "W3Schools - SQL JOIN", url: "https://www.w3schools.com/sql/sql_join.asp" } },
          { label: "GROUP BY / HAVING, sous-requêtes", labelEn: "GROUP BY / HAVING, subqueries", level: "core", resource: { label: "W3Schools - SQL GROUP BY", labelEn: "W3Schools - SQL GROUP BY", url: "https://www.w3schools.com/sql/sql_groupby.asp" } },
          { label: "Fonctions de fenêtrage (window functions)", labelEn: "Window functions", level: "option", resource: { label: "Documentation PostgreSQL - Window Functions", labelEn: "PostgreSQL documentation - Window Functions", url: "https://www.postgresql.org/docs/current/functions-window.html" } }
        ]
      },
      {
        title: "4. Programmation pour la donnée", titleEn: "4. Programming for data",
        items: [
          { label: "Python : bases du langage", labelEn: "Python: language basics", level: "core", resource: { label: "Voir roadmap compétence Python", labelEn: "See the Python skill roadmap", url: "roadmap.html?id=python" } },
          { label: "Pandas : manipulation de tableaux de données (DataFrames)", labelEn: "Pandas: working with data tables (DataFrames)", level: "core", resource: { label: "Documentation Pandas", labelEn: "Pandas documentation", url: "https://pandas.pydata.org/docs/" } },
          { label: "NumPy : calcul numérique de base", labelEn: "NumPy: basic numerical computing", level: "option", resource: { label: "Documentation NumPy - Quickstart", labelEn: "NumPy documentation - Quickstart", url: "https://numpy.org/doc/stable/user/quickstart.html" } },
          { label: "R comme alternative à Python (fréquent en recherche/statistiques)", labelEn: "R as an alternative to Python (common in research/statistics)", level: "option", resource: { label: "CRAN - An Introduction to R", labelEn: "CRAN - An Introduction to R", url: "https://cran.r-project.org/doc/manuals/r-release/R-intro.html" } }
        ]
      },
      {
        title: "5. Nettoyage et préparation des données", titleEn: "5. Data cleaning and preparation",
        items: [
          { label: "Traitement des valeurs manquantes et des doublons", labelEn: "Handling missing values and duplicates", level: "core", resource: { label: "Documentation Pandas - Valeurs manquantes", labelEn: "Pandas documentation - Missing values", url: "https://pandas.pydata.org/docs/user_guide/missing_data.html" } },
          { label: "Détection des valeurs aberrantes (outliers)", labelEn: "Outlier detection", level: "core", resource: { label: "Mr. Mint - Les valeurs aberrantes (outliers)", labelEn: "Mr. Mint - Outliers (in French)", url: "https://mrmint.fr/outliers-machine-learning" } },
          { label: "Transformation et restructuration des données (pivot, jointure de tables)", labelEn: "Transforming and reshaping data (pivot, table joins)", level: "core", resource: { label: "Documentation Pandas - Reshaping & Pivot Tables", labelEn: "Pandas documentation - Reshaping & Pivot Tables", url: "https://pandas.pydata.org/docs/user_guide/reshaping.html" } }
        ]
      },
      {
        title: "6. Visualisation et Business Intelligence", titleEn: "6. Visualization and Business Intelligence",
        items: [
          { label: "Power BI ou Tableau", labelEn: "Power BI or Tableau", level: "core", resource: { label: "Documentation Power BI", labelEn: "Power BI documentation", url: "https://learn.microsoft.com/power-bi/" } },
          { label: "Choisir le bon graphique (barres, lignes, nuages de points, histogrammes) selon le message à transmettre", labelEn: "Choosing the right chart (bars, lines, scatter plots, histograms) for the message you want to convey", level: "core", resource: { label: "Tableau - Choisir le bon type de graphique", labelEn: "Tableau - Choosing the right chart type", url: "https://help.tableau.com/current/pro/desktop/fr-fr/what_chart_example.htm" } },
          { label: "Looker Studio (gratuit)", labelEn: "Looker Studio (free)", level: "option", resource: { label: "Google Cloud - Guide de démarrage Looker Studio", labelEn: "Google Cloud - Looker Studio quickstart", url: "https://docs.cloud.google.com/data-studio/quick-start-guide" } },
          { label: "Matplotlib / Seaborn (visualisation en Python)", labelEn: "Matplotlib / Seaborn (visualization in Python)", level: "option", resource: { label: "Documentation Matplotlib - Quickstart", labelEn: "Matplotlib documentation - Quickstart", url: "https://matplotlib.org/stable/users/explain/quick_start.html" } }
        ]
      },
      {
        title: "7. Statistiques appliquées", titleEn: "7. Applied statistics",
        items: [
          { label: "Statistiques descriptives : moyenne, médiane, écart-type, distribution", labelEn: "Descriptive statistics: mean, median, standard deviation, distribution", level: "core", resource: { label: "Khan Academy - Moyenne, médiane et mode", labelEn: "Khan Academy - Mean, median and mode (in French)", url: "https://fr.khanacademy.org/math/be-4eme-secondaire2/x213a6fc6f6c9e122:statistiques/x213a6fc6f6c9e122:parametres-de-position/a/mean-median-and-mode-review" } },
          { label: "Corrélation entre variables", labelEn: "Correlation between variables", level: "core", resource: { label: "OpenClassrooms - Analyser la corrélation entre deux variables", labelEn: "OpenClassrooms - Analyzing the correlation between two variables (in French)", url: "https://openclassrooms.com/fr/courses/7410486-nettoyez-et-analysez-votre-jeu-de-donnees/7428368-analysez-la-correlation-entre-deux-variables-quantitatives" } },
          { label: "Tests d'hypothèses et intervalles de confiance", labelEn: "Hypothesis tests and confidence intervals", level: "option", resource: { label: "Khan Academy - Intervalles de confiance", labelEn: "Khan Academy - Confidence intervals", url: "https://fr.khanacademy.org/math/statistics-probability/confidence-intervals-one-sample" } },
          { label: "Régression linéaire simple", labelEn: "Simple linear regression", level: "option", resource: { label: "Khan Academy - La régression linéaire", labelEn: "Khan Academy - Linear regression", url: "https://fr.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data/introduction-to-trend-lines/a/linear-regression-review" } }
        ]
      },
      {
        title: "8. Communication des résultats", titleEn: "8. Communicating results",
        items: [
          { label: "Storytelling avec les données : construire un récit, pas juste un graphique", labelEn: "Data storytelling: building a narrative, not just a chart", level: "core", resource: { label: "Ostraca - Guide du data storytelling", labelEn: "Ostraca - Data storytelling guide (in French)", url: "https://blog.ostraca.fr/blog/guide-data-storytelling-exemple-avec-donnees/" } },
          { label: "Concevoir un tableau de bord (dashboard) lisible pour un public non technique", labelEn: "Designing a dashboard that a non-technical audience can read", level: "core", resource: { label: "Tableau - 10 bonnes pratiques pour les tableaux de bord", labelEn: "Tableau - 10 dashboard best practices", url: "https://www.tableau.com/fr-fr/learn/whitepapers/10-best-practices-building-effective-dashboards" } }
        ]
      },
      {
        title: "9. Pour aller plus loin", titleEn: "9. Going further",
        items: [
          { label: "Introduction au Machine Learning (classification, régression)", labelEn: "Introduction to Machine Learning (classification, regression)", level: "option", resource: { label: "Voir roadmap métier Data & IA", labelEn: "See the Data & AI career roadmap", url: "roadmap.html?id=data-ia" } },
          { label: "Notions de Big Data (volumes, traitement distribué)", labelEn: "Big Data basics (volumes, distributed processing)", level: "option", resource: { label: "SAP - Qu'est-ce que le Big Data ?", labelEn: "SAP - What is Big Data?", url: "https://www.sap.com/france/resources/what-is-big-data" } }
        ]
      },
      {
        title: "10. Écosystème togolais", titleEn: "10. Togolese ecosystem",
        items: [
          { label: "PyCon Togo : conférence nationale Python", labelEn: "PyCon Togo: national Python conference", level: "core", resource: { label: "pycontg.pytogo.org", labelEn: "pycontg.pytogo.org", url: "https://pycontg.pytogo.org/" } },
          { label: "Djanta Lab : recherche et innovation", labelEn: "Djanta Lab: research and innovation", level: "option", resource: { label: "djantatechhub.gouv.tg", labelEn: "djantatechhub.gouv.tg", url: "https://djantatechhub.gouv.tg/" } }
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
    titleEn: "IT Support / Helpdesk",
    subtitle: "Assister les utilisateurs et maintenir le parc informatique",
    subtitleEn: "Assisting users and maintaining the IT equipment fleet",
    icon: "monitor",
    sections: [
      {
        title: "1. Systèmes", titleEn: "1. Systems",
        items: [
          { label: "Bases Windows, macOS et Linux", labelEn: "Windows, macOS and Linux basics", level: "core" },
          { label: "Installation et configuration de postes", labelEn: "Workstation installation and configuration", level: "core" }
        ]
      },
      {
        title: "2. Réseaux", titleEn: "2. Networking",
        items: [
          { label: "Notions réseau de base", labelEn: "Networking basics", level: "core", resource: { label: "Voir roadmap compétence Réseaux", labelEn: "See the Networking skill roadmap", url: "roadmap.html?id=reseaux" } }
        ]
      },
      {
        title: "3. Diagnostic et support", titleEn: "3. Troubleshooting and support",
        items: [
          { label: "Méthodologie de résolution de problèmes", labelEn: "Problem-solving methodology", level: "core" },
          { label: "Gestion de tickets (ITSM) : outils comme Zendesk, Freshdesk", labelEn: "Ticket management (ITSM): tools such as Zendesk, Freshdesk", level: "core" },
          { label: "Prise en main à distance (TeamViewer, AnyDesk)", labelEn: "Remote access (TeamViewer, AnyDesk)", level: "core" },
          { label: "Communication claire avec des utilisateurs non techniques", labelEn: "Clear communication with non-technical users", level: "core" }
        ]
      },
      {
        title: "4. Administration", titleEn: "4. Administration",
        items: [
          { label: "Active Directory, gestion des comptes", labelEn: "Active Directory, account management", level: "core" },
          { label: "Gestion de parc informatique et des périphériques (imprimantes, etc.)", labelEn: "Managing IT equipment and peripherals (printers, etc.)", level: "core" },
          { label: "Sauvegardes de postes utilisateurs", labelEn: "Backing up user workstations", level: "option" }
        ]
      },
      {
        title: "5. Sécurité de base", titleEn: "5. Security basics",
        items: [
          { label: "Sensibilisation aux bonnes pratiques", labelEn: "Awareness of good practices", level: "core" }
        ]
      },
      {
        title: "6. Certifications", titleEn: "6. Certifications",
        items: [
          { label: "CompTIA A+", labelEn: "CompTIA A+", level: "core", resource: { label: "CompTIA A+", labelEn: "CompTIA A+", url: "https://www.comptia.org/certifications/a" } },
          { label: "ITIL Foundation", labelEn: "ITIL Foundation", level: "option", resource: { label: "ITIL - Axelos", labelEn: "ITIL - Axelos", url: "https://www.axelos.com/certifications/itil-service-management" } },
          { label: "Microsoft 365 Certified: Fundamentals", labelEn: "Microsoft 365 Certified: Fundamentals", level: "option", resource: { label: "Microsoft Learn - Certifications", labelEn: "Microsoft Learn - Certifications", url: "https://learn.microsoft.com/en-us/credentials/" } }
        ]
      },
      {
        title: "7. Écosystème togolais", titleEn: "7. Togolese ecosystem",
        items: [
          { label: "IAI-Togo et ESGIS : formations réseaux et systèmes", labelEn: "IAI-Togo and ESGIS: networks and systems training", level: "core" }
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
    titleEn: "IT Project Manager",
    subtitle: "Planifier, coordonner et livrer des projets informatiques",
    subtitleEn: "Planning, coordinating and delivering IT projects",
    icon: "clipboard",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Cycle de vie d'un projet", labelEn: "Project life cycle", level: "core" },
          { label: "Waterfall vs Agile", labelEn: "Waterfall vs Agile", level: "core" }
        ]
      },
      {
        title: "2. Planification", titleEn: "2. Planning",
        items: [
          { label: "Charte de projet, périmètre (WBS)", labelEn: "Project charter, scope (WBS)", level: "core" },
          { label: "Planning et diagramme de Gantt", labelEn: "Scheduling and Gantt charts", level: "core" }
        ]
      },
      {
        title: "3. Pilotage", titleEn: "3. Steering",
        items: [
          { label: "Gestion des risques", labelEn: "Risk management", level: "core" },
          { label: "Gestion du budget", labelEn: "Budget management", level: "core" },
          { label: "Matrice RACI et gestion des parties prenantes", labelEn: "RACI matrix and stakeholder management", level: "core" },
          { label: "Gestion du changement et clôture de projet (retours d'expérience)", labelEn: "Change management and project closure (lessons learned)", level: "option" }
        ]
      },
      {
        title: "4. Outils", titleEn: "4. Tools",
        items: [
          { label: "Jira, Trello ou MS Project", labelEn: "Jira, Trello or MS Project", level: "core" }
        ]
      },
      {
        title: "5. Certifications", titleEn: "5. Certifications",
        items: [
          { label: "PMP (Project Management Professional)", labelEn: "PMP (Project Management Professional)", level: "option", resource: { label: "PMI - Certification PMP", labelEn: "PMI - PMP certification", url: "https://www.pmi.org/certifications/project-management-pmp" } },
          { label: "PRINCE2", labelEn: "PRINCE2", level: "option", resource: { label: "PRINCE2 - Certification", labelEn: "PRINCE2 - Certification", url: "https://www.prince2.com/" } },
          { label: "Professional Scrum Master (PSM)", labelEn: "Professional Scrum Master (PSM)", level: "option", resource: { label: "Scrum.org - Certifications PSM", labelEn: "Scrum.org - PSM certifications", url: "https://www.scrum.org/professional-scrum-certifications" } }
        ]
      },
      {
        title: "6. Écosystème togolais", titleEn: "6. Togolese ecosystem",
        items: [
          { label: "CUBE et Djanta Tech Hub : accompagnement de projets numériques", labelEn: "CUBE and Djanta Tech Hub: support for digital projects", level: "core" }
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
    titleEn: "QA / Software Tester",
    subtitle: "Garantir la qualité et la fiabilité des logiciels avant leur mise en production",
    subtitleEn: "Ensuring software quality and reliability before it goes into production",
    icon: "check-square",
    sections: [
      {
        title: "1. Fondamentaux du test", titleEn: "1. Testing fundamentals",
        items: [
          { label: "Types de tests : unitaire, intégration, système, acceptation", labelEn: "Types of tests: unit, integration, system, acceptance", level: "core" },
          { label: "Cycle de vie du test logiciel, vérification vs validation", labelEn: "Software testing life cycle, verification vs validation", level: "core" },
          { label: "Boîte noire, boîte blanche, boîte grise", labelEn: "Black-box, white-box, gray-box testing", level: "option" }
        ]
      },
      {
        title: "2. Techniques de test", titleEn: "2. Testing techniques",
        items: [
          { label: "Tests fonctionnels vs non-fonctionnels", labelEn: "Functional vs non-functional testing", level: "core" },
          { label: "Fumée (smoke), régression, exploratoire, recette utilisateur (UAT)", labelEn: "Smoke, regression, exploratory, user acceptance testing (UAT)", level: "core" },
          { label: "Tests de performance, de charge et de résistance", labelEn: "Performance, load and stress testing", level: "option" },
          { label: "Tests de sécurité de base et d'accessibilité (WAVE, AXE)", labelEn: "Basic security and accessibility testing (WAVE, AXE)", level: "option" }
        ]
      },
      {
        title: "3. Tests manuels", titleEn: "3. Manual testing",
        items: [
          { label: "Rédaction de cas et scénarios de test", labelEn: "Writing test cases and scenarios", level: "core" },
          { label: "Rapport et suivi des anomalies", labelEn: "Bug reporting and tracking", level: "core" }
        ]
      },
      {
        title: "4. Tests automatisés", titleEn: "4. Automated testing",
        items: [
          { label: "Selenium", labelEn: "Selenium", level: "core", resource: { label: "Documentation Selenium", labelEn: "Selenium documentation", url: "https://www.selenium.dev/documentation/" } },
          { label: "Cypress ou Playwright", labelEn: "Cypress or Playwright", level: "option", resource: { label: "Documentation Playwright", labelEn: "Playwright documentation", url: "https://playwright.dev/docs/intro" } },
          { label: "Tests d'API avec Postman", labelEn: "API testing with Postman", level: "core", resource: { label: "Documentation Postman", labelEn: "Postman documentation", url: "https://learning.postman.com/docs/introduction/overview/" } },
          { label: "Tests mobiles avec Appium", labelEn: "Mobile testing with Appium", level: "option" }
        ]
      },
      {
        title: "5. Méthodologie", titleEn: "5. Methodology",
        items: [
          { label: "Tests dans un cycle Agile/Scrum, tests de régression", labelEn: "Testing in an Agile/Scrum cycle, regression testing", level: "core" },
          { label: "TDD (Test-Driven Development) et BDD (Behavior-Driven Development)", labelEn: "TDD (Test-Driven Development) and BDD (Behavior-Driven Development)", level: "option" },
          { label: "Certification ISTQB Foundation Level, référence internationale du métier", labelEn: "ISTQB Foundation Level certification, the international benchmark for the job", level: "option", resource: { label: "ISTQB", labelEn: "ISTQB", url: "https://www.istqb.org/" } }
        ]
      },
      {
        title: "6. Outils", titleEn: "6. Tools",
        items: [
          { label: "Jira ou TestRail pour le suivi", labelEn: "Jira or TestRail for tracking", level: "core" },
          { label: "Intégration des tests dans un pipeline CI/CD", labelEn: "Integrating tests into a CI/CD pipeline", level: "option" }
        ]
      },
      {
        title: "7. Écosystème togolais", titleEn: "7. Togolese ecosystem",
        items: [
          { label: "IAI-Togo, ESGIS et HETEC : bases en développement logiciel utiles au test", labelEn: "IAI-Togo, ESGIS and HETEC: software development basics useful for testing", level: "core" }
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
    titleEn: "Systems and Network Administrator",
    subtitle: "Maintenir et sécuriser l'infrastructure informatique d'une organisation",
    subtitleEn: "Maintaining and securing an organization's IT infrastructure",
    icon: "hard-drive",
    sections: [
      {
        title: "1. Systèmes", titleEn: "1. Systems",
        items: [
          { label: "Administration Linux et Windows Server", labelEn: "Linux and Windows Server administration", level: "core", resource: { label: "Voir roadmap compétence Linux", labelEn: "See the Linux skill roadmap", url: "roadmap.html?id=linux" } },
          { label: "Services DNS, DHCP, Active Directory/LDAP", labelEn: "DNS, DHCP, Active Directory/LDAP services", level: "core" }
        ]
      },
      {
        title: "2. Réseaux et sécurité", titleEn: "2. Networks and security",
        items: [
          { label: "Architecture réseau, VLAN, routage", labelEn: "Network architecture, VLANs, routing", level: "core", resource: { label: "Voir roadmap compétence Réseaux", labelEn: "See the Networking skill roadmap", url: "roadmap.html?id=reseaux" } },
          { label: "Pare-feu et durcissement des serveurs (hardening)", labelEn: "Firewalls and server hardening", level: "core" }
        ]
      },
      {
        title: "3. Virtualisation et cloud", titleEn: "3. Virtualization and cloud",
        items: [
          { label: "VMware, Hyper-V ou Proxmox", labelEn: "VMware, Hyper-V or Proxmox", level: "core" },
          { label: "Infrastructures hybrides (on-premise + cloud)", labelEn: "Hybrid infrastructures (on-premise + cloud)", level: "option", resource: { label: "Voir roadmap compétence Cloud", labelEn: "See the Cloud skill roadmap", url: "roadmap.html?id=cloud" } }
        ]
      },
      {
        title: "4. Sauvegarde et continuité", titleEn: "4. Backup and continuity",
        items: [
          { label: "Politiques de sauvegarde", labelEn: "Backup policies", level: "core" },
          { label: "Plan de reprise d'activité (PRA)", labelEn: "Disaster recovery plan (DRP)", level: "option" }
        ]
      },
      {
        title: "5. Supervision", titleEn: "5. Monitoring",
        items: [
          { label: "Zabbix ou Nagios", labelEn: "Zabbix or Nagios", level: "core", resource: { label: "Documentation Zabbix", labelEn: "Zabbix documentation", url: "https://www.zabbix.com/documentation/current/en/manual" } }
        ]
      },
      {
        title: "6. Automatisation et gestion des services IT", titleEn: "6. Automation and IT service management",
        items: [
          { label: "Scripts d'automatisation : Bash, PowerShell ou Ansible pour les tâches répétitives", labelEn: "Automation scripts: Bash, PowerShell or Ansible for repetitive tasks", level: "core", resource: { label: "Documentation Ansible", labelEn: "Ansible documentation", url: "https://docs.ansible.com/" } },
          { label: "Gestion des services IT (ITSM) : tickets, incidents, changements, bases d'ITIL", labelEn: "IT service management (ITSM): tickets, incidents, changes, ITIL basics", level: "option" }
        ]
      },
      {
        title: "7. Certifications", titleEn: "7. Certifications",
        items: [
          { label: "CompTIA Network+", labelEn: "CompTIA Network+", level: "option", resource: { label: "CompTIA Network+", labelEn: "CompTIA Network+", url: "https://www.comptia.org/certifications/network" } }
        ]
      },
      {
        title: "8. Écosystème togolais", titleEn: "8. Togolese ecosystem",
        items: [
          { label: "ESGIS, ESSEYI, Université de Lomé (CIC) : formations réseaux et systèmes", labelEn: "ESGIS, ESSEYI, University of Lomé (CIC): networks and systems training", level: "core" }
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
    titleEn: "Network and Telecommunications Engineer",
    subtitle: "Concevoir et exploiter les infrastructures de télécommunication",
    subtitleEn: "Designing and operating telecommunications infrastructure",
    icon: "radio",
    sections: [
      {
        title: "1. Fondamentaux réseaux", titleEn: "1. Networking fundamentals",
        items: [
          { label: "TCP/IP, routage, commutation", labelEn: "TCP/IP, routing, switching", level: "core", resource: { label: "Voir roadmap compétence Réseaux", labelEn: "See the Networking skill roadmap", url: "roadmap.html?id=reseaux" } },
          { label: "Modèle OSI et plan d'adressage IP (IPv4/IPv6)", labelEn: "OSI model and IP addressing plan (IPv4/IPv6)", level: "core" }
        ]
      },
      {
        title: "2. Télécommunications", titleEn: "2. Telecommunications",
        items: [
          { label: "Téléphonie IP (VoIP)", labelEn: "IP telephony (VoIP)", level: "core" },
          { label: "Réseaux mobiles (3G/4G/5G) et fibre optique", labelEn: "Mobile networks (3G/4G/5G) and fiber optics", level: "core" },
          { label: "Réseaux sans fil (Wi-Fi) : normes et déploiement", labelEn: "Wireless networks (Wi-Fi): standards and deployment", level: "core" },
          { label: "Réseaux satellitaires et solutions rurales (VSAT)", labelEn: "Satellite networks and rural solutions (VSAT)", level: "option" }
        ]
      },
      {
        title: "3. Équipements et supervision", titleEn: "3. Equipment and monitoring",
        items: [
          { label: "Configuration Cisco ou Huawei", labelEn: "Cisco or Huawei configuration", level: "core" },
          { label: "Supervision réseau (SNMP) et gestion de la qualité de service (QoS)", labelEn: "Network monitoring (SNMP) and quality of service (QoS) management", level: "option" },
          { label: "Documentation et schémas réseau (Visio, Draw.io)", labelEn: "Network documentation and diagrams (Visio, Draw.io)", level: "option" }
        ]
      },
      {
        title: "4. Sécurité télécoms", titleEn: "4. Telecom security",
        items: [
          { label: "Sécurisation des infrastructures réseau (pare-feu, VPN, segmentation)", labelEn: "Securing network infrastructure (firewalls, VPN, segmentation)", level: "core" },
          { label: "Détection d'intrusion réseau (IDS/IPS)", labelEn: "Network intrusion detection (IDS/IPS)", level: "option" },
          { label: "Plan de reprise après sinistre (PRA) pour les infrastructures critiques", labelEn: "Disaster recovery plan (DRP) for critical infrastructure", level: "core" }
        ]
      },
      {
        title: "5. Certifications", titleEn: "5. Certifications",
        items: [
          { label: "CCNA", labelEn: "CCNA", level: "core", resource: { label: "Cisco - Certification CCNA", labelEn: "Cisco - CCNA certification", url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html" } },
          { label: "CCNP", labelEn: "CCNP", level: "option" }
        ]
      },
      {
        title: "6. Écosystème togolais", titleEn: "6. Togolese ecosystem",
        items: [
          { label: "ESGIS et ESSEYI : bachelor Informatique Réseaux et Télécommunication", labelEn: "ESGIS and ESSEYI: bachelor's in Computer Science, Networks and Telecommunications", level: "core" },
          { label: "Yas Togo (ex-Togocom) et Moov Africa Togo : principaux employeurs du secteur télécom", labelEn: "Yas Togo (formerly Togocom) and Moov Africa Togo: the main employers in the telecom sector", level: "option" },
          { label: "ARCEP : autorité togolaise de régulation des télécommunications", labelEn: "ARCEP: Togo's telecommunications regulatory authority", level: "option", resource: { label: "arcep.tg", labelEn: "arcep.tg", url: "https://arcep.tg/" } }
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
    titleEn: "Software Architect",
    subtitle: "Concevoir la structure technique de systèmes complexes",
    subtitleEn: "Designing the technical structure of complex systems",
    icon: "layers",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Principes SOLID et design patterns (GoF)", labelEn: "SOLID principles and design patterns (GoF)", level: "core" },
          { label: "Domain-Driven Design (DDD) : modéliser autour du métier", labelEn: "Domain-Driven Design (DDD): modeling around the business", level: "option" }
        ]
      },
      {
        title: "2. Styles d'architecture", titleEn: "2. Architecture styles",
        items: [
          { label: "Monolithe vs microservices vs monolithe modulaire", labelEn: "Monolith vs microservices vs modular monolith", level: "core" },
          { label: "Architecture événementielle (event-driven), CQRS et event sourcing", labelEn: "Event-driven architecture, CQRS and event sourcing", level: "option" },
          { label: "Architecture hexagonale (ports et adaptateurs)", labelEn: "Hexagonal architecture (ports and adapters)", level: "option" }
        ]
      },
      {
        title: "3. Qualité et performance", titleEn: "3. Quality and performance",
        items: [
          { label: "Attributs de qualité : scalabilité, disponibilité, résilience, maintenabilité", labelEn: "Quality attributes: scalability, availability, resilience, maintainability", level: "core" },
          { label: "Compromis architecturaux (trade-offs) et dette technique", labelEn: "Architectural trade-offs and technical debt", level: "core" }
        ]
      },
      {
        title: "4. Documentation et décisions", titleEn: "4. Documentation and decisions",
        items: [
          { label: "Modélisation d'architecture (C4 model, diagrammes)", labelEn: "Architecture modeling (C4 model, diagrams)", level: "core", resource: { label: "The C4 model", labelEn: "The C4 model", url: "https://c4model.com/" } },
          { label: "Architecture Decision Records (ADR) : tracer pourquoi un choix a été fait", labelEn: "Architecture Decision Records (ADR): recording why a choice was made", level: "option" }
        ]
      },
      {
        title: "5. Cloud et infrastructure", titleEn: "5. Cloud and infrastructure",
        items: [
          { label: "Bases cloud nécessaires à l'architecture", labelEn: "Cloud basics needed for architecture", level: "core", resource: { label: "Voir roadmap compétence Cloud", labelEn: "See the Cloud skill roadmap", url: "roadmap.html?id=cloud" } },
          { label: "Files de messages et communication asynchrone (Kafka, RabbitMQ)", labelEn: "Message queues and asynchronous communication (Kafka, RabbitMQ)", level: "option" }
        ]
      },
      {
        title: "6. Écosystème togolais", titleEn: "6. Togolese ecosystem",
        items: [
          { label: "Rôle senior, généralement accessible après plusieurs années en développement backend/DevOps", labelEn: "A senior role, usually reached after several years in backend development/DevOps", level: "core" },
          { label: "GDG Lomé : échanges techniques avec la communauté", labelEn: "GDG Lomé: technical exchanges with the community", level: "option" }
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
    titleEn: "ERP/CRM Developer",
    subtitle: "Paramétrer et développer des solutions de gestion d'entreprise",
    subtitleEn: "Configuring and developing business management solutions",
    icon: "grid",
    sections: [
      {
        title: "1. Concepts", titleEn: "1. Concepts",
        items: [
          { label: "Différence ERP / CRM, modules de gestion (comptabilité, stock, RH, ventes)", labelEn: "ERP vs CRM, business modules (accounting, inventory, HR, sales)", level: "core" },
          { label: "Modélisation des processus métier (BPMN de base)", labelEn: "Business process modeling (basic BPMN)", level: "option" },
          { label: "Cycle de vie d'un projet ERP (cadrage, paramétrage, recette, déploiement)", labelEn: "ERP project life cycle (scoping, configuration, acceptance testing, rollout)", level: "core" }
        ]
      },
      {
        title: "2. Odoo", titleEn: "2. Odoo",
        items: [
          { label: "Modules Odoo et personnalisation", labelEn: "Odoo modules and customization", level: "core", resource: { label: "Documentation Odoo", labelEn: "Odoo documentation", url: "https://www.odoo.com/documentation/" } },
          { label: "Développement Python sur Odoo", labelEn: "Python development on Odoo", level: "core", resource: { label: "Voir roadmap compétence Python", labelEn: "See the Python skill roadmap", url: "roadmap.html?id=python" } }
        ]
      },
      {
        title: "3. Solutions internationales alternatives", titleEn: "3. Alternative international solutions",
        items: [
          { label: "Salesforce : personnalisation et développement Apex/Flow", labelEn: "Salesforce: customization and Apex/Flow development", level: "option", resource: { label: "Trailhead - Salesforce", labelEn: "Trailhead - Salesforce", url: "https://trailhead.salesforce.com/" } },
          { label: "Microsoft Dynamics 365", labelEn: "Microsoft Dynamics 365", level: "option" },
          { label: "SAP : notions de base (voir roadmap dédiée pour un poste de consultant SAP)", labelEn: "SAP: basics (see the dedicated roadmap for an SAP consultant role)", level: "option", resource: { label: "Voir roadmap métier Consultant SAP", labelEn: "See the SAP Consultant career roadmap", url: "roadmap.html?id=sap-consultant" } }
        ]
      },
      {
        title: "4. Intégration", titleEn: "4. Integration",
        items: [
          { label: "Connexion à des systèmes tiers (API, imports/exports)", labelEn: "Connecting to third-party systems (APIs, imports/exports)", level: "core" },
          { label: "ETL de base : extraire, transformer, charger des données entre systèmes", labelEn: "Basic ETL: extracting, transforming and loading data between systems", level: "option" },
          { label: "Automatisation entre applications (webhooks, Zapier, Make)", labelEn: "Automation between apps (webhooks, Zapier, Make)", level: "option" }
        ]
      },
      {
        title: "5. Déploiement et maintenance", titleEn: "5. Deployment and maintenance",
        items: [
          { label: "Installation, mises à jour, sauvegardes", labelEn: "Installation, updates, backups", level: "core" },
          { label: "Formation des utilisateurs finaux et conduite du changement", labelEn: "End-user training and change management", level: "option" }
        ]
      },
      {
        title: "6. Écosystème togolais", titleEn: "6. Togolese ecosystem",
        items: [
          { label: "Peu de filières spécialisées ERP au Togo à ce jour : les bases s'acquièrent via IAI-Togo, ESGIS puis en autoformation et en entreprise", labelEn: "Few specialized ERP programs in Togo so far: the basics come from IAI-Togo or ESGIS, then self-study and on-the-job experience", level: "core" }
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
    titleEn: "IoT / Embedded Systems Engineer",
    subtitle: "Concevoir des objets connectés et des systèmes électroniques intelligents",
    subtitleEn: "Designing connected devices and smart electronic systems",
    icon: "wifi",
    sections: [
      {
        title: "1. Électronique et microcontrôleurs", titleEn: "1. Electronics and microcontrollers",
        items: [
          { label: "Arduino, Raspberry Pi, ESP32", labelEn: "Arduino, Raspberry Pi, ESP32", level: "core", resource: { label: "Documentation Arduino", labelEn: "Arduino documentation", url: "https://docs.arduino.cc/" } },
          { label: "Capteurs et actionneurs (température, mouvement, relais)", labelEn: "Sensors and actuators (temperature, motion, relays)", level: "core" },
          { label: "Bases de conception de circuits imprimés (PCB)", labelEn: "Printed circuit board (PCB) design basics", level: "option" }
        ]
      },
      {
        title: "2. Programmation embarquée", titleEn: "2. Embedded programming",
        items: [
          { label: "C/C++ pour systèmes embarqués", labelEn: "C/C++ for embedded systems", level: "core" },
          { label: "Systèmes d'exploitation temps réel (RTOS) : notions de base", labelEn: "Real-time operating systems (RTOS): basics", level: "option" },
          { label: "Gestion de l'énergie et conception basse consommation", labelEn: "Power management and low-power design", level: "option" },
          { label: "Débogage matériel (analyseur logique, oscilloscope)", labelEn: "Hardware debugging (logic analyzer, oscilloscope)", level: "option" }
        ]
      },
      {
        title: "3. Protocoles IoT", titleEn: "3. IoT protocols",
        items: [
          { label: "MQTT, LoRa", labelEn: "MQTT, LoRa", level: "core", resource: { label: "mqtt.org - Documentation", labelEn: "mqtt.org - Documentation", url: "https://mqtt.org/" } },
          { label: "Autres protocoles : Zigbee, Bluetooth Low Energy (BLE), NB-IoT", labelEn: "Other protocols: Zigbee, Bluetooth Low Energy (BLE), NB-IoT", level: "option" }
        ]
      },
      {
        title: "4. Cloud, sécurité et connectivité", titleEn: "4. Cloud, security and connectivity",
        items: [
          { label: "Envoi de données vers le cloud, dashboards IoT", labelEn: "Sending data to the cloud, IoT dashboards", level: "option" },
          { label: "Plateformes IoT cloud (AWS IoT Core, Azure IoT Hub)", labelEn: "Cloud IoT platforms (AWS IoT Core, Azure IoT Hub)", level: "option" },
          { label: "Sécurité des objets connectés : mise à jour firmware, authentification", labelEn: "Connected device security: firmware updates, authentication", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais", titleEn: "5. Togolese ecosystem",
        items: [
          { label: "HETEC : parcours technologies numériques et IA", labelEn: "HETEC: digital technologies and AI track", level: "core" },
          { label: "Djanta Lab : recherche et innovation, domaine émergent au Togo", labelEn: "Djanta Lab: research and innovation, an emerging field in Togo", level: "option" }
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
    titleEn: "Blockchain / Web3 Developer",
    subtitle: "Construire des applications décentralisées et des smart contracts",
    subtitleEn: "Building decentralized applications and smart contracts",
    icon: "link",
    sections: [
      {
        title: "1. Fondamentaux blockchain", titleEn: "1. Blockchain fundamentals",
        items: [
          { label: "Structure d'une blockchain : blocs, hash, arbre de Merkle", labelEn: "Structure of a blockchain: blocks, hashes, Merkle trees", level: "core", resource: { label: "Ethereum.org - Les blocs", labelEn: "Ethereum.org - Blocks", url: "https://ethereum.org/developers/docs/blocks/" } },
          { label: "Mécanismes de consensus : Proof of Work, Proof of Stake", labelEn: "Consensus mechanisms: Proof of Work, Proof of Stake", level: "core", resource: { label: "Ethereum.org - Proof-of-stake vs proof-of-work", labelEn: "Ethereum.org - Proof-of-stake vs proof-of-work", url: "https://ethereum.org/developers/docs/consensus-mechanisms/pos/pos-vs-pow/" } },
          { label: "Cryptographie de base : clés publiques/privées, signatures", labelEn: "Cryptography basics: public/private keys, signatures", level: "core", resource: { label: "CISA - Understanding Digital Signatures", labelEn: "CISA - Understanding Digital Signatures", url: "https://www.cisa.gov/news-events/news/understanding-digital-signatures" } },
          { label: "Portefeuilles (wallets) et gestion des clés", labelEn: "Wallets and key management", level: "core", resource: { label: "MetaMask - Guide de démarrage", labelEn: "MetaMask - Getting started guide", url: "https://support.metamask.io/start/getting-started-with-metamask" } }
        ]
      },
      {
        title: "2. Smart contracts", titleEn: "2. Smart contracts",
        items: [
          { label: "Solidity et l'écosystème Ethereum (EVM)", labelEn: "Solidity and the Ethereum ecosystem (EVM)", level: "core", resource: { label: "Documentation Solidity", labelEn: "Solidity documentation", url: "https://docs.soliditylang.org/" } },
          { label: "Standards de tokens : ERC-20 (fongibles), ERC-721/ERC-1155 (NFT)", labelEn: "Token standards: ERC-20 (fungible), ERC-721/ERC-1155 (NFT)", level: "core", resource: { label: "Ethereum.org - Standards de tokens", labelEn: "Ethereum.org - Token standards", url: "https://ethereum.org/developers/docs/standards/tokens" } },
          { label: "Autres chaînes compatibles EVM : Polygon, BNB Chain, Arbitrum", labelEn: "Other EVM-compatible chains: Polygon, BNB Chain, Arbitrum", level: "option", resource: { label: "Ethereum.org - Les solutions Layer 2", labelEn: "Ethereum.org - Layer 2 solutions", url: "https://ethereum.org/layer-2/" } },
          { label: "Alternatives non-EVM : Solana (Rust), Move (Aptos/Sui)", labelEn: "Non-EVM alternatives: Solana (Rust), Move (Aptos/Sui)", level: "option", resource: { label: "Solana - Développer des programmes en Rust", labelEn: "Solana - Developing programs in Rust", url: "https://solana.com/docs/programs/rust" } }
        ]
      },
      {
        title: "3. Concepts DeFi et Web3", titleEn: "3. DeFi and Web3 concepts",
        items: [
          { label: "Finance décentralisée (DeFi) : DEX, lending, staking, AMM", labelEn: "Decentralized finance (DeFi): DEX, lending, staking, AMM", level: "option", resource: { label: "Ethereum.org - Qu'est-ce que la DeFi ?", labelEn: "Ethereum.org - What is DeFi?", url: "https://ethereum.org/defi/" } },
          { label: "Oracles blockchain (Chainlink) pour données externes", labelEn: "Blockchain oracles (Chainlink) for external data", level: "option", resource: { label: "Documentation Chainlink", labelEn: "Chainlink documentation", url: "https://docs.chain.link/" } },
          { label: "Interaction front-end avec ethers.js / viem + wagmi", labelEn: "Front-end interaction with ethers.js / viem + wagmi", level: "core", resource: { label: "Viem - Documentation", labelEn: "Viem - Documentation", url: "https://viem.sh/" } },
          { label: "IPFS et stockage décentralisé", labelEn: "IPFS and decentralized storage", level: "option", resource: { label: "Documentation IPFS - Démarrer", labelEn: "IPFS documentation - Getting started", url: "https://docs.ipfs.tech/install/" } }
        ]
      },
      {
        title: "4. Outils et environnement de développement", titleEn: "4. Tools and development environment",
        items: [
          { label: "Hardhat ou Foundry pour compiler, tester et déployer", labelEn: "Hardhat or Foundry to compile, test and deploy", level: "core", resource: { label: "Ethereum.org - Guides développeurs", labelEn: "Ethereum.org - Developer guides", url: "https://ethereum.org/en/developers/docs/" } },
          { label: "Remix IDE pour le prototypage rapide", labelEn: "Remix IDE for quick prototyping", level: "core", resource: { label: "Documentation Remix IDE", labelEn: "Remix IDE documentation", url: "https://remix-ide.readthedocs.io/en/latest/" } },
          { label: "MetaMask et autres wallets pour les tests", labelEn: "MetaMask and other wallets for testing", level: "core", resource: { label: "MetaMask - Guide de démarrage", labelEn: "MetaMask - Getting started guide", url: "https://support.metamask.io/start/getting-started-with-metamask" } },
          { label: "Réseaux de test (testnets) et faucets", labelEn: "Test networks (testnets) and faucets", level: "core", resource: { label: "Ethereum.org - Réseaux et testnets", labelEn: "Ethereum.org - Networks and testnets", url: "https://ethereum.org/developers/docs/networks/" } }
        ]
      },
      {
        title: "5. Sécurité et bonnes pratiques", titleEn: "5. Security and best practices",
        items: [
          { label: "Vulnérabilités courantes : reentrancy, overflow, front-running", labelEn: "Common vulnerabilities: reentrancy, overflow, front-running", level: "core", resource: { label: "Ethereum.org - Sécurité des smart contracts", labelEn: "Ethereum.org - Smart contract security", url: "https://ethereum.org/developers/docs/smart-contracts/security/" } },
          { label: "Optimisation du gas (coût des transactions)", labelEn: "Gas optimization (transaction costs)", level: "core", resource: { label: "Ethereum.org - Gas et frais", labelEn: "Ethereum.org - Gas and fees", url: "https://ethereum.org/developers/docs/gas/" } },
          { label: "Tests automatisés des smart contracts (Hardhat/Foundry tests)", labelEn: "Automated smart contract testing (Hardhat/Foundry tests)", level: "core", resource: { label: "Foundry Book - Écrire des tests", labelEn: "Foundry Book - Writing tests", url: "https://www.getfoundry.sh/forge/testing" } },
          { label: "Audits de sécurité et outils (Slither, MythX)", labelEn: "Security audits and tools (Slither, MythX)", level: "option", resource: { label: "Slither (Trail of Bits) - GitHub", labelEn: "Slither (Trail of Bits) - GitHub", url: "https://github.com/crytic/slither" } }
        ]
      },
      {
        title: "6. Écosystème togolais", titleEn: "6. Togolese ecosystem",
        items: [
          { label: "Domaine encore émergent au Togo, communauté naissante autour des événements GDG Lomé et DevFest", labelEn: "Still an emerging field in Togo, with a budding community around GDG Lomé and DevFest events", level: "core", resource: { label: "GDG Lomé - Communauté Google Developer Groups", labelEn: "GDG Lomé - Google Developer Groups community", url: "https://gdg.community.dev/gdg-lome/" } }
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
    titleEn: "Digital Marketing",
    subtitle: "Développer la présence et l'audience d'une marque en ligne",
    subtitleEn: "Growing a brand's online presence and audience",
    icon: "megaphone",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "SEO (référencement naturel) : recherche de mots-clés, on-page/off-page", labelEn: "SEO (search engine optimization): keyword research, on-page/off-page", level: "core" },
          { label: "SEM et stratégie de contenu", labelEn: "SEM and content strategy", level: "core" },
          { label: "Marketing funnel : notoriété, considération, conversion, fidélisation", labelEn: "Marketing funnel: awareness, consideration, conversion, retention", level: "core" },
          { label: "Bases de copywriting publicitaire", labelEn: "Advertising copywriting basics", level: "option" }
        ]
      },
      {
        title: "2. Publicité en ligne", titleEn: "2. Online advertising",
        items: [
          { label: "Meta Ads", labelEn: "Meta Ads", level: "core", resource: { label: "Meta Business Help Center", labelEn: "Meta Business Help Center", url: "https://www.facebook.com/business/help" } },
          { label: "Google Ads", labelEn: "Google Ads", level: "core", resource: { label: "Centre d'aide Google Ads", labelEn: "Google Ads Help Center", url: "https://support.google.com/google-ads" } },
          { label: "TikTok Ads", labelEn: "TikTok Ads", level: "option" },
          { label: "Ciblage d'audience et retargeting", labelEn: "Audience targeting and retargeting", level: "core" }
        ]
      },
      {
        title: "3. Analytics", titleEn: "3. Analytics",
        items: [
          { label: "Google Analytics, tableaux de bord de performance", labelEn: "Google Analytics, performance dashboards", level: "core", resource: { label: "Centre d'aide Google Analytics", labelEn: "Google Analytics Help Center", url: "https://support.google.com/analytics" } },
          { label: "Outils SEO (SEMrush, Ahrefs, Google Search Console)", labelEn: "SEO tools (SEMrush, Ahrefs, Google Search Console)", level: "option" }
        ]
      },
      {
        title: "4. Email marketing", titleEn: "4. Email marketing",
        items: [
          { label: "Campagnes et automatisation", labelEn: "Campaigns and automation", level: "option" },
          { label: "Segmentation de liste et personnalisation des envois", labelEn: "List segmentation and personalized sends", level: "option" },
          { label: "Outils d'envoi (Mailchimp, Brevo, Buttondown)", labelEn: "Sending tools (Mailchimp, Brevo, Buttondown)", level: "option" }
        ]
      },
      {
        title: "5. Influence et affiliation", titleEn: "5. Influencer and affiliate marketing",
        items: [
          { label: "Collaboration avec des micro-influenceurs locaux", labelEn: "Working with local micro-influencers", level: "option" },
          { label: "Marketing d'affiliation", labelEn: "Affiliate marketing", level: "option" }
        ]
      },
      {
        title: "6. Écosystème togolais", titleEn: "6. Togolese ecosystem",
        items: [
          { label: "Djanta Academy et CUBE : formations entrepreneuriat et compétences numériques", labelEn: "Djanta Academy and CUBE: entrepreneurship and digital skills training", level: "core" }
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
    titleEn: "Community Manager",
    subtitle: "Animer et développer une communauté de marque sur les réseaux sociaux",
    subtitleEn: "Growing and animating a brand community on social media",
    icon: "message",
    sections: [
      {
        title: "1. Stratégie de contenu", titleEn: "1. Content strategy",
        items: [
          { label: "Ligne éditoriale, calendrier de publication", labelEn: "Editorial line, publishing calendar", level: "core" },
          { label: "Création de visuels et vidéos courtes (Canva, CapCut)", labelEn: "Creating visuals and short videos (Canva, CapCut)", level: "core" }
        ]
      },
      {
        title: "2. Gestion des réseaux sociaux", titleEn: "2. Social media management",
        items: [
          { label: "Facebook, Instagram, LinkedIn, TikTok", labelEn: "Facebook, Instagram, LinkedIn, TikTok", level: "core" },
          { label: "Outils de planification (Meta Business Suite, Buffer, Hootsuite)", labelEn: "Scheduling tools (Meta Business Suite, Buffer, Hootsuite)", level: "option" },
          { label: "Compréhension des algorithmes et bonnes pratiques par plateforme", labelEn: "Understanding algorithms and best practices for each platform", level: "option" }
        ]
      },
      {
        title: "3. Animation de communauté", titleEn: "3. Community management",
        items: [
          { label: "Modération, gestion de crise", labelEn: "Moderation, crisis management", level: "core" },
          { label: "Charte de communauté et bonnes pratiques de modération", labelEn: "Community charter and moderation best practices", level: "option" },
          { label: "Collaboration avec créateurs de contenu (UGC, micro-influenceurs)", labelEn: "Working with content creators (UGC, micro-influencers)", level: "option" }
        ]
      },
      {
        title: "4. Analyse de performance", titleEn: "4. Performance analysis",
        items: [
          { label: "Indicateurs d'engagement (portée, taux d'interaction)", labelEn: "Engagement metrics (reach, interaction rate)", level: "core" },
          { label: "Reporting mensuel et ajustement de la stratégie selon les résultats", labelEn: "Monthly reporting and adjusting the strategy based on results", level: "option" }
        ]
      },
      {
        title: "5. Publicité et budget", titleEn: "5. Advertising and budget",
        items: [
          { label: "Bases des publicités payantes (Meta Ads, TikTok Ads)", labelEn: "Paid advertising basics (Meta Ads, TikTok Ads)", level: "option" },
          { label: "Gestion d'un budget de contenu sponsorisé (boost de publications)", labelEn: "Managing a sponsored content budget (boosting posts)", level: "option" }
        ]
      },
      {
        title: "6. Écosystème togolais", titleEn: "6. Togolese ecosystem",
        items: [
          { label: "Djanta Academy et CUBE : formations numériques accessibles", labelEn: "Djanta Academy and CUBE: accessible digital training", level: "core" },
          { label: "Réseau LinkedIn Local Togo : communauté active pour le networking professionnel", labelEn: "LinkedIn Local Togo network: an active community for professional networking", level: "option" }
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
    titleEn: "IT Trainer",
    subtitle: "Transmettre des compétences numériques à des apprenants",
    subtitleEn: "Passing on digital skills to learners",
    icon: "book-open",
    sections: [
      {
        title: "1. Pédagogie", titleEn: "1. Teaching",
        items: [
          { label: "Conception de programme de formation (méthode ADDIE)", labelEn: "Designing a training program (ADDIE method)", level: "core" },
          { label: "Modèle SAM (Successive Approximation Model) et taxonomie de Bloom", labelEn: "SAM model (Successive Approximation Model) and Bloom's taxonomy", level: "option" },
          { label: "Principes d'andragogie (apprentissage des adultes)", labelEn: "Principles of andragogy (adult learning)", level: "option" },
          { label: "Pédagogie par projet et mise en pratique", labelEn: "Project-based learning and hands-on practice", level: "core" },
          { label: "Gestion de groupe et dynamique de classe (niveaux hétérogènes)", labelEn: "Group management and classroom dynamics (mixed levels)", level: "core" }
        ]
      },
      {
        title: "2. Expertise technique", titleEn: "2. Technical expertise",
        items: [
          { label: "Maîtrise approfondie du domaine enseigné", labelEn: "In-depth mastery of the subject taught", level: "core" },
          { label: "Veille technologique continue pour garder ses cours à jour", labelEn: "Ongoing technology watch to keep courses up to date", level: "core" },
          { label: "Création de supports pédagogiques (slides, exercices, projets fil rouge)", labelEn: "Creating teaching materials (slides, exercises, running projects)", level: "core" }
        ]
      },
      {
        title: "3. Outils pédagogiques", titleEn: "3. Teaching tools",
        items: [
          { label: "Plateformes e-learning (Moodle)", labelEn: "E-learning platforms (Moodle)", level: "core", resource: { label: "Documentation Moodle", labelEn: "Moodle documentation", url: "https://docs.moodle.org/" } },
          { label: "Outils de création de contenu interactif (Canva, H5P, Genially)", labelEn: "Interactive content creation tools (Canva, H5P, Genially)", level: "option" },
          { label: "Animation de formations à distance et hybrides", labelEn: "Running remote and hybrid training sessions", level: "option" }
        ]
      },
      {
        title: "4. Évaluation", titleEn: "4. Assessment",
        items: [
          { label: "Évaluation des acquis des apprenants (quiz, projets, certifications)", labelEn: "Assessing learners' skills (quizzes, projects, certifications)", level: "core" },
          { label: "Certification des acquis (badges numériques, certificats internes)", labelEn: "Certifying skills (digital badges, internal certificates)", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais", titleEn: "5. Togolese ecosystem",
        items: [
          { label: "IAI-Togo, ESGIS, HETEC et Djanta Academy : structures employant des formateurs en informatique", labelEn: "IAI-Togo, ESGIS, HETEC and Djanta Academy: organizations that employ computer science trainers", level: "core" },
          { label: "Programme national de formation en IA, programmation et anglais : gros besoin de formateurs à l'échelle nationale", labelEn: "National training program in AI, programming and English: a large nationwide need for trainers", level: "option", resource: { label: "numerique.gouv.tg", labelEn: "numerique.gouv.tg", url: "https://numerique.gouv.tg/projets/programme-national-de-formation-en-intelligence-artificielle-en-programmation-informatique-et-en-anglais" } }
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
    titleEn: "Digital Transformation Consultant",
    subtitle: "Accompagner les organisations dans leur passage au numérique",
    subtitleEn: "Guiding organizations through their shift to digital",
    icon: "shuffle",
    sections: [
      {
        title: "1. Diagnostic", titleEn: "1. Assessment",
        items: [
          { label: "Audit de maturité digitale d'une organisation", labelEn: "Digital maturity audit of an organization", level: "core" },
          { label: "Cartographie des processus existants (as-is) avant transformation", labelEn: "Mapping existing processes (as-is) before the transformation", level: "core" }
        ]
      },
      {
        title: "2. Stratégie", titleEn: "2. Strategy",
        items: [
          { label: "Feuille de route de transformation digitale", labelEn: "Digital transformation roadmap", level: "core" },
          { label: "Automatisation des processus métier (RPA)", labelEn: "Business process automation (RPA)", level: "option" },
          { label: "Stratégie de migration vers le cloud", labelEn: "Cloud migration strategy", level: "option" },
          { label: "Business case et calcul de retour sur investissement (ROI)", labelEn: "Business case and return on investment (ROI) calculation", level: "core" }
        ]
      },
      {
        title: "3. Conduite du changement", titleEn: "3. Change management",
        items: [
          { label: "Accompagnement des équipes, formation interne", labelEn: "Supporting teams, internal training", level: "core" },
          { label: "Modèles de gestion du changement (Kotter, ADKAR)", labelEn: "Change management models (Kotter, ADKAR)", level: "option" },
          { label: "Obtention du soutien de la direction (sponsorship exécutif)", labelEn: "Securing management support (executive sponsorship)", level: "core" },
          { label: "Gestion de la résistance au changement", labelEn: "Managing resistance to change", level: "option" }
        ]
      },
      {
        title: "4. Gouvernance IT", titleEn: "4. IT governance",
        items: [
          { label: "Choix technologiques, priorisation des investissements", labelEn: "Technology choices, prioritizing investments", level: "core" },
          { label: "Mise en place d'indicateurs de suivi de la transformation (KPI)", labelEn: "Setting up indicators to track the transformation (KPIs)", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais", titleEn: "5. Togolese ecosystem",
        items: [
          { label: "Djanta Tech Hub et CUBE : contexte institutionnel de la transformation numérique togolaise", labelEn: "Djanta Tech Hub and CUBE: the institutional context of Togo's digital transformation", level: "core" },
          { label: "Agence Togo Digital : pilote de la stratégie de digitalisation de l'État togolais", labelEn: "Togo Digital Agency: leads the Togolese State's digitalization strategy", level: "option", resource: { label: "digital.gouv.tg", labelEn: "digital.gouv.tg", url: "https://digital.gouv.tg" } }
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
    titleEn: "Data Engineer",
    subtitle: "Construire les pipelines qui collectent, transforment et livrent la donnée",
    subtitleEn: "Building the pipelines that collect, transform and deliver data",
    icon: "tool",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "SQL avancé et modélisation de données", labelEn: "Advanced SQL and data modeling", level: "core", resource: { label: "Voir roadmap compétence SQL", labelEn: "See the SQL skill roadmap", url: "roadmap.html?id=sql" } },
          { label: "Python pour le traitement de données", labelEn: "Python for data processing", level: "core", resource: { label: "Voir roadmap compétence Python", labelEn: "See the Python skill roadmap", url: "roadmap.html?id=python" } },
          { label: "Modélisation dimensionnelle : schéma en étoile, schéma en flocon", labelEn: "Dimensional modeling: star schema, snowflake schema", level: "core" }
        ]
      },
      {
        title: "2. Pipelines de données", titleEn: "2. Data pipelines",
        items: [
          { label: "ETL / ELT : extraction, transformation, chargement", labelEn: "ETL / ELT: extract, transform, load", level: "core" },
          { label: "Orchestration : Apache Airflow", labelEn: "Orchestration: Apache Airflow", level: "core", resource: { label: "Documentation Apache Airflow", labelEn: "Apache Airflow documentation", url: "https://airflow.apache.org/docs/" } },
          { label: "Traitement par lots (batch) vs streaming", labelEn: "Batch vs streaming processing", level: "core" },
          { label: "Traitement distribué : Apache Spark", labelEn: "Distributed processing: Apache Spark", level: "option" },
          { label: "Streaming temps réel : Apache Kafka", labelEn: "Real-time streaming: Apache Kafka", level: "option" },
          { label: "Transformation en SQL versionnée : dbt", labelEn: "Version-controlled SQL transformations: dbt", level: "option" }
        ]
      },
      {
        title: "3. Stockage", titleEn: "3. Storage",
        items: [
          { label: "Data warehouse (BigQuery, Redshift, Snowflake)", labelEn: "Data warehouse (BigQuery, Redshift, Snowflake)", level: "core" },
          { label: "Data lake et architecture lakehouse (Delta Lake, Iceberg)", labelEn: "Data lake and lakehouse architecture (Delta Lake, Iceberg)", level: "option" },
          { label: "Bases NoSQL et systèmes distribués", labelEn: "NoSQL databases and distributed systems", level: "option" }
        ]
      },
      {
        title: "4. Qualité et gouvernance", titleEn: "4. Quality and governance",
        items: [
          { label: "Qualité de données, tests et monitoring de pipelines", labelEn: "Data quality, pipeline testing and monitoring", level: "core" },
          { label: "Outils de validation de données (Great Expectations)", labelEn: "Data validation tools (Great Expectations)", level: "option" },
          { label: "Gouvernance et confidentialité des données (RGPD, catalogues de données)", labelEn: "Data governance and privacy (GDPR, data catalogs)", level: "option" }
        ]
      },
      {
        title: "5. Cloud et infrastructure", titleEn: "5. Cloud and infrastructure",
        items: [
          { label: "Services de données cloud", labelEn: "Cloud data services", level: "core", resource: { label: "Voir roadmap compétence Cloud", labelEn: "See the Cloud skill roadmap", url: "roadmap.html?id=cloud" } },
          { label: "Conteneurisation des pipelines (Docker)", labelEn: "Containerizing pipelines (Docker)", level: "option", resource: { label: "Voir roadmap compétence Docker", labelEn: "See the Docker skill roadmap", url: "roadmap.html?id=docker" } },
          { label: "Infrastructure as Code (Terraform)", labelEn: "Infrastructure as Code (Terraform)", level: "option", resource: { label: "Voir roadmap compétence Terraform", labelEn: "See the Terraform skill roadmap", url: "roadmap.html?id=terraform" } }
        ]
      },
      {
        title: "6. Écosystème togolais", titleEn: "6. Togolese ecosystem",
        items: [
          { label: "Postes réels observés sur le marché togolais (Data Engineer, apprentissage ou senior)", labelEn: "Actual job openings seen on the Togolese market (Data Engineer, apprenticeship or senior)", level: "core" },
          { label: "PyCon Togo : communauté Python pertinente pour ce métier", labelEn: "PyCon Togo: a Python community relevant to this job", level: "option", resource: { label: "pycontg.pytogo.org", labelEn: "pycontg.pytogo.org", url: "https://pycontg.pytogo.org/" } }
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
    titleEn: "Database Administrator (DBA)",
    subtitle: "Garantir la performance, la disponibilité et la sécurité des bases de données",
    subtitleEn: "Ensuring the performance, availability and security of databases",
    icon: "database",
    sections: [
      {
        title: "1. Fondamentaux SQL", titleEn: "1. SQL fundamentals",
        items: [
          { label: "Modélisation, index, transactions", labelEn: "Modeling, indexes, transactions", level: "core", resource: { label: "Voir roadmap compétence SQL", labelEn: "See the SQL skill roadmap", url: "roadmap.html?id=sql" } }
        ]
      },
      {
        title: "2. Administration", titleEn: "2. Administration",
        items: [
          { label: "Installation, configuration, mises à jour des SGBD (PostgreSQL, MySQL, Oracle, SQL Server)", labelEn: "Installing, configuring and updating DBMSs (PostgreSQL, MySQL, Oracle, SQL Server)", level: "core" },
          { label: "Gestion des utilisateurs et des droits d'accès", labelEn: "User and access rights management", level: "core" },
          { label: "Bases de données managées cloud (RDS, Cloud SQL)", labelEn: "Managed cloud databases (RDS, Cloud SQL)", level: "option" }
        ]
      },
      {
        title: "3. Performance", titleEn: "3. Performance",
        items: [
          { label: "Optimisation des requêtes et des index", labelEn: "Query and index optimization", level: "core" },
          { label: "Surveillance de la charge et des ressources", labelEn: "Monitoring load and resources", level: "core" }
        ]
      },
      {
        title: "4. Sauvegarde et reprise", titleEn: "4. Backup and recovery",
        items: [
          { label: "Politiques de sauvegarde et restauration", labelEn: "Backup and restore policies", level: "core" },
          { label: "Haute disponibilité et réplication", labelEn: "High availability and replication", level: "option" },
          { label: "Plan de reprise d'activité (PRA) et tests de restauration réels", labelEn: "Disaster recovery plan (DRP) and real restore tests", level: "option" }
        ]
      },
      {
        title: "5. Sécurité des données", titleEn: "5. Data security",
        items: [
          { label: "Chiffrement, audit d'accès", labelEn: "Encryption, access auditing", level: "core" }
        ]
      },
      {
        title: "6. Gouvernance et qualité des données", titleEn: "6. Data governance and quality",
        items: [
          { label: "Catalogue de données, métadonnées et documentation", labelEn: "Data catalog, metadata and documentation", level: "core" },
          { label: "Qualité des données : dédoublonnage, validation, cohérence", labelEn: "Data quality: deduplication, validation, consistency", level: "core" },
          { label: "Politiques de conformité et cycle de vie des données (rétention, archivage)", labelEn: "Compliance policies and data life cycle (retention, archiving)", level: "option" }
        ]
      },
      {
        title: "7. Écosystème togolais", titleEn: "7. Togolese ecosystem",
        items: [
          { label: "Profils DBA recherchés régulièrement sur les job boards togolais (SQL/NoSQL, big data)", labelEn: "DBA profiles regularly sought on Togolese job boards (SQL/NoSQL, big data)", level: "core" },
          { label: "ESGIS, Université de Lomé (CIC) : bases en gestion de données", labelEn: "ESGIS, University of Lomé (CIC): data management basics", level: "option" }
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
    titleEn: "Graphic Designer",
    subtitle: "Créer les visuels et supports de communication d'une marque",
    subtitleEn: "Creating a brand's visuals and communication materials",
    icon: "image",
    sections: [
      {
        title: "1. Fondamentaux du design graphique", titleEn: "1. Graphic design fundamentals",
        items: [
          { label: "Théorie des couleurs, typographie, composition", labelEn: "Color theory, typography, composition", level: "core" },
          { label: "Modes colorimétriques (RVB/CMJN) et résolution (DPI)", labelEn: "Color modes (RGB/CMYK) and resolution (DPI)", level: "core" }
        ]
      },
      {
        title: "2. Outils", titleEn: "2. Tools",
        items: [
          { label: "Adobe Photoshop et Illustrator", labelEn: "Adobe Photoshop and Illustrator", level: "core" },
          { label: "Canva pour la production rapide", labelEn: "Canva for quick production", level: "option" },
          { label: "Figma pour les visuels collaboratifs et web", labelEn: "Figma for collaborative and web visuals", level: "option", resource: { label: "Voir roadmap métier UX/UI Design", labelEn: "See the UX/UI Design career roadmap", url: "roadmap.html?id=ux-ui" } }
        ]
      },
      {
        title: "3. Production", titleEn: "3. Production",
        items: [
          { label: "Identité visuelle, logos, chartes graphiques", labelEn: "Visual identity, logos, brand guidelines", level: "core" },
          { label: "Supports imprimés : flyers, roll-ups, affiches (gestion du fond perdu)", labelEn: "Print materials: flyers, roll-up banners, posters (handling bleed)", level: "core" },
          { label: "Visuels pour réseaux sociaux", labelEn: "Social media visuals", level: "core" },
          { label: "Constitution d'un portfolio professionnel", labelEn: "Building a professional portfolio", level: "core" }
        ]
      },
      {
        title: "4. Vidéo et montage", titleEn: "4. Video and editing",
        items: [
          { label: "Montage vidéo de base pour supports digitaux", labelEn: "Basic video editing for digital media", level: "option" },
          { label: "Motion design simple (After Effects, Canva)", labelEn: "Simple motion design (After Effects, Canva)", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais", titleEn: "5. Togolese ecosystem",
        items: [
          { label: "Poste fréquemment demandé combiné avec webmaster ou community management dans les PME togolaises", labelEn: "A role often requested in combination with webmaster or community management in Togolese SMEs", level: "core" }
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
    titleEn: "Webmaster",
    subtitle: "Gérer et maintenir un site web au quotidien",
    subtitleEn: "Managing and maintaining a website day to day",
    icon: "sliders",
    sections: [
      {
        title: "1. Gestion de site", titleEn: "1. Site management",
        items: [
          { label: "WordPress : installation, thèmes, plugins", labelEn: "WordPress: installation, themes, plugins", level: "core", resource: { label: "Documentation WordPress", labelEn: "WordPress documentation", url: "https://wordpress.org/documentation/" } },
          { label: "Mises à jour et maintenance courante", labelEn: "Updates and routine maintenance", level: "core" },
          { label: "Gestion multi-sites et environnements de test (staging)", labelEn: "Multisite management and test environments (staging)", level: "option" }
        ]
      },
      {
        title: "2. Contenu", titleEn: "2. Content",
        items: [
          { label: "Rédaction et publication de contenu web", labelEn: "Writing and publishing web content", level: "core" },
          { label: "Bases SEO pour le référencement", labelEn: "SEO basics for search rankings", level: "core" },
          { label: "Google Analytics / Search Console pour suivre le trafic", labelEn: "Google Analytics / Search Console to track traffic", level: "core" },
          { label: "Optimisation des images et des temps de chargement", labelEn: "Optimizing images and load times", level: "option" }
        ]
      },
      {
        title: "3. Technique de base", titleEn: "3. Technical basics",
        items: [
          { label: "HTML/CSS de base pour les ajustements", labelEn: "Basic HTML/CSS for adjustments", level: "core", resource: { label: "Voir roadmap compétence JavaScript", labelEn: "See the JavaScript skill roadmap", url: "roadmap.html?id=javascript" } },
          { label: "Certificat SSL/HTTPS et nom de domaine", labelEn: "SSL/HTTPS certificate and domain name", level: "core" },
          { label: "Sauvegarde et sécurité du site", labelEn: "Site backup and security", level: "core" },
          { label: "Surveillance de la disponibilité (uptime monitoring)", labelEn: "Uptime monitoring", level: "option" },
          { label: "Diagnostic de base des pannes courantes (erreur 500, site lent, plugin en conflit)", labelEn: "Basic troubleshooting of common issues (500 error, slow site, conflicting plugin)", level: "option" }
        ]
      },
      {
        title: "4. Écosystème togolais", titleEn: "4. Togolese ecosystem",
        items: [
          { label: "Rôle courant dans les PME togolaises, souvent combiné avec design graphique et gestion des réseaux sociaux", labelEn: "A common role in Togolese SMEs, often combined with graphic design and social media management", level: "core" },
          { label: "Go Africa Online et Wiijob : plateformes locales où ce profil est recherché", labelEn: "Go Africa Online and Wiijob: local platforms where this profile is in demand", level: "option" }
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
    titleEn: "E-commerce Manager",
    subtitle: "Piloter une boutique en ligne, de la mise en rayon à la vente",
    subtitleEn: "Running an online store, from listing products to closing sales",
    icon: "cart",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Plateformes e-commerce : Shopify, WooCommerce", labelEn: "E-commerce platforms: Shopify, WooCommerce", level: "core", resource: { label: "Documentation WooCommerce", labelEn: "WooCommerce documentation", url: "https://woocommerce.com/documentation/" } },
          { label: "Choix de plateforme selon le volume et le budget", labelEn: "Choosing a platform based on volume and budget", level: "option" }
        ]
      },
      {
        title: "2. Catalogue et opérations", titleEn: "2. Catalog and operations",
        items: [
          { label: "Gestion du catalogue produits, fiches produits", labelEn: "Product catalog management, product pages", level: "core" },
          { label: "Gestion des commandes, des stocks et de la logistique", labelEn: "Order, inventory and logistics management", level: "core" },
          { label: "Politique de retours et service client", labelEn: "Returns policy and customer service", level: "option" },
          { label: "Livraison locale et suivi de colis (dernier kilomètre)", labelEn: "Local delivery and parcel tracking (last mile)", level: "option" }
        ]
      },
      {
        title: "3. Paiement", titleEn: "3. Payment",
        items: [
          { label: "Intégration des paiements mobiles (Flooz, Mixx by Yas, Mobile Money)", labelEn: "Integrating mobile payments (Flooz, Mixx by Yas, Mobile Money)", level: "core", note: "Essentiel pour le marché togolais.", noteEn: "Essential for the Togolese market." },
          { label: "Sécurité des transactions en ligne (notions PCI-DSS)", labelEn: "Online transaction security (PCI-DSS basics)", level: "option" },
          { label: "Gestion des fraudes et des litiges de paiement", labelEn: "Handling fraud and payment disputes", level: "option" }
        ]
      },
      {
        title: "4. Acquisition et conversion", titleEn: "4. Acquisition and conversion",
        items: [
          { label: "Marketing digital appliqué à l'e-commerce", labelEn: "Digital marketing applied to e-commerce", level: "core", resource: { label: "Voir roadmap métier Marketing Digital", labelEn: "See the Digital Marketing career roadmap", url: "roadmap.html?id=marketing-digital" } },
          { label: "Optimisation du taux de conversion (réduction de l'abandon de panier)", labelEn: "Conversion rate optimization (reducing cart abandonment)", level: "option" },
          { label: "Vente multicanale (site propre, marketplaces, réseaux sociaux)", labelEn: "Multichannel selling (own site, marketplaces, social media)", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais", titleEn: "5. Togolese ecosystem",
        items: [
          { label: "Catégorie e-commerce active sur les job boards togolais", labelEn: "An active e-commerce category on Togolese job boards", level: "core" },
          { label: "Djanta Start et CUBE : accompagnement de projets e-commerce", labelEn: "Djanta Start and CUBE: support for e-commerce projects", level: "option" }
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
    titleEn: "IT Manager / CIO",
    subtitle: "Piloter la stratégie et les ressources informatiques d'une organisation",
    subtitleEn: "Steering an organization's IT strategy and resources",
    icon: "briefcase",
    sections: [
      {
        title: "1. Vision stratégique", titleEn: "1. Strategic vision",
        items: [
          { label: "Alignement de la stratégie IT avec les objectifs de l'organisation", labelEn: "Aligning IT strategy with the organization's goals", level: "core" },
          { label: "Gestion du budget informatique", labelEn: "IT budget management", level: "core" },
          { label: "Cadres de gouvernance IT (COBIT, ITIL)", labelEn: "IT governance frameworks (COBIT, ITIL)", level: "option" },
          { label: "Gestion des fournisseurs et des contrats (vendor management)", labelEn: "Supplier and contract management (vendor management)", level: "option" }
        ]
      },
      {
        title: "2. Management d'équipe", titleEn: "2. Team management",
        items: [
          { label: "Encadrement des équipes techniques (dev, infra, support)", labelEn: "Leading technical teams (dev, infrastructure, support)", level: "core" },
          { label: "Recrutement et montée en compétence des équipes IT", labelEn: "Recruiting and upskilling IT teams", level: "option" }
        ]
      },
      {
        title: "3. Infrastructure et sécurité", titleEn: "3. Infrastructure and security",
        items: [
          { label: "Supervision de l'infrastructure et des systèmes d'information", labelEn: "Overseeing infrastructure and information systems", level: "core", resource: { label: "Voir roadmap métier Administrateur Systèmes et Réseaux", labelEn: "See the Systems and Network Administrator career roadmap", url: "roadmap.html?id=sysadmin" } },
          { label: "Gouvernance de la cybersécurité", labelEn: "Cybersecurity governance", level: "core", resource: { label: "Voir roadmap métier Cybersécurité & Réseaux", labelEn: "See the Cybersecurity & Networks career roadmap", url: "roadmap.html?id=cyber" } },
          { label: "Continuité de service et plan de reprise d'activité", labelEn: "Service continuity and disaster recovery plan", level: "option" }
        ]
      },
      {
        title: "4. Gestion de projets", titleEn: "4. Project management",
        items: [
          { label: "Pilotage de projets de transformation numérique", labelEn: "Leading digital transformation projects", level: "core", resource: { label: "Voir roadmap métier Chef de Projet IT", labelEn: "See the IT Project Manager career roadmap", url: "roadmap.html?id=project-manager" } },
          { label: "Arbitrage entre développement interne et solutions externes (build vs buy)", labelEn: "Choosing between in-house development and external solutions (build vs buy)", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais", titleEn: "5. Togolese ecosystem",
        items: [
          { label: "Poste recherché régulièrement via des cabinets comme AfricaWork au Togo", labelEn: "A role regularly recruited through firms such as AfricaWork in Togo", level: "core" },
          { label: "Accessible généralement après plusieurs années d'expérience technique", labelEn: "Usually reached after several years of technical experience", level: "option" }
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
    titleEn: "Industrial Computing Engineer",
    subtitle: "Automatiser et superviser les processus industriels",
    subtitleEn: "Automating and supervising industrial processes",
    icon: "settings",
    sections: [
      {
        title: "1. Automatisation", titleEn: "1. Automation",
        items: [
          { label: "Automates programmables industriels (API/PLC), norme IEC 61131-3", labelEn: "Programmable logic controllers (PLC), IEC 61131-3 standard", level: "core" },
          { label: "Capteurs et actionneurs", labelEn: "Sensors and actuators", level: "core" },
          { label: "Interfaces homme-machine (IHM/HMI)", labelEn: "Human-machine interfaces (HMI)", level: "core" }
        ]
      },
      {
        title: "2. Supervision", titleEn: "2. Supervision",
        items: [
          { label: "Systèmes SCADA de supervision industrielle", labelEn: "SCADA industrial supervision systems", level: "core" },
          { label: "Historisation des données de production (data historian)", labelEn: "Production data historization (data historian)", level: "option" }
        ]
      },
      {
        title: "3. Réseaux industriels et sécurité", titleEn: "3. Industrial networks and security",
        items: [
          { label: "Protocoles industriels (Modbus, Profibus)", labelEn: "Industrial protocols (Modbus, Profibus)", level: "core" },
          { label: "Protocole industriel Ethernet/IP", labelEn: "EtherNet/IP industrial protocol", level: "option" },
          { label: "Notions réseaux classiques", labelEn: "Standard networking basics", level: "option", resource: { label: "Voir roadmap compétence Réseaux", labelEn: "See the Networking skill roadmap", url: "roadmap.html?id=reseaux" } },
          { label: "Cybersécurité des systèmes industriels (OT security)", labelEn: "Industrial control system cybersecurity (OT security)", level: "option" }
        ]
      },
      {
        title: "4. Programmation", titleEn: "4. Programming",
        items: [
          { label: "Programmation bas niveau et systèmes embarqués", labelEn: "Low-level programming and embedded systems", level: "core", resource: { label: "Voir roadmap métier Ingénieur IoT / Systèmes Embarqués", labelEn: "See the IoT / Embedded Systems Engineer career roadmap", url: "roadmap.html?id=iot-embarque" } },
          { label: "Langages de programmation d'automates (Ladder, Grafcet, Structured Text)", labelEn: "PLC programming languages (Ladder, Grafcet, Structured Text)", level: "core" }
        ]
      },
      {
        title: "5. Maintenance", titleEn: "5. Maintenance",
        items: [
          { label: "Maintenance préventive et curative des équipements automatisés", labelEn: "Preventive and corrective maintenance of automated equipment", level: "core" },
          { label: "Diagnostic de panne sur ligne de production", labelEn: "Troubleshooting on a production line", level: "option" }
        ]
      },
      {
        title: "6. Écosystème togolais", titleEn: "6. Togolese ecosystem",
        items: [
          { label: "Postes réguliers via AfricaWork Togo (Ingénieur et Technicien en Informatique Industrielle)", labelEn: "Regular openings via AfricaWork Togo (Industrial Computing Engineer and Technician)", level: "core" },
          { label: "Filière disponible à HEST et à l'Institut Bakpessi (Informatique Industrielle), ainsi qu'à l'ISBIC-ALG (Automatique et Informatique Industrielle)", labelEn: "Program available at HEST and the Bakpessi Institute (Industrial Computing), and at ISBIC-ALG (Automation and Industrial Computing)", level: "option" }
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
    titleEn: "CISO / Information Systems Security Manager",
    subtitle: "Piloter la stratégie de cybersécurité et la gestion des risques d'une organisation",
    subtitleEn: "Steering an organization's cybersecurity strategy and risk management",
    icon: "shield",
    sections: [
      {
        title: "1. Bases techniques", titleEn: "1. Technical foundations",
        items: [
          { label: "Solide culture cybersécurité et réseaux", labelEn: "A solid grounding in cybersecurity and networks", level: "core", resource: { label: "Voir roadmap métier Cybersécurité & Réseaux", labelEn: "See the Cybersecurity & Networks career roadmap", url: "roadmap.html?id=cyber" } }
        ]
      },
      {
        title: "2. Gouvernance", titleEn: "2. Governance",
        items: [
          { label: "Politique de sécurité des systèmes d'information (PSSI)", labelEn: "Information systems security policy (ISSP)", level: "core" },
          { label: "Normes ISO 27001, cadre NIST Cybersecurity Framework", labelEn: "ISO 27001 standards, NIST Cybersecurity Framework", level: "core" },
          { label: "Gestion des risques (ISO 27005) : identification, traitement, acceptation", labelEn: "Risk management (ISO 27005): identification, treatment, acceptance", level: "core" },
          { label: "Programmes de sensibilisation à la sécurité pour les employés", labelEn: "Security awareness programs for employees", level: "core" },
          { label: "Reporting à la direction : indicateurs (KPI) et tableaux de bord sécurité", labelEn: "Reporting to management: security indicators (KPIs) and dashboards", level: "option" }
        ]
      },
      {
        title: "3. Conformité", titleEn: "3. Compliance",
        items: [
          { label: "Loi n°2018-026 sur la cybersécurité et la cybercriminalité (Togo)", labelEn: "Law no. 2018-026 on cybersecurity and cybercrime (Togo)", level: "core", resource: { label: "ancy.gouv.tg", labelEn: "ancy.gouv.tg", url: "https://ancy.gouv.tg/" } },
          { label: "Protection des données personnelles", labelEn: "Personal data protection", level: "core" },
          { label: "Gestion des fournisseurs et des risques tiers (audits, contrats)", labelEn: "Supplier and third-party risk management (audits, contracts)", level: "option" }
        ]
      },
      {
        title: "4. Gestion de crise", titleEn: "4. Crisis management",
        items: [
          { label: "Plan de réponse aux incidents", labelEn: "Incident response plan", level: "core" },
          { label: "Plan de continuité d'activité (PCA) et de reprise après sinistre", labelEn: "Business continuity plan (BCP) and disaster recovery", level: "core" },
          { label: "Coordination avec un CERT/CSIRT", labelEn: "Coordinating with a CERT/CSIRT", level: "option", note: "Au Togo, coordination possible avec CERT.tg.", noteEn: "In Togo, coordination is possible with CERT.tg." }
        ]
      },
      {
        title: "5. Écosystème togolais", titleEn: "5. Togolese ecosystem",
        items: [
          { label: "Poste réel recherché au Togo (ex. BostonSolux Togo)", labelEn: "An actual role recruited in Togo (e.g. BostonSolux Togo)", level: "core" },
          { label: "ANCy et CERT.tg : interlocuteurs institutionnels de référence", labelEn: "ANCy and CERT.tg: the main institutional contacts", level: "core", resource: { label: "cert.tg", labelEn: "cert.tg", url: "https://cert.tg/" } }
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
    titleEn: "Information Systems Security Auditor",
    subtitle: "Évaluer la conformité et les vulnérabilités des systèmes d'une organisation",
    subtitleEn: "Assessing an organization's systems for compliance and vulnerabilities",
    icon: "search",
    sections: [
      {
        title: "1. Bases techniques", titleEn: "1. Technical foundations",
        items: [
          { label: "Réseaux, systèmes et sécurité applicative", labelEn: "Networks, systems and application security", level: "core", resource: { label: "Voir roadmap métier Cybersécurité & Réseaux", labelEn: "See the Cybersecurity & Networks career roadmap", url: "roadmap.html?id=cyber" } }
        ]
      },
      {
        title: "2. Méthodologie d'audit", titleEn: "2. Audit methodology",
        items: [
          { label: "Audit organisationnel et technique", labelEn: "Organizational and technical audit", level: "core" },
          { label: "Cadrage de mission : périmètre, règles d'engagement", labelEn: "Engagement scoping: scope, rules of engagement", level: "core" },
          { label: "Tests d'intrusion dans un cadre d'audit", labelEn: "Penetration testing as part of an audit", level: "core" },
          { label: "Outils de scan de vulnérabilités (Nessus, OpenVAS)", labelEn: "Vulnerability scanning tools (Nessus, OpenVAS)", level: "option" }
        ]
      },
      {
        title: "3. Référentiels", titleEn: "3. Reference frameworks",
        items: [
          { label: "ISO 27001/27002, référentiels d'audit reconnus", labelEn: "ISO 27001/27002, recognized audit frameworks", level: "core" },
          { label: "Méthode d'analyse de risques EBIOS RM", labelEn: "EBIOS RM risk analysis method", level: "option" },
          { label: "PCI-DSS pour les audits liés aux paiements", labelEn: "PCI-DSS for payment-related audits", level: "option" }
        ]
      },
      {
        title: "4. Restitution", titleEn: "4. Reporting",
        items: [
          { label: "Rédaction de rapports d'audit et recommandations priorisées", labelEn: "Writing audit reports and prioritized recommendations", level: "core" },
          { label: "Suivi de la mise en œuvre des plans d'action correctifs", labelEn: "Following up on the implementation of corrective action plans", level: "option" }
        ]
      },
      {
        title: "5. Certifications", titleEn: "5. Certifications",
        items: [
          { label: "CISA (Certified Information Systems Auditor), ISACA : la certification de référence pour ce métier", labelEn: "CISA (Certified Information Systems Auditor), ISACA: the benchmark certification for this job", level: "core", resource: { label: "ISACA - Certification CISA", labelEn: "ISACA - CISA certification", url: "https://www.isaca.org/credentialing/cisa" } },
          { label: "CISSP ((ISC)²), pour les profils orientés sécurité globale", labelEn: "CISSP ((ISC)²), for profiles focused on overall security", level: "option" }
        ]
      },
      {
        title: "6. Écosystème togolais", titleEn: "6. Togolese ecosystem",
        items: [
          { label: "Cyber Defense Africa (Togo) : recrute régulièrement des auditeurs SSI", labelEn: "Cyber Defense Africa (Togo): regularly hires IS security auditors", level: "core" },
          { label: "ANCy : autorité nationale de référence en cybersécurité", labelEn: "ANCy: the national cybersecurity authority", level: "core", resource: { label: "ancy.gouv.tg", labelEn: "ancy.gouv.tg", url: "https://ancy.gouv.tg/" } }
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
    titleEn: "Enterprise Architect",
    subtitle: "Aligner les systèmes d'information sur la stratégie globale d'une organisation",
    subtitleEn: "Aligning information systems with an organization's overall strategy",
    icon: "landmark",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Différence architecture d'entreprise / architecture logicielle", labelEn: "Enterprise architecture vs software architecture", level: "core", resource: { label: "Voir roadmap métier Architecte Logiciel", labelEn: "See the Software Architect career roadmap", url: "roadmap.html?id=architecte-logiciel" } },
          { label: "Cartographie du système d'information", labelEn: "Mapping the information system", level: "core" }
        ]
      },
      {
        title: "2. Cadres méthodologiques", titleEn: "2. Methodological frameworks",
        items: [
          { label: "TOGAF ou cadres équivalents", labelEn: "TOGAF or equivalent frameworks", level: "core", resource: { label: "The Open Group - TOGAF", labelEn: "The Open Group - TOGAF", url: "https://www.opengroup.org/togaf" } },
          { label: "Notation de modélisation ArchiMate", labelEn: "ArchiMate modeling notation", level: "option" }
        ]
      },
      {
        title: "3. Alignement stratégique", titleEn: "3. Strategic alignment",
        items: [
          { label: "Traduction des besoins métier en architecture cible", labelEn: "Translating business needs into a target architecture", level: "core" },
          { label: "Modélisation des capacités métier (business capability mapping)", labelEn: "Business capability mapping", level: "option" },
          { label: "Feuille de route de transformation du SI", labelEn: "Information system transformation roadmap", level: "core" },
          { label: "Analyse d'impact des changements sur l'existant", labelEn: "Analyzing the impact of changes on existing systems", level: "option" }
        ]
      },
      {
        title: "4. Gouvernance", titleEn: "4. Governance",
        items: [
          { label: "Standards, urbanisation du SI, gestion des dépendances", labelEn: "Standards, IS urbanization, dependency management", level: "core" },
          { label: "Gestion du cycle de vie technologique (technology radar)", labelEn: "Technology life cycle management (technology radar)", level: "option" },
          { label: "Comités d'architecture et validation des choix techniques", labelEn: "Architecture boards and validation of technical choices", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais", titleEn: "5. Togolese ecosystem",
        items: [
          { label: "Poste confirmé à l'Agence Togo Digital (ATD), agence publique pilotant la transformation numérique de l'État", labelEn: "A confirmed role at the Togo Digital Agency (ATD), the public agency leading the State's digital transformation", level: "core" },
          { label: "Rôle senior, généralement accessible après plusieurs années en architecture logicielle ou conseil IT", labelEn: "A senior role, usually reached after several years in software architecture or IT consulting", level: "option" }
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
    titleEn: "IT Lawyer / Digital Law",
    subtitle: "Sécuriser juridiquement les projets technologiques et la conformité numérique",
    subtitleEn: "Providing legal security for tech projects and digital compliance",
    icon: "scale",
    sections: [
      {
        title: "1. Fondamentaux juridiques", titleEn: "1. Legal fundamentals",
        items: [
          { label: "Droit des contrats appliqué à l'IT", labelEn: "Contract law applied to IT", level: "core" },
          { label: "Propriété intellectuelle et logicielle", labelEn: "Intellectual property and software", level: "core" },
          { label: "Responsabilité contractuelle en cas de défaillance logicielle", labelEn: "Contractual liability in case of software failure", level: "core" }
        ]
      },
      {
        title: "2. Protection des données", titleEn: "2. Data protection",
        items: [
          { label: "Protection des données personnelles : loi togolaise n°2019-014", labelEn: "Personal data protection: Togolese law no. 2019-014", level: "core", resource: { label: "Voir roadmap métier DPO", labelEn: "See the DPO career roadmap", url: "roadmap.html?id=dpo" } },
          { label: "Cadre légal togolais de la cybersécurité (loi n°2018-026)", labelEn: "Togolese legal framework for cybersecurity (law no. 2018-026)", level: "core", resource: { label: "ancy.gouv.tg", labelEn: "ancy.gouv.tg", url: "https://ancy.gouv.tg/" } },
          { label: "Collaboration avec l'IPDCP sur les dossiers de conformité", labelEn: "Working with the IPDCP on compliance matters", level: "option", resource: { label: "ipdcp.tg", labelEn: "ipdcp.tg", url: "https://ipdcp.tg/" } }
        ]
      },
      {
        title: "3. Contrats et négociation", titleEn: "3. Contracts and negotiation",
        items: [
          { label: "Contrats de prestation IT, SLA, licences logicielles", labelEn: "IT service contracts, SLAs, software licenses", level: "core" },
          { label: "Licences open source et leurs implications juridiques", labelEn: "Open source licenses and their legal implications", level: "option" },
          { label: "Négociation des clauses de propriété intellectuelle et de transfert de compétences", labelEn: "Negotiating intellectual property and knowledge transfer clauses", level: "option" }
        ]
      },
      {
        title: "4. Conformité", titleEn: "4. Compliance",
        items: [
          { label: "Veille réglementaire numérique", labelEn: "Monitoring digital regulations", level: "core" },
          { label: "Notions de droit du commerce électronique (signature électronique, protection du consommateur)", labelEn: "E-commerce law basics (electronic signatures, consumer protection)", level: "option" },
          { label: "Audits de conformité et plans de remédiation", labelEn: "Compliance audits and remediation plans", level: "core" },
          { label: "Sensibilisation aux enjeux réglementaires de l'IA", labelEn: "Awareness of AI regulatory issues", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais", titleEn: "5. Togolese ecosystem",
        items: [
          { label: "Poste confirmé à l'Agence Togo Digital (ATD)", labelEn: "A confirmed role at the Togo Digital Agency (ATD)", level: "core" }
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
    titleEn: "Scrum Master",
    subtitle: "Faciliter l'application des méthodes agiles au sein d'une équipe produit",
    subtitleEn: "Facilitating agile practices within a product team",
    icon: "refresh",
    sections: [
      {
        title: "1. Fondamentaux Agile", titleEn: "1. Agile fundamentals",
        items: [
          { label: "Manifeste agile, cadre Scrum", labelEn: "Agile Manifesto, Scrum framework", level: "core", resource: { label: "Scrum.org - Ressources", labelEn: "Scrum.org - Resources", url: "https://www.scrum.org/resources" } },
          { label: "Rôles Scrum : Product Owner, équipe de développement", labelEn: "Scrum roles: Product Owner, development team", level: "core" }
        ]
      },
      {
        title: "2. Cérémonies", titleEn: "2. Ceremonies",
        items: [
          { label: "Sprint planning, daily, review, rétrospective", labelEn: "Sprint planning, daily, review, retrospective", level: "core" }
        ]
      },
      {
        title: "3. Facilitation", titleEn: "3. Facilitation",
        items: [
          { label: "Levée des obstacles (blockers)", labelEn: "Removing obstacles (blockers)", level: "core" },
          { label: "Coaching d'équipe et amélioration continue", labelEn: "Team coaching and continuous improvement", level: "core" },
          { label: "Posture de leader-serviteur (servant leadership)", labelEn: "Servant leadership", level: "option" },
          { label: "Autres approches agiles : Kanban, SAFe pour l'agilité à l'échelle", labelEn: "Other agile approaches: Kanban, SAFe for agility at scale", level: "option" }
        ]
      },
      {
        title: "4. Outils et métriques", titleEn: "4. Tools and metrics",
        items: [
          { label: "Jira, tableaux Kanban", labelEn: "Jira, Kanban boards", level: "core" },
          { label: "Vélocité, burndown/burnup charts", labelEn: "Velocity, burndown/burnup charts", level: "option" }
        ]
      },
      {
        title: "5. Certifications", titleEn: "5. Certifications",
        items: [
          { label: "Professional Scrum Master (PSM), Scrum.org", labelEn: "Professional Scrum Master (PSM), Scrum.org", level: "core", resource: { label: "Scrum.org - Certifications PSM", labelEn: "Scrum.org - PSM certifications", url: "https://www.scrum.org/professional-scrum-certifications" } },
          { label: "Certified ScrumMaster (CSM), Scrum Alliance", labelEn: "Certified ScrumMaster (CSM), Scrum Alliance", level: "option", resource: { label: "Scrum Alliance - Certification CSM", labelEn: "Scrum Alliance - CSM certification", url: "https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster" } }
        ]
      },
      {
        title: "6. Écosystème togolais", titleEn: "6. Togolese ecosystem",
        items: [
          { label: "Poste confirmé à l'Agence Togo Digital (ATD)", labelEn: "A confirmed role at the Togo Digital Agency (ATD)", level: "core" }
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
    titleEn: "Systems Integrator",
    subtitle: "Assembler et faire communiquer différents systèmes et logiciels entre eux",
    subtitleEn: "Assembling different systems and software and making them work together",
    icon: "workflow",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Architecture des systèmes existants", labelEn: "Architecture of existing systems", level: "core" },
          { label: "Notions réseaux et infrastructure", labelEn: "Networking and infrastructure basics", level: "core", resource: { label: "Voir roadmap compétence Réseaux", labelEn: "See the Networking skill roadmap", url: "roadmap.html?id=reseaux" } }
        ]
      },
      {
        title: "2. Intégration", titleEn: "2. Integration",
        items: [
          { label: "API et interopérabilité entre systèmes", labelEn: "APIs and interoperability between systems", level: "core" },
          { label: "Middleware et bus de données (ESB)", labelEn: "Middleware and data buses (ESB)", level: "option" },
          { label: "Outils d'intégration/ETL pour connecter les flux de données", labelEn: "Integration/ETL tools to connect data flows", level: "option" },
          { label: "Formats d'échange de données (JSON, XML, CSV)", labelEn: "Data exchange formats (JSON, XML, CSV)", level: "core" }
        ]
      },
      {
        title: "3. Déploiement", titleEn: "3. Deployment",
        items: [
          { label: "Recueil des besoins et cadrage technique du projet", labelEn: "Gathering requirements and technical scoping of the project", level: "core" },
          { label: "Installation et paramétrage de solutions tierces", labelEn: "Installing and configuring third-party solutions", level: "core" },
          { label: "Tests d'intégration", labelEn: "Integration testing", level: "core" },
          { label: "Documentation de l'architecture d'intégration", labelEn: "Documenting the integration architecture", level: "option" }
        ]
      },
      {
        title: "4. Support", titleEn: "4. Support",
        items: [
          { label: "Résolution des incidents d'intégration", labelEn: "Resolving integration incidents", level: "core" },
          { label: "Suivi de la performance des interfaces (monitoring des flux)", labelEn: "Monitoring interface performance (flow monitoring)", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais", titleEn: "5. Togolese ecosystem",
        items: [
          { label: "Poste confirmé à l'Agence Togo Digital (ATD)", labelEn: "A confirmed role at the Togo Digital Agency (ATD)", level: "core" }
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
    titleEn: "UX Writer / Microcopy Specialist",
    subtitle: "Écrire les textes d'interface qui guident et rassurent l'utilisateur",
    subtitleEn: "Writing the interface text that guides and reassures users",
    icon: "edit",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Principes de clarté et de concision", labelEn: "Principles of clarity and concision", level: "core" },
          { label: "Ton et voix de marque", labelEn: "Brand tone and voice", level: "core" },
          { label: "Rédaction en langage clair (plain language)", labelEn: "Writing in plain language", level: "core" }
        ]
      },
      {
        title: "2. Microcopy", titleEn: "2. Microcopy",
        items: [
          { label: "Boutons, messages d'erreur, états vides", labelEn: "Buttons, error messages, empty states", level: "core" },
          { label: "Textes de confirmation et d'onboarding", labelEn: "Confirmation and onboarding copy", level: "core" },
          { label: "Notifications et emails transactionnels", labelEn: "Notifications and transactional emails", level: "option" }
        ]
      },
      {
        title: "3. Systèmes de contenu", titleEn: "3. Content systems",
        items: [
          { label: "Guide de style et content design system", labelEn: "Style guide and content design system", level: "core" },
          { label: "Cohérence terminologique dans un glossaire produit", labelEn: "Consistent terminology in a product glossary", level: "option" },
          { label: "Travail en binôme avec les UX/UI Designers", labelEn: "Working in pairs with UX/UI designers", level: "core", resource: { label: "Voir roadmap métier UX/UI Designer", labelEn: "See the UX/UI Designer career roadmap", url: "roadmap.html?id=ux-ui" } }
        ]
      },
      {
        title: "4. Tests et accessibilité", titleEn: "4. Testing and accessibility",
        items: [
          { label: "Tests utilisateurs de contenu", labelEn: "Content user testing", level: "option" },
          { label: "Accessibilité du contenu (lecteurs d'écran, lisibilité)", labelEn: "Content accessibility (screen readers, readability)", level: "option" },
          { label: "Notions de localisation et traduction (i18n)", labelEn: "Localization and translation basics (i18n)", level: "option" }
        ]
      },
      {
        title: "5. Écosystème togolais", titleEn: "5. Togolese ecosystem",
        items: [
          { label: "Poste confirmé à l'Agence Togo Digital (ATD), rôle encore rare au Togo", labelEn: "A confirmed role at the Togo Digital Agency (ATD), still rare in Togo", level: "core" }
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
    titleEn: "Site Reliability Engineer (SRE)",
    subtitle: "Garantir la fiabilité, la disponibilité et la performance des systèmes en production",
    subtitleEn: "Ensuring the reliability, availability and performance of production systems",
    icon: "activity",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Administration Linux et scripting", labelEn: "Linux administration and scripting", level: "core", resource: { label: "Voir roadmap compétence Linux", labelEn: "See the Linux skill roadmap", url: "roadmap.html?id=linux" } },
          { label: "Notions réseaux et systèmes distribués", labelEn: "Networking and distributed systems basics", level: "core", resource: { label: "Voir roadmap compétence Réseaux", labelEn: "See the Networking skill roadmap", url: "roadmap.html?id=reseaux" } }
        ]
      },
      {
        title: "2. Fiabilité", titleEn: "2. Reliability",
        items: [
          { label: "SLI, SLO, SLA et budgets d'erreur", labelEn: "SLIs, SLOs, SLAs and error budgets", level: "core" },
          { label: "Gestion des incidents, astreinte (on-call) et post-mortems sans blâme", labelEn: "Incident management, on-call and blameless post-mortems", level: "core" },
          { label: "Planification de la capacité (capacity planning)", labelEn: "Capacity planning", level: "option" },
          { label: "Ingénierie du chaos (chaos engineering)", labelEn: "Chaos engineering", level: "option" }
        ]
      },
      {
        title: "3. Observabilité", titleEn: "3. Observability",
        items: [
          { label: "Monitoring, logging, tracing distribué", labelEn: "Monitoring, logging, distributed tracing", level: "core", resource: { label: "Documentation Prometheus", labelEn: "Prometheus documentation", url: "https://prometheus.io/docs/introduction/overview/" } },
          { label: "Corrélation logs/métriques/traces (Grafana, ELK, Datadog)", labelEn: "Correlating logs/metrics/traces (Grafana, ELK, Datadog)", level: "option" },
          { label: "Tableaux de bord et alerting actionnable (éviter la fatigue d'alertes)", labelEn: "Dashboards and actionable alerting (avoiding alert fatigue)", level: "core" }
        ]
      },
      {
        title: "4. Automatisation", titleEn: "4. Automation",
        items: [
          { label: "Infrastructure as Code", labelEn: "Infrastructure as Code", level: "core", resource: { label: "Voir roadmap métier DevOps & Cloud", labelEn: "See the DevOps & Cloud career roadmap", url: "roadmap.html?id=devops" } },
          { label: "Conteneurisation et orchestration", labelEn: "Containerization and orchestration", level: "core", resource: { label: "Voir roadmap compétence Docker", labelEn: "See the Docker skill roadmap", url: "roadmap.html?id=docker" } },
          { label: "Réduction du travail répétitif (toil) par l'automatisation", labelEn: "Reducing repetitive work (toil) through automation", level: "option" }
        ]
      },
      {
        title: "5. Certifications", titleEn: "5. Certifications",
        items: [
          { label: "Certification cloud orientée fiabilité (AWS, GCP ou Azure)", labelEn: "Reliability-focused cloud certification (AWS, GCP or Azure)", level: "option" }
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
    titleEn: "Platform Engineer",
    subtitle: "Construire les plateformes internes qui accélèrent le travail des équipes de développement",
    subtitleEn: "Building the internal platforms that speed up development teams' work",
    icon: "box",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Cloud et conteneurisation", labelEn: "Cloud and containerization", level: "core", resource: { label: "Voir roadmap compétence Cloud", labelEn: "See the Cloud skill roadmap", url: "roadmap.html?id=cloud" } },
          { label: "Bases Linux et réseaux", labelEn: "Linux and networking basics", level: "core", resource: { label: "Voir roadmap compétence Linux", labelEn: "See the Linux skill roadmap", url: "roadmap.html?id=linux" } }
        ]
      },
      {
        title: "2. Internal Developer Platform", titleEn: "2. Internal Developer Platform",
        items: [
          { label: "Self-service pour les équipes produit", labelEn: "Self-service for product teams", level: "core" },
          { label: "Golden paths et standardisation", labelEn: "Golden paths and standardization", level: "core" },
          { label: "Portails développeurs (Backstage)", labelEn: "Developer portals (Backstage)", level: "option" },
          { label: "Expérience développeur (Developer Experience / DevEx) comme métrique de succès", labelEn: "Developer experience (DevEx) as a success metric", level: "option" }
        ]
      },
      {
        title: "3. Outillage", titleEn: "3. Tooling",
        items: [
          { label: "Kubernetes et opérateurs", labelEn: "Kubernetes and operators", level: "core", resource: { label: "Documentation Kubernetes", labelEn: "Kubernetes documentation", url: "https://kubernetes.io/fr/docs/home/" } },
          { label: "CI/CD as a service", labelEn: "CI/CD as a service", level: "core" },
          { label: "Modules Infrastructure as Code réutilisables (Terraform)", labelEn: "Reusable Infrastructure as Code modules (Terraform)", level: "option", resource: { label: "Voir roadmap compétence Terraform", labelEn: "See the Terraform skill roadmap", url: "roadmap.html?id=terraform" } },
          { label: "GitOps (ArgoCD, Flux)", labelEn: "GitOps (ArgoCD, Flux)", level: "option" },
          { label: "Gestion des secrets (Vault, secrets managers cloud)", labelEn: "Secrets management (Vault, cloud secrets managers)", level: "option" }
        ]
      },
      {
        title: "4. Culture DevOps", titleEn: "4. DevOps culture",
        items: [
          { label: "Collaboration avec les équipes produit", labelEn: "Collaborating with product teams", level: "core" },
          { label: "Notions de FinOps : optimisation des coûts cloud", labelEn: "FinOps basics: optimizing cloud costs", level: "option" },
          { label: "Sécurité intégrée dès la conception de la plateforme (shift-left security)", labelEn: "Security built into the platform from the design stage (shift-left security)", level: "option" }
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
    titleEn: "Solutions Engineer / Pre-Sales Engineer",
    subtitle: "Faire le lien technique entre un produit et les besoins d'un client",
    subtitleEn: "Making the technical link between a product and a client's needs",
    icon: "presentation",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Compréhension technique approfondie du produit vendu", labelEn: "In-depth technical understanding of the product being sold", level: "core" },
          { label: "Bases API et intégrations", labelEn: "API and integration basics", level: "core" },
          { label: "Connaissance du marché et des solutions concurrentes", labelEn: "Knowledge of the market and competing solutions", level: "option" }
        ]
      },
      {
        title: "2. Avant-vente", titleEn: "2. Pre-sales",
        items: [
          { label: "Démonstrations techniques (démos) adaptées à l'audience", labelEn: "Technical demonstrations (demos) tailored to the audience", level: "core" },
          { label: "Réponse aux appels d'offres techniques (RFP/RFI)", labelEn: "Responding to technical requests for proposals (RFP/RFI)", level: "core" },
          { label: "Chiffrage et dimensionnement technique des solutions (sizing)", labelEn: "Technical costing and sizing of solutions", level: "core" },
          { label: "Positionnement concurrentiel et argumentaires (battlecards)", labelEn: "Competitive positioning and battlecards", level: "option" }
        ]
      },
      {
        title: "3. Relation client", titleEn: "3. Customer relations",
        items: [
          { label: "Communication technique à un public non technique", labelEn: "Technical communication with a non-technical audience", level: "core" },
          { label: "Gestion des objections techniques", labelEn: "Handling technical objections", level: "option" },
          { label: "Utilisation d'un CRM pour le suivi commercial", labelEn: "Using a CRM for sales follow-up", level: "option", resource: { label: "Voir roadmap métier Administrateur Salesforce / CRM", labelEn: "See the Salesforce / CRM Administrator career roadmap", url: "roadmap.html?id=salesforce-admin" } }
        ]
      },
      {
        title: "4. Proof of concept", titleEn: "4. Proof of concept",
        items: [
          { label: "Mise en place de POC et pilotes", labelEn: "Setting up POCs and pilots", level: "core" },
          { label: "Suivi post-vente et transfert vers l'équipe d'implémentation (handoff)", labelEn: "Post-sales follow-up and handoff to the implementation team", level: "core" }
        ]
      },
      {
        title: "5. Certifications", titleEn: "5. Certifications",
        items: [
          { label: "Certifications éditeur selon le produit vendu (Salesforce, AWS, Microsoft...)", labelEn: "Vendor certifications depending on the product sold (Salesforce, AWS, Microsoft...)", level: "option" }
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
    titleEn: "Technical Writer",
    subtitle: "Documenter les produits et systèmes pour les rendre compréhensibles",
    subtitleEn: "Documenting products and systems to make them understandable",
    icon: "file-text",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Clarté, structure, vulgarisation technique", labelEn: "Clarity, structure, explaining technical topics simply", level: "core" },
          { label: "Compréhension de base du produit documenté (code, API)", labelEn: "Basic understanding of the documented product (code, APIs)", level: "core" }
        ]
      },
      {
        title: "2. Types de documentation", titleEn: "2. Types of documentation",
        items: [
          { label: "Documentation développeur (API, SDK)", labelEn: "Developer documentation (APIs, SDKs)", level: "core" },
          { label: "Spécifications OpenAPI/Swagger pour documenter des API REST", labelEn: "OpenAPI/Swagger specifications to document REST APIs", level: "option" },
          { label: "Guides utilisateurs et tutoriels", labelEn: "User guides and tutorials", level: "core" },
          { label: "Notes de version (changelogs) et documentation de dépannage", labelEn: "Release notes (changelogs) and troubleshooting documentation", level: "option" }
        ]
      },
      {
        title: "3. Outils", titleEn: "3. Tools",
        items: [
          { label: "Markdown, générateurs de documentation statique (Docusaurus, MkDocs)", labelEn: "Markdown, static documentation generators (Docusaurus, MkDocs)", level: "core" },
          { label: "Outils de gestion de version (Git)", labelEn: "Version control tools (Git)", level: "option", resource: { label: "Voir roadmap compétence Git & GitHub", labelEn: "See the Git & GitHub skill roadmap", url: "roadmap.html?id=git-github" } },
          { label: "Guides de style de référence (Google, Microsoft Writing Style Guide)", labelEn: "Reference style guides (Google, Microsoft Writing Style Guide)", level: "option" },
          { label: "Diagrammes et schémas explicatifs", labelEn: "Explanatory diagrams and charts", level: "option" }
        ]
      },
      {
        title: "4. Collaboration", titleEn: "4. Collaboration",
        items: [
          { label: "Travail avec les équipes produit et ingénierie", labelEn: "Working with product and engineering teams", level: "core" },
          { label: "Docs-as-code : documentation versionnée avec le code source", labelEn: "Docs-as-code: documentation versioned with the source code", level: "option" }
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
    titleEn: "Developer Advocate / DevRel Engineer",
    subtitle: "Créer le lien entre une entreprise tech et sa communauté de développeurs",
    subtitleEn: "Building the link between a tech company and its developer community",
    icon: "mic",
    sections: [
      {
        title: "1. Fondamentaux techniques", titleEn: "1. Technical fundamentals",
        items: [
          { label: "Maîtrise pratique du produit ou langage promu", labelEn: "Hands-on mastery of the product or language being promoted", level: "core" },
          { label: "Compréhension de l'expérience développeur (onboarding, friction dans la doc)", labelEn: "Understanding the developer experience (onboarding, friction in the docs)", level: "core" }
        ]
      },
      {
        title: "2. Contenu", titleEn: "2. Content",
        items: [
          { label: "Articles techniques, tutoriels, démos de code", labelEn: "Technical articles, tutorials, code demos", level: "core" },
          { label: "Applications d'exemple (sample apps) et SDKs", labelEn: "Sample apps and SDKs", level: "option" },
          { label: "Vidéos et streaming technique (YouTube, Twitch)", labelEn: "Technical videos and streaming (YouTube, Twitch)", level: "option" },
          { label: "Newsletters techniques et notes de version", labelEn: "Technical newsletters and release notes", level: "option" },
          { label: "Prises de parole en conférence", labelEn: "Speaking at conferences", level: "core" }
        ]
      },
      {
        title: "3. Communauté", titleEn: "3. Community",
        items: [
          { label: "Animation de communauté de développeurs", labelEn: "Running a developer community", level: "core" },
          { label: "Programmes d'ambassadeurs et de champions communautaires", labelEn: "Ambassador and community champion programs", level: "option" },
          { label: "Contributions open source et gestion de projets communautaires", labelEn: "Open source contributions and community project management", level: "option" },
          { label: "Recueil de retours produit auprès des utilisateurs", labelEn: "Collecting product feedback from users", level: "core" }
        ]
      },
      {
        title: "4. Métriques", titleEn: "4. Metrics",
        items: [
          { label: "Suivi de l'adoption développeur (temps jusqu'au premier succès, rétention API)", labelEn: "Tracking developer adoption (time to first success, API retention)", level: "option" }
        ]
      },
      {
        title: "5. Écosystème", titleEn: "5. Ecosystem",
        items: [
          { label: "Participation à des meetups et conférences tech", labelEn: "Taking part in tech meetups and conferences", level: "option" },
          { label: "Communautés locales comme relais (GDG Lomé, PyCon Togo)", labelEn: "Local communities as relays (GDG Lomé, PyCon Togo)", level: "option" },
          { label: "Présence sur les réseaux sociaux orientés développeurs (X, LinkedIn)", labelEn: "Presence on developer-focused social networks (X, LinkedIn)", level: "option" }
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
    titleEn: "SOC Analyst (Security Operations Center)",
    subtitle: "Surveiller, détecter et réagir aux menaces de sécurité en temps réel",
    subtitleEn: "Monitoring, detecting and responding to security threats in real time",
    icon: "alert",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Réseaux et systèmes", labelEn: "Networks and systems", level: "core", resource: { label: "Voir roadmap compétence Réseaux", labelEn: "See the Networking skill roadmap", url: "roadmap.html?id=reseaux" } }
        ]
      },
      {
        title: "2. Détection", titleEn: "2. Detection",
        items: [
          { label: "SIEM : corrélation et analyse d'alertes (Splunk, Elastic, QRadar)", labelEn: "SIEM: alert correlation and analysis (Splunk, Elastic, QRadar)", level: "core" },
          { label: "Analyse de logs et de trafic réseau", labelEn: "Log and network traffic analysis", level: "core" },
          { label: "Solutions EDR/XDR pour la détection sur les postes", labelEn: "EDR/XDR solutions for endpoint detection", level: "option" },
          { label: "Cadre MITRE ATT&CK pour classifier les techniques d'attaque", labelEn: "MITRE ATT&CK framework to classify attack techniques", level: "core" },
          { label: "Gestion des vulnérabilités : scan régulier, priorisation, suivi des correctifs", labelEn: "Vulnerability management: regular scanning, prioritization, patch tracking", level: "core" }
        ]
      },
      {
        title: "3. Réponse à incident", titleEn: "3. Incident response",
        items: [
          { label: "Triage et qualification des incidents (niveaux N1/N2/N3)", labelEn: "Triage and qualification of incidents (tiers L1/L2/L3)", level: "core" },
          { label: "Utilisation de playbooks et outils SOAR", labelEn: "Using playbooks and SOAR tools", level: "option" },
          { label: "Escalade et remédiation", labelEn: "Escalation and remediation", level: "core" },
          { label: "Notions de veille en renseignement sur les menaces (threat intelligence)", labelEn: "Threat intelligence basics", level: "option" }
        ]
      },
      {
        title: "4. Certifications", titleEn: "4. Certifications",
        items: [
          { label: "CompTIA Security+", labelEn: "CompTIA Security+", level: "option", resource: { label: "CompTIA Security+", labelEn: "CompTIA Security+", url: "https://www.comptia.org/certifications/security" } },
          { label: "GIAC/GCIA ou Blue Team Level 1 pour se spécialiser", labelEn: "GIAC/GCIA or Blue Team Level 1 to specialize", level: "option" }
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
    titleEn: "Pentester / Ethical Hacker",
    subtitle: "Simuler des attaques pour identifier les failles de sécurité avant les attaquants réels",
    subtitleEn: "Simulating attacks to find security flaws before real attackers do",
    icon: "crosshair",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Réseaux, systèmes, sécurité applicative", labelEn: "Networks, systems, application security", level: "core", resource: { label: "Voir roadmap métier Cybersécurité & Réseaux", labelEn: "See the Cybersecurity & Networks career roadmap", url: "roadmap.html?id=cyber" } }
        ]
      },
      {
        title: "2. Méthodologie", titleEn: "2. Methodology",
        items: [
          { label: "Cadrage légal : autorisation écrite, règles d'engagement, types de test (boîte noire/grise/blanche)", labelEn: "Legal framing: written authorization, rules of engagement, test types (black/gray/white box)", level: "core" },
          { label: "Reconnaissance, exploitation, post-exploitation", labelEn: "Reconnaissance, exploitation, post-exploitation", level: "core" },
          { label: "OWASP Top 10", labelEn: "OWASP Top 10", level: "core", resource: { label: "OWASP Top 10", labelEn: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" } },
          { label: "Rédaction de rapports de test d'intrusion clairs et actionnables", labelEn: "Writing clear, actionable penetration test reports", level: "core" }
        ]
      },
      {
        title: "3. Outils et spécialisations", titleEn: "3. Tools and specializations",
        items: [
          { label: "Nmap, Metasploit, Burp Suite, Wireshark", labelEn: "Nmap, Metasploit, Burp Suite, Wireshark", level: "core", resource: { label: "Documentation Nmap", labelEn: "Nmap documentation", url: "https://nmap.org/book/man.html" } },
          { label: "Distribution Kali Linux comme environnement de travail", labelEn: "Kali Linux distribution as a working environment", level: "core" },
          { label: "Pentest d'Active Directory (environnements Windows d'entreprise)", labelEn: "Active Directory pentesting (enterprise Windows environments)", level: "option" },
          { label: "Sécurité des applications mobiles : analyse statique/dynamique d'APK et d'IPA", labelEn: "Mobile application security: static/dynamic analysis of APKs and IPAs", level: "option" },
          { label: "Bug bounty : plateformes (HackerOne, Bugcrowd) pour pratiquer légalement", labelEn: "Bug bounty: platforms (HackerOne, Bugcrowd) to practice legally", level: "option" }
        ]
      },
      {
        title: "4. Certifications", titleEn: "4. Certifications",
        items: [
          { label: "CEH (Certified Ethical Hacker)", labelEn: "CEH (Certified Ethical Hacker)", level: "option" },
          { label: "OSCP (Offensive Security Certified Professional) : référence pratique reconnue", labelEn: "OSCP (Offensive Security Certified Professional): a recognized hands-on benchmark", level: "option" }
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
    titleEn: "Data Protection Officer (DPO)",
    subtitle: "Garantir la conformité d'une organisation en matière de protection des données",
    subtitleEn: "Ensuring an organization's compliance with data protection requirements",
    icon: "eye-off",
    sections: [
      {
        title: "1. Fondamentaux juridiques", titleEn: "1. Legal fundamentals",
        items: [
          { label: "Cadres de protection des données (RGPD et équivalents)", labelEn: "Data protection frameworks (GDPR and equivalents)", level: "core" },
          { label: "Droits des personnes concernées (accès, rectification, opposition, portabilité)", labelEn: "Data subject rights (access, rectification, objection, portability)", level: "core" },
          { label: "Bases légales du traitement (consentement, intérêt légitime, obligation légale)", labelEn: "Legal bases for processing (consent, legitimate interest, legal obligation)", level: "core" }
        ]
      },
      {
        title: "2. Gouvernance", titleEn: "2. Governance",
        items: [
          { label: "Cartographie des traitements de données (registre des activités)", labelEn: "Mapping data processing (record of processing activities)", level: "core" },
          { label: "Analyses d'impact (AIPD/PIA)", labelEn: "Data protection impact assessments (DPIA/PIA)", level: "core" },
          { label: "Gestion des transferts internationaux de données", labelEn: "Managing international data transfers", level: "option" },
          { label: "Gestion des violations de données (notification, délais légaux)", labelEn: "Handling data breaches (notification, legal deadlines)", level: "core" }
        ]
      },
      {
        title: "3. Sécurité des données", titleEn: "3. Data security",
        items: [
          { label: "Collaboration avec les équipes sécurité IT", labelEn: "Working with IT security teams", level: "core", resource: { label: "Voir roadmap métier RSSI", labelEn: "See the CISO career roadmap", url: "roadmap.html?id=rssi" } },
          { label: "Privacy by design et by default dans les projets", labelEn: "Privacy by design and by default in projects", level: "option" }
        ]
      },
      {
        title: "4. Sensibilisation", titleEn: "4. Awareness",
        items: [
          { label: "Formation des équipes internes", labelEn: "Training internal teams", level: "core" },
          { label: "Point de contact pour les personnes concernées et les autorités", labelEn: "Point of contact for data subjects and authorities", level: "core" }
        ]
      },
      {
        title: "5. Écosystème togolais", titleEn: "5. Togolese ecosystem",
        items: [
          { label: "Loi n°2019-014 du 29 octobre 2019 relative à la protection des données à caractère personnel", labelEn: "Law no. 2019-014 of October 29, 2019 on the protection of personal data", level: "core", resource: { label: "assemblee-nationale.tg", labelEn: "assemblee-nationale.tg", url: "https://assemblee-nationale.tg/lois_adoptees/loi-relative-a-la-protection-des-donnees-a-caractere-personnel/" } },
          { label: "IPDCP : autorité togolaise de contrôle de la protection des données", labelEn: "IPDCP: Togo's data protection supervisory authority", level: "core", resource: { label: "ipdcp.tg", labelEn: "ipdcp.tg", url: "https://ipdcp.tg/" } }
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
    titleEn: "Product Owner",
    subtitle: "Porter la vision produit au sein d'une équipe agile et prioriser le backlog",
    subtitleEn: "Carrying the product vision within an agile team and prioritizing the backlog",
    icon: "list",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Différence Product Owner / Product Manager", labelEn: "Product Owner vs Product Manager", level: "core", resource: { label: "Voir roadmap métier Product Manager", labelEn: "See the Product Manager career roadmap", url: "roadmap.html?id=product-manager" } },
          { label: "Rôle de représentant des utilisateurs au sein de l'équipe de développement", labelEn: "Representing users within the development team", level: "core" }
        ]
      },
      {
        title: "2. Backlog", titleEn: "2. Backlog",
        items: [
          { label: "Rédaction de user stories selon les critères INVEST", labelEn: "Writing user stories using the INVEST criteria", level: "core" },
          { label: "Critères d'acceptation et Definition of Done", labelEn: "Acceptance criteria and Definition of Done", level: "core" },
          { label: "Techniques de priorisation (MoSCoW, RICE, matrice Kano)", labelEn: "Prioritization techniques (MoSCoW, RICE, Kano matrix)", level: "core" },
          { label: "Story mapping pour visualiser le parcours utilisateur complet", labelEn: "Story mapping to visualize the complete user journey", level: "option" },
          { label: "Priorisation et raffinement du backlog", labelEn: "Backlog prioritization and refinement", level: "core" }
        ]
      },
      {
        title: "3. Collaboration Scrum", titleEn: "3. Scrum collaboration",
        items: [
          { label: "Sprint planning et revue de sprint", labelEn: "Sprint planning and sprint review", level: "core", resource: { label: "Voir roadmap métier Scrum Master", labelEn: "See the Scrum Master career roadmap", url: "roadmap.html?id=scrum-master" } },
          { label: "Facilitation d'ateliers de refinement avec l'équipe", labelEn: "Facilitating refinement workshops with the team", level: "option" },
          { label: "Communication avec les parties prenantes (stakeholders)", labelEn: "Communicating with stakeholders", level: "core" },
          { label: "Arbitrages entre valeur métier et dette technique", labelEn: "Trade-offs between business value and technical debt", level: "option" }
        ]
      },
      {
        title: "4. Outils", titleEn: "4. Tools",
        items: [
          { label: "Jira, Azure DevOps ou Trello pour la gestion du backlog", labelEn: "Jira, Azure DevOps or Trello for backlog management", level: "core" },
          { label: "Notion ou Confluence pour la documentation produit", labelEn: "Notion or Confluence for product documentation", level: "option" }
        ]
      },
      {
        title: "5. Certifications", titleEn: "5. Certifications",
        items: [
          { label: "Professional Scrum Product Owner (PSPO)", labelEn: "Professional Scrum Product Owner (PSPO)", level: "option", resource: { label: "Scrum.org - Certifications", labelEn: "Scrum.org - Certifications", url: "https://www.scrum.org/professional-scrum-certifications" } },
          { label: "Certified Scrum Product Owner (CSPO)", labelEn: "Certified Scrum Product Owner (CSPO)", level: "option", resource: { label: "Scrum Alliance - CSPO", labelEn: "Scrum Alliance - CSPO", url: "https://www.scrumalliance.org/get-certified/product-owner-track/certified-scrum-product-owner" } }
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
    titleEn: "Engineering Manager",
    subtitle: "Encadrer une équipe d'ingénieurs et faire le lien entre technique et organisation",
    subtitleEn: "Leading a team of engineers and bridging the technical and organizational sides",
    icon: "users",
    sections: [
      {
        title: "1. Bases techniques", titleEn: "1. Technical foundations",
        items: [
          { label: "Solide expérience préalable en développement", labelEn: "Solid prior experience in development", level: "core", resource: { label: "Voir roadmap métier Développeur Backend", labelEn: "See the Backend Developer career roadmap", url: "roadmap.html?id=backend" } },
          { label: "Capacité à lire et évaluer du code lors des revues", labelEn: "Ability to read and evaluate code during reviews", level: "core" }
        ]
      },
      {
        title: "2. Management", titleEn: "2. Management",
        items: [
          { label: "Recrutement et entretiens techniques", labelEn: "Recruiting and technical interviews", level: "core" },
          { label: "One-on-one, feedback et développement de carrière", labelEn: "One-on-ones, feedback and career development", level: "core" },
          { label: "Grilles de progression (career ladders) et évaluations de performance", labelEn: "Career ladders and performance reviews", level: "option" },
          { label: "Gestion des conflits et médiation au sein de l'équipe", labelEn: "Conflict management and mediation within the team", level: "core" },
          { label: "Gestion du budget d'équipe et planification des effectifs (headcount)", labelEn: "Team budget management and headcount planning", level: "option" }
        ]
      },
      {
        title: "3. Livraison", titleEn: "3. Delivery",
        items: [
          { label: "Planification technique et gestion des priorités", labelEn: "Technical planning and priority management", level: "core" },
          { label: "Métriques d'ingénierie (DORA metrics : fréquence de déploiement, délai de restauration)", labelEn: "Engineering metrics (DORA metrics: deployment frequency, time to restore)", level: "option" },
          { label: "Frameworks Agile à l'échelle (SAFe, LeSS) pour coordonner plusieurs équipes", labelEn: "Scaled Agile frameworks (SAFe, LeSS) to coordinate several teams", level: "option" }
        ]
      },
      {
        title: "4. Culture d'équipe", titleEn: "4. Team culture",
        items: [
          { label: "Qualité du code et bonnes pratiques d'équipe", labelEn: "Code quality and team best practices", level: "core" },
          { label: "Mise en place de rituels d'équipe (stand-ups, rétrospectives)", labelEn: "Setting up team rituals (stand-ups, retrospectives)", level: "core" },
          { label: "Animation d'équipes à distance ou hybrides", labelEn: "Leading remote or hybrid teams", level: "option" }
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
    titleEn: "CTO / Chief Technology Officer",
    subtitle: "Définir et porter la vision technologique globale d'une organisation",
    subtitleEn: "Defining and carrying an organization's overall technology vision",
    icon: "flag",
    sections: [
      {
        title: "1. Vision technique", titleEn: "1. Technical vision",
        items: [
          { label: "Choix d'architecture et de stack à long terme", labelEn: "Long-term architecture and stack choices", level: "core", resource: { label: "Voir roadmap métier Architecte Logiciel", labelEn: "See the Software Architect career roadmap", url: "roadmap.html?id=architecte-logiciel" } },
          { label: "Roadmap technique pluriannuelle et arbitrages d'investissement", labelEn: "Multi-year technical roadmap and investment trade-offs", level: "core" }
        ]
      },
      {
        title: "2. Leadership", titleEn: "2. Leadership",
        items: [
          { label: "Structuration et recrutement des équipes techniques", labelEn: "Structuring and recruiting technical teams", level: "core" },
          { label: "Mise à l'échelle de l'organisation technique (startup vers scale-up)", labelEn: "Scaling the technical organization (from startup to scale-up)", level: "option" },
          { label: "Culture d'ingénierie et rétention des talents", labelEn: "Engineering culture and talent retention", level: "core" }
        ]
      },
      {
        title: "3. Stratégie", titleEn: "3. Strategy",
        items: [
          { label: "Alignement technologie / objectifs business", labelEn: "Aligning technology with business goals", level: "core" },
          { label: "Gestion des risques techniques et de la dette technique", labelEn: "Managing technical risks and technical debt", level: "core" },
          { label: "Sécurité et conformité au niveau organisationnel", labelEn: "Security and compliance at the organizational level", level: "core" },
          { label: "Décisions build vs buy (développer en interne ou acheter)", labelEn: "Build vs buy decisions (develop in-house or purchase)", level: "option" }
        ]
      },
      {
        title: "4. Veille et innovation", titleEn: "4. Technology watch and innovation",
        items: [
          { label: "Évaluation de nouvelles technologies (IA, cloud, outils émergents)", labelEn: "Evaluating new technologies (AI, cloud, emerging tools)", level: "option" }
        ]
      },
      {
        title: "5. Représentation", titleEn: "5. Representation",
        items: [
          { label: "Interface avec investisseurs et partenaires sur les sujets techniques", labelEn: "Interfacing with investors and partners on technical topics", level: "option" },
          { label: "Due diligence technique lors de levées de fonds", labelEn: "Technical due diligence during fundraising", level: "option" }
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
    titleEn: "UX Researcher",
    subtitle: "Comprendre les utilisateurs en profondeur pour guider les décisions produit",
    subtitleEn: "Deeply understanding users to guide product decisions",
    icon: "eye",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Méthodes de recherche qualitative et quantitative", labelEn: "Qualitative and quantitative research methods", level: "core" },
          { label: "Recherche générative (explorer) vs évaluative (valider)", labelEn: "Generative research (explore) vs evaluative research (validate)", level: "option" }
        ]
      },
      {
        title: "2. Collecte de données", titleEn: "2. Data collection",
        items: [
          { label: "Entretiens utilisateurs, sondages", labelEn: "User interviews, surveys", level: "core" },
          { label: "Tests d'utilisabilité modérés et non modérés", labelEn: "Moderated and unmoderated usability testing", level: "core" },
          { label: "Tri de cartes (card sorting) et tests d'arborescence", labelEn: "Card sorting and tree testing", level: "option" },
          { label: "Études terrain et observation contextuelle (contextual inquiry)", labelEn: "Field studies and contextual inquiry", level: "option" },
          { label: "Recrutement de participants et considérations éthiques (consentement)", labelEn: "Participant recruitment and ethical considerations (consent)", level: "option" }
        ]
      },
      {
        title: "3. Analyse", titleEn: "3. Analysis",
        items: [
          { label: "Synthèse des insights, personas", labelEn: "Synthesizing insights, personas", level: "core" },
          { label: "Cartographie du parcours utilisateur (customer journey map)", labelEn: "Customer journey mapping", level: "core" },
          { label: "Diagrammes d'affinité pour organiser les observations", labelEn: "Affinity diagrams to organize observations", level: "option" },
          { label: "Priorisation des insights selon leur impact business", labelEn: "Prioritizing insights by business impact", level: "option" }
        ]
      },
      {
        title: "4. Outils et collaboration", titleEn: "4. Tools and collaboration",
        items: [
          { label: "Outils de research ops (Dovetail, Maze, UserTesting)", labelEn: "Research ops tools (Dovetail, Maze, UserTesting)", level: "option" },
          { label: "Constitution d'un répertoire de recherche réutilisable (research repository)", labelEn: "Building a reusable research repository", level: "option" },
          { label: "Restitution aux équipes produit et design", labelEn: "Presenting findings to product and design teams", level: "core", resource: { label: "Voir roadmap métier UX/UI Designer", labelEn: "See the UX/UI Designer career roadmap", url: "roadmap.html?id=ux-ui" } }
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
    titleEn: "Technical Program Manager (TPM)",
    subtitle: "Coordonner des programmes techniques complexes impliquant plusieurs équipes",
    subtitleEn: "Coordinating complex technical programs involving multiple teams",
    icon: "folder",
    sections: [
      {
        title: "1. Bases techniques", titleEn: "1. Technical foundations",
        items: [
          { label: "Compréhension des systèmes et de l'architecture concernés", labelEn: "Understanding the systems and architecture involved", level: "core" },
          { label: "Connaissance des méthodologies de développement (Agile, Waterfall, hybride)", labelEn: "Knowledge of development methodologies (Agile, Waterfall, hybrid)", level: "core" }
        ]
      },
      {
        title: "2. Coordination", titleEn: "2. Coordination",
        items: [
          { label: "Gestion des dépendances entre équipes", labelEn: "Managing dependencies between teams", level: "core" },
          { label: "Planification de programmes multi-équipes (distinction programme/projet)", labelEn: "Planning multi-team programs (program vs project)", level: "core" },
          { label: "Suivi des jalons et du chemin critique", labelEn: "Tracking milestones and the critical path", level: "option" },
          { label: "Gestion des risques transverses au programme (RAID log)", labelEn: "Managing cross-program risks (RAID log)", level: "option" }
        ]
      },
      {
        title: "3. Communication", titleEn: "3. Communication",
        items: [
          { label: "Reporting aux parties prenantes techniques et non techniques", labelEn: "Reporting to technical and non-technical stakeholders", level: "core" },
          { label: "Animation de comités de pilotage (steering committees)", labelEn: "Running steering committees", level: "option" },
          { label: "Alignement des parties prenantes cross-fonctionnelles", labelEn: "Aligning cross-functional stakeholders", level: "option" }
        ]
      },
      {
        title: "4. Outils", titleEn: "4. Tools",
        items: [
          { label: "Jira, roadmapping multi-projets", labelEn: "Jira, multi-project roadmapping", level: "core" },
          { label: "Outils de gestion de programme (Smartsheet, Monday, MS Project)", labelEn: "Program management tools (Smartsheet, Monday, MS Project)", level: "option" },
          { label: "Diagrammes de Gantt et visualisation du chemin critique", labelEn: "Gantt charts and critical path visualization", level: "option" }
        ]
      },
      {
        title: "5. Certifications", titleEn: "5. Certifications",
        items: [
          { label: "PMP (Project Management Professional)", labelEn: "PMP (Project Management Professional)", level: "option", resource: { label: "PMI - PMP", labelEn: "PMI - PMP", url: "https://www.pmi.org/certifications/project-management-pmp" } },
          { label: "PgMP (Program Management Professional)", labelEn: "PgMP (Program Management Professional)", level: "option" }
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
    titleEn: "IT Business Analyst",
    subtitle: "Traduire les besoins métier en exigences fonctionnelles pour les équipes techniques",
    subtitleEn: "Translating business needs into functional requirements for technical teams",
    icon: "pie-chart",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Recueil et analyse des besoins métier", labelEn: "Gathering and analyzing business requirements", level: "core" },
          { label: "Analyse d'écart (gap analysis) entre existant et cible", labelEn: "Gap analysis between the current and target state", level: "option" },
          { label: "Techniques d'entretien et d'animation d'ateliers avec les parties prenantes", labelEn: "Interviewing techniques and running workshops with stakeholders", level: "core" }
        ]
      },
      {
        title: "2. Spécifications", titleEn: "2. Specifications",
        items: [
          { label: "Rédaction de cahiers des charges fonctionnels", labelEn: "Writing functional specifications", level: "core" },
          { label: "Modélisation de processus (BPMN) et diagrammes UML", labelEn: "Process modeling (BPMN) and UML diagrams", level: "core" },
          { label: "Rédaction de user stories et cas d'usage", labelEn: "Writing user stories and use cases", level: "option" },
          { label: "Wireframes et maquettes basse fidélité pour illustrer les besoins", labelEn: "Low-fidelity wireframes and mockups to illustrate requirements", level: "option" }
        ]
      },
      {
        title: "3. Liaison technique", titleEn: "3. Technical liaison",
        items: [
          { label: "Collaboration avec les équipes de développement", labelEn: "Working with development teams", level: "core" },
          { label: "Notions SQL pour l'analyse de données métier", labelEn: "SQL basics for business data analysis", level: "option", resource: { label: "Voir roadmap compétence SQL", labelEn: "See the SQL skill roadmap", url: "roadmap.html?id=sql" } },
          { label: "Priorisation des exigences (MoSCoW) selon la valeur et l'effort", labelEn: "Prioritizing requirements (MoSCoW) by value and effort", level: "option" }
        ]
      },
      {
        title: "4. Validation", titleEn: "4. Validation",
        items: [
          { label: "Recette fonctionnelle et validation utilisateur", labelEn: "Functional acceptance testing and user validation", level: "core" },
          { label: "Rédaction de plans de test et de scénarios de recette", labelEn: "Writing test plans and acceptance scenarios", level: "option" }
        ]
      },
      {
        title: "5. Certifications", titleEn: "5. Certifications",
        items: [
          { label: "ECBA (Entry Certificate in Business Analysis), IIBA : pour démarrer", labelEn: "ECBA (Entry Certificate in Business Analysis), IIBA: to get started", level: "option", resource: { label: "IIBA - Certifications", labelEn: "IIBA - Certifications", url: "https://www.iiba.org/business-analysis-certifications/" } },
          { label: "CBAP (Certified Business Analysis Professional), IIBA : niveau avancé", labelEn: "CBAP (Certified Business Analysis Professional), IIBA: advanced level", level: "option" }
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
    titleEn: "Video Game Developer",
    subtitle: "Programmer la logique et les mécaniques d'un jeu vidéo",
    subtitleEn: "Programming the logic and mechanics of a video game",
    icon: "gamepad",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Programmation orientée objet et structures de données", labelEn: "Object-oriented programming and data structures", level: "core" },
          { label: "Mathématiques appliquées au jeu (vecteurs, physique de base)", labelEn: "Mathematics applied to games (vectors, basic physics)", level: "core" },
          { label: "Boucle de jeu (game loop), gestion des états et des scènes", labelEn: "Game loop, state and scene management", level: "core" }
        ]
      },
      {
        title: "2. Moteurs de jeu", titleEn: "2. Game engines",
        items: [
          { label: "Unity (C#)", labelEn: "Unity (C#)", level: "core", resource: { label: "Documentation Unity", labelEn: "Unity documentation", url: "https://docs.unity3d.com/Manual/index.html" } },
          { label: "Unreal Engine (C++/Blueprints)", labelEn: "Unreal Engine (C++/Blueprints)", level: "option", resource: { label: "Documentation Unreal Engine", labelEn: "Unreal Engine documentation", url: "https://dev.epicgames.com/documentation/en-us/unreal-engine" } },
          { label: "Godot (gratuit et open-source, GDScript)", labelEn: "Godot (free and open source, GDScript)", level: "option", resource: { label: "Documentation Godot", labelEn: "Godot documentation", url: "https://docs.godotengine.org/" } }
        ]
      },
      {
        title: "3. Gameplay et production", titleEn: "3. Gameplay and production",
        items: [
          { label: "Systèmes de gameplay, IA de jeu basique (pathfinding, machine à états)", labelEn: "Gameplay systems, basic game AI (pathfinding, state machines)", level: "core" },
          { label: "Gestion du son et de la musique interactive", labelEn: "Sound and interactive music", level: "option" },
          { label: "Contrôle de version adapté au jeu vidéo (Git LFS pour les gros assets)", labelEn: "Version control suited to video games (Git LFS for large assets)", level: "core" },
          { label: "Notions de multijoueur : netcode, synchronisation client-serveur", labelEn: "Multiplayer basics: netcode, client-server synchronization", level: "option" }
        ]
      },
      {
        title: "4. Publication", titleEn: "4. Publishing",
        items: [
          { label: "Optimisation et publication sur plateformes (Steam, mobile, consoles)", labelEn: "Optimizing and publishing on platforms (Steam, mobile, consoles)", level: "option" },
          { label: "Monétisation : achats intégrés, publicité, modèles free-to-play", labelEn: "Monetization: in-app purchases, ads, free-to-play models", level: "option" }
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
    titleEn: "Game Designer",
    subtitle: "Concevoir les règles, la progression et l'expérience d'un jeu",
    subtitleEn: "Designing a game's rules, progression and experience",
    icon: "star",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Mécaniques de jeu et boucles de gameplay", labelEn: "Game mechanics and gameplay loops", level: "core" },
          { label: "Équilibrage et courbes de progression", labelEn: "Balancing and progression curves", level: "core" },
          { label: "Psychologie du joueur : motivation, types de joueurs", labelEn: "Player psychology: motivation, player types", level: "option" }
        ]
      },
      {
        title: "2. Disciplines de conception", titleEn: "2. Design disciplines",
        items: [
          { label: "Level design : composition et rythme des niveaux", labelEn: "Level design: composition and pacing of levels", level: "core" },
          { label: "Narrative design : histoire, dialogues, choix du joueur", labelEn: "Narrative design: story, dialogue, player choices", level: "option" },
          { label: "Économie de jeu et monétisation (free-to-play, achats)", labelEn: "Game economy and monetization (free-to-play, purchases)", level: "option" },
          { label: "Systems design : interactions entre mécaniques", labelEn: "Systems design: interactions between mechanics", level: "option" }
        ]
      },
      {
        title: "3. Documentation", titleEn: "3. Documentation",
        items: [
          { label: "Rédaction de game design documents (GDD)", labelEn: "Writing game design documents (GDD)", level: "core" },
          { label: "Wireframes et diagrammes de flux de jeu", labelEn: "Wireframes and game flow diagrams", level: "option" }
        ]
      },
      {
        title: "4. Prototypage", titleEn: "4. Prototyping",
        items: [
          { label: "Prototypage rapide de mécaniques (papier ou moteur de jeu)", labelEn: "Rapid prototyping of mechanics (paper or game engine)", level: "core" },
          { label: "Outils de prototypage narratif (Twine)", labelEn: "Narrative prototyping tools (Twine)", level: "option" }
        ]
      },
      {
        title: "5. Playtesting", titleEn: "5. Playtesting",
        items: [
          { label: "Tests de jouabilité et itération", labelEn: "Playability testing and iteration", level: "core" },
          { label: "Équilibrage post-lancement (live ops) selon les retours joueurs", labelEn: "Post-launch balancing (live ops) based on player feedback", level: "option" }
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
    titleEn: "AR/VR Developer",
    subtitle: "Créer des expériences immersives en réalité augmentée et virtuelle",
    subtitleEn: "Creating immersive augmented and virtual reality experiences",
    icon: "glasses",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Notions 3D : mesh, textures, éclairage, caméras", labelEn: "3D basics: meshes, textures, lighting, cameras", level: "core" },
          { label: "Spatial computing : suivi de position, ancrage dans l'espace réel", labelEn: "Spatial computing: position tracking, anchoring in real space", level: "core" }
        ]
      },
      {
        title: "2. Outils et SDK", titleEn: "2. Tools and SDKs",
        items: [
          { label: "Unity avec AR Foundation / SDK VR (multiplateforme)", labelEn: "Unity with AR Foundation / VR SDKs (cross-platform)", level: "core", resource: { label: "Documentation Unity", labelEn: "Unity documentation", url: "https://docs.unity3d.com/Manual/index.html" } },
          { label: "ARKit (iOS) et ARCore (Android) pour la réalité augmentée mobile", labelEn: "ARKit (iOS) and ARCore (Android) for mobile augmented reality", level: "core" },
          { label: "OpenXR comme standard multiplateforme pour la VR/AR", labelEn: "OpenXR as a cross-platform standard for VR/AR", level: "option" }
        ]
      },
      {
        title: "3. Plateformes casques", titleEn: "3. Headset platforms",
        items: [
          { label: "Meta Quest (SDK Meta), PlayStation VR, casques PC (SteamVR)", labelEn: "Meta Quest (Meta SDK), PlayStation VR, PC headsets (SteamVR)", level: "option" }
        ]
      },
      {
        title: "4. Interaction", titleEn: "4. Interaction",
        items: [
          { label: "Interfaces immersives, tracking et contrôleurs", labelEn: "Immersive interfaces, tracking and controllers", level: "core" },
          { label: "Interactions main libre et reconnaissance de gestes", labelEn: "Hands-free interactions and gesture recognition", level: "option" },
          { label: "Retour haptique (haptic feedback) pour renforcer l'immersion", labelEn: "Haptic feedback to strengthen immersion", level: "option" }
        ]
      },
      {
        title: "5. Optimisation", titleEn: "5. Optimization",
        items: [
          { label: "Performance sur casques et appareils mobiles (framerate stable)", labelEn: "Performance on headsets and mobile devices (stable frame rate)", level: "core" },
          { label: "Réduction du mal des transports en VR (comfort settings)", labelEn: "Reducing motion sickness in VR (comfort settings)", level: "option" }
        ]
      },
      {
        title: "6. Distribution", titleEn: "6. Distribution",
        items: [
          { label: "Publication sur les stores dédiés (Meta Quest Store, App Lab, SideQuest)", labelEn: "Publishing on dedicated stores (Meta Quest Store, App Lab, SideQuest)", level: "option" }
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
    titleEn: "Robotics Engineer",
    subtitle: "Concevoir et programmer des systèmes robotiques autonomes",
    subtitleEn: "Designing and programming autonomous robotic systems",
    icon: "bot",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Mécanique, capteurs, actionneurs", labelEn: "Mechanics, sensors, actuators", level: "core" },
          { label: "Électronique embarquée", labelEn: "Embedded electronics", level: "core", resource: { label: "Voir roadmap métier Ingénieur IoT / Systèmes Embarqués", labelEn: "See the IoT / Embedded Systems Engineer career roadmap", url: "roadmap.html?id=iot-embarque" } },
          { label: "Notions d'automatique et systèmes asservis", labelEn: "Control engineering and servo systems basics", level: "option" }
        ]
      },
      {
        title: "2. Programmation", titleEn: "2. Programming",
        items: [
          { label: "C/C++ et Python pour la robotique", labelEn: "C/C++ and Python for robotics", level: "core" },
          { label: "ROS (Robot Operating System)", labelEn: "ROS (Robot Operating System)", level: "core", resource: { label: "Documentation ROS", labelEn: "ROS documentation", url: "https://docs.ros.org/" } },
          { label: "Cinématique et planification de trajectoire", labelEn: "Kinematics and trajectory planning", level: "option" }
        ]
      },
      {
        title: "3. Perception et contrôle", titleEn: "3. Perception and control",
        items: [
          { label: "Vision par ordinateur de base, algorithmes de contrôle", labelEn: "Basic computer vision, control algorithms", level: "option" },
          { label: "Fusion de capteurs et cartographie/localisation (SLAM)", labelEn: "Sensor fusion and mapping/localization (SLAM)", level: "option" },
          { label: "Bases de l'intelligence artificielle appliquée à la navigation autonome", labelEn: "Artificial intelligence basics applied to autonomous navigation", level: "option" }
        ]
      },
      {
        title: "4. Intégration", titleEn: "4. Integration",
        items: [
          { label: "Simulation (Gazebo) et tests physiques", labelEn: "Simulation (Gazebo) and physical testing", level: "core" },
          { label: "Normes de sécurité pour la robotique industrielle et collaborative", labelEn: "Safety standards for industrial and collaborative robotics", level: "option" },
          { label: "Prototypage rapide (impression 3D, fablabs)", labelEn: "Rapid prototyping (3D printing, fab labs)", level: "option" }
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
    titleEn: "Salesforce / CRM Administrator",
    subtitle: "Paramétrer et faire évoluer une plateforme CRM au service des équipes commerciales",
    subtitleEn: "Configuring and evolving a CRM platform to serve sales teams",
    icon: "cloud",
    sections: [
      {
        title: "1. Fondamentaux CRM", titleEn: "1. CRM fundamentals",
        items: [
          { label: "Concepts de gestion de la relation client", labelEn: "Customer relationship management concepts", level: "core" },
          { label: "Cycle de vie du client (lead, opportunité, compte, contact)", labelEn: "Customer life cycle (lead, opportunity, account, contact)", level: "core" }
        ]
      },
      {
        title: "2. Salesforce", titleEn: "2. Salesforce",
        items: [
          { label: "Configuration des objets, workflows, permissions", labelEn: "Configuring objects, workflows, permissions", level: "core", resource: { label: "Salesforce Trailhead", labelEn: "Salesforce Trailhead", url: "https://trailhead.salesforce.com/" } },
          { label: "Modèle de sécurité : profils, rôles, règles de partage", labelEn: "Security model: profiles, roles, sharing rules", level: "core" },
          { label: "Gestion des données : import/export, dédoublonnage", labelEn: "Data management: import/export, deduplication", level: "option" },
          { label: "Alternatives CRM plus légères : HubSpot, Zoho CRM", labelEn: "Lighter CRM alternatives: HubSpot, Zoho CRM", level: "option" }
        ]
      },
      {
        title: "3. Automatisation", titleEn: "3. Automation",
        items: [
          { label: "Flows et automatisations sans code", labelEn: "Flows and no-code automations", level: "core" },
          { label: "Validation rules pour garantir la qualité des données saisies", labelEn: "Validation rules to ensure the quality of entered data", level: "option" }
        ]
      },
      {
        title: "4. Reporting et certification", titleEn: "4. Reporting and certification",
        items: [
          { label: "Tableaux de bord et rapports CRM", labelEn: "CRM dashboards and reports", level: "core" },
          { label: "Salesforce Certified Administrator", labelEn: "Salesforce Certified Administrator", level: "option", resource: { label: "Salesforce Trailhead - Certifications", labelEn: "Salesforce Trailhead - Certifications", url: "https://trailhead.salesforce.com/en/credentials/platformadministrator" } }
        ]
      },
      {
        title: "5. Accompagnement des utilisateurs", titleEn: "5. Supporting users",
        items: [
          { label: "Formation des équipes commerciales à l'outil", labelEn: "Training sales teams on the tool", level: "core" },
          { label: "Support de premier niveau et gestion des demandes d'évolution", labelEn: "First-level support and handling change requests", level: "option" }
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
    titleEn: "SAP Consultant",
    subtitle: "Implémenter et paramétrer les modules SAP dans une organisation",
    subtitleEn: "Implementing and configuring SAP modules within an organization",
    icon: "calculator",
    sections: [
      {
        title: "1. Fondamentaux ERP", titleEn: "1. ERP fundamentals",
        items: [
          { label: "Concepts ERP et processus métier", labelEn: "ERP concepts and business processes", level: "core", resource: { label: "Voir roadmap métier Développeur ERP/CRM", labelEn: "See the ERP/CRM Developer career roadmap", url: "roadmap.html?id=erp-crm" } },
          { label: "Cycle de vie d'un projet ERP (avant-vente, implémentation, run)", labelEn: "ERP project life cycle (pre-sales, implementation, run)", level: "core" }
        ]
      },
      {
        title: "2. Modules SAP", titleEn: "2. SAP modules",
        items: [
          { label: "Spécialisation sur un module (FI/CO, MM, SD...)", labelEn: "Specializing in one module (FI/CO, MM, SD...)", level: "core" },
          { label: "SAP S/4HANA, la suite ERP nouvelle génération", labelEn: "SAP S/4HANA, the next-generation ERP suite", level: "option" },
          { label: "SAP Fiori pour les interfaces utilisateurs modernes", labelEn: "SAP Fiori for modern user interfaces", level: "option" }
        ]
      },
      {
        title: "3. Paramétrage", titleEn: "3. Configuration",
        items: [
          { label: "Configuration et personnalisation des processus (customizing)", labelEn: "Configuring and customizing processes (customizing)", level: "core" },
          { label: "Méthodologie de déploiement SAP Activate", labelEn: "SAP Activate deployment methodology", level: "option" },
          { label: "Tests d'intégration et recette utilisateur (UAT)", labelEn: "Integration testing and user acceptance testing (UAT)", level: "core" },
          { label: "Notions ABAP pour les développements spécifiques", labelEn: "ABAP basics for custom developments", level: "option" }
        ]
      },
      {
        title: "4. Accompagnement", titleEn: "4. Support",
        items: [
          { label: "Formation des utilisateurs finaux", labelEn: "End-user training", level: "core" },
          { label: "Rédaction de documentation fonctionnelle et supports de formation", labelEn: "Writing functional documentation and training materials", level: "core" }
        ]
      },
      {
        title: "5. Certifications", titleEn: "5. Certifications",
        items: [
          { label: "SAP Certified Application Associate (par module)", labelEn: "SAP Certified Application Associate (per module)", level: "option" }
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
    titleEn: "Quant Developer / Quantitative Analyst",
    subtitle: "Développer des modèles mathématiques et des systèmes pour la finance",
    subtitleEn: "Developing mathematical models and systems for finance",
    icon: "percent",
    sections: [
      {
        title: "1. Fondamentaux mathématiques", titleEn: "1. Mathematical fundamentals",
        items: [
          { label: "Statistiques avancées et probabilités", labelEn: "Advanced statistics and probability", level: "core" },
          { label: "Calcul stochastique et équations différentielles", labelEn: "Stochastic calculus and differential equations", level: "core" },
          { label: "Algèbre linéaire appliquée à l'optimisation", labelEn: "Linear algebra applied to optimization", level: "core" }
        ]
      },
      {
        title: "2. Programmation", titleEn: "2. Programming",
        items: [
          { label: "Python : NumPy, Pandas, calcul scientifique", labelEn: "Python: NumPy, Pandas, scientific computing", level: "core", resource: { label: "Voir roadmap compétence Python", labelEn: "See the Python skill roadmap", url: "roadmap.html?id=python" } },
          { label: "C++ pour le calcul haute performance et le trading basse latence", labelEn: "C++ for high-performance computing and low-latency trading", level: "option" },
          { label: "Bibliothèques spécialisées : QuantLib", labelEn: "Specialized libraries: QuantLib", level: "option" }
        ]
      },
      {
        title: "3. Modélisation financière", titleEn: "3. Financial modeling",
        items: [
          { label: "Pricing de produits dérivés (modèle Black-Scholes, arbres binomiaux)", labelEn: "Pricing derivatives (Black-Scholes model, binomial trees)", level: "core" },
          { label: "Gestion des risques : VaR (Value at Risk), Greeks", labelEn: "Risk management: VaR (Value at Risk), Greeks", level: "core" },
          { label: "Stratégies de trading algorithmique et backtesting", labelEn: "Algorithmic trading strategies and backtesting", level: "option" }
        ]
      },
      {
        title: "4. Données et infrastructure", titleEn: "4. Data and infrastructure",
        items: [
          { label: "Traitement de séries temporelles financières", labelEn: "Processing financial time series", level: "core" },
          { label: "Flux de données de marché en temps réel (market data feeds, APIs)", labelEn: "Real-time market data feeds and APIs", level: "option" },
          { label: "Machine learning appliqué à la finance quantitative", labelEn: "Machine learning applied to quantitative finance", level: "option" }
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
    titleEn: "Growth Hacker",
    subtitle: "Expérimenter rapidement pour accélérer la croissance d'un produit",
    subtitleEn: "Running fast experiments to accelerate a product's growth",
    icon: "rocket",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Ajustement produit-marché (product-market fit) comme préalable", labelEn: "Product-market fit as a prerequisite", level: "core" },
          { label: "Funnel d'acquisition, activation, rétention (AARRR)", labelEn: "Acquisition, activation, retention funnel (AARRR)", level: "core" },
          { label: "Growth loops et boucles virales", labelEn: "Growth loops and viral loops", level: "option" }
        ]
      },
      {
        title: "2. Expérimentation", titleEn: "2. Experimentation",
        items: [
          { label: "Tests A/B et itération rapide", labelEn: "A/B tests and rapid iteration", level: "core" },
          { label: "Priorisation des expériences (framework ICE)", labelEn: "Prioritizing experiments (ICE framework)", level: "option" },
          { label: "Tracking et instrumentation (pixels, UTM, événements)", labelEn: "Tracking and instrumentation (pixels, UTMs, events)", level: "core" },
          { label: "Automatisation sans code (Zapier, Make)", labelEn: "No-code automation (Zapier, Make)", level: "option" }
        ]
      },
      {
        title: "3. Canaux", titleEn: "3. Channels",
        items: [
          { label: "SEO, paid ads, viralité, partenariats", labelEn: "SEO, paid ads, virality, partnerships", level: "core", resource: { label: "Voir roadmap métier Marketing Digital", labelEn: "See the Digital Marketing career roadmap", url: "roadmap.html?id=marketing-digital" } },
          { label: "Programmes de parrainage (referral)", labelEn: "Referral programs", level: "option" }
        ]
      },
      {
        title: "4. Analyse", titleEn: "4. Analysis",
        items: [
          { label: "Analytics produit et métriques de croissance (North Star Metric)", labelEn: "Product analytics and growth metrics (North Star Metric)", level: "core" },
          { label: "Analyse de cohortes et courbes de rétention", labelEn: "Cohort analysis and retention curves", level: "option" }
        ]
      },
      {
        title: "5. Outils", titleEn: "5. Tools",
        items: [
          { label: "Outils d'analytics produit (Mixpanel, Amplitude, Google Analytics)", labelEn: "Product analytics tools (Mixpanel, Amplitude, Google Analytics)", level: "core" }
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
    titleEn: "Content Strategist",
    subtitle: "Définir la stratégie de contenu d'une marque sur le long terme",
    subtitleEn: "Defining a brand's long-term content strategy",
    icon: "book",
    sections: [
      {
        title: "1. Stratégie", titleEn: "1. Strategy",
        items: [
          { label: "Audit de contenu existant et analyse concurrentielle", labelEn: "Existing content audit and competitive analysis", level: "core" },
          { label: "Ligne éditoriale et piliers de contenu", labelEn: "Editorial line and content pillars", level: "core" },
          { label: "Recherche d'audience et personas", labelEn: "Audience research and personas", level: "core" },
          { label: "Cartographie du contenu selon le tunnel d'achat (awareness, considération, décision)", labelEn: "Mapping content to the buyer journey (awareness, consideration, decision)", level: "option" }
        ]
      },
      {
        title: "2. Production", titleEn: "2. Production",
        items: [
          { label: "Calendrier éditorial multi-canal (outils : Notion, Trello)", labelEn: "Multichannel editorial calendar (tools: Notion, Trello)", level: "core" },
          { label: "Réadaptation de contenu entre formats (repurposing : blog, vidéo, newsletter)", labelEn: "Repurposing content across formats (blog, video, newsletter)", level: "option" },
          { label: "Guide de style et cohérence de la voix de marque", labelEn: "Style guide and consistent brand voice", level: "core" }
        ]
      },
      {
        title: "3. SEO et distribution", titleEn: "3. SEO and distribution",
        items: [
          { label: "Optimisation SEO du contenu", labelEn: "SEO optimization of content", level: "core" },
          { label: "Recherche de mots-clés et intention de recherche", labelEn: "Keyword research and search intent", level: "option" },
          { label: "Distribution multicanale (réseaux sociaux, email, partenariats)", labelEn: "Multichannel distribution (social media, email, partnerships)", level: "option" }
        ]
      },
      {
        title: "4. Mesure", titleEn: "4. Measurement",
        items: [
          { label: "Analyse de performance du contenu (trafic, engagement, conversions)", labelEn: "Content performance analysis (traffic, engagement, conversions)", level: "core" },
          { label: "Audit de contenu récurrent (mise à jour ou retrait du contenu obsolète)", labelEn: "Recurring content audits (updating or removing outdated content)", level: "option" }
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
    titleEn: "Traffic Manager",
    subtitle: "Piloter les campagnes publicitaires payantes pour maximiser le retour sur investissement",
    subtitleEn: "Running paid advertising campaigns to maximize return on investment",
    icon: "target",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Fonctionnement des enchères publicitaires", labelEn: "How ad auctions work", level: "core" },
          { label: "Suivi et mesure : pixels, UTM, paramétrage du tracking", labelEn: "Tracking and measurement: pixels, UTMs, tracking setup", level: "core" },
          { label: "Google Tag Manager pour centraliser le tracking", labelEn: "Google Tag Manager to centralize tracking", level: "option" }
        ]
      },
      {
        title: "2. Plateformes", titleEn: "2. Platforms",
        items: [
          { label: "Google Ads", labelEn: "Google Ads", level: "core", resource: { label: "Centre d'aide Google Ads", labelEn: "Google Ads Help Center", url: "https://support.google.com/google-ads" } },
          { label: "Meta Ads", labelEn: "Meta Ads", level: "core", resource: { label: "Meta Business Help Center", labelEn: "Meta Business Help Center", url: "https://www.facebook.com/business/help" } },
          { label: "TikTok Ads, LinkedIn Ads selon la cible", labelEn: "TikTok Ads, LinkedIn Ads depending on the target audience", level: "option" }
        ]
      },
      {
        title: "3. Optimisation", titleEn: "3. Optimization",
        items: [
          { label: "Ciblage, budgets, optimisation des enchères", labelEn: "Targeting, budgets, bid optimization", level: "core" },
          { label: "Retargeting et audiences similaires (lookalike)", labelEn: "Retargeting and lookalike audiences", level: "option" },
          { label: "Tests créatifs publicitaires (A/B sur visuels et accroches)", labelEn: "Ad creative testing (A/B on visuals and hooks)", level: "option" },
          { label: "Optimisation des pages d'atterrissage (landing pages)", labelEn: "Landing page optimization", level: "option" }
        ]
      },
      {
        title: "4. Reporting", titleEn: "4. Reporting",
        items: [
          { label: "Suivi du ROAS et reporting de campagne", labelEn: "ROAS tracking and campaign reporting", level: "core" },
          { label: "Modèles d'attribution (dernier clic, multi-touch)", labelEn: "Attribution models (last click, multi-touch)", level: "option" }
        ]
      }
    ]
  }
};

const DOMAINS = {
  "Développement": { icon: "💻", nameEn: "Development", description: "Concevoir et construire des logiciels, applications et sites web.", descriptionEn: "Designing and building software, applications and websites.", presenceTogo: "Le domaine le plus représenté au Togo : recruté par l'Agence Togo Digital et Gozem, enseigné dans la quasi-totalité des 32 écoles du pays, comme dans le reste du monde, la base de toute la tech.", presenceTogoEn: "The most represented domain in Togo: hired by the Togo Digital Agency and Gozem, taught in almost all 32 schools nationwide, as everywhere else, the foundation of all tech." },
  "Data & IA": { icon: "📊", nameEn: "Data & AI", description: "Exploiter, analyser et modéliser la donnée.", descriptionEn: "Working with, analyzing and modeling data.", presenceTogo: "Enseigné dans une quinzaine d'écoles togolaises (IA, Big Data) et recherché par l'Agence Togo Digital : en forte croissance au Togo comme dans le monde entier.", presenceTogoEn: "Taught in around fifteen Togolese schools (AI, Big Data) and sought after by the Togo Digital Agency: booming in Togo as it is worldwide." },
  "Sécurité": { icon: "🔐", nameEn: "Security", description: "Protéger les systèmes, les données et les organisations.", descriptionEn: "Protecting systems, data and organizations.", presenceTogo: "Porté au Togo par Cyber Defense Africa (SOC/CERT national), l'ANCy et la BCEAO : une pénurie de profils que le pays partage avec le reste du monde.", presenceTogoEn: "Backed in Togo by Cyber Defense Africa (national SOC/CERT), ANCy and BCEAO: a talent shortage Togo shares with the rest of the world." },
  "Produit & Design": { icon: "🎨", nameEn: "Product & Design", description: "Concevoir des produits et expériences centrées sur l'utilisateur.", descriptionEn: "Designing products and experiences centered on the user.", presenceTogo: "Encore émergent au Togo (filière UX/UI dans quelques écoles, recrutements ponctuels à l'Agence Togo Digital), plus mature à l'international.", presenceTogoEn: "Still emerging in Togo (UX/UI programs in a handful of schools, occasional hiring at the Togo Digital Agency), more established internationally." },
  "Infrastructure & DevOps": { icon: "☁️", nameEn: "Infrastructure & DevOps", description: "Déployer, exploiter et fiabiliser les systèmes et réseaux.", descriptionEn: "Deploying, operating and ensuring the reliability of systems and networks.", presenceTogo: "Porté par les opérateurs télécoms (Yas Togo, Moov Africa) et la SIN : un socle indispensable à toute infrastructure numérique, au Togo comme ailleurs.", presenceTogoEn: "Driven by telecom operators (Yas Togo, Moov Africa) and SIN: an essential backbone for any digital infrastructure, in Togo as elsewhere." },
  "Marketing digital": { icon: "📣", nameEn: "Digital Marketing", description: "Faire connaître, acquérir et fidéliser via le numérique.", descriptionEn: "Building awareness, acquiring and retaining customers through digital channels.", presenceTogo: "Enseigné dans plusieurs écoles togolaises et très demandé par les PME et agences locales, à l'image de sa croissance mondiale portée par le e-commerce.", presenceTogoEn: "Taught in several Togolese schools and in high demand among local SMEs and agencies, mirroring its worldwide growth driven by e-commerce." },
  "Gestion & Management": { icon: "🧭", nameEn: "Management", description: "Piloter des projets, des équipes et des transformations.", descriptionEn: "Steering projects, teams and transformations.", presenceTogo: "Recherché par les banques et institutions régionales de Lomé (BOAD, Ecobank) pour piloter leurs projets IT : une fonction transverse indispensable partout dans le monde.", presenceTogoEn: "Sought by banks and regional institutions in Lomé (BOAD, Ecobank) to lead their IT projects: an essential cross-cutting function everywhere in the world." }
};

// Communautés togolaises réelles (déjà listées et sourcées sur ecosysteme.html)
// les plus pertinentes pour chaque domaine, affichées sur les pages roadmap.
// Un domaine sans communauté suffisamment ciblée reste volontairement absent
// plutôt que d'y forcer une correspondance approximative.
const COMMUNITY_BY_DOMAIN = {
  "Développement": [
    { name: "GDG Lomé", url: "https://gdg.community.dev/gdg-lome/", note: "Meetups réguliers web, mobile, cloud.", noteEn: "Regular meetups on web, mobile and cloud." },
    { name: "Python Togo", url: "https://www.pytogo.org/", note: "Ateliers mensuels, organise le PyDay Togo.", noteEn: "Monthly workshops, organizes PyDay Togo." },
    { name: "TDEV : Communauté des Développeurs Togolais", nameEn: "TDEV: Togolese Developers Community", url: "https://www.linkedin.com/company/tdev228/", note: "Talks, sessions de code, événement annuel Code Moment.", noteEn: "Talks, coding sessions, annual Code Moment event." },
  ],
  "Data & IA": [
    { name: "CoTIA : Communauté Togolaise d'Intelligence Artificielle", nameEn: "CoTIA: Togolese Artificial Intelligence Community", url: "https://cotia.tg/", note: "Organise IndabaX Togo depuis 2021.", noteEn: "Has organized IndabaX Togo since 2021." },
    { name: "Python Togo", url: "https://www.pytogo.org/", note: "Communauté Python, langage central en data/IA.", noteEn: "Python community, the core language for data/AI." },
  ],
  "Sécurité": [
    { name: "Tech Communities Club (TCC), IAI-Togo", url: "https://www.linkedin.com/company/tech-communities-clubs-iai-togo", note: "Organise le hackathon/CTF Hack & Defend.", noteEn: "Organizes the Hack & Defend hackathon/CTF." },
  ],
  "Produit & Design": [],
  "Infrastructure & DevOps": [
    { name: "GDG Lomé", url: "https://gdg.community.dev/gdg-lome/", note: "Ateliers Google Cloud.", noteEn: "Google Cloud workshops." },
    { name: "MLSA Togo", url: "https://mlsatogo.vercel.app/", note: "Programme Microsoft (Azure, GitHub) avec parcours de mentorat intégré.", noteEn: "Microsoft program (Azure, GitHub) with a built-in mentorship track." },
    { name: "Chapitre Togolais d'Internet Society (ISOC Togo)", nameEn: "Togolese Chapter of Internet Society (ISOC Togo)", url: "https://www.internetsociety.tg", note: "Réseaux communautaires locaux pour l'accès à Internet.", noteEn: "Local community networks for Internet access." },
  ],
  "Marketing digital": [
    { name: "LinkedIn Local Togo", url: "https://www.facebook.com/people/Linkedln-Local-Togo/61557712180082/", note: "Réseautage professionnel togolais.", noteEn: "Togolese professional networking." },
  ],
  "Gestion & Management": [
    { name: "LinkedIn Local Togo", url: "https://www.facebook.com/people/Linkedln-Local-Togo/61557712180082/", note: "Réseautage professionnel togolais.", noteEn: "Togolese professional networking." },
  ],
};

const SKILLS = {
  "git-github": {
    type: "skill",
    domain: "Développement",
    title: "Git & GitHub",
    titleEn: "Git & GitHub",
    subtitle: "Le contrôle de version, un incontournable pour tous les métiers tech",
    subtitleEn: "Version control, essential for every tech role",
    icon: "git-branch",
    sections: [
      {
        title: "1. Bases de Git", titleEn: "1. Git basics",
        items: [
          { label: "Installation et configuration (git config)", labelEn: "Installation and configuration (git config)", level: "core", resource: { label: "Git - Guide de démarrage", labelEn: "Git - Getting started guide", url: "https://git-scm.com/book/fr/v2/D%C3%A9marrage-rapide-Param%C3%A9trage-%C3%A0-la-premi%C3%A8re-utilisation-de-Git" } },
          { label: "init, add, commit, status, log", labelEn: "init, add, commit, status, log", level: "core" },
          { label: "Fichier .gitignore", labelEn: ".gitignore file", level: "core" }
        ]
      },
      {
        title: "2. Branches et fusion", titleEn: "2. Branches and merging",
        items: [
          { label: "Créer, changer, fusionner une branche (merge)", labelEn: "Creating, switching and merging a branch (merge)", level: "core" },
          { label: "Gérer les conflits", labelEn: "Resolving conflicts", level: "core" },
          { label: "Rebase", labelEn: "Rebase", level: "option" },
          { label: "stash, cherry-pick, tags de version", labelEn: "stash, cherry-pick, version tags", level: "option" }
        ]
      },
      {
        title: "3. Travailler avec GitHub", titleEn: "3. Working with GitHub",
        items: [
          { label: "Créer un dépôt, remote, push, pull, clone", labelEn: "Creating a repository, remote, push, pull, clone", level: "core", resource: { label: "GitHub Docs - Démarrer", labelEn: "GitHub Docs - Getting started", url: "https://docs.github.com/fr/get-started" } },
          { label: "Pull requests et revue de code", labelEn: "Pull requests and code review", level: "core" },
          { label: "Issues, projects, GitHub Actions", labelEn: "Issues, projects, GitHub Actions", level: "option", resource: { label: "Documentation GitHub Actions", labelEn: "GitHub Actions documentation", url: "https://docs.github.com/fr/actions" } }
        ]
      },
      {
        title: "4. Bonnes pratiques", titleEn: "4. Best practices",
        items: [
          { label: "Convention de nommage des commits (Conventional Commits)", labelEn: "Commit naming convention (Conventional Commits)", level: "core" },
          { label: "GitFlow ou trunk-based development", labelEn: "GitFlow or trunk-based development", level: "option" }
        ]
      },
      {
        title: "5. Certification", titleEn: "5. Certification",
        items: [
          { label: "GitHub Foundations : certification d'entrée validant les bases de la plateforme", labelEn: "GitHub Foundations: an entry-level certification covering the platform basics", level: "option", resource: { label: "GitHub Learn - Certifications", labelEn: "GitHub Learn - Certifications", url: "https://learn.github.com/certifications" } }
        ]
      }
    ]
  },

  "linux": {
    type: "skill",
    domain: "Infrastructure & DevOps",
    title: "Linux & Ligne de commande",
    titleEn: "Linux & Command Line",
    subtitle: "Administration système et manipulation en ligne de commande",
    subtitleEn: "System administration and command-line skills",
    icon: "terminal",
    sections: [
      {
        title: "1. Bases", titleEn: "1. Basics",
        items: [
          { label: "Système de fichiers, navigation (cd, ls, pwd)", labelEn: "File system, navigation (cd, ls, pwd)", level: "core", resource: { label: "Documentation Ubuntu - Bases du terminal", labelEn: "Ubuntu documentation - Command line basics", url: "https://ubuntu.com/tutorials/command-line-for-beginners" } },
          { label: "Manipulation de fichiers (cp, mv, rm, mkdir)", labelEn: "File manipulation (cp, mv, rm, mkdir)", level: "core" },
          { label: "Permissions (chmod, chown)", labelEn: "Permissions (chmod, chown)", level: "core" }
        ]
      },
      {
        title: "2. Processus et services", titleEn: "2. Processes and services",
        items: [
          { label: "Gestion des processus (ps, top, kill)", labelEn: "Process management (ps, top, kill)", level: "core" },
          { label: "Services systemd", labelEn: "systemd services", level: "core" }
        ]
      },
      {
        title: "3. Traitement de texte et scripting", titleEn: "3. Text processing and scripting",
        items: [
          { label: "Pipes et redirections, grep, sed, awk", labelEn: "Pipes and redirections, grep, sed, awk", level: "core" },
          { label: "Scripts bash, variables, boucles, conditions", labelEn: "Bash scripts, variables, loops, conditions", level: "core" },
          { label: "Cron pour les tâches planifiées", labelEn: "Cron for scheduled tasks", level: "option" }
        ]
      },
      {
        title: "4. Réseau et paquets", titleEn: "4. Networking and packages",
        items: [
          { label: "Gestion de paquets (apt, yum)", labelEn: "Package management (apt, yum)", level: "core" },
          { label: "Commandes réseau de base (ping, curl, ssh)", labelEn: "Basic network commands (ping, curl, ssh)", level: "core" },
          { label: "Authentification par clés SSH", labelEn: "SSH key authentication", level: "option" },
          { label: "Variables d'environnement et fichiers de configuration shell", labelEn: "Environment variables and shell configuration files", level: "option" }
        ]
      }
    ]
  },

  "docker": {
    type: "skill",
    domain: "Infrastructure & DevOps",
    title: "Docker & Conteneurisation",
    titleEn: "Docker & Containerization",
    subtitle: "Empaqueter et exécuter des applications de façon reproductible",
    subtitleEn: "Packaging and running applications reproducibly",
    icon: "package",
    sections: [
      {
        title: "1. Concepts", titleEn: "1. Concepts",
        items: [
          { label: "Différence conteneur / machine virtuelle", labelEn: "Containers vs virtual machines", level: "core", resource: { label: "Docker - Vue d'ensemble", labelEn: "Docker - Overview", url: "https://docs.docker.com/get-started/docker-overview/" } },
          { label: "Images et conteneurs", labelEn: "Images and containers", level: "core" }
        ]
      },
      {
        title: "2. Utilisation", titleEn: "2. Usage",
        items: [
          { label: "Dockerfile : construire une image, .dockerignore", labelEn: "Dockerfile: building an image, .dockerignore", level: "core", resource: { label: "Docker - Référence Dockerfile", labelEn: "Docker - Dockerfile reference", url: "https://docs.docker.com/reference/dockerfile/" } },
          { label: "Volumes et persistance des données", labelEn: "Volumes and data persistence", level: "core" },
          { label: "Réseaux Docker", labelEn: "Docker networks", level: "core" },
          { label: "Registres d'images : Docker Hub, registres privés", labelEn: "Image registries: Docker Hub, private registries", level: "option" }
        ]
      },
      {
        title: "3. Multi-conteneurs", titleEn: "3. Multi-container setups",
        items: [
          { label: "Docker Compose pour les environnements de développement", labelEn: "Docker Compose for development environments", level: "core", resource: { label: "Docker Compose - Documentation", labelEn: "Docker Compose - Documentation", url: "https://docs.docker.com/compose/" } }
        ]
      },
      {
        title: "4. Pour aller plus loin", titleEn: "4. Going further",
        items: [
          { label: "Optimisation d'images (multi-stage build)", labelEn: "Image optimization (multi-stage builds)", level: "option" },
          { label: "Scan de vulnérabilités des images (Docker Scout, Trivy)", labelEn: "Image vulnerability scanning (Docker Scout, Trivy)", level: "option" },
          { label: "Orchestration avec Kubernetes", labelEn: "Orchestration with Kubernetes", level: "option", resource: { label: "Documentation Kubernetes", labelEn: "Kubernetes documentation", url: "https://kubernetes.io/fr/docs/home/" } }
        ]
      }
    ]
  },

  "sql": {
    type: "skill",
    domain: "Data & IA",
    title: "SQL & Bases de données relationnelles",
    titleEn: "SQL & Relational Databases",
    subtitle: "Modéliser, interroger et optimiser des données structurées",
    subtitleEn: "Modeling, querying and optimizing structured data",
    icon: "table",
    sections: [
      {
        title: "1. Bases", titleEn: "1. Basics",
        items: [
          { label: "SELECT, WHERE, ORDER BY, LIMIT", labelEn: "SELECT, WHERE, ORDER BY, LIMIT", level: "core", resource: { label: "PostgreSQL - Tutoriel", labelEn: "PostgreSQL - Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" } },
          { label: "Types de données et contraintes", labelEn: "Data types and constraints", level: "core" }
        ]
      },
      {
        title: "2. Modélisation", titleEn: "2. Modeling",
        items: [
          { label: "Clés primaires, clés étrangères", labelEn: "Primary keys, foreign keys", level: "core" },
          { label: "Normalisation (1NF, 2NF, 3NF)", labelEn: "Normalization (1NF, 2NF, 3NF)", level: "core" }
        ]
      },
      {
        title: "3. Requêtes avancées", titleEn: "3. Advanced queries",
        items: [
          { label: "Jointures (INNER, LEFT, RIGHT, FULL OUTER)", labelEn: "Joins (INNER, LEFT, RIGHT, FULL OUTER)", level: "core" },
          { label: "Agrégations (GROUP BY, HAVING)", labelEn: "Aggregations (GROUP BY, HAVING)", level: "core" },
          { label: "Sous-requêtes et CTE", labelEn: "Subqueries and CTEs", level: "option" },
          { label: "Fonctions de fenêtrage (window functions)", labelEn: "Window functions", level: "option" }
        ]
      },
      {
        title: "4. Performance", titleEn: "4. Performance",
        items: [
          { label: "Index et plans d'exécution", labelEn: "Indexes and execution plans", level: "core" },
          { label: "Transactions et niveaux d'isolation", labelEn: "Transactions and isolation levels", level: "option" },
          { label: "Vues et procédures stockées", labelEn: "Views and stored procedures", level: "option" }
        ]
      }
    ]
  },

  "javascript": {
    type: "skill",
    domain: "Développement",
    title: "JavaScript",
    titleEn: "JavaScript",
    subtitle: "Le langage du web, côté client comme côté serveur",
    subtitleEn: "The language of the web, on both client and server",
    icon: "braces",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Variables, types, opérateurs", labelEn: "Variables, types, operators", level: "core", resource: { label: "MDN - Réapprendre JavaScript", labelEn: "MDN - A re-introduction to JavaScript", url: "https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide" } },
          { label: "Fonctions, portée (scope) et closures", labelEn: "Functions, scope and closures", level: "core" },
          { label: "Tableaux et objets", labelEn: "Arrays and objects", level: "core" },
          { label: "Le mot-clé this et prototypes", labelEn: "The this keyword and prototypes", level: "option" }
        ]
      },
      {
        title: "2. ES6+", titleEn: "2. ES6+",
        items: [
          { label: "Arrow functions, template literals", labelEn: "Arrow functions, template literals", level: "core" },
          { label: "Destructuring, spread/rest", labelEn: "Destructuring, spread/rest", level: "core" },
          { label: "Modules import/export", labelEn: "import/export modules", level: "core" }
        ]
      },
      {
        title: "3. Asynchrone", titleEn: "3. Asynchronous code",
        items: [
          { label: "Callbacks et Promises", labelEn: "Callbacks and Promises", level: "core", resource: { label: "MDN - Programmation asynchrone", labelEn: "MDN - Asynchronous programming", url: "https://developer.mozilla.org/fr/docs/Learn/JavaScript/Asynchronous" } },
          { label: "async/await", labelEn: "async/await", level: "core" },
          { label: "fetch API et gestion des erreurs réseau", labelEn: "fetch API and network error handling", level: "core" }
        ]
      },
      {
        title: "4. Environnements et outillage", titleEn: "4. Environments and tooling",
        items: [
          { label: "JavaScript dans le navigateur (DOM, événements)", labelEn: "JavaScript in the browser (DOM, events)", level: "core" },
          { label: "Node.js côté serveur", labelEn: "Node.js on the server", level: "core", resource: { label: "Documentation Node.js", labelEn: "Node.js documentation", url: "https://nodejs.org/fr/docs" } },
          { label: "Bundlers modernes (Vite, Webpack)", labelEn: "Modern bundlers (Vite, Webpack)", level: "option" },
          { label: "Tests unitaires (Jest, Vitest)", labelEn: "Unit tests (Jest, Vitest)", level: "option" }
        ]
      }
    ]
  },

  "python": {
    type: "skill",
    domain: "Développement",
    title: "Python",
    titleEn: "Python",
    subtitle: "Un langage polyvalent : backend, data, automatisation",
    subtitleEn: "A versatile language: backend, data, automation",
    icon: "code",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Syntaxe, types, structures de données", labelEn: "Syntax, types, data structures", level: "core", resource: { label: "Documentation Python", labelEn: "Python documentation", url: "https://docs.python.org/fr/3/tutorial/" } },
          { label: "Fonctions et modules", labelEn: "Functions and modules", level: "core" },
          { label: "Gestion des exceptions (try/except)", labelEn: "Exception handling (try/except)", level: "core" },
          { label: "List/dict comprehensions", labelEn: "List/dict comprehensions", level: "option" }
        ]
      },
      {
        title: "2. Programmation orientée objet", titleEn: "2. Object-oriented programming",
        items: [
          { label: "Classes, héritage, encapsulation", labelEn: "Classes, inheritance, encapsulation", level: "core" },
          { label: "Type hints pour un code plus robuste", labelEn: "Type hints for more robust code", level: "option" }
        ]
      },
      {
        title: "3. Écosystème", titleEn: "3. Ecosystem",
        items: [
          { label: "Gestion des paquets et environnements virtuels (pip, venv, Poetry)", labelEn: "Package management and virtual environments (pip, venv, Poetry)", level: "core" },
          { label: "Tests avec pytest", labelEn: "Testing with pytest", level: "option" }
        ]
      },
      {
        title: "4. Spécialisations", titleEn: "4. Specializations",
        items: [
          { label: "Web : Django ou FastAPI", labelEn: "Web: Django or FastAPI", level: "option", resource: { label: "Documentation FastAPI", labelEn: "FastAPI documentation", url: "https://fastapi.tiangolo.com/" } },
          { label: "Data : Pandas, NumPy", labelEn: "Data: Pandas, NumPy", level: "option", resource: { label: "Documentation Pandas", labelEn: "Pandas documentation", url: "https://pandas.pydata.org/docs/" } },
          { label: "Automatisation de scripts", labelEn: "Script automation", level: "option" }
        ]
      }
    ]
  },

  "reseaux": {
    type: "skill",
    domain: "Infrastructure & DevOps",
    title: "Réseaux TCP/IP",
    titleEn: "TCP/IP Networking",
    subtitle: "Les fondations de toute infrastructure et de la cybersécurité",
    subtitleEn: "The foundations of all infrastructure and cybersecurity",
    icon: "share",
    sections: [
      {
        title: "1. Modèles de référence", titleEn: "1. Reference models",
        items: [
          { label: "Modèle OSI (les 7 couches)", labelEn: "OSI model (the 7 layers)", level: "core" },
          { label: "Modèle TCP/IP", labelEn: "TCP/IP model", level: "core" }
        ]
      },
      {
        title: "2. Adressage", titleEn: "2. Addressing",
        items: [
          { label: "Adressage IPv4, sous-réseaux (subnetting)", labelEn: "IPv4 addressing, subnetting", level: "core" },
          { label: "IPv6, bases", labelEn: "IPv6 basics", level: "option" }
        ]
      },
      {
        title: "3. Équipements et protocoles", titleEn: "3. Equipment and protocols",
        items: [
          { label: "Switching, VLAN", labelEn: "Switching, VLANs", level: "core" },
          { label: "Routage statique et dynamique", labelEn: "Static and dynamic routing", level: "core" },
          { label: "DNS, DHCP, NAT", labelEn: "DNS, DHCP, NAT", level: "core" },
          { label: "HTTP/HTTPS et TLS", labelEn: "HTTP/HTTPS and TLS", level: "core" },
          { label: "Répartition de charge (load balancing)", labelEn: "Load balancing", level: "option" }
        ]
      },
      {
        title: "4. Sécurité réseau de base", titleEn: "4. Basic network security",
        items: [
          { label: "Pare-feu et listes de contrôle d'accès (ACL)", labelEn: "Firewalls and access control lists (ACLs)", level: "core" },
          { label: "VPN", labelEn: "VPN", level: "option" },
          { label: "Outils de diagnostic (Wireshark, traceroute)", labelEn: "Troubleshooting tools (Wireshark, traceroute)", level: "option" }
        ]
      }
    ]
  },

  "cloud": {
    type: "skill",
    domain: "Infrastructure & DevOps",
    title: "Cloud (AWS / Azure / GCP)",
    titleEn: "Cloud (AWS / Azure / GCP)",
    subtitle: "Les fondamentaux communs aux principaux fournisseurs cloud",
    subtitleEn: "The fundamentals common to the major cloud providers",
    icon: "cloud",
    sections: [
      {
        title: "1. Concepts", titleEn: "1. Concepts",
        items: [
          { label: "IaaS, PaaS, SaaS", labelEn: "IaaS, PaaS, SaaS", level: "core" },
          { label: "Régions et zones de disponibilité", labelEn: "Regions and availability zones", level: "core" }
        ]
      },
      {
        title: "2. Services de base", titleEn: "2. Core services",
        items: [
          { label: "Calcul : machines virtuelles (EC2, VM, Compute Engine)", labelEn: "Compute: virtual machines (EC2, VM, Compute Engine)", level: "core", resource: { label: "AWS - Documentation EC2", labelEn: "AWS - EC2 documentation", url: "https://docs.aws.amazon.com/ec2/" } },
          { label: "Stockage objet (S3, Blob Storage, Cloud Storage)", labelEn: "Object storage (S3, Blob Storage, Cloud Storage)", level: "core" },
          { label: "Bases de données managées", labelEn: "Managed databases", level: "core" }
        ]
      },
      {
        title: "3. Réseau et sécurité cloud", titleEn: "3. Cloud networking and security",
        items: [
          { label: "IAM : gestion des accès et permissions", labelEn: "IAM: access and permissions management", level: "core" },
          { label: "VPC et groupes de sécurité", labelEn: "VPCs and security groups", level: "core" }
        ]
      },
      {
        title: "4. Cloud natif", titleEn: "4. Cloud native",
        items: [
          { label: "Fonctions serverless (AWS Lambda, Cloud Functions, Azure Functions)", labelEn: "Serverless functions (AWS Lambda, Cloud Functions, Azure Functions)", level: "option" },
          { label: "Conteneurs managés (ECS, Cloud Run) : voir aussi la roadmap compétence Docker", labelEn: "Managed containers (ECS, Cloud Run): see also the Docker skill roadmap", level: "option", resource: { label: "Voir roadmap compétence Docker", labelEn: "See the Docker skill roadmap", url: "roadmap.html?id=docker" } },
          { label: "CDN pour la distribution de contenu (CloudFront, Cloudflare)", labelEn: "CDN for content delivery (CloudFront, Cloudflare)", level: "option" },
          { label: "Infrastructure as Code", labelEn: "Infrastructure as Code", level: "option", resource: { label: "Voir roadmap compétence Terraform", labelEn: "See the Terraform skill roadmap", url: "roadmap.html?id=terraform" } }
        ]
      },
      {
        title: "5. Pour aller plus loin", titleEn: "5. Going further",
        items: [
          { label: "Facturation et optimisation des coûts", labelEn: "Billing and cost optimization", level: "option" },
          { label: "Certification fondamentale (AWS Cloud Practitioner, etc.)", labelEn: "Fundamentals certification (AWS Cloud Practitioner, etc.)", level: "option" }
        ]
      }
    ]
  },

  "react": {
    type: "skill",
    domain: "Développement",
    title: "React",
    titleEn: "React",
    subtitle: "La bibliothèque JavaScript la plus utilisée pour construire des interfaces",
    subtitleEn: "The most widely used JavaScript library for building interfaces",
    icon: "atom",
    sections: [
      {
        title: "1. Prérequis", titleEn: "1. Prerequisites",
        items: [
          { label: "JavaScript moderne (ES6+)", labelEn: "Modern JavaScript (ES6+)", level: "core", resource: { label: "Voir roadmap compétence JavaScript", labelEn: "See the JavaScript skill roadmap", url: "roadmap.html?id=javascript" } }
        ]
      },
      {
        title: "2. Fondamentaux React", titleEn: "2. React fundamentals",
        items: [
          { label: "Composants et JSX", labelEn: "Components and JSX", level: "core", resource: { label: "React - Apprendre", labelEn: "React - Learn", url: "https://react.dev/learn" } },
          { label: "Props et state", labelEn: "Props and state", level: "core" },
          { label: "Hooks : useState, useEffect, useRef", labelEn: "Hooks: useState, useEffect, useRef", level: "core" }
        ]
      },
      {
        title: "3. Concepts avancés", titleEn: "3. Advanced concepts",
        items: [
          { label: "Gestion d'état globale (Context, Zustand, Redux)", labelEn: "Global state management (Context, Zustand, Redux)", level: "core" },
          { label: "Routing avec React Router", labelEn: "Routing with React Router", level: "core" },
          { label: "Hooks personnalisés", labelEn: "Custom hooks", level: "option" },
          { label: "Optimisation des performances (useMemo, useCallback, memo)", labelEn: "Performance optimization (useMemo, useCallback, memo)", level: "option" }
        ]
      },
      {
        title: "4. Écosystème", titleEn: "4. Ecosystem",
        items: [
          { label: "Next.js pour le rendu côté serveur et les server components", labelEn: "Next.js for server-side rendering and server components", level: "option", resource: { label: "Documentation Next.js", labelEn: "Next.js documentation", url: "https://nextjs.org/docs" } },
          { label: "Tests avec React Testing Library", labelEn: "Testing with React Testing Library", level: "option" }
        ]
      }
    ]
  },

  "vue": {
    type: "skill",
    domain: "Développement",
    title: "Vue.js",
    titleEn: "Vue.js",
    subtitle: "Framework JavaScript progressif, apprécié pour sa courbe d'apprentissage douce",
    subtitleEn: "A progressive JavaScript framework, valued for its gentle learning curve",
    icon: "vue",
    sections: [
      {
        title: "1. Prérequis", titleEn: "1. Prerequisites",
        items: [
          { label: "JavaScript moderne (ES6+)", labelEn: "Modern JavaScript (ES6+)", level: "core", resource: { label: "Voir roadmap compétence JavaScript", labelEn: "See the JavaScript skill roadmap", url: "roadmap.html?id=javascript" } }
        ]
      },
      {
        title: "2. Fondamentaux", titleEn: "2. Fundamentals",
        items: [
          { label: "Templates et directives, composants monofichiers (SFC)", labelEn: "Templates and directives, single-file components (SFC)", level: "core", resource: { label: "Documentation Vue.js", labelEn: "Vue.js documentation", url: "https://vuejs.org/guide/introduction.html" } },
          { label: "Composants et props", labelEn: "Components and props", level: "core" },
          { label: "Composition API : ref, reactive, cycle de vie", labelEn: "Composition API: ref, reactive, lifecycle", level: "core" }
        ]
      },
      {
        title: "3. Concepts avancés", titleEn: "3. Advanced concepts",
        items: [
          { label: "Gestion d'état avec Pinia", labelEn: "State management with Pinia", level: "core" },
          { label: "Vue Router", labelEn: "Vue Router", level: "core" }
        ]
      },
      {
        title: "4. Écosystème", titleEn: "4. Ecosystem",
        items: [
          { label: "Nuxt.js pour le rendu côté serveur", labelEn: "Nuxt.js for server-side rendering", level: "option", resource: { label: "Documentation Nuxt", labelEn: "Nuxt documentation", url: "https://nuxt.com/docs" } },
          { label: "Tests avec Vitest", labelEn: "Testing with Vitest", level: "option" }
        ]
      }
    ]
  },

  "typescript": {
    type: "skill",
    domain: "Développement",
    title: "TypeScript",
    titleEn: "TypeScript",
    subtitle: "JavaScript typé pour des applications plus robustes et maintenables",
    subtitleEn: "Typed JavaScript for more robust, maintainable applications",
    icon: "type",
    sections: [
      {
        title: "1. Prérequis", titleEn: "1. Prerequisites",
        items: [
          { label: "Bases solides en JavaScript", labelEn: "Solid JavaScript foundations", level: "core", resource: { label: "Voir roadmap compétence JavaScript", labelEn: "See the JavaScript skill roadmap", url: "roadmap.html?id=javascript" } }
        ]
      },
      {
        title: "2. Fondamentaux", titleEn: "2. Fundamentals",
        items: [
          { label: "Types de base, interfaces, types personnalisés", labelEn: "Basic types, interfaces, custom types", level: "core", resource: { label: "Documentation TypeScript", labelEn: "TypeScript documentation", url: "https://www.typescriptlang.org/docs/" } },
          { label: "Fonctions typées, génériques", labelEn: "Typed functions, generics", level: "core" },
          { label: "Types union et intersection, enums", labelEn: "Union and intersection types, enums", level: "core" }
        ]
      },
      {
        title: "3. Concepts avancés", titleEn: "3. Advanced concepts",
        items: [
          { label: "Types utilitaires (Partial, Pick, Omit)", labelEn: "Utility types (Partial, Pick, Omit)", level: "core" },
          { label: "Rétrécissement de type (type narrowing, type guards)", labelEn: "Type narrowing (type guards)", level: "option" },
          { label: "Configuration tsconfig.json et mode strict", labelEn: "tsconfig.json configuration and strict mode", level: "core" }
        ]
      },
      {
        title: "4. Intégration", titleEn: "4. Integration",
        items: [
          { label: "TypeScript avec React, Node.js ou Vue", labelEn: "TypeScript with React, Node.js or Vue", level: "option" }
        ]
      }
    ]
  },

  "nodejs": {
    type: "skill",
    domain: "Développement",
    title: "Node.js",
    titleEn: "Node.js",
    subtitle: "Exécuter du JavaScript côté serveur pour construire des API et services",
    subtitleEn: "Running JavaScript on the server to build APIs and services",
    icon: "hexagon",
    sections: [
      {
        title: "1. Prérequis", titleEn: "1. Prerequisites",
        items: [
          { label: "JavaScript asynchrone", labelEn: "Asynchronous JavaScript", level: "core", resource: { label: "Voir roadmap compétence JavaScript", labelEn: "See the JavaScript skill roadmap", url: "roadmap.html?id=javascript" } }
        ]
      },
      {
        title: "2. Fondamentaux", titleEn: "2. Fundamentals",
        items: [
          { label: "Modules, npm/yarn, gestion de paquets", labelEn: "Modules, npm/yarn, package management", level: "core", resource: { label: "Documentation Node.js", labelEn: "Node.js documentation", url: "https://nodejs.org/fr/docs" } },
          { label: "Système de fichiers et event loop", labelEn: "File system and the event loop", level: "core" }
        ]
      },
      {
        title: "3. Construction d'API", titleEn: "3. Building APIs",
        items: [
          { label: "Express.js : routes, middlewares", labelEn: "Express.js: routes, middleware", level: "core", resource: { label: "Documentation Express", labelEn: "Express documentation", url: "https://expressjs.com/fr/starter/installing.html" } },
          { label: "Alternatives : NestJS, Fastify", labelEn: "Alternatives: NestJS, Fastify", level: "option" },
          { label: "Gestion des erreurs et validation", labelEn: "Error handling and validation", level: "core" }
        ]
      },
      {
        title: "4. Production", titleEn: "4. Production",
        items: [
          { label: "Variables d'environnement, logs, tests", labelEn: "Environment variables, logs, tests", level: "core" },
          { label: "Gestion de processus (PM2) et mise à l'échelle", labelEn: "Process management (PM2) and scaling", level: "option" }
        ]
      }
    ]
  },

  "java": {
    type: "skill",
    domain: "Développement",
    title: "Java",
    titleEn: "Java",
    subtitle: "Langage orienté objet incontournable dans les systèmes d'entreprise",
    subtitleEn: "An essential object-oriented language in enterprise systems",
    icon: "coffee",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Syntaxe, types, structures de contrôle", labelEn: "Syntax, types, control structures", level: "core", resource: { label: "Documentation Java (Oracle)", labelEn: "Java documentation (Oracle)", url: "https://docs.oracle.com/en/java/" } },
          { label: "Programmation orientée objet", labelEn: "Object-oriented programming", level: "core" },
          { label: "Gestion des exceptions", labelEn: "Exception handling", level: "core" }
        ]
      },
      {
        title: "2. Écosystème", titleEn: "2. Ecosystem",
        items: [
          { label: "Gestion de dépendances : Maven ou Gradle", labelEn: "Dependency management: Maven or Gradle", level: "core" },
          { label: "Collections, généricité, Streams API", labelEn: "Collections, generics, Streams API", level: "core" },
          { label: "Bases du multithreading", labelEn: "Multithreading basics", level: "option" }
        ]
      },
      {
        title: "3. Développement d'applications", titleEn: "3. Application development",
        items: [
          { label: "Spring Boot pour les API REST", labelEn: "Spring Boot for REST APIs", level: "core", resource: { label: "Documentation Spring Boot", labelEn: "Spring Boot documentation", url: "https://spring.io/projects/spring-boot" } },
          { label: "JPA/Hibernate pour l'accès aux données", labelEn: "JPA/Hibernate for data access", level: "core" }
        ]
      },
      {
        title: "4. Tests et qualité", titleEn: "4. Testing and quality",
        items: [
          { label: "Tests unitaires avec JUnit", labelEn: "Unit testing with JUnit", level: "core" }
        ]
      },
      {
        title: "5. Certification", titleEn: "5. Certification",
        items: [
          { label: "Oracle Certified Professional: Java : certification de référence pour ce langage", labelEn: "Oracle Certified Professional: Java: the benchmark certification for this language", level: "option", resource: { label: "Oracle University - Certifications", labelEn: "Oracle University - Certifications", url: "https://education.oracle.com/" } }
        ]
      }
    ]
  },

  "cpp": {
    type: "skill",
    domain: "Développement",
    title: "C++",
    titleEn: "C++",
    subtitle: "Langage bas niveau pour la performance : jeux, systèmes, finance",
    subtitleEn: "A low-level language for performance: games, systems, finance",
    icon: "plus-square",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Syntaxe, types, pointeurs et références", labelEn: "Syntax, types, pointers and references", level: "core", resource: { label: "cppreference.com", labelEn: "cppreference.com", url: "https://en.cppreference.com/w/" } },
          { label: "Gestion manuelle de la mémoire", labelEn: "Manual memory management", level: "core" }
        ]
      },
      {
        title: "2. Programmation orientée objet", titleEn: "2. Object-oriented programming",
        items: [
          { label: "Classes, héritage, polymorphisme", labelEn: "Classes, inheritance, polymorphism", level: "core" }
        ]
      },
      {
        title: "3. Bibliothèque standard", titleEn: "3. Standard library",
        items: [
          { label: "STL : conteneurs, algorithmes, itérateurs", labelEn: "STL: containers, algorithms, iterators", level: "core" },
          { label: "Smart pointers (RAII)", labelEn: "Smart pointers (RAII)", level: "core" },
          { label: "Templates et programmation générique", labelEn: "Templates and generic programming", level: "option" }
        ]
      },
      {
        title: "4. Outils et applications", titleEn: "4. Tools and applications",
        items: [
          { label: "Systèmes de build (CMake)", labelEn: "Build systems (CMake)", level: "option" },
          { label: "Fonctionnalités modernes (C++17/20)", labelEn: "Modern features (C++17/20)", level: "option" },
          { label: "Utilisation courante : moteurs de jeu, robotique, calcul haute performance", labelEn: "Common uses: game engines, robotics, high-performance computing", level: "core" }
        ]
      }
    ]
  },

  "go": {
    type: "skill",
    domain: "Développement",
    title: "Go (Golang)",
    titleEn: "Go (Golang)",
    subtitle: "Langage simple et performant, très utilisé pour les services cloud et DevOps",
    subtitleEn: "A simple, high-performance language widely used for cloud and DevOps services",
    icon: "zap",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Syntaxe, types, structs et interfaces", labelEn: "Syntax, types, structs and interfaces", level: "core", resource: { label: "Documentation Go", labelEn: "Go documentation", url: "https://go.dev/doc/" } },
          { label: "Gestion des erreurs à la Go, defer/panic/recover", labelEn: "Go-style error handling, defer/panic/recover", level: "core" }
        ]
      },
      {
        title: "2. Concurrence", titleEn: "2. Concurrency",
        items: [
          { label: "Goroutines et channels", labelEn: "Goroutines and channels", level: "core" }
        ]
      },
      {
        title: "3. Écosystème", titleEn: "3. Ecosystem",
        items: [
          { label: "Modules Go, gestion de dépendances", labelEn: "Go modules, dependency management", level: "core" },
          { label: "Construction d'API avec net/http ou Gin", labelEn: "Building APIs with net/http or Gin", level: "core" },
          { label: "Tests avec le package testing intégré", labelEn: "Testing with the built-in testing package", level: "option" }
        ]
      },
      {
        title: "4. Applications", titleEn: "4. Applications",
        items: [
          { label: "Utilisation courante : outils cloud-native, CLI, microservices", labelEn: "Common uses: cloud-native tools, CLIs, microservices", level: "core" }
        ]
      }
    ]
  },

  "php": {
    type: "skill",
    domain: "Développement",
    title: "PHP",
    titleEn: "PHP",
    subtitle: "Langage serveur très répandu pour le développement web",
    subtitleEn: "A widely used server-side language for web development",
    icon: "file-code",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Syntaxe, types, structures de contrôle", labelEn: "Syntax, types, control structures", level: "core", resource: { label: "Documentation PHP", labelEn: "PHP documentation", url: "https://www.php.net/manual/fr/" } }
        ]
      },
      {
        title: "2. Programmation orientée objet", titleEn: "2. Object-oriented programming",
        items: [
          { label: "Classes, interfaces, namespaces", labelEn: "Classes, interfaces, namespaces", level: "core" }
        ]
      },
      {
        title: "3. Écosystème", titleEn: "3. Ecosystem",
        items: [
          { label: "Composer : gestion de dépendances", labelEn: "Composer: dependency management", level: "core" },
          { label: "Laravel : routes, Eloquent ORM, migrations", labelEn: "Laravel: routes, Eloquent ORM, migrations", level: "core", resource: { label: "Documentation Laravel", labelEn: "Laravel documentation", url: "https://laravel.com/docs" } },
          { label: "WordPress : le CMS PHP le plus utilisé au monde", labelEn: "WordPress: the most widely used PHP CMS in the world", level: "option" }
        ]
      },
      {
        title: "4. Bonnes pratiques", titleEn: "4. Best practices",
        items: [
          { label: "Sécurité web de base (injection, XSS)", labelEn: "Basic web security (injection, XSS)", level: "core" },
          { label: "Standards PSR et tests avec PHPUnit", labelEn: "PSR standards and testing with PHPUnit", level: "option" }
        ]
      }
    ]
  },

  "kubernetes": {
    type: "skill",
    domain: "Infrastructure & DevOps",
    title: "Kubernetes",
    titleEn: "Kubernetes",
    subtitle: "Orchestrer des conteneurs à grande échelle",
    subtitleEn: "Orchestrating containers at scale",
    icon: "helm",
    sections: [
      {
        title: "1. Prérequis", titleEn: "1. Prerequisites",
        items: [
          { label: "Conteneurisation avec Docker", labelEn: "Containerization with Docker", level: "core", resource: { label: "Voir roadmap compétence Docker", labelEn: "See the Docker skill roadmap", url: "roadmap.html?id=docker" } }
        ]
      },
      {
        title: "2. Concepts de base", titleEn: "2. Core concepts",
        items: [
          { label: "Pods, deployments, services", labelEn: "Pods, deployments, services", level: "core", resource: { label: "Documentation Kubernetes", labelEn: "Kubernetes documentation", url: "https://kubernetes.io/fr/docs/home/" } },
          { label: "ConfigMaps et Secrets", labelEn: "ConfigMaps and Secrets", level: "core" },
          { label: "Namespaces pour l'isolation logique", labelEn: "Namespaces for logical isolation", level: "option" }
        ]
      },
      {
        title: "3. Réseau et stockage", titleEn: "3. Networking and storage",
        items: [
          { label: "Ingress et exposition des services", labelEn: "Ingress and exposing services", level: "core" },
          { label: "Volumes persistants", labelEn: "Persistent volumes", level: "option" }
        ]
      },
      {
        title: "4. Exploitation", titleEn: "4. Operations",
        items: [
          { label: "Helm pour le packaging d'applications", labelEn: "Helm for packaging applications", level: "option" },
          { label: "kubectl et debugging de base", labelEn: "kubectl and basic debugging", level: "core" },
          { label: "Mise à l'échelle automatique (HPA) et rolling updates", labelEn: "Autoscaling (HPA) and rolling updates", level: "option" }
        ]
      }
    ]
  },

  "terraform": {
    type: "skill",
    domain: "Infrastructure & DevOps",
    title: "Terraform",
    titleEn: "Terraform",
    subtitle: "Gérer son infrastructure comme du code, de façon reproductible",
    subtitleEn: "Managing infrastructure as code, reproducibly",
    icon: "globe",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Concepts Infrastructure as Code", labelEn: "Infrastructure as Code concepts", level: "core", resource: { label: "Documentation Terraform", labelEn: "Terraform documentation", url: "https://developer.hashicorp.com/terraform/docs" } },
          { label: "Syntaxe HCL", labelEn: "HCL syntax", level: "core" }
        ]
      },
      {
        title: "2. Utilisation", titleEn: "2. Usage",
        items: [
          { label: "Providers, ressources, variables", labelEn: "Providers, resources, variables", level: "core" },
          { label: "State et backends distants, verrouillage du state", labelEn: "State and remote backends, state locking", level: "core" }
        ]
      },
      {
        title: "3. Organisation", titleEn: "3. Organization",
        items: [
          { label: "Modules réutilisables", labelEn: "Reusable modules", level: "core" },
          { label: "Workspaces pour gérer plusieurs environnements", labelEn: "Workspaces to manage several environments", level: "option" }
        ]
      },
      {
        title: "4. Bonnes pratiques", titleEn: "4. Best practices",
        items: [
          { label: "Plan/apply en toute sécurité, gestion des environnements", labelEn: "Safe plan/apply, environment management", level: "core" },
          { label: "Import d'infrastructure existante", labelEn: "Importing existing infrastructure", level: "option" }
        ]
      }
    ]
  },

  "flutter": {
    type: "skill",
    domain: "Développement",
    title: "Flutter",
    titleEn: "Flutter",
    subtitle: "Créer des applications mobiles natives pour Android et iOS avec un seul code",
    subtitleEn: "Building native mobile apps for Android and iOS from a single codebase",
    icon: "feather",
    sections: [
      {
        title: "1. Prérequis", titleEn: "1. Prerequisites",
        items: [
          { label: "Bases du langage Dart", labelEn: "Dart language basics", level: "core", resource: { label: "Documentation Dart", labelEn: "Dart documentation", url: "https://dart.dev/guides" } }
        ]
      },
      {
        title: "2. Fondamentaux Flutter", titleEn: "2. Flutter fundamentals",
        items: [
          { label: "Widgets et arbre de widgets, StatelessWidget/StatefulWidget", labelEn: "Widgets and the widget tree, StatelessWidget/StatefulWidget", level: "core", resource: { label: "Documentation Flutter", labelEn: "Flutter documentation", url: "https://docs.flutter.dev/" } },
          { label: "Layouts et navigation", labelEn: "Layouts and navigation", level: "core" },
          { label: "Hot reload pour le développement rapide", labelEn: "Hot reload for fast development", level: "option" }
        ]
      },
      {
        title: "3. Gestion d'état", titleEn: "3. State management",
        items: [
          { label: "Provider ou Riverpod", labelEn: "Provider or Riverpod", level: "core" }
        ]
      },
      {
        title: "4. Intégration et tests", titleEn: "4. Integration and testing",
        items: [
          { label: "Appels API et stockage local", labelEn: "API calls and local storage", level: "core" },
          { label: "Tests de widgets", labelEn: "Widget tests", level: "option" },
          { label: "Publication sur Play Store et App Store", labelEn: "Publishing on the Play Store and App Store", level: "option" }
        ]
      }
    ]
  },

  "kotlin-android": {
    type: "skill",
    domain: "Développement",
    title: "Kotlin & Android natif",
    titleEn: "Kotlin & Native Android",
    subtitle: "Développer des applications Android natives modernes",
    subtitleEn: "Building modern native Android applications",
    icon: "smartphone",
    sections: [
      {
        title: "1. Fondamentaux Kotlin", titleEn: "1. Kotlin fundamentals",
        items: [
          { label: "Syntaxe, null-safety, fonctions", labelEn: "Syntax, null safety, functions", level: "core", resource: { label: "Android Developers - Kotlin", labelEn: "Android Developers - Kotlin", url: "https://developer.android.com/kotlin" } },
          { label: "Coroutines pour la programmation asynchrone", labelEn: "Coroutines for asynchronous programming", level: "core" }
        ]
      },
      {
        title: "2. Développement Android", titleEn: "2. Android development",
        items: [
          { label: "Activities, Fragments, cycle de vie", labelEn: "Activities, Fragments, lifecycle", level: "core" },
          { label: "Jetpack Compose pour l'UI", labelEn: "Jetpack Compose for the UI", level: "core" },
          { label: "Room pour le stockage local", labelEn: "Room for local storage", level: "option" }
        ]
      },
      {
        title: "3. Architecture", titleEn: "3. Architecture",
        items: [
          { label: "MVVM et ViewModel", labelEn: "MVVM and ViewModel", level: "core" },
          { label: "Injection de dépendances (Hilt, Koin)", labelEn: "Dependency injection (Hilt, Koin)", level: "option" }
        ]
      },
      {
        title: "4. Publication", titleEn: "4. Publishing",
        items: [
          { label: "Google Play Console", labelEn: "Google Play Console", level: "option", resource: { label: "Play Console - Guide de lancement", labelEn: "Play Console - Launch guide", url: "https://support.google.com/googleplay/android-developer/answer/9859152" } }
        ]
      }
    ]
  },

  "swift-ios": {
    type: "skill",
    domain: "Développement",
    title: "Swift & iOS natif",
    titleEn: "Swift & Native iOS",
    subtitle: "Développer des applications iOS natives avec Swift",
    subtitleEn: "Building native iOS applications with Swift",
    icon: "tablet",
    sections: [
      {
        title: "1. Fondamentaux Swift", titleEn: "1. Swift fundamentals",
        items: [
          { label: "Syntaxe, optionnels, structures et classes", labelEn: "Syntax, optionals, structs and classes", level: "core", resource: { label: "Apple Developer - Swift", labelEn: "Apple Developer - Swift", url: "https://developer.apple.com/swift/" } },
          { label: "Concurrence moderne : async/await", labelEn: "Modern concurrency: async/await", level: "core" }
        ]
      },
      {
        title: "2. Développement iOS", titleEn: "2. iOS development",
        items: [
          { label: "SwiftUI pour l'interface", labelEn: "SwiftUI for the interface", level: "core" },
          { label: "Cycle de vie d'une application iOS", labelEn: "iOS app lifecycle", level: "core" },
          { label: "Core Data pour le stockage local", labelEn: "Core Data for local storage", level: "option" }
        ]
      },
      {
        title: "3. Architecture", titleEn: "3. Architecture",
        items: [
          { label: "MVVM en environnement Apple", labelEn: "MVVM in the Apple ecosystem", level: "core" }
        ]
      },
      {
        title: "4. Publication", titleEn: "4. Publishing",
        items: [
          { label: "App Store Connect", labelEn: "App Store Connect", level: "option" }
        ]
      }
    ]
  },

  "mongodb": {
    type: "skill",
    domain: "Data & IA",
    title: "MongoDB & NoSQL",
    titleEn: "MongoDB & NoSQL",
    subtitle: "Bases de données orientées documents pour des besoins flexibles",
    subtitleEn: "Document-oriented databases for flexible needs",
    icon: "leaf",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Modèle orienté documents, collections", labelEn: "Document-oriented model, collections", level: "core", resource: { label: "Documentation MongoDB", labelEn: "MongoDB documentation", url: "https://www.mongodb.com/docs/manual/" } }
        ]
      },
      {
        title: "2. Requêtes", titleEn: "2. Queries",
        items: [
          { label: "CRUD, requêtes et pipeline d'agrégation", labelEn: "CRUD, queries and the aggregation pipeline", level: "core" }
        ]
      },
      {
        title: "3. Modélisation et mise à l'échelle", titleEn: "3. Modeling and scaling",
        items: [
          { label: "Modélisation orientée documents vs relationnelle", labelEn: "Document-oriented vs relational modeling", level: "core" },
          { label: "Index et performance", labelEn: "Indexes and performance", level: "core" },
          { label: "Réplication et sharding pour la montée en charge", labelEn: "Replication and sharding to scale", level: "option" }
        ]
      },
      {
        title: "4. Écosystème", titleEn: "4. Ecosystem",
        items: [
          { label: "Mongoose (Node.js) ou drivers officiels", labelEn: "Mongoose (Node.js) or official drivers", level: "option" },
          { label: "Autres familles NoSQL : clé-valeur (Redis), colonnes larges (Cassandra)", labelEn: "Other NoSQL families: key-value (Redis), wide-column (Cassandra)", level: "option" }
        ]
      }
    ]
  },

  "graphql": {
    type: "skill",
    domain: "Développement",
    title: "GraphQL",
    titleEn: "GraphQL",
    subtitle: "Un langage de requête flexible pour les API",
    subtitleEn: "A flexible query language for APIs",
    icon: "triangle",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Schémas, types, requêtes et mutations", labelEn: "Schemas, types, queries and mutations", level: "core", resource: { label: "Documentation GraphQL", labelEn: "GraphQL documentation", url: "https://graphql.org/learn/" } }
        ]
      },
      {
        title: "2. Différence avec REST", titleEn: "2. How it differs from REST",
        items: [
          { label: "Avantages et compromis face à une API REST", labelEn: "Advantages and trade-offs compared to a REST API", level: "core" }
        ]
      },
      {
        title: "3. Implémentation", titleEn: "3. Implementation",
        items: [
          { label: "Serveur GraphQL (Apollo Server ou équivalent)", labelEn: "GraphQL server (Apollo Server or equivalent)", level: "core" },
          { label: "Résolveurs (resolvers)", labelEn: "Resolvers", level: "core" },
          { label: "Subscriptions pour les données temps réel", labelEn: "Subscriptions for real-time data", level: "option" },
          { label: "Problème du N+1 et DataLoader", labelEn: "The N+1 problem and DataLoader", level: "option" }
        ]
      },
      {
        title: "4. Côté client", titleEn: "4. Client side",
        items: [
          { label: "Client Apollo ou urql", labelEn: "Apollo Client or urql", level: "option" }
        ]
      }
    ]
  },

  "machine-learning": {
    type: "skill",
    domain: "Data & IA",
    title: "Machine Learning",
    titleEn: "Machine Learning",
    subtitle: "Entraîner des modèles capables d'apprendre à partir de données",
    subtitleEn: "Training models that can learn from data",
    icon: "network",
    sections: [
      {
        title: "1. Prérequis", titleEn: "1. Prerequisites",
        items: [
          { label: "Python et manipulation de données", labelEn: "Python and data manipulation", level: "core", resource: { label: "Voir roadmap compétence Python", labelEn: "See the Python skill roadmap", url: "roadmap.html?id=python" } },
          { label: "Statistiques et algèbre linéaire de base", labelEn: "Statistics and basic linear algebra", level: "core" }
        ]
      },
      {
        title: "2. Apprentissage supervisé", titleEn: "2. Supervised learning",
        items: [
          { label: "Régression et classification", labelEn: "Regression and classification", level: "core", resource: { label: "Scikit-learn - Tutoriels", labelEn: "Scikit-learn - Tutorials", url: "https://scikit-learn.org/stable/getting_started.html" } },
          { label: "Surapprentissage (overfitting) et régularisation", labelEn: "Overfitting and regularization", level: "core" },
          { label: "Validation croisée et métriques d'évaluation", labelEn: "Cross-validation and evaluation metrics", level: "core" }
        ]
      },
      {
        title: "3. Apprentissage non supervisé", titleEn: "3. Unsupervised learning",
        items: [
          { label: "Clustering, réduction de dimension", labelEn: "Clustering, dimensionality reduction", level: "core" },
          { label: "Feature engineering", labelEn: "Feature engineering", level: "option" }
        ]
      },
      {
        title: "4. Deep Learning", titleEn: "4. Deep Learning",
        items: [
          { label: "Réseaux de neurones, TensorFlow ou PyTorch", labelEn: "Neural networks, TensorFlow or PyTorch", level: "option", resource: { label: "PyTorch - Tutoriels", labelEn: "PyTorch - Tutorials", url: "https://pytorch.org/tutorials/" } }
        ]
      },
      {
        title: "5. Mise en production", titleEn: "5. Putting models into production",
        items: [
          { label: "Évaluation, déploiement de modèles", labelEn: "Evaluating and deploying models", level: "option" },
          { label: "Suivi d'expérimentations (MLflow)", labelEn: "Experiment tracking (MLflow)", level: "option" }
        ]
      }
    ]
  },

  "solidity": {
    type: "skill",
    domain: "Développement",
    title: "Solidity & Smart Contracts",
    titleEn: "Solidity & Smart Contracts",
    subtitle: "Programmer des contrats intelligents sur la blockchain Ethereum",
    subtitleEn: "Programming smart contracts on the Ethereum blockchain",
    icon: "link",
    sections: [
      {
        title: "1. Prérequis", titleEn: "1. Prerequisites",
        items: [
          { label: "Fonctionnement de la blockchain et d'Ethereum", labelEn: "How blockchain and Ethereum work", level: "core", resource: { label: "Ethereum.org - Guides développeurs", labelEn: "Ethereum.org - Developer guides", url: "https://ethereum.org/en/developers/docs/" } }
        ]
      },
      {
        title: "2. Fondamentaux Solidity", titleEn: "2. Solidity fundamentals",
        items: [
          { label: "Syntaxe, types, fonctions de contrat", labelEn: "Syntax, types, contract functions", level: "core", resource: { label: "Documentation Solidity", labelEn: "Solidity documentation", url: "https://docs.soliditylang.org/" } },
          { label: "Standards de tokens (ERC-20, ERC-721)", labelEn: "Token standards (ERC-20, ERC-721)", level: "option" }
        ]
      },
      {
        title: "3. Développement", titleEn: "3. Development",
        items: [
          { label: "Hardhat ou Foundry pour le développement local", labelEn: "Hardhat or Foundry for local development", level: "core" },
          { label: "Tests de smart contracts", labelEn: "Smart contract testing", level: "core" },
          { label: "Optimisation du gas", labelEn: "Gas optimization", level: "option" },
          { label: "Déploiement et vérification (Etherscan)", labelEn: "Deployment and verification (Etherscan)", level: "option" }
        ]
      },
      {
        title: "4. Sécurité", titleEn: "4. Security",
        items: [
          { label: "Vulnérabilités courantes (reentrancy, overflow)", labelEn: "Common vulnerabilities (reentrancy, overflow)", level: "core" },
          { label: "Outils d'audit (Slither, MythX)", labelEn: "Audit tools (Slither, MythX)", level: "option" }
        ]
      }
    ]
  },

  "system-design": {
    type: "skill",
    domain: "Développement",
    title: "System Design",
    titleEn: "System Design",
    subtitle: "Concevoir des systèmes logiciels à grande échelle",
    subtitleEn: "Designing software systems at scale",
    icon: "map",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Scalabilité horizontale vs verticale", labelEn: "Horizontal vs vertical scaling", level: "core" },
          { label: "Load balancing", labelEn: "Load balancing", level: "core" }
        ]
      },
      {
        title: "2. Données", titleEn: "2. Data",
        items: [
          { label: "Sharding, réplication de bases de données", labelEn: "Database sharding and replication", level: "core" },
          { label: "Cache (Redis, CDN)", labelEn: "Caching (Redis, CDN)", level: "core" }
        ]
      },
      {
        title: "3. Architecture distribuée", titleEn: "3. Distributed architecture",
        items: [
          { label: "Files de messages, architecture événementielle", labelEn: "Message queues, event-driven architecture", level: "core" },
          { label: "Théorème CAP", labelEn: "CAP theorem", level: "option" },
          { label: "Microservices vs monolithe, API gateway", labelEn: "Microservices vs monolith, API gateway", level: "option" },
          { label: "Limitation de débit (rate limiting)", labelEn: "Rate limiting", level: "option" }
        ]
      },
      {
        title: "4. Étude de cas", titleEn: "4. Case study",
        items: [
          { label: "Concevoir un système connu (ex : raccourcisseur d'URL, flux d'actualités)", labelEn: "Designing a well-known system (e.g. a URL shortener, a news feed)", level: "core" }
        ]
      }
    ]
  },

  "dsa": {
    type: "skill",
    domain: "Développement",
    title: "Data Structures & Algorithms",
    titleEn: "Data Structures & Algorithms",
    subtitle: "Les fondamentaux algorithmiques utiles pour tout développeur",
    subtitleEn: "The algorithmic fundamentals every developer needs",
    icon: "binary",
    sections: [
      {
        title: "1. Structures de données", titleEn: "1. Data structures",
        items: [
          { label: "Tableaux, listes chaînées, piles, files", labelEn: "Arrays, linked lists, stacks, queues", level: "core" },
          { label: "Arbres et graphes", labelEn: "Trees and graphs", level: "core" },
          { label: "Tables de hachage", labelEn: "Hash tables", level: "core" }
        ]
      },
      {
        title: "2. Algorithmes de base", titleEn: "2. Basic algorithms",
        items: [
          { label: "Tri et recherche", labelEn: "Sorting and searching", level: "core" },
          { label: "Récursivité", labelEn: "Recursion", level: "core" }
        ]
      },
      {
        title: "3. Techniques avancées", titleEn: "3. Advanced techniques",
        items: [
          { label: "Programmation dynamique", labelEn: "Dynamic programming", level: "core" },
          { label: "Parcours de graphes (BFS, DFS)", labelEn: "Graph traversal (BFS, DFS)", level: "core" },
          { label: "Algorithmes gloutons (greedy), fenêtre glissante, deux pointeurs", labelEn: "Greedy algorithms, sliding window, two pointers", level: "option" }
        ]
      },
      {
        title: "4. Complexité et pratique", titleEn: "4. Complexity and practice",
        items: [
          { label: "Notation Big O", labelEn: "Big O notation", level: "core" },
          { label: "Plateformes d'entraînement (LeetCode, HackerRank)", labelEn: "Practice platforms (LeetCode, HackerRank)", level: "option" }
        ]
      }
    ]
  },

  "api-design": {
    type: "skill",
    domain: "Développement",
    title: "API Design (REST)",
    titleEn: "API Design (REST)",
    subtitle: "Concevoir des API cohérentes, prévisibles et faciles à utiliser",
    subtitleEn: "Designing APIs that are consistent, predictable and easy to use",
    icon: "plug",
    sections: [
      {
        title: "1. Fondamentaux REST", titleEn: "1. REST fundamentals",
        items: [
          { label: "Ressources, méthodes HTTP, codes de statut", labelEn: "Resources, HTTP methods, status codes", level: "core" }
        ]
      },
      {
        title: "2. Conception", titleEn: "2. Design",
        items: [
          { label: "Nommage des routes, versionnement", labelEn: "Route naming, versioning", level: "core" },
          { label: "Pagination, filtrage, tri", labelEn: "Pagination, filtering, sorting", level: "core" },
          { label: "Idempotence et formats d'erreur cohérents", labelEn: "Idempotency and consistent error formats", level: "option" }
        ]
      },
      {
        title: "3. Sécurité et fiabilité", titleEn: "3. Security and reliability",
        items: [
          { label: "Authentification, rate limiting", labelEn: "Authentication, rate limiting", level: "core" }
        ]
      },
      {
        title: "4. Documentation", titleEn: "4. Documentation",
        items: [
          { label: "OpenAPI/Swagger", labelEn: "OpenAPI/Swagger", level: "core" }
        ]
      }
    ]
  },

  "cicd": {
    type: "skill",
    domain: "Infrastructure & DevOps",
    title: "CI/CD",
    titleEn: "CI/CD",
    subtitle: "Automatiser les tests et le déploiement du code",
    subtitleEn: "Automating code testing and deployment",
    icon: "repeat",
    sections: [
      {
        title: "1. Fondamentaux", titleEn: "1. Fundamentals",
        items: [
          { label: "Intégration continue vs livraison/déploiement continu", labelEn: "Continuous integration vs continuous delivery/deployment", level: "core" }
        ]
      },
      {
        title: "2. Pipelines", titleEn: "2. Pipelines",
        items: [
          { label: "GitHub Actions", labelEn: "GitHub Actions", level: "core", resource: { label: "Documentation GitHub Actions", labelEn: "GitHub Actions documentation", url: "https://docs.github.com/fr/actions" } },
          { label: "GitLab CI ou Jenkins", labelEn: "GitLab CI or Jenkins", level: "option" }
        ]
      },
      {
        title: "3. Bonnes pratiques", titleEn: "3. Best practices",
        items: [
          { label: "Tests automatisés dans le pipeline", labelEn: "Automated tests in the pipeline", level: "core" },
          { label: "Portes de qualité (linting, couverture de tests)", labelEn: "Quality gates (linting, test coverage)", level: "option" },
          { label: "Stratégies de déploiement (blue-green, canary)", labelEn: "Deployment strategies (blue-green, canary)", level: "option" }
        ]
      },
      {
        title: "4. Sécurité", titleEn: "4. Security",
        items: [
          { label: "Gestion des secrets dans les pipelines", labelEn: "Managing secrets in pipelines", level: "core" }
        ]
      }
    ]
  }
};

// Fusion pour la recherche par id, quelle que soit la catégorie
const ALL_ROADMAPS = Object.assign({}, ROLES, SKILLS);

// ---- Écoles & universités ----
// Données vérifiées sur les sites officiels de chaque établissement (recherche août-septembre 2026).
// Statut "agree" : présence confirmée dans la liste des établissements d'enseignement supérieur
// accrédités par le Ministère togolais de l'Enseignement Supérieur et de la Recherche pour
// l'année académique 2026-2027 (liste de 111 établissements : 13 publics, 98 privés, publiée
// le 24 juillet 2026 sur edusup.gouv.tg, remplace la liste 2025-2026 de 93 établissements).
// null = non applicable ou statut particulier.
const SCHOOLS = {
  "ipnet": {
    name: "IPNET Institute of Technology",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence", "Master", "Formations certifiantes"],
    niveauxEn: ["Bachelor's", "Master's", "Certificate programs"],
    filieres: ["Intelligence Artificielle", "Science des Données", "Génie Logiciel", "Cybersécurité", "Développement Web & Mobile", "Réseaux, Systèmes & Sécurité"],
    filieresEn: ["Artificial Intelligence", "Data Science", "Software Engineering", "Cybersecurity", "Web & Mobile Development", "Networks, Systems & Security"],
    duree: "Licence : 3 ans · Master : 2 ans", dureeEn: "Bachelor's: 3 years · Master's: 2 years",
    admission: "Sur étude de dossier ou sur concours (BAC II séries A4, C, D, E, F1/F2/F3, G2/G3 ou équivalent) ; Licence en informatique ou discipline connexe pour le Master.", admissionEn: "Based on an application review or an entrance exam (BAC II series A4, C, D, E, F1/F2/F3, G2/G3 or equivalent); a bachelor's in computer science or a related field for the Master's.",
    frais: "Licence (3 ans, toutes filières) : 800 000 FCFA en 1re année · 900 000 en 2e · 1 000 000 en 3e, + inscription 50 000 FCFA en 1re année puis 30 000 FCFA, kit vestimentaire 50 000 FCFA, étude de dossier 10 000 FCFA (25 000 pour les non-Togolais) et concours facultatif 5 000 FCFA ; paiement en 3 fois (50 % à la rentrée d'octobre, 30 % au 31 janvier, 20 % au 30 avril). Master : 1 100 000 FCFA en M1 (hors mise à niveau) · 1 300 000 en M2, + inscription 100 000 FCFA puis 30 000 FCFA (source : page « Procédure d'inscription » d'ipnetuniversity.com, consultée le 6 novembre 2026, sans année indiquée).", fraisEn: "Bachelor's (3 years, all programs): 800,000 FCFA in year 1 · 900,000 in year 2 · 1,000,000 in year 3, + registration 50,000 FCFA in year 1 then 30,000 FCFA, uniform kit 50,000 FCFA, application review 10,000 FCFA (25,000 for non-Togolese students) and optional entrance exam 5,000 FCFA; payment in 3 installments (50% at the October start, 30% by January 31, 20% by April 30). Master's: 1,100,000 FCFA in M1 (excluding the bridging course) · 1,300,000 in M2, + registration 100,000 FCFA then 30,000 FCFA (source: \"Procédure d'inscription\" page on ipnetuniversity.com, accessed November 6, 2026, no year stated).",
    site: "https://ipnetuniversity.com",
    description: "Institut privé fondé en 2003, très orienté pratique (80+ partenariats entreprises tech), élu « université la plus innovante du Togo » en 2022.", descriptionEn: "Private institute founded in 2003, strongly hands-on (80+ partnerships with tech companies), named \"most innovative university in Togo\" in 2022.",
    datesCles: {
      mode: "campagne",
      note: "Concours d'entrée doté de bourse, ouvert à tous les bacheliers (acte de naissance, relevés du BAC I et du BAC II, 5 000 FCFA d'inscription) : 1er concours dans 5 centres (IPNET à Lomé, Collège Chaminade à Kara, LETP Atakpamé, LETP Sokodé, LETP Dapaong), 2e concours à IPNET Lomé seulement (page « Concours de bourse 2026 » d'ipnetuniversity.com). Admission sur étude de dossier possible en parallèle jusqu'au 30 septembre 2026 (flyer officiel).", noteEn: "Entrance exam with scholarships, open to all high-school graduates (birth certificate, BAC I and BAC II transcripts, 5,000 FCFA registration fee): 1st exam in 5 centers (IPNET in Lomé, Collège Chaminade in Kara, LETP Atakpamé, LETP Sokodé, LETP Dapaong), 2nd exam at IPNET Lomé only (\"Concours de bourse 2026\" page on ipnetuniversity.com). Admission based on an application review also possible until September 30, 2026 (official flyer).",
      cloture: "4 septembre 2026 (1er concours) · 30 septembre 2026 (admission sur dossier) · 5 octobre 2026 (2e concours)", clotureEn: "September 4, 2026 (1st exam) · September 30, 2026 (admission on application) · October 5, 2026 (2nd exam)",
      concours: "4 septembre 2026 (5 centres) · 5 octobre 2026 (Lomé)", concoursEn: "September 4, 2026 (5 centers) · October 5, 2026 (Lomé)",
      anneeReference: "2026-2027",
      contact: "ipnet@ipnetinstitute.com"
    }
  },
  "iai-togo": {
    name: "Institut Africain d'Informatique (IAI-Togo)",
    nameEn: "African Institute of Computer Science (IAI-Togo)",
    ville: ["Lomé"],
    statut: "inter-etats",
    agree: true,
    agreeNote: "École inter-États d'enseignement supérieur (réseau régional créé en 1971). Jusqu'à la liste 2025-2026, son statut inter-États le distinguait des établissements recensés par le Ministère togolais : mais la nouvelle liste officielle 2026-2027 (edusup.gouv.tg, publiée le 24 juillet 2026) l'inscrit désormais explicitement en position n°5 des établissements PUBLICS.", agreeNoteEn: "Inter-state higher-education school (regional network founded in 1971). Up to the 2025-2026 list, its inter-state status set it apart from the institutions listed by the Togolese Ministry; but the new official 2026-2027 list (edusup.gouv.tg, published July 24, 2026) now explicitly lists it as no. 5 among PUBLIC institutions.",
    niveaux: ["Licence Professionnelle", "Ingénieur des Travaux Informatiques", "Ingénieur Concepteur"],
    niveauxEn: ["Professional bachelor's", "Computer engineering technologist (ITI)", "Design engineer"],
    filieres: ["Génie Logiciel & Systèmes d'Information", "Administration des Systèmes et Réseaux", "Multimédia", "Technologies Web"],
    filieresEn: ["Software Engineering & Information Systems", "Systems and Network Administration", "Multimedia", "Web Technologies"],
    duree: "Cycle ITI / Licence Pro : 3 ans, avec stage en 2e et 3e années", dureeEn: "ITI cycle / Professional bachelor's: 3 years, with an internship in years 2 and 3",
    admission: "Concours d'entrée réservé aux BAC II séries C, D, E, F1 ou F2 : présélection sur dossier puis épreuves écrites de Mathématiques (coef. 6), Techniques d'expression (coef. 2) et Anglais (coef. 3).", admissionEn: "Entrance exam reserved for BAC II series C, D, E, F1 or F2: shortlisting on application, then written exams in Mathematics (weight 6), Communication skills (weight 2) and English (weight 3).",
    frais: "Non communiqué publiquement : seuls les frais annexes sont connus (10 000 FCFA pour l'étude de dossier, concours : 15 000 FCFA/an, assurance : 1 000 FCFA/an). Contacte l'établissement pour le montant de la scolarité.", fraisEn: "Not made public: only the additional fees are known (10,000 FCFA for the application review, entrance exam: 15,000 FCFA/year, insurance: 1,000 FCFA/year). Contact the school for the tuition amount.",
    site: "https://new.iai-togo.tg/officiel",
    description: "École inter-États d'enseignement supérieur en informatique, présente au Togo depuis 2002, référence historique de la formation informatique dans la sous-région.", descriptionEn: "Inter-state higher-education school in computer science, in Togo since 2002, the historic benchmark for computer science training in the sub-region.",
    datesCles: {
      mode: "campagne",
      note: "Campagne annuelle avec concours écrit (mathématiques, techniques d'expression, anglais). Campagne 2026-2027 close : résultats du concours du 1er septembre 2026 publiés (confirmé sur new.iai-togo.tg, rubrique informations urgentes).", noteEn: "Annual application round with a written exam (mathematics, communication skills, English). 2026-2027 round closed: results of the September 1, 2026 exam published (confirmed on new.iai-togo.tg, urgent information section).",
      cloture: "21 août 2026, 17h00", clotureEn: "August 21, 2026, 5:00 pm",
      concours: "1er septembre 2026", concoursEn: "September 1, 2026",
      resultats: "8 septembre 2026 (note de service n°550 de l'IAI-Togo)", resultatsEn: "September 8, 2026 (IAI-Togo memo no. 550)",
      anneeReference: "2026-2027"
    }
  },
  "esgis": {
    name: "ESGIS Togo (École Supérieure de Gestion, d'Informatique et des Sciences)",
    nameEn: "ESGIS Togo (Higher School of Management, Computer Science and Sciences)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence", "Master"],
    niveauxEn: ["BTS", "Bachelor's", "Master's"],
    filieres: ["Informatique de Gestion", "Développement d'Applications", "Systèmes et Réseaux", "Sécurité Informatique", "Intelligence Artificielle & Big Data", "Marketing Digital"],
    filieresEn: ["Business Computing", "Application Development", "Systems and Networks", "Computer Security", "Artificial Intelligence & Big Data", "Digital Marketing"],
    duree: "BTS : 2 ans · Licence : 3 ans · Master : 2 ans après la Licence", dureeEn: "BTS: 2 years · Bachelor's: 3 years · Master's: 2 years after the bachelor's",
    admission: "Ouvert à tous les bacheliers en 1ère année ; dossier + entretien pour une admission directe en cours de cursus", admissionEn: "Open to all high-school graduates in year 1; application + interview for direct entry later in the program",
    frais: "Non communiqué publiquement : l'école renvoie explicitement au secrétariat local pour les tarifs. (Un document non officiel daté de 2021 circule en ligne mais n'est pas fiable pour l'année en cours.)", fraisEn: "Not made public: the school explicitly refers students to the local office for fees. (An unofficial document dated 2021 circulates online but is not reliable for the current year.)",
    site: "https://www.esgis.org/",
    description: "École privée accréditée CAMES, présente au Togo, au Bénin et au Gabon, plus de 20 000 étudiants formés en 30 ans.", descriptionEn: "Private school accredited by CAMES, present in Togo, Benin and Gabon, more than 20,000 students trained in 30 years.",
    datesCles: {
      mode: "continue",
      note: "Pré-inscriptions conseillées dès la publication des résultats du Bac (juillet-août), places limitées en informatique. Sélection sur dossier et entretien, pas de concours à date fixe.", noteEn: "Pre-registration recommended as soon as the Bac results are out (July-August), limited places in computer science. Selection on application and interview, no fixed-date entrance exam.",
      rentree: "26 octobre 2026 (Licence 1, 2 et 3 : nouvelle date, affiche officielle ESGIS)", rentreeEn: "October 26, 2026 (Bachelor's years 1, 2 and 3: new date, official ESGIS poster)",
      anneeReference: "2026-2027"
    }
  },
  "esig": {
    name: "ESIG Global Success (École Supérieure d'Informatique et de Gestion)",
    nameEn: "ESIG Global Success (Higher School of Computer Science and Management)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence", "Master"],
    niveauxEn: ["BTS", "Bachelor's", "Master's"],
    filieres: ["Administrateur Réseaux", "Développeur d'Application", "Systèmes et Réseaux Informatiques", "Sécurité Informatique", "Intelligence Artificielle et Big Data", "Réseaux et Télécommunications", "Électronique et Système Embarqué"],
    filieresEn: ["Network Administrator", "Application Developer", "Computer Systems and Networks", "Computer Security", "Artificial Intelligence and Big Data", "Networks and Telecommunications", "Electronics and Embedded Systems"],
    duree: "BTS : 2 ans · Licence : 3 ans · Master : 2 ans", dureeEn: "BTS: 2 years · Bachelor's: 3 years · Master's: 2 years",
    admission: "Pré-inscription en ligne ; le BTS est accessible directement après le Bac", admissionEn: "Online pre-registration; the BTS is open directly after the Bac",
    frais: "Non communiqué sur le site officiel : la page FAQ d'esig.tg qui donnait des fourchettes de prix n'est plus en ligne (vérifié le 6 novembre 2026). Contacte l'école ou passe par sa plateforme admission.esig.tg.", fraisEn: "Not published on the official website: the esig.tg FAQ page that gave price ranges is no longer online (checked November 6, 2026). Contact the school or use its admission.esig.tg platform.",
    site: "https://esig.tg/",
    description: "École fondée à Lomé en 2008, 66 formations diplômantes du BTS au Master réparties en cinq domaines, accréditation Cisco Networking Academy, partenariats avec Sorbonne Paris Nord, UPEC, Le Havre Normandie et l'University of Alberta pour la mobilité internationale.", descriptionEn: "School founded in Lomé in 2008, 66 degree programs from BTS to Master's across five fields, Cisco Networking Academy accreditation, partnerships with Sorbonne Paris Nord, UPEC, Le Havre Normandie and the University of Alberta for international mobility.",
    datesCles: {
      mode: "continue",
      note: "Pré-inscriptions ouvertes en continu, dossier uniquement (pas de concours) : formulaire en ligne puis contact sous 24h. Formation modulaire (modules courts : développement web avec outils IA, initiation à la data et à l'IA, maintenance informatique, réseaux et cybersécurité…) : inscriptions ouvertes, admission sur dossier et entretien, tarif sur devis.", noteEn: "Pre-registration open year-round, application only (no entrance exam): online form, then contact within 24 hours. Modular training (short modules: web development with AI tools, introduction to data and AI, computer maintenance, networks and cybersecurity…): registration open, admission on application and interview, price on request.",
      rentree: "15 septembre 2026 (BTS, Licence, Master : ESIG News) · 26 octobre 2026 (formation modulaire : affiche officielle ESIG)", rentreeEn: "September 15, 2026 (BTS, Bachelor's, Master's: ESIG News) · October 26, 2026 (modular training: official ESIG poster)",
      anneeReference: "2026-2027",
      contact: "Formation continue : +228 79 77 36 36 · formation@esig.tg", contactEn: "Continuing education: +228 79 77 36 36 · formation@esig.tg"
    }
  },
  "esiba": {
    name: "ESIBA (École Supérieure d'Informatique, de Business et d'Administration)",
    nameEn: "ESIBA (Higher School of Computer Science, Business and Administration)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence", "Master"],
    niveauxEn: ["Bachelor's", "Master's"],
    filieres: ["Systèmes Informatiques et Logiciels", "Développement d'Application", "Sécurité des Réseaux et Télécommunications", "Informatique et Réseaux (Master)"],
    filieresEn: ["Computer Systems and Software", "Application Development", "Network and Telecommunications Security", "Computer Science and Networks (Master's)"],
    duree: "Licence : 3 ans · Master : 2 ans", dureeEn: "Bachelor's: 3 years · Master's: 2 years",
    admission: "Dossier d'inscription ; Licence en informatique ou domaine connexe requise pour le Master", admissionEn: "Application file; a bachelor's in computer science or a related field required for the Master's",
    frais: "Licence (toutes filières, dont Systèmes Informatiques & Logiciels) : 395 000 FCFA/an en L1 et L2, 530 000 FCFA en L3, prix affichés comme réduits (au lieu de 545 000 et 680 000). Master (dont Informatique & Réseaux) : 680 000 FCFA/an en M1 et M2 (au lieu de 830 000) + 15 000 FCFA d'étude de dossier (source : catalogue des formations d'esiba.tg, consulté le 6 novembre 2026, sans année indiquée).", fraisEn: "Bachelor's (all programs, including Computer Systems & Software): 395,000 FCFA/year in L1 and L2, 530,000 FCFA in L3, prices shown as discounted (instead of 545,000 and 680,000). Master's (including Computer Science & Networks): 680,000 FCFA/year in M1 and M2 (instead of 830,000) + 15,000 FCFA application review (source: program catalog on esiba.tg, accessed November 6, 2026, no year stated).",
    site: "https://www.esiba.tg/",
    description: "École agréée par l'État togolais, membre de l'Agence Universitaire de la Francophonie (AUF), plus de 36 ans d'expérience en gestion et technologie.", descriptionEn: "School accredited by the Togolese State, member of the Agence Universitaire de la Francophonie (AUF), more than 36 years of experience in management and technology.",
    datesCles: {
      mode: "continue",
      note: "Inscription sur dossier, pas de concours à date fixe.", noteEn: "Admission on application, no fixed-date entrance exam.",
      rentree: "19 octobre 2026 (confirmée, flyer officiel ESIBA)", rentreeEn: "October 19, 2026 (confirmed, official ESIBA flyer)",
      anneeReference: "2026-2027",
      contact: "esiba@esiba.tg / +228 90 81 41 78"
    }
  },
  "formatec": {
    name: "FORMATEC",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Brevet de Technicien", "Licence Professionnelle", "Master Professionnel"],
    niveauxEn: ["Technician certificate (BT)", "Professional bachelor's", "Professional master's"],
    filieres: ["Maintenance Informatique", "Administration de Réseaux", "Développeur d'Application", "Analyste Programmeur", "Génie Logiciel"],
    filieresEn: ["Computer Maintenance", "Network Administration", "Application Developer", "Analyst Programmer", "Software Engineering"],
    duree: "BT et Licence : 3 ans · Master : 2 ans", dureeEn: "BT and bachelor's: 3 years · Master's: 2 years",
    admission: "BEPC pour le BT · Bac ou BT pour la Licence · Licence Pro pour le Master", admissionEn: "BEPC for the BT · Bac or BT for the bachelor's · Professional bachelor's for the Master's",
    frais: "Licence Pro (options informatique) : 385 000 FCFA/an (1re-2e année), 450 000 (3e année) + inscription 50 000 FCFA puis 20 000 FCFA/an (source : fiche officielle 2025-2026).", fraisEn: "Professional bachelor's (computer science options): 385,000 FCFA/year (years 1-2), 450,000 (year 3) + registration 50,000 FCFA then 20,000 FCFA/year (source: official 2025-2026 fee sheet).",
    site: "https://formatec.tg/",
    description: "Institut technique et professionnel fondé en 1996, certifié ISO 9001 depuis 2015.", descriptionEn: "Technical and vocational institute founded in 1996, ISO 9001 certified since 2015.",
    datesCles: {
      mode: "continue",
      note: "Inscription continue pour les cycles Licence/BTS ; vagues ponctuelles pour les formations courtes.", noteEn: "Rolling admission for bachelor's/BTS programs; occasional intakes for short courses.",
      rentree: "6 octobre 2025 (référence : aucune date 2026-2027 publiée sur formatec.tg)", rentreeEn: "October 6, 2025 (reference: no 2026-2027 date published on formatec.tg)",
      anneeReference: "2025-2026",
      aVerifier: true
    }
  },
  "ucao-uut": {
    name: "UCAO-UUT : Département de Génie Informatique",
    nameEn: "UCAO-UUT: Computer Engineering Department",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence", "Ingénierie (Master)"],
    niveauxEn: ["Bachelor's", "Engineering (Master's)"],
    filieres: ["Développement d'Applications", "Mathématiques et Informatique", "Réseaux Informatiques et Télécommunication", "Cybersécurité", "Big Data", "Intelligence Artificielle", "Génie Logiciel"],
    filieresEn: ["Application Development", "Mathematics and Computer Science", "Computer Networks and Telecommunications", "Cybersecurity", "Big Data", "Artificial Intelligence", "Software Engineering"],
    duree: "Licence : 3 ans · Cycle ingénieur : 5 ans", dureeEn: "Bachelor's: 3 years · Engineering cycle: 5 years",
    admission: "Bac séries C, D, E ou F (ou équivalent) ; sélection sur dossier — notes de mathématiques (2ⁿᵈᵉ, 1ʳᵉ, Tˡᵉ, Bac) et niveau d'anglais, avec audition ou entretien possible.", admissionEn: "Bac series C, D, E or F (or equivalent); selection on application — mathematics grades (Seconde, Première, Terminale, Bac) and English level, with a possible audition or interview.",
    frais: "Tarifs 2026-2027 « Jubilé 20 ans » (remise réservée aux 1ʳᵉˢ années) : Licence 595 000 FCFA en L1 puis 758 000 FCFA en L2-L3 ; cycle ingénieur / Master 858 000 FCFA la 1ʳᵉ année puis 958 000 FCFA. Frais d'étude de dossier : 8 000 FCFA (licence) ou 12 000 FCFA (master/ingénieur). Bourse « Étoile Scientifique » (200 000 FCFA/an, étudiantes en informatique) et réduction « même parent » (50 000 FCFA/an) non cumulables : une étudiante en filière scientifique paie 558 000 FCFA/an sur tout le cycle licence (source : ucao-uut.tg/admissions).", fraisEn: "2026-2027 \"20th Jubilee\" fees (discount reserved for first-year students): bachelor's 595,000 FCFA in L1, then 758,000 FCFA in L2-L3; engineering cycle / master's 858,000 FCFA in year 1, then 958,000 FCFA. Application review fee: 8,000 FCFA (bachelor's) or 12,000 FCFA (master's/engineering). \"Étoile Scientifique\" scholarship (200,000 FCFA/year, female computer science students) and \"same parent\" discount (50,000 FCFA/year), not combinable: a female student in a science program pays 558,000 FCFA/year throughout the bachelor's cycle (source: ucao-uut.tg/admissions).",
    site: "https://ucao-uut.tg/formation-recherche/formations/institut-ecole/dgi/",
    description: "Université catholique reconnue par l'État togolais et le CAMES. Le Département de Génie Informatique (DGI) relève de l'École Supérieure d'Ingénieurs, créée en 2024, et a succédé à l'ISTIN (fondé en 2007) ; la formation vise le diplôme d'ingénieur avec équivalence Master Recherche, dans le respect des normes du CAMES et de la Commission des Titres d'Ingénieur (CTI). Le 2ᵉ cycle ingénieur et les masters se déroulent en cours du soir (13 h – 21 h 30).", descriptionEn: "Catholic university recognized by the Togolese State and CAMES. The Computer Engineering Department (DGI) belongs to the School of Engineering, created in 2024, and succeeded ISTIN (founded in 2007); the program leads to an engineering degree equivalent to a research master's, in line with CAMES and Commission des Titres d'Ingénieur (CTI) standards. The 2nd engineering cycle and master's programs run as evening classes (1:00 pm – 9:30 pm).",
    datesCles: {
      mode: "continue",
      note: "Préinscription ouverte depuis le 1ᵉʳ juillet 2026 et jusqu'à la rentrée (pas de date limite stricte) : formulaire en ligne sur preinscription.ucao-uut.tg ou dossier numérique en PDF à scolarite@ucao-uut.tg, sinon dépôt physique sur les campus de Sanguéra ou Près Saint-Jo (Lomé).", noteEn: "Pre-registration open since July 1, 2026 and until the start of classes (no strict deadline): online form at preinscription.ucao-uut.tg or digital file as a PDF to scolarite@ucao-uut.tg, otherwise in person at the Sanguéra or Près Saint-Jo campuses (Lomé).",
      ouverture: "1er juillet 2026 (confirmée)", ouvertureEn: "July 1, 2026 (confirmed)",
      rentree: "19 octobre 2026, 7h30, campus de Sanguéra (Licence : reportée du 12 octobre, note d'information n°13/26 du 12 octobre 2026)", rentreeEn: "October 19, 2026, 7:30 am, Sanguéra campus (bachelor's: postponed from October 12, information note no. 13/26 of October 12, 2026)",
      anneeReference: "2026-2027"
    }
  },
  "lbs": {
    name: "Lomé Business School (LBS)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Bachelor", "Master", "Executive MBA"],
    niveauxEn: ["Bachelor", "Master's", "Executive MBA"],
    filieres: ["Développement Web / Génie Logiciel", "Big Data", "Cloud Computing", "Réseaux et Cybersécurité"],
    filieresEn: ["Web Development / Software Engineering", "Big Data", "Cloud Computing", "Networks and Cybersecurity"],
    duree: null,
    admission: "Inscription en ligne selon le niveau du candidat (Première, Terminale, Bac, Licence, Master)", admissionEn: "Online registration according to the applicant's level (Première, Terminale, Bac, bachelor's, master's)",
    frais: "900 000 FCFA/an (Bachelor) · 1 200 000 FCFA/an (Master) : inclut PC portable, kit et accès numérique (source : brochure officielle 2026-2027).", fraisEn: "900,000 FCFA/year (Bachelor) · 1,200,000 FCFA/year (Master's): includes a laptop, a kit and digital access (source: official 2026-2027 brochure).",
    site: "https://lome-bs.com/",
    description: "Se présente comme la 1ère Business School du Togo, forte orientation professionnalisante (stages dès la 1ère année) ; classée 6ᵉ meilleure Grande École de Business d'Afrique subsaharienne francophone par Jeune Afrique (source : lome-bs.com).", descriptionEn: "Presents itself as Togo's first business school, strongly career-oriented (internships from year 1); ranked 6th best business school in French-speaking sub-Saharan Africa by Jeune Afrique (source: lome-bs.com).",
    datesCles: {
      mode: "campagne",
      note: "Campagne annuelle avec test écrit (maths, français, culture générale ou logique selon le niveau) et entretien de motivation.", noteEn: "Annual application round with a written test (math, French, general knowledge or logic depending on the level) and a motivation interview.",
      ouverture: "4 juillet 2026, journée portes ouvertes (flyer officiel)", ouvertureEn: "July 4, 2026, open day (official flyer)",
      cloture: "26 septembre 2025 (référence du cycle précédent : aucune date 2026 publiée)", clotureEn: "September 26, 2025 (reference from the previous cycle: no 2026 date published)",
      anneeReference: "2026-2027",
      aVerifier: true
    }
  },
  "defitech": {
    name: "Institut Polytechnique DEFITECH",
    nameEn: "DEFITECH Polytechnic Institute",
    ville: ["Lomé"],
    statut: "prive",
    agree: false,
    agreeNote: "Absent de la liste officielle des établissements privés accrédités pour l'année académique 2026-2027 (publiée le 24 juillet 2026), alors qu'il figurait sur celle de 2025-2026 : à vérifier directement auprès de l'établissement avant de t'engager.", agreeNoteEn: "Missing from the official list of accredited private institutions for the 2026-2027 academic year (published July 24, 2026), although it was on the 2025-2026 list: check directly with the school before committing.",
    niveaux: ["Licence", "Master"],
    niveauxEn: ["Bachelor's", "Master's"],
    filieres: ["Intelligence Artificielle et Big Data", "Systèmes et Réseaux Informatiques", "Génie Logiciel"],
    filieresEn: ["Artificial Intelligence and Big Data", "Computer Systems and Networks", "Software Engineering"],
    duree: "Licence : 3 ans (180 crédits) · Master : 2 ans", dureeEn: "Bachelor's: 3 years (180 credits) · Master's: 2 years",
    admission: "Bac ou équivalent pour l'entrée en L1 ; admission directe en L3 possible avec un BTS pertinent", admissionEn: "Bac or equivalent to enter L1; direct entry into L3 possible with a relevant BTS",
    frais: "Licence : 35 000 FCFA d'inscription + 485 000 FCFA/an (460 000 en cours du soir) · Master : 50 000 + 650 000 FCFA/an. Paiement en 3 tranches ou 7 mensualités (source : defitech.tg).", fraisEn: "Bachelor's: 35,000 FCFA registration + 485,000 FCFA/year (460,000 for evening classes) · Master's: 50,000 + 650,000 FCFA/year. Payment in 3 installments or 7 monthly payments (source: defitech.tg).",
    site: "https://defitech.tg/",
    description: "« L'école des battants », plus de 20 ans d'expérience, convention avec l'Université de Lomé, forte orientation entrepreneuriat.", descriptionEn: "\"The school of fighters\", more than 20 years of experience, agreement with the University of Lomé, strong focus on entrepreneurship.",
    datesCles: {
      mode: "continue",
      note: "Admission sur dossier uniquement, pas de concours.", noteEn: "Admission on application only, no entrance exam.",
      rentree: "16 octobre 2023 (rentrée 2023-2024, dernière date publiée sur defitech.tg)", rentreeEn: "October 16, 2023 (2023-2024 start of classes, the last date published on defitech.tg)",
      anneeReference: "2023-2024",
      aVerifier: true
    }
  },
  "ecole-des-cadres": {
    name: "École des Cadres",
    nameEn: "School of Executives (École des Cadres)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence"],
    niveauxEn: ["BTS", "Bachelor's"],
    filieres: ["Informatique de Gestion", "Systèmes et Réseaux Informatiques", "Développement d'Application", "Sécurité Informatique"],
    filieresEn: ["Business Computing", "Computer Systems and Networks", "Application Development", "Computer Security"],
    duree: null,
    admission: "BAC II requis pour le BTS et la Licence informatique", admissionEn: "BAC II required for the BTS and the bachelor's in computer science",
    frais: "Non communiqué publiquement. L'école organise un concours de bourses donnant droit à une réduction sur les frais de scolarité (montant non précisé) : dernière édition le 18 septembre 2025, aucune date annoncée pour 2026-2027 (ecoledescadres.com, consulté le 6 novembre 2026).", fraisEn: "Not made public. The school runs a scholarship competition that gives a discount on tuition fees (amount not specified): last edition on September 18, 2025, no date announced for 2026-2027 (ecoledescadres.com, accessed November 6, 2026).",
    site: "https://ecoledescadres.com/",
    description: "Une des premières écoles professionnelles du Togo (1997), diplômes en partenariat avec l'Université du Littoral Côte d'Opale (France), accréditée CAMES.", descriptionEn: "One of Togo's first vocational schools (1997), degrees in partnership with the Université du Littoral Côte d'Opale (France), accredited by CAMES.",
    datesCles: {
      mode: "continue",
      note: "Inscription continue ; un concours de bourses (réduction de frais, pas un concours d'entrée classique) s'est tenu le 18 septembre 2025, aucune date n'est annoncée pour 2026-2027.", noteEn: "Rolling admission; a scholarship competition (fee discount, not a regular entrance exam) was held on September 18, 2025, no date has been announced for 2026-2027.",
      concours: "18 septembre 2025, concours de bourses (référence)", concoursEn: "September 18, 2025, scholarship competition (reference)",
      rentree: "29 septembre 2025 (référence)", rentreeEn: "September 29, 2025 (reference)",
      anneeReference: "2025-2026"
    }
  },
  "universite-kara": {
    name: "Université de Kara",
    nameEn: "University of Kara",
    ville: ["Kara"],
    statut: "public",
    agree: null,
    niveaux: ["Licence", "Licence Professionnelle", "Master"],
    niveauxEn: ["Bachelor's", "Professional bachelor's", "Master's"],
    filieres: ["Mathématiques et Informatique Appliquées", "Sécurité Informatique et Cybersécurité", "Développement Web et Mobile", "Métiers du Multimédia et de l'Internet"],
    filieresEn: ["Applied Mathematics and Computer Science", "Computer Security and Cybersecurity", "Web and Mobile Development", "Multimedia and Internet Professions"],
    duree: "Licences en 3 ans, avec stage professionnel et soutenance en fin de cycle", dureeEn: "Bachelor's programs in 3 years, with a professional internship and a final defense",
    admission: "Bac C, D ou E (session récente), sélection sur dossier", admissionEn: "Bac C, D or E (recent session), selection on application",
    frais: "Master : de 176 500 FCFA/an (recherche, étudiants togolais/UEMOA) à plus d'1 000 000 FCFA (professionnel, étranger) : arrêté officiel 2026-2027. Licence non communiquée publiquement. Bourses d'État, prix d'excellence et bourses de mobilité internationale : détail sur la page Bourses.", fraisEn: "Master's: from 176,500 FCFA/year (research track, Togolese/WAEMU students) to over 1,000,000 FCFA (professional track, foreign students): official 2026-2027 decree. Bachelor's fees not made public. State scholarships, excellence awards and international mobility scholarships: details on the Scholarships page.",
    site: "https://univkara.tg/",
    description: "2e université publique du Togo ; la Faculté des Sciences et Techniques (FAST) porte plusieurs licences professionnelles tech.", descriptionEn: "Togo's 2nd public university; the Faculty of Science and Technology (FAST) runs several tech professional bachelor's programs.",
    datesCles: {
      mode: "campagne",
      note: "Campagne annuelle via le service DAAS : préinscription en ligne sur le portail PAUL UK (etu.univkara.tg), paiement des droits par Mobile Money, puis dépôt du dossier complet au guichet de la DAAS (Campus Sud). Les appels à candidature des licences (dépôt du 18 août au 25 septembre 2026, prolongé au 9 octobre pour plusieurs licences) et des masters (jusqu'au 30 octobre 2026) sont clos. La page Admission indique « Fermée actuellement » pour les inscriptions 2026-2027 (consultée le 6 novembre 2026).", noteEn: "Annual application round through the DAAS office: online pre-registration on the PAUL UK portal (etu.univkara.tg), fees paid by Mobile Money, then the complete file submitted at the DAAS desk (South Campus). The calls for applications for bachelor's programs (submission from August 18 to September 25, 2026, extended to October 9 for several programs) and master's programs (until October 30, 2026) are closed. The Admission page shows \"Currently closed\" for 2026-2027 registration (accessed November 6, 2026).",
      ouverture: "15 septembre 2026, inscriptions 2026-2027 (univkara.tg)", ouvertureEn: "September 15, 2026, 2026-2027 registration (univkara.tg)",
      cloture: "18 décembre 2026, date limite de dépôt du dossier selon la page Admission (la page d'accueil annonce des inscriptions jusqu'au 29 décembre : se fier à la date la plus proche)", clotureEn: "December 18, 2026, deadline to submit the file according to the Admission page (the home page announces registration until December 29: go by the earlier date)",
      rentree: "21 septembre 2026, début des cours (univkara.tg)", rentreeEn: "September 21, 2026, start of classes (univkara.tg)",
      anneeReference: "2026-2027"
    }
  },
  "esa-togo": {
    name: "ESA Togo (École Supérieure des Affaires)",
    nameEn: "ESA Togo (Higher School of Business)",
    ville: ["Lomé", "Kara"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence Professionnelle", "Master Professionnel"],
    niveauxEn: ["BTS", "Professional bachelor's", "Professional master's"],
    filieres: ["Génie Logiciel", "Réseaux et Télécommunications", "Informatique de Gestion (Développeur d'application)", "Informatique de Gestion (Administrateur Réseaux locaux d'entreprises)", "Maintenance Informatique et Réseaux", "Sécurité Informatique, Cybersécurité et Cybercriminalité", "Informatique Industrielle", "Marketing Digital & E-Business", "Modélisation Économétrique et Analyse des Données"],
    filieresEn: ["Software Engineering", "Networks and Telecommunications", "Business Computing (Application Developer)", "Business Computing (Enterprise Local Network Administrator)", "Computer and Network Maintenance", "Computer Security, Cybersecurity and Cybercrime", "Industrial Computing", "Digital Marketing & E-Business", "Econometric Modeling and Data Analysis"],
    duree: "BTS : 2 ans · Licence : 3 ans · Master : 2 ans", dureeEn: "BTS: 2 years · Bachelor's: 3 years · Master's: 2 years",
    admission: "Inscriptions continues (critères détaillés non publiés en ligne)", admissionEn: "Rolling registration (detailed criteria not published online)",
    frais: "449 999 FCFA/an (BTS/Licence 1-2, cours du jour ou du soir) · 549 999 (Licence 3) · 669 999 (Master 1) · 799 999 (Master 2), payables en 10 mensualités de septembre à juin (45 000 FCFA/mois en BTS/Licence 1-2) + 50 000 FCFA d'inscription, avec 20 % de réduction sur ces frais d'inscription pour les 200 premiers inscrits. Inscription et scolarité non remboursables (source : échéancier officiel 2026-2027 du 8 juin 2026).", fraisEn: "449,999 FCFA/year (BTS/Bachelor's years 1-2, day or evening classes) · 549,999 (Bachelor's year 3) · 669,999 (Master's year 1) · 799,999 (Master's year 2), payable in 10 monthly installments from September to June (45,000 FCFA/month for BTS/Bachelor's years 1-2) + 50,000 FCFA registration, with a 20% discount on this registration fee for the first 200 enrollees. Registration and tuition are non-refundable (source: official 2026-2027 payment schedule of June 8, 2026).",
    site: "https://www.esatogo.com/",
    description: "École pluridisciplinaire fondée en 2010, plus de 33 filières, 1ère école togolaise certifiée ISO 9001. Selon sa brochure 2026, la Licence en Génie Logiciel et la Licence en Réseaux Télécommunications sont reconnues par le CAMES. Soins de santé gratuits pour ses étudiants et aide au logement pour ceux qui viennent de l'intérieur du pays ou de l'étranger.", descriptionEn: "Multidisciplinary school founded in 2010, more than 33 programs, the first Togolese school certified ISO 9001. According to its 2026 brochure, the bachelor's in Software Engineering and the bachelor's in Networks and Telecommunications are recognized by CAMES. Free healthcare for its students and housing assistance for those coming from inland regions or abroad.",
    datesCles: {
      mode: "continue",
      note: "Admission continue, avis sous 48 à 72h après étude du dossier : pas de date limite. Réduction de 20 % sur les frais d'inscription pour les 200 premiers inscrits (brochure et échéancier 2026-2027).", noteEn: "Rolling admission, answer within 48 to 72 hours after the application review: no deadline. 20% discount on registration fees for the first 200 enrollees (2026-2027 brochure and payment schedule).",
      rentree: "5 octobre 2026, 8h (campus Agoè et Super Taco, confirmé)", rentreeEn: "October 5, 2026, 8:00 am (Agoè and Super Taco campuses, confirmed)",
      anneeReference: "2026-2027",
      contact: "+228 91 04 82 07 / 90 89 45 70 · esatogo2024@gmail.com"
    }
  },
  "college-paris-togo": {
    name: "Ascencia · Keyce Togo (ex Collège de Paris Togo)",
    nameEn: "Ascencia · Keyce Togo (formerly Collège de Paris Togo)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    agreeNote: "Listé sous le nom « Ascencia Keyce (ex Institut Collège de Paris Supérieur) » sur la liste officielle 2026-2027 : anciennement agréé sous « Institut UPSILON Collège de Paris Supérieur ».", agreeNoteEn: "Listed as \"Ascencia Keyce (formerly Institut Collège de Paris Supérieur)\" on the official 2026-2027 list: formerly accredited as \"Institut UPSILON Collège de Paris Supérieur\".",
    niveaux: ["Licence (Bac+3)", "Master (Bac+5)"],
    niveauxEn: ["Bachelor's (Bac+3)", "Master's (Bac+5)"],
    filieres: ["Administrateur des Systèmes d'Information", "Intelligence Artificielle & Big Data", "Marketing Digital & Social Media", "Banque, Finance & Digital", "Achat & Logistique"],
    filieresEn: ["Information Systems Administrator", "Artificial Intelligence & Big Data", "Digital Marketing & Social Media", "Banking, Finance & Digital", "Purchasing & Logistics"],
    duree: "Licence : 3 ans · Master : 2 ans", dureeEn: "Bachelor's: 3 years · Master's: 2 years",
    admission: "Sur dossier (relevés de Bac, diplômes, lettre de motivation, CV)", admissionEn: "On application (Bac transcripts, diplomas, cover letter, CV)",
    frais: "Non communiqué publiquement : aucun tarif affiché sur le site officiel au moment de la recherche.", fraisEn: "Not made public: no prices shown on the official website at the time of research.",
    site: "https://ascencia-keyce-togo.fr/",
    description: "Le campus togolais du réseau français Collège de Paris a été rebaptisé Ascencia · Keyce Togo (rebranding confirmé 2026), membre du réseau IUGEE (6 écoles européennes présentes en Afrique). Diplômes présentés comme reconnus en Europe.", descriptionEn: "The Togolese campus of the French Collège de Paris network has been renamed Ascencia · Keyce Togo (rebranding confirmed in 2026), a member of the IUGEE network (6 European schools present in Africa). Degrees presented as recognized in Europe.",
    datesCles: {
      mode: "campagne",
      note: "Rentrée académique annoncée pour octobre 2026 (référence 2026-2027).", noteEn: "Start of the academic year announced for October 2026 (2026-2027 reference).",
      rentree: "Octobre 2026 (ascencia-keyce-togo.fr)", rentreeEn: "October 2026 (ascencia-keyce-togo.fr)",
      contact: "+228 93 23 64 28 / +228 96 19 56 04 / +33 1 47 34 39 39"
    }
  },
  "isbic-alg": {
    name: "ISBIC-ALG : Institut Supérieur Bilingue de l'Informatique et de Calcul « Auguste Le Grand »",
    nameEn: "ISBIC-ALG: \"Auguste Le Grand\" Bilingual Higher Institute of Computer Science and Computing",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence Professionnelle"],
    niveauxEn: ["Professional bachelor's"],
    filieres: ["Intelligence Artificielle", "Informatique et Systèmes d'Information", "Automatique et Informatique Industrielle"],
    filieresEn: ["Artificial Intelligence", "Computer Science and Information Systems", "Automation and Industrial Computing"],
    duree: null,
    admission: "Concours d'entrée (1er concours organisé le 13 octobre 2025)", admissionEn: "Entrance exam (1st exam held on October 13, 2025)",
    frais: "750 000 FCFA, tarif annoncé au lancement pour la rentrée 2025-2026 (inclut supports pédagogiques, tenues, cantine et cours d'auto-école) : réduction spéciale pour les 30 premiers admis, dispositif de soutien pour les étudiantes (source : tdn.tg, septembre 2025). Le site officiel n'affiche pas de tarif : à reconfirmer pour 2026-2027.", fraisEn: "750,000 FCFA, price announced at launch for the 2025-2026 intake (includes learning materials, uniforms, canteen and driving lessons): special discount for the first 30 admitted students, support scheme for female students (source: tdn.tg, September 2025). The official website shows no prices: to be reconfirmed for 2026-2027.",
    site: "https://institutaugustelegrand.com/",
    description: "Institut lancé le 11 septembre 2025 à Amadahomé (Lomé) par le promoteur Auguste Dogbo : l'un des établissements informatique les plus récents du pays. Partenariats annoncés avec CERGI et l'Université Esprit de Tunis.", descriptionEn: "Institute launched on September 11, 2025 in Amadahomé (Lomé) by its founder Auguste Dogbo: one of the newest computer science institutions in the country. Announced partnerships with CERGI and Esprit University in Tunis.",
    datesCles: {
      mode: "campagne",
      note: "Dates du tout premier concours (référence 2025-2026, à reconfirmer pour les prochaines sessions).", noteEn: "Dates of the very first entrance exam (2025-2026 reference, to be reconfirmed for future sessions).",
      concours: "13 octobre 2025 (1er concours, référence)", concoursEn: "October 13, 2025 (1st exam, reference)",
      resultats: "16 octobre 2025 (référence)", resultatsEn: "October 16, 2025 (reference)",
      rentree: "20 octobre 2025 (référence)", rentreeEn: "October 20, 2025 (reference)",
      anneeReference: "2025-2026",
      aVerifier: true,
      contact: "(+228) 96 45 43 11 / 93 87 49 50"
    }
  },
  "epl": {
    name: "École Nationale Polytechnique (ENP, ex-École Polytechnique de Lomé)",
    nameEn: "National Polytechnic School (ENP, formerly the Lomé Polytechnic School)",
    ville: ["Lomé"],
    statut: "public",
    agree: true,
    agreeNote: "Établissement public n°13 sur la liste officielle des établissements d'enseignement supérieur accrédités pour l'année académique 2026-2027 (edusup.gouv.tg, publiée le 24 juillet 2026). L'ENP a remplacé l'École Polytechnique de Lomé (EPL) en juillet 2026 (source : Togonews/AllAfrica, 23 juillet 2026) : les informations ci-dessous (frais, concours) datent de l'ère EPL et restent à recouper auprès de l'établissement.", agreeNoteEn: "Public institution no. 13 on the official list of accredited higher-education institutions for the 2026-2027 academic year (edusup.gouv.tg, published July 24, 2026). The ENP replaced the Lomé Polytechnic School (EPL) in July 2026 (source: Togonews/AllAfrica, July 23, 2026): the information below (fees, entrance exam) dates from the EPL era and still needs to be cross-checked with the school.",
    niveaux: ["Licence Fondamentale", "Licence Professionnelle", "Master", "Diplôme d'Ingénieur"],
    niveauxEn: ["General bachelor's", "Professional bachelor's", "Master's", "Engineering degree"],
    filieres: ["Informatique et Systèmes", "Intelligence Artificielle & Big Data", "Génie Logiciel", "Systèmes et Réseaux Informatiques"],
    filieresEn: ["Computer Science and Systems", "Artificial Intelligence & Big Data", "Software Engineering", "Computer Systems and Networks"],
    duree: null,
    admission: "Concours d'entrée post-Bac (Bac C, D, E scientifique pour la licence fondamentale)", admissionEn: "Post-Bac entrance exam (science Bac C, D, E for the general bachelor's)",
    frais: "404 000 FCFA/an (étudiants togolais, inscription incluse) · 514 000 (salariés) · 754 000 (étrangers). Les 20% premiers au concours d'entrée ne paient que 50 000 FCFA de frais pédagogiques, le reste pris en charge par l'établissement (source : presse togolaise, recoupée sur 3 articles, sous l'ancien nom EPL : à confirmer que ces tarifs s'appliquent toujours sous l'ENP).", fraisEn: "404,000 FCFA/year (Togolese students, registration included) · 514,000 (employees) · 754,000 (foreign students). The top 20% in the entrance exam pay only 50,000 FCFA in tuition, the rest being covered by the school (source: Togolese press, cross-checked across 3 articles, under the former name EPL: still to be confirmed that these fees apply under the ENP).",
    site: "https://univ-lome.tg/",
    description: "École nationale d'ingénieurs publique (ENP), qui a remplacé en juillet 2026 l'École Polytechnique de Lomé : elle-même composante de l'Université de Lomé depuis 2022 (fusion de l'ENSI et du Centre Informatique et de Calcul).", descriptionEn: "Public national engineering school (ENP), which replaced the Lomé Polytechnic School (EPL) in July 2026; the latter had been part of the University of Lomé since 2022 (merger of ENSI and the Computing Center).",
    datesCles: {
      mode: "campagne",
      note: "Concours écrit annuel réservé aux nouveaux bacheliers, dépôt possible à Lomé, Kara (DAAS) et dans les directions régionales (Tsévié, Atakpamé, Kpalimé, Sokodé, Dapaong). Annonce officielle du Ministère (août 2026). Candidatures 2026-2027 closes : les dates ci-dessous servent de repère pour la prochaine campagne.", noteEn: "Annual written exam reserved for new high-school graduates, applications accepted in Lomé, Kara (DAAS) and at the regional directorates (Tsévié, Atakpamé, Kpalimé, Sokodé, Dapaong). Official Ministry announcement (August 2026). 2026-2027 applications closed: the dates below serve as a reference for the next round.",
      urgent: false,
      ouverture: "17 août 2026", ouvertureEn: "August 17, 2026",
      cloture: "11 septembre 2026, 15h00", clotureEn: "September 11, 2026, 3:00 pm",
      concours: "30 septembre 2026 (présélection sur dossier le 18 septembre)", concoursEn: "September 30, 2026 (shortlisting on application on September 18)",
      resultats: "2 octobre 2026", resultatsEn: "October 2, 2026",
      anneeReference: "2026-2027",
      aVerifier: true,
      contact: "enp-togo@enp.tg"
    }
  },
  "iaec": {
    name: "IAEC (Institut Africain d'Administration et d'Études Commerciales)",
    nameEn: "IAEC (African Institute of Administration and Business Studies)",
    ville: ["Lomé", "Kara"],
    statut: "prive",
    agree: true,
    agreeNote: "Ne pas confondre avec le domaine iaec-university.tg, distinct et non vérifié : le site officiel de référence est iaectogo.com.", agreeNoteEn: "Not to be confused with the iaec-university.tg domain, which is separate and unverified: the official reference website is iaectogo.com.",
    niveaux: ["BTS", "Licence", "Master"],
    niveauxEn: ["BTS", "Bachelor's", "Master's"],
    filieres: ["Génie Logiciel", "Génie Informatique", "Réseaux et Télécommunications", "Sciences Informatiques et Télécommunications (Master)"],
    filieresEn: ["Software Engineering", "Computer Engineering", "Networks and Telecommunications", "Computer Science and Telecommunications (Master's)"],
    duree: null,
    admission: "Formulaire de demande en ligne", admissionEn: "Online application form",
    frais: "BTS : 35 000 FCFA d'inscription + 400 000 FCFA/an · Licence : 35 000 FCFA d'inscription + 450 000 FCFA/an (tarif unique, toutes spécialités et années confondues) · Master : 60 000 + 600 000 FCFA/an (source : iaectogo.com/licence/, 2026).", fraisEn: "BTS: 35,000 FCFA registration + 400,000 FCFA/year · Bachelor's: 35,000 FCFA registration + 450,000 FCFA/year (single rate, all specializations and years) · Master's: 60,000 + 600,000 FCFA/year (source: iaectogo.com/licence/, 2026).",
    site: "https://iaectogo.com/",
    description: "Un des tout premiers établissements privés d'enseignement supérieur du Togo (1986), membre du Groupe BK-Université.", descriptionEn: "One of the very first private higher-education institutions in Togo (1986), a member of the BK-Université Group.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié : confirmation de dossier sous 48h ouvrées après un entretien téléphonique obligatoire.", noteEn: "No calendar published: file confirmed within 48 business hours after a mandatory phone interview.",
      rentree: "13 octobre 2025 (référence : article « La Rentrée 2025-2026 à l'IAEC »)", rentreeEn: "October 13, 2025 (reference: article \"La Rentrée 2025-2026 à l'IAEC\")",
      anneeReference: "2025-2026",
      aVerifier: true,
      contact: "+228 93 90 66 66"
    }
  },
  "cifop": {
    name: "Centre Informatique de Formation et d'Orientation Professionnelle (CIFOP)",
    nameEn: "Computer Training and Career Guidance Center (CIFOP)",
    ville: ["Lomé", "Sokodé", "Bassar"],
    statut: "prive",
    agree: true,
    niveaux: ["BT", "BTS", "Licence Professionnelle", "Master"],
    niveauxEn: ["BT", "BTS", "Professional bachelor's", "Master's"],
    filieres: ["Développement d'applications", "Informatique de gestion", "Comptabilité & Gestion", "Marketing", "Transport & Logistique"],
    filieresEn: ["Application Development", "Business Computing", "Accounting & Management", "Marketing", "Transport & Logistics"],
    duree: "BT : 2 ans · BTS : 2 ans · Licence Pro : 3 ans · Master : 2 ans", dureeEn: "BT: 2 years · BTS: 2 years · Professional bachelor's: 3 years · Master's: 2 years",
    admission: "Sur dossier et test de niveau selon la filière et le cycle visé", admissionEn: "On application and placement test depending on the program and level",
    site: "https://www.cifop-togo.org",
    description: "Centre de formation professionnelle fondé en 1992, seule école de ce comparatif présente hors de Lomé/Kara (campus à Sokodé et Bassar). Revendique 99% d'insertion professionnelle dans les 6 mois suivant le diplôme.", descriptionEn: "Vocational training center founded in 1992, the only school in this comparison present outside Lomé/Kara (campuses in Sokodé and Bassar). Claims 99% job placement within 6 months of graduating.",
    frais: "Non communiqué publiquement : contacte l'établissement directement.", fraisEn: "Not made public: contact the school directly.",
    datesCles: {
      mode: "campagne",
      rentree: "6 octobre 2026 (Licence & BTS 1) · 15 septembre 2026 (BTS 2, BT) · 2-3 novembre 2026 (Master)", rentreeEn: "October 6, 2026 (Bachelor's & BTS year 1) · September 15, 2026 (BTS year 2, BT) · November 2-3, 2026 (Master's)",
      anneeReference: "2026-2027",
      aVerifier: true,
      contact: "contact@cifoptogo.org / (+228) 22 22 82 18"
    }
  },
  "ifnti": {
    name: "Institut de Formation aux Normes et Technologies de l'Informatique (IFNTI)",
    nameEn: "Institute for Training in Computing Standards and Technologies (IFNTI)",
    ville: ["Sokodé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence"],
    niveauxEn: ["Bachelor's"],
    filieres: ["Informatique"],
    filieresEn: ["Computer Science"],
    duree: "Licence LMD : 3 ans", dureeEn: "LMD bachelor's: 3 years",
    admission: "Bacheliers scientifiques et étudiants en réorientation, concours d'entrée (10 000 FCFA)", admissionEn: "Science high-school graduates and students changing direction, entrance exam (10,000 FCFA)",
    site: "https://www.ifnti.com/",
    description: "Institut associatif fondé en 2009 à Sokodé, entièrement dédié à l'informatique (licence LMD), encadrement par des enseignants de niveau ingénieur, groupes de 24 étudiants maximum.", descriptionEn: "Non-profit institute founded in 2009 in Sokodé, entirely dedicated to computer science (LMD bachelor's), taught by engineer-level instructors, groups of at most 24 students.",
    frais: "Aucun tarif affiché sur le site officiel (vérifié le 6 novembre 2026). Dernier montant public trouvé : 590 000 FCFA/an + 30 000 FCFA d'inscription (Edunews, 2022), sans doute plus à jour : confirme auprès de l'institut.", fraisEn: "No prices shown on the official website (checked November 6, 2026). Last public figure found: 590,000 FCFA/year + 30,000 FCFA registration (Edunews, 2022), probably out of date: check with the institute.",
    datesCles: {
      mode: "continue",
      note: "Inscriptions ouvertes chaque année après le Bac, concours d'entrée obligatoire, pas de date fixe publiée en ligne.", noteEn: "Registration open every year after the Bac, mandatory entrance exam, no fixed date published online.",
      contact: "contact@ifnti.com"
    }
  },
  "isac": {
    name: "Institut Supérieur Agata Carelli (ISAC)",
    nameEn: "Agata Carelli Higher Institute (ISAC)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence Professionnelle", "Master"],
    niveauxEn: ["BTS", "Professional bachelor's", "Master's"],
    filieres: ["Génie Logiciel", "Maintenance et Réseau Informatique"],
    filieresEn: ["Software Engineering", "Computer Maintenance and Networking"],
    duree: null,
    admission: "Cours du jour et du soir, ouverts aux bacheliers", admissionEn: "Day and evening classes, open to high-school graduates",
    frais: "Non communiqué publiquement : le site les qualifie d'« abordables » sans montant précis.", fraisEn: "Not made public: the website describes them as \"affordable\" without giving an amount.",
    site: "https://www.facebook.com/Agatacarelli1/",
    description: "Institut catholique fondé par les Sœurs Canossiennes en 1999 (Agoè-Légbassito), reconnu par décret en 2015 et jugé « établissement de bonne qualité » par le Ministère en 2016.", descriptionEn: "Catholic institute founded by the Canossian Sisters in 1999 (Agoè-Légbassito), recognized by decree in 2015 and rated a \"good-quality institution\" by the Ministry in 2016.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne : contacte l'établissement directement.", noteEn: "No calendar published online: contact the school directly."
    }
  },
  "ism-adonai": {
    name: "Institut Supérieur de Management Adonaï (ISM ADONAI)",
    nameEn: "Adonaï Higher Institute of Management (ISM ADONAI)",
    ville: ["Lomé", "Atakpamé", "Kara"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence", "Master"],
    niveauxEn: ["Bachelor's", "Master's"],
    filieres: ["Systèmes Informatiques et Logiciels", "Réseaux Informatiques et Télécommunication", "Cybersécurité", "Maintenance et Réseaux Informatiques", "Génie Logiciel", "Développement d'Application"],
    filieresEn: ["Computer Systems and Software", "Computer Networks and Telecommunications", "Cybersecurity", "Computer Maintenance and Networks", "Software Engineering", "Application Development"],
    duree: null,
    admission: "Sur dossier (relevé de notes du Bac certifié, acte de naissance, photo, fiche d'inscription)", admissionEn: "On application (certified Bac transcript, birth certificate, photo, registration form)",
    frais: "Non affiché sur le site officiel, qui indique que les frais « varient selon la filière et le niveau » et renvoie au barème du campus (vérifié le 6 novembre 2026). Repère : tarif promotionnel 2025-2026 lié à une opération portes ouvertes : 350 000 FCFA (L1) · 450 000 (L2) · 600 000 (L3) · 700 000 (M1) · 800 000 (M2) (source : synergieplus.net).", fraisEn: "Not shown on the official website, which says fees \"vary by program and level\" and refers to each campus's fee schedule (checked November 6, 2026). Reference: 2025-2026 promotional rates linked to an open-day campaign: 350,000 FCFA (L1) · 450,000 (L2) · 600,000 (L3) · 700,000 (M1) · 800,000 (M2) (source: synergieplus.net).",
    site: "https://www.ismadonai.net/",
    description: "École privée multi-pays certifiée ISO 9001:2015, fondée en 2005, présente aussi au Bénin et en Côte d'Ivoire, forte orientation professionnalisante.", descriptionEn: "Multi-country private school certified ISO 9001:2015, founded in 2005, also present in Benin and Côte d'Ivoire, strongly career-oriented.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié : le site indique que les inscriptions suivent le calendrier académique de chaque campus et renvoie à l'administration pour les dates exactes (ismadonai.net, consulté le 6 novembre 2026).", noteEn: "No calendar published: the website says registration follows each campus's academic calendar and refers to the administration for exact dates (ismadonai.net, accessed November 6, 2026)."
    }
  },
  "istm": {
    name: "Institut Supérieur de Technologies et de Management (ISTM)",
    nameEn: "Higher Institute of Technology and Management (ISTM)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence Professionnelle", "Master Professionnel"],
    niveauxEn: ["BTS", "Professional bachelor's", "Professional master's"],
    filieres: ["Développeur d'Applications", "Administrateur de Réseaux Locaux d'Entreprises", "Maintenance Informatique", "Télécommunication"],
    filieresEn: ["Application Developer", "Enterprise Local Network Administrator", "Computer Maintenance", "Telecommunications"],
    duree: "BTS : 2 ans (référence)", dureeEn: "BTS: 2 years (reference)",
    admission: "Non précisée publiquement : à confirmer directement", admissionEn: "Not stated publicly: to be confirmed directly",
    frais: "Non communiqué publiquement.", fraisEn: "Not made public.",
    site: "https://istm.tg/",
    description: "Institut privé créé en 2010 (Agoè Assiyéyé), plus de 2000 diplômés, offre diversifiée du BTS au Master en gestion, droit, logistique, informatique et télécoms, stages garantis.", descriptionEn: "Private institute created in 2010 (Agoè Assiyéyé), more than 2,000 graduates, a wide range of programs from BTS to Master's in management, law, logistics, computer science and telecoms, guaranteed internships.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne : contacte l'établissement directement.", noteEn: "No calendar published online: contact the school directly."
    }
  },
  "issec-kouvahey": {
    name: "Institut Supérieur des Sciences Économiques et Commerciales Kouvahey (ISSEC-KOUVAHEY)",
    nameEn: "Kouvahey Higher Institute of Economic and Business Sciences (ISSEC-KOUVAHEY)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BT", "BTS"],
    niveauxEn: ["BT", "BTS"],
    filieres: ["Informatique de Gestion (option Développeur d'Applications)"],
    filieresEn: ["Business Computing (Application Developer option)"],
    duree: "BT : 3 ans · BTS : 2 ans", dureeEn: "BT: 3 years · BTS: 2 years",
    admission: "Bac série C, D, G2, G3, ou BT Comptabilité/Commerce", admissionEn: "Bac series C, D, G2, G3, or BT in Accounting/Commerce",
    frais: "Non communiqué publiquement.", fraisEn: "Not made public.",
    site: "https://www.facebook.com/isseckouvahey/",
    description: "École privée en sciences économiques et commerciales fondée en 2006, convention avec IPAC-France (Bachelor/MBA), cours du jour et du soir.", descriptionEn: "Private school of economics and business founded in 2006, agreement with IPAC-France (Bachelor/MBA), day and evening classes.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne : contacte l'établissement directement.", noteEn: "No calendar published online: contact the school directly."
    }
  },
  "jumau-ita": {
    name: "Institut Supérieur des Technologies Avancées Jumau (JUMAU-ITA)",
    nameEn: "Jumau Higher Institute of Advanced Technologies (JUMAU-ITA)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence", "Master", "Doctorat"],
    niveauxEn: ["Bachelor's", "Master's", "Doctorate"],
    filieres: ["Génie Logiciel", "Maintenance et Réseaux", "Télécommunications", "Intelligence Artificielle"],
    filieresEn: ["Software Engineering", "Maintenance and Networks", "Telecommunications", "Artificial Intelligence"],
    duree: null,
    admission: "Non précisée publiquement : à confirmer directement", admissionEn: "Not stated publicly: to be confirmed directly",
    frais: "Non communiqué publiquement.", fraisEn: "Not made public.",
    site: "https://jumau-ita.com/",
    description: "Institut fondé en 2010, membre de l'International Association of Universities (IAU/UNESCO), a lancé des programmes en intelligence artificielle en 2025.", descriptionEn: "Institute founded in 2010, a member of the International Association of Universities (IAU/UNESCO), launched artificial intelligence programs in 2025.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne : contacte l'établissement directement.", noteEn: "No calendar published online: contact the school directly."
    }
  },
  "imast": {
    name: "Institut de Mathématiques, des Sciences et Technologies (IMaST)",
    nameEn: "Institute of Mathematics, Sciences and Technologies (IMaST)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence Professionnelle"],
    niveauxEn: ["BTS", "Professional bachelor's"],
    filieres: ["Mathématiques-Informatique", "Sécurité Informatique", "Systèmes et Réseaux Informatiques", "Développement d'Applications"],
    filieresEn: ["Mathematics-Computer Science", "Computer Security", "Computer Systems and Networks", "Application Development"],
    duree: null,
    admission: "Bac requis, dossier : cours du jour et du soir disponibles", admissionEn: "Bac required, application file: day and evening classes available",
    frais: "Non communiqué publiquement.", fraisEn: "Not made public.",
    site: "https://imast.tg/",
    description: "Institut privé à Agoè-Nyivé, propose aussi BTS Télécommunications, classe prépa et licence Actuariat.", descriptionEn: "Private institute in Agoè-Nyivé, also offers a BTS in Telecommunications, a preparatory class and a bachelor's in Actuarial Science.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne : contacte l'établissement directement.", noteEn: "No calendar published online: contact the school directly."
    }
  },
  "ecole-de-finance": {
    name: "École de Finance de Lomé (EFL, ex American Institute of Africa)",
    nameEn: "Lomé School of Finance (EFL, formerly American Institute of Africa)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence"],
    niveauxEn: ["BTS", "Bachelor's"],
    filieres: ["Génie Logiciel", "Systèmes et Réseaux", "Génie Industriel et Maintenance"],
    filieresEn: ["Software Engineering", "Systems and Networks", "Industrial Engineering and Maintenance"],
    duree: "BTS : Bac+2, 4 semestres · Licence professionnelle : 180 crédits, 6 semestres (source : aua-universities.org)", dureeEn: "BTS: Bac+2, 4 semesters · Professional bachelor's: 180 credits, 6 semesters (source: aua-universities.org)",
    admission: "Sur dossier en 4 étapes : choix de la filière, retrait de la fiche d'inscription (étude du dossier : 10 000 FCFA), dépôt du dossier (acte de naissance, certificat de nationalité, relevés et attestations de diplôme, lettre de motivation, photos), puis inscription pédagogique.", admissionEn: "On application in 4 steps: choice of program, collection of the registration form (application review: 10,000 FCFA), submission of the file (birth certificate, nationality certificate, transcripts and diploma certificates, cover letter, photos), then academic registration.",
    frais: "Non communiqué publiquement (hors frais de dossier de 10 000 FCFA).", fraisEn: "Not made public (apart from the 10,000 FCFA application fee).",
    site: "https://aua-universities.org/",
    description: "École reconnue par arrêté n°2019/037/MESR/SG/DES, propose surtout des filières gestion/finance/économie ; le pôle « Informatique et génie logiciel » couvre programmation, bases de données, administration système et cybersécurité appliquée en BTS et Licence (pas de Master informatique identifié).", descriptionEn: "School recognized by decree no. 2019/037/MESR/SG/DES, mainly offers management/finance/economics programs; its \"Computer Science and Software Engineering\" department covers programming, databases, system administration and applied cybersecurity at BTS and bachelor's level (no computer science master's identified).",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne : contacte l'établissement directement.", noteEn: "No calendar published online: contact the school directly."
    }
  },
  "global-wealth": {
    name: "Global Wealth University (Institut Universitaire Global Wealth, ex-IITM)",
    nameEn: "Global Wealth University (Global Wealth University Institute, formerly IITM)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Bachelor", "Master"],
    niveauxEn: ["Bachelor", "Master's"],
    filieres: ["Information Technology Management", "Computer and Software Engineering", "Artificial Intelligence & Robotics", "Computer Science", "Social Media & Digital Technology Management", "Telecommunication & Broadcasting Management"],
    filieresEn: ["Information Technology Management", "Computer and Software Engineering", "Artificial Intelligence & Robotics", "Computer Science", "Social Media & Digital Technology Management", "Telecommunication & Broadcasting Management"],
    duree: null,
    admission: "Diplôme secondaire pour le Bachelor ; diplôme Bachelor pour le Master (prérequis variables selon spécialité)", admissionEn: "Secondary school diploma for the Bachelor; Bachelor's degree for the Master's (prerequisites vary by specialization)",
    frais: "250 000 FCFA par session (même tarif affiché pour tous les diplômes et certificats), + frais de candidature (10 000), d'acceptation (10 000), d'administration (10 000 par semestre), d'examen (35 000 par épreuve et par semestre) et, en santé, ingénierie et filières pratiques, de travaux pratiques (25 000 par semestre) (source : page « Tuition » de cugw.tg, consultée le 6 novembre 2026, sans année indiquée).", fraisEn: "250,000 FCFA per session (same rate shown for all degrees and certificates), + application (10,000), acceptance (10,000), administration (10,000 per semester) and exam (35,000 per paper per semester) fees and, in health, engineering and practical programs, lab fees (25,000 per semester) (source: \"Tuition\" page on cugw.tg, accessed November 6, 2026, no year stated).",
    site: "https://cugw.tg/",
    description: "Fondée en 2012, propose des filières en anglais (Faculty of ICT et Faculty of Sciences), programmes IA/robotique et informatique.", descriptionEn: "Founded in 2012, offers programs taught in English (Faculty of ICT and Faculty of Sciences), AI/robotics and computer science programs.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne : contacte l'établissement directement.", noteEn: "No calendar published online: contact the school directly."
    }
  },
  "hest": {
    name: "École des Hautes Études de Sciences et Technologies (HEST)",
    nameEn: "School of Advanced Studies in Science and Technology (HEST)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence", "Master"],
    niveauxEn: ["BTS", "Bachelor's", "Master's"],
    filieres: ["Systèmes et Réseaux Informatiques", "Développement d'Application", "Maintenance Informatique", "Informatique Industrielle", "Robotique et Intelligence Artificielle", "Cybersécurité", "UX/UI Design", "Génie Logiciel", "Ingénierie Informatique Mobile et Web"],
    filieresEn: ["Computer Systems and Networks", "Application Development", "Computer Maintenance", "Industrial Computing", "Robotics and Artificial Intelligence", "Cybersecurity", "UX/UI Design", "Software Engineering", "Mobile and Web Computer Engineering"],
    duree: "BTS : 2 ans · Licence : 3 ans · Master : 2 ans", dureeEn: "BTS: 2 years · Bachelor's: 3 years · Master's: 2 years",
    admission: "BTS : Bac toutes séries · Licence : Bac série scientifique ou équivalent · Master : Licence en sciences et technologies ou équivalent", admissionEn: "BTS: Bac, any series · Bachelor's: science Bac or equivalent · Master's: bachelor's in science and technology or equivalent",
    frais: "Tarifs officiels 2026-2027, par an : BTS 325 000 FCFA + 25 000 d'inscription + 60 000 de tenues · Licence 575 000 FCFA + 25 000 d'inscription + 60 000 de tenues · Master 950 000 FCFA + 50 000 d'inscription (non remboursable). Paiement en 5 ou 6 versements, le premier à l'admission, à la banque. Ordinateur portable obligatoire (ou 300 000 FCFA pour un neuf remis par l'école). Réductions pour les premiers inscrits et les nouveaux bacheliers : voir la page Bourses (source : hest-edu.net/inscription, consulté le 6 novembre 2026).", fraisEn: "Official 2026-2027 fees, per year: BTS 325,000 FCFA + 25,000 registration + 60,000 for uniforms · Bachelor's 575,000 FCFA + 25,000 registration + 60,000 for uniforms · Master's 950,000 FCFA + 50,000 registration (non-refundable). Payment in 5 or 6 installments, the first one at admission, at the bank. A laptop is mandatory (or 300,000 FCFA for a new one provided by the school). Discounts for the first enrollees and new high-school graduates: see the Scholarships page (source: hest-edu.net/inscription, accessed November 6, 2026).",
    site: "https://www.hest-edu.net/",
    description: "Une des offres informatique les plus complètes du comparatif (BTS à Master), à Tokoin Wuiti, propose aussi économie/gestion et sciences de l'information et de la communication.", descriptionEn: "One of the most complete computer science offerings in this comparison (BTS to Master's), in Tokoin Wuiti, also offers economics/management and information and communication sciences.",
    datesCles: {
      mode: "continue",
      note: "Pour 2026-2027, l'école indique encore « Date à confirmer » pour la rentrée des cycles BTS/Licence et Master (hest-edu.net, consulté le 6 novembre 2026). Repère 2024-2025 : rentrée BTS/Licence début octobre, Master mi-novembre.", noteEn: "For 2026-2027, the school still shows \"Date to be confirmed\" for the start of its BTS/Bachelor's and Master's programs (hest-edu.net, accessed November 6, 2026). 2024-2025 reference: BTS/Bachelor's start in early October, Master's in mid-November.",
      anneeReference: "2024-2025",
      aVerifier: true
    }
  },
  "escen": {
    name: "École Supérieure de Commerce et de l'Économie Numérique (ESCEN)",
    nameEn: "Higher School of Commerce and Digital Economy (ESCEN)",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    agreeNote: "La filière Intelligence Artificielle & Génie Logiciel n'existe qu'en Licence Professionnelle sur le site officiel (escen.university, vérifié) : le Master Professionnel actuellement proposé couvre Finance Digitale et Management de Projets & Transformation Digitale, pas l'informatique.", agreeNoteEn: "The Artificial Intelligence & Software Engineering program exists only as a professional bachelor's on the official website (escen.university, checked): the professional master's currently offered covers Digital Finance and Project Management & Digital Transformation, not computer science.",
    niveaux: ["Licence Professionnelle"],
    niveauxEn: ["Professional bachelor's"],
    filieres: ["Intelligence Artificielle & Génie Logiciel"],
    filieresEn: ["Artificial Intelligence & Software Engineering"],
    duree: "Licence Pro : 3 ans (180 crédits, 6 semestres, système LMD)", dureeEn: "Professional bachelor's: 3 years (180 credits, 6 semesters, LMD system)",
    admission: "Non précisée publiquement : à confirmer directement", admissionEn: "Not stated publicly: to be confirmed directly",
    frais: "Non communiqué sur le site officiel (vérifié le 6 novembre 2026) : contacte l'école directement.", fraisEn: "Not published on the official website (checked November 6, 2026): contact the school directly.",
    site: "https://escen.university/",
    description: "Se présente comme la 1ère école supérieure d'économie numérique d'Afrique subsaharienne francophone, filière IA & Génie Logiciel en partenariat avec l'école d'ingénieurs ESTIA (Biarritz, France), présentiel et à distance.", descriptionEn: "Presents itself as the first school of digital economy in French-speaking sub-Saharan Africa, AI & Software Engineering program in partnership with the ESTIA engineering school (Biarritz, France), on-site and online.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne : contacte l'établissement directement.", noteEn: "No calendar published online: contact the school directly."
    }
  },
  "lucas": {
    name: "LUCAS University College",
    ville: ["Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence", "Master"],
    niveauxEn: ["BTS", "Bachelor's", "Master's"],
    filieres: ["Développement d'Applications", "Réseaux et Télécommunications", "Sécurité Informatique", "Mathématiques et Informatique"],
    filieresEn: ["Application Development", "Networks and Telecommunications", "Computer Security", "Mathematics and Computer Science"],
    duree: null,
    admission: "Cours du jour, du soir, week-end, ou à distance avec séminaires mensuels", admissionEn: "Day, evening or weekend classes, or online with monthly seminars",
    frais: "Scolarité annuelle normale 2024-2025 (diplôme local, hors frais d'inscription) : 1 490 000 FCFA (BTS1/L1) à 1 770 000 FCFA (L3) · Master : 1 600 000 à 1 750 000 FCFA. + frais d'inscription annuels : 50 000 FCFA (BTS/Licence) ou 60 000 FCFA (Master). Tarifs réduits sur dossier d'aide financière (dès 480 000 FCFA). Grille datée 2024-2025, commune aux campus Togo/Mali/Niger, à reconfirmer pour l'année en cours (source : PDF officiel lucas-universities-colleges.net — site dont le certificat de sécurité est expiré depuis 2020, à visiter avec prudence).", fraisEn: "Standard 2024-2025 annual tuition (local diploma, excluding registration fees): 1,490,000 FCFA (BTS1/L1) to 1,770,000 FCFA (L3) · Master's: 1,600,000 to 1,750,000 FCFA. + annual registration fees: 50,000 FCFA (BTS/Bachelor's) or 60,000 FCFA (Master's). Reduced rates with a financial aid application (from 480,000 FCFA). Fee schedule dated 2024-2025, shared by the Togo/Mali/Niger campuses, to be reconfirmed for the current year (source: official PDF on lucas-universities-colleges.net — a site whose security certificate has been expired since 2020, visit with caution).",
    site: "https://www.lucas-universities-colleges.net/",
    description: "Fondé en 2018, réseau panafricain (présent aussi au Ghana, Niger, Mali), partenariats pour doubles diplômes avec MBway et My Digital School (France) et Griffith College (Irlande), incubateur pour jeunes entrepreneurs.", descriptionEn: "Founded in 2018, a pan-African network (also present in Ghana, Niger and Mali), dual-degree partnerships with MBway and My Digital School (France) and Griffith College (Ireland), incubator for young entrepreneurs.",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne : contacte l'établissement directement.", noteEn: "No calendar published online: contact the school directly."
    }
  },
  "knowbridge": {
    name: "KNOWBRIDGE University Institute",
    ville: ["Sokodé", "Lomé"],
    statut: "prive",
    agree: true,
    niveaux: ["Licence", "Master"],
    niveauxEn: ["Bachelor's", "Master's"],
    filieres: ["Cybersécurité", "Génie des Technologies de l'Information"],
    filieresEn: ["Cybersecurity", "Information Technology Engineering"],
    duree: null,
    admission: "Sur dossier (admission.knowbridge.com), traitement 2 à 4 semaines, 2 programmes maximum par candidature", admissionEn: "On application (admission.knowbridge.com), processed in 2 to 4 weeks, up to 2 programs per application",
    frais: "Licence : 590 000 FCFA/an + 30 000 FCFA d'inscription + 10 000 FCFA de dossier · Master : 750 000 FCFA/an + 50 000 FCFA d'inscription + 20 000 FCFA de dossier. Paiement en 3 tranches (source : knowbridge.com/pages/fees).", fraisEn: "Bachelor's: 590,000 FCFA/year + 30,000 FCFA registration + 10,000 FCFA application fee · Master's: 750,000 FCFA/year + 50,000 FCFA registration + 20,000 FCFA application fee. Payment in 3 installments (source: knowbridge.com/pages/fees).",
    site: "https://www.knowbridge.com/",
    description: "Institut privé fondé à Sokodé, formations en présentiel, à distance et modules flexibles, combine cybersécurité, développement logiciel et intelligence artificielle ; a ouvert un second campus à Lomé (Djidjolé) en juillet 2026 (source : blog officiel knowbridge.com).", descriptionEn: "Private institute founded in Sokodé, on-site, online and flexible modules, combining cybersecurity, software development and artificial intelligence; opened a second campus in Lomé (Djidjolé) in July 2026 (source: official knowbridge.com blog).",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié en ligne : contacte l'établissement directement (admission.knowbridge.com).", noteEn: "No calendar published online: contact the school directly (admission.knowbridge.com)."
    }
  },
  "bakpessi": {
    name: "Institut Supérieur de Management Mgr BAKPESSI",
    nameEn: "Mgr BAKPESSI Higher Institute of Management",
    ville: ["Kara"],
    statut: "prive",
    agree: true,
    niveaux: ["BTS", "Licence Professionnelle", "Master Professionnel"],
    niveauxEn: ["BTS", "Professional bachelor's", "Professional master's"],
    filieres: ["Maintenance Informatique & Réseaux", "Développement d'Applications", "Informatique Industrielle", "Informatique de Gestion", "Électronique", "Électrotechnique"],
    filieresEn: ["Computer Maintenance & Networks", "Application Development", "Industrial Computing", "Business Computing", "Electronics", "Electrical Engineering"],
    duree: null,
    admission: "Sur dossier (relevé de notes du Bac, diplôme, acte de naissance, photo, pièce d'identité, lettre de motivation, CV)", admissionEn: "On application (Bac transcript, diploma, birth certificate, photo, ID, cover letter, CV)",
    frais: "Non communiqué publiquement.", fraisEn: "Not made public.",
    site: "https://institut-bakpessi.com/",
    description: "Institut privé fondé en 2004 à Tomdè (Kara) par l'ex-Secrétaire Général de l'Université de Lomé, 1er institut privé du nord du Togo ; le pôle « Sciences Technologiques » couvre l'informatique parmi 8 pôles de formation (source : institut-bakpessi.com).", descriptionEn: "Private institute founded in 2004 in Tomdè (Kara) by the former Secretary General of the University of Lomé, the first private institute in northern Togo; its \"Technological Sciences\" department covers computer science among 8 training departments (source: institut-bakpessi.com).",
    datesCles: {
      mode: "inconnu",
      note: "Aucun calendrier publié : contact direct uniquement.", noteEn: "No calendar published: direct contact only.",
      contact: "+228 26 60 13 67 / isgmgrb@gmail.com"
    }
  },
  "lome-digital-school": {
    name: "Lomé Digital School",
    ville: ["Lomé"],
    statut: "prive",
    agreeNote: "Bootcamp accrédité ICDL, pas un cursus académique classique : aucun agrément d'État confirmé pour l'instant.", agreeNoteEn: "ICDL-accredited bootcamp, not a traditional academic program: no State accreditation confirmed so far.",
    niveaux: ["Bootcamp / Formation courte"],
    niveauxEn: ["Bootcamp / Short course"],
    filieres: ["Design UX/UI", "Développement Web & Mobile", "Marketing Digital", "Data Analytics & Power BI", "Product Management", "Intelligence Artificielle pour les professionnels", "Stratégie & Création de contenu"],
    filieresEn: ["UX/UI Design", "Web & Mobile Development", "Digital Marketing", "Data Analytics & Power BI", "Product Management", "Artificial Intelligence for professionals", "Content Strategy & Creation"],
    duree: "De 5 samedis à 12 semaines selon le programme", dureeEn: "From 5 Saturdays to 12 weeks depending on the program",
    admission: "Ouvert aux débutants, étudiants, jeunes diplômés et professionnels en reconversion : formations adaptées au niveau du candidat", admissionEn: "Open to beginners, students, recent graduates and professionals changing careers: courses adapted to each applicant's level",
    frais: "90 000 FCFA (Stratégie & Création de contenu) · 180 000 (Design UX/UI) · 220 000 (IA pour les professionnels ou Product management) · 350 000 (Data Analytics & Power BI, Développement web & mobile, ou Marketing digital) : source : lomedigitalschool.com, consulté le 6 novembre 2026.", fraisEn: "90,000 FCFA (Content Strategy & Creation) · 180,000 (UX/UI Design) · 220,000 (AI for professionals or Product management) · 350,000 (Data Analytics & Power BI, Web & mobile development, or Digital marketing): source: lomedigitalschool.com, accessed November 6, 2026.",
    site: "https://lomedigitalschool.com/",
    description: "Se présente comme le premier bootcamp numérique du Togo : formations courtes et pratiques (UX/UI, marketing digital, data, dev, IA), pensées pour une insertion professionnelle rapide plutôt qu'un diplôme académique long.", descriptionEn: "Presents itself as Togo's first digital bootcamp: short, hands-on courses (UX/UI, digital marketing, data, development, AI), designed for quick entry into the job market rather than a long academic degree.",
    datesCles: {
      mode: "continue",
      note: "Sessions ouvertes en continu selon les programmes : pas de calendrier académique fixe comme les autres écoles du comparatif.", noteEn: "Sessions open year-round depending on the program: no fixed academic calendar like the other schools in this comparison."
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
    questionEn: "What attracts you most about tech?",
    options: [
      { label: "Construire des applications et des sites qui marchent bien", labelEn: "Building applications and websites that work well", domain: "Développement" },
      { label: "Comprendre des chiffres, des tendances, entraîner des modèles", labelEn: "Understanding numbers and trends, training models", domain: "Data & IA" },
      { label: "Protéger des systèmes contre les attaques", labelEn: "Protecting systems against attacks", domain: "Sécurité" },
      { label: "Créer des interfaces belles et faciles à utiliser", labelEn: "Creating interfaces that are beautiful and easy to use", domain: "Produit & Design" },
      { label: "Faire tourner des serveurs et des infrastructures fiables", labelEn: "Running reliable servers and infrastructure", domain: "Infrastructure & DevOps" },
      { label: "Faire connaître un produit ou une marque en ligne", labelEn: "Building awareness for a product or brand online", domain: "Marketing digital" },
      { label: "Organiser, planifier, piloter des équipes et des projets", labelEn: "Organizing, planning and steering teams and projects", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Pour organiser un événement dans ton lycée (kermesse, tournoi, fête de fin d'année), tu prendrais plutôt en charge...",
    questionEn: "To organize an event at your school (fair, tournament, end-of-year party), you'd rather take charge of...",
    options: [
      { label: "Un petit outil ou une liste pour gérer les inscriptions", labelEn: "A small tool or a list to manage sign-ups", domain: "Développement" },
      { label: "L'analyse des votes ou des résultats pour comprendre les tendances", labelEn: "Analyzing votes or results to spot trends", domain: "Data & IA" },
      { label: "La surveillance pour que personne ne triche ou ne vole la caisse", labelEn: "Keeping watch so no one cheats or steals the cash box", domain: "Sécurité" },
      { label: "Les affiches et la décoration", labelEn: "The posters and decorations", domain: "Produit & Design" },
      { label: "La sono, l'électricité, tout ce qui doit tenir toute la soirée", labelEn: "The sound system, the power, everything that has to hold up all night", domain: "Infrastructure & DevOps" },
      { label: "La promo sur les réseaux sociaux pour faire venir du monde", labelEn: "The social media promo to bring people in", domain: "Marketing digital" },
      { label: "La coordination des équipes et du budget", labelEn: "Coordinating the teams and the budget", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Face à un problème, ton premier réflexe...",
    questionEn: "Faced with a problem, your first instinct is to...",
    options: [
      { label: "Écrire du code pour le résoudre", labelEn: "Write code to solve it", domain: "Développement" },
      { label: "Analyser des données pour comprendre pourquoi", labelEn: "Analyze data to understand why", domain: "Data & IA" },
      { label: "Chercher comment quelqu'un pourrait en abuser", labelEn: "Look for how someone could exploit it", domain: "Sécurité" },
      { label: "Repenser l'expérience pour que ça n'arrive plus", labelEn: "Rethink the experience so it doesn't happen again", domain: "Produit & Design" },
      { label: "Vérifier si l'infrastructure tient la charge", labelEn: "Check whether the infrastructure can handle the load", domain: "Infrastructure & DevOps" },
      { label: "Communiquer dessus pour rassurer tout le monde", labelEn: "Communicate about it to reassure everyone", domain: "Marketing digital" },
      { label: "Réunir les bonnes personnes pour trancher", labelEn: "Bring the right people together to decide", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Ton environnement de travail idéal...",
    questionEn: "Your ideal work environment...",
    options: [
      { label: "Seul·e, concentré·e, à écrire du code", labelEn: "Alone, focused, writing code", domain: "Développement" },
      { label: "Entouré·e de tableaux de données et de graphiques", labelEn: "Surrounded by data tables and charts", domain: "Data & IA" },
      { label: "En veille permanente, à surveiller des menaces", labelEn: "On constant watch, monitoring for threats", domain: "Sécurité" },
      { label: "Avec des maquettes, des couleurs, du visuel", labelEn: "Working with mockups, colors, visuals", domain: "Produit & Design" },
      { label: "En salle serveur ou sur des consoles cloud", labelEn: "In a server room or on cloud consoles", domain: "Infrastructure & DevOps" },
      { label: "Sur les réseaux sociaux, au contact d'une audience", labelEn: "On social media, in touch with an audience", domain: "Marketing digital" },
      { label: "En réunion, à coordonner plusieurs personnes", labelEn: "In meetings, coordinating several people", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Ce qui te frustre le plus...",
    questionEn: "What frustrates you the most...",
    options: [
      { label: "Un code mal écrit qui plante", labelEn: "Poorly written code that crashes", domain: "Développement" },
      { label: "Des données mal organisées ou peu fiables", labelEn: "Data that's poorly organized or unreliable", domain: "Data & IA" },
      { label: "Une faille de sécurité qu'on préfère ignorer", labelEn: "A security flaw that people would rather ignore", domain: "Sécurité" },
      { label: "Une interface confuse et pénible à utiliser", labelEn: "An interface that's confusing and painful to use", domain: "Produit & Design" },
      { label: "Un serveur qui tombe en panne au mauvais moment", labelEn: "A server that goes down at the worst possible time", domain: "Infrastructure & DevOps" },
      { label: "Une campagne qui rate complètement sa cible", labelEn: "A campaign that completely misses its target", domain: "Marketing digital" },
      { label: "Un projet lancé sans plan clair", labelEn: "A project launched without a clear plan", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Ce que tu ferais gratuitement, sur ton temps libre...",
    questionEn: "What you'd do for free, in your spare time...",
    options: [
      { label: "Bidouiller un petit projet de code perso", labelEn: "Tinker with a small personal coding project", domain: "Développement" },
      { label: "Explorer un jeu de données qui t'intéresse", labelEn: "Explore a dataset that interests you", domain: "Data & IA" },
      { label: "Chercher comment on pourrait pirater un compte ou une appli, pour mieux comprendre comment s'en protéger", labelEn: "Figure out how an account or app could be hacked, to better understand how to protect it", domain: "Sécurité" },
      { label: "Redessiner l'appli d'une marque que tu utilises", labelEn: "Redesign the app of a brand you use", domain: "Produit & Design" },
      { label: "Bidouiller les réglages de ton téléphone ou de ta box internet pour mieux comprendre comment ça marche", labelEn: "Tinker with your phone or internet router settings to understand how they really work", domain: "Infrastructure & DevOps" },
      { label: "Créer du contenu et faire grandir une page", labelEn: "Create content and grow a page", domain: "Marketing digital" },
      { label: "Organiser un événement ou un club", labelEn: "Organize an event or a club", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Une matière scolaire où tu es à l'aise...",
    questionEn: "A school subject where you feel comfortable...",
    options: [
      { label: "Algorithmique et logique", labelEn: "Algorithms and logic", domain: "Développement" },
      { label: "Mathématiques et statistiques", labelEn: "Mathematics and statistics", domain: "Data & IA" },
      { label: "Informatique, avec l'envie de comprendre comment ça marche vraiment", labelEn: "Computer science, with a drive to understand how things really work", domain: "Sécurité" },
      { label: "Arts plastiques et créativité visuelle", labelEn: "Visual arts and visual creativity", domain: "Produit & Design" },
      { label: "Sciences physiques et systèmes", labelEn: "Physics and systems", domain: "Infrastructure & DevOps" },
      { label: "Communication et langues", labelEn: "Communication and languages", domain: "Marketing digital" },
      { label: "Économie et gestion", labelEn: "Economics and management", domain: "Gestion & Management" }
    ]
  },
  {
    type: "domain",
    question: "Dans un projet d'équipe, ton rôle naturel...",
    questionEn: "In a team project, your natural role is...",
    options: [
      { label: "Celui ou celle qui code la solution", labelEn: "The one who codes the solution", domain: "Développement" },
      { label: "Celui ou celle qui analyse les résultats", labelEn: "The one who analyzes the results", domain: "Data & IA" },
      { label: "Celui ou celle qui teste et cherche les failles", labelEn: "The one who tests and looks for flaws", domain: "Sécurité" },
      { label: "Celui ou celle qui soigne la présentation", labelEn: "The one who takes care of the presentation", domain: "Produit & Design" },
      { label: "Celui ou celle qui s'assure que tout tourne techniquement", labelEn: "The one who makes sure everything runs technically", domain: "Infrastructure & DevOps" },
      { label: "Celui ou celle qui présente et « vend » le projet", labelEn: "The one who presents and \"sells\" the project", domain: "Marketing digital" },
      { label: "Celui ou celle qui coordonne l'équipe", labelEn: "The one who coordinates the team", domain: "Gestion & Management" }
    ]
  },
  {
    type: "niveau",
    question: "Une fois ton domaine identifié : quel niveau veux-tu viser pour commencer ?",
    questionEn: "Once you've identified your domain: what level do you want to aim for to start?",
    options: [
      { label: "Un diplôme court et professionnalisant (BTS, Brevet de Technicien)", labelEn: "A short, career-focused diploma (BTS, Brevet de Technicien)", value: "court" },
      { label: "Une Licence classique (Bac+3)", labelEn: "A standard Bachelor's degree (Bac+3)", value: "licence" },
      { label: "Directement un cursus long (Master, Ingénieur)", labelEn: "Directly a long program (Master's, Engineering degree)", value: "long" },
      { label: "Je ne sais pas encore", labelEn: "I don't know yet", value: "peu-importe" }
    ]
  },
  {
    type: "ville",
    question: "Où peux-tu ou veux-tu étudier ?",
    questionEn: "Where can or do you want to study?",
    options: [
      { label: "À Lomé", labelEn: "In Lomé", value: "Lomé" },
      { label: "À Kara", labelEn: "In Kara", value: "Kara" },
      { label: "À Sokodé", labelEn: "In Sokodé", value: "Sokodé" },
      { label: "À Bassar", labelEn: "In Bassar", value: "Bassar" },
      { label: "À Atakpamé", labelEn: "In Atakpamé", value: "Atakpamé" },
      { label: "Peu importe, je peux me déplacer", labelEn: "It doesn't matter, I can travel", value: "peu-importe" }
    ]
  },
  {
    type: "statut",
    question: "Qu'est-ce qui correspond le mieux à ta situation budgétaire ?",
    questionEn: "What best matches your budget situation?",
    options: [
      { label: "Je dois viser le public, gratuit ou presque", labelEn: "I need to aim for public school, free or almost free", value: "public" },
      { label: "Je peux payer une école privée, avec un budget serré", labelEn: "I can afford a private school, on a tight budget", value: "prive" },
      { label: "Le budget n'est pas un frein majeur", labelEn: "Budget isn't a major constraint", value: "peu-importe" }
    ]
  },
  {
    type: "priorite",
    question: "Qu'est-ce qui compte le plus pour toi dans une école ?",
    questionEn: "What matters most to you in a school?",
    options: [
      { label: "Que le diplôme soit officiellement reconnu (agrément d'État, CAMES)", labelEn: "That the diploma is officially recognized (state accreditation, CAMES)", value: "agree" },
      { label: "Une formation concrète, avec beaucoup de pratique et de stages", labelEn: "Hands-on training, with lots of practice and internships", value: "pratique" },
      { label: "Peu importe, je regarderai au cas par cas", labelEn: "It doesn't matter, I'll look case by case", value: "peu-importe" }
    ]
  }
];

// Questions de deuxième niveau, injectées juste après la 8ᵉ question (une fois
// le domaine dominant identifié) pour affiner la recommandation vers un métier
// précis plutôt que les 3 premiers métiers du domaine par ordre d'insertion.
// Chaque option porte un ou plusieurs ids de ROLES : le score se cumule question
// par question, comme pour les questions de domaine.
const ROLE_QUESTIONS = {
  "Développement": [
    {
      type: "role",
      question: "Quel type de projet te motive le plus ?",
      questionEn: "What kind of project excites you the most?",
      options: [
        { label: "Un site web ou une application que le grand public utilise", labelEn: "A website or app used by the general public", roles: ["web-dev", "mobile"] },
        { label: "Ce qui fait tourner tout ça derrière : bases de données, API, règles métier", labelEn: "What runs behind the scenes: databases, APIs, business logic", roles: ["backend", "erp-crm"] },
        { label: "Un jeu vidéo ou une expérience immersive en réalité virtuelle/augmentée", labelEn: "A video game or an immersive VR/AR experience", roles: ["game-developer", "ar-vr-developer"] },
        { label: "Repérer les bugs et garantir la qualité avant la mise en production", labelEn: "Spotting bugs and ensuring quality before release", roles: ["qa-testeur"] },
        { label: "L'architecture technique globale d'un système complexe, ou une application décentralisée (blockchain)", labelEn: "The overall technical architecture of a complex system, or a decentralized (blockchain) app", roles: ["architecte-logiciel", "blockchain-web3"] },
        { label: "Faire vivre et évoluer un site déjà en ligne, au quotidien", labelEn: "Keeping an existing website running and evolving, day to day", roles: ["webmaster"] }
      ]
    },
    {
      type: "role",
      question: "Tu préfères...",
      questionEn: "You'd rather...",
      options: [
        { label: "Construire des interfaces que les gens manipulent directement (web ou mobile)", labelEn: "Build interfaces people interact with directly (web or mobile)", roles: ["web-dev", "mobile"] },
        { label: "Travailler sur la logique et les données, sans forcément d'interface visuelle", labelEn: "Work on logic and data, without necessarily a visual interface", roles: ["backend", "erp-crm"] },
        { label: "Explorer des technologies encore peu répandues (jeux, VR/AR, blockchain)", labelEn: "Explore technologies that are still uncommon (games, VR/AR, blockchain)", roles: ["game-developer", "ar-vr-developer", "blockchain-web3"] },
        { label: "Être la personne rigoureuse qui traque ce qui ne marche pas", labelEn: "Be the meticulous person who hunts down what's broken", roles: ["qa-testeur"] },
        { label: "Prendre les décisions techniques structurantes d'un projet", labelEn: "Make the structuring technical decisions on a project", roles: ["architecte-logiciel"] },
        { label: "Assurer la maintenance fiable d'un système existant plutôt que d'en créer un nouveau", labelEn: "Reliably maintain an existing system rather than build a new one", roles: ["webmaster"] }
      ]
    }
  ],
  "Data & IA": [
    {
      type: "role",
      question: "Ce qui t'intéresse le plus avec la donnée...",
      questionEn: "What interests you most about data...",
      options: [
        { label: "Construire des modèles qui apprennent et font des prédictions (IA, machine learning)", labelEn: "Building models that learn and make predictions (AI, machine learning)", roles: ["data-ia"] },
        { label: "Transformer des chiffres en décisions claires pour une entreprise", labelEn: "Turning numbers into clear decisions for a business", roles: ["data-analyst"] },
        { label: "Construire les pipelines qui collectent, nettoient et acheminent la donnée", labelEn: "Building the pipelines that collect, clean and move data", roles: ["data-engineer"] },
        { label: "Garantir que les bases de données restent rapides, fiables et sécurisées", labelEn: "Ensuring databases stay fast, reliable and secure", roles: ["dba"] },
        { label: "Utiliser les maths et les statistiques pour des décisions financières", labelEn: "Using math and statistics for financial decisions", roles: ["quant-developer"] }
      ]
    },
    {
      type: "role",
      question: "Ton style de travail avec les chiffres...",
      questionEn: "Your working style with numbers...",
      options: [
        { label: "Expérimenter avec des algorithmes et de gros volumes de données non structurées", labelEn: "Experimenting with algorithms and large volumes of unstructured data", roles: ["data-ia"] },
        { label: "Créer des tableaux de bord et raconter une histoire claire à partir des données", labelEn: "Building dashboards and telling a clear story from data", roles: ["data-analyst"] },
        { label: "Une approche d'ingénierie : automatiser, industrialiser, fiabiliser des flux de données", labelEn: "An engineering approach: automating, industrializing, hardening data flows", roles: ["data-engineer"] },
        { label: "Une approche très technique et minutieuse de l'administration de systèmes de données", labelEn: "A highly technical, meticulous approach to managing data systems", roles: ["dba"] },
        { label: "Une approche mathématique et quantitative, orientée finance ou trading", labelEn: "A mathematical, quantitative approach, geared toward finance or trading", roles: ["quant-developer"] }
      ]
    }
  ],
  "Sécurité": [
    {
      type: "role",
      question: "Face à la sécurité informatique, tu préfères...",
      questionEn: "When it comes to cybersecurity, you'd rather...",
      options: [
        { label: "Attaquer un système (avec autorisation) pour trouver ses failles avant les vrais pirates", labelEn: "Attack a system (with authorization) to find its flaws before real attackers do", roles: ["pentester"] },
        { label: "Surveiller en continu et réagir vite face à une menace en cours", labelEn: "Continuously monitor and react quickly to an ongoing threat", roles: ["analyste-soc"] },
        { label: "Vérifier que les systèmes d'une organisation respectent les bonnes pratiques et les normes", labelEn: "Check that an organization's systems follow best practices and standards", roles: ["auditeur-ssi"] },
        { label: "Piloter la stratégie de sécurité globale d'une organisation", labelEn: "Steer an organization's overall security strategy", roles: ["rssi"] },
        { label: "Protéger les technologies et l'infrastructure réseau au quotidien", labelEn: "Protect network technologies and infrastructure day to day", roles: ["cyber"] },
        { label: "Veiller à la conformité et à la bonne utilisation des données personnelles", labelEn: "Ensure compliance and proper use of personal data", roles: ["dpo"] }
      ]
    },
    {
      type: "role",
      question: "Ce qui te correspond le mieux...",
      questionEn: "What matches you best...",
      options: [
        { label: "Un rôle offensif : simuler des attaques pour révéler les vulnérabilités", labelEn: "An offensive role: simulating attacks to reveal vulnerabilities", roles: ["pentester"] },
        { label: "Un rôle défensif : détection et réponse aux incidents en temps réel", labelEn: "A defensive role: detection and incident response in real time", roles: ["analyste-soc"] },
        { label: "Un rôle de contrôle et de conseil, plutôt que d'action directe", labelEn: "A control and advisory role, rather than hands-on action", roles: ["auditeur-ssi", "dpo"] },
        { label: "Un rôle de direction et de décision stratégique", labelEn: "A leadership and strategic decision-making role", roles: ["rssi"] },
        { label: "Un rôle très technique, au contact direct des systèmes et réseaux", labelEn: "A hands-on technical role, working directly with systems and networks", roles: ["cyber"] }
      ]
    }
  ],
  "Produit & Design": [
    {
      type: "role",
      question: "Dans la conception d'un produit, ce qui te parle le plus...",
      questionEn: "In building a product, what speaks to you the most...",
      options: [
        { label: "Définir la vision et les priorités d'un produit numérique", labelEn: "Defining the vision and priorities of a digital product", roles: ["product-manager", "product-owner"] },
        { label: "Dessiner des interfaces et des parcours agréables à utiliser", labelEn: "Designing interfaces and journeys that are pleasant to use", roles: ["ux-ui"] },
        { label: "Créer les visuels et l'identité graphique d'une marque", labelEn: "Creating a brand's visuals and graphic identity", roles: ["graphiste"] },
        { label: "Écrire les textes d'une interface pour guider et rassurer les utilisateurs", labelEn: "Writing interface text to guide and reassure users", roles: ["ux-writer", "technical-writer"] },
        { label: "Comprendre en profondeur les utilisateurs avant de concevoir quoi que ce soit", labelEn: "Deeply understanding users before designing anything", roles: ["ux-researcher"] },
        { label: "Concevoir les règles et la progression d'un jeu", labelEn: "Designing a game's rules and progression", roles: ["game-designer"] }
      ]
    },
    {
      type: "role",
      question: "Ton talent naturel...",
      questionEn: "Your natural talent...",
      options: [
        { label: "Prioriser, trancher, faire des choix produit sous contrainte", labelEn: "Prioritizing, deciding, making product trade-offs under constraints", roles: ["product-manager", "product-owner"] },
        { label: "Un sens esthétique et un souci du détail visuel", labelEn: "An eye for aesthetics and visual detail", roles: ["ux-ui", "graphiste"] },
        { label: "Une plume claire, précise, qui simplifie le compliqué", labelEn: "Clear, precise writing that simplifies the complicated", roles: ["ux-writer", "technical-writer"] },
        { label: "Poser les bonnes questions et écouter pour comprendre un besoin", labelEn: "Asking the right questions and listening to understand a need", roles: ["ux-researcher"] },
        { label: "Imaginer des mécaniques de jeu amusantes et équilibrées", labelEn: "Imagining fun, balanced game mechanics", roles: ["game-designer"] }
      ]
    }
  ],
  "Infrastructure & DevOps": [
    {
      type: "role",
      question: "Ce qui t'attire dans l'infrastructure...",
      questionEn: "What draws you to infrastructure...",
      options: [
        { label: "Automatiser le déploiement et la fiabilité des applications dans le cloud", labelEn: "Automating deployment and reliability of cloud applications", roles: ["devops", "sre", "platform-engineer"] },
        { label: "Aider directement des utilisateurs à résoudre leurs problèmes informatiques", labelEn: "Directly helping users solve their IT problems", roles: ["support-it"] },
        { label: "Administrer et sécuriser les serveurs et réseaux d'une organisation", labelEn: "Administering and securing an organization's servers and networks", roles: ["sysadmin", "reseaux-telecoms"] },
        { label: "Programmer des objets connectés, des systèmes embarqués ou des robots", labelEn: "Programming connected devices, embedded systems or robots", roles: ["iot-embarque", "robotique"] },
        { label: "Superviser des systèmes industriels automatisés", labelEn: "Supervising automated industrial systems", roles: ["informatique-industrielle"] },
        { label: "Faire communiquer entre eux plusieurs systèmes ou logiciels différents", labelEn: "Making different systems or software work together", roles: ["integrateur-systemes", "salesforce-admin"] }
      ]
    },
    {
      type: "role",
      question: "Ton style de travail technique...",
      questionEn: "Your technical working style...",
      options: [
        { label: "Écrire du code pour automatiser l'infrastructure (scripts, pipelines CI/CD)", labelEn: "Writing code to automate infrastructure (scripts, CI/CD pipelines)", roles: ["devops", "sre", "platform-engineer"] },
        { label: "Un contact humain direct, patient et pédagogue", labelEn: "Direct, patient, teaching-oriented human contact", roles: ["support-it"] },
        { label: "Une rigueur réseau et système, au service de la sécurité", labelEn: "Network and systems rigor, in service of security", roles: ["sysadmin", "reseaux-telecoms"] },
        { label: "Un mélange d'électronique et de programmation", labelEn: "A mix of electronics and programming", roles: ["iot-embarque", "robotique", "informatique-industrielle"] },
        { label: "Assembler des briques existantes plutôt que tout construire depuis zéro", labelEn: "Assembling existing building blocks rather than building everything from scratch", roles: ["integrateur-systemes", "salesforce-admin"] }
      ]
    }
  ],
  "Marketing digital": [
    {
      type: "role",
      question: "Ce qui te motive dans le marketing digital...",
      questionEn: "What motivates you about digital marketing...",
      options: [
        { label: "Construire la stratégie globale de présence en ligne d'une marque", labelEn: "Building a brand's overall online presence strategy", roles: ["marketing-digital"] },
        { label: "Animer une communauté et créer du lien avec une audience", labelEn: "Engaging a community and building connection with an audience", roles: ["community-manager"] },
        { label: "Faire vendre une boutique en ligne, du catalogue au paiement", labelEn: "Driving sales for an online store, from catalog to checkout", roles: ["ecommerce-manager"] },
        { label: "Faire le pont entre une entreprise tech et les développeurs qui l'utilisent", labelEn: "Bridging a tech company and the developers who use it", roles: ["devrel"] },
        { label: "Tester rapidement des idées pour faire décoller la croissance", labelEn: "Quickly testing ideas to accelerate growth", roles: ["growth-hacker"] },
        { label: "Raconter une histoire de marque à travers du contenu écrit ou vidéo", labelEn: "Telling a brand's story through written or video content", roles: ["content-strategist"] },
        { label: "Optimiser des campagnes publicitaires pour un meilleur retour sur investissement", labelEn: "Optimizing ad campaigns for a better return on investment", roles: ["traffic-manager"] }
      ]
    },
    {
      type: "role",
      question: "Ton approche naturelle...",
      questionEn: "Your natural approach...",
      options: [
        { label: "Vision stratégique globale d'une marque en ligne", labelEn: "Overall strategic vision for an online brand", roles: ["marketing-digital"] },
        { label: "Relationnel et proximité avec une audience", labelEn: "Relational, close to an audience", roles: ["community-manager", "devrel"] },
        { label: "Orientée résultats commerciaux concrets et mesurables", labelEn: "Oriented toward concrete, measurable commercial results", roles: ["ecommerce-manager", "traffic-manager", "growth-hacker"] },
        { label: "Créative, orientée écriture et storytelling", labelEn: "Creative, writing- and storytelling-oriented", roles: ["content-strategist"] }
      ]
    }
  ],
  "Gestion & Management": [
    {
      type: "role",
      question: "Ce qui te correspond le plus dans la gestion de projets tech...",
      questionEn: "What suits you best in managing tech projects...",
      options: [
        { label: "Planifier, coordonner et livrer des projets IT dans les délais", labelEn: "Planning, coordinating and delivering IT projects on time", roles: ["project-manager", "technical-program-manager"] },
        { label: "Transmettre des compétences numériques à d'autres", labelEn: "Passing on digital skills to others", roles: ["formateur-informatique"] },
        { label: "Accompagner une organisation dans sa transformation numérique", labelEn: "Guiding an organization through its digital transformation", roles: ["consultant-transfo-digitale"] },
        { label: "Piloter la stratégie et les ressources informatiques d'une organisation", labelEn: "Steering an organization's IT strategy and resources", roles: ["dsi-responsable-informatique", "cto"] },
        { label: "Aligner les systèmes d'information avec la stratégie globale de l'entreprise", labelEn: "Aligning information systems with the company's overall strategy", roles: ["architecte-entreprise"] },
        { label: "Sécuriser juridiquement des projets numériques (contrats, données, propriété intellectuelle)", labelEn: "Providing legal security for digital projects (contracts, data, IP)", roles: ["juriste-it"] },
        { label: "Faciliter le travail d'une équipe agile au quotidien", labelEn: "Facilitating an agile team's day-to-day work", roles: ["scrum-master"] }
      ]
    },
    {
      type: "role",
      question: "Un second aspect qui te parle...",
      questionEn: "A second aspect that speaks to you...",
      options: [
        { label: "Faire le lien technique entre un produit et les besoins d'un client", labelEn: "Making the technical link between a product and a client's needs", roles: ["solutions-engineer"] },
        { label: "Diriger une équipe d'ingénieurs et faire le pont technique/organisationnel", labelEn: "Leading a team of engineers and bridging the technical and organizational sides", roles: ["engineering-manager"] },
        { label: "Traduire des besoins métier en exigences compréhensibles pour les équipes techniques", labelEn: "Translating business needs into requirements technical teams can understand", roles: ["business-analyst-it"] },
        { label: "Implémenter et configurer des logiciels de gestion d'entreprise (type SAP)", labelEn: "Implementing and configuring enterprise management software (like SAP)", roles: ["sap-consultant"] },
        { label: "Coordonner plusieurs programmes techniques complexes en parallèle", labelEn: "Coordinating several complex technical programs in parallel", roles: ["technical-program-manager"] },
        { label: "Avant tout, la coordination et la logistique d'un projet", labelEn: "Above all, the coordination and logistics of a project", roles: ["project-manager"] }
      ]
    }
  ]
};

// ---- Calendrier académique togolais (repère général) ----
// Enchaînement habituel d'une année de candidature au Togo. Les mois sont
// volontairement donnés comme des périodes indicatives ("généralement") : ils
// varient d'un établissement à l'autre : voir les dates précises par école
// dans SCHOOLS[id].datesCles quand elles existent.
const ACADEMIC_TIMELINE = [
  {
    periode: "Juin – Juillet",
    periodeEn: "June – July",
    titre: "Résultats du BAC",
    titreEn: "BAC results",
    description: "Publication des résultats du baccalauréat togolais. C'est le point de départ : la plupart des dossiers de candidature demandent une attestation ou un relevé du BAC.",
    descriptionEn: "Publication of Togolese baccalauréat results. This is the starting point: most application files require a BAC certificate or transcript."
  },
  {
    periode: "Juillet – Septembre",
    periodeEn: "July – September",
    titre: "Période de candidature",
    titreEn: "Application period",
    description: "Ouverture des inscriptions dans la majorité des écoles et universités. Beaucoup d'écoles privées togolaises admettent en continu sur cette période, sans date limite stricte.",
    descriptionEn: "Registration opens at most schools and universities. Many private Togolese schools admit on a rolling basis during this period, with no strict deadline."
  },
  {
    periode: "Août – Septembre",
    periodeEn: "August – September",
    titre: "Concours d'entrée",
    titreEn: "Entrance exams",
    description: "Pour les établissements qui en organisent un (universités publiques, grandes écoles comme l'EPL ou l'IAI-Togo) : épreuves écrites, généralement sur cette fenêtre.",
    descriptionEn: "For institutions that hold one (public universities, top schools like EPL or IAI-Togo): written exams, generally within this window."
  },
  {
    periode: "Septembre – Octobre",
    periodeEn: "September – October",
    titre: "Résultats d'admission",
    titreEn: "Admission results",
    description: "Publication des listes d'admis pour les établissements à concours ou à sélection sur dossier.",
    descriptionEn: "Publication of admission lists for institutions using entrance exams or file-based selection."
  },
  {
    periode: "Octobre – Novembre",
    periodeEn: "October – November",
    titre: "Rentrée académique",
    titreEn: "Start of the academic year",
    description: "Début des cours dans la plupart des écoles et universités togolaises.",
    descriptionEn: "Classes begin at most Togolese schools and universities."
  }
];

// Mots-clés utilisés pour relier un domaine (voir DOMAINS) aux filières réelles
// des écoles (voir SCHOOLS) : recherche insensible à la casse dans les filières.
const DOMAIN_KEYWORDS = {
  "Développement": ["développement", "génie logiciel", "logiciel", "programmeur", "application", "web", "mobile", "software engineering", "computer science"],
  "Data & IA": ["intelligence artificielle", "artificial intelligence", "data", "science des données", "statistique", "robotique", "robotics"],
  "Sécurité": ["cybersécurité", "sécurité", "cybercriminalité", "cybersecurity"],
  "Produit & Design": ["multimédia", "design", "infographie", "webdesign", "ux/ui", "ui/ux", "product management"],
  "Infrastructure & DevOps": ["réseaux", "systèmes", "administrateur", "maintenance informatique", "télécommunication", "telecommunication", "information technology"],
  "Marketing digital": ["marketing", "social media", "digital technology management", "création de contenu"],
  "Gestion & Management": ["gestion", "management"]
};
