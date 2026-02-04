import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { name, gender, age, email, phone } = req.body || {};

    await resend.emails.send({
      from: "Vivra <info@vivrahealth.se>",
      to: ["info@vivrahealth.se"],
      subject: "Ny intresseanmälan",
      html: `<pre>${JSON.stringify({ name, gender, age, email, phone }, null, 2)}</pre>`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Mail failed" });
  }
}
