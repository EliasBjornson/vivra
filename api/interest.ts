import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

type EmailMessage = { from: string; to: string[]; subject: string; text: string; replyTo: string };
type SendEmail = (message: EmailMessage) => Promise<{ data?: { id: string } | null; error?: unknown }>;

export function createInterestHandler(sendEmail: SendEmail) {
  return async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); }
      catch { return res.status(400).json({ error: "Invalid request" }); }
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({ error: "Invalid request" });
    }
    if (body.website) return res.status(200).json({ ok: true });
    const stringField = (key: string) => typeof body[key] === "string" ? body[key].trim() : "";
    const name = stringField("name");
    const birthDate = stringField("birthDate");
    const email = stringField("email");
    const phone = stringField("phone");
    const parsedDate = new Date(birthDate + "T00:00:00Z");
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(birthDate) &&
      !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === birthDate &&
      birthDate <= new Date().toISOString().slice(0, 10) && birthDate >= "1900-01-01";
    if (!name || name.length > 150 || !validDate ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
        !/^[+\d\s().-]{6,30}$/.test(phone) || body.consent !== true) {
      return res.status(400).json({ error: "Kontrollera dina uppgifter och samtycket." });
    }
    try {
      const result = await sendEmail({
        from: "Vivra <info@vivrahealth.se>",
        to: ["info@vivrahealth.se"],
        replyTo: email,
        subject: "Ny begäran om återuppringning från Vivra",
        text: [
          "Ny begäran om återuppringning från vivrahealth.se", "",
          `Namn: ${name}`, `Födelsedatum: ${birthDate}`,
          `E-post: ${email}`, `Telefon: ${phone}`,
          "Samtycke till kontakt: Ja",
        ].join("\n"),
      });
      if (result.error || !result.data?.id) {
        console.error("Contact email was not accepted by the email provider");
        return res.status(502).json({ error: "Mail failed" });
      }
      return res.status(200).json({ ok: true });
    } catch {
      console.error("Contact email request failed");
      return res.status(500).json({ error: "Mail failed" });
    }
  };
}

export default createInterestHandler(async (message) => {
  if (!process.env.RESEND_API_KEY) throw new Error("Email service is not configured");
  return new Resend(process.env.RESEND_API_KEY).emails.send(message);
});
