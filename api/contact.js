const BUDGET_OPTIONS = new Set(["$5k+", "$10k+", "$25k+", "Not sure"]);
const MAX_TEXT = 2000;
const MAX_NAME = 120;
const MAX_EMAIL = 200;
const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 80;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function cleanText(value, max = MAX_TEXT) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, max);
}

function cleanTags(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((tag) => typeof tag === "string")
    .map((tag) => tag.trim().slice(0, MAX_TAG_LENGTH))
    .filter(Boolean)
    .slice(0, MAX_TAGS);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function headerValue(headers, name) {
  const value = headers?.[name] ?? headers?.[name.toLowerCase()];
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return typeof value === "string" ? value : "";
}

function getRequestMeta(req) {
  const forwarded = headerValue(req.headers, "x-forwarded-for");
  const realIp = headerValue(req.headers, "x-real-ip");
  const vercelIp = headerValue(req.headers, "x-vercel-forwarded-for");
  const ip =
    forwarded.split(",")[0].trim() ||
    realIp.trim() ||
    vercelIp.split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "";

  const country =
    headerValue(req.headers, "x-vercel-ip-country").trim() ||
    headerValue(req.headers, "cf-ipcountry").trim() ||
    "";

  const city = decodeURIComponent(headerValue(req.headers, "x-vercel-ip-city").trim() || "");
  const region = headerValue(req.headers, "x-vercel-ip-country-region").trim();

  return {
    ip: ip || "—",
    country: country || "—",
    city: city || "",
    region: region || "",
  };
}

function buildTelegramMessage(payload) {
  const help =
    payload.helpTags.length > 0
      ? payload.helpTags.map((tag) => escapeHtml(tag)).join(", ")
      : "—";

  const locationParts = [payload.city, payload.region, payload.country].filter(
    (part) => part && part !== "—",
  );
  const location = locationParts.length > 0 ? locationParts.join(", ") : "—";

  return [
    "<b>New contact request</b>",
    "",
    `<b>Name:</b> ${escapeHtml(payload.name)}`,
    `<b>Email:</b> ${escapeHtml(payload.email)}`,
    `<b>Company:</b> ${escapeHtml(payload.company)}`,
    `<b>Building:</b> ${escapeHtml(payload.building || "—")}`,
    `<b>Help with:</b> ${help}`,
    `<b>Budget:</b> ${escapeHtml(payload.budget)}`,
    `<b>IP:</b> ${escapeHtml(payload.ip)}`,
    `<b>Location:</b> ${escapeHtml(location)}`,
  ].join("\n");
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return res.status(500).json({ error: "Notification service is not configured" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body" });
  }

  // Honeypot — bots often fill hidden fields.
  if (cleanText(body.website, 200)) {
    return res.status(200).json({ ok: true });
  }

  const payload = {
    name: cleanText(body.name, MAX_NAME),
    email: cleanText(body.email, MAX_EMAIL),
    company: cleanText(body.company, MAX_NAME),
    building: cleanText(body.building, MAX_TEXT),
    helpTags: cleanTags(body.helpTags),
    budget: cleanText(body.budget, 40),
    ...getRequestMeta(req),
  };

  if (!payload.name || !payload.email || !payload.company) {
    return res.status(400).json({ error: "Name, email, and company are required" });
  }

  if (!isValidEmail(payload.email)) {
    return res.status(400).json({ error: "Enter a valid email address" });
  }

  if (!BUDGET_OPTIONS.has(payload.budget)) {
    return res.status(400).json({ error: "Invalid budget option" });
  }

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
      return res.status(502).json({ error: "Failed to send notification" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact notify failed", error);
    return res.status(502).json({ error: "Failed to send notification" });
  }
}
