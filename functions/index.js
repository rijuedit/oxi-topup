const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

const recentRequests = new Map();

exports.sendTelegram = onRequest(
  { region: "asia-southeast1", maxInstances: 5 },
  (req, res) => cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "POST required" });
      }

      const header = req.headers.authorization || "";
      const idToken = header.startsWith("Bearer ") ? header.slice(7) : "";
      if (!idToken) return res.status(401).json({ error: "Login required" });

      const decoded = await admin.auth().verifyIdToken(idToken);
      const now = Date.now();
      const last = recentRequests.get(decoded.uid) || 0;
      if (now - last < 2500) {
        return res.status(429).json({ error: "Please wait before sending again" });
      }
      recentRequests.set(decoded.uid, now);

      const { type, message } = req.body || {};
      if (!["order", "addMoney"].includes(type)) {
        return res.status(400).json({ error: "Invalid bot type" });
      }
      if (typeof message !== "string" || !message.trim() || message.length > 3500) {
        return res.status(400).json({ error: "Invalid message" });
      }

      const snap = await admin.database().ref("telegramBotSettings/" + type).get();
      const settings = snap.val();

      if (!settings || settings.enabled !== true ||
          typeof settings.botToken !== "string" || !settings.botToken.trim() ||
          typeof settings.chatId !== "string" || !settings.chatId.trim()) {
        return res.status(503).json({ error: "Telegram bot is not configured in Admin Panel" });
      }

      const telegramResponse = await fetch(
        "https://api.telegram.org/bot" + settings.botToken + "/sendMessage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: settings.chatId,
            text: message,
            parse_mode: "HTML"
          })
        }
      );
      const result = await telegramResponse.json();
      if (!telegramResponse.ok || !result.ok) {
        console.error("Telegram API rejected message:", result.description || "Unknown error");
        return res.status(502).json({ error: "Telegram send failed; check bot token and group ID" });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("sendTelegram failed:", error.message);
      return res.status(401).json({ error: "Request failed; check login and Firebase setup" });
    }
  })
);
