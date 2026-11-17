// The contact form's handler for Cloudflare Pages (the address /api/contact).
// It is the same logic as api/contact.js (the Vercel version); keep the two in step.
// It needs two secrets in the Pages project settings: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.

const BUDGET_OPTIONS = new Set(["$8k+", "$20k+", "$50k+", "Not sure"]);
const MAX_TEXT = 2000;
const MAX_NAME = 120;
const MAX_EMAIL = 200;
const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 80;

const json = (status, data, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...headers } });

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function cleanText(value, max = MAX_TEXT) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanTags(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((tag) => typeof tag === "string")
    .map((tag) => tag.trim().slice(0, MAX_TAG_LENGTH))
    .filter(Boolean)
    .slice(0, MAX_TAGS);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getRequestMeta(request) {
  const cf = request.cf || {};
  return {
    ip: request.headers.get("cf-connecting-ip") || "—",
    country: cf.country || request.headers.get("cf-ipcountry") || "—",
    city: cf.city || "",
    region: cf.region || "",
  };
}

function buildTelegramMessage(payload) {
  const help = payload.helpTags.length > 0 ? payload.helpTags.map((tag) => escapeHtml(tag)).join(", ") : "—";
  const locationParts = [payload.city, payload.region, payload.country].filter((part) => part && part !== "—");
  const location = locationParts.length > 0 ? locationParts.join(", ") : "—";

  return [
    "<b>New contact request</b>",
    "",
    `<b>Name:</b> ${escapeHtml(payload.name)}`,
    `<b>Email:</b> ${escapeHtml(payload.email)}`,
    `<b>Project:</b> ${escapeHtml(payload.company)}`,
    `<b>Message:</b> ${escapeHtml(payload.building || "—")}`,
    help === "—" ? null : `<b>Help with:</b> ${help}`,
    `<b>Budget:</b> ${escapeHtml(payload.budget)}`,
    `<b>IP:</b> ${escapeHtml(payload.ip)}`,
    `<b>Location:</b> ${escapeHtml(location)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function onRequest({ request, env }) {
  const allow = { Allow: "POST, OPTIONS" };
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: allow });
  if (request.method !== "POST") return json(405, { error: "Method not allowed" }, allow);

  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return json(500, { error: "Notification service is not configured" });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }
  if (!body || typeof body !== "object") return json(400, { error: "Invalid request body" });

  // Honeypot: bots often fill hidden fields.
  if (cleanText(body.website, 200)) return json(200, { ok: true });

  const payload = {
    name: cleanText(body.name, MAX_NAME),
    email: cleanText(body.email, MAX_EMAIL),
    company: cleanText(body.company, MAX_NAME),
    building: cleanText(body.building, MAX_TEXT),
    helpTags: cleanTags(body.helpTags),
    budget: cleanText(body.budget, 40),
    ...getRequestMeta(request),
  };

  if (!payload.name || !payload.email || !payload.company) {
    return json(400, { error: "Name, email, and company are required" });
  }
  if (!isValidEmail(payload.email)) return json(400, { error: "Enter a valid email address" });
  if (!BUDGET_OPTIONS.has(payload.budget)) return json(400, { error: "Invalid budget option" });

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage(payload),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    const telegramResult = await telegramResponse.json().catch(() => null);
    if (!telegramResponse.ok || !telegramResult?.ok) {
      console.error("Telegram API error", telegramResult);
      return json(502, { error: "Failed to send notification" });
    }
    return json(200, { ok: true });
  } catch (error) {
    console.error("Contact notify failed", error);
    return json(502, { error: "Failed to send notification" });
  }
}
