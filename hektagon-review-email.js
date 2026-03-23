// ─────────────────────────────────────────────────────────────────────────────
// HEKTAGON — Automatische Review Follow-Up E-Mail
// Datei: /api/cron/review-followup.js  (Next.js API Route)
//
// Wie es funktioniert:
//   1. Supabase speichert bei jeder Zahlung: user_id, email, savings, created_at
//   2. Dieser Cron-Job läuft täglich via Vercel Cron
//   3. Er findet alle Nutzer deren Zahlung genau 90 Tage her ist
//   4. Und die noch keine Review hinterlassen haben
//   5. Schickt ihnen eine personalisierte E-Mail via Resend.com
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // Service Key (nicht Anon!) für Server-seitige Ops
);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Sicherheit: nur Vercel Cron darf das aufrufen
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // ── Finde alle Nutzer die vor 90 Tagen bezahlt haben & noch keine Review haben ──
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const dateStr = ninetyDaysAgo.toISOString().split("T")[0];

  const { data: users, error } = await supabase
    .from("subscriptions")
    .select(`
      user_id,
      plan,
      created_at,
      users:user_id (email),
      reports:reports!reports_user_id_fkey (savings, country, landlord),
      reviews:reviews!reviews_user_id_fkey (id)
    `)
    .gte("created_at", dateStr + "T00:00:00")
    .lte("created_at", dateStr + "T23:59:59")
    .is("reviews.id", null);  // Noch keine Review

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: error.message });
  }

  let sent = 0;
  const errors = [];

  for (const user of users || []) {
    const email = user.users?.email;
    if (!email) continue;

    const savings = user.reports?.[0]?.savings || 0;
    const country = user.reports?.[0]?.country || "DE";
    const landlord = user.reports?.[0]?.landlord || "deinen Vermieter";
    const lang = detectLang(email, country);

    try {
      await resend.emails.send({
        from: "Hektagon <noreply@hektagon.de>",
        to: email,
        subject: subjects[lang],
        html: buildEmail({ lang, savings, landlord, userId: user.user_id }),
      });
      sent++;

      // Kurze Pause zwischen E-Mails (Rate Limiting)
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      errors.push({ email, error: e.message });
    }
  }

  console.log(`Review follow-up: ${sent} sent, ${errors.length} errors`);
  return res.status(200).json({ sent, errors });
}

// ─────────────────────────────────────────────────────────────────────────────
// E-MAIL TEMPLATES — 5 Sprachen
// ─────────────────────────────────────────────────────────────────────────────

const subjects = {
  de: "Was war dein Ergebnis mit Hektagon? ⭐",
  tr: "Hektagon sonucunuz nasıldı? ⭐",
  en: "How did Hektagon work out for you? ⭐",
  pl: "Jakie były Twoje wyniki z Hektagon? ⭐",
  ru: "Каков ваш результат с Hektagon? ⭐",
};

function detectLang(email, country) {
  if (country === "AT" || country === "CH") return "de";
  // Could be extended with user language preference from DB
  return "de";
}

