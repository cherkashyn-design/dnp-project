import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const BUDGET_OPTIONS = new Set(["$5k+", "$10k+", "$25k+", "Not sure"]);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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
  const ip =
    forwarded.split(",")[0].trim() ||
    realIp.trim() ||
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

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function contactApiPlugin(env) {
  return {
    name: "contact-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url !== "/api/contact") {
          next();
          return;
        }

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        const token = env.TELEGRAM_BOT_TOKEN;
        const chatId = env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Notification service is not configured" }));
          return;
        }

        try {
          const body = await readJsonBody(req);
          const name = typeof body.name === "string" ? body.name.trim() : "";
          const email = typeof body.email === "string" ? body.email.trim() : "";
          const company = typeof body.company === "string" ? body.company.trim() : "";
          const building = typeof body.building === "string" ? body.building.trim() : "";
          const budget = typeof body.budget === "string" ? body.budget.trim() : "";
          const helpTags = Array.isArray(body.helpTags)
            ? body.helpTags.filter((tag) => typeof tag === "string" && tag.trim()).map((tag) => tag.trim())
            : [];

          if (!name || !email || !company) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Name, email, and company are required" }));
            return;
          }

          if (!BUDGET_OPTIONS.has(budget)) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid budget option" }));
            return;
          }

          const help = helpTags.length > 0 ? helpTags.map(escapeHtml).join(", ") : "—";
          const meta = getRequestMeta(req);
          const locationParts = [meta.city, meta.region, meta.country].filter(
            (part) => part && part !== "—",
          );
          const location = locationParts.length > 0 ? locationParts.join(", ") : "—";
          const text = [
            "<b>New contact request</b>",
            "",
            `<b>Name:</b> ${escapeHtml(name)}`,
            `<b>Email:</b> ${escapeHtml(email)}`,
            `<b>Company:</b> ${escapeHtml(company)}`,
            `<b>Building:</b> ${escapeHtml(building || "—")}`,
            `<b>Help with:</b> ${help}`,
            `<b>Budget:</b> ${escapeHtml(budget)}`,
            `<b>IP:</b> ${escapeHtml(meta.ip)}`,
            `<b>Location:</b> ${escapeHtml(location)}`,
          ].join("\n");

          const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: "HTML",
              disable_web_page_preview: true,
            }),
          });

          const telegramResult = await telegramResponse.json().catch(() => null);
          if (!telegramResponse.ok || !telegramResult?.ok) {
            console.error("Telegram API error", telegramResult);
            res.statusCode = 502;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Failed to send notification" }));
            return;
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true }));
        } catch (error) {
          console.error("Contact notify failed", error);
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Failed to send notification" }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), contactApiPlugin(env)],
    build: {
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            const sourcePath = assetInfo.originalFileNames?.[0] ?? assetInfo.name ?? "";
            const portfolioMatch = sourcePath.match(/portfolio\/([^/]+)\//);

            if (sourcePath.includes("src/assets/brand/")) {
              return "assets/brand/[name]-[hash][extname]";
            }

            if (sourcePath.includes("src/assets/icons/")) {
              return "assets/icons/[name]-[hash][extname]";
            }

            if (portfolioMatch) {
              return `assets/portfolio/${portfolioMatch[1]}/[name]-[hash][extname]`;
            }

            return "assets/[name]-[hash][extname]";
          },
        },
      },
    },
  };
});
