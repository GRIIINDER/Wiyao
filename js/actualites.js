// Actualités - WIYAO
// 1) « Ajouter à mon agenda » (façon VivaTech / BuildFest), partagé via
//    window.WIYAO_AGENDA avec la page Calendrier (rangée « À venir »).
// 2) Page Actualités : filtres par catégorie (façon TechCabal / African
//    Tech Journal), première actu visible mise « À la une », et bouton
//    agenda sur les événements à venir. Tout est lu depuis les cartes de
//    actualites.html (seule source de vérité) : rien à ressaisir ici.
(function () {
  "use strict";

  const isEn = () => document.documentElement.lang === "en";

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  // ---- Agenda ----
  // data-start / data-end posés à la main sur les cartes d'événements, repris
  // du texte vérifié de la carte. Heure de Lomé = UTC+0 toute l'année.
  function parseDay(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(s || "");
    if (!m) return null;
    return { y: +m[1], mo: +m[2], d: +m[3], h: m[4] != null ? +m[4] : null, mi: m[5] != null ? +m[5] : null };
  }

  const pad = (n) => String(n).padStart(2, "0");
  const stamp = (p) => `${p.y}${pad(p.mo)}${pad(p.d)}` + (p.h != null ? `T${pad(p.h)}${pad(p.mi)}00Z` : "");

  function nextDay(p) {
    const dt = new Date(Date.UTC(p.y, p.mo - 1, p.d + 1));
    return { y: dt.getUTCFullYear(), mo: dt.getUTCMonth() + 1, d: dt.getUTCDate(), h: null, mi: null };
  }

  // Événement d'une carte d'actu, ou null s'il est passé ou sans date.
  // `opts` permet de fournir titre/description traduits et l'adresse de la
  // page Actualités quand la carte vient d'un document chargé à part.
  function eventOf(card, opts) {
    const o = opts || {};
    const start = parseDay(card.dataset.start);
    const end = parseDay(card.dataset.end || card.dataset.start);
    if (!start || !end) return null;
    const endMs = Date.UTC(end.y, end.mo - 1, end.d, end.h != null ? end.h : 23, end.mi != null ? end.mi : 59);
    if (endMs < Date.now()) return null;
    const title = card.querySelector(".actu-card-title");
    const desc = card.querySelector(".actu-card-desc");
    const src = card.querySelector(".actu-card-btn");
    const allDay = start.h == null;
    const base = o.base || window.location.origin + window.location.pathname;
    return {
      start,
      end,
      title: o.title || (title ? title.textContent.replace(/\s+/g, " ").trim() : "WIYAO"),
      desc: o.desc || (desc ? desc.textContent.replace(/\s+/g, " ").trim() : ""),
      source: src ? src.getAttribute("href") || "" : "",
      page: base + "#" + card.id,
      lieu: card.dataset.lieu || "",
      allDay,
      dtStart: stamp(start),
      dtEnd: allDay ? stamp(nextDay(end)) : stamp(end),
      slug: card.id || "evenement",
    };
  }

  // Échappement RFC 5545 + pliage des lignes à 75 octets environ.
  function icsText(s) {
    return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  }

  function fold(line) {
    const out = [];
    let rest = line;
    while (rest.length > 73) {
      out.push(rest.slice(0, 73));
      rest = " " + rest.slice(73);
    }
    out.push(rest);
    return out.join("\r\n");
  }

  function buildIcs(ev) {
    const now = new Date();
    const dtstamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
    const details = [ev.desc, ev.source ? (isEn() ? "Source: " : "Source : ") + ev.source : "", "WIYAO : " + ev.page].filter(Boolean).join("\n\n");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//WIYAO//Actualites//FR",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${ev.slug}@wiyao.vercel.app`,
      `DTSTAMP:${dtstamp}`,
      ev.allDay ? `DTSTART;VALUE=DATE:${ev.dtStart}` : `DTSTART:${ev.dtStart}`,
      ev.allDay ? `DTEND;VALUE=DATE:${ev.dtEnd}` : `DTEND:${ev.dtEnd}`,
      `SUMMARY:${icsText(ev.title)}`,
      ev.lieu ? `LOCATION:${icsText(ev.lieu)}` : "",
      `DESCRIPTION:${icsText(details)}`,
      `URL:${ev.page}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].filter(Boolean);
    return lines.map(fold).join("\r\n") + "\r\n";
  }

  function googleUrl(ev) {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: ev.title,
      dates: `${ev.dtStart}/${ev.dtEnd}`,
      details: [ev.desc.slice(0, 600), ev.source].filter(Boolean).join("\n\n"),
      location: ev.lieu,
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

  function download(ev) {
    const blob = new Blob([buildIcs(ev)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wiyao-${ev.slug}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  window.WIYAO_AGENDA = { eventOf, buildIcs, googleUrl, download };

  // ---- Page Actualités ----
  const grid = document.getElementById("actu-grid");
  const filters = document.getElementById("actu-filters");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".actu-card"));
  let active = new URLSearchParams(window.location.search).get("categorie") || "all";

  // Catégorie d'une carte : le texte FR d'origine sert de clé stable (le
  // libellé affiché, lui, est traduit par i18n.js).
  cards.forEach((card) => {
    const cat = card.querySelector('.actu-meta-value[data-i18n-key$=".cat"]');
    card.dataset.cat = cat ? cat.textContent.trim() : "";
  });
  const counts = {};
  cards.forEach((c) => { counts[c.dataset.cat] = (counts[c.dataset.cat] || 0) + 1; });
  const cats = Object.keys(counts).filter(Boolean).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b, "fr"));
  if (active !== "all" && !counts[active]) active = "all";

  function labelOf(cat) {
    const card = cards.find((c) => c.dataset.cat === cat);
    const el = card && card.querySelector('.actu-meta-value[data-i18n-key$=".cat"]');
    return el ? el.textContent.trim() : cat;
  }

  function renderFilters() {
    if (!filters) return;
    filters.setAttribute("aria-label", isEn() ? "Filter by category" : "Filtrer par catégorie");
    const chip = (value, text, n) =>
      `<button type="button" class="domain-chip${active === value ? " active" : ""}" data-cat="${esc(value)}" aria-pressed="${active === value}">${esc(text)} <span class="actu-filter-count">${n}</span></button>`;
    filters.innerHTML = chip("all", isEn() ? "All" : "Toutes", cards.length) + cats.map((c) => chip(c, labelOf(c), counts[c])).join("");
  }

  function renderBadges() {
    cards.forEach((card) => {
      const old = card.querySelector(".actu-featured-badge");
      if (old) old.remove();
    });
    const featured = grid.querySelector(".actu-card--featured .card-body");
    if (featured) {
      featured.insertAdjacentHTML("afterbegin", `<span class="actu-featured-badge">${isEn() ? "Top story" : "À la une"}</span>`);
    }
  }

  function applyFilter() {
    let first = null;
    cards.forEach((card) => {
      const show = active === "all" || card.dataset.cat === active;
      card.hidden = !show;
      card.classList.remove("actu-card--featured");
      if (show && !first) first = card;
    });
    if (first) first.classList.add("actu-card--featured");
    renderBadges();
  }

  function syncUrl() {
    const params = new URLSearchParams(window.location.search);
    if (active === "all") params.delete("categorie");
    else params.set("categorie", active);
    const qs = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : "") + window.location.hash);
  }

  if (filters) {
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".domain-chip");
      if (!btn) return;
      active = btn.dataset.cat;
      syncUrl();
      renderFilters();
      applyFilter();
    });
  }

  function renderAgenda() {
    cards.forEach((card) => {
      const old = card.querySelector(".actu-agenda");
      if (old) old.remove();
      const ev = eventOf(card);
      if (!ev) return;
      const wrap = document.createElement("div");
      wrap.className = "actu-agenda";
      wrap.innerHTML = `
        <button type="button" class="actu-agenda-btn" data-ics="${esc(card.id)}">📅 ${isEn() ? "Add to my calendar" : "Ajouter à mon agenda"}</button>
        <a class="actu-agenda-google" href="${esc(googleUrl(ev))}" target="_blank" rel="noopener">Google Agenda ↗</a>`;
      card.querySelector(".card-body").appendChild(wrap);
    });
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".actu-agenda-btn");
    if (!btn) return;
    const card = document.getElementById(btn.dataset.ics);
    const ev = card && eventOf(card);
    if (ev) download(ev);
  });

  function render() {
    renderFilters();
    applyFilter();
    renderAgenda();
  }

  // i18n.js traduit les cartes au chargement puis à chaque bascule FR/EN :
  // on relit les libellés après coup.
  document.addEventListener("DOMContentLoaded", render);
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