function buildEmail({ lang, savings, landlord, userId }) {
  const reviewUrl = `https://hektagon.de?review=true&uid=${userId}`;

  const copy = {
    de: {
      greeting: "Hallo,",
      p1: `vor etwa 3 Monaten hast du deine Nebenkostenabrechnung mit Hektagon geprüft.`,
      p1b: savings > 0
        ? `Wir hoffen, du konntest <strong>€${savings}</strong> von ${landlord} zurückbekommen.`
        : `Wir hoffen, du hattest Klarheit über deine Abrechnung.`,
      p2: "Darf ich kurz fragen: Was war dein Ergebnis? Dein Feedback hilft anderen Mietern und macht Hektagon besser.",
      cta: "Jetzt Bewertung hinterlassen",
      takes: "Dauert nur 60 Sekunden",
      stars: "⭐⭐⭐⭐⭐",
      skip: "Kein Ergebnis? Kein Problem — einfach ignorieren.",
      footer: "Du erhältst diese E-Mail weil du Hektagon verwendet hast.",
      unsubscribe: "Abmelden",
    },
    tr: {
      greeting: "Merhaba,",
      p1: "Yaklaşık 3 ay önce Hektagon ile yan gider faturanızı kontrol ettiniz.",
      p1b: savings > 0
        ? `Umarız ${landlord}'dan <strong>€${savings}</strong> geri alabilmişsinizdir.`
        : "Umarız faturanız hakkında netlik kazanmışsınızdır.",
      p2: "Sonucunuz ne oldu? Geri bildiriminiz diğer kiracılara yardımcı olur.",
      cta: "Değerlendirme bırak",
      takes: "Sadece 60 saniye",
      stars: "⭐⭐⭐⭐⭐",
      skip: "Sonuç yok mu? Sorun değil — görmezden gelin.",
      footer: "Hektagon kullandığınız için bu e-postayı alıyorsunuz.",
      unsubscribe: "Abonelikten çık",
    },
    en: {
      greeting: "Hi there,",
      p1: "About 3 months ago, you checked your utility bill with Hektagon.",
      p1b: savings > 0
        ? `We hope you managed to get <strong>€${savings}</strong> back from ${landlord}.`
        : "We hope you got some clarity about your bill.",
      p2: "We'd love to know — what was your result? Your feedback helps other renters.",
      cta: "Leave a review",
      takes: "Takes only 60 seconds",
      stars: "⭐⭐⭐⭐⭐",
      skip: "No result? No problem — feel free to ignore this.",
      footer: "You're receiving this because you used Hektagon.",
      unsubscribe: "Unsubscribe",
    },
    pl: {
      greeting: "Cześć,",
      p1: "Około 3 miesiące temu sprawdziłeś rachunek za media za pomocą Hektagon.",
      p1b: savings > 0
        ? `Mamy nadzieję, że udało Ci się odzyskać <strong>€${savings}</strong> od ${landlord}.`
        : "Mamy nadzieję, że uzyskałeś jasność co do swojego rachunku.",
      p2: "Chcielibyśmy wiedzieć — jaki był Twój wynik? Twoja opinia pomaga innym.",
      cta: "Zostaw opinię",
      takes: "Zajmuje tylko 60 sekund",
      stars: "⭐⭐⭐⭐⭐",
      skip: "Brak wyniku? Nie ma problemu — możesz zignorować tę wiadomość.",
      footer: "Otrzymujesz tę wiadomość, ponieważ korzystałeś z Hektagon.",
      unsubscribe: "Wypisz się",
    },
    ru: {
      greeting: "Привет,",
      p1: "Около 3 месяцев назад вы проверили счёт за коммунальные услуги с помощью Hektagon.",
      p1b: savings > 0
        ? `Надеемся, вам удалось вернуть <strong>€${savings}</strong> от ${landlord}.`
        : "Надеемся, вы получили ясность насчёт вашего счёта.",
      p2: "Каков ваш результат? Ваш отзыв помогает другим арендаторам.",
      cta: "Оставить отзыв",
      takes: "Займёт всего 60 секунд",
      stars: "⭐⭐⭐⭐⭐",
      skip: "Нет результата? Не беспокойтесь — просто проигнорируйте.",
      footer: "Вы получаете это письмо, потому что использовали Hektagon.",
      unsubscribe: "Отписаться",
    },
  };

  const c = copy[lang] || copy.de;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subjects[lang]}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a14;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- LOGO -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <div style="display:inline-flex;align-items:center;gap:10px;">
            <div style="width:36px;height:36px;background:#30d780;border-radius:9px;display:inline-block;text-align:center;line-height:36px;font-weight:800;font-size:16px;color:#000;">H</div>
            <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Hektagon</span>
          </div>
        </td></tr>

        <!-- CARD -->
        <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:40px 36px;">

          <p style="font-size:15px;color:rgba(255,255,255,0.6);margin:0 0 8px;">${c.greeting}</p>
          <p style="font-size:15px;color:rgba(255,255,255,0.6);margin:0 0 8px;">${c.p1}</p>
          <p style="font-size:15px;color:rgba(255,255,255,0.6);margin:0 0 28px;">${c.p1b}</p>

          <!-- SAVINGS HIGHLIGHT (wenn > 0) -->
          ${savings > 0 ? `
          <div style="background:rgba(48,215,128,0.08);border:1px solid rgba(48,215,128,0.2);border-radius:12px;padding:16px 20px;margin-bottom:28px;text-align:center;">
            <div style="font-size:32px;font-weight:800;color:#30d780;letter-spacing:-1px;">€${savings}</div>
            <div style="font-size:13px;color:rgba(48,215,128,0.7);margin-top:4px;">Einsparpotenzial gefunden</div>
          </div>` : ""}

          <p style="font-size:15px;color:rgba(255,255,255,0.6);margin:0 0 28px;">${c.p2}</p>

          <!-- STAR PREVIEW -->
          <div style="text-align:center;font-size:28px;margin-bottom:24px;letter-spacing:4px;">${c.stars}</div>

          <!-- CTA BUTTON -->
          <div style="text-align:center;margin-bottom:12px;">
            <a href="${reviewUrl}" style="display:inline-block;background:#30d780;color:#000000;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;letter-spacing:-0.3px;">
              ${c.cta} →
            </a>
          </div>
          <div style="text-align:center;font-size:12px;color:rgba(255,255,255,0.3);margin-bottom:0;">${c.takes}</div>

        </td></tr>

        <!-- SKIP NOTE -->
        <tr><td style="padding:20px 0;text-align:center;">
          <p style="font-size:12px;color:rgba(255,255,255,0.25);margin:0;">${c.skip}</p>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="border-top:1px solid rgba(255,255,255,0.07);padding-top:20px;text-align:center;">
          <p style="font-size:11px;color:rgba(255,255,255,0.2);margin:0 0 6px;">${c.footer}</p>
          <a href="https://hektagon.de/unsubscribe?uid=${userId}" style="font-size:11px;color:rgba(255,255,255,0.25);text-decoration:underline;">${c.unsubscribe}</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SETUP ANLEITUNG
