"use strict";

/**
 * Fonction Vercel : reçoit un message des formulaires Contact et Proposer
 * (POST JSON depuis la page) et l'envoie par e-mail à WIYAO via l'API de
 * Resend. Rien n'est enregistré : pas de base de données, et le contenu du
 * message n'est jamais écrit dans les journaux.
 *
 * Variables d'environnement (réglages du projet Vercel) :
 *   RESEND_API_KEY  obligatoire, clé de l'API Resend (jamais dans le dépôt)
 *   CONTACT_TO      facultatif, destinataire (par défaut wiya.info@gmail.com)
 *   CONTACT_FROM    facultatif, expéditeur (par défaut l'adresse de test
 *                   de Resend, qui n'écrit qu'à l'adresse du compte Resend)
 */

const DEFAULT_TO = "wiya.info@gmail.com";
const DEFAULT_FROM = "WIYAO <onboarding@resend.dev>";
const MAX_BODY_CHARS = 12000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const PROPOSAL_TYPES = ["Événement", "Communauté", "Établissement", "Entreprise", "Autre ressource"];
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;

// Limite simple par adresse IP, gardée en mémoire de l'instance (Vercel
// réutilise les instances : ça freine les envois en rafale sans base).
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

function send(res, status, payload) {
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(payload);
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

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "method_not_allowed" });
  }

  // Seules les pages du site peuvent appeler la fonction.
  const origin = req.headers.origin;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (origin) {
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch (e) {
      originHost = "";
    }
    if (!host || originHost !== host) return send(res, 403, { error: "forbidden" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : null;
  if (!body || JSON.stringify(body).length > MAX_BODY_CHARS) return send(res, 400, { error: "invalid" });

  // Champ piège invisible : un robot le remplit, une personne non.
  if (typeof body.website === "string" && body.website.trim() !== "") return send(res, 200, { ok: true });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "inconnue";
  if (tooMany(ip)) return send(res, 429, { error: "rate_limited" });

  const mail = body.form === "proposer" ? buildProposal(body) : body.form === "contact" ? buildContact(body) : null;
  if (!mail) return send(res, 400, { error: "invalid" });

  const key = process.env.RESEND_API_KEY;
  if (!key) return send(res, 503, { error: "not_configured" });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || DEFAULT_FROM,
        to: [process.env.CONTACT_TO || DEFAULT_TO],
        reply_to: mail.email,
        subject: mail.subject,
        text: mail.text,
      }),
      signal: controller.signal,
    });
    if (!r.ok) {
      console.error(`Resend a refusé l'envoi (HTTP ${r.status})`);
      return send(res, 502, { error: "send_failed" });
    }
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error(`Envoi impossible (${err && err.name ? err.name : "erreur"})`);
    return send(res, 502, { error: "send_failed" });
  } finally {
    clearTimeout(timer);
  }
};
