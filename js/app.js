// Logique de rendu - WIYAO
(function () {
  "use strict";

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  const STORAGE_KEY = "wiyao-progress";

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function toggleItem(roadmapId, itemKey) {
    const progress = loadProgress();
    if (!progress[roadmapId]) progress[roadmapId] = [];
    const idx = progress[roadmapId].indexOf(itemKey);
    if (idx >= 0) {
      progress[roadmapId].splice(idx, 1);
    } else {
      progress[roadmapId].push(itemKey);
    }
    saveProgress(progress);
    return progress;
  }

  function countItems(roadmap) {
    let total = 0;
    roadmap.sections.forEach((s) => (total += s.items.length));
    return total;
  }

  function getDoneCount(roadmapId) {
    const progress = loadProgress();
    return (progress[roadmapId] || []).length;
  }

  function levelSlug(level) {
    if (level === "Débutant") return "debutant";
    if (level === "Intermédiaire") return "intermediaire";
    if (level === "Avancé") return "avance";
    return "";
  }

  function badgesHtml(rm) {
    const levelBadge = rm.level
      ? `<span class="badge level-badge level-${levelSlug(rm.level)}">${rm.level}</span>`
      : "";
    const togoBadge = rm.togoVerified
      ? `<span class="badge togo-badge">✓ Vérifié Togo</span>`
      : "";
    return levelBadge + togoBadge;
  }

  function buildCard(id, rm) {
    const total = countItems(rm);
    const done = getDoneCount(id);
    const pct = total ? Math.round((done / total) * 100) : 0;

    const card = document.createElement("a");
    card.href = `roadmap.html?id=${id}`;
    card.className = "card";
    card.dataset.title = rm.title.toLowerCase();
    if (rm.domain) card.dataset.domain = rm.domain;
    const badges = badgesHtml(rm);
    card.innerHTML = `
      <div class="card-icon">${rm.icon}</div>
      ${badges ? `<div class="card-badges">${badges}</div>` : ""}
      <h3>${rm.title}</h3>
      <p>${rm.subtitle}</p>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <span class="progress-label">${pct}% complété</span>
    `;
    return card;
  }

  // ---- Page d'accueil : deux grilles, par métier et par compétence ----
  function renderGrid() {
    const roleGrid = document.getElementById("role-grid");
    const skillGrid = document.getElementById("skill-grid");
    if (!roleGrid && !skillGrid) return;

    if (roleGrid && typeof ROLES !== "undefined") {
      const byDomain = {};
      Object.keys(ROLES).forEach((id) => {
        const domain = ROLES[id].domain || "Autres";
        if (!byDomain[domain]) byDomain[domain] = [];
        byDomain[domain].push(id);
      });

      const domainOrder = typeof DOMAINS !== "undefined" ? Object.keys(DOMAINS) : [];
      const orderedDomains = domainOrder.filter((d) => byDomain[d]);
      Object.keys(byDomain).forEach((d) => {
        if (orderedDomains.indexOf(d) === -1) orderedDomains.push(d);
      });

      orderedDomains.forEach((domainName) => {
        const meta = typeof DOMAINS !== "undefined" ? DOMAINS[domainName] : null;

        const group = document.createElement("div");
        group.className = "domain-group";

        const heading = document.createElement("h3");
        heading.className = "domain-group-title";
        heading.textContent = meta && meta.icon ? `${meta.icon} ${domainName}` : domainName;
        group.appendChild(heading);

        if (meta && meta.description) {
          const desc = document.createElement("p");
          desc.className = "domain-group-desc";
          desc.textContent = meta.description;
          group.appendChild(desc);
        }

        const subGrid = document.createElement("div");
        subGrid.className = "grid";
        byDomain[domainName].forEach((id) => subGrid.appendChild(buildCard(id, ROLES[id])));
        group.appendChild(subGrid);

        roleGrid.appendChild(group);
      });
    }
    if (skillGrid && typeof SKILLS !== "undefined") {
      Object.keys(SKILLS).forEach((id) => skillGrid.appendChild(buildCard(id, SKILLS[id])));
    }
  }

  // ---- Recherche + filtres par domaine (page d'accueil) ----
  function applyFilters() {
    const searchInput = document.getElementById("roadmap-search");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const activeChip = document.querySelector(".domain-chip.active");
    const activeDomain = activeChip ? activeChip.dataset.domain : "all";

    function filterGrid(grid, useDomain) {
      if (!grid) return;
      let visibleCount = 0;
      grid.querySelectorAll(".card").forEach((card) => {
        const matchesQuery = !query || card.dataset.title.indexOf(query) !== -1;
        const matchesDomain = !useDomain || activeDomain === "all" || card.dataset.domain === activeDomain;
        const visible = matchesQuery && matchesDomain;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      grid.querySelectorAll(".domain-group").forEach((group) => {
        const anyVisible = Array.prototype.some.call(group.querySelectorAll(".card"), (c) => !c.hidden);
        group.hidden = !anyVisible;
      });
      const noResults = grid.parentElement.querySelector(".no-results");
      if (noResults) noResults.hidden = visibleCount !== 0;
    }

    filterGrid(document.getElementById("role-grid"), true);
    filterGrid(document.getElementById("skill-grid"), false);
  }

  function initFilters() {
    const searchInput = document.getElementById("roadmap-search");
    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    const domainFilters = document.getElementById("domain-filters");
    if (domainFilters) {
      domainFilters.addEventListener("click", (e) => {
        const btn = e.target.closest(".domain-chip");
        if (!btn) return;
        domainFilters.querySelectorAll(".domain-chip").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilters();
      });
    }
  }

  // ---- Roadmaps liées (même domaine, pas déjà citées sur la page) ----
  function buildRelatedSection(id, rm) {
    if (!rm.domain || typeof ROLES === "undefined") return null;

    const citedIds = new Set([id]);
    rm.sections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.resource && item.resource.url && item.resource.url.indexOf("roadmap.html?id=") === 0) {
          citedIds.add(item.resource.url.split("id=")[1]);
        }
      });
    });

    const related = Object.keys(ROLES)
      .filter((rid) => ROLES[rid].domain === rm.domain && !citedIds.has(rid))
      .slice(0, 3);

    if (!related.length) return null;

    const section = document.createElement("div");
    section.className = "related-section";

    const heading = document.createElement("h2");
    heading.textContent = "Roadmaps liées";
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "grid";
    related.forEach((rid) => grid.appendChild(buildCard(rid, ROLES[rid])));
    section.appendChild(grid);

    return section;
  }

  // ---- Page roadmap détail ----
  function renderRoadmap() {
    const container = document.getElementById("roadmap-detail");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const rm = typeof ALL_ROADMAPS !== "undefined" ? ALL_ROADMAPS[id] : null;

    if (!rm) {
      container.innerHTML = `<p>Roadmap introuvable. <a href="index.html">Retour à l'accueil</a></p>`;
      return;
    }

    document.title = `${rm.title} — WIYAO`;

    const total = countItems(rm);
    let progress = loadProgress();
    if (!progress[id]) progress[id] = [];

    const typeLabel = rm.type === "skill" ? "Roadmap par compétence" : "Roadmap par métier";
    const categoryLabel = rm.type === "skill" ? "Par compétence" : "Par métier";
    const categoryHref = rm.type === "skill" ? "index.html#par-competence" : "index.html#par-metier";

    const breadcrumb = document.createElement("nav");
    breadcrumb.className = "breadcrumb";
    breadcrumb.setAttribute("aria-label", "Fil d'Ariane");
    breadcrumb.innerHTML = `
      <a href="index.html">WIYAO</a>
      <span class="breadcrumb-sep">›</span>
      <a href="${categoryHref}">${categoryLabel}</a>
      <span class="breadcrumb-sep">›</span>
      <span class="breadcrumb-current">${rm.title}</span>
    `;
    container.appendChild(breadcrumb);

    const badges = badgesHtml(rm);
    const togoNotice =
      rm.type === "role" && !rm.togoVerified
        ? `<div class="togo-notice">Ce métier n'a pas encore de données confirmées sur le marché togolais, mais les compétences ci-dessous sont transférables et recherchées à l'international.</div>`
        : "";

    const header = document.createElement("div");
    header.className = "roadmap-header";
    header.innerHTML = `
      <span class="badge type-badge">${typeLabel}</span>
      ${badges}
      <h1>${rm.icon} ${rm.title}</h1>
      <p class="subtitle">${rm.subtitle}</p>
      ${togoNotice}
      <div class="progress-bar large"><div class="progress-fill" id="global-fill"></div></div>
      <span class="progress-label" id="global-label"></span>
    `;
    container.appendChild(header);

    function updateGlobal() {
      const done = (loadProgress()[id] || []).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      document.getElementById("global-fill").style.width = pct + "%";
      document.getElementById("global-label").textContent = `${done} / ${total} étapes complétées (${pct}%)`;
    }

    const track = document.createElement("div");
    track.className = "track";

    rm.sections.forEach((section, sIdx) => {
      const sectionEl = document.createElement("div");
      sectionEl.className = "section";

      const titleEl = document.createElement("h2");
      titleEl.textContent = section.title;
      sectionEl.appendChild(titleEl);

      const list = document.createElement("div");
      list.className = "item-list";

      section.items.forEach((item, iIdx) => {
        const key = `${sIdx}_${iIdx}`;
        const done = progress[id].includes(key);

        const itemEl = document.createElement("div");
        itemEl.className = "item" + (done ? " done" : "") + (item.level === "option" ? " optional" : "");

        const check = document.createElement("button");
        check.className = "check";
        check.type = "button";
        check.setAttribute("aria-label", "Marquer comme fait");
        check.textContent = done ? "✓" : "";
        check.addEventListener("click", () => {
          progress = toggleItem(id, key);
          itemEl.classList.toggle("done");
          check.textContent = itemEl.classList.contains("done") ? "✓" : "";
          updateGlobal();
        });

        const labelWrap = document.createElement("div");
        labelWrap.className = "item-label-wrap";

        const label = document.createElement("span");
        label.className = "item-label";
        label.textContent = item.label;
        labelWrap.appendChild(label);

        if (item.level === "option") {
          const badge = document.createElement("span");
          badge.className = "badge";
          badge.textContent = "optionnel";
          labelWrap.appendChild(badge);
        }

        if (item.note) {
          const note = document.createElement("div");
          note.className = "item-note";
          note.textContent = item.note;
          labelWrap.appendChild(note);
        }

        if (item.resource) {
          const link = document.createElement("a");
          link.className = "item-resource";
          link.href = item.resource.url;
          link.textContent = "📎 " + item.resource.label;
          if (!item.resource.url.startsWith("roadmap.html")) {
            link.target = "_blank";
            link.rel = "noopener";
          }
          labelWrap.appendChild(link);
        }

        itemEl.appendChild(check);
        itemEl.appendChild(labelWrap);
        list.appendChild(itemEl);
      });

      sectionEl.appendChild(list);
      track.appendChild(sectionEl);
    });

    container.appendChild(track);
    updateGlobal();

    const relatedSection = buildRelatedSection(id, rm);
    if (relatedSection) container.appendChild(relatedSection);

    const resetBtn = document.getElementById("reset-progress");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Réinitialiser la progression pour cette roadmap ?")) {
          const p = loadProgress();
          p[id] = [];
          saveProgress(p);
          window.location.reload();
        }
      });
    }
  }

  // ---- Page écoles & universités ----
  const STATUT_LABELS = {
    "public": "Publique",
    "prive": "Privée",
    "inter-etats": "Inter-États"
  };

  function buildSchoolCard(id, school) {
    const card = document.createElement("div");
    card.className = "card school-card";
    card.dataset.title = school.name.toLowerCase() + " " + school.filieres.join(" ").toLowerCase();
    card.dataset.ville = school.ville.join(",");
    card.dataset.statut = school.statut;

    const badges = document.createElement("div");
    badges.className = "card-badges school-badges";
    badges.innerHTML =
      `<span class="badge status-${school.statut === "public" ? "public" : "prive"}">${STATUT_LABELS[school.statut] || school.statut}</span>` +
      school.ville.map((v) => `<span class="badge ville-badge">${v}</span>`).join("") +
      (school.agree === true ? `<span class="badge status-public">🏛️ Agréé État</span>` : "");
    card.appendChild(badges);

    const title = document.createElement("h3");
    title.textContent = school.name;
    card.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.className = "school-subtitle";
    subtitle.textContent = school.description;
    card.appendChild(subtitle);

    const filieres = document.createElement("ul");
    filieres.className = "school-filieres";
    filieres.innerHTML = school.filieres.map((f) => `<li>${f}</li>`).join("");
    card.appendChild(filieres);

    const meta = document.createElement("div");
    meta.className = "school-meta";
    let metaHtml = `<span><strong>Niveaux :</strong> ${school.niveaux.join(", ")}</span>`;
    if (school.duree) metaHtml += `<span><strong>Durée :</strong> ${school.duree}</span>`;
    if (school.admission) metaHtml += `<span><strong>Admission :</strong> ${school.admission}</span>`;
    if (school.agreeNote) metaHtml += `<span>ℹ️ ${school.agreeNote}</span>`;
    meta.innerHTML = metaHtml;
    card.appendChild(meta);

    if (school.site) {
      const link = document.createElement("a");
      link.className = "school-link";
      link.href = school.site;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Voir le site officiel →";
      card.appendChild(link);
    }

    return card;
  }

  function renderSchools() {
    const grid = document.getElementById("school-grid");
    if (!grid || typeof SCHOOLS === "undefined") return;
    Object.keys(SCHOOLS).forEach((id) => grid.appendChild(buildSchoolCard(id, SCHOOLS[id])));
  }

  function applySchoolFilters() {
    const grid = document.getElementById("school-grid");
    if (!grid) return;
    const searchInput = document.getElementById("school-search");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const activeVilleChip = document.querySelector("#ville-filters .domain-chip.active");
    const activeVille = activeVilleChip ? activeVilleChip.dataset.ville : "all";
    const activeStatutChip = document.querySelector("#statut-filters .domain-chip.active");
    const activeStatut = activeStatutChip ? activeStatutChip.dataset.statut : "all";

    let visibleCount = 0;
    grid.querySelectorAll(".school-card").forEach((card) => {
      const matchesQuery = !query || card.dataset.title.indexOf(query) !== -1;
      const matchesVille = activeVille === "all" || card.dataset.ville.split(",").indexOf(activeVille) !== -1;
      const matchesStatut = activeStatut === "all" || card.dataset.statut === activeStatut;
      const visible = matchesQuery && matchesVille && matchesStatut;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    const noResults = document.getElementById("school-no-results");
    if (noResults) noResults.hidden = visibleCount !== 0;
  }

  function initSchoolFilters() {
    const searchInput = document.getElementById("school-search");
    if (searchInput) searchInput.addEventListener("input", applySchoolFilters);

    ["ville-filters", "statut-filters"].forEach((groupId) => {
      const group = document.getElementById(groupId);
      if (!group) return;
      group.addEventListener("click", (e) => {
        const btn = e.target.closest(".domain-chip");
        if (!btn) return;
        group.querySelectorAll(".domain-chip").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applySchoolFilters();
      });
    });
  }

  // ---- Test d'orientation ----
  let quizIndex = 0;
  let quizScores = {};
  let quizPractical = { niveau: null, ville: null, statut: null, priorite: null };

  function renderQuizQuestion() {
    const questionEl = document.getElementById("quiz-question");
    if (!questionEl || typeof QUIZ_QUESTIONS === "undefined") return;

    const progressFill = document.getElementById("quiz-progress-fill");
    const progressLabel = document.getElementById("quiz-progress-label");
    const total = QUIZ_QUESTIONS.length;
    const q = QUIZ_QUESTIONS[quizIndex];

    if (progressFill) progressFill.style.width = Math.round((quizIndex / total) * 100) + "%";
    if (progressLabel) progressLabel.textContent = `Question ${quizIndex + 1} / ${total}`;

    questionEl.innerHTML = `
      <h2 class="quiz-question-title">${q.question}</h2>
      <div class="quiz-options"></div>
    `;
    const optionsWrap = questionEl.querySelector(".quiz-options");
    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.textContent = opt.label;
      btn.addEventListener("click", () => answerQuiz(q.type, opt.domain || opt.value));
      optionsWrap.appendChild(btn);
    });
  }

  function answerQuiz(type, value) {
    if (type === "domain") {
      quizScores[value] = (quizScores[value] || 0) + 1;
    } else {
      quizPractical[type] = value;
    }
    quizIndex += 1;
    if (quizIndex >= QUIZ_QUESTIONS.length) {
      showQuizResults();
    } else {
      renderQuizQuestion();
    }
  }

  // Relie le domaine dominant + les réponses pratiques (niveau, ville, budget,
  // priorité) aux écoles réelles, avec une checklist transparente par école
  // plutôt qu'un score caché.
  function computeSchoolMatches(topDomain) {
    if (typeof SCHOOLS === "undefined") return [];
    const keywords = (typeof DOMAIN_KEYWORDS !== "undefined" && DOMAIN_KEYWORDS[topDomain]) || [];

    return Object.keys(SCHOOLS)
      .map((id) => {
        const school = SCHOOLS[id];
        const filieresText = school.filieres.join(" ").toLowerCase();
        const checks = [];

        checks.push({
          ok: keywords.some((kw) => filieresText.indexOf(kw) !== -1),
          label: `Filière liée à ${topDomain}`
        });

        if (quizPractical.niveau && quizPractical.niveau !== "peu-importe") {
          const niveauText = school.niveaux.join(" ").toLowerCase();
          let ok = false;
          if (quizPractical.niveau === "court") ok = /bts|brevet de technicien/.test(niveauText);
          if (quizPractical.niveau === "licence") ok = /licence/.test(niveauText);
          if (quizPractical.niveau === "long") ok = /master|ingénieur/.test(niveauText);
          checks.push({ ok, label: "Niveau qui correspond" });
        }

        if (quizPractical.ville && quizPractical.ville !== "peu-importe") {
          checks.push({ ok: school.ville.indexOf(quizPractical.ville) !== -1, label: `À ${quizPractical.ville}` });
        }

        if (quizPractical.statut && quizPractical.statut !== "peu-importe") {
          checks.push({
            ok: school.statut === quizPractical.statut,
            label: quizPractical.statut === "public" ? "Statut public" : "Statut privé"
          });
        }

        if (quizPractical.priorite && quizPractical.priorite !== "peu-importe") {
          let ok = false;
          if (quizPractical.priorite === "agree") ok = school.agree === true;
          if (quizPractical.priorite === "pratique") ok = /pratique|stage/i.test(school.description);
          checks.push({
            ok,
            label: quizPractical.priorite === "agree" ? "Diplôme agréé par l'État" : "Formation orientée pratique"
          });
        }

        const score = checks.filter((c) => c.ok).length;
        return { id, school, checks, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  function buildSchoolMatchCard(match) {
    const card = buildSchoolCard(match.id, match.school);
    const checklist = document.createElement("div");
    checklist.className = "quiz-match-checklist";
    checklist.innerHTML = match.checks
      .map((c) => `<span class="${c.ok ? "match-ok" : "match-no"}">${c.ok ? "✓" : "✗"} ${c.label}</span>`)
      .join("");
    card.insertBefore(checklist, card.firstChild);
    return card;
  }

  function showQuizResults() {
    const quizSection = document.getElementById("quiz-section");
    const resultsSection = document.getElementById("quiz-results");
    if (!resultsSection || typeof DOMAINS === "undefined") return;
    if (quizSection) quizSection.hidden = true;
    resultsSection.hidden = false;

    const domains = Object.keys(DOMAINS);
    const ranked = domains.slice().sort((a, b) => (quizScores[b] || 0) - (quizScores[a] || 0));
    const top = ranked[0];
    const second = ranked[1];
    const totalAnswers = QUIZ_QUESTIONS.length;
    const topMeta = DOMAINS[top];

    const matchingRoles = typeof ROLES !== "undefined"
      ? Object.keys(ROLES).filter((id) => ROLES[id].domain === top).slice(0, 3)
      : [];
    const schoolMatches = computeSchoolMatches(top);

    let html = `
      <h2>Ton profil : ${topMeta.icon} ${top}</h2>
      <p class="category-desc">${topMeta.description}</p>
    `;

    if (matchingRoles.length) {
      html += `<div class="grid" id="quiz-role-grid"></div>`;
    }

    if (second) {
      const secondMeta = DOMAINS[second];
      html += `<p class="quiz-secondary">Ce profil te correspond bien aussi : <strong>${secondMeta.icon} ${second}</strong>.</p>`;
    }

    if (schoolMatches.length) {
      html += `
        <h3 class="quiz-scores-title">Écoles recommandées pour toi</h3>
        <p class="category-desc" style="text-align:center;">D'après ton domaine et tes réponses sur le niveau, la ville et le budget — chaque critère coché est vérifié, pas deviné.</p>
        <div class="grid" id="quiz-school-grid"></div>
        <p class="quiz-secondary"><a href="ecoles.html">Voir toutes les écoles →</a></p>
      `;
    }

    html += `
      <h3 class="quiz-scores-title">Répartition de tes réponses</h3>
      <div class="quiz-scores"></div>
      <button class="btn" id="quiz-restart" type="button">Refaire le test</button>
    `;

    resultsSection.innerHTML = html;

    const roleGrid = document.getElementById("quiz-role-grid");
    if (roleGrid) {
      matchingRoles.forEach((id) => roleGrid.appendChild(buildCard(id, ROLES[id])));
    }

    const schoolGrid = document.getElementById("quiz-school-grid");
    if (schoolGrid) {
      schoolMatches.forEach((match) => schoolGrid.appendChild(buildSchoolMatchCard(match)));
    }

    const scoresWrap = resultsSection.querySelector(".quiz-scores");
    ranked.forEach((domain) => {
      const score = quizScores[domain] || 0;
      const pct = Math.round((score / totalAnswers) * 100);
      const meta = DOMAINS[domain];
      const row = document.createElement("div");
      row.className = "quiz-score-row";
      row.innerHTML = `
        <span class="quiz-score-label">${meta.icon} ${domain}</span>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="quiz-score-value">${score}/${totalAnswers}</span>
      `;
      scoresWrap.appendChild(row);
    });

    const restartBtn = document.getElementById("quiz-restart");
    if (restartBtn) restartBtn.addEventListener("click", restartQuiz);
  }

  function restartQuiz() {
    quizIndex = 0;
    quizScores = {};
    quizPractical = { niveau: null, ville: null, statut: null, priorite: null };
    const quizSection = document.getElementById("quiz-section");
    const resultsSection = document.getElementById("quiz-results");
    if (resultsSection) resultsSection.hidden = true;
    if (quizSection) quizSection.hidden = false;
    renderQuizQuestion();
  }

  function initQuiz() {
    const questionEl = document.getElementById("quiz-question");
    if (!questionEl) return;
    renderQuizQuestion();
  }

  // ---- Calendrier des dates clés ----
  function renderAcademicTimeline() {
    const container = document.getElementById("timeline-general");
    if (!container || typeof ACADEMIC_TIMELINE === "undefined") return;
    ACADEMIC_TIMELINE.forEach((step) => {
      const item = document.createElement("div");
      item.className = "timeline-item";
      item.innerHTML = `
        <div class="timeline-period">${step.periode}</div>
        <div class="timeline-content">
          <h3>${step.titre}</h3>
          <p>${step.description}</p>
        </div>
      `;
      container.appendChild(item);
    });
  }

  function schoolDatesRank(school) {
    const dc = school.datesCles;
    if (dc && dc.urgent) return 0;
    if (dc && dc.mode === "campagne") return 1;
    if (dc && dc.mode === "continue") return 2;
    return 3;
  }

  function renderSchoolDates() {
    const container = document.getElementById("school-dates-list");
    if (!container || typeof SCHOOLS === "undefined") return;

    const ids = Object.keys(SCHOOLS).sort((a, b) => schoolDatesRank(SCHOOLS[a]) - schoolDatesRank(SCHOOLS[b]));

    ids.forEach((id) => {
      const school = SCHOOLS[id];
      const dc = school.datesCles;
      const row = document.createElement("div");
      row.className = "dates-row" + (dc && dc.urgent ? " dates-row-urgent" : "");

      let bodyHtml = "";
      if (dc && dc.urgent && dc.urgentNote) {
        bodyHtml += `<p class="dates-urgent-note">⏰ ${dc.urgentNote}</p>`;
      }
      if (dc && dc.note) {
        bodyHtml += `<p class="dates-note">${dc.note}</p>`;
      }

      const fields = dc
        ? [
            ["Ouverture des candidatures", dc.ouverture],
            ["Clôture", dc.cloture],
            ["Concours", dc.concours],
            ["Résultats", dc.resultats],
            ["Rentrée", dc.rentree]
          ].filter(([, value]) => !!value)
        : [];

      if (fields.length) {
        bodyHtml += `<ul class="dates-list">` + fields.map(([label, value]) => `<li><strong>${label} :</strong> ${value}</li>`).join("") + `</ul>`;
      }

      if (dc && dc.anneeReference) {
        bodyHtml += `<p class="dates-ref-note">Repère de calendrier (${dc.anneeReference})${dc.aVerifier ? " — à reconfirmer directement auprès de l'école" : ""}.</p>`;
      }

      if (dc && dc.contact) {
        bodyHtml += `<p class="dates-ref-note">Contact direct : ${dc.contact}</p>`;
      }

      if (!dc) {
        bodyHtml = `<p class="dates-note">Dates non publiées en ligne — vérifie directement sur le site de l'école.</p>`;
      }

      row.innerHTML = `
        <h3>${school.name}</h3>
        ${bodyHtml}
        ${school.site ? `<a class="school-link" href="${school.site}" target="_blank" rel="noopener">Voir le site officiel →</a>` : ""}
      `;
      container.appendChild(row);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderGrid();
    initFilters();
    renderRoadmap();
    renderSchools();
    initSchoolFilters();
    initQuiz();
    renderAcademicTimeline();
    renderSchoolDates();
  });
})();
