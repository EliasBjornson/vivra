import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { name, gender, age, email, phone } = req.body || {};

    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ error: "Name is required" });
    }

    const to = "info@vivrahealth.se";

    const subject = `Ny intresseanmälan: ${name}`;
    const text =
      `Ny intresseanmälan\n\n` +
      `Namn: ${name}\n` +
      `Kön: ${gender || "-"}\n` +
      `Ålder: ${age || "-"}\n` +
      `E-post: ${email || "-"}\n` +
      `Telefon: ${phone || "-"}\n`;

    await resend.emails.send({
      from: "Vivra <info@vivrahealth.se>",
      to,
      subject,
      text,
      replyTo: email || undefined,
    });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to send" });
  }
}