// ─────────────────────────────────────────────────────────────────────────────
/*
1. SUPABASE — reviews Tabelle anlegen:

   create table reviews (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users,
     stars int check (stars between 1 and 5),
     text text,
     savings numeric default 0,
     country text,
     created_at timestamptz default now()
   );

   alter table reviews enable row level security;
   create policy "Users insert own reviews" on reviews
     for insert with check (auth.uid() = user_id);
   create policy "Reviews are public" on reviews
     for select using (true);

2. RESEND.COM einrichten:
   - resend.com → Account → API Key erstellen
   - Domain verifizieren (hektagon.de → DNS TXT Record)
   - RESEND_API_KEY als Vercel Env Variable setzen
   npm install resend

3. VERCEL CRON einrichten (vercel.json):
   {
     "crons": [{
       "path": "/api/cron/review-followup",
       "schedule": "0 10 * * *"
     }]
   }
   → Läuft täglich um 10:00 UTC

4. ENV VARIABLES in Vercel:
   SUPABASE_URL=...
   SUPABASE_SERVICE_KEY=...   (Settings → API → service_role key)
   RESEND_API_KEY=...
   CRON_SECRET=ein-zufälliger-string

5. TESTIMONIALS in App laden (hektagon.jsx useEffect erweitern):
   const sb = await getSupabase();
   if (sb) {
     const { data } = await sb
       .from("reviews")
       .select("*")
       .order("created_at", { ascending: false })
       .limit(20);
     if (data?.length) setTestimonials(data);
   }
*/
