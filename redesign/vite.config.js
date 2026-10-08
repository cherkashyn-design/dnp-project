import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(root, "..");
const BUDGET_OPTIONS = new Set(["$8k+", "$20k+", "$50k+", "Not sure"]);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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
          if (typeof body.website === "string" && body.website.trim()) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
            return;
          }

          const name = typeof body.name === "string" ? body.name.trim() : "";
          const email = typeof body.email === "string" ? body.email.trim() : "";
          const company = typeof body.company === "string" ? body.company.trim() : "";
          const building = typeof body.building === "string" ? body.building.trim() : "";
          const budget = typeof body.budget === "string" ? body.budget.trim() : "";

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

          const text = [
            "<b>New contact request</b>",
            "",
            `<b>Name:</b> ${escapeHtml(name)}`,
            `<b>Email:</b> ${escapeHtml(email)}`,
            `<b>Project:</b> ${escapeHtml(company)}`,
            `<b>Message:</b> ${escapeHtml(building || "—")}`,
            `<b>Budget:</b> ${escapeHtml(budget)}`,
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
  const env = loadEnv(mode, projectRoot, "");

  return {
    base: "/",
    plugins: [react(), contactApiPlugin(env)],
    server: {
      fs: {
        allow: [root, projectRoot],
      },
    },
  };
});
