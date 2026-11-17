/**
 * Worker Cloudflare de WIYAO. Les fichiers statiques sont servis directement
 * par Cloudflare (voir wrangler.jsonc) ; ce code ne tourne que pour :
 *   - POST /api/contact : formulaires Contact et Proposer, envoyés par e-mail
 *     via l'API de Resend (portage de api/contact.js, mêmes règles) ;
 *   - « / » : sert index.html (html_handling "none" ne le fait plus).
 *
 * Rien n'est enregistré : pas de base de données, et le contenu du message
 * n'est jamais écrit dans les journaux.
 *
 * Secrets (`wrangler secret put …` ou tableau de bord, jamais dans le dépôt) :
 *   RESEND_API_KEY  obligatoire, clé de l'API Resend
 *   CONTACT_TO      destinataire (boîte de l'éditeur, volontairement absente
 *                   de ce dépôt public ; à défaut, wiya.info@gmail.com)
 *   CONTACT_FROM    facultatif, expéditeur (par défaut l'adresse de test de
 *                   Resend, qui n'écrit qu'à l'adresse du compte Resend)
 */

const DEFAULT_TO = "wiya.info@gmail.com";
const DEFAULT_FROM = "WIYAO <onboarding@resend.dev>";
const MAX_BODY_CHARS = 12000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const PROPOSAL_TYPES = ["Événement", "Communauté", "Établissement", "Entreprise", "Autre ressource"];
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;

// En-têtes des réponses du Worker : `_headers` ne s'applique qu'aux fichiers
// statiques servis directement par Cloudflare.
const API_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

// Limite simple par adresse IP, en mémoire de l'isolat (réutilisé entre
// requêtes) : freine les envois en rafale sans base de données. Comme sur
// Vercel, ce n'est pas une garantie globale (plusieurs isolats, plusieurs
// centres de données).
const recent = new Map();

function tooMany(ip) {
  const now = Date.now();
  const list = (recent.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  recent.set(ip, list);
  if (recent.size > 5000) recent.clear();
  return list.length > RATE_MAX;
}

// Texte d'une ligne : sans caractères de contrôle ni retour à la ligne.
function line(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);
}

// Texte libre : retours à la ligne gardés, autres caractères de contrôle retirés.
function block(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, " ").trim().slice(0, max);
}

function json(status, payload, extra = {}) {
  return new Response(JSON.stringify(payload), { status, headers: { ...API_HEADERS, ...extra } });
}

function buildContact(b) {
  const name = line(b.name, 100);
  const email = line(b.email, 254);
  const subject = line(b.subject, 150);
  const message = block(b.message, 4000);
  if (!name || !EMAIL_RE.test(email) || !subject || !message) return null;
  return {
    email,
    subject: `[WIYAO Contact] ${subject}`,
    text: `${message}\n\n${name} (${email})`,
  };
}

function buildProposal(b) {
  const name = line(b.name, 100);
  const email = line(b.email, 254);
  const type = line(b.type, 40);
  const ville = line(b.ville, 80);
  const nom = line(b.nom, 150);
  const lien = line(b.lien, 500);
  const date = line(b.date, 80);
  const description = block(b.description, 2000);
  if (!name || !EMAIL_RE.test(email) || !PROPOSAL_TYPES.includes(type) || !nom || !/^https?:\/\/\S+$/i.test(lien) || !description) return null;
  return {
    email,
    subject: `[WIYAO Proposition ${type}] ${nom}`,
    text: [
      `Type : ${type}`,
      `Nom : ${nom}`,
      `Ville : ${ville || "non précisée"}`,
      `Lien / source : ${lien}`,
      `Date (si applicable) : ${date || "non précisée"}`,
      "",
      "Description :",
      description,
      "",
      `Proposé par ${name} (${email})`,
    ].join("\n"),
  };
}

async function handleContact(request, env) {
  if (request.method !== "POST") return json(405, { error: "method_not_allowed" }, { Allow: "POST" });

  // Seules les pages du site peuvent appeler la fonction.
  const origin = request.headers.get("Origin");
  if (origin) {
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch (e) {
      originHost = "";
    }
    if (originHost !== new URL(request.url).host) return json(403, { error: "forbidden" });
  }

  // Corps lu en texte borné avant d'être analysé.
  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return json(400, { error: "invalid" });
  let body = null;
  try {
    body = JSON.parse(raw);
  } catch (e) {
    body = null;
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json(400, { error: "invalid" });

  // Champ piège invisible : un robot le remplit, une personne non.
  if (typeof body.website === "string" && body.website.trim() !== "") return json(200, { ok: true });

  const ip = request.headers.get("CF-Connecting-IP") || "inconnue";
  if (tooMany(ip)) return json(429, { error: "rate_limited" });

  const mail = body.form === "proposer" ? buildProposal(body) : body.form === "contact" ? buildContact(body) : null;
  if (!mail) return json(400, { error: "invalid" });

  const key = env.RESEND_API_KEY;
  if (!key) return json(503, { error: "not_configured" });

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.CONTACT_FROM || DEFAULT_FROM,
        to: [env.CONTACT_TO || DEFAULT_TO],
        reply_to: mail.email,
        subject: mail.subject,
        text: mail.text,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) {
      // Motif renvoyé par Resend (clé invalide, destinataire refusé…) : il
      // ne contient jamais le contenu du message.
      let detail = "";
      try {
        const err = await r.json();
        detail = [err.name, err.message].filter(Boolean).join(" : ").slice(0, 200);
      } catch (e) {
        detail = "";
      }
      console.error(`Resend a refusé l'envoi (HTTP ${r.status})${detail ? ` : ${detail}` : ""}`);
      return json(502, { error: "send_failed" });
    }
    return json(200, { ok: true });
  } catch (err) {
    console.error(`Envoi impossible (${err && err.name ? err.name : "erreur"})`);
    return json(502, { error: "send_failed" });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") return handleContact(request, env);
    if (url.pathname === "/") {
      url.pathname = "/index.html";
      return env.ASSETS.fetch(new Request(url, request));
    }
    if (url.pathname.startsWith("/api/")) return json(404, { error: "not_found" });
    return env.ASSETS.fetch(request);
  },
};
