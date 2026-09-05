// Assistant WIYAO — guide conversationnel, sans API externe.
// Ne génère aucun texte libre : ne fait que reformuler et pointer vers du
// contenu déjà vérifié du site (mêmes réponses que la FAQ, mêmes résultats
// que la recherche globale). Zéro coût, zéro backend, cohérent avec le
// principe "vérifié, pas deviné" du reste de WIYAO.
(function () {
  "use strict";

  function isEn() {
    return window.WIYAO_SEARCH ? window.WIYAO_SEARCH.currentLang() === "en" : false;
  }

  const INTENTS = [
    {
      keywords: ["sais pas quoi", "sait pas quoi", "aucune idee", "quoi choisir", "indecis", "perdu", "hesite", "no idea", "don't know what", "not sure what"],
      fr: { text: "Pas sûr·e de ton domaine ? Le test d'orientation te pose 14 questions et identifie le domaine tech et le métier précis qui te correspondent, puis les écoles adaptées à ton niveau et ta ville.", links: [{ label: "Faire le test d'orientation", url: "test-orientation.html" }] },
      en: { text: "Not sure about your field? The orientation test asks 14 questions to identify the tech field and the specific role that suit you, then the schools matched to your level and city.", links: [{ label: "Take the orientation test", url: "test-orientation.html" }] }
    },
    {
      keywords: ["combien", "coute", "cher", "frais", "prix", "payer", "bourse", "financement", "cost", "expensive", "scholarship", "tuition"],
      fr: { text: "Les frais de scolarité ne devraient pas être ce qui t'arrête : WIYAO recense les bourses proposées par les écoles, la bourse d'État togolaise, le financement bancaire et des bourses internationales.", links: [{ label: "Voir les bourses & financement", url: "bourses-financement.html" }, { label: "Comparer les écoles et leurs frais", url: "ecoles.html" }] },
      en: { text: "Tuition fees shouldn't be what stops you: WIYAO lists scholarships offered by schools, the Togolese State scholarship, bank financing and international scholarships.", links: [{ label: "See scholarships & funding", url: "bourses-financement.html" }, { label: "Compare schools and their fees", url: "ecoles.html" }] }
    },
    {
      keywords: ["stage", "emploi", "job", "embauche", "travail", "recrut", "internship", "hiring"],
      fr: { text: "Pour un stage ou un premier emploi tech : WIYAO liste les plateformes d'offres togolaises et les employeurs qui recrutent régulièrement des profils tech, plus un guide pratique pour te démarquer.", links: [{ label: "Voir stages & emploi", url: "stages-emploi.html" }] },
      en: { text: "For an internship or first tech job: WIYAO lists Togolese job platforms and employers that regularly hire tech profiles, plus a practical guide to stand out.", links: [{ label: "See internships & jobs", url: "stages-emploi.html" }] }
    },
    {
      keywords: ["communaute", "evenement", "meetup", "reseau", "rencontrer", "hackathon", "community", "network", "meet other"],
      fr: { text: "Pour rencontrer d'autres personnes dans la tech togolaise : communautés actives, événements annuels, hubs et incubateurs à connaître.", links: [{ label: "Découvrir l'écosystème togolais", url: "ecosysteme.html" }] },
      en: { text: "To meet other people in Togolese tech: active communities, annual events, hubs and incubators worth knowing.", links: [{ label: "Discover the Togolese ecosystem", url: "ecosysteme.html" }] }
    },
    {
      keywords: ["hors ligne", "hors connexion", "offline", "installer", "application mobile", "sans internet"],
      fr: { text: "Oui : WIYAO est une application web installable (PWA). Une fois une page visitée, elle reste accessible même sans connexion Internet.", links: [{ label: "Voir toute la FAQ", url: "faq.html#wiyao" }] },
      en: { text: "Yes: WIYAO is an installable web app (PWA). Once a page has been visited, it stays accessible even without an Internet connection.", links: [{ label: "See the full FAQ", url: "faq.html#wiyao" }] }
    },
    {
      keywords: ["gratuit", "wiyao payant", "site payant", "abonnement", "free", "is wiyao"],
      fr: { text: "Oui, WIYAO est entièrement gratuit : pas de compte à créer, pas d'abonnement, pas de publicité.", links: [{ label: "Voir toute la FAQ", url: "faq.html#wiyao" }] },
      en: { text: "Yes, WIYAO is entirely free: no account to create, no subscription, no ads.", links: [{ label: "See the full FAQ", url: "faq.html#wiyao" }] }
    },
    {
      keywords: ["ecole", "universite", "school", "university"],
      fr: { text: "WIYAO compare 32 écoles et universités togolaises qui forment à l'informatique : filières, niveaux, admission et frais.", links: [{ label: "Comparer les écoles", url: "ecoles.html" }] },
      en: { text: "WIYAO compares 32 Togolese schools and universities teaching computing: programs, levels, admission and fees.", links: [{ label: "Compare schools", url: "ecoles.html" }] }
    }
  ];

  const GREETINGS = ["bonjour", "salut", "hello", "hey", "coucou", "bonsoir"];
  const THANKS = ["merci", "thanks", "thank you"];

  const CHIPS = [
    { fr: "Je sais pas quoi choisir", en: "I don't know what to choose", query: "sais pas quoi choisir" },
    { fr: "Trouve-moi une école", en: "Find me a school", query: "ecole" },
    { fr: "Combien ça coûte ?", en: "How much does it cost?", query: "combien ça coûte" },
    { fr: "Comment trouver un stage ?", en: "How do I find an internship?", query: "trouver un stage" }
  ];

  let searchIndexPromise = null;
  function getSearchIndex() {
    if (!searchIndexPromise) {
      searchIndexPromise = window.WIYAO_SEARCH
        ? window.WIYAO_SEARCH.buildGlobalIndex().then((idx) => {
            const normalize = window.WIYAO_SEARCH.normalize;
            idx.forEach((item) => {
              item.searchText = normalize(item.title + " " + item.description + " " + (item.keywords || ""));
            });
            return idx;
          })
        : Promise.resolve([]);
    }
    return searchIndexPromise;
  }

  function matchIntent(normalizedQuery) {
    for (const intent of INTENTS) {
      if (intent.keywords.some((kw) => normalizedQuery.indexOf(kw) !== -1)) return intent;
    }
    return null;
  }

  function buildWidget() {
    const root = document.createElement("div");
    root.className = "wiyao-assistant";
    root.innerHTML = `
      <button type="button" class="wiyao-assistant-toggle" id="wiyao-assistant-toggle" aria-label="${isEn() ? "Open WIYAO assistant" : "Ouvrir l'assistant WIYAO"}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </button>
      <div class="wiyao-assistant-panel" id="wiyao-assistant-panel" hidden>
        <div class="wiyao-assistant-header">
          <span>${isEn() ? "WIYAO Assistant" : "Assistant WIYAO"}</span>
          <button type="button" class="wiyao-assistant-close" id="wiyao-assistant-close" aria-label="${isEn() ? "Close" : "Fermer"}">✕</button>
        </div>
        <div class="wiyao-assistant-messages" id="wiyao-assistant-messages"></div>
        <div class="wiyao-assistant-chips" id="wiyao-assistant-chips"></div>
        <form class="wiyao-assistant-form" id="wiyao-assistant-form">
          <input type="text" id="wiyao-assistant-input" autocomplete="off" placeholder="${isEn() ? "Type your question..." : "Écris ta question..."}" aria-label="${isEn() ? "Type your question" : "Écris ta question"}">
          <button type="submit" aria-label="${isEn() ? "Send" : "Envoyer"}">➤</button>
        </form>
      </div>
    `;
    document.body.appendChild(root);
    return root;
  }

  function addMessage(container, from, text, links) {
    const msg = document.createElement("div");
    msg.className = "wiyao-assistant-msg wiyao-assistant-msg-" + from;
    const bubble = document.createElement("div");
    bubble.className = "wiyao-assistant-bubble";
    bubble.textContent = text;
    msg.appendChild(bubble);
    if (links && links.length) {
      const linkWrap = document.createElement("div");
      linkWrap.className = "wiyao-assistant-links";
      links.forEach((l) => {
        const a = document.createElement("a");
        a.href = l.url;
        a.textContent = l.label;
        if (l.external) {
          a.target = "_blank";
          a.rel = "noopener";
        }
        linkWrap.appendChild(a);
      });
      msg.appendChild(linkWrap);
    }
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function respond(container, rawQuery) {
    const normalize = window.WIYAO_SEARCH ? window.WIYAO_SEARCH.normalize : (s) => s.toLowerCase();
    const query = normalize(rawQuery.trim());
    if (!query) return;

    if (GREETINGS.some((g) => query.indexOf(g) !== -1)) {
      addMessage(container, "bot", isEn()
        ? "Hi! Tell me what you're looking for (a roadmap, a school, a scholarship...) or pick a suggestion below."
        : "Salut ! Dis-moi ce que tu cherches (une roadmap, une école, une bourse...) ou choisis une suggestion ci-dessous.");
      return;
    }
    if (THANKS.some((t) => query.indexOf(t) !== -1)) {
      addMessage(container, "bot", isEn() ? "You're welcome! Anything else?" : "Avec plaisir ! Autre chose ?");
      return;
    }

    const intent = matchIntent(query);
    if (intent) {
      const r = isEn() ? intent.en : intent.fr;
      addMessage(container, "bot", r.text, r.links);
      return;
    }

    const thinking = isEn() ? "Searching WIYAO..." : "Je cherche dans WIYAO...";
    addMessage(container, "bot", thinking);
    const thinkingBubble = container.lastElementChild;

    getSearchIndex().then((index) => {
      const matches = index.filter((item) => item.searchText.indexOf(query) !== -1).slice(0, 4);
      thinkingBubble.remove();
      if (!matches.length) {
        addMessage(container, "bot", isEn()
          ? "I didn't find anything precise for that. Try rephrasing, or use the full site search."
          : "Je n'ai rien trouvé de précis pour ça. Essaie de reformuler, ou utilise la recherche complète du site.", [{ label: isEn() ? "Open full search" : "Ouvrir la recherche complète", url: "recherche.html" }]);
        return;
      }
      const intro = isEn() ? "Here's what I found:" : "Voici ce que j'ai trouvé :";
      const links = matches.map((m) => ({ label: m.title, url: m.externalUrl || m.url, external: !!m.externalUrl }));
      addMessage(container, "bot", intro, links);
    });
  }

  function renderChips(container, messagesEl) {
    container.innerHTML = "";
    CHIPS.forEach((chip) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "wiyao-assistant-chip";
      btn.textContent = isEn() ? chip.en : chip.fr;
      btn.addEventListener("click", () => {
        addMessage(messagesEl, "user", isEn() ? chip.en : chip.fr);
        respond(messagesEl, chip.query);
      });
      container.appendChild(btn);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const widget = buildWidget();
    const toggle = widget.querySelector("#wiyao-assistant-toggle");
    const closeBtn = widget.querySelector("#wiyao-assistant-close");
    const panel = widget.querySelector("#wiyao-assistant-panel");
    const messagesEl = widget.querySelector("#wiyao-assistant-messages");
    const chipsEl = widget.querySelector("#wiyao-assistant-chips");
    const form = widget.querySelector("#wiyao-assistant-form");
    const input = widget.querySelector("#wiyao-assistant-input");

    let opened = false;
    function open() {
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      if (!opened) {
        opened = true;
        addMessage(messagesEl, "bot", isEn()
          ? "Hi! I'm the WIYAO assistant 👋 I'm not a free-form AI — I only point you to WIYAO's own verified content (roadmaps, schools, scholarships, FAQ...). What do you need?"
          : "Salut ! Je suis l'assistant WIYAO 👋 Je ne suis pas une IA conversationnelle libre — je t'oriente uniquement vers le contenu déjà vérifié de WIYAO (roadmaps, écoles, bourses, FAQ...). Qu'est-ce qu'il te faut ?");
        renderChips(chipsEl, messagesEl);
      }
      input.focus();
    }
    function close() {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => (panel.hidden ? open() : close()));
    closeBtn.addEventListener("click", close);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      addMessage(messagesEl, "user", value);
      input.value = "";
      respond(messagesEl, value);
    });
  });
})();
